import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { IHomeCategory } from "../models/homecategory";
import { VideojsDialogComponent } from "src/app/shared/videojs-dialog/videojs-dialog.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { DataService } from "src/app/services/data.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DecryptService } from "src/app/services/decrypt.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { AuthService } from "src/app/services/auth.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { StorageService } from "src/app/services/storage.service";
import { AudioPlayerComponent } from "../audio-player/audio-player.component";
import { videoJs } from "src/app/video-player/videojs";
import { ParentalOtpCreateComponent } from "../dialogBoxes/parental-otp-create/parental-otp-create.component";
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
import { DeviceRestrictionPopupComponent } from "../dialogBoxes/device-restriction-popup/device-restriction-popup.component";
import { ContactusModalDialogComponent } from "../dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
import { DeleteAccountPopupComponent } from "../dialogBoxes/delete-account-popup/delete-account-popup.component";
import { ConsentDeleteAccountComponent } from "../dialogBoxes/consent-delete-account/consent-delete-account.component";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";

declare var $: any;

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  carouselPlayer: any;
  defaultImages: any = [];
  DefaultBanner: any;
  @ViewChild("slickModal") slickModal: any;
  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  homeCategoryData: IHomeCategory[] = [];
  isOttLoggedIn = false;
  muted: boolean = true;
  hideContinue: boolean = true;
  hideListen: boolean = true;
  videoJsData: any;
  isebook: boolean = false;
  isSubscribed = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isLoggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  addwatchlist: boolean = true;
  removewatchlist: boolean = true;
  user: any;
  countryAllowed: any = [];
  hellData: any = [];
  visitorId: any;
  getBrowserName: any;
  m3u8Main: any;
  userId: any;
  hideicon: boolean = true;
  @Input() sdasd: any;
  rentalData: any;
  @Input() set homeCategory(home: IHomeCategory[]) {
    this.homeCategoryData = home;
    console.log(this.homeCategoryData);
    home.map((category: any) => {
      category.config = {
        slidesToShow: Number(category.totalSlides),
        dots: false,
        arrows: true,
        slidesToScroll: 2,
        autoplay: false,
        infinite: false,
        lazyLoad: "progressive",
      };
    });
    if (window.matchMedia("(max-width: 480px)").matches) {
      home.map((category: any) => {
        category.config = {
          slidesToShow: 2.5,
          dots: false,
          arrows: true,
          slidesToScroll: 2,
          autoplay: false,
          infinite: false,
        };
      });
    }
    this.hellData = [];
    if (home.length) {
      if (home[0].category_type != "feature_banner") {
        let xc = window.innerWidth;
        if (xc < 992) {
          setTimeout(() => {
            $(".featuretopabc").css("margin-top", "70px");
          }, 200);
        } else {
          setTimeout(() => {
            $(".featuretopabc").css("margin-top", "100px");
          }, 200);
        }
      }

      home[0].cat_cntn.map((category: any) => {
        this.hellData.push({
          content_id: category.id,
          is_favourite: category.is_favourite,
          islive: category.is_live,
        });
      });
    }
  }
  @HostListener("window:scroll", ["$event"])
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    var scroll = $(window).scrollTop();
    if (scroll >= 280) {
      if (this.carouselPlayer) {
        this.carouselPlayer.pause();
      }
    } else {
      if (this.carouselPlayer) {
        this.carouselPlayer.play();
      }
    }
  }
  slideConfig = {
    slidesToShow: 1,
    dots: true,
    arrows: true,
    slidesToScroll: 1,
    autoplay: false,
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
          dots: true,
          arrows: true,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
          swipe: true,
          touchMove: true, // Enable touch move
          draggable: true, // Enable dragging with touch
          speed: 500, // Adjust speed for smoother effect
          cssEase: "linear", // Smoother transition
          adaptiveHeight: true, // Adjusts height for smoother behavior
          mobileFirst: true, // Ensures settings for mobile devices
        },
      },
    ],
  };
  constructor(
    private router: Router,
    private DEC_SER: DecryptService,
    private dialog: MatDialog,
    private ed: ExchangeDataService,
    private _dd: DataService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    private auth: AuthService,
    private fcs: FunctionCallingService,
    private _storage: StorageService,
    private DEC_SCR_IOS: IosDecrycptionService,
    private analyticsService: AnalyticsService
  ) {
    window.scroll(0, 0);
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 500);

    // firebase.analytics().logEvent('page_view', {
    //   'firsttimeuser': true,
    // })
    // firebase.analytics().logEvent('eventname', {
    //   'firsttimeuser': true,
    //   'username': 'ashish'
    // })
  }

  ngOnInit(): void {
    this.defaultImages = localStorage.getItem("defaultImages");
    this.DefaultBanner = JSON.parse(this.defaultImages).rectangle.path;
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

    if (this.router.url.includes("ebooks")) {
      this.isebook = true;
    } else {
      this.isebook = false;
    }

    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));

    this.playVideoMiniPlayer1();
    this.getBrowserName = this.detectBrowserName();
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    // firebase.analytics().logEvent('DASHBOARD_SCREEN', {
    //   'page': 'homepage',
    // })
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf("edge") > -1:
        return "edge";
      case agent.indexOf("opr") > -1 && !!(<any>window).opr:
        return "opera";
      case agent.indexOf("chrome") > -1 && !!(<any>window).chrome:
        return "chrome";
      case agent.indexOf("trident") > -1:
        return "ie";
      case agent.indexOf("firefox") > -1:
        return "firefox";
      case agent.indexOf("safari") > -1:
        return "safari";
      default:
        return "other";
    }
  }

  add(add: any, id: any, cat_id: any) {
    if (id.is_favourite == 1 && this.isOttLoggedIn) {
      id.is_favourite = 0;
    } else if (this.isOttLoggedIn) {
      id.is_favourite = 1;
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      const eventParams = {
        item_name: id.title,
        item_type: id.content_type,
        item_id: id.id,
      };
      this.analyticsService.logEvent("add_to_favorites", eventParams);
    }

    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {
      console.log(id, "ghjhgghgv");

      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        if (id.is_group == 0) {
          formData.append("content_id", id.id);
        } else {
          formData.append("season_id", id.season_id);
        }

        formData.append("favourite", id.is_favourite);
        this._dd.addRemoveToWatchList(formData).subscribe((res) => { });
      }
    } else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });
      dialogRef.disableClose = true;
    }
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  onSlideChange(event: any) {
    if (this.homeCategoryData[0].cat_cntn[event.currentSlide].is_ad != 1) {
      console.log(this.homeCategoryData[0].cat_cntn[event.currentSlide]);
      this._dd
        .getUserData(this.homeCategoryData[0].cat_cntn[event.currentSlide].id)
        .subscribe((res: any) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          if (
            this.homeCategoryData[0].cat_cntn[event.currentSlide].is_group == 0
          ) {
            this.homeCategoryData[0].cat_cntn[event.currentSlide].is_favourite =
              decryptData.Content_Data.is_favorite;
          } else {
            this.homeCategoryData[0].cat_cntn[event.currentSlide].is_favourite =
              decryptData.Season_Data.is_favorite;
          }
        });

      if (this.carouselPlayer) {
        this.carouselPlayer.muted(true);
        if (this.carouselPlayer.muted()) {
          this.muted = true;
          this.carouselPlayer.volume(0);
        }
      }

      if (this.carouselPlayer) {
        if (
          this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url ==
          "" ||
          this.homeCategoryData[0].auto_play == 0
        ) {
          this.hideicon = false;
        } else {
          this.carouselPlayer.pause();
          this.carouselPlayer.currentTime(0);
          this.carouselPlayer = videoJs(`carouselPlayerC${event.currentSlide}`);
          this.carouselPlayer.src({
            src: this.homeCategoryData[0].cat_cntn[event.currentSlide]
              .trailer_url,
          });
          this.carouselPlayer.load();
          this.carouselPlayer.play();
          this.hideicon = true;
        }
      } else {
        if (
          this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url ==
          "" ||
          this.homeCategoryData[0].auto_play == 0
        ) {
          this.hideicon = false;
        } else {
          this.carouselPlayer = videoJs(`carouselPlayerC${event.currentSlide}`);
          this.carouselPlayer.src({
            src: this.homeCategoryData[0].cat_cntn[event.currentSlide]
              .trailer_url,
          });
          this.carouselPlayer.load();
          this.carouselPlayer.play();
          this.hideicon = true;
        }
      }
    } else {
      this.hideicon = false;
    }

  }

  slickInit(event: any) {
    if (this.homeCategoryData[0].cat_cntn[0].is_ad != 1) {
      this._dd
        .getUserData(this.homeCategoryData[0].cat_cntn[0].id)
        .subscribe((res: any) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          if (this.homeCategoryData[0].cat_cntn[0].is_group == 0) {
            this.homeCategoryData[0].cat_cntn[0].is_favourite =
              decryptData.Content_Data.is_favorite;
          } else {
            this.homeCategoryData[0].cat_cntn[0].is_favourite =
              decryptData.Season_Data.is_favorite;
          }
        });

      this.carouselPlayer = videoJs(`carouselPlayerC0`);

      if (
        this.homeCategoryData[0].cat_cntn[0].trailer_url == "" ||
        this.homeCategoryData[0].auto_play == 0
      ) {
        this.hideicon = false;
      } else {
        this.carouselPlayer = videoJs(`carouselPlayerC0`);
        this.carouselPlayer.src({
          src: this.homeCategoryData[0].cat_cntn[0].trailer_url,
        });
        this.carouselPlayer.play();
        this.hideicon = true;
      }
    } else {
      this.hideicon = false;
    }

  }

  playRental() {
    const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
      panelClass: "rentalPop",
      width: "800px",
      data: { rent: this.rentalData },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.carouselPlayer.play();
    });
  }

  playVideoMiniPlayer1() { }

  mutebtn() {
    this.carouselPlayer.muted(true);
    if (this.carouselPlayer.muted()) {
      this.muted = true;
      this.carouselPlayer.volume(0);
    }
  }

  unmutebtn() {
    this.carouselPlayer.muted(false);

    if (!this.carouselPlayer.muted()) {
      this.muted = false;
      this.carouselPlayer.volume(1);
    }
  }

  mute() {
    this.carouselPlayer.muted(true);
    if (this.carouselPlayer.muted()) {
      this.muted = true;
      this.carouselPlayer.volume(0);
    }
  }

  unmute() {
    this.dialog.closeAll();
    this.carouselPlayer.muted(false);
    if (!this.carouselPlayer.muted()) {
      this.muted = false;
      this.carouselPlayer.volume(1);
    }
  }

  pausebtn() {
    this.carouselPlayer.pause();
    this.carouselPlayer.on("pause", () => {
      // this.playing = true;
    });
  }

  playbtn() {
    this.carouselPlayer.play();
    this.carouselPlayer.on("play", () => {
      // this.playing = false;
    });
  }

  fullscreen() {
    this.carouselPlayer.requestFullscreen();
    this.carouselPlayer.on("fullscreenchange", (e: any) => {
      if (this.carouselPlayer.isFullscreen() == true) {
        this.carouselPlayer.on("timeupdate", () => {
          if (this.carouselPlayer.userActive() == false) {
          } else {
          }
        });
        this.carouselPlayer.controls(true);
      } else {
        this.carouselPlayer.on("timeupdate", () => {
          if (this.carouselPlayer.userActive() == true) {
          }
        });
        this.carouselPlayer.controls(false);
      }
    });
  }

  playCarousel(event: any) {
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      if (this.carouselPlayer) {
        this.carouselPlayer.pause();
      }
      const eventParams = {
        item_id: event.id,
        item_name: event.title,
        item_type: event.content_type,
        item_value: event.access_type,
        season_id: event.season_id,
        series_id: event.series_id,
      };
      this.analyticsService.logEvent("select_item", eventParams);
      // console.log(event);
      this.videoJsData = event;
      const subs: any = localStorage.getItem("ott_subscriptionPlan");
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      if (Object.keys(userInfo).length) {
        const formData: any = new FormData();
        const visitorIds: any = localStorage.getItem("device_id");
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("country_code", detail.countryCode);
        formData.append("content_id", event.id);
        formData.append("package_type", event.package_mode);
        if (subs != null && JSON.parse(subs).packages_list.length) {
          const firstOTTPackage = JSON.parse(subs).packages_list.find(
            (res: any) => res.package_mode === "OTT"
          );
          if (firstOTTPackage) {
            formData.append("session_status", 1);
            formData.append("device", "web");
            formData.append("device_count", firstOTTPackage.device_restriction);
            formData.append("type", firstOTTPackage.restriction_type);
          }
        } else {
          formData.append("session_status", "");
          formData.append("device", "");
          formData.append("device_count", "");
          formData.append("type", "");
        }
        this.auth.isAllowed(formData).subscribe((res) => {
          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            this.verifyStatus(event);
          } else if (res.code == 2) {
            //rental flow//
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data;
            this.playRental();
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
                } else if (data.is_subscriber == 0) {
                  localStorage.setItem("is_subscriber", "0");
                }
                this._storage.setData("ott_subscriptionPlan", data);
                this.videoContinue(event);
              });
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");

            if (event.access_type == "paid" && event.is_allow != 1) {
              this.router.navigate(["/subscribe"]);
            } else {
              if (event.content_type == "audio") {
                this.openAudioPlayer(event);
              } else if (event.content_type == "ebook") {
                localStorage.setItem('ebookUrlId', event.id)
                this.router.navigate(["/epubPage"]);
              } else {
                this.videoContinue(event);
              }
            }
          }
        });
      } else {
        const dialogRef = this.dialog.open(LoginModalDialogComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "logindialog",
          width: "390px",
          data: { name: "login" },
        });
        dialogRef.disableClose = true;
      }
    }

  }

  verifyStatus(data: any) {
    if (data.is_event == 0) {
      if (data.access_type == "free") {
        if (data.content_type == "video") {
          this.videoContinue(data);
        } else if (data.content_type == "audio") {
          this.openAudioPlayer(data);
        } else if (data.content_type == "ebook") {
          localStorage.setItem('ebookUrlId', data.id)
          this.router.navigate(["/epubPage"]);
        }
      } else if (data.access_type == "paid") {
        if (data.content_type == "video") {
          this.videoContinue(data);
        } else if (data.content_type == "audio") {
          this.openAudioPlayer(data);
        } else if (data.content_type == "ebook") {
          localStorage.setItem('ebookUrlId', data.id)
          this.router.navigate(["/epubPage"]);
        }
      }
    } else {
      if (data.event_type == 'webcast') {
        this.router.navigate(["/live"], { queryParams: { cat: data.id } });
      } else {
        this.router.navigate(["/category/zoom"]);
      }

    }
  }

  navigate(event: any, data: any) {
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      const eventParams = {
        item_id: event.id,
        item_name: event.title,
        item_type: event.content_type,
        item_value: event.access_type,
        page_name: "home",
        season_id: event.season_id,
        series_id: event.series_id,
      };
      this.analyticsService.logEvent("select_item", eventParams);
      if (this.carouselPlayer != undefined) {
        this.carouselPlayer.pause();
      }
      console.log(event);
      const subs: any = localStorage.getItem("ott_subscriptionPlan");
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      if (Object.keys(userInfo).length) {
        const formData: any = new FormData();
        const visitorIds: any = localStorage.getItem("device_id");
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("country_code", detail.countryCode);
        formData.append("content_id", event.id);
        formData.append("package_type", event.package_mode);
        if (subs != null && JSON.parse(subs).packages_list.length) {
          const firstOTTPackage = JSON.parse(subs).packages_list.find(
            (res: any) => res.package_mode === "OTT"
          );
          if (firstOTTPackage) {
            formData.append("session_status", 1);
            formData.append("device", "web");
            formData.append("device_count", firstOTTPackage.device_restriction);
            formData.append("type", firstOTTPackage.restriction_type);
          }
        } else {
          formData.append("session_status", "");
          formData.append("device", "");
          formData.append("device_count", "");
          formData.append("type", "");
        }
        this.auth.isAllowed(formData).subscribe((res) => {
          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            if (event.content_type == "video") {
              if (data !== "continue_watching") {
                this.router.navigate(["/" + event.permalink]);
                localStorage.setItem("prevUrl", this.router.url);
              } else {
                this.videoContinue(event);
              }
            } else if (event.content_type == "audio") {
              this.openAudioPlayer(event);
            } else if (event.content_type == "ebook") {
              this.router.navigate(["/aol/ebook/" + event.permalink]);
            }
          } else if (res.code == 2) {
            //rental flow//
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data;
            if (event.content_type == "video") {
              this.router.navigate(["/" + event.permalink]);
              localStorage.setItem("prevUrl", this.router.url);
            } else {
              this.playRental();
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
                } else if (data.is_subscriber == 0) {
                  localStorage.setItem("is_subscriber", "0");
                }
                this._storage.setData("ott_subscriptionPlan", data);
              });
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            this.navigationFunction(event, data);
          }
        });
      } else {
        if (event.content_type != "video") {
          const dialogRef = this.dialog.open(LoginModalDialogComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "logindialog",
            width: "390px",
            data: { name: "login" },
          });
          dialogRef.disableClose = true;
        } else {
          this.router.navigate(["/" + event.permalink]);
          localStorage.setItem("prevUrl", this.router.url);
        }
      }
    }


  }

  navigationFunction(event: any, data: any) {
    if (data == "continue_watching") {
      if (event.access_type == "free") {
        if (event.content_type == "audio") {
          this.openAudioPlayer(event);
        } else if (event.content_type == "video") {
          this.videoContinue(event);
        }
      } else if (event.access_type == "paid") {
        this.router.navigate(["/subscribe"]);
      }
    } else {
      if (event.access_type == "free") {
        if (event.content_type == "video") {
          this.router.navigate(["/" + event.permalink]);
          localStorage.setItem("prevUrl", this.router.url);
        } else if (event.content_type == "audio") {
          this.openAudioPlayer(event);
        } else if (event.content_type == "ebook") {
          this.router.navigate(["/aol/ebook/" + event.permalink]);
        }
      } else if (event.access_type == "paid") {
        if (event.content_type != "video") {
          this.router.navigate(["/subscribe"]);
        } else {
          localStorage.setItem("prevUrl", this.router.url);
          this.router.navigate(["/" + event.permalink]);
        }
      }
    }
  }
  onImgError(event: any, type: any) {
    if (type == "circle") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    } else if (type == "rectangle_16x9") {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path;
    } else if (type == "vertical_9x16") {
      event.target.src = JSON.parse(this.defaultImages).vertical.path;
    } else if (type == "square") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    }
  }

  videoContinue(event: any) {

    if (this.getBrowserName == "safari") {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(event.id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != "") {
                event.url = decryptData.fairplay_url;
              } else {
                event.url = decryptData.url;
              }
            } else {
              event.url = decryptData.url;
            }
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result: any) => {
                this.carouselPlayer.play();
              });
            }
          } else if (res.code == 2 && res.error == "Content not found") {
            this.deleteWatchList(event.id, event.index, event.category_type);
          }
        });
      } else {
        this._dd.getMainUrl(event.id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != "") {
                event.url = decryptData.fairplay_url;
              } else {
                event.url = decryptData.url;
              }
            } else {
              event.url = decryptData.url;
            }
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result: any) => {
                this.carouselPlayer.play();
              });
            }
          } else if (res.code == 2 && res.error == "Content not found") {
            this.deleteWatchList(event.id, event.index, event.category_type);
          }
        });
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(event.id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            // this.m3u8Main = decryptData.url;
            // setTimeout(() => {
            event.url = decryptData.url;
            // }, 600);
            // setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result: any) => {
                this.carouselPlayer.play();
              });
            }
            // }, 1000);
          } else if (res.code == 2 && res.error == "Content not found") {
            this.deleteWatchList(event.id, event.index, event.category_type);
          }
        });
      } else {
        this._dd.getMainUrl(event.id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            // this.m3u8Main = ;
            // setTimeout(() => {
            event.url = decryptData.url;
            // }, 600);
            // setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result: any) => {
                this.carouselPlayer.play();
              });
            }
            // }, 1000);
          } else if (res.code == 2 && res.error == "Content not found") {
            this.deleteWatchList(event.id, event.index, event.category_type);
          }
        });
      }
    }

    // this.getm3u8Url(event.id);

    localStorage.setItem("miniplay", "0");
  }

  getm3u8Url(id: any) {
    if (this.getBrowserName == "safari") {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != "") {
                this.m3u8Main = decryptData.fairplay_url;
              } else {
                this.m3u8Main = decryptData.url;
              }
            } else {
              this.m3u8Main = decryptData.url;
            }
          }
        });
      } else {
        this._dd.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != "") {
                this.m3u8Main = decryptData.fairplay_url;
              } else {
                this.m3u8Main = decryptData.url;
              }
            } else {
              this.m3u8Main = decryptData.url;
            }
          }
        });
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
        });
      } else {
        this._dd.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.m3u8Main = decryptData.url;
          }
        });
      }
    }
  }
  openAudioPlayer(event: any) {
    setTimeout(() => {
      if (this.carouselPlayer) {
        this.carouselPlayer.pause();
      }
    }, 700);
    this.dialog.closeAll();
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
                this.carouselPlayer.play();
              });
            }
          }, 500);
           $("html").css("overflow", "hidden");
        } else if (res.code == 2 && res.error == "Content not found") {
         this.deleteWatchList(event.id, event.index, event.category_type);
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
                this.carouselPlayer.play();
              });
            }
          }, 500);
           $("html").css("overflow", "hidden");
        } else if (res.code == 2 && res.error == "Content not found") {
        this.deleteWatchList(event.id, event.index, event.category_type);
        }
      });
    }

   
  }

  deleteWatchList(id: any, index: any, type: any) {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    var u_id = JSON.parse(userInfo);
    const formData = new FormData();
    formData.append("c_id", id);
    formData.append("u_id", u_id?.id);
    this._dd.clearContinueWatching(formData).subscribe((res: any) => {
      if (res.code == 1) {
        this.homeCategoryData.map((category: any) => {
          console.log(type);

          if (category.category_type == type) {
            category.cat_cntn.splice(index, 1);
            console.log(this.homeCategoryData);
            if (category.cat_cntn.length == 0) {
              if (type == "continue_watching") {
                this.hideContinue = false;
              } else {
                this.hideListen = false;
              }

            }
          }
        });
      }
    });
  }
  ngOnDestroy(): void {
    for (let key in videoJs.getPlayers()) {
      delete videoJs.getPlayers()[key];
    }
  }
}
