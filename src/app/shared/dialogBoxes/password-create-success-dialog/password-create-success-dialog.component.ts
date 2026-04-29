import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { LoginModalDialogComponent } from '../login-modal-dialog/login-modal-dialog.component';

@Component({
  selector: 'app-password-create-success-dialog',
  templateUrl: './password-create-success-dialog.component.html',
  styleUrls: ['./password-create-success-dialog.component.scss']
})
export class PasswordCreateSuccessDialogComponent implements OnInit {
  disableForForgot=true
  hideLoginForgot:any
  baseJson:any=[];
  constructor(public dialogRef: MatDialogRef<PasswordCreateSuccessDialogComponent>,private fcs:FunctionCallingService,
    @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,private ds:DataService) { 
      this.fcs.submitButtonHideForgot.subscribe(value => {
        this.disableForForgot = value;
      });
  
    }
 
  ngOnInit(): void {
    var showLogin=localStorage.getItem("loginShow")
    if(showLogin == '1'){
      this.hideLoginForgot=false
    }else if(showLogin == '0'){
      this.hideLoginForgot=true
    }

    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseJson=dataPopup.PopupList[0].create_password_success
    this.data = dataPopup.PopupList[0].language.languages
    console.log(dataPopup.PopupList[0])
    //  this.ds.popupJson().subscribe((res:any)=>{
    //   this.data = res.PopupList[0].language.languages
    //   console.log(this.data, 'sdfghjki');

    //   this.baseJson = res.PopupList[0].create_password_success
    //   console.log(this.baseJson)
    //  })

     
  }
  onNoClick(): void {

    this.dialogRef.close();
  }
  gotoLoginPage(){
    this.dialogRef.close();
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      panelClass: 'logindialog',
      width: '390px',
      data: { name: 'login' },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    dialogRef.disableClose = true;
  }
}
