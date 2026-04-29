import { Component, OnInit, Input } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { AudioPlayerComponent } from "../../audio-player/audio-player.component";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalDialogComponent } from "../../dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { AuthService } from "src/app/services/auth.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { ParentalOtpCreateComponent } from "../../dialogBoxes/parental-otp-create/parental-otp-create.component";
import { StorageService } from "src/app/services/storage.service";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";
declare var $: any;


@Component({
  selector: "app-popular-search",
  templateUrl: "./popular-search.component.html",
  styleUrls: ["./popular-search.component.scss"],
})
export class PopularSearchComponent implements OnInit {
  // @Output() newItemEvent = new EventEmitter<string>();

  // addNewItem(value: string) {
  //   this.newItemEvent.emit(value);
  // }
  @Input() item: any = [];
  show_img: any = true;
  popular_data: any;
  windowSize: any = 0;
  rentalData: any
  popularImg_url: any = [];
  defaultImages: any = []
  defaultThumb: any
  isSubscribed = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  constructor(private ds: DataService, private DEC_SER: DecryptService, private ed: ExchangeDataService, private router: Router, private dialog: MatDialog, private auth: AuthService, private fcs: FunctionCallingService, private _storage: StorageService, private analyticsService: AnalyticsService) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }

  ngOnInit(): void {
    this.defaultImages = localStorage.getItem("defaultImages")
    this.defaultThumb = JSON.parse(this.defaultImages).vertical.path
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.popular_search();

    this.windowSize = window.innerWidth;
  }

  openAudioPlayer(event: any) {
    this.dialog.closeAll()
    setTimeout(() => {
      if (this.dialog.openDialogs.length == 0) {
        const alertRef = this.dialog.open(AudioPlayerComponent, {
          panelClass: 'audio_player',
          maxWidth: '100vw',
          width: "100%",
          height: "100%",
          hasBackdrop: false,
          backdropClass: 'cdk-overlay-transparent-backdrop',
          data: { data: event },
        });
      }
    }, 500);
  }
  popular_search() {
    var decrypt_data: any;

    this.ds.popularRes().subscribe((data: any) => {
      if (data.code == 1) {
        decrypt_data = this.DEC_SER.getDecryptedData(data.result);
        let UserInfo = JSON.parse(this.DEC_SER.decryptData);
        console.log("search successful", UserInfo.content);
        this.popular_data = UserInfo.content;
        this.popular_data.map((data: any) => {
          data.sliderImg = "";
          data.sliderIdentifier = "";
          if (data.is_group == 1 && data.groupInfo != null) {
            if (data.groupInfo.global_thumb != null && data.groupInfo.global_thumb.length != 0) {
              data.groupInfo.global_thumb.forEach((thumb: any) => {
                if (thumb != null) {

                  if (thumb.layout == "vertical_9x16" &&
                    thumb.platform == "global") {
                    thumb?.image_size.filter((img: any) => {
                      if (Number(img.width) == 360 || Number(img.width) == 854) {
                        data.sliderImg = img.url;
                        data.sliderIdentifier = img.identifier;
                      } else if (data.sliderImg == "") {
                        data.sliderImg = thumb?.image_size[0].url;
                        data.sliderIdentifier = thumb?.image_size[0].identifier;
                      }
                    });
                  }
                }
              });
            } else if (data.groupInfo.thumbs != null) {
              data.groupInfo.thumbs.forEach((thumb: any) => {
                if (thumb != null) {
                  if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
                    thumb?.image_size.filter((img: any) => {
                      if (Number(img.width) == 360 || Number(img.width) == 854) {
                        data.sliderImg = img.url;
                        data.sliderIdentifier = img.identifier;
                      } else if (data.sliderImg == "") {
                        data.sliderImg = thumb?.image_size[0].url;
                        data.sliderIdentifier = thumb?.image_size[0].identifier;
                      }

                    });
                  }


                }
              });
            }



          }
          else if (data.is_group == 0) {
            data.layout_thumbs.forEach((thumb: any) => {
              if (thumb.layout == 'vertical_9x16') {
                thumb?.image_size.filter((img: any) => {

                  if (Number(img.width) == 360 || Number(img.width) == 854) {
                    data.sliderImg = img.url;
                    data.sliderIdentifier = img.identifier;
                  } else if (data.sliderImg == "") {
                    data.sliderImg = thumb?.image_size[0].url;
                    data.sliderIdentifier = thumb?.image_size[0].identifier;
                  }

                });
              }
            });

          }
        });
      }
    });
  }
  navigate(event: any) {
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      const eventParams = {
        item_id: event.id,
        item_name: event.title,
        item_type: event.content_type,
        item_value: event.access_type,
        page_name: 'popular_search',
        season_id: event.season_id,
        series_id: event.series_id
      };
      this.analyticsService.logEvent('select_item', eventParams);

      console.log(event);
      const subs: any = localStorage.getItem("ott_subscriptionPlan");
      const userInfo: any = localStorage.getItem('taploginInfo') || {};
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      if (Object.keys(userInfo).length) {
        const formData: any = new FormData();
        const visitorIds: any = localStorage.getItem('device_id')
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
            if (event.content_type == 'video') {
              this.router.navigate(["/" + event.permalink]);
              localStorage.setItem('prevUrl', this.router.url)
            } else if (event.content_type == 'audio') {
              this.openAudioPlayer(event)
            } else if (event.content_type == 'ebook') {
              this.router.navigate(["/aol/ebook/" + event.permalink]);
            }
          } else if (res.code == 2) {
            //rental flow//
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data
            if (event.content_type == 'video') {
              this.router.navigate(["/" + event.permalink]);
              localStorage.setItem('prevUrl', this.router.url)
            } else {
              this.playRental()
            }

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
              this._storage.setData('ott_subscriptionPlan', data);
            })
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            this.navigationFunction(event)
          }
        })

      } else {
        if (event.content_type != 'video') {
          const dialogRef = this.dialog.open(LoginModalDialogComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "logindialog",
            width: "390px",
            data: { name: "login" },
          });
          dialogRef.disableClose = true;
        } else {
          this.router.navigate(["/" + event.permalink]);
          localStorage.setItem('prevUrl', this.router.url)
        }
      }
    }

  }

  navigationFunction(event: any) {
    if (event.access_type == 'free') {
      if (event.content_type == 'video') {
        this.router.navigate(["/" + event.permalink]);
        localStorage.setItem('prevUrl', this.router.url)
      } else if (event.content_type == 'audio') {
        this.openAudioPlayer(event)
      } else if (event.content_type == 'ebook') {
        this.router.navigate(["/aol/ebook/" + event.permalink]);
      }
    } else if (event.access_type == 'paid') {
      if (event.content_type != 'video') {
        this.router.navigate(["/subscribe"]);
      } else {
        this.router.navigate(["/" + event.permalink]);
        localStorage.setItem('prevUrl', this.router.url)
      }
    }
  }
  playRental() {
    const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
      panelClass: 'rentalPop',
      width: "800px",
      data: { rent: this.rentalData }
    });
  }
}
