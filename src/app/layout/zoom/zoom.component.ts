import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { EventStatusDialogComponent } from 'src/app/shared/dialogBoxes/event-status-dialog/event-status-dialog.component';
import * as firebase from "firebase/app";
import { AnalyticsService } from 'src/app/services/analytics.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { ParentalOtpCreateComponent } from 'src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component';
@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent implements OnInit {
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  endDate: Date = new Date();
  eventEndDate: Date = new Date();
  countDownDate: any
  nowDate: any
  userLogin: any
  zoomData: any = []
  zoomUrl: any = []
  recordingData: any = []
  display_offset: any = 0
  remainingTime: any;
  ifEVents: boolean = false;
  rentalData: any
  navMain: any;
  navNew: any;
  config = {
    slidesToShow: 4,
    dots: false,
    arrows: true,
    slidesToScroll: 2,
    autoplay: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false
        }
      }
    ]
  };
  isSubscribed = false;
  cat_id: any;
  constructor(private ds: DataService, private analyticsService: AnalyticsService, private fcs: FunctionCallingService, private auth: AuthService, private DEC_SER: DecryptService, private location: Location, private dialog: MatDialog, private router: Router, private ed: ExchangeDataService, private titleService: Title, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService,) {
    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });
  }

  ngOnInit(): void {
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    setTimeout(() => {
      this.dialog.closeAll();
    }, 200);
    this.navMain = localStorage.getItem("navbarData");
    this.navNew = JSON.parse(this.navMain);
    this.navNew.forEach((data: any) => {
      if (data.category_type == 'event') {
        this.cat_id = data.id
        console.log(this.cat_id);

        this.getRecordingData()
      }
    })
    this.zoom()
    this.titleService.setTitle('Events')
  }
  PlayVideo(data: any) {

    this.router.navigate(["/" + data.permalink]);
  }
  zoom() {
    this.ds.zoom().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.zoomData = decryptData.content
        // const x = setInterval(() => {
        //   this.zoomData.forEach((element: any) => {
        //     this.endDate = new Date(element.publish_date);
        //     this.eventEndDate = new Date(element.publish_end_date);
        //     this.countDownDate = new Date(this.endDate).getTime();
        //     this.nowDate = new Date(liveStatus.current_time)
        //     this.nowDate = new Date(liveStatus.current_time).getTime();
        //     var distance = this.countDownDate - this.nowDate;
        //     var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        //     var hours = Math.floor(
        //       (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        //     );
        //     var minutes = Math.floor(
        //       (distance % (1000 * 60 * 60)) / (1000 * 60)
        //     );
        //     var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        //     element.timecounter = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
        //     if (distance < 0) {
        //       element.timecounter = "Running"
        //     }
        //   });

        // }, 1000)
      } else {
        this.ifEVents = true;
      }

    })
    const apiKey = 'iY9BHzhYR8eY6G64Q0CrcA';
    const apiSecret = '3WxyrBekymuXn7g66mfjOzHo4Ahi2zXe';

  }


  getRecordingData() {
    this.ds
      .getHomeData(this.display_offset, 4, this.cat_id)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.recordingData = decryptData["dashboard"]["home_category"];
            console.log(decryptData);
            this.recordingData[0]?.cat_cntn.map((category: any) => {
              category.totalSlides = 6;
              category.sliderImg = "";
              category.sliderIdentifier = "";
              if (category.is_group == 0) {
                category.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == this.recordingData[0].multiple_layout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (Number(img.width) == 360 || Number(img.width) == 854) {
                        category.sliderImg = img.url;
                        category.sliderIdentifier = img.identifier;
                      } else if (category.sliderImg == "") {
                        category.sliderImg = thumb?.image_size[0].url;
                        category.sliderIdentifier =
                          thumb?.image_size[0].identifier;
                      }
                    });
                  }
                });
              } else {
                if (category?.groupInfo?.global_thumb.length != 0) {
                  category.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == this.recordingData[0].multiple_layout.layout) {

                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            category.sliderImg = img.url;
                            category.sliderIdentifier = img.identifier;
                          } else if (category.sliderImg == "") {
                            category.sliderImg = thumb?.image_size[0].url;
                            category.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                } else if (category.groupInfo.thumbs != null) {
                  category.groupInfo.thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == this.recordingData[0].multiple_layout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            category.sliderImg = img.url;
                            category.sliderIdentifier = img.identifier;
                          } else if (category.sliderImg == "") {
                            category.sliderImg = thumb?.image_size[0].url;
                            category.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }

              }

            });
          }
        })
      )
      .subscribe();
  }

  analytics(zoomAnalticsData: any) {

    this.ds.apipip().subscribe((res: any) => {
      const userInfo: any = localStorage.getItem("taploginInfo");
      let analytics: any = {
        c_id: zoomAnalticsData.id,
        dod: "",
        dd: "",
        type: 4,
        content_title: zoomAnalticsData.title,
        total_duration: 1,
        pd: 1,
        cat_id: '',
        age_group: "other",
        gender: "Male",
        network_provider: "Airtel",
        customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
        content_type: 'zoom',
        impression: 1
      };
      analytics.dod = `{ "os_version": "6.0", "app_version": "26.04.024", "network_type": "wifi", "network_provider": "" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo)?.id);
      formData.append("country", res?.countryName);
      formData.append("country_code", res?.countryName);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
    })


  }


  joinMeeting(meetingUrl: any) {
    console.log(meetingUrl);

    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    this.ds.timeZoneApiWebcast(detail.countryCode, meetingUrl.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let liveStatus = JSON.parse(this.DEC_SER.decryptData);
      console.log(liveStatus);
      const subs: any = localStorage.getItem("ott_subscriptionPlan");
      const userInfo: any = localStorage.getItem('taploginInfo') || {};
      const a: any = localStorage.getItem('taploginInfo')
      const formData: any = new FormData();
      const visitorIds: any = localStorage.getItem('device_id')
      if (a != null) {
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append('country_code', detail.countryCode);
        formData.append('content_id', meetingUrl.id);
        formData.append('package_type', meetingUrl.package_mode);
        if (subs != null && JSON.parse(subs).packages_list.length) {
          const firstOTTPackage = JSON.parse(subs).packages_list.find((res: any) => res.package_mode === 'OTT');
          if (firstOTTPackage) {
            formData.append("session_status", 1);
            formData.append("device", "web");
            formData.append("device_count", firstOTTPackage.device_restriction);
            formData.append("type", firstOTTPackage.restriction_type);
          }
        } else {
          formData.append("session_status", '');
          formData.append("device", '');
          formData.append("device_count", '');
          formData.append("type", '');
        }

        this.auth.isAllowed(formData).subscribe((res) => {
          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            if (liveStatus.status == 'live') {
              console.log(meetingUrl);
              this.userLogin = localStorage.getItem("ott_isLoggedIn");
              const taploginInfo = localStorage.getItem("taploginInfo");
              const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';

              const eventParams = {
                session_id: meetingUrl.id,
                session_name: meetingUrl.title,
              };
              this.analyticsService.logEvent('zoom_session_join', eventParams);
              if (!this.userLogin) {
                const dialogRef = this.dialog.open(LoginModalDialogComponent, {
                  backdropClass: "popupBackdropClass",
                  panelClass: "logindialog",
                  width: "390px",
                  data: { name: "login" },
                });
                dialogRef.disableClose = true;
              } else {
                var zoomUrl = `https://app.zoom.us/wc/${meetingUrl.event_value.meeting_id}/join?fromPWA=1&pwd=${meetingUrl.event_value.meeting_password}`;
                window.open(zoomUrl, '_blank');
              }

              this.analytics(meetingUrl)
            } else {
              if (this.dialog.openDialogs.length == 0) {
                const dialogRef = this.dialog.open(EventStatusDialogComponent, {
                  panelClass: 'live-status',
                  width: "800px",
                  data: { name: liveStatus, type: 'zoom' }
                });
              }
            }
          } else if (res.code == 2) {
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data

            const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
              panelClass: 'rentalPop',
              width: "800px",
              data: { rent: this.rentalData }
            });

          } else if (res.code == 3) {
            this.ds.getUserSubscriptionDetails(JSON.parse(userInfo).id).subscribe(res => {
              this.DEC_SER.getDecryptedData(res.result);
              const data: any = JSON.parse(this.DEC_SER.decryptData);
              if (data.is_subscriber == 1) {
                this.ed.isSubscribe.next(true);
                this.ed.alreadySubscriber.next(true)
                localStorage.setItem('is_subscriber', '1')
                
              } else if (data.is_subscriber == 0) {
                localStorage.setItem('is_subscriber', '0')
              }
              var zoomUrl = `https://app.zoom.us/wc/${meetingUrl.event_value.meeting_id}/join?fromPWA=1&pwd=${meetingUrl.event_value.meeting_password}`;
              window.open(zoomUrl, '_blank');
            })
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (meetingUrl.acces_type == 'paid') {
              this.router.navigate(["/subscribe"]);
            } else {
              var zoomUrl = `https://app.zoom.us/wc/${meetingUrl.event_value.meeting_id}/join?fromPWA=1&pwd=${meetingUrl.event_value.meeting_password}`;
              window.open(zoomUrl, '_blank');
            }
          }
        })
      } else {
        const dialogRef = this.dialog.open(LoginModalDialogComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "logindialog",
          width: "420px",
          data: { name: "login" },
        });
        dialogRef.disableClose = true;
      }
    })
  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
  }
}


