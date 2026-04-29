import { DataSource } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import Swal from 'sweetalert2';

import { EmailVerifiedDialogComponent } from '../email-verified-dialog/email-verified-dialog.component';
import { WrongOtpPopupComponent } from '../wrong-otp-popup/wrong-otp-popup.component';
import { AnalyticsService } from 'src/app/services/analytics.service';

declare var $: any;
@Component({
  selector: 'app-otp-reset-password',
  templateUrl: './otp-reset-password.component.html',
  styleUrls: ['./otp-reset-password.component.scss']
})
export class OtpResetPasswordComponent implements OnInit {
  showpassword = false;
  showpassword1 = false;
  verifyOtp: boolean = true;
  otpTime:any;
  emailLoginForm!: FormGroup;
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    timer: 1,
    disableAutoFocus: false,

    placeholder: "",

    inputStyles: {
      'width': '62px',
      'height': '65px',
      'margin-right': '20px',
      // 'margin-right': '16px',
      'color': 'white',
      'background-color': 'transparent',
      'border-bottom': '2px solid #939393',
      'border-left': 'none',
      'border-right': 'none',
      'border-top': 'none',
      // 'border': 'none',
      'outline': 'none',
      'border-radius': '0px'

    },
    inputClass: "otp-aol"
  };
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  otpErrorMessage = '';
  clicked = true;
  timerHide = true;
  display: any;
  userId: any;
  visitorId: any;
  succesShow: boolean = true;
  result: any
  userEmail: any;
  show: boolean = false;
  country: any = [];
  errorMsg: any;
  errorAlertData: any;
  global: any;
  otpValidation: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  otpSecret: any
  totalOtpCount: any;
  otpExceeded: boolean = true;
  constructor(public dialogRef: MatDialogRef<OtpResetPasswordComponent>, private ds: DataService,private analyticsService : AnalyticsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private auth: AuthService, private DEC_SER: DecryptService, private _FPS: FingerPrintService, public dialog: MatDialog,) { 
      this.errorAlertData = localStorage.getItem('errorMsg')
      this.errorMsg = JSON.parse(this.errorAlertData)
      this.otpTime=Number(this.errorMsg.otpExpiryTime)/60
    }
  baseLine: any = []
  ngOnInit(): void {
    this.timer(this.otpTime)
    this.getConfigData();
    this.getCountryConfig();
    this.userId = this.data.data
    this.userEmail = this.data.email
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)

    this.emailLoginForm = this._fb.group({

      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
    this.otpCount();

  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0]
    console.log(dataPopup.PopupList[0])
    // this.ds.popupJson().subscribe((res: any) => {
    //  console.log(res.PopupList[0]);
    //  this.baseLine=res.PopupList[0]
    // })
  }

  onNoClick(): void {

    this.dialogRef.close();
  }
  onOtpChange(otp: any) {
    if (otp.length != 4) {
      // $('input').css("border", "1px solid #B9B9B9")
      this.verifyOtp = true;
      this.otpErrorMessage = '';
      this.otpInput.reset()
      this.ngOtpInput = ''
      this.show = false

    }


  }

  resendOtp() {
    this.otpCount();
    if (this.otpValidation.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour && this.otpValidation.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours) {
      this.otpErrorMessage = ''
      this.timerHide = true;
      this.timer(this.otpTime);
      this.clicked = true;
      console.log(this.userEmail);
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
      //  if (this.userEmail!='') {
      // const formData: any = new FormData();
      // formData.append('email', this.userEmail);
      // formData.append('type', 'otp');
      // formData.append('mode', 'forgot');

      const userUd = localStorage.getItem('user_id')
      const formData: any = new FormData();
      formData.append('value', this.userEmail);
      formData.append('mode', 'forgot');
      formData.append('type', "mail");
      formData.append('device', "web");
      formData.append('payload', this.otpSecret);
      formData.append("c_id", userUd);

      this.auth.generateOtp(formData).subscribe((res: any) => {

        if (res.code == 1) {
          const eventParams = {};
          this.analyticsService.logEvent('resend_otp', eventParams);
          this.result = res.result
        } else {
          this.otpErrorMessage = res.result;
        }

      })

      // 


      // if(this.otpValidation.sms_max_hour_limit>=this.totalOtpCount.countOtp1_hour&&this.otpValidation.sms_max_day_limit>=this.totalOtpCount.countOtp24_hours){
      //   if (this.emailLoginForm.valid) {
      //     const userUd=localStorage.getItem('user_id')
      //     const formData: any = new FormData();
      //     formData.append('value', this.emailLoginForm.value.email);
      //     formData.append('mode', 'forgot');
      //     formData.append('type',"mail");
      //     formData.append('device',"web");
      //     formData.append('payload', this.otpSecret);
      //      formData.append("c_id", userUd);
      //     // this.auth.forgotPassword(formData).subscribe((res: any) => {
      //       this.auth.generateOtp(formData).subscribe((res: any) => {
      //       if (res.code == 1) {
      //         console.log(res.result,"lookup")
      //           this.result=res.result
      //         // this.DEC_SER.getDecryptedData(res.result);


      //         // this.getSwalmsg('Your forgot password request is sent. Please check your email', 'success');
      //         this.dialogRef.close();
      //         this.gotoResetPassword();
      //       }
      //       else {

      //       }
      //     })
      //   }}else{
      //     this.clicked =true;
      //     this.otpExceeded=false;
      //   }

      // 
      // }
    } else {
      this.clicked = true;
      this.otpExceeded = false;
    }

  }
  otpCount() {

    this.ds.otpCountData(this.userEmail).subscribe((res: any) => {
      this.totalOtpCount = res.result
      console.log(this.totalOtpCount);


    });
  }
  getCountryConfig() {
    this.ds.getCountryStateList().subscribe((res: any) => {
      this.country = res.country;
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


  onSubmitEmailLogin() {
    if (this.otpInput.valid) {
      const formData = new FormData();
      formData.append('user_id', this.userId.user_id);
      formData.append('otp', this.otpInput.value);
      formData.append('device', 'web');
      formData.append('type', 'mail');
      this.auth.verifyottOtp(formData).subscribe(res => {

        if (res.code === 1) {

          this.succesShow = false;
          this.DEC_SER.getDecryptedData(res.result);
          this.gotoCreatePassword()
        } else {
          console.log(res.error);
          let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
          const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
            panelClass: "adultAgePopup",
            width: "420px",
            backdropClass: "backdropBackground",
            data: { message: 'true', mess: errorKey }
          });
          // this.verifyOtp=false;
          // $('input').css("border", "2px solid #FB0000")
          // this.otpErrorMessage ='Incorrect Code! Please try again';

        }
      })
    }
    else {
      this.show = true;
      // $('input').css("border", "2px solid #FB0000")
    }


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
  gotoCreatePassword() {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(EmailVerifiedDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'emailVarifyDialog',
      width: "390px",

      data: { data: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

}
