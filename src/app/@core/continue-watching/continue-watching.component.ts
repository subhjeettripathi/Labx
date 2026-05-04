import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VideojsDialogComponent } from 'src/app/shared/videojs-dialog/videojs-dialog.component';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { Router } from '@angular/router';
import { ClearWatchingConsentComponent } from 'src/app/shared/dialogBoxes/clear-watching-consent/clear-watching-consent.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';
// import * as amplitude from '@amplitude/analytics-browser';
import { ChechPinParentalComponent } from 'src/app/shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component';
import { IosDecrycptionService } from 'src/app/services/ios-decrycption.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';

declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
@Component({
  selector: 'app-continue-watching',
  templateUrl: './continue-watching.component.html',
  styleUrls: ['./continue-watching.component.scss']
})


export class ContinueWatchingComponent implements OnInit {

  offset = 0;
  data: any
  max_counter = 10;
  dataList: any[] = [];
  windowSize: number = 0;
  cat_cntn: any[] = [];
  calls: any = []
  daa: any = []
  isSubscribed = false;
  getBrowserName:any
  successs:any;
  m3u8Main:any;
  userId:any;
  navbarAd: any = [];
  navvar: any;
  user:any
  clearWatching: any;
  timeZoneOffset:any;
  crownImg:any
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  defaultImages:any=[]
  constructor(private _dd: DataService, private DEC_SER: DecryptService, private location: Location,private deviceService: DeviceDetectorService,private dialog: MatDialog, private ed: ExchangeDataService, private router: Router,private DEC_SCR_IOS:IosDecrycptionService,private swal:SwalMsgService) {
    this.timeZoneOffset = new Date();
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }

  ngOnInit(): void {
    this.defaultImages=localStorage.getItem("defaultImages")
    window.scroll(0, 0);
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }

    this.navbarAd = localStorage.getItem('faqData')
    this.navvar = JSON.parse(this.navbarAd)
    this.windowSize = window.innerWidth;
    this.getContinueWatchingData();
    let ip: any = localStorage.getItem("ipSaveData") || {};
    this.getBrowserName = this.detectBrowserName()
    this.getCrownImg();
   
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  clearContinueWatching() {
    const dialogRef = this.dialog.open(ClearWatchingConsentComponent, {
      panelClass: 'contactfooter',
      width: "390px",
    });
    const sub = dialogRef.componentInstance.sendValueToSetting.subscribe((resp: any) => {
      this.clearWatching = resp
      const taplogininfo: any = localStorage.getItem('taploginInfo');
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      if (this.clearWatching) {
        const formData = new FormData();
        formData.append('c_id', '-1')
        formData.append('u_id', USER_ACCOUNT.id)
        this._dd.clearContinueWatching(formData).subscribe((res: any) => {
          if (res.code == 1) {
            this.dataList=[]
           this.calls=[]
           this.getContinueWatchingData()
           this.swal.getSwalmsg('Removed from Continue Watching', 'success');
          }
        })
      }

    });
  }
  getContinueWatchingData() {
    this._dd.getContinueWatching(this.offset, this.max_counter).subscribe(res => {
      if (res.code === 1) {
        this.DEC_SER.getDecryptedData(res.result);
     

        this.dataList = JSON.parse(this.DEC_SER.decryptData).category;
      
        for (var _i = 0; _i < this.dataList.length; _i++) {
          this.calls.push(this._dd.getContinueWatchingbyId(this.offset, this.max_counter, this.dataList[_i].id));
        }
        forkJoin(this.calls).subscribe(
          data => {
            this.daa = data

            for (var _j = 0; _j < this.daa.length; _j++) {
              this.DEC_SER.getDecryptedData(this.daa[_j].result);
              this.data = JSON.parse(this.DEC_SER.decryptData).content;
              this.dataList[_j].cat_cntn = this.data;
            }
            this.dataList.map((category: any) => {
              category.cat_cntn.forEach((cat: any) => {
                var hms = cat.duration;   // your input string
                var a = hms.split(':'); // split it at the colons
                var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                cat.result = Math.round((cat.play_duration / seconds) * 100)
                cat.sliderImg = "";
                cat.sliderIdentifier = "";
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (thumb.layout == "rectangle_16x9") {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          cat.sliderImg = img.url;
                          cat.sliderIdentifier = img.identifier;
                        } else if (cat.sliderImg == "") {
                          cat.sliderImg = thumb?.image_size[0].url;
                          cat.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
                      });
                    }
                  }
                });
              });
            })
          }
        );

      } else if (res.code === 0) {
        this.daa = []
      }
    });
  }
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path
  }

  // New Code Start
  navigate(event: any, cat: any, aged: any) {
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SELECT_CONTENT', {
        'itemName': event.title,
        'itemType': event.content_type,
        'itemId': event.id
      })

    }

  
      if (event.access_type == "free") {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read.is_parental == 0) {
          this.videoContinue(event);
        } else {
          if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
            // if (Number(parental_read.restriction_level) == -1) {
            //   this.showPin1(event);
            // } else if (Number(parental_read.restriction_level) == 999) {
            //   this.videoContinue(event);
            // } else if (
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(aged) == 999) ||
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(aged) == 16)
            // ) {
            //   this.videoContinue(event);
            // } else if (
            //   Number(parental_read.restriction_level) >= 18 &&
            //   Number(parental_read.restriction_level) < 999
            // ) {
            //   this.showPin1(event);
            // } else if (
            //   Number(parental_read.restriction_level) >= 16 &&
            //   Number(parental_read.restriction_level) < 999 &&
            //   Number(aged) == 999
            // ) {
            //   this.videoContinue(event);
            // } else {
            //   this.showPin1(event);
            // }
            if (Number(parental_read.restriction_level) == -1) {
              
              this.showPin1(event);
          } else if (Number(parental_read.restriction_level)== 999) {
          
            this.videoContinue(event);
          } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(aged) == 999) {
              
                this.videoContinue(event);
              } else if (Number(aged)  >= Number(parental_read.restriction_level) || Number(aged)  == -1) {
           
                this.showPin1(event);
              } else {
              
                this.videoContinue(event);
              }
          }
          } else {
            this.videoContinue(event);
          }
        }

      

      } else if (event.access_type == "paid") {
        if (this.isSubscribed == true) {
          var isSubscriberUser: any = localStorage.getItem("is_subscriber");
          var parental: any = localStorage.getItem("taploginInfo");
          var parental_read = JSON.parse(parental);
          var group_age: any = localStorage.getItem("isParentalRestriction");
          if (parental_read.is_parental == 0) {
            this.videoContinue(event);
          } else {
            if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
              // if (Number(parental_read.restriction_level) == -1) {
              //   this.showPin1(event);
              // } else if (Number(parental_read.restriction_level) == 999) {
              //   this.videoContinue(event);
              // } else if (
              //   (Number(parental_read.restriction_level) >= 18 &&
              //     Number(parental_read.restriction_level) < 999 &&
              //     Number(aged) == 999) ||
              //   (Number(parental_read.restriction_level) >= 18 &&
              //     Number(parental_read.restriction_level) < 999 &&
              //     Number(aged) == 16)
              // ) {
              //   this.videoContinue(event);
              // } else if (
              //   Number(parental_read.restriction_level) >= 18 &&
              //   Number(parental_read.restriction_level) < 999
              // ) {
              //   this.showPin1(event);
              // } else if (
              //   Number(parental_read.restriction_level) >= 16 &&
              //   Number(parental_read.restriction_level) < 999 &&
              //   Number(aged) == 999
              // ) {
              //   this.videoContinue(event);
              // } else {
              //   this.showPin1(event);
              // }
              
              if (Number(parental_read.restriction_level) == -1) {
             
                this.showPin1(event);
            } else if (Number(parental_read.restriction_level)== 999) {
              
              this.videoContinue(event);
            } else if (Number(parental_read.restriction_level) < 999) {
                if (Number(aged) == 999) {
                
                  this.videoContinue(event);
                } else if (Number(aged)  >= Number(parental_read.restriction_level) || Number(aged)  == -1) {
                
                  this.showPin1(event);
                } else {
                
                  this.videoContinue(event);
                }
            }
            } else {
              this.videoContinue(event);
            }
          }

        } else if (this.isSubscribed == false) {
          this.router.navigate(["/subscribe"]);
        }
      }
    
  }

  getm3u8Url(id: any) {
    if(this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
  
      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
        
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
         
            this.m3u8Main = decryptData.url;
          }
        })
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
       
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
           
            this.m3u8Main = decryptData.url;
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
  
      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
      
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
         
            this.m3u8Main = decryptData.url;
          }
        })
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
       
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
         
            this.m3u8Main = decryptData.url;
          }
        })
      }
    }
   
  }


  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  videoContinue(event: any) {
    localStorage.setItem('CreatOrderC_id' , event.id);
    this.getm3u8Url(event.id)
    setTimeout(() => {
      event.url = this.m3u8Main
    }, 600);
    setTimeout(() => {
      if (this.dialog.openDialogs.length == 0) {
        const alertRef = this.dialog.open(VideojsDialogComponent, {
          maxWidth: "100vw",
          panelClass: "videojsplayer",
          maxHeight: "100vh",
          height: "calc(100% - 100px)",
          width: "100%",
          data: { url: event },
        });
        alertRef.afterClosed().subscribe(result => {

        
        });
      };
    }, 1000);
    

  }

  showPin1(event: any) {
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow='auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.videoContinue(event);
      }
    });
  }

 
  backToLocation() {
    this.location.back()
  }

  getCrownImg() {
    this._dd.faqData().subscribe((res: any) => {
      this.crownImg = res.App[0].crown_logo;
    })
  }

  
  userInfo:any;
  userDetails:any;

  
 
}
