import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { LoginModalDialogComponent } from '../login-modal-dialog/login-modal-dialog.component';


@Component({
  selector: 'app-adult-age-popup',
  templateUrl: './adult-age-popup.component.html',
  styleUrls: ['./adult-age-popup.component.scss']
})

export class AdultAgePopupComponent implements OnInit {
  val: boolean | undefined;
  visitorId: any=localStorage.getItem('device_id')
  @Output() sen =new EventEmitter<any>()

  deviceId: any;
  popupAlertData:any
  constructor(public dialogRef: MatDialogRef<AdultAgePopupComponent>,private ds:DataService, @Inject(MAT_DIALOG_DATA) public data:any,private dialog:MatDialog, private _FPS: FingerPrintService) {
  
   }
  baseLine:any=[]
  ngOnInit(): void {
    // this.getConfigData()
    this.deviceId=this.visitorId;
    this.popupAlertData=localStorage.getItem('popUpForm')
    this.baseLine=JSON.parse(this.popupAlertData)
  }
  // getConfigData() {
  //   this.ds.popupJson().subscribe((res: any) => {
  //    this.baseLine=res.PopupList[0]
  //   })
  // }
  close() {
    this.dialogRef.close();
  }
  yesOver18(){
    localStorage.setItem("isOverAge","1")
    this.sen.emit(true)
    this.dialogRef.close()
  }
  openSigninPopup(){
    this.dialogRef.close()
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'logindialog',
      width: "390px",
      data: { name: "login" },
    });
  }
}
