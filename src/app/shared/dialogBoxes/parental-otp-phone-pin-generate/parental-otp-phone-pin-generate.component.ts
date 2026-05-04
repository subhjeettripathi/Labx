import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-parental-otp-phone-pin-generate',
  templateUrl: './parental-otp-phone-pin-generate.component.html',
  styleUrls: ['./parental-otp-phone-pin-generate.component.scss']
})
export class ParentalOtpPhonePinGenerateComponent implements OnInit {
  msg = false
  display: any;
  clicked = true;
  basesignin: any = []
  timerHide = true;
  errorAlertData: any
  errorMsg: any
  otpTime: any
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  otpSecret: string;
  constructor(public dialogRef: MatDialogRef<ParentalOtpPhonePinGenerateComponent>, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private auth: AuthService, private ds: DataService) {
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
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  @Output() checked1 = new EventEmitter<any>()
  @Output() phoneVerifiedParental = new EventEmitter<any>()
  @Output() restrictionLevelSet = new EventEmitter<any>()
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: '',

    inputStyles: {
      'width': '45px',
      'color': 'white',
      'background-color': 'transparent',
      'border-top': 'none',
      'border-left': 'none',
      'border-right': 'none',
      'border-bottom': '2px solid #AAAAAA',
      'outline': 'none',
      'border-radius': '0px'
    },
    inputClass: "dfg"
  };
  ngOnInit(): void {
    this.timer(this.otpTime)
    this.basesignin = this.popupJson.PopupList[0]
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
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  onOtpChange(otp: any) {

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

  submit() {
    if (this.otpInput.valid) {
      const formData = new FormData();
      formData.append('user_id', this.loginId.id);
      formData.append('otp', this.otpInput.value);
      formData.append('type', 'phone');
      formData.append('device', 'web');
      this.auth.verifyottOtp(formData).subscribe((res: any) => {
        if (res.code == 1) {

          this.phoneVerifiedParental.emit(true)
          this.restrictionLevelSet.emit(true)
          // // this.fs.parentalCreateSubmit.next(true)
          this.dialogRef.close()
        } else {

          this.msg = true
        }
      })
    }
  }
  resendOtp() {
    var getPhoneNumber = this.loginId.contact_no
    const formData = new FormData();
    // this.mobileNumberForResend = this.loginForm.value.code + this.loginForm.value.emailphone;
    // formData.append('phone', getPhoneNumber);
    // formData.append('type', 'phone');
    // const devicedetail = {
    //   make_model: this.deviceService.browser,
    //   os: this.deviceDetection.os,
    //   screen_resolution: window.innerWidth + '*' + window.innerHeight,
    //   push_device_token: "others",
    //   device_type: 'web',
    //   platform: this.deviceDetection.deviceType,
    //   device_unique_id: this.visitorId,
    //   onesignal_device_id: "fs95345jfddf",
    // }
    // formData.append('dd', JSON.stringify(devicedetail));
    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    formData.append('user_id', JSON.parse(userInfo).id);
    formData.append('device', 'web');
    formData.append('payload', this.otpSecret);
    formData.append('value', getPhoneNumber);
    formData.append('type', 'phone');
    this.auth.ottotpresend(formData).subscribe(res => {
      if (res.code == 1) {
        this.timerHide = true
        this.timer(this.otpTime)
        this.clicked = true;
        this.getSwalmsg('Otp Resend to registered mobile number', 'success');
      }
    })
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
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
        // this.clicked = false;
        this.timerHide = false;

        clearInterval(timer);
      }
    }, 1000);
  }
}
