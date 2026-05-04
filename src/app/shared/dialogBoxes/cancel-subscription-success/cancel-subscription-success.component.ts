import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-subscription-success',
  templateUrl: './cancel-subscription-success.component.html',
  styleUrls: ['./cancel-subscription-success.component.scss']
})
export class CancelSubscriptionSuccessComponent implements OnInit {
  baseLine: any;

  constructor(public dialogRef: MatDialogRef<CancelSubscriptionSuccessComponent>, ) { }

  ngOnInit(): void {
    this.getConfigData()
  }


  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0].subscription_cancel_succcess_alert



    // this.ds.popupJson().subscribe((res: any) => {

    //  this.baseLine=res.PopupList[0]
    // })
  }

  close() {
    this.dialogRef.close();
  }


}
