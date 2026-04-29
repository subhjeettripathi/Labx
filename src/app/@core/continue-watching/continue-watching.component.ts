import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { Location } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VideojsDialogComponent } from 'src/app/shared/videojs-dialog/videojs-dialog.component';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClearWatchingConsentComponent } from 'src/app/shared/dialogBoxes/clear-watching-consent/clear-watching-consent.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IosDecrycptionService } from 'src/app/services/ios-decrycption.service';
import * as firebase from 'firebase/app';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { IResult } from 'src/app/shared/models/result.data';
import { AudioPlayerComponent } from 'src/app/shared/audio-player/audio-player.component';

@Component({
  selector: 'app-continue-watching',
  templateUrl: './continue-watching.component.html',
  styleUrls: ['./continue-watching.component.scss']
})
export class ContinueWatchingComponent implements OnInit {
  offset: number = 0;
  data: any
  max_counter = 10;
  dataList: any[] = [];
  windowSize: number = 0;
  cat_cntn: any[] = [];
  calls: any = []
  daa: any = []
  isSubscribed = false;
  clearWatching: any;
  m3u8Main: any;
  getBrowserName: any
  user: any
  userId: any
  timeZoneOffset: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  defaultImages: any = []
  contentData: any = [];
  totalItems: any;
  display_offset: number = 0;
  searchRes: any = true;
  p: number = 1;
  cat_type: any


  constructor(private _dd: DataService, private analyticsService: AnalyticsService, private DEC_SER: DecryptService, private location: Location, private deviceService: DeviceDetectorService, private dialog: MatDialog, private ed: ExchangeDataService, private router: Router, private DEC_SCR_IOS: IosDecrycptionService, private _ar: ActivatedRoute) {
    this.timeZoneOffset = new Date();
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }

  ngOnInit(): void {
    this.defaultImages = localStorage.getItem("defaultImages")
    window.scroll(0, 0);
    this._ar.queryParamMap.subscribe(params => {
      this.cat_type = params.get('type');
    });
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.getBrowserName = this.detectBrowserName()
    this.windowSize = window.innerWidth;
    this.getContinueWatchingData(this.cat_type);
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  clearContinueWatching() {
    const dialogRef = this.dialog.open(ClearWatchingConsentComponent, {
      panelClass: 'clearWatch',
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
        formData.append('type', this.cat_type)
        this._dd.clearContinueWatching(formData).subscribe((res: any) => {
          if (res.code == 1) {
            this.dataList = []
            this.calls = []
            this.getContinueWatchingData(this.cat_type)
          }
        })
      }

    });
  }
  getContinueWatchingData(type: any) {
    this._dd.getContinueWatching(this.offset, this.max_counter, type).subscribe(res => {
      if (res.code === 1) {
        console.log(this.offset, "kkkkkk");
        console.log(this.max_counter, "lllllllll");
        this.DEC_SER.getDecryptedData(res.result);
        console.log(JSON.parse(this.DEC_SER.decryptData));
        // console.log(JSON.parse(this.DEC_SER.decryptData).totalCount);
        this.totalItems = JSON.parse(this.DEC_SER.decryptData).totalCount;
        console.log(this.totalItems);
        this.dataList = JSON.parse(this.DEC_SER.decryptData).content;
        console.log(this.dataList);
        this.dataList.map((category: any, index: number) => {
          category.index = index;
          var hms = category.duration;   // your input string
          var a = hms.split(':'); // split it at the colons
          var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
          category.result = Math.round((category.play_duration / seconds) * 100)
          category.sliderImg = "";
          category.sliderIdentifier = "";
          category.layout_thumbs.forEach((thumb: any) => {
            if (thumb != null) {
              if (thumb.layout == "rectangle_16x9") {
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

        })

      } else if (res.code === 0) {
        this.daa = []
      }
    });
  }
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path
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

  getm3u8Url(event: any) {
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    const userId = this.user ? this.user.id : "";
    if (this.getBrowserName == 'safari') {
      this._dd.getMainUrl(event.id, userId).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
          const decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

          if (decryptData.fairplay_allow == 1 && decryptData.fairplay_url) {
            event.url = decryptData.fairplay_url;
          } else {
            event.url = decryptData.url;
          }
          this.openVideoDialog(event);
        } else if (res.code == 2 && res.error == "Content not found") {
          this.deleteWatchList(event.id, event.index);
        }
      });
    } else {
      this._dd.getMainUrl(event.id, userId).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res?.result);
          const decryptData = JSON.parse(this.DEC_SER.decryptData);
          event.url = decryptData.url;
          this.openVideoDialog(event);
        } else if (res.code == 2 && res.error == "Content not found") {
          this.deleteWatchList(event.id, event.index);
        }
      });
    }
  }
  deleteWatchList(id: any, index: any) {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    var u_id = JSON.parse(userInfo);
    const formData = new FormData();
    formData.append("c_id", id);
    formData.append("u_id", u_id?.id);
    this._dd.clearContinueWatching(formData).subscribe((res: any) => {
      if (res.code == 1) {
        this.dataList.splice(index, 1);
        this.totalItems = this.totalItems - 1;
        this.dataList.forEach((item: any, i: number) => {
          item.index = i;
        });
      }
    });
  }
  openVideoDialog(event: any) {
    if (this.dialog.openDialogs.length == 0) {
      this.dialog.open(VideojsDialogComponent, {
        maxWidth: "100vw",
        panelClass: 'videojsplayer',
        maxHeight: "100vh",
        height: "calc(100% - 100px)",
        width: "100%",
        data: { url: event },
      });
    }
  }

  openAudioPlayer(event: any) {
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    const userId = this.user ? this.user.id : "";
    if (this.getBrowserName == 'safari') {
      this._dd.getMainUrl(event.id, userId).subscribe((res: any) => {
        if (res.code == 1) {
          setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(AudioPlayerComponent, {
                panelClass: "audio_player",
                maxWidth: "100vw",
                width: "100%",
                height: "100%",
                hasBackdrop: false,
                backdropClass: "cdk-overlay-transparent-backdrop",
                data: { data: event },
                closeOnNavigation: false,
              });
              alertRef.afterClosed().subscribe((result: any) => {

              });
            }
          }, 500);
        } else if (res.code == 2 && res.error == "Content not found") {
          this.deleteWatchList(event.id, event.index);
        }
      });
    } else {
      this._dd.getMainUrl(event.id, userId).subscribe((res: any) => {
        if (res.code == 1) {
          setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(AudioPlayerComponent, {
                panelClass: "audio_player",
                maxWidth: "100vw",
                width: "100%",
                height: "100%",
                hasBackdrop: false,
                backdropClass: "cdk-overlay-transparent-backdrop",
                data: { data: event },
                closeOnNavigation: false,
              });
              alertRef.afterClosed().subscribe((result: any) => {

              });
            }
          }, 500);
        } else if (res.code == 2 && res.error == "Content not found") {
          this.deleteWatchList(event.id, event.index);
        }
      });
    }
  }

  navigate(event: any) {
    const eventParams = {
      item_id: event.id,
      item_name: event.title,
      item_type: event.content_type,
      item_value: event.access_type,
      page_name: this.cat_type,
      season_id: event.season_id,
      series_id: event.series_id
    };
    this.analyticsService.logEvent('select_item', eventParams);
    if (event.access_type == "free") {
      if (event.content_type == 'video') {
        this.getm3u8Url(event)
      } else {
        this.openAudioPlayer(event)
      }


    } else if (event.access_type == "paid") {
      if (this.isSubscribed == true) {
        if (event.content_type == 'video') {
          this.getm3u8Url(event)
        } else {
          this.openAudioPlayer(event)
        }

      } else if (this.isSubscribed == false) {
        this.router.navigate(["/subscribe"]);
      }
    }
  }

  backToLocation() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
  }
  getPage(page: any) {
    console.log("jjjjjjjjjj");
    window.scroll(0, 0)
    this.p = page;
    console.log(this.max_counter);
    this.display_offset = (page - 1) * 10;
    console.log(`New Offset: ${this.offset}`);
    this._dd
      .getContinueWatching(this.display_offset, this.max_counter, this.cat_type)
      .pipe(
        map((res: IResult) => {
          console.log(this.max_counter, ";;;;;;;");
          console.log(this.display_offset, "//////");
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData);
          this.dataList = decryptData.content;
          console.log(this.dataList);

          this.totalItems = decryptData.totalCount;
          // console.log(this.contentData);
          this.display_offset = decryptData.offset;
          console.log(this.display_offset, "'''''''''");
          this.dataList.map((category: any) => {
            category.sliderImg = "";
            category.sliderIdentifier = "";

            category.layout_thumbs.forEach((thumb: any) => {
              if (thumb != null) {
                if (thumb.layout == "rectangle_16x9") {
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
          });
        })
      )
      .subscribe();
  }
}
