import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DeleteAccountPopupComponent } from '../delete-account-popup/delete-account-popup.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
import { DecryptService } from 'src/app/services/decrypt.service';

@Component({
  selector: 'app-parental-create-pin-check',
  templateUrl: './parental-create-pin-check.component.html',
  styleUrls: ['./parental-create-pin-check.component.scss']
})
export class ParentalCreatePinCheckComponent implements OnInit {
  otpForm!: FormGroup
  visitorId: any;
  msg: boolean | undefined;
  showpassword1 = false;
  basesignin: any = [];
  emailexsist: boolean = false;
  typesLogin: any
  errorMsg: any;
  errorAlertData: any;
  otpSecret: any
  openOtpModal:boolean = false
  constructor(public dialogRef: MatDialogRef<DeleteAccountPopupComponent>, private ds: DataService, private fs: FunctionCallingService, private _FPS: FingerPrintService, private _fb: FormBuilder, private auth: AuthService, private deviceService: DeviceDetectorService, public dialog: MatDialog, private DECS:DecryptService) { }
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  @Output() emailVerifiedParental = new EventEmitter<any>()
  @Input() email: string = "";
  showpass = false;
  ngOnInit(): void {
    this.getConfigData()

    this.otpForm = this._fb.group({
      email: [null]
    });

    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.typesLogin = 'email'

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
  }
  getConfigData() {
    // 
    // const popupdata: any = JSON.parse(localStorage.getItem("allJsonPopupData") || {};
    // console.log(popupdata)
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    console.log(dataPopup.PopupList[0])
    this.basesignin=dataPopup.PopupList[0]
    // this.ds.popupJson().subscribe((res: any) => {
    //   console.log(res);
    //   this.basesignin = res.PopupList[0]
    //   console.log(res.PopupList[0]);
    // })
  }
  close() {
    this.dialogRef.close();
  }
  forgotPassword() {
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: 'forgotPassword',
      disableClose: true,
      width: "450px",
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

  onKeydown(event:any) {
    this.emailexsist = false;
  }

  submitOtplogin() {
    var loginInfo = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
    loginInfo.email = this.otpForm.value.email
    this.loginId.email = this.otpForm.value.email
    this.email = this.otpForm.value.email
    localStorage.setItem('taploginInfo', JSON.stringify(loginInfo));
    let ip: any = localStorage.getItem("ipSaveData")
    if(loginInfo.email.length != 0) {
      const formData = new FormData();
      formData.append('email', loginInfo.email);
      this.auth.OttcheckUserExisted(formData).subscribe((res:any) => {
        console.log(res, "lookup");
        if(res.code == 1) {
          this.emailexsist = true;
        } else {
          if(loginInfo.email.length != 0) {
            
            // localStorage.setItem('ott_otp_userid', this.loginId.id);
            const formData: any = new FormData();
            formData.append("mode", 'verification');
            formData.append("type", 'mail');
            formData.append("value", loginInfo.email);
            formData.append("device", 'web');
            formData.append('payload', this.otpSecret);
            formData.append("c_id", this.loginId.id);
            this.auth.generateOtp(formData).subscribe((res: any) => {
              this.DECS.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DECS.decryptData);
              console.log(decryptData, 'otpppppppppp');
            });
            this.openOtpModal = true
           
          }
        }
      })
    }
  
  }
}
