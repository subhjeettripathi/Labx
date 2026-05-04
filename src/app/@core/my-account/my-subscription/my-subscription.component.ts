import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DecryptService } from 'src/app/services/decrypt.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';
// import * as amplitude from '@amplitude/analytics-browser';

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss']
})
export class MySubscriptionComponent implements OnInit {
  
  activeData: any = []
  mainData: any = []
  USER_ACCOUNT: any
  ip:any;
  app_version:any;
  rupeeSIgn:boolean=true;
  timeZoneOffset: any;
  constructor(private location: Location,private _dd:DataService, private DEC_SER: DecryptService, private _DS: DataService,private deviceService: DeviceDetectorService, public router: Router) { 
    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.getActiveSubs();
    // this._dd.apipip().subscribe((res: any) => {
    //   this.ip=res
    //   this.trackMe()
    //   if(JSON.parse(this.ip).countryName=='India'){
    //    this.rupeeSIgn=true
    //   }else{
    //    this.rupeeSIgn=false
    //   }
       
    // })
    // this.ip=localStorage.getItem('ipSaveData')
    // AF("pba", "event", {
    //   eventType: "EVENT",
    //   eventValue: {
    //     device_make: this.deviceDetection.os,
    //     device_timestamp: this.timeZoneOffset,
    //     page_title: "pack-list",
    //     geo_country: JSON.parse(this.ip).countryName,
    //     geo_city: JSON.parse(this.ip).city,
    //     platform: "web",
    //   },
    //   eventName: "Subscription Page",
    // });
    this.app_version= localStorage.getItem('appVersion')
   
  }

  userInfo:any;
  userDetails:any;


  back() {
    this.router.navigate(['/']);
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  getActiveSubs() {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    this.USER_ACCOUNT = JSON.parse(taplogininfo);
     
     

    this._DS.getUserSubscriptionDetails(this.USER_ACCOUNT.id).subscribe(res => {
      console.log(res,"aaaaaaaaa");
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
       this.activeData = data.packages_list
      const length = this.activeData.length - 1
      this.mainData = this.activeData[length]
      var d:any = new Date(this.mainData.end_date)
      var x:any = new Date()

      var sd:any = new Date(x)
      
      var s = d - sd
    })
  }
}


