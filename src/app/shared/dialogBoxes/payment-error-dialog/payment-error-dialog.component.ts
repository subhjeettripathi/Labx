import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
@Component({
  selector: 'app-payment-error-dialog',
  templateUrl: './payment-error-dialog.component.html',
  styleUrls: ['./payment-error-dialog.component.scss']
})
export class PaymentErrorDialogComponent implements OnInit {
  wrongOtp: any;
  payment: any;
  popupJson: any;
  constructor(public dialogRef: MatDialogRef<PaymentErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private ds: DataService, public dialog: MatDialog) {
    window.scroll(0, 1)

this.dialog.closeAll()

    this.popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
    this.payment = this.popupJson.PopupList[0]
    console.log(this.payment);
  }
  ngOnInit(): void {

  }
  close() {
    this.dialogRef.close();

  }
}
