import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataService } from '../services/data.service';
import { ExchangeDataService } from '../services/exchange-data.service';
import { FingerPrintService } from '../services/finger-print.service';
import { DeviceRestrictionPopupComponent } from '../shared/dialogBoxes/device-restriction-popup/device-restriction-popup.component';

declare const $: any;
declare global {
  interface Window {
    posthog: any;
  }
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
  loadRouter = false
  isOttLoggedIn = false;
  isSubscribed = false
  fixed: any
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  isSubsInfo: any = localStorage.getItem('is_subscriber') || {};
  isUserLoggedIn!: boolean;
  subcribe!: boolean;
  isParentalLocked = true
  statGeographical: any;
  showStateCountry: any;
  errorMSg: any;
  popUPForm: any;
  showFooter: boolean = false
  jsonData: any;
  USER_ACCOUNT_id: any;
  visitorId: any;
  scrollValue: any
  limitCheck: any
  @HostListener("window:scroll", ["$event"])
  @HostListener("window:resize", ["$event"])

  onResize(event: any) {
    const element: any = document.querySelector(".header"); // For the whole page
    this.scrollValue = $(window).scrollTop();
    if (this.scrollValue >= 270) {
      element.style.backgroundColor = "#242424a3"
    }
    else {
      element.style.backgroundColor = "";
    }
  }

  constructor(public dialog: MatDialog, public router: Router, private ed: ExchangeDataService, private ds: DataService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService,) {
    this.ed.isUserLoggedIn.subscribe(value => {
      if (value == true) {
        this.isOttLoggedIn = value;
        this._FPS.getFingerPrintDeviceId();
        this._FPS.visitorId.subscribe(r => {
          this.visitorId = r;
          const deviceId = localStorage.getItem('device_id');
          if (!deviceId || deviceId === '' || deviceId === 'undefined' || deviceId === null) {
            localStorage.setItem('device_id', this.visitorId);
          }
          const device_Id = String(deviceId || 'unknown');
          window.posthog.reset(true);
          window.posthog.register({ device_id: deviceId });
          console.log(deviceId)
        });
        setTimeout(() => {
          if (localStorage.getItem("taploginInfo") != null) {
            const taplogininfo: any = localStorage.getItem("taploginInfo");
            console.log(taplogininfo)
            this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
          }
        }, 1000);


        setTimeout(() => {
          const userId = String(this.USER_ACCOUNT_id?.id || 'guest');
          if (userId !== 'guest') {
            window.posthog.reset(true);
            window.posthog.identify(userId);
          }


          console.log(userId, "kjsl")
        }, 2000);

      }
    });
    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });

    this.ed.parentalLock.subscribe(value => {
      this.isParentalLocked = value;

    });


  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    if (localStorage.getItem("taploginInfo") != null) {
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
    }

  }


  ngOnInit(): void {
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => {
      this.visitorId = r;
      const deviceId = localStorage.getItem('device_id');
      if (!deviceId || deviceId === '' || deviceId === 'undefined' || deviceId === null) {
        localStorage.setItem('device_id', this.visitorId);
      }


    });


    setTimeout(() => {
      this.checkDeviceLimit()
    }, 2000);

    this.errorAlertJson();
    this.getPopupConfigData();
    this.getConfigData()
    this.getCountryName()
    this.getDeviceInformation()
    this.ds.popupJson().subscribe((dat: any) => {

      localStorage.setItem("allJsonPopupData", JSON.stringify(dat));
    });
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }

    if (this.isSubsInfo == 1) {
      this.isSubscribed = true
      this.isParentalLocked = false
    } else {
      this.isSubscribed = false
      this.isParentalLocked = true
    }

  }

  checkDeviceLimit() {

    this.limitCheck = localStorage.getItem('deviceLimit')
    const detail = JSON.parse(this.limitCheck);
    if (detail != null) {
      const dialogRef = this.dialog.open(
        DeviceRestrictionPopupComponent,
        {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
          data: detail
        }
      );
      dialogRef.afterClosed().subscribe((result: any) => {
        this.ed.reload.next(true);
      });
      dialogRef.disableClose = true;
    }
  }
  messs(e: any) {
    this.isOttLoggedIn = true
  }

  errorAlertJson() {
    this.ds.errorAlertConfig().subscribe((data: any) => {
      this.errorMSg = data.messages[0]
      localStorage.setItem('errorMsg', JSON.stringify(this.errorMSg))
    })
  }
  getPopupConfigData() {
    this.ds.popupJson().subscribe((res: any) => {
      this.popUPForm = res.PopupList[0]
      localStorage.setItem('popUpForm', JSON.stringify(this.popUPForm))

    })
  }
  getConfigData() {
    this.ds.faqData().subscribe((res: any) => {

      this.jsonData = res
      localStorage.setItem('faqData', JSON.stringify(this.jsonData))

    });
  }
  getCountryName() {
    // this._DS.countryNames().subscribe((res: any) => {
    //   this.country = res


    // })
    this.ds.getCountryStateList().subscribe((res: any) => {
      localStorage.setItem('countryStateList', JSON.stringify(res))
    })
  }
  getLoggedInBoolean(e: boolean) {
    this.isOttLoggedIn = e;
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  getDeviceInformation() {

    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "v2_1",
      network_type: "others",
      network_provider: "others"
    };
    const devicedetail = {

      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + '*' + window.innerHeight,
      push_device_token: "others",
      device_type: 'web',
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",

    };

    localStorage.setItem('deviceDetails', JSON.stringify(devicedetail))

  }
  loadedData(e: boolean) {
    this.loadRouter = true
    setTimeout(() => {
      this.showFooter = true
    }, 400);
  }
}

$(function () {
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 50) {
      $(".header").addClass("active-nav");
    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $(".header").removeClass("active-nav");
    }
  });
});