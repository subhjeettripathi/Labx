import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataService } from 'src/app/services/data.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrls: ['./logout-popup.component.scss']
})
export class LogoutPopupComponent implements OnInit {
  @Output() isLoggedInforLayout = new EventEmitter<boolean>();
  userStatus: any;
  session_gender: any;
  USER_ACCOUNT_id: any
  visitorId:any
  constructor(public dialogRef: MatDialogRef<LogoutPopupComponent>, private dialog: MatDialog, private ds: DataService, private ed: ExchangeDataService, private router: Router,private deviceService: DeviceDetectorService,private _FPS:FingerPrintService) { }

  ngOnInit(): void {
   
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
  }

  


  onNoClick(): void {
    this.logout();
    this.dialogRef.close();
   
  }

  formatDate(inputDate: any) {
    var date = new Date(inputDate);

    var day: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var formattedDate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    return formattedDate;
  }

  logout() {
    const taplogininfo: any = localStorage.getItem("taploginInfo") || {};
    const userSessions: any = localStorage.getItem("ipSaveData") || {};
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const USER_SESSION: any = JSON.parse(userSessions);
    const subscribe: any = localStorage.getItem("is_subscriber") || {};
    if (subscribe == 1) {
      this.userStatus = "Subscribed";
    } else {
      this.userStatus = "Registered";
    }

    if (USER_ACCOUNT.gender == "") {
      this.session_gender = "others";
    } else {
      this.session_gender = USER_ACCOUNT.gender;
    }

    const formData: any = new FormData();
    formData.append("user_id", USER_ACCOUNT.id);
    formData.append("type", 1);
    formData.append("device_unique_id", localStorage.getItem('device_id'));
    this.ds.logout(formData).subscribe((res: any) => {
      if (res.code == 1) {
        this.dialog.closeAll();
        this.ed.alreadySubscriber.next(false);
        this.ed.isSubscribe.next(false);
        this.ed.isUserLoggedIn.next(false);
        this.ed.isUserLoggedInModal.next(false);
        this.ed.reload.next(false);
        this.isLoggedInforLayout.emit(false);
        localStorage.removeItem("ott_subtitle_setup");
        localStorage.removeItem("taploginInfo");
        localStorage.removeItem("ott_isLoggedIn");
        localStorage.removeItem("ott_consent");
        localStorage.removeItem("ott_subscriptionPlan");
        localStorage.removeItem("subscribeInfo");
        localStorage.removeItem("is_subscriber");
        localStorage.removeItem("isParentalSet");
        localStorage.removeItem("parentalControl");
        localStorage.removeItem("otpForgotId");
        localStorage.removeItem("emailVerified");
        localStorage.removeItem("otpForgotId");
        localStorage.removeItem("emailSavedCaseMobile");
        localStorage.removeItem("profileUpdates");
        localStorage.removeItem("taploginInfo1");
        localStorage.removeItem("ottParental");
        localStorage.removeItem("toggle_status");
        localStorage.removeItem("deviceLimit");
        localStorage.removeItem("isParentalRestriction");
        localStorage.removeItem("isOverAge");
        localStorage.removeItem("subtitle");
        localStorage.removeItem("restrictionTitle");
        localStorage.removeItem("setCase2Parental");
        localStorage.removeItem("setCase2Parental");
        localStorage.removeItem("check_sms");
        localStorage.removeItem("check_email");
        localStorage.removeItem("check_push");
        localStorage.removeItem("check_whatsapp");
        localStorage.removeItem("regional");
        localStorage.removeItem("jsonPlayer");
        localStorage.removeItem("loginShow");
        localStorage.removeItem("deleteAccount");
        localStorage.removeItem("pkgData");
        // localStorage.removeItem("device_id");
        localStorage.removeItem("packcheking");
        localStorage.removeItem("cancelKey");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo) || {};
        const userId = String(this.USER_ACCOUNT_id?.id || 'guest');
        window.posthog.reset(true);
        window.posthog.identify(userId);
        console.log(userId, "kjsl")
        if (this.router && this.router.url === "/") {
          window.location.reload();
        } else {
          this.router.navigate(["/"]);

        }
      }
    });

    var inputDate = new Date();
    var formattedDate = this.formatDate(inputDate);

    const formData1: any = new FormData();
    formData1.append("customer_id", USER_ACCOUNT.id);
    formData1.append("type", "end");
    formData1.append("time", formattedDate);
    formData1.append("device_unique_id", this.visitorId);
    formData1.append("device_type", this.deviceService.deviceType);
    formData1.append("content_type", "vod");
    formData1.append(
      "customer_name",
      USER_ACCOUNT.first_name + "" + USER_ACCOUNT.last_name
    );
    formData1.append("country", USER_SESSION.countryName);
    formData1.append("country_code", USER_SESSION.countryCode);
    formData1.append("network_type", USER_SESSION.security.network);
    formData1.append("network_provider", USER_SESSION.connection.isp);
    formData1.append("platform", this.deviceService.deviceType);
    formData1.append("browser", this.deviceService.browser);
    formData1.append(
      "screen_resolution",
      window.screen.availWidth + "*" + window.screen.availHeight
    );
    formData1.append("os_version", USER_SESSION.userAgent.browserVersion);
    formData1.append("age_group", USER_ACCOUNT.age_group);
    formData1.append("gender", this.session_gender);
    formData1.append("city", "others");
    this.ds.userSession(formData1).subscribe((res: any) => {
      if (res.code == 1) {
      }
    });
  }

}
