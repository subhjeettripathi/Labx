import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";
import { FormGroup } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { IResult } from "src/app/shared/models/result.data";
import { MatDialog } from "@angular/material/dialog";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { AudioPlayerComponent } from "src/app/shared/audio-player/audio-player.component";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { Location } from "@angular/common";
import { ParentalOtpCreateComponent } from "src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { AnalyticsService } from "src/app/services/analytics.service";
@Component({
  selector: "app-all-data",
  templateUrl: "./all-data.component.html",
  styleUrls: ["./all-data.component.scss"],
})
export class AllDataComponent implements OnInit {
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  isOttLoggedIn = false;
  p: number = 1;
  collection: any = [];
  searchForm!: FormGroup;
  display_offset: number = 0;
  cat_id: any;
  title: any;
  rentalData: any
  cat: any;
  defaultImages: any = []
  windowSize: number = 0;
  contentData: any = [];
  user: any;
  @ViewChild("searchbar") searchbar!: ElementRef;
  searchText = "";
  searchRes: any = true;
  toggleSearch: boolean = false;
  singerShow: boolean = false
  composerShow: boolean = false
  searchData: any = [];
  UserInfo: any;
  totalItems: any;
  arrowShow: boolean = true;
  show: boolean = false;
  countryAllowed: any = [];
  timeZoneOffset: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed = false;
  prevUrl: any
  constructor(
    private _dd: DataService,
    private router: Router,
    private DEC_SER: DecryptService,
    private _ar: ActivatedRoute,
    private dialog: MatDialog,
    private ed: ExchangeDataService,
    private location: Location,
    private auth: AuthService,
    private fcs: FunctionCallingService,
    private _storage: StorageService,
    private analyticsService: AnalyticsService
  ) {
    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value
      }
    });
    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.user = localStorage.getItem("taploginInfo");
    this.defaultImages = localStorage.getItem("defaultImages")
    this.prevUrl = localStorage.getItem('prevUrl')
    this.windowSize = window.innerWidth;
    this._ar.paramMap.subscribe((params) => {
      this.cat_id = params.get("id");
      this.title = params.get("title");


      const eventParams = {
        bucket_name: this.title,
        page_name: 'view_all',

      };
      this.analyticsService.logEvent('view_item_list', eventParams);
    });
    this._ar.queryParams.subscribe((params) => {
      this.cat = params["cat"];
      if (this.cat == "Genre") {
        this.getGenreList();
      } else {
        this.getList();
      }
    });
  }
  searchIconShow: boolean = true;

  searchCLoseButton(event: any) {
    if (event.target.value.length != 0) {
      this.searchIconShow = false;
    } else {
      this.searchIconShow = true;
    }
  }

  getGenreList() {
    // this._dd
    //   .getSimilarContent(this.display_offset, this.cat_id)
    //   .pipe(
    //     map((res: IResult) => {
    //       this.DEC_SER.getDecryptedData(res?.result);
    //       let decryptData = JSON.parse(this.DEC_SER.decryptData);
    //       // console.log(decryptData);
    //       this.contentData = decryptData.content;
    //       this.totalItems = decryptData.totalCount;
    //       this.display_offset = decryptData.offset;
    //       console.log(this.totalItems);

    //       console.log(this.contentData);

    //       this.contentData.map((category: any) => {
    //         category.sliderImg = "";
    //         category.sliderIdentifier = "";

    //         category.layout_thumbs.forEach((thumb: any) => {
    //           if (thumb.layout == "vertical_9x16") {
    //             thumb?.image_size.filter((img: any) => {
    //               if (Number(img.width) == 360 || Number(img.width) == 854) {
    //                 category.sliderImg = img.url;
    //                 category.sliderIdentifier = img.identifier;
    //               } else if (category.sliderImg == "") {
    //                 category.sliderImg = thumb?.image_size[0].url;
    //                 category.sliderIdentifier = thumb?.image_size[0].identifier;
    //               }
    //             });
    //           }
    //         });
    //       });
    //     })
    //   )
    //   .subscribe();
  }
  getList() {
    if (this.title == 'Popular Singers') {
      this._dd.getSingerList('singer').subscribe((res: any) => {
        if (res.code == 1) {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData);
          this.contentData = decryptData.data;
          this.totalItems = decryptData.data.totalCount;
          this.singerShow = true
          this.composerShow = false
        }
      });
    } else if (this.title == 'podcast') {
      this._dd.getSingerList('composer').subscribe((res: any) => {
        if (res.code == 1) {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData);
          this.contentData = decryptData.data;
          this.totalItems = decryptData.data.totalCount;
          this.singerShow = false
          this.composerShow = true
        }
      });
    }
    else {
      this._dd
        .getDescriptionDataList(this.display_offset, this.cat_id)
        .pipe(
          map((res: IResult) => {
            console.log(res);
            // this.DEC_SER.getDecryptedData(res?.result);
            // let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData);

            // console.log(decryptData);
            this.contentData = decryptData.content;
            this.totalItems = decryptData.totalCount;
            console.log(this.contentData);
            this.display_offset = decryptData.offset;
            this.contentData.map((category: any) => {
              category.sliderImg = "";
              category.sliderIdentifier = "";
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
                      if (
                        thumb.layout == "vertical_9x16" &&
                        thumb.platform == "web"
                      ) {
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
                  if (thumb.layout == "vertical_9x16") {
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
            });
          })
        )
        .subscribe();
    }

  }
  gty(page: any) {
    console.log(page);
  }
  closeinput(): void {
    this.searchIconShow = true;
    this.toggleSearch = false;
  }

  backClicked() {


    // this.ed.playDetailVideo.next(this.cat_id);
    this.location.back()
    // this.router.navigate(["/"]);

  }
  // navigate(event: any) {
  //   console.log(event)
  //   if (event.content_type == 'audio') {
  //     if (this.isOttLoggedIn) {
  //       this.openAudioPlayer(event)
  //     } else {
  //       const dialogRef = this.dialog.open(LoginModalDialogComponent, {
  //         backdropClass: "popupBackdropClass",
  //         panelClass: "logindialog",
  //         width: "390px",
  //         data: { name: "login" },
  //       });
  //     }
  //   }
  //   else if (event.content_type == 'ebook') {
  //     if (this.isOttLoggedIn) {
  //       this.router.navigate(["/aol/ebook/content/" + event.permalink]);
  //     } else {
  //       const dialogRef = this.dialog.open(LoginModalDialogComponent, {
  //         backdropClass: "popupBackdropClass",
  //         panelClass: "logindialog",
  //         width: "390px",
  //         data: { name: "login" },
  //       });
  //     }
  //   }
  //   else if (event.role == "singer") {
  //     this.router.navigate(["/singer/" + event.id]);
  //   }
  //   else {
  //     this.router.navigate(["/" + event.permalink]);
  //   }
  // }


  navigate(event: any) {
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      const eventParams = {
        item_id: event.id,
        item_name: event.title,
        item_type: event.content_type,
        item_value: event.access_type,
        page_name: 'view_all',
        season_id: event.season_id,
        series_id: event.series_id
      };
      this.analyticsService.logEvent('select_item', eventParams);
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
            this._dd.getUserSubscriptionDetails(JSON.parse(userInfo).id).subscribe(res => {
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
  backClickedSearch() {
    this.display_offset = 0;
    this.getList();
    this.arrowShow = true;
    this.show = false;
  }
  search_bar() {
    this.toggleSearch = true;
  }
  searchDataShow: any;

  onImgError(event: any) {
    event.target.src = 'assets/svgs/vertical.jpg'
  }
  onImgErrorSinger(event: any) {
    event.target.src = 'assets/svgs/square.jpg'
  }
  clear() {
    this.searchRes = true;
    this.toggleSearch = false;
    this.display_offset = 0;
    this.getList();
  }
  getPage(page: any) {
    window.scroll(0, 0)
    this.p = page;
    this._dd
      .getDescriptionDataList((page - 1) * 12, this.cat_id)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData);
          this.contentData = decryptData.content;
          this.totalItems = decryptData.totalCount;
          // console.log(this.contentData);
          this.display_offset = decryptData.offset;
          this.contentData.map((category: any) => {
            category.sliderImg = "";
            category.sliderIdentifier = "";
            if (category.is_group == 1 && category.groupInfo != null) {
              if (category.groupInfo.global_thumb != null) {
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
                    if (
                      thumb.layout == "vertical_9x16" &&
                      thumb.platform == "web"
                    ) {
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

            }
            else if (category.is_group == 0) {
              category.layout_thumbs.forEach((thumb: any) => {
                if (thumb.layout == "vertical_9x16") {
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
          });
        })
      )
      .subscribe();
  }
}
