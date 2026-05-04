import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss']
})
export class EmailVerifiedComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailVerifiedComponent>) { }
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    this.basesignin=this.popupJson.PopupList[0]
  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
}
