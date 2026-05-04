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
import { log } from "console";
import { FacebookPixelService } from "src/app/services/facebook-pixel.service";
import { FacebookLoggerService } from "src/app/services/facebook-logger.service";

// declare var FB: any
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
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
  woohoo: any;
  defaultImages: any = [];
  activeData: any;
  mainData: any;
  Payment_type: any;
  USER_ACCOUNT_id: any
  user_account: any;
  pkgchecking: any;
  app_version: any;
  element: any;
  currencyValueFacebook: any;
  constructor(
    private location: Location,
    private DEC_SER: DecryptService,
    private dialog: MatDialog,
    private ed: ExchangeDataService,
    private router: Router,
    private ds: DataService,
    private _storage: StorageService,
    private deviceService: DeviceDetectorService,
    private fbPixelService: FacebookPixelService,
    private fbLogger:FacebookLoggerService
  ) { }

  ngOnInit(): void {
     setTimeout(() => {
      window.scroll(0, 0);
    }, 500);
    this.defaultImages = localStorage.getItem("defaultImages")
    this.getsubsdetail()
    this.woohoo = localStorage.getItem('woohoo')
    if (this.woohoo == 1) {
      this.show = false;
    } else {
      this.show = true;
    }
    this.recommendedData();
    if (localStorage.getItem("packcheking") == "1") {
      this.pkgchecking = true;
    } else {
      this.pkgchecking = false;
    }
    this.app_version = localStorage.getItem('appVersion')

    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    this.user_account = JSON.parse(userInfo);
    this.ds.getUserSubscriptionDetails(JSON.parse(userInfo).id).subscribe(res => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      // console.log(data);

      this.activeData = data.packages_list;
      const length = this.activeData.length - 1

      this.mainData = this.activeData[length]
      // console.log(this.mainData,"iutrsartyuiopoi")

      if (this.mainData.discounted_price == 0.00 || this.mainData == ' ') {
        this.currencyValueFacebook = this.mainData.price;
       
      }
  
      if (this.mainData.discounted_price != 0.00 && this.mainData.discounted_price != ' ') {
        this.currencyValueFacebook = this.mainData.discounted_price;
      }
  
      
    })


    var dataFire: any = localStorage.getItem('checkoutData')
    var dataFireGet = JSON.parse(dataFire)
    // console.log(dataFireGet);

    
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('purchase', {
        user_id: JSON.parse(userInfo).id,
        currency: dataFireGet.currency,
        value: this.currencyValueFacebook,
        transaction_id: dataFireGet.trans_id
      });
    }

    const user_id:any = JSON.parse(userInfo).id

    this.fbLogger.logPurchaseEvent(user_id, dataFireGet, this.currencyValueFacebook);
    console.log('Purchase completed:', dataFireGet);

    this.trackPurchase();
    
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  getsubsdetail() {
    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    this.user_account = JSON.parse(userInfo);

    this.ds.getUserSubscriptionDetails(JSON.parse(userInfo).id).subscribe(res => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      // console.log(data);

      this.activeData = data.packages_list;
      const length = this.activeData.length - 1

      this.mainData = this.activeData[length]
      // console.log(this.mainData)

      if (data.is_subscriber == 1) {
        this.ed.isSubscribe.next(true);
        const exp_date = new Date(data['packages_list'][0]['subscription_end']).getTime();

        localStorage.setItem('is_subscriber', '1')
        this.ed.parentalLock.next(false);

      } else if (data.is_subscriber == 0) {
        localStorage.setItem('is_subscriber', '0')
        this.ed.parentalLock.next(true)

      }
      this._storage.setData('ott_subscriptionPlan', data);

      if (this.mainData.autorenew == 0) {
        this.Payment_type = 'One Time'
      } else {
        this.Payment_type = 'Auto Renew'
      }

      var userage: any = new Date();
      var currentage: any = new Date();
      var newage: any = new Date(currentage)
      var age: any = newage - userage;
      let ip: any = localStorage.getItem("ipSaveData");


      var d: any = new Date(this.mainData.end_date)
      var x: any = new Date()

      var sd: any = new Date(x)

      var s = d - sd



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

  recommendedData() {
    let userInfo: any = localStorage.getItem("taploginInfo") || {};
    this.ds
      .getRecommendedList(
        this.current_offset,
        this.max_counter,
        JSON.parse(userInfo).id
      )
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.contentData = decryptData.content;
          this.totalItems = decryptData.totalCount;

          this.display_offset = decryptData.offset;
          this.contentData.map((category: any) => {
            if (category.categories != null) {
              if (this.contentData !== undefined) {
                category.sliderImg = "";
                category.sliderIdentifier = "";
                category.layout = this.contentData.layout;

                if (category.is_group == 1 && category.groupInfo != null) {
                  if (category.groupInfo.global_thumb != null && category.groupInfo.global_thumb.length != 0) {
                    category.groupInfo.global_thumb.forEach((thumb: any) => {
                      if (thumb != null) {
                        if (thumb.layout == "square") {
                          thumb.layout = "circle";
                        }
                        if (thumb.layout == "vertical_9x16" &&
                          thumb.platform == "global") {
                          thumb?.image_size.filter((img: any) => {
                            if (Number(img.width) == 360 || Number(img.width) == 854) {
                              category.sliderImg = img.url;
                              category.sliderIdentifier = img.identifier;
                            } else if (category.sliderImg == "") {
                              category.sliderImg = thumb?.image_size[0].url;
                              category.sliderIdentifier = thumb?.image_size[0].identifier;
                            }
                          });
                        }
                      }
                    });
                  } else if (category.groupInfo.thumbs != null) {
                    category.groupInfo.thumbs.forEach((thumb: any) => {
                      if (thumb != null) {
                        if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
                          thumb?.image_size.filter((img: any) => {
                            if (Number(img.width) == 360 || Number(img.width) == 854) {
                              category.sliderImg = img.url;
                              category.sliderIdentifier = img.identifier;
                            } else if (category.sliderImg == "") {
                              category.sliderImg = thumb?.image_size[0].url;
                              category.sliderIdentifier = thumb?.image_size[0].identifier;
                            }

                          });
                        }


                      }
                    });
                  }



                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == 'vertical_9x16') {
                      thumb?.image_size.filter((img: any) => {

                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          category.sliderImg = img.url;
                          category.sliderIdentifier = img.identifier;
                        } else if (category.sliderImg == "") {
                          category.sliderImg = thumb?.image_size[0].url;
                          category.sliderIdentifier = thumb?.image_size[0].identifier;
                        }

                      });
                    }
                  });

                }

              }
            }
          });
        })
      )
      .subscribe();
  }
  navigate(event: any) {
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    if (event.content_publish && event.content_publish.length) {
      for (let i in event.content_publish) {
        this.countryAllowed.push(event.content_publish[i].country_code);

      }
      var a = this.countryAllowed.indexOf(detail.countryCode);

      if (a == -1 && event.content_publish[0].country_code != 'A') {
        const dialogRef = this.dialog.open(CountryLockPopupComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
        });
      } else {
        this.router.navigate(["/" + event.permalink]);
      }
    } else {
      this.router.navigate(["/" + event.permalink]);
    }
  }
  onImgError(event: any) {


    event.target.src = JSON.parse(this.defaultImages).vertical.path
  }


  trackPurchase() {
    var dataFire: any = localStorage.getItem('checkoutData')
    var dataFireGet = JSON.parse(dataFire)
    const value = this.currencyValueFacebook;
    const currency = dataFireGet.currency;
    this.fbPixelService.trackPurchase(value, currency);
  }

 
}
