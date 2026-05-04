import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
@Component({
  selector: 'app-clear-watching-consent',
  templateUrl: './clear-watching-consent.component.html',
  styleUrls: ['./clear-watching-consent.component.scss']
})
export class ClearWatchingConsentComponent implements OnInit {

  @Output() sendValueToSetting = new EventEmitter<boolean>()
  constructor(public dialogRef: MatDialogRef<ClearWatchingConsentComponent>,private ds:DataService,private swal:SwalMsgService) { }

  basesignin:any = []
  // popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    // this.basesignin=this.popupJson.PopupList[0]
    this.getConfigData()
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin=dataPopup.PopupList[0]
  
    // this.ds.popupJson().subscribe((res: any) => {
  
    //  this.basesignin=res.PopupList[0]
    // })
  }
  clearWatch() {
    this.sendValueToSetting.emit(true)
    this.dialogRef.close()
  }
}
