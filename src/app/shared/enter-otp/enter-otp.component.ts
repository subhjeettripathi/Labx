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
  otpInput: any;
  global: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpValidation: any;
  country = []
  otpExceeded = false;
  otpTime: any
  otpSecret: string;
  constructor(private _SWAL: SwalMsgService
    , public dialogRef: MatDialogRef<EnterOtpComponent>, private _DS: DataService, private dialog: MatDialog, public es: ExchangeDataService, private ds: DataService, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)

    this.otpTime = Number(this.errorMsg.otpExpiryTime) / 60

    function makeid(length: any) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }



    var gettoken = btoa(this.errorMsg.otpExpiryTime);

    this.otpSecret = makeid(4) + gettoken


  }




  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: '',
    inputStyles: {
      'width': '70px',
      'color': 'white',
      'background-color': 'transparent',
      'border-top': 'none',
      'border-left': 'none',
      'border-right': 'none',
      'border-bottom': '2px solid #AAAAAA',
      'outline': 'none',
      'border-radius': '0px'
    },
  };
  ngOnInit(): void {
    this.timer(this.otpTime);
    this.otpInput = new FormControl(null, Validators.compose([Validators.required, Validators.minLength(4)]));
    this.ottId = localStorage.getItem("otpForgotId")
    this.basesignin = this.popupJson.PopupList[0]

    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.getCountryName()

    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
  }
    ngAfterViewInit() {
   
  const otpInputs = document.querySelectorAll('ng-otp-input input');
  otpInputs.forEach((input: any) => {
    // input.setAttribute('type', 'text');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]*');
    input.setAttribute('autocomplete', 'one-time-code');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
  });
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
  isSubmitting = false;

  onVerifyOtp() {
    if (this.otpInput.valid && !this.isSubmitting) {
      this.isSubmitting = true; // disable further clicks
  
      const formData: any = new FormData();
      var user_id: any = localStorage.getItem('taploginInfo');
      formData.append('user_id', JSON.parse(user_id).id);
      formData.append('otp', this.otpInput.value);
      formData.append('device', "web");
      formData.append('type', "mail");
  
      this.ds.verifyOtp(formData).subscribe({
        next: (res: any) => {
          if (res.code == 1) {
            var mailVerify = this.loginId;
            mailVerify.is_mail_verify = "1";
            localStorage.setItem('taploginInfo', JSON.stringify(mailVerify));
            this.tick.emit(true);
  
            const dialogRef = this.dialog.open(EmailVerifiedComponent, {
              panelClass: 'deleteSuccessfull',
              width: "390px",
              backdropClass: 'backdropBackground'
            });
            this.dialogRef.close();
          } else {
            this.verifyOtp = false;
          }
        },
        error: () => {
          this.verifyOtp = false;
        },
        complete: () => {
          this.isSubmitting = false; // re-enable button after request finishes
        }
      });
    } else {
      this.otpInputInvalid = true;
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

      this.global = res.global_setting;


      if (this.global.is_custom == 1) {

        this.otpValidation = this.global;
      } else {

        this.ipCountryName = localStorage.getItem('ipSaveData');
        this.ipCountry = JSON.parse(this.ipCountryName).countryName


        this.countryData = this.country.find((x: { name: any; }) => x.name === this.ipCountry);

        this.otpValidation = this.countryData;

      }
    })
  }


  resendOtp() {
    // var phoneNumber=this.valueMobile
    this._DS.profileSmsPolicy(this.data.email).subscribe((res: any) => {


      this.totalOtpCount = res.result

      if (this.otpValidation.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour && this.otpValidation.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours) {

        this.timerHide = true;
        this.timer(this.otpTime);
        this.clicked = true;
        const formData: any = new FormData();
        var user_id :any = localStorage.getItem('taploginInfo');
        formData.append('user_id', JSON.parse(user_id).id);
        formData.append('value', this.data.email);
        formData.append('type', 'mail');
        formData.append('device', 'web');
        formData.append('mode', 'vive');
        formData.append('mode_type', 'verify');
        formData.append('payload', this.otpSecret);
        

        this.ds.forgotOtp(formData).subscribe((res: any) => {

          if (res.code == 1) {
            // this.timerHide = true
            // this.timer(1)
            // this.clicked = true;
          }

        })
        // this.resendOtpToLogin.emit("resend");
      } else {

        this.clicked = true;
        this.otpExceeded = true;
      }
    });


    // const formData: any = new FormData();

    // formData.append('email', this.data.email);
    // formData.append('type', 'mail');
    // formData.append('device', 'web');

    // this.ds.forgotOtp(formData).subscribe((res: any) => {

    //   if (res.code == 1) {
    //     this.timerHide = true
    //     this.timer(2)
    //     this.clicked = true;
    //   }

    // })
  }

}
