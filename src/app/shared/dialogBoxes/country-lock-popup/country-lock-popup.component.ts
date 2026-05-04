import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-country-lock-popup',
  templateUrl: './country-lock-popup.component.html',
  styleUrls: ['./country-lock-popup.component.scss']
})
export class CountryLockPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CountryLockPopupComponent>, private _dd: DataService) { }
  baseJson: any = []
  ngOnInit(): void {
    this.getConfigData()
  }
  close() {
    this.dialogRef.close();

    // this.checked1.emit(true)
  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseJson = dataPopup.PopupList[0]
    
    //   this._dd.popupJson().subscribe((res: any) => {
    //  this.baseJson=res.PopupList[0]
    //   })
  }
}
