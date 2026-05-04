import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-payment-error-dialog',
  templateUrl: './payment-error-dialog.component.html',
  styleUrls: ['./payment-error-dialog.component.scss']
})
export class PaymentErrorDialogComponent implements  OnInit{
  wrongOtp: any;
  USER_ACCOUNT_id:any
  constructor(public dialogRef: MatDialogRef<PaymentErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
   
    if(this.data.paytmDetails =="Your payment has been cancelled. Try again or complete the payment later."){
    }
  this.wrongOtp=this.data.paytmDetails
 
}
  close() {
    this.dialogRef.close();
    
  }

}
