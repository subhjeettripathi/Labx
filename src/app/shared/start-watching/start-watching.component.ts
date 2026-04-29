import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { map } from "rxjs";
import { DecryptService } from "src/app/services/decrypt.service";
import { CountryLockPopupComponent } from "src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { MatDialog } from "@angular/material/dialog";
import { IResult } from "../models/result.data";
import { StorageService } from "src/app/services/storage.service";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";
@Component({
  selector: "app-start-watching",
  templateUrl: "./start-watching.component.html",
  styleUrls: ["./start-watching.component.scss"],
})
export class StartWatchingComponent implements OnInit {
  show: boolean = true;
  current_offset = 0;
  max_counter = 10;
  windowSize: number = 0;
  contentData: any = [];
  display_offset: number = 0;
  totalItems: any;
  countryAllowed: any = [];
  timeZoneOffset: any;
  UserInfo: any;
  woohoo:any;
  defaultImages:any=[];
  activeData:any;
  mainData:any=[];
  constructor(
    private location: Location,
    private DEC_SER: DecryptService,
    private dialog: MatDialog,
    private ed: ExchangeDataService,
    private router: Router,
    private ds: DataService,
    private _storage: StorageService,
    private analyticsService:AnalyticsService
  ) {}

  ngOnInit(): void {
  
    this.defaultImages=localStorage.getItem("defaultImages")
    this.getsubsdetail()
    // this.woohoo=localStorage.getItem('woohoo')
    // if(this.woohoo==1){
    //   this.show = false;
    // }else{
    //   this.show = true;
    // }
    // this.recommendedData();
  }
  getsubsdetail(){
    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    this.ds.getUserSubscription(JSON.parse(userInfo).id).subscribe(res => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
     console.log(data);
     
      console.log((data));
      if (data.is_subscriber == 1) {
        localStorage.setItem("showButton", "0");
        this.ed.showButton.next(false);
        this.ed.isSubscribe.next(true);
        const exp_date = new Date(data['packages_list'][0]['subscription_end']).getTime();
        localStorage.setItem('is_subscriber', '1')
        this.ed.parentalLock.next(false)
        this.activeData = data.packages_list
        console.log(this.activeData);
        this.activeData.filter((res:any)=>{   
          if(res.package_mode == 'OTT' && res.status=='2'){       
            this.mainData.push(res)
            console.log(this.mainData);
            
          }
        })
      } else if (data.is_subscriber == 0) {
        localStorage.setItem('is_subscriber', '0')
        this.ed.parentalLock.next(true)
      }
      this._storage.setData('ott_subscriptionPlan', data);
    })
  }
  goBack() {
    localStorage.removeItem('woohoo')
   const red = localStorage.getItem('redirect')
   this.router.navigate(["/" + red]);
  }
  goBack2() {
    localStorage.removeItem('woohoo')
    this.router.navigate(["/"]);
  }

 
  navigate(event: any) {
    const eventParams = {
      item_id: event.id,
      item_name: event.title,
      item_type: event.content_type,
      item_value: event.access_type,
      page_name: 'start_watching',
      season_id: event.season_id,
      series_id: event.series_id
    };
    this.analyticsService.logEvent('select_item', eventParams);
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    if (event.content_publish && event.content_publish.length) {
      for (let i in event.content_publish) {
        this.countryAllowed.push(event.content_publish[i].country_code);
        console.log(this.countryAllowed);
      }
      var a = this.countryAllowed.indexOf(detail.countryCode);

      if (a == -1 && event.content_publish[0].country_code!='A') {
        const dialogRef = this.dialog.open(CountryLockPopupComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
        });
      } else {
        this.router.navigate(["/" + event.permalink]);
        localStorage.setItem('prevUrl',this.router.url)
      }
    } else {
      this.router.navigate(["/" + event.permalink]);
      localStorage.setItem('prevUrl',this.router.url)
    }
  }
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).vertical.path
  }
}
