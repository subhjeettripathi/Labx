import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-subscription-alert',
  templateUrl: './cancel-subscription-alert.component.html',
  styleUrls: ['./cancel-subscription-alert.component.scss']
})
export class CancelSubscriptionAlertComponent implements OnInit {

  baseLine: any;

  constructor(public dialogRef: MatDialogRef<CancelSubscriptionAlertComponent>, ) { }

  ngOnInit(): void {
    this.getConfigData()
  }


  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0].subscription_recancel_alert
   


    // this.ds.popupJson().subscribe((res: any) => {

    //  this.baseLine=res.PopupList[0]
    // })
  }

  close() {

    this.dialogRef.close();
  }

}
