import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import Swal from 'sweetalert2';
import { OtpResetPasswordComponent } from '../otp-reset-password/otp-reset-password.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {
  emailLoginForm!: FormGroup;
  @Input() emailOption: string = '';
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  sendValueToForgotPassword: any;
  result: any
  emailID: any;
  global: any;
  submitHasExecuted: boolean = true;
  otpValidation: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpExceeded: boolean = true;
  country: any = [];
  clicked = false;
  errorMsg: any;
  errorAlertData: any;
  otpSecret: any;
  constructor(public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>, private analyticsService: AnalyticsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private ds: DataService, private _fb: FormBuilder, private DEC_SER: DecryptService, private auth: AuthService, public dialog: MatDialog,) { }
  baseJson: any = []
  ngOnInit(): void {
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.emailID = this.data.name;
    console.log(this.emailID);
    this.emailLoginForm = this._fb.group({
      email: [this.data.name, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}`)])],

    });
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
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
    this.getJsonPopup();
    this.getCountryConfig();
    this.otpCount()
    const eventParams = {};
    this.analyticsService.logEvent('forgot_pwd_interaction', eventParams);
  }
  getJsonPopup() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    // this.data =dataPopup.PopupList[0].language.languages
    this.baseJson = dataPopup.PopupList[0]
    console.log(dataPopup.PopupList[0])
    // this.ds.popupJson().subscribe((res: any) => {
    //   this.data =res.PopupList[0].language.languages
    //   this.baseJson=res.PopupList[0]
    //   console.log( this.baseJson);

    //    })
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
  otpCount() {

    this.ds.otpCountData(this.emailID).subscribe((res: any) => {
      this.totalOtpCount = res.result
      console.log(this.totalOtpCount);


    });
  }

  onSubmitEmailLogin() {
    if (this.submitHasExecuted) {
      this.submitHasExecuted = false;
      if (this.otpValidation.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour && this.otpValidation.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours) {
        if (this.emailLoginForm.valid) {
          const userUd = localStorage.getItem('user_id')
          const formData: any = new FormData();
          formData.append('value', this.emailLoginForm.value.email);
          formData.append('mode', 'forgot');
          formData.append('type', "mail");
          formData.append('device', "web");
          formData.append('payload', this.otpSecret);
          formData.append("c_id", userUd);
          // this.auth.forgotPassword(formData).subscribe((res: any) => {
          this.auth.generateOtp(formData).subscribe((res: any) => {
            if (res.code == 1) {
              console.log(res.result, "lookup")
              this.result = res.result
              // this.DEC_SER.getDecryptedData(res.result);


              // this.getSwalmsg('Your forgot password request is sent. Please check your email', 'success');
              this.dialogRef.close();
              this.gotoResetPassword();
            }
            else {

            }
          })
        }
      } else {
        this.clicked = true;
        this.otpExceeded = false;
      }
    }

  }
  onNoClick(): void {

    this.dialogRef.close();
  }

  gotoResetPassword() {

    this.dialogRef.close();
    const dialogRef = this.dialog.open(OtpResetPasswordComponent, {

      panelClass: 'otpResetPassword',
      width: "450px",
      disableClose: true,
      data: { data: this.result, email: this.emailID },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }

}
