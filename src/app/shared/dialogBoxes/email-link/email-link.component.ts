import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { EmailLinkSendVerificationComponent } from '../email-link-send-verification/email-link-send-verification.component';
@Component({
  selector: 'app-email-link',
  templateUrl: './email-link.component.html',
  styleUrls: ['./email-link.component.scss']
})
export class EmailLinkComponent implements OnInit {
  loginForm!: FormGroup;
  invalidMsg: any;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  // emailPattern = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  emailPattern ="^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*"+"@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  show:any=false;
  basesignin:any
  constructor(public dialogRef: MatDialogRef<EmailLinkComponent>, private _fb: FormBuilder, private ds: DataService ,private dialog:MatDialog) { }
  onNoClick(): void {

    this.dialogRef.close();
  }
  ngOnInit(): void {
    
    this.loginForm = this._fb.group({
      email: [null,Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}`)])],
    });
    this.basesignin = this.popupJson.PopupList[0]
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
  data(event:any){
   if(event.target.value==''){
   this.show=false;
    // this.loginForm.value.email=''
    // this.loginForm.reset()
  }
  }
  onSubmit() {
   
  
    if (this.loginForm.valid) {
   
      const formData = new FormData();
      formData.append('email', this.loginForm.value.email);
      formData.append('user_id', this.loginId.id);
     
      
      this.ds.emailLinkProfile(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.dialogRef.close()
          const dialogRef = this.dialog.open(EmailLinkSendVerificationComponent, {
            panelClass: 'deleteSuccessfull',
            width: "390px",
           
          });
        } else {
          
          this.show=true;
          this.invalidMsg =res.error
        }
      })
    }
  }
}
