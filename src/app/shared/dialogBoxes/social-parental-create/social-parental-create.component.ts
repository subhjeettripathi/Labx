import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';

import { ParentalPinCreatedSuccesComponent } from '../parental-pin-created-succes/parental-pin-created-succes.component';


@Component({
  selector: 'app-social-parental-create',
  templateUrl: './social-parental-create.component.html',
  styleUrls: ['./social-parental-create.component.scss']
})
export class SocialParentalCreateComponent implements OnInit {
  dialog: any;
  showpass = false;
  msg: any
  showpassword = false;
  showpassword1 = false;
  basesignin: any = []
    visitorId: any=localStorage.getItem('device_id')
  @Output() checked3 = new EventEmitter<any>()
  @Output() socialVerifiedParental = new EventEmitter<any>()
  constructor(public dialogRef: MatDialogRef<SocialParentalCreateComponent>, private ds: DataService, private router: Router, private _fb: FormBuilder, private _FPS: FingerPrintService, private auth: AuthService) { }
  socialForm!: FormGroup
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    this.basesignin=this.popupJson.PopupList[0]
   
    this.socialForm = this._fb.group({
      pass: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm: [null, Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  //   getConfigData() {
  //     this.ds.popupJson().subscribe((res:any)=>{
  
  // this.basesignin=res.PopupList[0]

  //     })}
  close() {
    this.dialogRef.close();
    this.checked3.emit(true)
  }
  submit() {
    this.router.navigate([""]);
  }
  showPassword(input: any) {

    this.showpassword = !this.showpassword;
    input.type = this.showpassword ? 'text' : 'password';

  }
  // showPassword(input: any) {
  //   this.showpass = !this.showpass;
  //   input.type = this.showpass ? 'password' : 'text';

  // }
  // showPassword1(input: any) {
  //   this.showpass = !this.showpass;
  //   input.type = this.showpass ? 'password' : 'text';

  // }
  showPassword1(input1: any) {
    this.showpassword1 = !this.showpassword1;
    input1.type = this.showpassword1 ? 'text' : 'password';
  }
  submitOtplogin() {
    if (this.socialForm.value.pass == this.socialForm.value.confirm) {
      if (this.socialForm.valid) {
        const formData: any = new FormData();
        formData.append('newpassword', this.socialForm.value.pass);
        formData.append('confirm_password', this.socialForm.value.confirm);
        formData.append('uid', this.loginId.id);
        formData.append('device_unique_id', this.visitorId);

        this.auth.resetPassword(formData).subscribe((res: any) => {

          if (res.code == 1) {
            // this.gotoSuccessPassword();
            // this.getSwalmsg('Password change successfully', 'success');
            this.socialVerifiedParental.emit(true)
            this.dialogRef.close();
            const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
              panelClass: 'contactfooter',
              width: "390px",

            });
          }
          else {
            // this.getSwalmsg('Oops! Password not change', 'error');
          }
        })
      }

    } else {

      this.msg = "Password doesn't match"
      // this.invalidCode=true;
      // this.error='Password dosen\'t match'
    }
  }
}
