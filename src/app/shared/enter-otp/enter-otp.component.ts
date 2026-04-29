import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

import { ExchangeDataService } from 'src/app/services/exchange-data.service';

import { StorageService } from 'src/app/services/storage.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import Swal from 'sweetalert2';
import { EmailVerifiedComponent } from '../dialogBoxes/email-verified/email-verified.component';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.scss']
})
export class EnterOtpComponent implements OnInit {
  ottId: any;
  incorrectMsg: string | undefined;
  otpInputInvalid = false
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  display: any;
  verifyOtp: boolean = true;
  @Output() openTap = new EventEmitter<any>()
  @Output() tick = new EventEmitter<any>()
  timerHide = true;
  clicked = true;
  errorMsg: any;
  errorAlertData: any;
  otpInput:any;
  global:any;
  ipCountry:any;
  ipCountryName:any;
  countryData:any;
  totalOtpCount:any;
  otpValidation:any;
  country=[]
  otpExceeded=false;
  constructor(private _SWAL: SwalMsgService
    , public dialogRef: MatDialogRef<EnterOtpComponent>, private _DS: DataService, private dialog: MatDialog, public es: ExchangeDataService, private ds: DataService, @Inject(MAT_DIALOG_DATA) public data: any) { this.timer(1);
     }

 
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: false,
    timer: 1,
    placeholder: '',
    inputStyles: {
      'width': '56px',
      
      'color': 'white',
      'background-color': '#676767',
      'border': 'none',
     'outline': 'none'
    },
  };
  ngOnInit(): void {
    this.otpInput = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4)]));
    this.ottId = localStorage.getItem("otpForgotId")
    this.basesignin = this.popupJson.PopupList[0]
    console.log(this.basesignin);
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.getCountryName()

    this.errorAlertData=localStorage.getItem('errorMsg')
    this.errorMsg=JSON.parse(this.errorAlertData)
  }
  close() {

    this.dialogRef.close()
    this.openTap.emit(true)
  }
  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.clicked = false
        this.timerHide = false
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }
  onOtpChange(otp: any) {
    if (otp.length != 4) {
      this.verifyOtp = true;
      this.otpInput.reset()
      this.otpInputInvalid = false;

    }
  }
  onVerifyOtp() {

    if (this.otpInput.valid) {

      const formData: any = new FormData();
      formData.append('user_id', this.ottId);
      formData.append('otp', this.otpInput.value);
      formData.append('type', 'mail_verify');
      formData.append('device', 'web');
      this.ds.verifyOtp(formData).subscribe((res: any) => {
        console.log(res);
        if (res.code == 1) {
          // localStorage.setItem("emailVerified","1")
          var mailVerify = this.loginId
          mailVerify.is_mail_verify = "1"
          localStorage.setItem('taploginInfo', JSON.stringify(mailVerify))
          this.tick.emit(true)
          // this.getSwalmsg('Your Email ID isVerified Successfully!', 'success');
          const dialogRef = this.dialog.open(EmailVerifiedComponent, {
            panelClass: 'deleteSuccessfull',
            width: "390px",
            backdropClass: 'backdropBackground'
          });
          this.dialogRef.close()
        } else {
          this.verifyOtp = false;

        }
      })

    }
    else {
      this.otpInputInvalid = true
    }
  }
  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: msg
    })
  }
  getCountryName() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.country = res.country
      // console.log(this.country);
      this.global = res.global_setting;
      console.log(this.global);
      
      if(this.global.is_custom==1){
       
        this.otpValidation=this.global;
       }else{
      
        this.ipCountryName=localStorage.getItem('ipSaveData');
        this.ipCountry=JSON.parse(this.ipCountryName).countryName
        console.log(this.ipCountry);
        
        this.countryData= this.country.find((x: { name: any; })=> x.name === this.ipCountry);
        console.log(this.countryData);
        this.otpValidation=this.countryData;
        console.log(this.otpValidation);
       }
    })
  }
  resendOtp() {
    // var phoneNumber=this.valueMobile
    this._DS.profileSmsPolicy(this.data.email).subscribe((res: any) => {
      console.log(res);
      
    this.totalOtpCount=res.result
    console.log(this.totalOtpCount.countOtp1_hour);
    console.log(this.totalOtpCount.countOtp24_hours);
    
    console.log(this.otpValidation.sms_max_hour_limit);
    console.log(this.totalOtpCount.countOtp1_hour);

    console.log(this.otpValidation.sms_max_day_limit);
    console.log(this.totalOtpCount.countOtp24_hours);
    if(this.otpValidation.sms_max_hour_limit>=this.totalOtpCount.countOtp1_hour&&this.otpValidation.sms_max_day_limit>=this.totalOtpCount.countOtp24_hours){
     
      this.timerHide = true;
      this.timer(1);
      this.clicked = true;
      const formData: any = new FormData();

      formData.append('email', this.data.email);
      formData.append('type', 'mail');
      formData.append('device', 'web');
  
      this.ds.forgotOtp(formData).subscribe((res: any) => {
        console.log(res);
        if (res.code == 1) {
          // this.timerHide = true
          // this.timer(1)
          // this.clicked = true;
        }
  
      })
      // this.resendOtpToLogin.emit("resend");
    }else{
     
      this.clicked =true;
     this.otpExceeded=true;
    }
    });

    
    // const formData: any = new FormData();

    // formData.append('email', this.data.email);
    // formData.append('type', 'mail');
    // formData.append('device', 'web');

    // this.ds.forgotOtp(formData).subscribe((res: any) => {
    //   console.log(res);
    //   if (res.code == 1) {
    //     this.timerHide = true
    //     this.timer(2)
    //     this.clicked = true;
    //   }

    // })
  }

}
