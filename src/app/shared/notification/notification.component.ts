import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
declare var $:any
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifyData:any
  constructor(private location: Location,private _DS:DataService) { }

  ngOnInit(): void {
    $('.arrow-bottom').hide()
    this.getConfigData()
  }
  getConfigData() {
    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
  
    
    this.notifyData=dataPopup.Others.empty_notification
    // this._DS.faqData().subscribe((res: any) => {
    //   this.notifyData=res.Others.empty_notification
   
     
    // })
  }
  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    $('.arrow-bottom').show()
   
  }
}
