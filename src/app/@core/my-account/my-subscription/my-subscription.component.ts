import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DecryptService } from 'src/app/services/decrypt.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
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
  rupeeSIgn:boolean=true;
  timeZoneOffset: any;
  constructor(private location: Location, private DEC_SER: DecryptService, private _DS: DataService,   private deviceService: DeviceDetectorService, public router: Router) { 
    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    this.ip=localStorage.getItem('ipSaveData')
   
   if(JSON.parse(this.ip).countryName=='India'){
    this.rupeeSIgn=true
   }else{
    this.rupeeSIgn=false
   }
    
    window.scroll(0, 0);
    this.getActiveSubs();
  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  getActiveSubs() {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    this.USER_ACCOUNT = JSON.parse(taplogininfo);
    console.log(this.USER_ACCOUNT);

    this._DS.getUserSubscriptionDetails(this.USER_ACCOUNT.id).subscribe(res => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      console.log(data);
       this.activeData = data.packages_list
       console.log(this.activeData);
       
      const length = this.activeData.length - 1
      console.log(length);
      this.mainData = this.activeData[length]
      console.log(this.mainData);
    })
  }

  
}

export interface Element {
  order: number;
  position: string;
  payment: string;
  expiry: string;
  purchase: string;
  status: string;
  invoice: string;
}


const ELEMENT_DATA: Element[] =
  [
    { position: 'ALTBalaji Yearly (IN) ₹300', order: 1235365465, payment: 'Wallet', purchase: '12-02-2023 15:13', expiry: '12-02-2023 15:13', status: 'Active', invoice: 'Download' },
    { position: 'ALTBalaji Yearly (IN) ₹300', order: 2238763464, payment: 'Credit Card', purchase: '12-02-2023 15:13', expiry: '12-02-2023 15:13', status: 'Expired', invoice: 'Download' },
  ];

