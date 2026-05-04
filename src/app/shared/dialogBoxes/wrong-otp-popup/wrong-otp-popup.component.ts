import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-wrong-otp-popup',
  templateUrl: './wrong-otp-popup.component.html',
  styleUrls: ['./wrong-otp-popup.component.scss']
})
export class WrongOtpPopupComponent implements OnInit {
  openMic: any
  showwrongOtp:any;
  popupAlertData:any;
  baseJson:any;
  constructor(public dialogRef: MatDialogRef<WrongOtpPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  wrongOtp: any
  ngOnInit(): void {
    this.popupAlertData=localStorage.getItem('popUpForm')
    this.baseJson=JSON.parse(this.popupAlertData)
    this.openMic = this.data.name;
   
if(this.data.message == 'true'){
  this.showwrongOtp=true
    this.wrongOtp=this.data.mess
   this.openMic=false
}
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }

}
