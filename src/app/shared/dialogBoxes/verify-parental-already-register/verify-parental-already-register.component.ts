import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { DecryptService } from 'src/app/services/decrypt.service';
@Component({
  selector: 'app-verify-parental-already-register',
  templateUrl: './verify-parental-already-register.component.html',
  styleUrls: ['./verify-parental-already-register.component.scss']
})
export class VerifyParentalAlreadyRegisterComponent implements OnInit {
  user_id: any;
  InvalidPin = false
  @Output() case2Parental = new EventEmitter<any>()
  @Output() case2 = new EventEmitter<any>()
  @Output() socialClose = new EventEmitter<any>()
  otpForm!: FormGroup
  restrictionTitle = localStorage.getItem("restriction_title")
  restrictionLevel = localStorage.getItem("restriction_level")
  checkedCase2: any;
  visitorId: any = localStorage.getItem('device_id')
  showpass = false;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  msg: boolean | undefined;
  showpassword1 = false;
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  constructor(public dialogRef: MatDialogRef<VerifyParentalAlreadyRegisterComponent>, private auth: AuthService, private _FPS: FingerPrintService, private deviceService: DeviceDetectorService, private _fb: FormBuilder, private ed: ExchangeDataService, private ds: DataService, public dialog: MatDialog, private DEC_SER: DecryptService) { }

  ngOnInit(): void {
    this.basesignin = this.popupJson.PopupList[0]

    this.otpForm = this._fb.group({
      email: [null]
    });

    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id
  }
  otpInputCurrent = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: '',

    inputStyles: {
      'width': '55px',
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
  close() {
    this.dialogRef.close();

    this.case2.emit(true)
    this.socialClose.emit(true)
  }
  // submit() {
  //   const formData1: any = new FormData();
  //   formData1.append('u_id', this.user_id)
  //   formData1.append('pin', this.otpInputCurrent.value),
  //     this.ds.parentalAuth(formData1).subscribe((res: any) => {
  //       if (res.code == 1) {
  //         const formData1: any = new FormData();
  //   formData1.append('u_id', this.user_id)
  //   formData1.append('pin', this.otpInputCurrent.value),
  //   formData1.append('status', 1)
  //   formData1.append('device', "web")
  //   formData1.append('level', 0);
  //   formData1.append('title', 'enable');

  //     this.ds.parentalControl(formData1).subscribe((data: any) => {
  //       if(res.code==1){
  //       // localStorage.setItem("setCase2Parental",'1')
  //       localStorage.setItem("isParentalSet", "1")
  //       this.case2Parental.emit(true)
  //       this.dialogRef.close()
  //       this.getSwalmsg('Parental Lock Enabled', 'success');
  //       }
  //     })

  //       } else {
  //         this.InvalidPin = true
  //       }
  //     })
  // }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  forgotPassword() {
    // this.dialogRef.close();
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: 'forgotPassword',
      width: "566px",
      height: "524px",
      data: { name: this.loginId.email },
    });
  }
  submitOtplogin() {
    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "v2_1",
      network_type: "others",
      network_provider: "others"
    }
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + '*' + window.innerHeight,
      push_device_token: "others",
      device_type: 'web',
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",
    }

    if (this.otpForm.valid) {
      const formData: any = new FormData();
      formData.append('email', this.loginId.email);
      formData.append('password', this.otpForm.value.email);
      formData.append('device_other_detail', JSON.stringify(device_other_detail));
      formData.append('devicedetail', JSON.stringify(devicedetail));
      formData.append('device', "web");
      this.auth.ottLogin(formData).subscribe((res: any) => {

        if (res.code == 1) {
          const formData1: any = new FormData();
          formData1.append('u_id', this.user_id)
          formData1.append('pin', '0000')
          formData1.append('status', 1)
          formData1.append('device', "web")
          formData1.append('level', 0)
          formData1.append('parental_id', this.loginId.parental_id)
          this.ds.parentalControl(formData1).subscribe((data: any) => {
            if (data.code == 1) {
              var hey = this.loginId
              hey.is_parental = 1
              localStorage.setItem('taploginInfo', JSON.stringify(hey))
              this.case2Parental.emit(true)
              this.dialogRef.close()
              this.getSwalmsg('Parental Lock Enabled', 'success');
            } else {
              var hey = this.loginId
              hey.is_parental = 2
              localStorage.setItem('taploginInfo', JSON.stringify(hey))
            }
          })
        } else {
          this.msg = true
        }

      })
    }
  }
  showPassword1(input1: any) {
    this.showpassword1 = !this.showpassword1;
    input1.type = this.showpassword1 ? 'text' : 'password';
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
  restrict(value: any) {
    //   this.restriction = value;



  }

}
