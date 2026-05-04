import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { EmailLinkComponent } from '../email-link/email-link.component';

@Component({
  selector: 'app-email-link-send-verification',
  templateUrl: './email-link-send-verification.component.html',
  styleUrls: ['./email-link-send-verification.component.scss']
})
export class EmailLinkSendVerificationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmailLinkComponent>) { }

  ngOnInit(): void {
  }
  onNoClick(): void {

    this.dialogRef.close();
  }
  onClickClose(){
    this.dialogRef.close()
  }
}
