import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataService } from '../services/data.service';
import { ExchangeDataService } from '../services/exchange-data.service';
import { FingerPrintService } from '../services/finger-print.service';
import { DeviceRestrictionPopupComponent } from '../shared/dialogBoxes/device-restriction-popup/device-restriction-popup.component';
import { AnalyticsService } from '../services/analytics.service';

declare const $: any;

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
  limitCheck: any
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
  visitorId: any;
  innerJson: any
  constructor(public dialog: MatDialog,private analyticsService:AnalyticsService, public router: Router, private ed: ExchangeDataService, private ds: DataService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService,) {
    this.ed.isUserLoggedIn.subscribe(value => {
      if (value == true) {
        this.isOttLoggedIn = value;
      }

    });
    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });

    this.ed.parentalLock.subscribe(value => {
      this.isParentalLocked = value;

    });
    this.ed.showFooter.subscribe(value => {
      if (value == true) {
        // this.showFooter=true
      }
    });
  }

  ngOnInit(): void {
    this.checkDeviceLimit()
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
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

    if (localStorage.getItem("ipSaveData") == null) {
      this.ds.apipip().subscribe((res: any) => {
        localStorage.setItem("ipSaveData", JSON.stringify(res));
      });
    }

    this.errorAlertJson();
    this.getPopupConfigData();
    this.getConfigData()
    this.getCountryName()
    this.getDeviceInformation()

  }

  messs(e: any) {
    this.isOttLoggedIn = true
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
      // console.log(res.Form[0].signin)
      this.jsonData = res
      localStorage.setItem('faqData', JSON.stringify(this.jsonData))
    });
    this.ds.json2().subscribe((data: any) => {
      this.innerJson = data
      localStorage.setItem('innerJson', JSON.stringify(this.innerJson))
    })
  }
  getCountryName() {
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
      app_version: "26.04.024",
      network_type: "others",
      network_provider: "others"
    };
    const devicedetail = {

      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + '*' + window.innerHeight,
      push_device_token: "others",
      device_type: 'web',
      platform: 'web',
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",

    };

    localStorage.setItem('deviceDetails', JSON.stringify(devicedetail))
    const eventParams = {
      device_id: this.visitorId,
      device_model: this.deviceService.browser,
      os_version: this.deviceDetection.os_version,
      app_version: "26.04.024",
    };
    this.analyticsService.logEvent('device_info', eventParams);
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
      $(".header").removeClass("active-nav");
    }
  });
});