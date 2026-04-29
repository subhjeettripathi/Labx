import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { CreateNewPasswordDialogComponent } from '../create-new-password-dialog/create-new-password-dialog.component';

@Component({
  selector: 'app-email-verified-dialog',
  templateUrl: './email-verified-dialog.component.html',
  styleUrls: ['./email-verified-dialog.component.scss']
})
export class EmailVerifiedDialogComponent implements OnInit {
  userId:any;
  baseLine:any=[]
  constructor(public dialogRef: MatDialogRef<EmailVerifiedDialogComponent>,private ds:DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,private _fb: FormBuilder,private auth: AuthService,private DEC_SER: DecryptService,private _FPS: FingerPrintService,public dialog: MatDialog,) {}


  ngOnInit(): void {
    this.userId=this.data.data
    this.getConfigData()
  }
  onNoClick(): void {

    this.dialogRef.close();
  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseLine=dataPopup.PopupList[0]
    console.log(dataPopup.PopupList[0])

    // this.ds.popupJson().subscribe((res: any) => {
    //  console.log(res.PopupList[0]);
    //  this.baseLine=res.PopupList[0]
    // })
  }
  gotoCreatePassword(){
    this.dialogRef.close();
    const dialogRef = this.dialog.open(CreateNewPasswordDialogComponent, {
      backdropClass:'popupBackdropClass',
      panelClass: 'logindialog',
      width: "450px",
      disableClose: true,
      // height:"524px",
      data: {data:this.userId },
    });
   
    dialogRef.afterClosed().subscribe((result) => {
  
    });
  }
}
