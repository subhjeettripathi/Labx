import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { Location } from "@angular/common";
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { AuthService } from 'src/app/services/auth.service';
import { ParentalOtpCreateComponent } from 'src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { EventStatusDialogComponent } from 'src/app/shared/dialogBoxes/event-status-dialog/event-status-dialog.component';

@Component({
  selector: 'app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.scss']
})
export class LiveEventsComponent implements OnInit {
  data: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
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
  recordingData: any = []
  display_offset: any = 0
  navMain: any;
  navNew: any;
  getIpdetail: any
  stateDefault: any;
  visitorId: any;
  rentalData: any
  cat_id: any;
  showCountry = true;
  isSubscribed = false;
  constructor(private ds: DataService, private DEC_SER: DecryptService, private router: Router, private location: Location, private ed: ExchangeDataService, private _FPS: FingerPrintService, private fcs: FunctionCallingService, private auth: AuthService, private dialog: MatDialog) {

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
    this.webcastData()
    this.navMain = localStorage.getItem("navbarData");
    this.navNew = JSON.parse(this.navMain);
    this.navNew.forEach((data: any) => {
      if (data.category_type == 'webcast') {
        this.cat_id = data.id
        this.getRecordingData()

      }
    })
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
  }

  PlayVideo(data: any) {

    this.router.navigate(["/" + data.permalink]);
  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
  }
  formatDate(inputDate: any) {
    var date = new Date(inputDate);

    var day: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedDate;
  }

  sessionLogStart() {
    this.ds.apipip().subscribe((res: any) => {
      console.log(res);
      if (res.countryName == "India") {
        if (res.regionName == "National Capital Territory of Delhi") {
          res.regionName = "Delhi"
        }
        this.stateDefault = res.regionName


        this.showCountry = true
      } else {
        this.stateDefault = res.countryName
        this.showCountry = false
      }
      this.fcs.fgh.next(res)
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);

      const deviceId = localStorage.getItem('device_id')
      // userSessionApi Start
      var inputDate = new Date();
      var formattedDate = this.formatDate(inputDate);

      const formData: any = new FormData();
      formData.append("customer_id", USER_ACCOUNT.id);
      formData.append("type", "start");
      formData.append("time", formattedDate);
      formData.append("device_unique_id", deviceId);
      formData.append("device_type", "web");
      formData.append("content_type", "webcast");
      formData.append("customer_name", USER_ACCOUNT.first_name + '' + USER_ACCOUNT.last_name);
      formData.append("country", res.countryName);
      formData.append("country_code", res.countryCode);
      formData.append("network_type", res.security.network);
      formData.append("network_provider", res.connection.isp);
      formData.append("platform", res.userAgent.platform);
      formData.append("browser", res.userAgent.browser);
      formData.append("screen_resolution", window.screen.availWidth + '*' + window.screen.availHeight);
      formData.append("os_version", res.userAgent.operatingSystem);
      formData.append("age_group", USER_ACCOUNT.age_group);
      formData.append("gender", USER_ACCOUNT.gender);
      formData.append("city", res.city);
      this.ds.userSession(formData).subscribe((res: any) => {
        if (res.code == 1) {
          console.log(res);

        }
      });

      // userSessionApi End
    })
  }

  join(i: any, event: any) {

    this.ds.timeZoneApiWebcast(this.getIpdetail.countryCode, event.id).subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let eventStatus = JSON.parse(this.DEC_SER.decryptData);

        const subs: any = localStorage.getItem("ott_subscriptionPlan");
        const userInfo: any = localStorage.getItem('taploginInfo') || {};
        const a: any = localStorage.getItem('taploginInfo')
        const ipDetail: any = localStorage.getItem("ipSaveData");
        const detail = JSON.parse(ipDetail);
        const formData: any = new FormData();
        const visitorIds: any = localStorage.getItem('device_id')
        if (a != null) {
          formData.append("customer_id", JSON.parse(userInfo).id);
          formData.append("device_unique_id", visitorIds);
          formData.append('country_code', detail.countryCode);
          formData.append('content_id', event.id);
          formData.append('package_type', event.package_mode);
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
              if (eventStatus.status == 'live') {
              this.router.navigate(['/live'], { queryParams: { id: i } });
              this.sessionLogStart()
              } else {
                if (this.dialog.openDialogs.length == 0) {
                  const dialogRef = this.dialog.open(EventStatusDialogComponent, {
                    panelClass: 'live-status',
                    width: "400px",
                    data: { name: eventStatus, type: 'webcast' }
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
                this.router.navigate(['/live'], { queryParams: { id: i } });
              })
            } else if (res.code == 4) {
              this.ed.isSubscribe.next(false);
              this.ed.alreadySubscriber.next(false);
              localStorage.setItem("is_subscriber", "0");
              if (event.acces_type == 'paid') {
                this.router.navigate(["/subscribe"]);
              } else {
                this.router.navigate(['/live'], { queryParams: { id: i } });
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


      }
    })
  }
  webcastData() {
    const ipDetail: any = localStorage.getItem("ipSaveData");
    this.getIpdetail = JSON.parse(ipDetail);
    this.ds
      .webcast(this.getIpdetail.countryCode)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.data = decryptData.content;
            console.log(this.data, 'ghjhgvghg');

            this.data.map((category: any) => {
              category.sliderImg = "";
              category.sliderIdentifier = "";
              category.layout_thumbs.forEach((thumb: any) => {
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
              });


            })




          } else {

          }
        })
      )
      .subscribe();
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
            console.log(this.recordingData);

            this.recordingData[0].cat_cntn.map((category: any) => {
              console.log(category, 'dataaa');

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
}
