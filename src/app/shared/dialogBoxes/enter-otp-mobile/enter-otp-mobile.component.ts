import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import Swal from 'sweetalert2';
import { EmailVerifiedComponent } from '../email-verified/email-verified.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-enter-otp-mobile',
  templateUrl: './enter-otp-mobile.component.html',
  styleUrls: ['./enter-otp-mobile.component.scss']
})
export class EnterOtpMobileComponent implements OnInit {
  @Output() tick = new EventEmitter<any>()
  ottId: any;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  // incorrectMsg: string | undefined;
  incorrectMsg: string="";

  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  timerHide = true;
  clicked = true;
  errorMsg: any;
  errorAlertData: any;
  display: any;
  global: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpValidation: any;
  country = []
  otpExceeded = false;
  otpSecret: any
  constructor(private _SWAL: SwalMsgService, private DEC_SER: DecryptService, private _DS: DataService,private analyticsService:AnalyticsService,
    public dialogRef: MatDialogRef<EnterOtpMobileComponent>, private dialog: MatDialog, private auth: AuthService, public es: ExchangeDataService, private ds: DataService, @Inject(MAT_DIALOG_DATA) public data: any, private fcs: FunctionCallingService) { this.timer(1); }
  userInfo = localStorage.getItem("taploginInfo") || {};
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: false,
    timer: 1,
    placeholder: '',

    inputStyles: {
      'width': '62px',
      'height': '65px',
      'margin-right': '0px',
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
    inputClass: "dfg"
  };
  ngOnInit(): void {

    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.basesignin = this.popupJson.PopupList[0]
    this.getCountryName()
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

  close() {
    this.dialogRef.close()
  }
  timer(minute: any) {
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
    console.log(otp)
  }
  onVerifyOtp() {

    if (this.otpInput.valid) {
      const userInfo: any = localStorage.getItem('taploginInfo') || {};
      const formData = new FormData();
      formData.append('user_id', this.loginId.id);
      formData.append('otp', this.otpInput.value);
      formData.append('device', "web");
      if (JSON.parse(userInfo).email != '') {
        formData.append('type', 'mail');
      }
      else {
        formData.append('type', 'phone');
      }
      if (this.data.data == 'delete') {
        formData.append('flag', "-1");
      } else {
        formData.append('flag', "1");
      }

      this.ds.delete_verify(formData).subscribe((data: any) => {
        console.log(data);
        if (data.code == 1) {
          if (this.data.data == 'delete'){
            const eventParams = {};
            this.analyticsService.logEvent('account_delete_requested', eventParams);
          }else{
            const eventParams = {};
            this.analyticsService.logEvent('account_deactivated', eventParams);
          }
            this._SWAL.getSwalmsg('Successfully Done', 'success');
          this.dialogRef.close()
        } else {

          this.incorrectMsg = data.error
        }
      })
    }
    else {
      this.incorrectMsg = "Please_enter_otp"
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

      if (this.global.is_custom == 1) {

        this.otpValidation = this.global;
      } else {

        this.ipCountryName = localStorage.getItem('ipSaveData');
        this.ipCountry = JSON.parse(this.ipCountryName).countryName
        console.log(this.ipCountry);

        this.countryData = this.country.find((x: { name: any; }) => x.name === this.ipCountry);
        console.log(this.countryData);
        this.otpValidation = this.countryData;
        console.log(this.otpValidation);
      }
    })
  }
  resendOtp() {
    this._DS.otpCountData(this.loginId.email).subscribe((res: any) => {
      console.log(res);

      this.totalOtpCount = res.result
      console.log(this.totalOtpCount.countOtp1_hour);
      console.log(this.totalOtpCount.countOtp24_hours);

      console.log(this.otpValidation.sms_max_hour_limit);
      console.log(this.totalOtpCount.countOtp1_hour);

      console.log(this.otpValidation.sms_max_day_limit);
      console.log(this.totalOtpCount.countOtp24_hours);
      if (this.otpValidation.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour && this.otpValidation.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours) {

        this.timerHide = true;
        this.timer(1);
        this.clicked = true;

        const formData: any = new FormData();
        // formData.append('value', this.data.number);
        // formData.append('type', 'phone');
        // formData.append('user_id', this.loginId.id);
        // formData.append('payload', '1');
        // formData.append('device', 'web');
        // this.ds.resendOtp(formData).subscribe((res: any) => {
        formData.append('value', this.loginId.email);
        // formData.append('type', 'mail');
        formData.append('type', "mail");
        formData.append('device', "web");
        formData.append('payload', this.otpSecret);
        formData.append("c_id", this.loginId.id);
        // this.auth.forgotPassword(formData).subscribe((res: any) => {
        this.auth.generateOtp(formData).subscribe((res: any) => {
          const eventParams = {};
          this.analyticsService.logEvent('resend_otp', eventParams);
          console.log(res);
          if (res.code == 1) {
            this.timerHide = true
            this.timer(1)
            this.clicked = true;
          }

        })

      } else {

        this.clicked = true;
        this.otpExceeded = true;
      }
    });

  }
}
