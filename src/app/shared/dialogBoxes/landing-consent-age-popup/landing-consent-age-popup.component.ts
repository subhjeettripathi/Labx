import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-landing-consent-age-popup',
  templateUrl: './landing-consent-age-popup.component.html',
  styleUrls: ['./landing-consent-age-popup.component.scss']
})
export class LandingConsentAgePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LandingConsentAgePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,private ds:DataService) { }

  ngOnInit(): void {
    console.log(this.data.message);
  }

  close() {

    this.dialogRef.close();
  }
  deleteAccount(){
 
}
}
