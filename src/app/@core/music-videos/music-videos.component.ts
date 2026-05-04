import { AfterViewInit, Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DecryptService } from "src/app/services/decrypt.service";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";
import { videoJs } from "src/app/video-player/videojs";
import { CountryLockPopupComponent } from "src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { VideojsDialogComponent } from "src/app/shared/videojs-dialog/videojs-dialog.component";
import { AdultAgePopupComponent } from "src/app/shared/dialogBoxes/adult-age-popup/adult-age-popup.component";
import { ChechPinParentalComponent } from "src/app/shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { AuthService } from "src/app/services/auth.service";
import { map } from "rxjs";
import { StorageService } from "src/app/services/storage.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { environment } from 'src/environments/environment';
// import * as amplitude from '@amplitude/analytics-browser';
import { NetworkConnectionService } from "src/app/services/network-connection.service";
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
declare var $: any;

@Component({
  selector: "app-music-videos",

  templateUrl: "./music-videos.component.html",
  styleUrls: ["./music-videos.component.scss"],
})
export class MusicVideosComponent implements OnInit {
  busyGettingData = false;
  getlive: any;
  totalCount: number = 0;

  @HostListener("window:scroll", ["$event"])
  //   onResize(event: any) {
  //     if (window.pageYOffset > 270 && !this.agehide && !this.parentaltest && this.lock1) {
  //       this.vid1.pause();
  //       this.playing = true;
  //     } else if (!this.agehide && !this.parentaltest && this.lock1) {
  //       this.vid1.play();
  //       this.playing = false;
  //     }
  // }
  onResize(event: any) {
    // $(window).scroll(() =>{
    //   var scroll = $(window).scrollTop();
    //   scroll > 270 ? this.vid1.pause() : this.vid1.play()
    // })

    var scroll = $(window).scrollTop();

    if (scroll >= 270 && !this.parentaltest && this.lock1 && !this.agehide) {
      this.vid1.pause();
      this.playing = true;
    } else if (!this.parentaltest && this.lock1 && !this.agehide) {
      if(localStorage.getItem('videoPlay') == '0') {
        this.vid1.play();
        this.playing = false;
      }
    }
  }
  // doSomething(event: any) {
  //   if (window.pageYOffset > 270 && !this.agehide && !this.parentaltest && this.lock1) {
  //     this.vid1.pause();
  //     this.playing = true;
  //   } else if (!this.agehide && !this.parentaltest && this.lock1) {
  //     this.vid1.play();
  //     this.playing = false;
  //   }
  // }
  user: any;
  newUser: any;
  mainData: any;
  FavoriteData: any = [];
  isOttLoggedIn = false;
  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  windowSize: number = 0;
  display_offset: number = 0;
  display_limit: number = 4;
  new_offset: number = 12;
  display_count: number = 0;
  homeData: any;
  cat_id: any;
  category_id: any;
  video: any;
  m3u8Main: any;
  getFaqData:any=[];
  idd1: any;
  vid1: any;
  timeZoneOffset: any;
  parentaltest: boolean = false;
  getAgeDuration: any;
  getBrowserName: any
  isSubscribed: any;
  lock1: boolean = true;
  video1: any;
  video2: any;
  contentId: any;
  idd: any;
  gettitle: any;
  videoJsData: any;
  recapSeconds: any;
  recapSeconds1: any;
  creditSeconds: any;
  creditSeconds1: any;
  playVid: any;
  introSeconds: any;
  userId: any;
  introSeconds1: any;
  getres: any;
  agehide = false;
  successs: any;
  getdrm: any;
  appsflyer: any;
  replay: boolean = true;
  token: any;
  playing: boolean = false;
  muted: boolean = true;
  lock: boolean = true;
  countryAllowed: any = [];
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isLoggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  vid: any;
  agefound: any;
  hellData: any = [];
  defaultImages: any = [];
  DefaultBanner: any;
  connected: boolean = true;
  USER_ACCOUNT_id:any
  navbarAd:any=[];
  navvar:any;
  app_version:any;
  ad_data:any
  seaonGet:any 
  getSeason:any 
  subscribedButton:any;
  subscribedButtonshow:any;
  constructor(
    private dialog: MatDialog,
    private _storage: StorageService,
    private _FPS: FingerPrintService,
    private fcs: FunctionCallingService,
    private auth: AuthService,
    private homeservice: HomeCategoryUtilsService,
    private DEC_SER: DecryptService,
    private _dd: DataService,
    private ed: ExchangeDataService,
    private _ar: ActivatedRoute,
    private http: HttpClient,
    private dep_ser: DecryptService,
    public router: Router,
    private ds: DataService,
    private deviceService: DeviceDetectorService,
    private networkConnectionService: NetworkConnectionService,
    private DEC_SCR_IOS: IosDecrycptionService
  ) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;
      }
    });
    // setTimeout(() => {
    //   this.getm3u8Url(this.idd.slice(9))
    // }, 1000);

  }

  ngOnInit(): void {
    this.networkConnectionService.connected$.subscribe(connect => {
      this.connected = connect;

      localStorage.setItem('videoPlay' , '0');
      // if (this.connected == true) {
      //   setTimeout(() => {
      //     this.vid1.currentTime(this.vid1.cache_.currentTime)

      //   }, 1000);
      // }
    })
    this.subscribedButton= localStorage.getItem('faqData');
    this.getFaqData=JSON.parse(this.subscribedButton);
    this.subscribedButtonshow=JSON.parse(this.subscribedButton).Website[0].subscription_btn
    this.getBrowserName = this.detectBrowserName()

    setTimeout(() => {
      $("#ageRestrict").hide();
    }, 1000);

    // $('.vjs-overlay').hide()
    this.defaultImages = localStorage.getItem("defaultImages");
    this.DefaultBanner = JSON.parse(this.defaultImages).rectangle.path;
    window.scroll(0, 0);
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    this.windowSize = window.innerWidth;
    this.homeservice.castUser.subscribe((user) => (this.user = user));
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }


    if (this.user == 0) {
      this._ar.paramMap.subscribe((params) => {
        this.cat_id = params.get("id");
        this.category_id = params.get("id");
        this.ds
          .getHomeData(this.display_offset, this.display_limit, this.cat_id)
          .subscribe((res: any) => {
            this.dep_ser.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.dep_ser.decryptData);

            this.homeData = decryptData;
            this.homeservice.sendDataToComponent(this.homeData);
            this.mainData = this.homeData.dashboard.home_category;
            const taplogininfo: any = localStorage.getItem("taploginInfo");
            const USER_ACCOUNT: any = JSON.parse(taplogininfo);


            if (USER_ACCOUNT) {
              this._dd
                .getHomeFavorites(USER_ACCOUNT.id)
                .subscribe((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);
                    this.FavoriteData = decryptData.content_id;
                    this.mainData.forEach((ele: any) => {
                      ele.cat_cntn.forEach((data: any) => {
                        for (let i in this.FavoriteData) {
                          if (data.id == this.FavoriteData[i]) {
                            data.is_favourite = 1;
                          }
                        }
                      });
                    });
                  }
                });
            }

            const ipDetail: any = localStorage.getItem("ipSaveData");
            const detail = JSON.parse(ipDetail);
            this.hellData = [];
            this.mainData[0].cat_cntn.map((category: any) => {


              this.hellData.push({
                content_id: category.id,
                is_favourite: category.is_favourite,
              });

              if (category.content_publish.length) {
                for (let i in category.content_publish) {
                  this.countryAllowed.push(category.content_publish[i].country_code);
                }
                var a = this.countryAllowed.indexOf(detail.countryCode);
                if (a == -1 && category.content_publish[0].country_code != "A") {
                  category.trailer_url=''
                } 
              }

            });
            this.getMusicData();
            this._dd
              .getDescriptionDataList(0, this.category_id)
              .pipe(
                map((res: any) => {
                  this.DEC_SER.getDecryptedData(res?.result);
                  let decryptData = JSON.parse(this.DEC_SER.decryptData);
                  this.totalCount = decryptData.totalCount

                })
              )
              .subscribe();
          });
      });
    } else {
      this.mainData = this.user.dashboard.home_category;
      this.mainData.filter((data: any) => {
        if (data.category_type == "list") {
          this.category_id = data.cat_id;
        }
      });
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      const USER_ACCOUNT: any = JSON.parse(taplogininfo);
      if (USER_ACCOUNT) {
        this._dd.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.FavoriteData = decryptData.content_id;
            this.mainData.forEach((ele: any) => {
              ele.cat_cntn.forEach((data: any) => {
                for (let i in this.FavoriteData) {
                  if (data.id == this.FavoriteData[i]) {
                    data.is_favourite = 1;
                  }
                }
              });
            });
          }
        });
      }
      this.hellData = [];
      this.mainData[0].cat_cntn.map((category: any) => {


        this.hellData.push({
          content_id: category.id,
          is_favourite: category.is_favourite,
        });

      });
      this.getMusicData();
      this._dd
        .getDescriptionDataList(0, this.category_id)
        .pipe(
          map((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.totalCount = decryptData.totalCount

          })
        )
        .subscribe();
    }
    this.timeZoneOffset = new Date();
    this.app_version= localStorage.getItem('appVersion')
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

  add(add: any, id: any, cat_id: any,category:any,title:any) {
    if (id.is_favourite == 1 && this.isOttLoggedIn) {
      id.is_favourite = 0;
    
    } else if (this.isOttLoggedIn) {
      id.is_favourite = 1;

    }

    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {

      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("content_id", id.id);
        formData.append("watchlist", id.is_favourite);
        formData.append("content_type", "video");
        formData.append("cat_id", id.category_ids[0]);
        this._dd.addRemoveToWatchList(formData).subscribe((res) => { });
      }
    } else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });
    }
  }
  onScroll() {
    if (this.busyGettingData) {
      return;
    }
    this.busyGettingData = true;
    let dataCount = 0;
    this.mainData.filter((data: any) => {
      if (data.category_type == "list") {
        data.cat_cntn.forEach((element: any) => {
          if ("id" in element) {
            dataCount++;
          }
        });
      }
    });
    if (this.totalCount == 0) {
      this._dd
        .getDescriptionDataList(0, this.category_id)
        .pipe(
          map((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.totalCount = decryptData.totalCount
            if (this.totalCount > dataCount) {
              this._dd
                .getDescriptionDataList(this.new_offset, this.category_id)
                .pipe(
                  map((res: any) => {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);

                    this.new_offset = decryptData.offset
                    this.display_offset = decryptData.offset;
                    this.busyGettingData = false
                    this.mainData.filter((data: any) => {
                      if (data.category_type == 'list') {
                        decryptData.content.forEach((ele: any) => {
                          data.cat_cntn.push(ele)
                        });
                        this.getMusicData()
                      }
                    });

                  })
                )
                .subscribe();
            }

          })
        )
        .subscribe();

    }
    if (this.totalCount > dataCount) {
      this._dd
        .getDescriptionDataList(this.new_offset, this.category_id)
        .pipe(
          map((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.new_offset = decryptData.offset;
            this.display_offset = decryptData.offset;
            this.busyGettingData = false;
            this.mainData.filter((data: any) => {
              if (data.category_type == "list") {
                decryptData.content.forEach((ele: any) => {
                  data.cat_cntn.push(ele);
                });
                this.getMusicData();
              }
            });

          })
        )
        .subscribe();
    }

  }
  navigate(event: any) {
    const ipDetail: any = localStorage.getItem("ipSaveData");
    localStorage.setItem('CreatOrderC_id' , event.id);
    const detail = JSON.parse(ipDetail);
    const subs = localStorage.getItem("ott_subscriptionPlan");
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    if (Object.keys(userInfo).length) {
      if (subs != null && JSON.parse(subs).packages_list.length) {
        const formData: any = new FormData();
        const userInfo: any = localStorage.getItem("taploginInfo") || {};
        const visitorIds : any = localStorage.getItem('device_id')
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("session_status", 1);
        formData.append("device", "web");
        formData.append(
          "device_count",
          JSON.parse(subs).packages_list[0].device_restriction
        );
        formData.append(
          "type",
          JSON.parse(subs).packages_list[0].restriction_type
        );
        this.auth.isAllowed(formData).subscribe((res) => {

          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);

              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
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
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);

              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
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
        });
      } else {
        const formData: any = new FormData();
        const userInfo: any = localStorage.getItem("taploginInfo") || {};
        const visitorIds : any = localStorage.getItem('device_id')
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("session_status", "");
        formData.append("device", "");
        formData.append("device_count", "");
        formData.append("type", "");
        this.auth.isAllowed(formData).subscribe((res) => {

          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            if (event.content_publish.length) {
              for (let i in event.content_publish) {

              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
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
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);

              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
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
          } else if (res.code == 3) {
            this._dd
              .getUserSubscriptionDetails(JSON.parse(userInfo).id)
              .subscribe((res) => {
                this.DEC_SER.getDecryptedData(res.result);
                const data: any = JSON.parse(this.DEC_SER.decryptData);

                if (data.is_subscriber == 1) {
                  this.ed.isSubscribe.next(true);
                  this.ed.alreadySubscriber.next(true);
                  localStorage.setItem("is_subscriber", "1");
                  this.ed.parentalLock.next(false);
                } else if (data.is_subscriber == 0) {
                  localStorage.setItem("is_subscriber", "0");
                  this.ed.parentalLock.next(true);
                }
                this._storage.setData("ott_subscriptionPlan", data);
                if (event.content_publish.length) {
                  for (let i in event.content_publish) {
                    this.countryAllowed.push(
                      event.content_publish[i].country_code
                    );

                  }
                  var a = this.countryAllowed.indexOf(detail.countryCode);
                  if (a == -1 && event.content_publish[0].country_code != "A") {
                    const dialogRef = this.dialog.open(
                      CountryLockPopupComponent,
                      {
                        backdropClass: "popupBackdropClass",
                        panelClass: "adultAgePopup",
                        width: "390px",
                      }
                    );
                  } else {
                    this.router.navigate(["/" + event.permalink]);
                  }
                } else {
                  this.router.navigate(["/" + event.permalink]);
                }
              });
          }
        });
      }
    } else {
      if (event.content_publish.length) {
        for (let i in event.content_publish) {
          this.countryAllowed.push(event.content_publish[i].country_code);

        }
        var a = this.countryAllowed.indexOf(detail.countryCode);
        if (a == -1 && event.content_publish[0].country_code != "A") {
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
  }

  addEpisodeToWatchlist(watcher: any, cat_id: any, content_id: any) {
    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {
      this.hellData.map((category: any) => {
        if (category.content_id == content_id) {
          category.is_favourite = watcher;
        }
      });

      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("content_id", content_id);
        formData.append("watchlist", watcher);
        formData.append("content_type", "video");
        formData.append("cat_id", cat_id);
        this._dd.addRemoveToWatchList(formData).subscribe((res) => {
          // this.getWatchlistData();
        });
      }
    } else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });
    }
  }

  agepopup() {
    const dialogRef = this.dialog.open(AdultAgePopupComponent, {
      panelClass: "adultAgePopup",
      width: "500px",
      data: { dat: event },
    });

    setTimeout(() => {
      this.getm3u8Url(this.idd1.slice(9))
    }, 500);
    setTimeout(() => {
      this.vid1.src({
        src: this.m3u8Main,
      });

    }, 1500);

    const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
      this.agehide = false;
      $(`#${this.idd}`).find(".iconlayout").show();
      $(`#${this.idd1}`).find(".iconlayout").show();
      $(".iconage").hide();

      this.vid1.play();
    });
    // var btnn = document.getElementsByClassName("btn-two")[0];
    // btnn.addEventListener("click", () => {

    // });
  }

  changeVideoAndBanner(v111: any, v222: any) {
    this.replay = true;
    this.agehide = false;
    //setTimeout(() => {
      // for (let key in videoJs.getPlayers()) {

      //   delete videoJs.getPlayers()[key];
  
        
      // }
    //}, 1000);
  


    
    

    this.getm3u8Url(v222.slice(5))
    this.vid = videoJs(v111);
    this.vid.load();
    this.vid1.load()
    this.vid1 = videoJs(v222);
    setTimeout(() => {
      this.vid1.src({
        src: this.m3u8Main,
      });
    }, 500);
   

  

    this.vid1.seekButtons({
      forward: 10,
      back: 10,
    });

    this.vid1.overlay({
      overlays: [
        {
          start: "playing",
          content: this.gettitle.split("/").join(" "),
          align: "center",
        },
      ],
    });

    $(".vjs-overlay-center").hide();

    this.vid1.on("pause", () => {
      this.playing = true;
    });

    this.vid1.on("play", () => {
      this.playing = false;
      $(".lock6").hide();
    });

    $(".vjs-mute-control").on("click", () => {
      if (this.muted == true) {
        this.unmutebtn()
        this.muted == true;
      } else {
        this.mutebtn()
        this.muted == false;
      }
    });

    this.vid1.on("volumechange", () => {
      var vol = this.vid1.volume();
      if (vol == 0) {
        this.muted = true;
      } else {
        this.muted = false;
      }
    });

    // if(this.isSubscribed){
    //   this.vid1.attr('loop');
    // }
    // if (this.isSubscribed) {
    //   if (this.mainData[0].replay != 1) {
    //     var replay = $("video");
    //     for (let reloop of replay) $(reloop).attr("loop", "true");
    //   }
    // }

    let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
    if (this.mainData[0]["auto_play"] == 1) {
      if (this.isSubscribed && isLoggedIn) {
        $(".iconage").hide();
        this.agehide = false;
        this.parentalset(this.agefound, this.idd);
        // if (this.mainData[0].replay != 1) {
        //   var replay = $("video");
        //   for (let reloop of replay) $(reloop).attr("loop", "true");
        // }
      } else if (!this.isSubscribed && isLoggedIn) {
        $(".iconage").hide();
        this.agehide = false;
        setTimeout(() => {
          this.vid1.play();
        }, 500);

        this.vid1.volume(0);
      } else {
        if (this.agefound.slice(3) >= 18 && this.agefound.slice(3) != 999) {
          this.agehide = true;
          $(`#${this.idd}`).find(".iconlayout").hide();
          this.vid1.pause();
          const dialogRef = this.dialog.open(AdultAgePopupComponent, {
            panelClass: "adultAgePopup",
            width: "500px",
            data: { dat: event },
          });

          const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
            $(`#${this.idd}`).find(".iconlayout").show();
            $(`#${this.idd}`).find(".iconage").hide();
            this.agehide = false;
            this.vid1.play();
            this.vid1.volume(0);
          });
          // var btnn = document.getElementsByClassName("btn-two")[0];
          // btnn.addEventListener("click", () => {

          // });
        } else if (this.agefound.slice(3) == -1) {
          this.agehide = true;
          $(`#${this.idd}`).find(".iconlayout").hide();
          this.vid1.pause();
          const dialogRef = this.dialog.open(AdultAgePopupComponent, {
            panelClass: "adultAgePopup",
            width: "500px",
            data: { dat: event },
          });

          const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
            $(`#${this.idd}`).find(".iconlayout").show();
            $(`#${this.idd}`).find(".iconage").hide();
            this.agehide = false;
            this.vid1.play();
            this.vid1.volume(0);
          });
          // var btnn = document.getElementsByClassName("btn-two")[0];
          // btnn.addEventListener("click", () => {

          // });
        } else {
          let xc = window.innerWidth;
          if (xc < 576) {
            $(`#${this.idd}`).find(".iconlayout").show();
            setTimeout(() => {
              this.vid1.play();
            }, 1000);
            this.vid1.volume(0);
          } else {
            $(`#${this.idd}`).find(".iconlayout").show();

            setTimeout(() => {
              this.vid1.play();
            }, 500);

            this.vid1.volume(0);
          }
        }
      }
    } else {
      if (this.isSubsInfo == 1) {
        this.parentaltest = true;
        this.agehide = false;
        $(".age").show();
        $(".iconage").hide();
        $(".iconlayout").hide();
        $(".parent-layout").hide();
        $(".agecon").hide();
      } else {
        this.agehide = true;
        // setTimeout(() => {
        //   $(".iconage").hide();
        // }, 3000);

        $(".iconlayout").hide();
        $(".parent-layout").hide();
        $(".iconn").show();
      }
    }

    // this.vid1.play();
    this.vid1.muted(true);
    this.muted = true;
    this.vid1.on("play", () => {
      this.lock = true;
      this.lock1 = true;
      $(this.vid1.posterImage.contentEl()).hide();
      this.playing = false;
    });

    this.vid1.on("ended", () => {
      $(this.vid1.posterImage.contentEl()).css("filter", "brightness(20%)");
      this.replay = false;
      this.vid1.exitFullscreen();
      $(this.vid1.posterImage.contentEl()).show();
      $(`#${this.idd}`).find(".iconlayout").hide();
      $(".iconage").hide();
      this.lock1 = false;
    });

    let xc = window.innerWidth
    if (xc < 920) {
      this.vid1 = videoJs(v222)
      this.vid1.src({
        type: this.m3u8Main,
      });
      this.vid1.hlsQualitySelector()
    } else {
      if (this.getBrowserName == 'firefox') {
        if (this.vid1) {
          this.vid1.qualityMenu();
        }
      } else if (this.getBrowserName == 'safari') {
        if (this.vid1) {
          this.vid1.qualityMenu();
        }
      } else {
        if (this.vid1) {
          this.vid1.hlsQualitySelector();
        }
      }
    }
  }

  getMusicData() {
    this.mainData.map((category: any) => {
      if (category.multiple_layout != null) {
        let selectedLayout: any = {};

        selectedLayout = category.multiple_layout.find(
          (multi: any) => multi.platform === "web"
        );
        if (selectedLayout !== undefined) {
          category.layout = selectedLayout.layout;
          category.cat_cntn.forEach((cat: any) => {
            cat.sliderImg = "";
            cat.sliderIdentifier = "";
            if (cat.is_group == 1 && cat.groupInfo != null) {
              if (category.category_type == "feature_banner") {
                if (cat.groupInfo.global_thumb != null) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                } else if (cat.groupInfo.season_banner != null) {
                  cat.groupInfo.season_banner.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 854) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }
              } else if (category.category_type == "list") {
                if (cat.groupInfo.global_thumb != null) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                } else if (cat.groupInfo.thumbs != null) {
                  cat.groupInfo.thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854
                          ) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier =
                              thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }
              }
            } else if (cat.is_group == 0) {
              if (cat.layout_thumbs != null) {
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == "square") {
                    thumb.layout = "circle";
                  }
                  if (thumb.layout == selectedLayout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (category.category_type == "feature_banner") {
                        if (Number(img.width) == 854) {
                          cat.sliderImg = img.url;
                          cat.sliderIdentifier = img.identifier;
                        } else if (cat.sliderImg == "") {
                          cat.sliderImg = thumb?.image_size[0].url;
                          cat.sliderIdentifier =
                            thumb?.image_size[0].identifier;
                        }
                      } else if (category.category_type == "list") {
                        if (
                          Number(img.width) == 360 ||
                          Number(img.width) == 854
                        ) {
                          cat.sliderImg = img.url;
                          cat.sliderIdentifier = img.identifier;
                        } else if (cat.sliderImg == "") {
                          cat.sliderImg = thumb?.image_size[0].url;
                          cat.sliderIdentifier =
                            thumb?.image_size[0].identifier;
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    });

  }
  slideConfig = {
    slidesToShow: 1,
    dots: true,
    arrows: true,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    // adaptiveHeight: !0,
    swipe: false,
    swipeToSlide: false,
    touchMove: false,
    draggable: false,
    accessibility: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          swipe: true,
          dots: true,
          arrows: true,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
        },
      },
    ],
  };
  setpin(getid: any) {
    this.parentaltest = true;
    $(`#${getid}`).find(".iconlayout").hide();
    if (this.mainData[0]["auto_play"] == 1) {
      $(`#${getid}`).find(".iconage").show();
      this.vid1.pause();
    }

    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow='auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        if (this.mainData[0]["auto_play"] == 0) {
          $(`#${this.idd1}`).find(".iconlayout").show();

          $(`#${this.idd}`).find(".iconlayout").show();
          $(".iconage").hide();
        }
        this.parentaltest = false;
        $(".iconage").hide();
        $(`#${getid}`).find(".iconlayout").show();
        $(`#${getid}`).find(".iconage").hide();
        this.vid1.play();
        this.vid1.volume(0);
      }
    });
  }

  IsAutoplay() {
    this.vid1.play();
    $(`#${this.idd1}`).find(".iconlayout").show();

    $(`#${this.idd}`).find(".iconlayout").show();
    this.parentaltest = false;
    $(".iconage").hide();
    this.agehide = false;
    this.vid1.play();
    this.vid1.volume(0);
  }

  parentalset(ageget: any, idset: any) {
    var pinsetid = idset;
    var isSubscriberUser: any = localStorage.getItem("is_subscriber");
    var parental: any = localStorage.getItem("taploginInfo");
    var parental_read = JSON.parse(parental);
    this.parentaltest = parental_read.is_parental;
    if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
      // if (Number(parental_read.restriction_level) == -1) {
      //   this.setpin(pinsetid);
      // } else if (Number(parental_read.restriction_level) == 999) {
      //   var xc = window.innerWidth;
      //   if (xc < 576) {
      //     setTimeout(() => {
      //       this.vid1.play();
      //     }, 100);
      //   } else {
      //     setTimeout(() => {
      //       this.vid1.play()
      //     }, 1000);
      //   }

      //   this.vid1.volume(0);
      //   this.agehide = false;
      //   this.parentaltest = false;
      //   if (this.mainData[0]["auto_play"] == 0) {
      //     $(`#${this.idd1}`).find(".iconlayout").show();

      //     $(`#${this.idd}`).find(".iconlayout").show();
      //     $(".iconage").hide();
      //   }
      // } else if (
      //   (Number(parental_read.restriction_level) >= 18 &&
      //     Number(parental_read.restriction_level) < 999 &&
      //     Number(ageget.slice(3)) == 999) ||
      //   (Number(parental_read.restriction_level) >= 18 &&
      //     Number(parental_read.restriction_level) < 999 &&
      //     Number(ageget.slice(3)) == 16)
      // ) {
      //   var xc = window.innerWidth;
      //   if (xc < 576) {
      //     setTimeout(() => {
      //       this.vid1.play();
      //     }, 100);
      //   } else {
      //     setTimeout(() => {
      //       this.vid1.play()
      //     }, 1000);
      //   }

      //   this.vid1.volume(0);
      //   this.agehide = false;
      //   this.parentaltest = false;
      //   if (this.mainData[0]["auto_play"] == 0) {
      //     $(`#${this.idd1}`).find(".iconlayout").show();

      //     $(`#${this.idd}`).find(".iconlayout").show();
      //     $(".iconage").hide();
      //   }
      // } else if (
      //   Number(parental_read.restriction_level) >= 18 &&
      //   Number(parental_read.restriction_level) < 999
      // ) {
      //   this.setpin(pinsetid);
      // } else if (
      //   Number(parental_read.restriction_level) >= 16 &&
      //   Number(parental_read.restriction_level) < 999 &&
      //   Number(ageget.slice(3)) == 999
      // ) {
      //   var xc = window.innerWidth;
      //   if (xc < 576) {
      //     setTimeout(() => {
      //       this.vid1.play();
      //     }, 100);
      //   } else {
      //     setTimeout(() => {
      //       this.vid1.play()
      //     }, 1000);
      //   }
      //   this.vid1.volume(0);
      //   this.agehide = false;
      //   this.parentaltest = false;
      //   if (this.mainData[0]["auto_play"] == 0) {
      //     $(`#${this.idd1}`).find(".iconlayout").show();

      //     $(`#${this.idd}`).find(".iconlayout").show();
      //     $(".iconage").hide();
      //   }
      // } else {
      //   this.setpin(pinsetid);
      // }
      if (Number(parental_read.restriction_level) == -1) {
        this.setpin(pinsetid)
      } else if (Number(parental_read.restriction_level) == 999) {
        var xc = window.innerWidth
        if (xc < 576) {
          setTimeout(() => {
            this.vid1.play()
          }, 1000);
        } else {
          setTimeout(() => {
            this.vid1.play()
          }, 1000);

        }

        setTimeout(() => {
          $('.iconage').hide()
        }, 500);

        this.vid1.volume(0);
        this.agehide = false;
        this.parentaltest = false
        if (this.mainData[0]['auto_play'] == 0) {
          $(`#${this.idd1}`).find(".iconlayout").show();

          $(`#${this.idd}`).find(".iconlayout").show();
          $('.iconage').hide()
        }
      } else if (Number(parental_read.restriction_level) < 999) {
        if (Number(ageget.slice(3)) == 999) {
          var xc = window.innerWidth
          if (xc < 576) {
            setTimeout(() => {
              this.vid1.play()
            }, 1000);
          } else {
            setTimeout(() => {
              this.vid1.play()
            }, 1000);

          }

          setTimeout(() => {
            $('.iconage').hide()
          }, 500);

          this.vid1.volume(0);
          this.agehide = false;
          this.parentaltest = false
          if (this.mainData[0]['auto_play'] == 0) {
            $(`#${this.idd1}`).find(".iconlayout").show();

            $(`#${this.idd}`).find(".iconlayout").show();
            $('.iconage').hide()
          }
        } else if (Number(ageget.slice(3)) >= Number(parental_read.restriction_level) || Number(ageget.slice(3)) == -1) {
          this.setpin(pinsetid)
        } else {
          var xc = window.innerWidth
          if (xc < 576) {
            setTimeout(() => {
              this.vid1.play()
            }, 1000);
          } else {
            setTimeout(() => {
              this.vid1.play()
            }, 1000);

          }

          setTimeout(() => {
            $('.iconage').hide()
          }, 500);

          this.vid1.volume(0);
          this.agehide = false;
          this.parentaltest = false
          if (this.mainData[0]['auto_play'] == 0) {
            $(`#${this.idd1}`).find(".iconlayout").show();

            $(`#${this.idd}`).find(".iconlayout").show();
            $('.iconage').hide()
          }
        }
      }
    } else {
      var xc = window.innerWidth;
      if (xc < 576) {
        setTimeout(() => {
          this.vid1.play();
        }, 500);
      } else {
        setTimeout(() => {
          this.vid1.play();
        }, 500);
      }
      this.agehide = false;
      this.parentaltest = false;
      this.vid1.volume(0);

      setTimeout(() => {
        $(".parentalicon").hide();

        $(".iconage").hide();
      }, 100);
    }
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  slickInit(_e: any, id: any) {


    setTimeout(() => {
      this.getm3u8Url(this.idd1.slice(9))
    }, 500);
    setTimeout(() => {
      this.vid1.src({
        src: this.m3u8Main,
      });

    }, 1500);

    setTimeout(() => {
      var title = $(`#${this.idd1}`).find("#titleget")[0].className;
      let ip: any = localStorage.getItem("ipSaveData");

    }, 1000);

    let xc = window.innerWidth;
    if (xc < 576) {
      // setTimeout(() => {
      $(".getre").hide();
      if (id == 0) {
        let xc = window.innerWidth;
        if (xc < 576) {
          $("#ageRestrict").hide();
          $(".getre").hide();
        }
        // setTimeout(() => {
        //   var options1 = {
        //     seekLeft: {
        //       handleClick: () => {
        //         const time = Number(this.vid1.currentTime()) - 10;

        //         this.vid1.currentTime(time);
        //       },
        //       doubleTap: true,
        //     },
        //     // play: {
        //     //   handleClick: () => {
        //     //     if (this.player.paused()) {
        //     //       this.player.play();
        //     //     } else {
        //     //       this.player.pause();
        //     //     }
        //     //   },
        //     // },
        //     seekRight: {
        //       handleClick: () => {
        //         const time = Number(this.vid1.currentTime()) + 10;

        //         this.vid1.currentTime(time);
        //       },
        //       doubleTap: true,
        //     },
        //     lockButton: false
        //   }

        //    this.vid1.touchOverlay(options1)

        // }, 100);

        // setTimeout(() => {
        //   $('.vjs-overlay').hide()
        // }, 130);
        setTimeout(() => {
          this.vid1.seekButtons({
            forward: 10,
            back: 10,
          });

          var title = $(`#${this.idd1}`).find("#titleget")[0].className;
          var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;
          this.getlive = $(`#${this.idd1}`).find("#liveget")[0].className;
          this.seaonGet = $(`#${this.idd1}`).find("#saesonGet")[0].className;
          this.getSeason = $(`#${this.idd1}`).find("#saesonSend")[0].className;
          this.getres = ageget.slice(3);
          setTimeout(() => {
            $("#ageRestrict").appendTo($(`#music${this.idd1.slice(9)}`));
            
          }, 1000);

          this.vid1.overlay({
            overlays: [
              {
                start: "playing",
                content: title.split("/").join(" "),
                align: "center",
              },
            ],
          });

          $(".vjs-overlay-center").hide();

          this.vid1.on("pause", () => {
            this.playing = true;
          });

          this.vid1.on("play", () => {
            this.playing = false;
            $(".lock6").hide();
          });
        }, 500);

        let isLoggedInfound = localStorage.getItem("ott_isLoggedIn");
        if (!this.isSubscribed && !isLoggedInfound) {
          setTimeout(() => {
            var nPlayer = _e.slick.currentSlide + 1;
            var videoParentId = $(".carousel").find(".cardvideo")[nPlayer].id;
            var icc = $(`#${videoParentId}`).parent().attr("id");

            if (icc && ageget.slice(3) != 16 && ageget.slice(3) != 999) {
              $(`#${icc}`).find(".iconage").show();
            }
          }, 500);
        }

        $(".iconage").hide();
        this.video = $(".carousel .slick-active").find("video")[0].id;

        this.idd1 = $(`#${this.video}`).parent().attr("id");

        $(`#${this.idd1}`).find(".iconlayout").show();
        this.vid1 = videoJs(this.video);
        // if(this.isSubscribed){
        //   this.vid1.attr('loop');
        // }
        // $('video').attr(attribute)

        $(".vjs-mute-control").on("touchend", () => {
          if (this.muted == true) {
            this.unmutebtn()
            this.muted == true;
          } else {
            this.mutebtn()
            this.muted == false;
          }
        });
        if (this.getBrowserName == 'firefox') {
          if (this.vid1) {
            this.vid1.qualityMenu();
          }
        } else if (this.getBrowserName == 'safari') {
          if (this.vid1) {
            this.vid1.qualityMenu();
          }
        } else {
          if (this.vid1) {
            this.vid1.hlsQualitySelector();
          }
        }
        this.vid1.on("volumechange", () => {
          var vol = this.vid1.volume();
          if (vol == 0) {
            this.muted = true;
          } else {
            this.muted = false;
          }
        });

        let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
        if (this.mainData[0]["auto_play"] == 1) {
          if (this.isSubscribed && isLoggedIn) {
            this.agehide = false;
            var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;
            $(".iconage").hide();
            this.agehide = false;
            this.parentalset(ageget, this.idd1);
            // var replay = $("video");
            // for (let reloop of replay) $(reloop).attr("loop", "true");
          } else if (!this.isSubscribed && isLoggedIn) {
            $(".iconage").hide();
            this.agehide = false;
            setTimeout(() => {
              this.vid1.play();
            }, 1000);
            this.vid1.volume(0);
          } else {
            var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;
            if (ageget.slice(3) >= 18 && ageget.slice(3) != 999) {
              this.agehide = true;
              $(`#${this.idd1}`).find(".iconlayout").hide();
              this.vid1.pause();
              const dialogRef = this.dialog.open(AdultAgePopupComponent, {
                panelClass: "adultAgePopup",
                width: "500px",
                data: { dat: event },
              });

              const sub = dialogRef.componentInstance.sen.subscribe(
                (data: any) => {
                  $(`#${this.idd1}`).find(".iconlayout").show();
                  $(".iconage").hide();
                  this.agehide = false;
                  this.vid1.play();
                  this.vid1.volume(0);
                }
              );
              // var btnn = document.getElementsByClassName("btn-two")[0];
              // btnn.addEventListener("click", () => {

              // });
            } else if (ageget.slice(3) == -1) {
              this.agehide = true;
              $(`#${this.idd1}`).find(".iconlayout").hide();
              this.vid1.pause();
              const dialogRef = this.dialog.open(AdultAgePopupComponent, {
                panelClass: "adultAgePopup",
                width: "500px",
                data: { dat: event },
              });

              const sub = dialogRef.componentInstance.sen.subscribe(
                (data: any) => {
                  $(`#${this.idd1}`).find(".iconlayout").show();
                  $(".iconage").hide();
                  this.agehide = false;
                  this.vid1.play();
                  this.vid1.volume(0);
                }
              );
              // var btnn = document.getElementsByClassName("btn-two")[0];
              // btnn.addEventListener("click", () => {

              // });
            } else {
              $(`#${this.idd1}`).find(".iconlayout").show();
              $(".iconage").hide();
              setTimeout(() => {
                this.vid1.play();
              }, 1000);
              this.vid1.volume(0);
            }
          }
        } else {
          if (this.isSubsInfo == 1) {
            this.parentaltest = true;
            this.agehide = false;
            $(".iconage").hide();
            $(".iconlayout").hide();
            $(`#${this.idd1}`).find(".iconage").show();
            // $(".parent-layout").hide();
            $(".agecon").hide();
          } else {
            this.agehide = true;
            // setTimeout(() => {
            //   $(".iconage").hide();
            // }, 3000);
            $(`#${this.idd1}`).find(".iconage").show();
            $(".iconlayout").hide();
            $(".parent-layout").hide();
            $(".iconn").show();
          }
        }

        // this.vid1.play();

        this.vid1.on("ended", () => {
          $(this.vid1.posterImage.contentEl()).css(
            "filter",
            "brightness(20%)"
          );
          this.vid1.exitFullscreen();
          this.lock1 = false;
          this.replay = false;
          $(this.vid1.posterImage.contentEl()).show();
          $(`#${this.idd1}`).find(".iconlayout").hide();
          $(".iconage").hide();
        });
      }
      // }, 2000);
    } else {
      $(".getre").hide();
      if (id == 0) {
     
        // setTimeout(() => {
        //   var options1 = {
        //     seekLeft: {
        //       handleClick: () => {
        //         const time = Number(this.vid1.currentTime()) - 10;

        //         this.vid1.currentTime(time);
        //       },
        //       doubleTap: true,
        //     },
        //     // play: {
        //     //   handleClick: () => {
        //     //     if (this.player.paused()) {
        //     //       this.player.play();
        //     //     } else {
        //     //       this.player.pause();
        //     //     }
        //     //   },
        //     // },
        //     seekRight: {
        //       handleClick: () => {
        //         const time = Number(this.vid1.currentTime()) + 10;

        //         this.vid1.currentTime(time);
        //       },
        //       doubleTap: true,
        //     },
        //     lockButton: false
        //   }

        //    this.vid1.touchOverlay(options1)

        // }, 100);

        // setTimeout(() => {
        //   $('.vjs-overlay').hide()
        // }, 130);
        setTimeout(() => {
          this.vid1.seekButtons({
            forward: 10,
            back: 10,
          });

          var title = $(`#${this.idd1}`).find("#titleget")[0].className;
          var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;
          this.getlive = $(`#${this.idd1}`).find("#liveget")[0].className;
          this.seaonGet = $(`#${this.idd1}`).find("#saesonGet")[0].className;
          this.getSeason = $(`#${this.idd1}`).find("#saesonSend")[0].className;
          this.getres = ageget.slice(3);
          setTimeout(() => {
            $("#ageRestrict").appendTo($(`#music${this.idd1.slice(9)}`));
          }, 1000);

          this.vid1.overlay({
            overlays: [
              {
                start: "playing",
                content: title.split("/").join(" "),
                align: "center",
              },
            ],
          });

          $(".vjs-overlay-center").hide();

          this.vid1.on("pause", () => {
            this.playing = true;
          });

          this.vid1.on("play", () => {
            this.playing = false;
            $(".lock6").hide();
          });
        }, 500);

        let isLoggedInfound = localStorage.getItem("ott_isLoggedIn");
        if (!this.isSubscribed && !isLoggedInfound) {
          setTimeout(() => {
            var nPlayer = _e.slick.currentSlide + 1;
            var videoParentId = $(".carousel").find(".cardvideo")[nPlayer].id;
            var icc = $(`#${videoParentId}`).parent().attr("id");

            if (icc && ageget.slice(3) != 16 && ageget.slice(3) != 999) {
              $(`#${icc}`).find(".iconage").show();
            }
          }, 500);
        }

        $(".iconage").hide();
        this.video = $(".carousel .slick-active").find("video")[0].id;

        this.idd1 = $(`#${this.video}`).parent().attr("id");

        $(`#${this.idd1}`).find(".iconlayout").show();
        this.vid1 = videoJs(this.video);
        // if(this.isSubscribed){
        //   this.vid1.attr('loop');
        // }
        // $('video').attr(attribute)

        $(".vjs-mute-control").on("click", () => {
          if (this.muted == true) {
            this.unmutebtn()
            this.muted == true;
          } else {
            this.mutebtn()
            this.muted == false;
          }
        });
        if (this.getBrowserName == 'firefox') {
          if (this.vid1) {
            this.vid1.qualityMenu();
          }
        } else if (this.getBrowserName == 'safari') {
          if (this.vid1) {
            this.vid1.qualityMenu();
          }
        } else {
          if (this.vid1) {
            this.vid1.hlsQualitySelector();
          }
        }
        this.vid1.on("volumechange", () => {
          var vol = this.vid1.volume();
          if (vol == 0) {
            this.muted = true;
          } else {
            this.muted = false;
          }
        });
        let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
        if (this.mainData[0]["auto_play"] == 1) {
          if (this.isSubscribed && isLoggedIn) {
            this.agehide = false;
            var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;
            $(".iconage").hide();
            this.agehide = false;
            this.parentalset(ageget, this.idd1);
            // var replay = $("video");
            // for (let reloop of replay) $(reloop).attr("loop", "true");
          } else if (!this.isSubscribed && isLoggedIn) {
            $(".iconage").hide();
            this.agehide = false;
            setTimeout(() => {
              this.vid1.play();
            }, 1000);
            this.vid1.volume(0);
          } else {
            var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;
            if (ageget.slice(3) >= 18 && ageget.slice(3) != 999) {
              this.agehide = true;
              $(`#${this.idd1}`).find(".iconlayout").hide();
              this.vid1.pause();
              const dialogRef = this.dialog.open(AdultAgePopupComponent, {
                panelClass: "adultAgePopup",
                width: "500px",
                data: { dat: event },
              });

              const sub = dialogRef.componentInstance.sen.subscribe(
                (data: any) => {
                  $(`#${this.idd1}`).find(".iconlayout").show();
                  $(".iconage").hide();
                  this.agehide = false;
                  this.vid1.play();
                  this.vid1.volume(0);
                }
              );
              // var btnn = document.getElementsByClassName("btn-two")[0];
              // btnn.addEventListener("click", () => {

              // });
            } else if (ageget.slice(3) == -1) {
              this.agehide = true;
              $(`#${this.idd1}`).find(".iconlayout").hide();
              this.vid1.pause();
              const dialogRef = this.dialog.open(AdultAgePopupComponent, {
                panelClass: "adultAgePopup",
                width: "500px",
                data: { dat: event },
              });

              const sub = dialogRef.componentInstance.sen.subscribe(
                (data: any) => {
                  $(`#${this.idd1}`).find(".iconlayout").show();
                  $(".iconage").hide();
                  this.agehide = false;
                  this.vid1.play();
                  this.vid1.volume(0);
                }
              );
              // var btnn = document.getElementsByClassName("btn-two")[0];
              // btnn.addEventListener("click", () => {

              // });
            } else {
              $(`#${this.idd1}`).find(".iconlayout").show();
              $(".iconage").hide();
              setTimeout(() => {
                this.vid1.play();
              }, 1000);
              this.vid1.volume(0);
            }
          }

          // this.vid1.play();

          this.vid1.on("ended", () => {
            $(this.vid1.posterImage.contentEl()).css(
              "filter",
              "brightness(20%)"
            );
            this.vid1.exitFullscreen();
            this.lock1 = false;
            this.replay = false;
            $(this.vid1.posterImage.contentEl()).show();
            $(`#${this.idd1}`).find(".iconlayout").hide();
            $(".iconage").hide();
          });
        } else {
          if (this.isSubsInfo == 1) {
            this.parentaltest = true;
            this.agehide = false;
            $(".iconage").hide();
            $(".iconlayout").hide();
            $(`#${this.idd1}`).find(".iconage").show();
            // $(".parent-layout").hide();
            $(".agecon").hide();
          } else {
            this.agehide = true;
            // setTimeout(() => {
            //   $(".iconage").hide();
            // }, 3000);
            $(`#${this.idd1}`).find(".iconage").show();
            $(".iconlayout").hide();
            $(".parent-layout").hide();
            $(".iconn").show();
          }
        }
      }
    }

    setTimeout(() => {
      var title = $(`#${this.idd1}`).find("#titleget")[0].className;
        if(this.mainData[0]['auto_play'] == 1){
                     }

    }, 2000);
  }

  breakpoint(_e: any) { }

  afterChange(_e: any, id: any) { 
    this.vid1.src({
      src: this.m3u8Main,
    });
    if(this.mainData[0]['auto_play'] == 1){
    }
  }

  beforeChange(_e: any, id: any) {
    $(this.vid1.posterImage.contentEl()).css("filter", "brightness(100%)");
    setTimeout(() => {
      var title = $(`#${this.idd1}`).find("#titleget")[0].className;
      let ip: any = localStorage.getItem("ipSaveData");
    
    }, 1000);

    let xc = window.innerWidth;
    if (xc < 576) {
      $("#ageRestrict").hide();
      $(".getre").hide();
    }

    $(".iconage").hide();
    $(".lock6").show();
    // setTimeout(() => {
    //   $('.vjs-overlay').hide()
    // }, 100);

    // if (id == 0) {
      this.lock1 = true;
      var cPlayer = _e.currentSlide + 1;
      var nPlayer = _e.nextSlide + 1;

      // var video1 = document.getElementById("home"+cPlayer);
      // var video2 = document.getElementById("home"+nPlayer);
      var videoID = $(".carousel").find("video");

      this.video1 = $(".carousel").find("video")[cPlayer].id;
      this.video2 = $(".carousel").find("video")[nPlayer].id;

      // var videoParentId = $('.carousel').find('.cardvideo')[cPlayer].id;
      var videoParentId = $(".carousel").find(".cardvideo")[nPlayer].id;

      this.idd = $(`#${videoParentId}`).parent().attr("id");
      this.agefound = $(`#${this.idd}`).find("#agegroup")[0].className;
      this.gettitle = $(`#${this.idd}`).find("#titleget")[0].className;
      this.getdrm = $(`#${this.idd}`).find("#getdrm")[0].className;
      this.getlive = $(`#${this.idd}`).find("#liveget")[0].className;
      this.seaonGet = $(`#${this.idd}`).find("#saesonGet")[0].className
      this.getSeason = $(`#${this.idd}`).find("#saesonSend")[0].className
      $(".iconlayout").hide();
      $(".iconage").hide();
      if (this.idd) {
        $(`#${this.idd}`).find(".iconlayout").show();
        if (this.agefound.slice(3) != 999 && this.agefound.slice(3) != 16) {
          $(`#${this.idd}`).find(".iconage").show();
        }

        if (this.mainData[0]["auto_play"] == 0) {
          setTimeout(() => {
            $(`#${this.idd}`).find(".iconage").show();
          }, 100);
        }
      }
      this.getres = this.agefound.slice(3);
      setTimeout(() => {
        $("#ageRestrict").appendTo($(`#music${this.idd.slice(9)}`));
      }, 1000);



      this.changeVideoAndBanner(this.video1, this.video2);
    // }
  }
  sharing(type: string, url: any) {

    const newLocal = "width=600,height=300";
    const share_url = url;
    if (type === "fb") {
      // let link = `https://www.facebook.com/sharer/sharer.php?app_id=2407604909394715&sdk=joey&u=${share_url}`;
      // let link = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faltp.faste.tv%2F${url}&amp;src=sdkpreparse`;
      let link = `https://www.facebook.com/sharer/sharer.php?&u=${share_url}`;
      window.open(link, "Facebook", newLocal);
    } else if (type === "tweet") {
      // let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=ALTBalaji%0Aaltp.faste.tv/${url}`;
      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=Altt%0A${url}`;

      window.open(urls, "TwitterWindow", newLocal);
    } else if (type === "copy") {
    }
  }

  addRemoveToWatchlist(watcher: any, cat_id: any, content_id: any) {
    this.contentId = content_id;
    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("content_id", content_id);
        formData.append("watchlist", watcher);
        formData.append("content_type", "video");
        formData.append("cat_id", cat_id);
        this._dd.addRemoveToWatchList(formData).subscribe((res) => { });
      }
    } else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });
    }
  }

  pausebtn() {
    this.vid1.pause();
    this.vid1.on("pause", () => {
      this.playing = true;
    });
  }

  replaybtn(getid: any) {
    $(this.vid1.posterImage.contentEl()).hide();
    $(`#${getid}`).find(".iconlayout").show();
    this.replay = true;
    this.vid1.play();
  }

  playbtn() {
    this.vid1.play();
    this.vid1.on("play", () => {
      this.playing = false;
    });
  }

  mutebtn() {
    this.vid1.muted(true);
    if (this.vid1.muted()) {
      this.muted = true;
      this.vid1.volume(0);
    }
  }

  unmutebtn() {
    this.vid1.muted(false);
    if (!this.vid1.muted()) {
      this.muted = false;
      this.vid1.volume(1);
    }
  }

  fullscreenbtn() {
    if (this.getlive.slice(4) == 1) {
      $(".vjs-progress-control").addClass("hideprogress");
      $(".vjs-seek-button").addClass("hideprogress");
      $(".vjs-play-control").addClass("hideprogress");
      $(".vjs-time-control").addClass("hideprogress");
      $(".vjs-notes-btn").addClass("hideprogress");
      $(".vjs-icon-previous-item").addClass("hideprogress");
      $(".vjs-icon-next-item").addClass("hideprogress");
    }
    setTimeout(() => {
      $(".vjs-notes-btn").attr("title", "Season-Selector");
      $(".vjs-icon-hd").attr("title", "Settings");
    }, 1000);
    setTimeout(() => {
      $("#ageRestrict").show();
      $(".getre").show();
    }, 500);

    setTimeout(() => {
      this.vid1.requestFullscreen();
      this.vid1.landscapeFullscreen();
    }, 300);

    this.vid1.on("fullscreenchange", (e: any) => {
     

      if (this.vid1.isFullscreen()) {
       
        this.vid1.on("timeupdate", () => {
          if (this.vid1.userActive() == false) {
            $(".vjs-overlay").hide();
          } else {
            $(".vjs-overlay").show();
          }
        });

        this.vid1.addClass("video-js");
        this.vid1.addClass("vjs-hls-quality-selector");
        this.vid1.controls(true);
        var gettime: any = localStorage.getItem("jsonPlayer");
        if (gettime != '') {
          this.getAgeDuration = JSON.parse(gettime).Player[0].UA_setting;
        }
        setTimeout(() => {
          setTimeout(() => {
            $(".getre").hide();
          }, this.getAgeDuration.duration_in_sec * 1000);
        }, 400);
     
      } else {
        setTimeout(() => {
          
            $("#ageRestrict").hide();
            $(".getre").hide();
        
        }, 100);
    
        $(".vjs-overlay").hide();
        this.vid1.on("timeupdate", () => {
          if (this.vid1.userActive() == true) {
            $(".vjs-overlay").hide();
          }
        });

        this.vid1.controls(false);
        this.vid1.removeClass("video-js");
        this.vid1.removeClass("vjs-hls-quality-selector");
      }
    });
  }
  getm3u8Url(id: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            this.m3u8Main = ""
            this.m3u8Main = decryptData.url;
          }
        })
      } else {
        this._dd.getMainUrl(id, "").subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            this.m3u8Main = ""
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
        this._dd.getMainUrl(id, "").subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.m3u8Main = decryptData.url;
         
            
          }
        })
      }
    }

  }

  onAnchorClick(event:any) {
    event.preventDefault();
  }

  videoJsPopup() {
    localStorage.setItem('CreatOrderC_id',this.videoJsData.id)
    this.getm3u8Url(this.videoJsData.id)
    setTimeout(() => {
      this.videoJsData.url = this.m3u8Main
    }, 600);
    setTimeout(() => {
      if (this.dialog.openDialogs.length == 0) {
        const alertRef = this.dialog.open(VideojsDialogComponent, {
          maxWidth: "100vw",
          panelClass: "videojsplayer",
          maxHeight: "100vh",
          height: "calc(100% - 100px)",
          width: "100%",
          data: { url: this.videoJsData },
        });
        alertRef.afterClosed().subscribe(result => {


        });
      };
    }, 1000);

  }

  playCarousel(data: any) {
    this.vid1.pause();
    // localStorage.setItem("tarilerplay", "1");
  
    const event = data;
    const aged = data.age_group;
    this.videoJsData = data;
    this.ed.pauseDetailVideo.next(true);
    let vb = localStorage.getItem("isOverAge");
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    const subs = localStorage.getItem("ott_subscriptionPlan");
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    if (Object.keys(userInfo).length) {
      if (subs != null && JSON.parse(subs).packages_list.length) {
        const formData: any = new FormData();
        const userInfo: any = localStorage.getItem("taploginInfo") || {};
        const visitorIds : any = localStorage.getItem('device_id')
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("session_status", 1);
        formData.append("device", "web");
        formData.append(
          "device_count",
          JSON.parse(subs).packages_list[0].device_restriction
        );
        formData.append(
          "type",
          JSON.parse(subs).packages_list[0].restriction_type
        );
        this.auth.isAllowed(formData).subscribe((res) => {

          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);
              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
                const dialogRef = this.dialog.open(CountryLockPopupComponent, {
                  backdropClass: "popupBackdropClass",
                  panelClass: "adultAgePopup",
                  width: "390px",
                });
              } else {
                this.verifyStatus(data, aged, event);
              }
            } else {
              this.verifyStatus(data, aged, event);
            }
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);
              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
                const dialogRef = this.dialog.open(CountryLockPopupComponent, {
                  backdropClass: "popupBackdropClass",
                  panelClass: "adultAgePopup",
                  width: "390px",
                });
              } else {
                this.verifyStatus(data, aged, event);
              }
            } else {
              this.verifyStatus(data, aged, event);
            }
          }
        });
      } else {
        const formData: any = new FormData();
        const userInfo: any = localStorage.getItem("taploginInfo") || {};
        const visitorIds : any = localStorage.getItem('device_id')
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("session_status", "");
        formData.append("device", "");
        formData.append("device_count", "");
        formData.append("type", "");
        this.auth.isAllowed(formData).subscribe((res) => {

          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);
              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
                const dialogRef = this.dialog.open(CountryLockPopupComponent, {
                  backdropClass: "popupBackdropClass",
                  panelClass: "adultAgePopup",
                  width: "390px",
                });
              } else {
                this.verifyStatus(data, aged, event);
              }
            } else {
              this.verifyStatus(data, aged, event);
            }
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (event.content_publish.length) {
              for (let i in event.content_publish) {
                this.countryAllowed.push(event.content_publish[i].country_code);
              }
              var a = this.countryAllowed.indexOf(detail.countryCode);
              if (a == -1 && event.content_publish[0].country_code != "A") {
                const dialogRef = this.dialog.open(CountryLockPopupComponent, {
                  backdropClass: "popupBackdropClass",
                  panelClass: "adultAgePopup",
                  width: "390px",
                });
              } else {
                this.verifyStatus(data, aged, event);
              }
            } else {
              this.verifyStatus(data, aged, event);
            }
          } else if (res.code == 3) {
            this._dd
              .getUserSubscriptionDetails(JSON.parse(userInfo).id)
              .subscribe((res) => {
                this.DEC_SER.getDecryptedData(res.result);
                const data: any = JSON.parse(this.DEC_SER.decryptData);

                if (data.is_subscriber == 1) {
                  this.ed.isSubscribe.next(true);
                  this.ed.alreadySubscriber.next(true);
                  localStorage.setItem("is_subscriber", "1");
                  this.ed.parentalLock.next(false);
                } else if (data.is_subscriber == 0) {
                  localStorage.setItem("is_subscriber", "0");
                  this.ed.parentalLock.next(true);
                }
                this._storage.setData("ott_subscriptionPlan", data);
                if (event.content_publish.length) {
                  for (let i in event.content_publish) {
                    this.countryAllowed.push(
                      event.content_publish[i].country_code
                    );
                  }
                  var a = this.countryAllowed.indexOf(detail.countryCode);
                  if (a == -1 && event.content_publish[0].country_code != "A") {
                    const dialogRef = this.dialog.open(
                      CountryLockPopupComponent,
                      {
                        backdropClass: "popupBackdropClass",
                        panelClass: "adultAgePopup",
                        width: "390px",
                      }
                    );
                  } else {
                    this.verifyStatus(data, aged, event);
                  }
                } else {
                  this.verifyStatus(data, aged, event);
                }
              });
          }
        });
      }
    } else {
      if (event.content_publish.length) {
        for (let i in event.content_publish) {
          this.countryAllowed.push(event.content_publish[i].country_code);
        }
        var a = this.countryAllowed.indexOf(detail.countryCode);
        if (a == -1 && event.content_publish[0].country_code != "A") {
          const dialogRef = this.dialog.open(CountryLockPopupComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "adultAgePopup",
            width: "390px",
          });
        } else {
          this.verifyStatus(data, aged, event);
        }
      } else {
        this.verifyStatus(data, aged, event);
      }
    }
  }
  verifyStatus(data: any, aged: any, event: any) {
    if (data.access_type == "free") {
      if (localStorage.getItem("taploginInfo") === null) {
        if (data.age_group == 18) {
          const dialogRef = this.dialog.open(AdultAgePopupComponent, {
            panelClass: "adultAgePopup",
            width: "500px",
            data: { dat: event },
          });
          const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
            this.playVid = data;
            if (this.playVid) {
              this.videoJsPopup();
            }
          });
        } else if (data.age_group == -1) {
          const dialogRef = this.dialog.open(AdultAgePopupComponent, {
            panelClass: "adultAgePopup",
            width: "500px",
            data: { dat: event },
          });
          const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
            this.playVid = data;
            if (this.playVid) {
              this.videoJsPopup();
            }
          });
        } else {
          this.videoJsPopup();
        }
      } else {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
        if (ottLogged == "1") {
          if (parental_read.is_parental == 0) {
            this.videoJsPopup();
          } else {
            // if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
            //   if (Number(aged) >= parental_read.restriction_level) {
            //     const dialogRef = this.dialog.open(ChechPinParentalComponent, {
            //       panelClass: "contactfooter",
            //       width: "390px",
            //     });

            //     dialogRef.afterClosed().subscribe((result) => {});
            //     const sub = dialogRef.componentInstance.isSuccess.subscribe(
            //       (e: any) => {
            //         this.successs = e;

            //         if (this.successs) {
            //           this.videoJsPopup();
            //         }
            //       }
            //     );
            //   } else {
            //     this.videoJsPopup();
            //   }
            // } else {
            //   this.videoJsPopup();
            // }
            if (parental_read.is_parental == 1 && isSubscriberUser == "1") {

              if (Number(parental_read.restriction_level) == -1) {
              
                this.showPin();
              } else if (Number(parental_read.restriction_level) == 999) {
             
                this.videoJsPopup();
              } else if (Number(parental_read.restriction_level) < 999) {
                if (Number(aged) == 999) {
               
                  this.videoJsPopup();
                } else if (Number(aged) >= Number(parental_read.restriction_level) || Number(aged) == -1) {
               
                  this.showPin();
                } else {
                
                  this.videoJsPopup();
                }
              }

            } else {
              this.videoJsPopup();
            }
          }
        } else {
          this.videoJsPopup();
        }
      }
    } else if (data.access_type == "paid") {
      if (this.isSubscribed == true) {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read.is_parental == 0) {
          this.videoJsPopup();
        } else {
          // if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
          //   if (Number(aged) >= Number(parental_read.restriction_level)) {
          //     const dialogRef = this.dialog.open(ChechPinParentalComponent, {
          //       panelClass: "contactfooter",
          //       width: "390px",
          //     });

          //     dialogRef.afterClosed().subscribe((result) => {});
          //     const sub = dialogRef.componentInstance.isSuccess.subscribe(
          //       (e: any) => {
          //         this.successs = e;

          //         if (this.successs) {
          //           this.videoJsPopup();
          //         }
          //       }
          //     );
          //   } else {
          //     this.videoJsPopup();
          //   }
          // } else {
          //   this.videoJsPopup();
          // }
          if (parental_read.is_parental == 1 && isSubscriberUser == "1") {

            if (Number(parental_read.restriction_level) == -1) {
        
              this.showPin();
            } else if (Number(parental_read.restriction_level) == 999) {
             
              this.videoJsPopup();
            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(aged) == 999) {
           
                this.videoJsPopup();
              } else if (Number(aged) >= Number(parental_read.restriction_level) || Number(aged) == -1) {
              
                this.showPin();
              } else {
                
                this.videoJsPopup();
              }
            }

          } else {
            this.videoJsPopup();
          }
        }
      } else if (this.isSubscribed == false) {
        this.router.navigate(["/subscribe"]);
      }
    }
  }
  showPin() {
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow='auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe(
      (e: any) => {
        this.successs = e;

        if (this.successs) {
          this.videoJsPopup();
        }
      }
    );
  }
 
  userInfo: any;
  userDetails: any;



  onImgError(event: any, type: any) {

    if (type == "circle") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    } else if (type == "rectangle_16x9") {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path;
    } else if (type == "vertical_9x16") {
      event.target.src = JSON.parse(this.defaultImages).vertical.path;
    }
  }

  newUsers(user: any) {
    this.homeservice.sendDataToComponent(this.newUser);
  }

  ngOnDestroy(): void {
    // delete videoJs.getPlayers()[`video-ls`];

    for (let key in videoJs.getPlayers()) {

      delete videoJs.getPlayers()[key];
    }
  }

  hoverWatchMain() {
    // $('.addwatchMain').hide()
    // $('.addwatchMainremove').show()
    $(".hide-carremove").hide();
  }

  hoverWatchRemoveMain() {
    // $('.addwatchMain').show()
    // $('.addwatchMainremove').hide()
  }
  hoverRemoveMain() {
    $(".removeMain").hide();
    $(".removeMainR").show();
    $(".hide-carremove").show();
  }
  hoverRemoveIconMain() {
    $(".removeMain").show();
    $(".removeMainR").hide();
    $(".hide-carremove").hide();
  }

  hoverShareMain() {
    $(".shareaddMain").hide();
    $(".shareremoveMain").show();
  }

  hoverShareRemoveMain() {
    $(".shareaddMain").show();
    $(".shareremoveMain").hide();
  }


  gotoSubscribePage(content:any,title:any){
    localStorage.removeItem("packcheking")
    if (localStorage.getItem("taploginInfo") === null) {
      
    } else {
      const taplogininfo: any = localStorage.getItem("taploginInfo")||{};
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo)||{};
      var userage:any=new Date(this.USER_ACCOUNT_id.dob)||{};
            var currentage:any=new Date()||{};
            var newage:any=new Date(currentage)||{}
            var age:any=newage-userage||{};
    }

  }
}