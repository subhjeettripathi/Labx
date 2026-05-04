import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import Swal from 'sweetalert2';
import { PasswordCreateSuccessDialogComponent } from '../password-create-success-dialog/password-create-success-dialog.component';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
declare var $: any;
@Component({
  selector: 'app-create-new-password-dialog',
  templateUrl: './create-new-password-dialog.component.html',
  styleUrls: ['./create-new-password-dialog.component.scss']
})
export class CreateNewPasswordDialogComponent implements OnInit {
  emailLoginForm!: FormGroup;
  userId: any;
  error: any
  showpassword = false;
  showpassword1 = false;
  strongPassword = false;
  submitted = false;
  errorMsg: any;
  errorAlertData: any;
  invalidCode: boolean = false;
  password_policy: any
  loading = false;
  constructor(public dialogRef: MatDialogRef<CreateNewPasswordDialogComponent>, private ds: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private auth: AuthService, private DEC_SER: DecryptService, private _FPS: FingerPrintService, public dialog: MatDialog, private fcs: FunctionCallingService, private ed: ExchangeDataService) { }
  baseJson: any = []
  ngOnInit(): void {
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.getdeviceInfo();
    this.userId = this.data.data

    this.emailLoginForm = this._fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],


    });
    this.getMainJSON();
    this.getJsonPopup()
  }
  getJsonPopup() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.data = dataPopup.PopupList[0].language.languages
    this.baseJson = dataPopup.PopupList[0]

    // this.ds.popupJson().subscribe((res: any) => {
    //   this.data =res.PopupList[0].language.languages
    //   this.baseJson=res.PopupList[0]
    //    })
  }

  getMainJSON() {
    this.ds.faqData().subscribe((res: any) => {
      this.password_policy = res.Others.password_policy


    })
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

      this.DEC_SER.getDecryptedData(res.result);
      let DeviceInfo = JSON.parse(this.DEC_SER.decryptData);


    })

  }
  changeValue(event: any) {
    if (event.target.value.length <= 8) {
      $('input').css("color", "grey")
      this.invalidCode = false;
    } else {

    }
  }
  gotoSuccessPassword() {
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem('videoCarousel', '1');

    }, 200);
    this.dialogRef.close();
    const dialogRef = this.dialog.open(PasswordCreateSuccessDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'passwordCreateSuccessDialog',
      width: "390px",

      data: { data: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem('VideoAutoPlay') == '0') {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem('videoCarousel', '0');
    });
  }

  onSubmitEmailLogin() {
console.log("aaaaaaa");
  if (this.loading) return;
    this.submitted = true;
    if (this.emailLoginForm.value.password == this.emailLoginForm.value.confirm_password) {
      console.log("bbbb");
      if (this.emailLoginForm.valid) {
        console.log("ccccc");
        this.loading = true;
        const formData: any = new FormData();
        var user_id: any = localStorage.getItem('isUserId');
        formData.append('newpassword', this.emailLoginForm.value.password);
        // formData.append('confirm_password', this.emailLoginForm.value.confirm_password);
        formData.append('uid', user_id);
        formData.append('device', 'web');

        this.auth.resetPassword(formData).subscribe((res: any) => {
this.loading = false;
          if (res.code == 1) {
            this.gotoSuccessPassword();
            // this.getSwalmsg('Password change successfully', 'success');
            this.fcs.submitButtonHideForgot.next(false)
            this.dialogRef.close();
          }
          else {
            this.getSwalmsg('Oops! Password not change', 'error');
          }
        })
      }

    } else {
      this.invalidCode = true;
      $('input').css("color", "red")

    }
// this.dialog.closeAll()
  }
}
