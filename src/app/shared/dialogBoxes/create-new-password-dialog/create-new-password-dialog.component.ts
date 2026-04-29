import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import Swal from 'sweetalert2';
import { PasswordCreateSuccessDialogComponent } from '../password-create-success-dialog/password-create-success-dialog.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
declare var $: any;
@Component({
  selector: 'app-create-new-password-dialog',
  templateUrl: './create-new-password-dialog.component.html',
  styleUrls: ['./create-new-password-dialog.component.scss']
})
export class CreateNewPasswordDialogComponent implements OnInit {
  emailLoginForm!: FormGroup;
  visitorId: any;
  userId: any;
  error: any
  showpassword = false;
  showpassword1 = false;
  strongPassword = false;
  submitted = false;
  @ViewChild('input') inputEl!: ElementRef;
  errorMsg: any;
  errorAlertData: any;
  userIdPassword: any
  idUser: any
  invalidCode: boolean = false;
  msgErrorADD: boolean = false
  msgError: any
  password_policy: any
  @ViewChild('emailLoginForm') emailLoginFormDir!: NgForm;
  constructor(public dialogRef: MatDialogRef<CreateNewPasswordDialogComponent>, private ds: DataService,private analyticsService:AnalyticsService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private auth: AuthService, private DEC_SER: DecryptService, private _FPS: FingerPrintService, public dialog: MatDialog, private fcs: FunctionCallingService) { }
  baseJson: any = []
  ngOnInit(): void {
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData);
    console.log(this.errorMsg,"bbbbbbbb");
    this.getdeviceInfo();
    console.log(this.data)
    this.userId = this.data.data
    this.userIdPassword = this.data.name
    this.idUser = this.data.data

    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.emailLoginForm = this._fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      old_pwd: ['', this.getMobileValidators()],

    });
    this.getMainJSON();
    this.getJsonPopup()
    const eventParams = {};
    this.analyticsService.logEvent('change_pwd_interaction', eventParams);
  }
  ngAfterViewInit() {
    this.inputEl.nativeElement.focus();
  }
  getMobileValidators() {
    if (this.userIdPassword == 'changePassword') {
      return Validators.compose([Validators.required])
    }
    else {
      return null
    }
  }
  getJsonPopup() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.data = dataPopup.PopupList[0].language.languages
    this.baseJson = dataPopup.PopupList[0]
    console.log(dataPopup.PopupList[0])
    // this.ds.popupJson().subscribe((res: any) => {
    //   this.data =res.PopupList[0].language.languages
    //   this.baseJson=res.PopupList[0]
    //    })
  }

  getMainJSON() {
    var res: any = localStorage.getItem('faqData')
    res = JSON.parse(res)
    // this.ds.faqData().subscribe((res: any) => {
    this.password_policy = res.Others.password_policy
    console.log(this.password_policy.rule);

    //  })
  }

  onNoClick(): void {

    this.dialogRef.close();
  }
  showPassword(input: any) {
    this.showpassword = !this.showpassword;
    input.type = this.showpassword ? 'text' : 'password';

  }
  showPassword1(input1: any) {
    this.showpassword1 = !this.showpassword1;
    input1.type = this.showpassword1 ? 'text' : 'password';
  }

  get f() {
    return this.emailLoginForm.controls;
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }

  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
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
  getdeviceInfo() {
    this.auth.deviceInfoGet(this.userId).subscribe((res: any) => {
      console.log(res.result)
      this.DEC_SER.getDecryptedData(res.result);
      let DeviceInfo = JSON.parse(this.DEC_SER.decryptData);
      console.log(DeviceInfo);

    })

  }
  changeValue(event: any) {
    if (event.target.value.length <= 8) {
      $('input').css("color", "grey")
      this.invalidCode = false;
    } else {

    }
    if (event !== '') {
      this.msgErrorADD = false
    }
  }
  gotoSuccessPassword() {
    const eventParams = {};
    this.analyticsService.logEvent('pwd_change', eventParams);
    this.dialogRef.close();
    const dialogRef = this.dialog.open(PasswordCreateSuccessDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'passwordCreateSuccessDialog',
      width: "390px",

      data: { data: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  // if (this.userIdPassword == 'changePassword') {
  //   localStorage.setItem("loginShow", "1")
  //   formData.append('uid', this.idUser);
  // } else {
  //   formData.append('uid', this.userId.user_id);
  // }
  onSubmitEmailLogin() {
    console.log(this.idUser)
    this.submitted = true;
    if (this.emailLoginForm.value.password == this.emailLoginForm.value.confirm_password) {
      if (this.emailLoginForm.valid) {
        const formData: any = new FormData();
        if (this.userIdPassword == 'changePassword') {
          localStorage.setItem("loginShow", "1")
          formData.append('id', this.idUser);
          formData.append('old_password', this.emailLoginForm.value.old_pwd);
          formData.append('new_password', this.emailLoginForm.value.password);
          this.auth.changePassword(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.gotoSuccessPassword();
              this.fcs.submitButtonHideForgot.next(false)
              this.dialogRef.close();
            }
            else {
              this.msgError = res.error
              this.msgErrorADD = true
            }
          })
        } else {
          formData.append('newpassword', this.emailLoginForm.value.password);
          formData.append('confirm_password', this.emailLoginForm.value.confirm_password);
          formData.append('uid', this.userId.user_id);
          formData.append('device_unique_id', this.visitorId);
          this.auth.resetPassword(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.gotoSuccessPassword();
              this.fcs.submitButtonHideForgot.next(false)
              this.dialogRef.close();
            }
            else {
              this.getSwalmsg('Oops! Password not change', 'error');
            }
          })
        }



      } else {
        this.msgError = "all_fields_are_mandatory"
        this.msgErrorADD = true
      }

    } else {
      this.invalidCode = true;
      $('input').css("color", "red")

    }

  }
}
