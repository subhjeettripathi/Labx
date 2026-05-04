import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-geographical-information',
  templateUrl: './geographical-information.component.html',
  styleUrls: ['./geographical-information.component.scss']
})
export class GeographicalInformationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GeographicalInformationComponent>,private ds:DataService) { }
  baseSign:any=[]
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
    this.baseSign=dataPopup.PopupList[0]
  
//     this.ds.popupJson().subscribe((res: any) => {

      
// this.baseSign=res.PopupList[0]
//     })
  }
}
