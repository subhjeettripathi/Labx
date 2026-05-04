import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DeleteAccountPopupComponent } from '../delete-account-popup/delete-account-popup.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-parental-create-pin-check',
  templateUrl: './parental-create-pin-check.component.html',
  styleUrls: ['./parental-create-pin-check.component.scss']
})
export class ParentalCreatePinCheckComponent implements OnInit {
  otpForm!: FormGroup
  msg: boolean | undefined;
  showpassword1 = false;
  basesignin: any = [];
  constructor(public dialogRef: MatDialogRef<DeleteAccountPopupComponent>, private ds: DataService, private fs: FunctionCallingService, private _FPS: FingerPrintService, private _fb: FormBuilder, private auth: AuthService, private deviceService: DeviceDetectorService, public dialog: MatDialog) { }
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  @Output() emailVerifiedParental = new EventEmitter<any>()
  showpass = false;
    visitorId: any=localStorage.getItem('device_id')
  ngOnInit(): void {
    this.getConfigData()

    this.otpForm = this._fb.group({
      email: [null]
    });

  }
  getConfigData() {
   
    // const popupdata: any = JSON.parse(localStorage.getItem("allJsonPopupData") || {};
  
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    
    this.basesignin=dataPopup.PopupList[0]
    // this.ds.popupJson().subscribe((res: any) => {
 
    //   this.basesignin = res.PopupList[0]
   
    // })
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)

  }
  forgotPassword() {
    //  this.dialogRef.close();

    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: 'forgotPassword',
      width: "450px",
      // height: "524px",
      data: { name: this.loginId.email }
    });
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  showPassword1(input1: any) {
    this.showpassword1 = !this.showpassword1;
    input1.type = this.showpassword1 ? 'text' : 'password';
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
      // formData.append('device_other_detail', JSON.stringify(device_other_detail));
      // formData.append('devicedetail', JSON.stringify(devicedetail));
      // formData.append('device', "web");
      this.auth.ottLogin1(formData).subscribe((res: any) => {
      
        if (res.code == 1) {
          this.emailVerifiedParental.emit(true)
          // this.fs.parentalCreateSubmit.next(true)
          this.dialogRef.close()
        }
        else {
          this.msg = true
        }
      })
    }
  }
}
