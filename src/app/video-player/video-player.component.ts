import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DeviceDetectorService } from "ngx-device-detector";
import { map } from "rxjs";
import { VideoJsOptions } from "src/app/shared/models/videojs-options";
import { DataService } from "../services/data.service";
import { DecryptService } from "../services/decrypt.service";
import { ExchangeDataService } from "../services/exchange-data.service";
import { FingerPrintService } from "../services/finger-print.service";
import CustomVideoJsComponent from "./custom-video-js-components";
import { NetworkConnectionService } from "../services/network-connection.service";
import "videojs-contrib-ads";
import "videojs-ima";
import "./notes-plugin";
import "./sprites-plugin";
import { videoJs } from "./videojs";
import { Router } from "@angular/router";
require("video.js");
import { environment } from 'src/environments/environment';
import { IosDecrycptionService } from "../services/ios-decrycption.service";
import { CountryLockPopupComponent } from "../shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { ChechPinParentalComponent } from "../shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component";

require("videojs-overlay-buttons");
declare var $: any;
require("videojs-seek-buttons");
declare var DeviceUUID: any
require("videojs-sprite-thumbnails");
declare var google: any
@Component({
  selector: "app-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.css"],
})
export class VideoPlayerComponent implements OnDestroy, AfterViewInit {
  @ViewChild("slickModal") slickModal: any;
  [x: string]: any;
  user: any;
  cat_iid: any;
  token: any;
  introSeconds!: number;
  introSeconds1!: number;
  recapSeconds!: number;
  recapSeconds1!: number;
  checked: any;
  creditSeconds!: number;
  creditSeconds1!: number;
  contentPlaybackEnded: any;
  adsManager: any;
  encryptedUserId: any
  hours_minutes: any;
  googleAdsAllow = localStorage.getItem('faqData') || {};
  videoJsData: any;
  bandimage: any = [];
  uniqueChars: any;
  itemget: any
  windowSize: number = 0;
  @ViewChild("target", { static: true })
  target!: ElementRef;
  @Input() options: VideoJsOptions = {};
  player: any;
  successs: any;
  getadvalue: any
  isOttLoggedIn = false;
  display_offset: number = 0;
  inactivityTimeout: any;
  title: any;
  showepisode: boolean = false;
  userId: any;
  agetime: boolean = true;
  gg: any = [];
  subtitleurl: any;
  mainelement: any;
  countryAllowed: any = [];
  options1: any;
  val: any = [];
  tarilerPlay = localStorage.getItem("tarilerplay") || {};
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  videosrc: any = [];
  maxcounter: any;
  ageshow: any;
  lBandShow: any;
  junk = false;
  getBrowserName: any
  p: any;
  setF = false;
  arr: any = [];
  tt: any;
  USER_ACCOUNT_id: any;
  getID: any;
  resetDelay: any;
  LbandImageOne: any;
  LBandImageTwo: any;
  astonBandImage: any;
  LbandShareUrl: any;
  m3u8Main: any
  adFirstTime: boolean = true;
  adUrlLoop: any
  mainUrl: any

  playDuration: any
  lbandTemp: boolean = true;
  LBandTitle: any
  getid: any;
  @Input() data: any;
  @Input() trailerUrlPlay: any;
  defaultImages: any = [];
  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  app_version: any;
  EpiData: any;
  config: any;
  connected: boolean = true;
  session_gender: any;
  free_preview: any;
  free_preview_duration: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkOrientation();
  }
  isTrailerPlaying: boolean = false;
  isAdPlaying: boolean = false;
  constructor(
    private ed: ExchangeDataService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    private ds: DataService,
    private DEC_SER: DecryptService,
    private router: Router,
    private mat: MatDialog,
    private networkConnectionService: NetworkConnectionService,
    private DEC_SER_IOS: IosDecrycptionService,
    private renderer: Renderer2,
  ) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;
      }
    });

    this.ed.pauseDetailVideo.subscribe((value) => {
      if (value == true) {
        this.player.pause();
      } else if (value == false) {
        // this.player.play();
      }
    });

    setTimeout(() => {
      let xc = window.innerWidth;
      if (xc < 992) {
        $(".vjs-notes-btn").on("touchstart", () => {
          this.slickModal.unslick();
          $(".episodeSelector").appendTo($("#video-player"));
          this.slickModal.initSlick(this.slideConfig);
          $(".episodeSelector").show();
          $('.vjs-menu-content').hide();
          // if (this.player) {
          //   this.player.pause();
          // }
          this.ed.pauseDetailVideo.next(true);
        });

        $('.vjs-menu-button').on("touchstart", () => {
          $('.vjs-menu-content').show();
        })
      }

      $(".vjs-notes-btn").click(() => {
        this.slickModal.unslick();
        $(".episodeSelector").appendTo($("#video-player"));
        this.slickModal.initSlick(this.slideConfig);
        $(".episodeSelector").show();
        // if (this.player) {
        //   this.player.pause();
        // }

        this.ed.pauseDetailVideo.next(true);
      });



    }, 2000);

  }

  ngOnInit(): void {
    if (this.getBrowserName == "safari") {
      this.getm3u8Url(this.data.id)

    }

    this.jsondata();
    // this.networkConnectionService.connected$.subscribe(connect => {
    //   this.connected = connect;
    //   if (this.connected == true) {
    //     setTimeout(() => {
    //       this.player.currentTime(this.player.cache_.currentTime)
    //     }, 1000);
    //   }
    // })



    this.getBrowserName = this.detectBrowserName()
    setTimeout(() => {
      // if (this.isSubsInfo == 1) {
      var hh = localStorage.getItem("tarilerplay");
      if (hh != "1" && this.lBandShow.is_allow == 1) {
        this.getLbandData();
      }
      // }
    }, 500);


    setTimeout(() => {
      if (this.data.is_live == 1) {
        $(".vjs-progress-control").addClass("hideprogress");
        $(".vjs-seek-button").addClass("hideprogress");
        $(".vjs-play-control").addClass("hideprogress");
        $(".vjs-time-control").addClass("hideprogress");
        $(".vjs-notes-btn").addClass("hideprogress");
        $(".vjs-icon-previous-item").addClass("hideprogress");
        $(".vjs-icon-next-item").addClass("hideprogress");
      }
    }, 1000);


    setTimeout(() => {
      var hh = localStorage.getItem("tarilerplay");
      if (this.data.is_group == 1 && hh != "1") {
        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: `${this.data.season_number} ${this.data.episode_number} : ${this.data.title}`,
              align: "center",
            },
          ],
        });
      } else if (hh != "1") {
        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: this.data.title,
              align: "center",
            },
          ],
        });
      } else if (hh == "1" && this.data.is_group == 1) {
        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: `${this.data.series_title} ${this.data.season_title} Trailer`,
              align: "center",
            },
          ],
        });
      } else if (hh == "1" && this.data.is_group == 0) {
        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: `${this.data.title} Trailer`,
              align: "center",
            },
          ],
        });
      }
    }, 1000);
    setTimeout(() => {
      if (this.ageshow.is_allow == 1) {
        setTimeout(() => {
          this.agetime = false;
        }, this.ageshow.duration_in_sec * 100000);
      }
    }, 100000);
    setTimeout(() => {
      $(".vjs-notes-btn").attr("title", "Season-Selector");
      $(".vjs-icon-hd").attr("title", "Settings");
      $(".vjs-icon-hd-main").attr("title", "Settings");
      $("#titleOnePlayer").appendTo('#video-player')
      $("#titleTwoPlayer").appendTo('#video-player')
      $("#titleThreePlayer").appendTo('#video-player')
    }, 1000);

    this.defaultImages = localStorage.getItem("defaultImages");
    this.getid = localStorage.getItem("taploginInfo") || "111111";
    this.getID = JSON.parse(this.getid).id || "111111";
    this.windowSize = window.innerWidth;
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    if (
      this.data.is_group == 1 &&
      this.data.groupInfo != null &&
      this.data.groupInfo.child.length != 0
    ) {
      this.maxcounter = 500;
    }

    if (this.getBrowserName != 'safari') {
      if (this.data.drm == 0) {
        this.getm3u8Url(this.data.id);
      }
    }


    if (this.data.skip_duration.length != 0) {
      this.skipTime(this.data.skip_duration);
      // if (this.data.skip_duration.length == 1) {
      //   // skip intro
      //   var hms = this.data.skip_duration[0].start;
      //   var hms1 = this.data.skip_duration[0].end;
      //   var a = hms.split(":");
      //   var b = hms1.split(":");

      //   this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      //   this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];
      // }

      // if (this.data.skip_duration.length == 2) {
      //   // skip intro
      //   var hms = this.data.skip_duration[0].start;
      //   var hms1 = this.data.skip_duration[0].end;
      //   var a = hms.split(":");
      //   var b = hms1.split(":");

      //   this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      //   this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];

      //   // skip recap
      //   var hms2 = this.data.skip_duration[1].start;
      //   var hms3 = this.data.skip_duration[1].end;

      //   var c = hms2.split(":");
      //   var d = hms3.split(":");

      //   this.recapSeconds = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];
      //   this.recapSeconds1 = +d[0] * 60 * 60 + +d[1] * 60 + +d[2];
      // }

      // if (this.data.skip_duration.length == 3) {
      //   // skip intro
      //   var hms = this.data.skip_duration[0].start;
      //   var hms1 = this.data.skip_duration[0].end;
      //   var a = hms.split(":");
      //   var b = hms1.split(":");

      //   this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      //   this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];
      //   // skip recap
      //   var hms2 = this.data.skip_duration[1].start;
      //   var hms3 = this.data.skip_duration[1].end;

      //   var c = hms2.split(":");
      //   var d = hms3.split(":");

      //   this.recapSeconds = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];
      //   this.recapSeconds1 = +d[0] * 60 * 60 + +d[1] * 60 + +d[2];

      //   // skip credit
      //   var hms4 = this.data.skip_duration[2].start;
      //   var hms5 = this.data.skip_duration[2].end;

      //   var e = hms4.split(":");
      //   var f = hms5.split(":");

      //   this.creditSeconds = +e[0] * 60 * 60 + +e[1] * 60 + +e[2];
      //   this.creditSeconds1 = +f[0] * 60 * 60 + +f[1] * 60 + +f[2];
      // }
    }
    this.app_version = localStorage.getItem('appVersion')
  }

  skipTime(skipTimeGet: any) {
    if (skipTimeGet.length == 1) {
      // skip intro
      var hms = skipTimeGet[0].start;
      var hms1 = skipTimeGet[0].end;
      var a = hms.split(":");
      var b = hms1.split(":");

      this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];
    }

    if (skipTimeGet.length == 2) {
      // skip intro
      var hms = skipTimeGet[0].start;
      var hms1 = skipTimeGet[0].end;
      var a = hms.split(":");
      var b = hms1.split(":");

      this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];

      // skip recap
      var hms2 = skipTimeGet[1].start;
      var hms3 = skipTimeGet[1].end;

      var c = hms2.split(":");
      var d = hms3.split(":");

      this.recapSeconds = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];
      this.recapSeconds1 = +d[0] * 60 * 60 + +d[1] * 60 + +d[2];
    }

    if (skipTimeGet.length == 3) {
      // skip intro
      var hms = skipTimeGet[0].start;
      var hms1 = skipTimeGet[0].end;
      var a = hms.split(":");
      var b = hms1.split(":");

      this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];
      // skip recap
      var hms2 = skipTimeGet[1].start;
      var hms3 = skipTimeGet[1].end;

      var c = hms2.split(":");
      var d = hms3.split(":");

      this.recapSeconds = +c[0] * 60 * 60 + +c[1] * 60 + +c[2];
      this.recapSeconds1 = +d[0] * 60 * 60 + +d[1] * 60 + +d[2];

      // skip credit
      var hms4 = skipTimeGet[2].start;
      var hms5 = skipTimeGet[2].end;

      var e = hms4.split(":");
      var f = hms5.split(":");

      this.creditSeconds = +e[0] * 60 * 60 + +e[1] * 60 + +e[2];
      this.creditSeconds1 = +f[0] * 60 * 60 + +f[1] * 60 + +f[2];
    }
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

  checkOrientation() {
    if (this.getBrowserName == 'safari') {
      let xc = window.innerWidth;
      if (xc < 676) {
        const isLandscape = window.innerWidth > window.innerHeight;
        setTimeout(() => {
          if (isLandscape) {
            this.player.requestFullscreen();
            $(".vjs-progress-control").addClass("hideprogress");
            $(".vjs-time-control").addClass("hideprogress");
            $(".vjs-notes-btn").addClass("hideprogress");
            $(".vjs-icon-previous-item").addClass("hideprogress");
            $(".vjs-icon-next-item").addClass("hideprogress");
            $(".vjs-volume-panel").addClass("hideprogress");
            $(".vjs-subs-caps-button").addClass("hideprogress");
            $(".vjs-fullscreen-control").addClass("hideprogress");

            // Add your landscape-specific logic here
          } else {
            this.player.requestFullscreen();
            $(".vjs-progress-control").addClass("hideprogress");
            $(".vjs-time-control").addClass("hideprogress");
            $(".vjs-notes-btn").addClass("hideprogress");
            $(".vjs-icon-previous-item").addClass("hideprogress");
            $(".vjs-icon-next-item").addClass("hideprogress");
            $(".vjs-volume-panel").addClass("showprogess");
            $(".vjs-subs-caps-button").addClass("hideprogress");
            $(".vjs-fullscreen-control").addClass("showprogess");
            // Add your portrait-specific logic here
          }
        }, 1000);
      }
    }

  }

  astoncross() {
    var lband: any = document.getElementById("astonband");
    lband.style.display = "none";
  }


  asLbandClick(a: any, b: any, c: any) {
  }

  getLbandData() {
    var idPackage;
    var packages: any = localStorage.getItem("ott_subscriptionPlan");
    var packageId = JSON.parse(packages);
    if (this.isSubsInfo == 1) {
      idPackage = packageId.packages_list[0].package_id;
    } else {
      idPackage = "1";
    }

    this.ds.lBand(idPackage).subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.bandimage = decryptData.ad_data;

        this.bandimage.forEach((ele: any) => {
          this.gg.push(ele)
        });

        const adsArr = this.gg
        const length = Math.floor(Math.floor(this.player.duration()));
        const gap = this.lBandShow.gap_duration_min * 60;
        const arr = [];
        const lopcount = Math.ceil(length / gap);
        for (let i = 0; i < lopcount; i++) {
          arr.push({
            adsItem: adsArr[i % adsArr.length],
            nextAd: this.lBandShow.start_time_sec + (gap * i)
          });
        }

        this.adUrlLoop = arr;

        setTimeout(() => {
          this.player.on("timeupdate", () => {
            this.adUrlLoop.forEach((element: any) => {
              if (Math.floor(this.player.currentTime()) == element.nextAd) {
                if (element.adsItem.source_type == "lband") {
                  $("#ffffffffffffffffffffffff").appendTo($("#video-player"));
                  $("#gggggggggggggggggggggggggg").appendTo(
                    $("#video-player")
                  );

                  var lband: any = document.getElementById("astonband");
                  lband.style.display = "none";

                  this.LbandShareUrl = element.adsItem.share_url;
                  this.LbandImageOne = element.adsItem.img_url[0].url;
                  this.LBandImageTwo = element.adsItem.img_url[1].url;
                  this.LBandTitle = element.adsItem.title;
                  var first: any = document.getElementById(
                    "ffffffffffffffffffffffff"
                  );
                  first.style.display = "block";
                  first.style.position = "absolute";
                  first.style.height = "80%";
                  first.style.width = "15%"
                  first.style.transition = "2s";
                  first.style.top = "0"
                  var second: any = document.getElementById(
                    "gggggggggggggggggggggggggg"
                  );
                  second.style.display = "block";
                  second.style.position = "absolute";
                  second.style.bottom = "0";
                  second.style.height = "20%";
                  second.style.width = "100%";
                  var container: any =
                    document.getElementsByClassName("vjs-tech")[0];
                  container.style.height = "80%";
                  container.style.width = "80%";
                  $(".video-js .vjs-tech").css("height", "83%");
                  $(".video-js .vjs-tech").css("width", "115%");
                  $(".vjs-control-bar").css("bottom", "20%");
                  $(".vjs-control-bar").css("left", "20%");
                  $(".vjs-control-bar").css("width", "80%");

                  if (this.lbandTemp == true) {
                  }

                  setTimeout(() => {
                    var first: any = document.getElementById(
                      "ffffffffffffffffffffffff"
                    );
                    first.style.display = "none";
                    var second: any = document.getElementById(
                      "gggggggggggggggggggggggggg"
                    );
                    second.style.display = "none";
                    var video: any = document.getElementById("video-player");
                    $(".video-js .vjs-tech").css("height", "100%");
                    $(".video-js .vjs-tech").css("width", "100%");
                    $(".vjs-control-bar").css("bottom", "0");
                    $(".vjs-control-bar").css("left", "0");
                    $(".vjs-control-bar").css("width", "100%");
                  }, this.lBandShow.end_time_sec * 1000);


                } else if (element.adsItem.source_type == "aston_band") {
                  let xc = window.innerWidth;
                  if (this.lBandShow.close_button != 1) {
                    var astoncancel: any =
                      document.getElementById("astoncancel");
                    astoncancel.style.display = "none";
                  }

                  var first: any = document.getElementById(
                    "ffffffffffffffffffffffff"
                  );
                  var second: any = document.getElementById(
                    "gggggggggggggggggggggggggg"
                  );

                  first.style.display = "none";
                  second.style.display = "none";
                  $("#astonband").appendTo($("#video-player"));
                  this.LBandImageTwo = element.adsItem.img_url[0].url;
                  this.LbandShareUrl = element.adsItem.share_url;
                  this.LBandTitle = element.adsItem.title;
                  var lband: any = document.getElementById("astonband");
                  lband.style.display = "flex";
                  lband.style.left = "20%"
                  lband.style.position = "absolute";
                  lband.style.width = "60%";
                  lband.style.height = "15%"
                  lband.style.zIndex = "999999999";
                  if (xc < 920) {
                    lband.style.bottom = "21%";
                  } else if (xc <= 1370) {
                    lband.style.bottom = "14%";
                  } else {
                    lband.style.bottom = "10%";
                  }
                  lband.style.justifyContent = "center";

                  if (this.lbandTemp == true) {
                  }

                  setTimeout(() => {
                    lband.style.display = "none";
                  }, this.lBandShow.end_time_sec * 1000);
                }
              }
            });
          });
        }, 1000);
      }
    });

  }

  getEpisode(event: any, seasonCount: any) {


    if (this.itemget != 0) {
      $(".vjs-icon-previous-item").prop("disabled", false);
      $(".vjs-icon-previous-item").css("opacity", "1.0");
    }

    if (this.videosrc.length - 1 == this.itemget) {
      $(".vjs-icon-next-item").prop("disabled", true);
      $(".vjs-icon-next-item").css("opacity", "0.5");
    } else {
      $(".vjs-icon-next-item").prop("disabled", false);
      $(".vjs-icon-next-item").css("opacity", "1.0");
    }
    if (this.itemget == 0) {
      $(".vjs-icon-previous-item").prop("disabled", true);
      $(".vjs-icon-previous-item").css("opacity", "0.5");
    }

    if (this.videosrc.length - 1 != this.itemget)
      $(".vjs-icon-next-item").prop("disabled", false);
    $(".vjs-icon-next-item").css("opacity", "1.0");
    // this.itemget = 0;
    if (this.itemget >= this.videosrc.length)
      this.itemget = 0;
    setTimeout(() => {
      if (this.itemget == 0) {
        $(".vjs-icon-previous-item").prop("disabled", true);
        $(".vjs-icon-previous-item").css("opacity", "0.5");
      } else {
        $(".vjs-icon-previous-item").prop("disabled", false);
        $(".vjs-icon-previous-item").css("opacity", "1.0");
      }
    }, 500);

    if (this.arr.length == 1) {
      setTimeout(() => {
        $(".vjs-icon-previous-item").prop("disabled", true);
        $(".vjs-icon-previous-item").css("opacity", "0.5");

        $(".vjs-icon-next-item").prop("disabled", true);
        $(".vjs-icon-next-item").css("opacity", "0.5");
      }, 500);
    }


    this.tt = seasonCount;
    this.EpiData = [];
    this.slickModal.unslick();
    this.ds
      .getEpisodeData(this.display_offset, seasonCount, event)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            $(".episodeSelector").appendTo($("#video-player"));
            this.slickModal.initSlick(this.slideConfig);
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.EpiData = decryptData.content;
            this.EpiData.forEach((element: any) => {

              this.EpiData.map((category: any) => {
                category.sliderImg = "";
                category.sliderIdentifier = "";

                if (category.is_group == 1 && category.groupInfo != null) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "rectangle_16x9") {
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
                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
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
                  });
                }
              });
              // convert duration in min start
              var hours = element.duration.slice(0, 2);
              var minute = element.duration.slice(3, 5);
              var seconds = element.duration.slice(6, 8);
              var min = hours * 60;
              if (seconds > 30) {
                this.hours_minutes = Number(min) + Number(minute) + 1;
              } else {
                this.hours_minutes = Number(min) + Number(minute);
              }
              // convert duration in min end
              if (element.sprite_url != null) {
                var sprite = element.sprite_url.web
              } else {
                var sprite: any = ""
              }
              this.videosrc = [];
              setTimeout(() => {
                this.videosrc.push({
                  sources: [
                    {
                      src: element.url,
                      title: element.title,
                      id: element.id,
                      access: element.access_type,
                      age: element.age_group,
                      drm: element.drm,
                      season: element.season_number,
                      episode: element.episode_number,
                      kId: element.k_id,
                      spriteThumbnails: {
                        url: sprite,
                      },
                    },
                  ],
                });
              }, 500);

              this.arr.push(element.id);

            });

          }
        })
      )
      .subscribe();
  }

  getId(i: any) {
    this.setF = true;
    this.p = i;
    this.checked = i;
  }

  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path;
  }

  //   getm3u8Url(id: any) {
  //     this.userId = localStorage.getItem("taploginInfo");
  //     this.user = JSON.parse(this.userId);
  //     if (this.user) {
  //       this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {
  //         if (res.code == 1) {
  //           this.DEC_SER.getDecryptedData(res?.result);
  //           let decryptData = JSON.parse(this.DEC_SER.decryptData);
  // console.log(decryptData,"aaaaaaa");

  //           this.m3u8Main = decryptData.url;
  //           this.playDuration = decryptData.played_duration;
  //           this.player.src({
  //             src: this.m3u8Main,
  //             spriteThumbnails: {
  //               url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
  //             },
  //           })




  //           this.player.play()
  //           console.log(this.player.currentTime,"sssssssssss");
  //         }
  //       })
  //     } else {
  //       this.ds.getUnknownUrl(id).subscribe((res: any) => {
  //         if (res.code == 1) {
  //           this.DEC_SER.getDecryptedData(res?.result);
  //           let decryptData = JSON.parse(this.DEC_SER.decryptData);
  //           this.m3u8Main = decryptData.url;
  //           this.playDuration = decryptData.played_duration;
  //           this.player.src({
  //             src: this.m3u8Main,
  //             spriteThumbnails: {
  //               url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
  //             },
  //           })

  //           this.player.play()
  //         }
  //       })
  //     }
  //   }

  getm3u8Url(id: any) {
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    if (this.user) {
      this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {
        if (res.code == 1) {
          if (this.getBrowserName == 'safari') {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.free_preview = decryptData.free_preview
            console.log(this.free_preview)
            this.free_preview_duration = decryptData.free_preview_duration


            console.log(decryptData, "aaaaaaaaa");
            this.m3u8Main = decryptData.url;
            this.playDuration = decryptData.played_duration;
            this.player.src({
              src: this.m3u8Main,
              spriteThumbnails: {
                url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              },
            })
            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                this.player.currentTime(this.playDuration)
              }
            }, 100);
          } else {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.free_preview = decryptData.free_preview
            console.log(this.free_preview, "JJIUUJU")
            this.free_preview_duration = decryptData.free_preview_duration

            this.m3u8Main = decryptData.url;
            this.playDuration = decryptData.played_duration;
            this.player.src({
              src: this.m3u8Main,
              spriteThumbnails: {
                url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              },
            })
          }

          this.player.play()
          setTimeout(() => {
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              this.player.currentTime(this.playDuration)
            }
          }, 100);
        }
      })
    } else {
      this.ds.getUnknownUrl(id).subscribe((res: any) => {
        if (res.code == 1) {
          if (this.getBrowserName == 'safari') {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);

            this.free_preview = decryptData.free_preview
            this.free_preview_duration = decryptData.free_preview_duration

            this.m3u8Main = decryptData.url;
            this.playDuration = decryptData.played_duration;
            this.player.src({
              src: this.m3u8Main,
              spriteThumbnails: {
                url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              },
            })
          } else {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.free_preview = decryptData.free_preview
            this.free_preview_duration = decryptData.free_preview_duration

            this.m3u8Main = decryptData.url;
            this.playDuration = decryptData.played_duration;
            this.player.src({
              src: this.m3u8Main,
              spriteThumbnails: {
                url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              },
            })
          }


          this.player.play()
          setTimeout(() => {
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              this.player.currentTime(this.playDuration)
            }
          }, 200);
        }
      })
    }
  }


  drmContent(id: any, kId: any, url: any, accessType: any, spriteU: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);

            this.free_preview = decryptData.free_preview
            this.free_preview_duration = decryptData.free_preview_duration

            console.log(decryptData, "bbbbbb");

            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
          }
        })
      } else {
        this.ds.getUnknownUrl(id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.free_preview = decryptData.free_preview
            this.free_preview_duration = decryptData.free_preview_duration

            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
          }
        })
      }

      setTimeout(() => {
        this.player.src({
          src: url,
          spriteThumbnails: {
            url: spriteU,
          },
        })

        if (spriteU != "") {
          this.player.spriteThumbnails({
            interval: 5,
            url: spriteU,
            width: 224,
            height: 127,
            responsive: 600,
          });
        }

        this.player.hlsQualitySelector();
      }, 500);

      setTimeout(() => {
        this.player.play();
        setTimeout(() => {
          if (this.free_preview == 1 && this.isSubsInfo != 1) {
            this.player.currentTime(0)
          } else {
            this.player.currentTime(this.playDuration)
          }
        }, 200);
      }, 1000);
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);


            this.free_preview = decryptData.free_preview
            console.log(this.free_preview, "jlkjjkjkj");

            this.free_preview_duration = decryptData.free_preview_duration

            console.log(decryptData, "cccccc");
            console.log(decryptData.played_duration, "time");
            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
            console.log(this.playDuration);
          }
        })
      } else {
        this.ds.getUnknownUrl(id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.free_preview = decryptData.free_preview
            this.free_preview_duration = decryptData.free_preview_duration
            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
          }
        })
      }

      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      var authcode = localStorage.getItem("auth_token");
      var packages: any = localStorage.getItem("ott_subscriptionPlan");
      var packageId = JSON.parse(packages);
      var uuid = new DeviceUUID().get();
      var encryptedUserId = btoa((uuid));

      if (accessType == "paid") {
        if (this.user && this.isSubsInfo != 1) {
          var dataOfContent: any = {
            content_id: id,
            k_id: kId,
            licence_duration: "300",
            package_id: "",
            download: "0",
            content_type: "1",
            rental_duration: "300",
            security_level: "3",
            user_id: String(this.user.id),
          };
          var gettoken = btoa(JSON.stringify(dataOfContent));
        } else if (this.user && this.isSubsInfo == 1) {
          var dataOfContent: any = {
            content_id: id,
            k_id: kId,
            licence_duration: "300",
            package_id: packageId.packages_list[0].package_id,
            download: "0",
            content_type: "1",
            rental_duration: "300",
            security_level: "3",
            user_id: String(this.user.id),
          };
          var gettoken = btoa(JSON.stringify(dataOfContent));
        } else {
          var dataOfContent: any = {
            content_id: id,
            k_id: kId,
            licence_duration: "300",
            package_id: "",
            download: "0",
            content_type: "1",
            rental_duration: "300",
            security_level: "3",
            user_id: "",
          };
          var gettoken = btoa(JSON.stringify(dataOfContent));
        }
      } else {
        if (this.user && this.isSubsInfo != 1) {
          var dataOfContent: any = {
            content_id: id,
            k_id: kId,
            licence_duration: "300",
            package_id: "",
            download: "0",
            content_type: "0",
            rental_duration: "300",
            security_level: "3",
            user_id: String(this.user.id),
          };
          var gettoken = btoa(JSON.stringify(dataOfContent));
        } else if (this.user && this.isSubsInfo == 1) {
          var dataOfContent: any = {
            content_id: id,
            k_id: kId,
            licence_duration: "300",
            package_id: packageId.packages_list[0].package_id,
            download: "0",
            content_type: "0",
            rental_duration: "300",
            security_level: "3",
            user_id: String(this.user.id),
          };
          var gettoken = btoa(JSON.stringify(dataOfContent));
        } else {
          var dataOfContent: any = {
            content_id: id,
            k_id: kId,
            licence_duration: "300",
            package_id: "",
            download: "0",
            content_type: "0",
            rental_duration: "300",
            security_level: "3",
            user_id: "",
          };
          var gettoken = btoa(JSON.stringify(dataOfContent));
        }
      }

      this.player = videoJs("video-player");
      setTimeout(() => {

        if (url.includes('.m3u8')) {
          this.player.src({
            src: url,
            spriteThumbnails: {
              url: spriteU,
            },
          })
        } else {
          this.player.src({
            'src': url,
            'type': 'application/dash+xml',
            'keySystemOptions': [
              {
                'name': 'com.widevine.alpha',
                'options': {
                  'serverURL': "https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=BB00A6&user_id=" + encryptedUserId + "&type=widevine&authorization=" +
                    authcode +
                    "&payload=" +
                    gettoken,
                }
              },
              {
                'name': 'com.microsoft.playready',
                'options': {
                  'serverURL': "https://playready.ezdrm.com/cency/preauth.aspx?pX=B3F37F&user_id=" + encryptedUserId + "&type=playready&authorization=" +
                    authcode +
                    "&payload=" +
                    gettoken,
                }
              }
            ],
            spriteThumbnails: {
              url: spriteU,
            },
          });
        }



        if (spriteU != "") {
          this.player.spriteThumbnails({
            interval: 5,
            url: spriteU,
            width: 224,
            height: 127,
            responsive: 600,
          });
        }

      }, 500);

      this.player.play()
      setTimeout(() => {
        if (this.free_preview == 1 && this.isSubsInfo != 1) {
          this.player.currentTime(0)
        } else {
          setTimeout(() => {
            this.player.currentTime(this.playDuration)
          }, 200);
        }
      }, 500);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $(".vjs-icon-hd-main").on("click", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").hide()
      });

      $(".vjs-subs-caps-button").on("click", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").show()
        $(".hd-mode").hide()
      });


    }, 1000);

    if (
      this.data.is_group == 1 &&
      this.data.groupInfo != null &&
      this.data.groupInfo.child.length != 0
    ) {
      this.checked = this.data.season_id;
    }

    CustomVideoJsComponent.registerTitleComponent();
    CustomVideoJsComponent.registerCustomButton();
    this.player = videoJs(
      this.target.nativeElement,
      this.options,
      this.onPlayerReady.bind(this)
    );

    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
    if (dataPopup.Player[0].google_ads.is_allow == 1) {
      if (this.getBrowserName == 'firefox') {
        this.adGoogle(this.data.ad_tag)
      }
      this.adUrl()
    }


    if (this.getBrowserName != 'safari') {
      this.player.landscapeFullscreen({
        fullscreen: {
          enterOnRotate: true,
          exitOnRotate: true,
          alwaysInLandscapeMode: true,
          iOS: true,
        },
      });
    }


    this.inactivityTimeout = null;

    let xc = window.innerWidth;
    if (xc > 992) {
      $("#video-player").mousemove((event: any) => {
        $("#video-player").find(".control-overlay-buttons").show();
        this.player.controls(true);
        $(".vjs-overlay").show();
        $(".close-btn-video").show();
        if (this.inactivityTimeout != null) {
          clearTimeout(this.inactivityTimeout);
        }
        this.inactivityTimeout = setTimeout(() => {
          $("#video-player").find(".control-overlay-buttons").hide();
          this.player.controls(false);
          $(".vjs-overlay").hide();
          $(".close-btn-video").hide();
          $("#bitrateLevels1").hide();
        }, 5000);
      });
    }

    $("#video-player").on("touchstart", () => {
      $(".vjs-overlay").show();
      $(".close-btn-video").show();

      setTimeout(() => {
        $(".vjs-overlay").hide();
        $(".close-btn-video").hide();
      }, 5000);
    })

    // drm player
    var hh = localStorage.getItem("tarilerplay");
    if (this.data.is_group == 0 && hh != "1") {
      if (this.data.access_type == 'paid' && this.data.drm == 1) {


        if (this.data.sprite_url != null) {
          this.drmContent(
            this.data.id,
            this.data.k_id,
            this.data.url,
            this.data.access_type,
            this.data.sprite_url.web
          )
        } else {
          this.drmContent(
            this.data.id,
            this.data.k_id,
            this.data.url,
            this.data.access_type,
            ""
          );
        }

        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: this.data.title,
              align: "center",
            },
          ],
        });

        this.player.on("timeupdate", () => {
          if (Math.floor(this.player.currentTime()) == this.introSeconds) {
            $(".title").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.introSeconds
          ) {
            $(".title").hide();
          }

          if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
            $(".title1").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.recapSeconds
          ) {
            $(".title1").hide();
          }

          if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
            $(".title2").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.creditSeconds
          ) {
            $(".title2").hide();
          }
        });
      } else if (this.data.access_type == 'paid' && this.data.drm == 0) {
        if (this.getBrowserName != 'safari') {
          this.getm3u8Url(this.data.id)
          setTimeout(() => {
            this.player.src({
              src: this.m3u8Main
            })

            this.player.play()
            this.player.hlsQualitySelector()
          }, 1000);
        }
      }

      if (this.data.access_type == 'paid' && this.data.drm == 1) {
        var buttonComponent = videoJs.getComponent("Button");
        var settingButton = videoJs.extend(buttonComponent, {
          constructor: function () {
            buttonComponent.apply(this, arguments);
            this.addClass("vjs-icon-hd-main");
            this.controlText("Setting");
          },

          handleClick: (e: any) => {
            $("#bitrateLevels1").appendTo($("#video-player"));
            $("#bitrateLevels1").toggle();
          },
        });
        videoJs.registerComponent("settingButton", settingButton);
        this.player.getChild("controlBar").addChild("settingButton", {}, 14);
      }
    }

    // setup episode selector Start
    var hh = localStorage.getItem("tarilerplay");
    if (this.data.is_group == 1 && hh != "1") {
      if (this.data.access_type == 'paid' && this.data.drm == 1) {
        if (this.data.sprite_url != null) {
          this.drmContent(
            this.data.id,
            this.data.k_id,
            this.data.url,
            this.data.access_type,
            this.data.sprite_url.web
          );
        } else {
          this.drmContent(
            this.data.id,
            this.data.k_id,
            this.data.url,
            this.data.access_type,
            ""
          );
        }

        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: `${this.data.season_number} ${this.data.episode_number} : ${this.data.title}`,
              align: "center",
            },
          ],
        });

        if (this.data.access_type == 'paid') {
          var buttonComponent = videoJs.getComponent("Button");
          var settingButton = videoJs.extend(buttonComponent, {
            constructor: function () {
              buttonComponent.apply(this, arguments);
              this.addClass("vjs-icon-hd-main");
              this.controlText("Setting");
            },

            handleClick: (e: any) => {
              $("#bitrateLevels1").appendTo($("#video-player"));
              $("#bitrateLevels1").toggle();
            },
          });
          videoJs.registerComponent("settingButton", settingButton);
          this.player.getChild("controlBar").addChild("settingButton", {}, 14);
        }

        this.player.on("timeupdate", () => {
          if (Math.floor(this.player.currentTime()) == this.introSeconds) {
            $(".title").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.introSeconds
          ) {
            $(".title").hide();
          }

          if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
            $(".title1").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.recapSeconds
          ) {
            $(".title1").hide();
          }

          if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
            $(".title2").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.creditSeconds
          ) {
            $(".title2").hide();
          }
        });
      }

      this.player.ready(() => {
        this.player = window.videoPlayer || {};
        this.player = videoJs("video-player");
        this.player.on("timeupdate", () => {
          console.log(this.player.currentTime());
          console.log(this.introSeconds);
          console.log(this.introSeconds1);




          if (Math.floor(this.player.currentTime()) == this.introSeconds) {
            $(".title").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.introSeconds
          ) {
            $(".title").hide();
          }

          if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
            $(".title1").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.recapSeconds
          ) {
            $(".title1").hide();
          }

          if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
            $(".title2").show();
          } else if (
            Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
            Math.floor(this.player.currentTime()) <= this.creditSeconds
          ) {
            $(".title2").hide();
          }
        });

        ((o: any) => {
          this.ds
            .getEpisodeData(
              this.display_offset,
              this.maxcounter,
              this.data.season_id
            )
            .pipe(
              map((res: any) => {
                if (res.code == 1) {
                  this.DEC_SER.getDecryptedData(res?.result);
                  let decryptData = JSON.parse(this.DEC_SER.decryptData);
                  this.EpiData = decryptData.content;

                  if (decryptData.content) {

                    this.EpiData.forEach((element: any) => {

                      this.EpiData.map((category: any) => {
                        category.sliderImg = "";
                        category.sliderIdentifier = "";

                        if (
                          category.is_group == 1 &&
                          category.groupInfo != null
                        ) {
                          category.layout_thumbs.forEach((thumb: any) => {
                            if (thumb != null) {
                              if (thumb.layout == "rectangle_16x9") {
                                thumb?.image_size.filter((img: any) => {
                                  if (
                                    Number(img.width) == 360 ||
                                    Number(img.width) == 854
                                  ) {
                                    category.sliderImg = img.url;
                                    category.sliderIdentifier = img.identifier;
                                  } else if (category.sliderImg == "") {
                                    category.sliderImg =
                                      thumb?.image_size[0].url;
                                    category.sliderIdentifier =
                                      thumb?.image_size[0].identifier;
                                  }
                                });
                              }
                            }
                          });
                        } else if (category.is_group == 0) {
                          category.layout_thumbs.forEach((thumb: any) => {
                            if (thumb.layout == "rectangle_16x9") {
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
                          });
                        }
                      });
                      // convert duration in min start
                      var hours = element.duration.slice(0, 2);

                      var minute = element.duration.slice(3, 5);
                      var seconds = element.duration.slice(6, 8);
                      var min = hours * 60;
                      if (seconds > 30) {
                        this.hours_minutes = Number(min) + Number(minute) + 1;

                      } else {
                        this.hours_minutes = Number(min) + Number(minute);

                      }
                      // convert duration in min end
                      if (element.sprite_url != null) {
                        var sprite = element.sprite_url.web
                      } else {
                        var sprite: any = ""
                      }

                      if (!element.skip_duration) {
                        var duartionGet: any = element.skip_duration;
                      } else {
                        var duartionGet: any = []
                      }
                      this.videosrc = [];
                      setTimeout(() => {
                        this.videosrc.push({
                          sources: [
                            {
                              src: element.url,
                              title: element.title,
                              id: element.id,
                              access: element.access_type,
                              age: element.age_group,
                              drm: element.drm,
                              season: element.season_number,
                              episode: element.episode_number,
                              kId: element.k_id,
                              spriteThumbnails: {
                                url: sprite,
                              },
                              adUrls: element.ad_tag,
                              skipDuration: duartionGet
                            },
                          ],
                        });
                      }, 500);

                      this.arr.push(element.id);

                    });
                  }
                  this.itemget = 0;
                  if (this.itemget >= this.videosrc.length) this.itemget = 0;
                  setTimeout(() => {
                    if (this.itemget == 0) {
                      $('.vjs-icon-previous-item').prop('disabled', true);
                      $('.vjs-icon-previous-item').css('opacity', '0.5');
                    } else {
                      $('.vjs-icon-previous-item').prop('disabled', false);
                      $('.vjs-icon-previous-item').css('opacity', '1.0');
                    }
                  }, 500);

                  if (this.arr.length == 1) {
                    setTimeout(() => {

                      $('.vjs-icon-previous-item').prop('disabled', true);
                      $('.vjs-icon-previous-item').css('opacity', '0.5');

                      $('.vjs-icon-next-item').prop('disabled', true);
                      $('.vjs-icon-next-item').css('opacity', '0.5');

                    }, 500);
                  }

                  if (this.data.hasOwnProperty('index')) {
                    if (this.data.index != "") {
                      if (this.data.index == 0) {
                        this.itemget = this.data.index
                        if (this.arr.length == this.data.index) {
                          setTimeout(() => {
                            $('.vjs-icon-next-item').prop('disabled', true);
                            $('.vjs-icon-next-item').css('opacity', '0.5');
                          }, 1000);

                        }
                      } else {
                        this.itemget = this.data.index - 1
                        if (this.arr.length == this.data.index) {
                          setTimeout(() => {
                            $('.vjs-icon-next-item').prop('disabled', true);
                            $('.vjs-icon-next-item').css('opacity', '0.5');
                          }, 1000);

                        }
                      }

                    } else {
                      this.itemget = 0;
                    }

                  } else {
                    this.itemget = 0;
                  }

                  // if (this.videosrc.length - 1 != this.itemget) {

                  //   this.player.on("ended", () => {
                  //     if (this.videosrc.length != this.itemget + 1) {
                  //       this.itemget++
                  //     }
                  //     this.contentPlaybackEnded = true;
                  //     this.agetime = true;
                  //     setTimeout(() => {
                  //       if (this.ageshow.is_allow == 1) {
                  //         setTimeout(() => {
                  //           this.agetime = false;
                  //         }, this.ageshow.duration_in_sec * 1000);
                  //       }
                  //     }, 1000);
                  //     $(this.player.posterImage.contentEl()).hide();

                  //     if (this.videosrc[this.itemget].sources[0].drm == 0) {
                  //       this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
                  //       setTimeout(() => {
                  //         this.player.src({
                  //           src: this.m3u8Main,
                  //           spriteThumbnails: {
                  //             url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                  //           },
                  //         })

                  //         setTimeout(() => {
                  //           this.adFirstTime = false;
                  //           this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                  //           this.player.play()
                  //           setTimeout(() => {
                  //             this.player.currentTime(this.playDuration);
                  //           }, 200);
                  //         }, 200);
                  //       }, 500);


                  //     } else if (this.isSubsInfo == 1) {
                  //       if (
                  //         this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
                  //       ) {
                  //         this.adFirstTime = false;
                  //         this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                  //         this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                  //         this.player.on('ads-manager', (response: any) => {
                  //           var adsManager = response.adsManager;
                  //           adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
                  //             this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                  //           });
                  //         })
                  //       }
                  //     } else {
                  //       this.mat.closeAll();
                  //       localStorage.setItem("woohoo", "1");
                  //       this.router.navigate(["/subscribe"]);
                  //     }

                  //     $(".moveToVideoJs").show();
                  //     setTimeout(() => {
                  //       $(".moveToVideoJs").hide();
                  //     }, 5000);
                  //     // if (this.videosrc[this.itemget].sources[0].skipDuration.length != 0) {
                  //     //   this.skipTime(this.videosrc[this.itemget].sources[0].skipDuration)
                  //     // }
                  //     this.player.overlay({
                  //       overlays: [
                  //         {
                  //           start: "playing",
                  //           content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
                  //           align: "center",
                  //         },
                  //       ],
                  //     });

                  //     if (this.itemget != 0) {
                  //       $('.vjs-icon-previous-item').prop('disabled', false);
                  //       $('.vjs-icon-previous-item').css('opacity', '1.0');
                  //     }

                  //     if (this.videosrc.length - 1 == this.itemget) {
                  //       $('.vjs-icon-next-item').prop('disabled', true);
                  //       $('.vjs-icon-next-item').css('opacity', '0.5');
                  //     } else {
                  //       $('.vjs-icon-next-item').prop('disabled', false);
                  //       $('.vjs-icon-next-item').css('opacity', '1.0');
                  //     }
                  //     $('#ffffffffffffffffffffffff').hide();
                  //     $('#gggggggggggggggggggggggggg').hide();
                  //     $('#astonband').hide()
                  //     $(".video-js .vjs-tech").css("height", "100%");
                  //     $(".video-js .vjs-tech").css("width", "100%");

                  //     const userInfo: any = localStorage.getItem("taploginInfo") || {};
                  //     var u_id = JSON.parse(userInfo);
                  //     const formData = new FormData();
                  //     formData.append("c_id", this.videosrc[this.itemget - 1].sources[0].id);
                  //     formData.append("u_id", u_id?.id);
                  //     this.ds.clearContinueWatching(formData).subscribe((res: any) => {
                  //       if (res.code == 1) {


                  //       }
                  //     });
                  //   });
                  // }


                  //   For next and prev

                  if (this.videosrc.length - 1 != this.itemget) {
                    this.player.on("ended", () => {
                      var parental: any = localStorage.getItem("taploginInfo");
                      var parental_read = JSON.parse(parental);
                      var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
                      if (ottLogged == "1") {
                        if (parental_read?.is_parental == 0) {
                          this.endPlay()
                        } else {
                          if (parental_read?.is_parental == 1) {
                            if (Number(parental_read.restriction_level) == -1) {
                              this.showPinPrevNext('end')
                            } else if (Number(parental_read.restriction_level) == 999) {
                              this.endPlay()
                            } else if (Number(parental_read.restriction_level) < 999) {
                              if (this.videosrc[this.itemget].sources[0].age_group == 999) {
                                this.endPlay()
                              } else if (this.videosrc[this.itemget].sources[0].age_group >= Number(parental_read.restriction_level) || this.videosrc[this.itemget].sources[0].age_group == -1) {
                                this.showPinPrevNext('end')
                              } else {
                                this.endPlay()
                              }
                            }
                          } else {
                            this.endPlay()
                          }
                        }
                      } else {
                        this.endPlay()
                      }
                    });
                  }




                  var buttonComponent = videoJs.getComponent("Button");
                  var prevButton = videoJs.extend(buttonComponent, {
                    constructor: function () {
                      buttonComponent.apply(this, arguments);
                      this.addClass("vjs-icon-previous-item");
                      this.controlText("Previous");
                    },
                    // handleClick: (e: any) => {
                    //   this.agetime = true;
                    //   setTimeout(() => {
                    //     if (this.ageshow.is_allow == 1) {
                    //       setTimeout(() => {
                    //         this.agetime = false;
                    //       }, this.ageshow.duration_in_sec * 1000);
                    //     }
                    //   }, 1000);

                    //   // console.log(this.itemget);
                    //     if (this.itemget != 0) {
                    //       this.itemget--
                    //     }

                    //   if (this.videosrc[this.itemget].sources[0].drm == 0) {

                    //     this.adFirstTime = false;
                    //     this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                    //     this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
                    //     this.player.on('ads-manager', (response: any) => {
                    //       var adsManager = response.adsManager;
                    //       adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
                    //         setTimeout(() => {
                    //           this.player.src({
                    //             src: this.m3u8Main,
                    //             spriteThumbnails: {
                    //               url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                    //             },
                    //           })

                    //           setTimeout(() => {
                    //             this.player.play()
                    //             setTimeout(() => {
                    //               this.player.currentTime(this.playDuration);
                    //             }, 200);
                    //           }, 200);
                    //         }, 500);
                    //         setTimeout(() => {
                    //           this.player.play();
                    //         }, 1000);
                    //       });
                    //     })
                    //     setTimeout(() => {
                    //       this.player.src({
                    //         src: this.m3u8Main,
                    //         spriteThumbnails: {
                    //           url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                    //         },
                    //       })

                    //       setTimeout(() => {
                    //         this.player.play()
                    //         setTimeout(() => {
                    //           this.player.currentTime(this.playDuration);
                    //         }, 200);
                    //       }, 200);
                    //     }, 500);
                    //   } else if (this.isSubsInfo == 1) {
                    //     if (this.itemget != 0) {
                    //       this.itemget--
                    //     }
                    //     this.adFirstTime = false;
                    //     this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                    //     if (
                    //       this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
                    //     ) {
                    //       this.player.on('ads-manager', (response: any) => {
                    //         var adsManager = response.adsManager;
                    //         adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
                    //           this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                    //         });
                    //       })
                    //       this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                    //     }
                    //   } else {
                    //     this.mat.closeAll();
                    //     localStorage.setItem("woohoo", "1");
                    //     this.router.navigate(["/subscribe"]);
                    //   }

                    //   $(".moveToVideoJs").show();
                    //   setTimeout(() => {
                    //     $(".moveToVideoJs").hide();
                    //   }, 5000);
                    //   // if (this.videosrc[this.itemget].sources[0].skipDuration.length != 0) {
                    //   //   this.skipTime(this.videosrc[this.itemget].sources[0].skipDuration)
                    //   // }
                    //   this.player.overlay({
                    //     overlays: [
                    //       {
                    //         start: "playing",
                    //         content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
                    //         align: "center",
                    //       },
                    //     ],
                    //   });

                    //   if (this.itemget == 0) {
                    //     $('.vjs-icon-previous-item').prop('disabled', true);
                    //     $('.vjs-icon-previous-item').css('opacity', '0.5');
                    //   }

                    //   if (this.videosrc.length - 1 != this.itemget)
                    //     $('.vjs-icon-next-item').prop('disabled', false);
                    //   $('.vjs-icon-next-item').css('opacity', '1.0');

                    //   $('#ffffffffffffffffffffffff').hide();
                    //   $('#gggggggggggggggggggggggggg').hide();
                    //   $('#astonband').hide()
                    //   $(".video-js .vjs-tech").css("height", "100%");
                    //   $(".video-js .vjs-tech").css("width", "100%");

                    //   // const userInfo: any = localStorage.getItem("taploginInfo");
                    //   // let analytics: any = {
                    //   //   c_id: this.videosrc[this.itemget + 1].sources[0].id,
                    //   //   dod: "",
                    //   //   dd: "",
                    //   //   type: 2,
                    //   //   content_title: this.data.title,
                    //   //   total_duration: this.player.cache_.duration,
                    //   //   pd: Math.floor(this.player.cache_.currentTime),
                    //   //   cat_id: this.data.category_ids[0],
                    //   //   age_group: this.data.age_group,
                    //   //   gender: "Male",
                    //   //   network_provider: "Airtel",
                    //   //   customer_name: "User",
                    //   // };
                    //   // analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
                    //   // analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                    //   // const formData = new FormData();
                    //   // for (const key in analytics) {
                    //   //   formData.append(key, analytics[key]);
                    //   // }
                    //   // formData.append("u_id", JSON.parse(userInfo).id);
                    //   // formData.append("country", "India");
                    //   // formData.append("country_code", "IN");
                    //   // this.ds.analyticsSubmit(formData).subscribe((res: any) => {
                    //   //   if (res.code == 1) {
                    //   //     // this.ed.playDetailVideo.next(true);
                    //   //   }
                    //   // });
                    //   // this.analytics();
                    // },



                    handleClick: (e: any) => {
                      var parental: any = localStorage.getItem("taploginInfo");
                      var parental_read = JSON.parse(parental);
                      var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
                      if (ottLogged == "1") {
                        if (parental_read?.is_parental == 0) {
                          this.prevPlay()
                        } else {
                          if (parental_read?.is_parental == 1) {
                            if (Number(parental_read.restriction_level) == -1) {
                              this.showPinPrevNext('prev')
                            } else if (Number(parental_read.restriction_level) == 999) {
                              this.prevPlay()
                            } else if (Number(parental_read.restriction_level) < 999) {
                              if (this.videosrc[this.itemget].sources[0].age_group == 999) {
                                this.prevPlay()
                              } else if (this.videosrc[this.itemget].sources[0].age_group >= Number(parental_read.restriction_level) || this.videosrc[this.itemget].sources[0].age_group == -1) {
                                this.showPinPrevNext('prev')
                              } else {
                                this.prevPlay()
                              }
                            }
                          } else {
                            this.prevPlay()
                          }
                        }
                      } else {
                        this.prevPlay()
                      }
                    },


                  });

                  var nextButton = videoJs.extend(buttonComponent, {
                    constructor: function () {
                      buttonComponent.apply(this, arguments);
                      this.addClass("vjs-icon-next-item");
                      this.controlText("Next");
                    },
                    // handleClick: (e: any) => {
                    //   this.agetime = true;
                    //   setTimeout(() => {
                    //     if (this.ageshow.is_allow == 1) {
                    //       setTimeout(() => {
                    //         this.agetime = false;
                    //       }, this.ageshow.duration_in_sec * 1000);
                    //     }
                    //   }, 1000);

                    //   if (this.videosrc.length != this.itemget + 1) {
                    //     this.itemget++
                    //   }

                    //   if (this.videosrc[this.itemget].sources[0].drm == 0 && this.data.access_type=='free' && this.isSubsInfo==0) {
                    //     console.log("drm0");
                    //     this.adFirstTime = false;
                    //     this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                    //     this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
                    //     this.player.on('ads-manager', (response: any) => {
                    //       var adsManager = response.adsManager;
                    //       adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
                    //         setTimeout(() => {
                    //           this.player.src({
                    //             src: this.m3u8Main,
                    //             spriteThumbnails: {
                    //               url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                    //             },
                    //           })

                    //           setTimeout(() => {
                    //             this.player.play()
                    //             setTimeout(() => {
                    //               this.player.currentTime(this.playDuration);
                    //             }, 200);
                    //           }, 200);
                    //         }, 500);
                    //         setTimeout(() => {
                    //           this.player.play();
                    //         }, 1000);
                    //       });
                    //     })
                    //     setTimeout(() => {
                    //       this.player.src({
                    //         src: this.m3u8Main,
                    //         spriteThumbnails: {
                    //           url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                    //         },
                    //       })

                    //       setTimeout(() => {
                    //         this.player.play()
                    //         setTimeout(() => {
                    //           this.player.currentTime(this.playDuration);
                    //         }, 200);
                    //       }, 200);
                    //     }, 500);

                    //   } else if (this.isSubsInfo == 1) {
                    //     this.adFirstTime = false;
                    //     this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                    //     if (
                    //       this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
                    //     ) {
                    //       this.player.on('ads-manager', (response: any) => {
                    //         var adsManager = response.adsManager;
                    //         adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
                    //           this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                    //           setTimeout(() => {
                    //             this.player.play();
                    //           }, 1000);
                    //         });
                    //       })
                    //       this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                    //     }
                    //   } else {
                    //     this.mat.closeAll();
                    //     localStorage.setItem("woohoo", "1");
                    //     this.router.navigate(["/subscribe"]);
                    //   }

                    //   // if (this.videosrc[this.itemget].sources[0].skipDuration.length != 0) {
                    //   //   this.skipTime(this.videosrc[this.itemget].sources[0].skipDuration)
                    //   // }

                    //   $(".moveToVideoJs").show();
                    //   setTimeout(() => {
                    //     $(".moveToVideoJs").hide();
                    //   }, 5000);

                    //   this.player.overlay({
                    //     overlays: [
                    //       {
                    //         start: "playing",
                    //         content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
                    //         align: "center",
                    //       },
                    //     ],
                    //   });

                    //   if (this.itemget != 0) {
                    //     $('.vjs-icon-previous-item').prop('disabled', false);
                    //     $('.vjs-icon-previous-item').css('opacity', '1.0');
                    //   }

                    //   if (this.videosrc.length - 1 == this.itemget) {
                    //     $('.vjs-icon-next-item').prop('disabled', true);
                    //     $('.vjs-icon-next-item').css('opacity', '0.5');
                    //   } else {
                    //     $('.vjs-icon-next-item').prop('disabled', false);
                    //     $('.vjs-icon-next-item').css('opacity', '1.0');
                    //   }

                    //   $('#ffffffffffffffffffffffff').hide();
                    //   $('#gggggggggggggggggggggggggg').hide();
                    //   $('#astonband').hide()
                    //   $(".video-js .vjs-tech").css("height", "100%");
                    //   $(".video-js .vjs-tech").css("width", "100%");

                    //   // const userInfo: any = localStorage.getItem("taploginInfo");
                    //   // let analytics: any = {
                    //   //   c_id: this.videosrc[this.itemget - 1].sources[0].id,
                    //   //   dod: "",
                    //   //   dd: "",
                    //   //   type: 2,
                    //   //   content_title: this.data.title,
                    //   //   total_duration: this.player.cache_.duration,
                    //   //   pd: Math.floor(this.player.cache_.currentTime),
                    //   //   cat_id: this.data.category_ids[0],
                    //   //   age_group: this.data.age_group,
                    //   //   gender: "Male",
                    //   //   network_provider: "Airtel",
                    //   //   customer_name: "User",
                    //   // };
                    //   // analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
                    //   // analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                    //   // const formData = new FormData();
                    //   // for (const key in analytics) {
                    //   //   formData.append(key, analytics[key]);
                    //   // }
                    //   // formData.append("u_id", JSON.parse(userInfo).id);
                    //   // formData.append("country", "India");
                    //   // formData.append("country_code", "IN");
                    //   // this.ds.analyticsSubmit(formData).subscribe((res: any) => {
                    //   //   if (res.code == 1) {
                    //   //     // this.ed.playDetailVideo.next(true);
                    //   //   }
                    //   // });

                    //   // this.analytics();
                    // },




                    handleClick: (e: any) => {
                      var parental: any = localStorage.getItem("taploginInfo");
                      var parental_read = JSON.parse(parental);
                      var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
                      if (ottLogged == "1") {
                        if (parental_read?.is_parental == 0) {
                          this.nextPlay()
                        } else {
                          if (parental_read?.is_parental == 1) {
                            if (Number(parental_read.restriction_level) == -1) {
                              this.showPinPrevNext('next')
                            } else if (Number(parental_read.restriction_level) == 999) {
                              this.nextPlay()
                            } else if (Number(parental_read.restriction_level) < 999) {
                              if (this.videosrc[this.itemget].sources[0].age_group == 999) {
                                this.nextPlay()
                              } else if (this.videosrc[this.itemget].sources[0].age_group >= Number(parental_read.restriction_level) || this.videosrc[this.itemget].sources[0].age_group == -1) {
                                this.showPinPrevNext('next')
                              } else {
                                this.nextPlay()
                              }
                            }
                          } else {
                            this.nextPlay()
                          }
                        }
                      } else {
                        this.nextPlay()
                      }
                    },




                  });

                  videoJs.registerComponent("prevButton", prevButton);
                  videoJs.registerComponent("nextButton", nextButton);

                  this.player
                    .getChild("controlBar")
                    .addChild("prevButton", {}, 0);
                  this.player
                    .getChild("controlBar")
                    .addChild("nextButton", {}, 2);
                }
              })
            )
            .subscribe();
        })(this.player);

        if (
          this.data.groupInfo != null &&
          this.data.groupInfo.child.length != 0
        )
          this.player.notesButton({});
      });
    } else if (this.data.is_group == 0) {
      this.player.on("timeupdate", () => {
        if (Math.floor(this.player.currentTime()) == this.introSeconds) {
          $(".title").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.introSeconds
        ) {
          $(".title").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
          $(".title1").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.recapSeconds
        ) {
          $(".title1").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
          $(".title2").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.creditSeconds
        ) {
          $(".title2").hide();
        }
      });
    }

    this.config = {
      slidesToShow: 8,
      dots: false,
      arrows: true,
      slidesToScroll: 2,
      autoplay: false,
      infinite: false,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    };

    // this.options1 = {
    //   adTagUrl:
    //     "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=",
    // };





    if (this.data.is_group == 0) {
      this.player.on("ended", () => {
        const userInfo: any = localStorage.getItem("taploginInfo") || {};
        var u_id = JSON.parse(userInfo);
        const formData = new FormData();
        formData.append("c_id", this.data.id);
        formData.append("u_id", u_id?.id);
        this.ds.clearContinueWatching(formData).subscribe((res: any) => {
          if (res.code == 1) {
          }
        });
      })
    }

    var hh = localStorage.getItem("tarilerplay");
    if (hh == "1" && this.isSubsInfo != 1) {
      this.player.notesButton({});
      setTimeout(() => {
        $(".vjs-notes-btn").hide();
      }, 1000);
    }

    if (localStorage.getItem("tarilerplay") == "1") {

      this.player.on("ended", () => {

        if (this.isSubsInfo == 1) {
          setTimeout(() => {
            $(".vjs-notes-btn").hide();
            $(".vjs-seek-button").hide();
          }, 10);

          this.player.overlay({
            overlays: [
              {
                start: "playing",
                // content: (`${this.data.title} ${this.data.season_title} Trailer`),
                align: "center",
              },
            ],
          });

          this.player.on("play", () => {
            if (this.data.is_group == 1) {
              this.player.overlay({
                overlays: [
                  {
                    start: "playing",
                    content: `${this.data.series_title} ${this.data.season_title} Trailer`,
                    align: "center",
                  },
                ],
              });
            } else {
              this.player.overlay({
                overlays: [
                  {
                    start: "playing",
                    content: `${this.data.title} Trailer`,
                    align: "center",
                  },
                ],
              });
            }
          });
        }

        if (this.isSubsInfo != 1) {
          setTimeout(() => {
            this.agetime = true;
            setTimeout(() => {
              if (this.ageshow.is_allow == 1) {
                setTimeout(() => {
                  this.agetime = false;
                }, this.ageshow.duration_in_sec * 100000);
              }
            }, 100000);
          }, 500);
        }

        if (localStorage.getItem("tarilerplay") == "1") {
          if (this.isSubsInfo != 1 && this.data.is_group == 1) {
            $(".vjs-notes-btn").show();
          }

          var hh = localStorage.getItem("tarilerplay");
          if (
            this.data.is_group == 1 &&
            this.data.access_type == "free" &&
            this.isSubsInfo != 1
          ) {
            this.playtrailerconfig();
          } else if (this.isSubsInfo == 1) {
            // this.playtrailerconfig()
          } else {
            if (this.isSubsInfo != 1) {
              this.mat.closeAll();
              localStorage.setItem("woohoo", "1");
              this.router.navigate(["/subscribe"]);
              localStorage.setItem("tarilerplay", "0");
            }
          }
          localStorage.setItem('tarilerplay', '0')
          $(".vjs-seek-button").hide();
        }
      });
    }

    this.player.on("play", () => {
      $(".vjs-seek-button").show();
    });

    if (this.data.is_group == 1) {
      this.player.overlay({
        overlays: [
          {
            start: "playing",

            content: `${this.data.season_number} ${this.data.episode_number} : ${this.data.title}`,
            align: "center",
          },
        ],
      });
    } else {
      this.player.overlay({
        overlays: [
          {
            start: "playing",

            content: this.data.title,
            align: "center",
          },
        ],
      });
    }

    var options2 = {
      seekLeft: {
        handleClick: () => {
          const time = Number(this.player.currentTime()) - 10;

          this.player.currentTime(time);
        },
        doubleTap: true,
      },
      play: {
        handleClick: () => {
          if (this.player.paused()) {
            this.player.play();
          } else {
            this.player.pause();
          }
        },
      },
      seekRight: {
        handleClick: () => {
          const time = Number(this.player.currentTime()) + 10;

          this.player.currentTime(time);
        },
        doubleTap: true,
      },
      lockButton: false,
    };
  }

  nextPlay() {
    this.agetime = true;
    setTimeout(() => {
      if (this.ageshow.is_allow == 1) {
        setTimeout(() => {
          this.agetime = false;
        }, this.ageshow.duration_in_sec * 1000);
      }
    }, 1000);

    if (this.videosrc.length != this.itemget + 1) {
      this.itemget++
    }

    if (this.videosrc[this.itemget].sources[0].access_type == 'free') {
      this.adFirstTime = false;

      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
      this.player.on('ads-manager', (response: any) => {
        var adsManager = response.adsManager;
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          setTimeout(() => {
            this.player.src({
              src: this.m3u8Main,
              spriteThumbnails: {
                url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              },
            })

            setTimeout(() => {
              this.player.play()
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  setTimeout(() => {
                    this.player.currentTime(this.playDuration)
                  }, 200);
                }
              }, 200);
            }, 200);
          }, 500);
          setTimeout(() => {
            this.player.play();
          }, 1000);
        });
      })
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main,
          spriteThumbnails: {
            url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
          },
        })

        setTimeout(() => {
          this.player.play()
          setTimeout(() => {
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              setTimeout(() => {
                this.player.currentTime(this.playDuration)
              }, 200);
            }
          }, 200);
        }, 200);
      }, 500);

      this.adGoogle(localStorage.getItem('googleadUrl'))

      const userInfo: any = localStorage.getItem("taploginInfo");
      let analytics: any = {
        c_id: this.videosrc[this.itemget - 1].sources[0].id,
        dod: "",
        dd: "",
        type: 2,
        content_title: this.data.title,
        total_duration: this.player.cache_.duration,
        pd: Math.floor(this.player.cache_.currentTime),
        cat_id: this.data.category_ids[0],
        age_group: this.data.age_group,
        gender: "Male",
        network_provider: "Airtel",
        customer_name: "User",
      };
      analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo).id);
      formData.append("country", "India");
      formData.append("country_code", "IN");
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });

    } else if (this.isSubsInfo == 1) {
      this.adFirstTime = false;

      if (
        this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
      ) {
        this.player.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
            setTimeout(() => {
              this.player.play();
            }, 1000);
          });
        })
        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
      } else {
        this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
        setTimeout(() => {
          this.player.src({
            src: this.m3u8Main,
            spriteThumbnails: {
              url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
            },
          })

          setTimeout(() => {
            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                setTimeout(() => {
                  this.player.currentTime(this.playDuration)
                }, 200);
              }
            }, 200);

          }, 200);
        }, 500);
      }

      this.adGoogle(localStorage.getItem('googleadUrl'))

      const userInfo: any = localStorage.getItem("taploginInfo");
      let analytics: any = {
        c_id: this.videosrc[this.itemget - 1].sources[0].id,
        dod: "",
        dd: "",
        type: 2,
        content_title: this.data.title,
        total_duration: this.player.cache_.duration,
        pd: Math.floor(this.player.cache_.currentTime),
        cat_id: this.data.category_ids[0],
        age_group: this.data.age_group,
        gender: "Male",
        network_provider: "Airtel",
        customer_name: "User",
      };
      analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo).id);
      formData.append("country", "India");
      formData.append("country_code", "IN");
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });

    } else {
      this.mat.closeAll();
      localStorage.setItem("woohoo", "1");
      this.router.navigate(["/subscribe"]);
    }

    if (this.videosrc[this.itemget].sources[0].skipDuration.length != 0) {
      this.skipTime(this.videosrc[this.itemget].sources[0].skipDuration)
    }

    $(".moveToVideoJs").show();
    setTimeout(() => {
      $(".moveToVideoJs").hide();
    }, 5000);

    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });
    if (this.itemget != 0) {
      $('.vjs-icon-previous-item').prop('disabled', false);
      $('.vjs-icon-previous-item').css('opacity', '1.0');
    }

    if (this.videosrc.length - 1 == this.itemget) {
      $('.vjs-icon-next-item').prop('disabled', true);
      $('.vjs-icon-next-item').css('opacity', '0.5');
    } else {
      $('.vjs-icon-next-item').prop('disabled', false);
      $('.vjs-icon-next-item').css('opacity', '1.0');
    }

    $('#ffffffffffffffffffffffff').hide();
    $('#gggggggggggggggggggggggggg').hide();
    $('#astonband').hide()
    $(".video-js .vjs-tech").css("height", "100%");
    $(".video-js .vjs-tech").css("width", "100%");



    // this.analytics();
  }


  prevPlay() {
    this.agetime = true;
    setTimeout(() => {
      if (this.ageshow.is_allow == 1) {
        setTimeout(() => {
          this.agetime = false;
        }, this.ageshow.duration_in_sec * 1000);
      }
    }, 1000);

    if (this.videosrc[this.itemget].sources[0].access_type == 'free') {
      if (this.itemget != 0) {
        this.itemget--
      }
      this.adFirstTime = false;
      this.adGoogle(localStorage.getItem('googleadUrl'))
      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
      this.player.on('ads-manager', (response: any) => {
        var adsManager = response.adsManager;
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          setTimeout(() => {
            this.player.src({
              src: this.m3u8Main,
              spriteThumbnails: {
                url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              },
            })

            setTimeout(() => {
              this.player.play()
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  setTimeout(() => {
                    this.player.currentTime(this.playDuration)
                  }, 200);
                }
              }, 200);
            }, 200);
          }, 500);
          setTimeout(() => {
            this.player.play();
          }, 1000);
        });
      })
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main,
          spriteThumbnails: {
            url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
          },
        })

        setTimeout(() => {
          this.player.play()
          setTimeout(() => {
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              setTimeout(() => {
                this.player.currentTime(this.playDuration)
              }, 200);
            }
          }, 200);
        }, 200);
      }, 500);
    } else if (this.isSubsInfo == 1) {
      if (this.itemget != 0) {
        this.itemget--
      }
      this.adFirstTime = false;
      this.adGoogle(localStorage.getItem('googleadUrl'))
      if (
        this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
      ) {
        this.player.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
          });
        })
        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
      } else {
        this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
        setTimeout(() => {
          this.player.src({
            src: this.m3u8Main,
            spriteThumbnails: {
              url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
            },
          })

          setTimeout(() => {
            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                setTimeout(() => {
                  this.player.currentTime(this.playDuration)
                }, 200);
              }
            }, 200);
          }, 200);
        }, 500);
      }
    } else {
      this.mat.closeAll();
      localStorage.setItem("woohoo", "1");
      this.router.navigate(["/subscribe"]);
    }

    $(".moveToVideoJs").show();
    setTimeout(() => {
      $(".moveToVideoJs").hide();
    }, 5000);
    if (this.videosrc[this.itemget].sources[0].skipDuration.length != 0) {
      this.skipTime(this.videosrc[this.itemget].sources[0].skipDuration)
    }
    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });
    if (this.itemget == 0) {
      $('.vjs-icon-previous-item').prop('disabled', true);
      $('.vjs-icon-previous-item').css('opacity', '0.5');
    }

    if (this.videosrc.length - 1 != this.itemget)
      $('.vjs-icon-next-item').prop('disabled', false);
    $('.vjs-icon-next-item').css('opacity', '1.0');

    $('#ffffffffffffffffffffffff').hide();
    $('#gggggggggggggggggggggggggg').hide();
    $('#astonband').hide()
    $(".video-js .vjs-tech").css("height", "100%");
    $(".video-js .vjs-tech").css("width", "100%");

    const userInfo: any = localStorage.getItem("taploginInfo");
    let analytics: any = {
      c_id: this.videosrc[this.itemget + 1].sources[0].id,
      dod: "",
      dd: "",
      type: 2,
      content_title: this.data.title,
      total_duration: this.player.cache_.duration,
      pd: Math.floor(this.player.cache_.currentTime),
      cat_id: this.data.category_ids[0],
      age_group: this.data.age_group,
      gender: "Male",
      network_provider: "Airtel",
      customer_name: "User",
    };
    analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
    analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
    const formData = new FormData();
    for (const key in analytics) {
      formData.append(key, analytics[key]);
    }
    formData.append("u_id", JSON.parse(userInfo).id);
    formData.append("country", "India");
    formData.append("country_code", "IN");
    this.ds.analyticsSubmit(formData).subscribe((res: any) => {
      if (res.code == 1) {
        // this.ed.playDetailVideo.next(true);
      }
    });
  }

  showPinPrevNext(type: any) {
    this.player.exitFullscreen()
    this.player.pause()
    const dialogRef = this.mat.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      document.body.style.overflow = 'auto'
      this.player.play()
      this.player.requestFullscreen()
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        if (type == 'prev') {
          this.prevPlay()
        } else if (type == 'next') {
          this.nextPlay()
        } else {
          this.endPlay()
        }
      }
    });
  }


  endPlay() {
    if (this.videosrc.length == this.itemget + 1) {
      setTimeout(() => {
        $('.vjs-seek-button').hide()
      }, 500);
    }
    if (this.videosrc.length != this.itemget + 1) {
      this.itemget++
    }
    this.contentPlaybackEnded = true;
    this.agetime = true;
    setTimeout(() => {
      if (this.ageshow.is_allow == 1) {
        setTimeout(() => {
          this.agetime = false;
        }, this.ageshow.duration_in_sec * 1000);
      }
    }, 1000);
    $(this.player.posterImage.contentEl()).hide();

    if (this.videosrc[this.itemget].sources[0].access_type == 'free') {
      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main,
          spriteThumbnails: {
            url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
          },
        })

        setTimeout(() => {
          this.adFirstTime = false;
          this.adGoogle(localStorage.getItem('googleadUrl'))
          this.player.play()
          setTimeout(() => {
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              setTimeout(() => {
                this.player.currentTime(this.playDuration)
              }, 200);
            }
          }, 200);
        }, 200);
      }, 500);


    } else if (this.isSubsInfo == 1) {
      if (
        this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
      ) {
        this.adFirstTime = false;
        this.adGoogle(localStorage.getItem('googleadUrl'))
        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        this.player.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
          });
        })
      } else {
        this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
        setTimeout(() => {
          this.player.src({
            src: this.m3u8Main,
            spriteThumbnails: {
              url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
            },
          })

          setTimeout(() => {
            this.adFirstTime = false;
            this.adGoogle(localStorage.getItem('googleadUrl'))
            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                setTimeout(() => {
                  this.player.currentTime(this.playDuration)
                }, 200);
              }
            }, 200);
          }, 200);
        }, 500);
      }
    } else {
      this.mat.closeAll();
      localStorage.setItem("woohoo", "1");
      this.router.navigate(["/subscribe"]);
    }

    $(".moveToVideoJs").show();
    setTimeout(() => {
      $(".moveToVideoJs").hide();
    }, 5000);
    // if (this.videosrc[this.itemget].sources[0].skipDuration.length != 0) {
    //   this.skipTime(this.videosrc[this.itemget].sources[0].skipDuration)
    // }
    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });

    $('#ffffffffffffffffffffffff').hide();
    $('#gggggggggggggggggggggggggg').hide();
    $('#astonband').hide()
    $(".video-js .vjs-tech").css("height", "100%");
    $(".video-js .vjs-tech").css("width", "100%");

    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    var u_id = JSON.parse(userInfo);
    const formData = new FormData();
    formData.append("c_id", this.videosrc[this.itemget - 1].sources[0].id);
    formData.append("u_id", u_id?.id);
    this.ds.clearContinueWatching(formData).subscribe((res: any) => {
      if (res.code == 1) {

      }
    });
  }

  getqualitycustom() {
    this.player.on("loadeddata", () => {
      if (this.data.access_type == 'paid') {
        const mediaPlayer = this.player.dash.mediaPlayer;
        this.player.dashQualityLevels =
          mediaPlayer.getBitrateInfoListFor("video");


        this.player.trigger("dashQualityLevels");

        if (this.player.dashQualityLevels.length == 9) {

          this.player.on("dashQualityLevels", (e: any) => {
            let levels = e.target.player.dashQualityLevels;


            const ul: any = document.getElementById("bitrateLevels1");
            let li: any = document.getElementById("quality1");
            li.innerHTML = `${levels[0].height}p`;
            li.setAttribute("height", levels[0].height);
            li.classList.add(`activeMode${0}`);
            li.setAttribute("index", 0);

            li.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li.classList.add("activemode");
            };
            ul.appendChild(li);

            let li1: any = document.getElementById("quality2");
            li1.innerHTML = `${levels[1].height}p`;
            li1.setAttribute("height", levels[1].height);
            li1.classList.add(`activeMode${1}`);
            li1.setAttribute("index", 1);

            li1.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li1.classList.add("activemode");
            };
            ul.appendChild(li1);

            let li2: any = document.getElementById("quality3");
            li2.innerHTML = `${levels[2].height}p`;
            li2.setAttribute("height", levels[2].height);
            li2.classList.add(`activeMode${2}`);
            li2.setAttribute("index", 2);

            li2.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li2.classList.add("activemode");
            };
            ul.appendChild(li2);

            let li3: any = document.getElementById("quality4");
            li3.innerHTML = `${levels[3].height}p`;
            li3.setAttribute("height", levels[3].height);
            li3.classList.add(`activeMode${3}`);
            li3.setAttribute("index", 3);

            li3.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li3.classList.add("activemode");
            };
            ul.appendChild(li3);

            let li4: any = document.getElementById("quality5");
            li4.innerHTML = `${levels[4].height}p`;
            li4.setAttribute("height", levels[4].height);
            li4.classList.add(`activeMode${4}`);
            li4.setAttribute("index", 4);

            li4.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li4.classList.add("activemode");
            };
            ul.appendChild(li4);

            let li5: any = document.getElementById("quality6");
            li5.innerHTML = `${levels[5].height}pl`;
            li5.setAttribute("height", levels[5].height);
            li5.classList.add(`activeMode${5}`);
            li5.setAttribute("index", 5);

            li5.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li5.classList.add("activemode");
            };
            ul.appendChild(li5);

            let li6: any = document.getElementById("quality7");
            li6.innerHTML = `${levels[6].height}ph`;
            li6.setAttribute("height", levels[6].height);
            li6.classList.add(`activeMode${6}`);
            li6.setAttribute("index", 6);

            li6.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li6.classList.add("activemode");
            };
            ul.appendChild(li6);

            let li7: any = document.getElementById("quality8");
            li7.innerHTML = `${levels[7].height}pl`;
            li7.setAttribute("height", levels[7].height);
            li7.classList.add(`activeMode${7}`);
            li7.setAttribute("index", 7);

            li7.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li7.classList.add("activemode");
            };
            ul.appendChild(li7);

            let li8: any = document.getElementById("quality9");
            li8.innerHTML = `${levels[8].height}ph`;
            li8.setAttribute("height", levels[8].height);
            li8.classList.add(`activeMode${8}`);
            li8.setAttribute("index", 8);

            li8.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li8.classList.add("activemode");
            };
            ul.appendChild(li8);

            let li9: any = document.getElementById("quality10");
            li9.innerHTML = "Auto";
            li9.setAttribute("height", "auto");
            li9.classList.add(`activeMode${6}`);
            li9.setAttribute("index", 1);

            li9.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li9.classList.add("activemode");
            };
            ul.appendChild(li9);
          });
        }

        if (this.player.dashQualityLevels.length == 3) {

          this.player.on("dashQualityLevels", (e: any) => {
            let levels = e.target.player.dashQualityLevels;
            const ul: any = document.getElementById("bitrateLevels1");
            let li: any = document.getElementById("quality1");
            li.innerHTML = `${levels[0].height}p`;
            li.setAttribute("height", levels[0].height);
            li.classList.add(`activeMode${0}`);
            li.setAttribute("index", 0);

            li.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li.classList.add("activemode");
            };
            ul.appendChild(li);

            let li1: any = document.getElementById("quality2");
            li1.innerHTML = `${levels[1].height}p`;
            li1.setAttribute("height", levels[1].height);
            li1.classList.add(`activeMode${1}`);
            li1.setAttribute("index", 1);

            li1.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li1.classList.add("activemode");
            };
            ul.appendChild(li1);

            let li2: any = document.getElementById("quality3");
            li2.innerHTML = `${levels[2].height}p`;
            li2.setAttribute("height", levels[2].height);
            li2.classList.add(`activeMode${2}`);
            li2.setAttribute("index", 2);

            li2.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li2.classList.add("activemode");
            };
            ul.appendChild(li2);

            let li9: any = document.getElementById("quality10");
            li9.innerHTML = "Auto";
            li9.setAttribute("height", "auto");
            li9.classList.add(`activeMode${6}`);
            li9.setAttribute("index", 1);

            li9.onclick = (el: any) => {
              this.player.dashQualityLevelsSelected =
                el.target.getAttribute("index");
              this.player.trigger("dashQualityLevelsSelected");
              $("#bitrateLevels1").hide();
              $("ul li.activeModeauto").removeClass("activeModeauto");
              $("ul li.activemode").removeClass("activemode");
              li9.classList.add("activemode");
            };
            ul.appendChild(li9);
          });
          setTimeout(() => {
            // $('#quality1').hide()
            // $('#quality2').hide()
            $('#quality4').hide()
            $('#quality5').hide()
            $('#quality6').hide()
            $('#quality7').hide()
            $('#quality8').hide()
            $('#quality9').hide()
          }, 100);

        }

        this.player.on("dashQualityLevelsSelected", (e: any) => {
          let select = e.target.player.dashQualityLevelsSelected;
          let cfg = {
            streaming: {
              abr: {
                autoSwitchBitrate: {},
              },
            },
          };

          cfg.streaming.abr.autoSwitchBitrate["video"] = false;
          mediaPlayer.updateSettings(cfg);
          mediaPlayer.setQualityFor("video", select, true);
        });

      }
    });
  }

  slideConfig = {
    slidesToShow: 6,
    dots: false,
    arrows: true,
    slidesToScroll: 1,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          dots: false,
          arrows: false,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          dots: false,
          arrows: false,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
        },
      },
    ],
  };

  playtrailerconfig() {

    if (this.data.drm == 1 && this.data.access_type == 'paid') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.data.sprite_url != null) {
        this.drmContent(
          this.data.id,
          this.data.k_id,
          this.data.url,
          this.data.access_type,
          this.data.sprite_url.web
        )
      } else {
        this.drmContent(
          this.data.id,
          this.data.k_id,
          this.data.url,
          this.data.access_type,
          ""
        );
      }


      this.player.overlay({
        overlays: [
          {
            start: "playing",
            content: `${this.data.season_number} ${this.data.episode_number} : ${this.data.title}`,
            align: "center",
          },
        ],
      });

      this.player.on("timeupdate", () => {
        if (Math.floor(this.player.currentTime()) == this.introSeconds) {
          $(".title").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.introSeconds
        ) {
          $(".title").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
          $(".title1").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.recapSeconds
        ) {
          $(".title1").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
          $(".title2").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.creditSeconds
        ) {
          $(".title2").hide();
        }
      });
    } else if (this.data.drm == 0 && this.data.access_type == 'paid') {
      this.getm3u8Url(this.data.id)
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main
        })

        this.player.play()
        this.player.hlsQualitySelector()
      }, 500);
    }

    this.player.ready(() => {
      this.player = window.videoPlayer || {};
      this.player = videoJs("video-player");
      this.player.on("timeupdate", () => {
        if (Math.floor(this.player.currentTime()) == this.introSeconds) {
          $(".title").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.introSeconds
        ) {
          $(".title").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
          $(".title1").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.recapSeconds
        ) {
          $(".title1").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
          $(".title2").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.creditSeconds
        ) {
          $(".title2").hide();
        }
      });

      ((o: any) => {
        this.ds
          .getEpisodeData(
            this.display_offset,
            this.maxcounter,
            this.data.season_id
          )
          .pipe(
            map((res: any) => {
              if (res.code == 1) {
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);
                this.EpiData = decryptData.content;

                if (decryptData.content) {
                  this.EpiData.forEach((element: any) => {
                    this.EpiData.map((category: any) => {
                      category.sliderImg = "";
                      category.sliderIdentifier = "";
                      if (
                        category.is_group == 1 &&
                        category.groupInfo != null
                      ) {
                        category.layout_thumbs.forEach((thumb: any) => {
                          if (thumb != null) {
                            if (thumb.layout == "rectangle_16x9") {
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
                      } else if (category.is_group == 0) {
                        category.layout_thumbs.forEach((thumb: any) => {
                          if (thumb.layout == "rectangle_16x9") {
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
                        });
                      }
                    });
                    // convert duration in min start
                    var hours = element.duration.slice(0, 2);

                    var minute = element.duration.slice(3, 5);
                    var seconds = element.duration.slice(6, 8);
                    var min = hours * 60;
                    if (seconds > 30) {
                      this.hours_minutes = Number(min) + Number(minute) + 1;

                    } else {
                      this.hours_minutes = Number(min) + Number(minute);

                    }
                    // convert duration in min end
                    if (element.sprite_url != null) {
                      var sprite = element.sprite_url.web
                    } else {
                      var sprite: any = ""
                    }
                    this.videosrc = [];
                    setTimeout(() => {
                      this.videosrc.push({
                        sources: [
                          {
                            src: element.url,
                            title: element.title,
                            id: element.id,
                            access: element.access_type,
                            age: element.age_group,
                            drm: element.drm,
                            season: element.season_number,
                            episode: element.episode_number,
                            kId: element.k_id,
                            spriteThumbnails: {
                              url: sprite,
                            },
                          },
                        ],
                      });
                    }, 500);

                    this.arr.push(element.id);

                  });
                }
                this.itemget = 0;
                if (this.itemget >= this.videosrc.length) this.itemget = 0;

                // setTimeout(() => {
                //   if (this.itemget == 0) {
                //     $('.vjs-icon-previous-item').prop('disabled', true);
                //     $('.vjs-icon-previous-item').css('opacity', '0.5');
                //   } else {
                //     $('.vjs-icon-previous-item').prop('disabled', false);
                //     $('.vjs-icon-previous-item').css('opacity', '1.0');
                //   }
                // }, 500);

                // if (this.arr.length == 1) {
                //   setTimeout(() => {

                //     $('.vjs-icon-previous-item').prop('disabled', true);
                //     $('.vjs-icon-previous-item').css('opacity', '0.5');

                //     $('.vjs-icon-next-item').prop('disabled', true);
                //     $('.vjs-icon-next-item').css('opacity', '0.5');

                //   }, 500);
                // }

                if (this.data.hasOwnProperty('index')) {
                  if (this.data.index != "") {
                    if (this.data.index == 0) {
                      this.itemget = this.data.index
                      if (this.arr.length == this.data.index) {
                        // setTimeout(() => {
                        //   $('.vjs-icon-next-item').prop('disabled', true);
                        //   $('.vjs-icon-next-item').css('opacity', '0.5');
                        // }, 1000);

                      }
                    } else {
                      this.itemget = this.data.index - 1
                      if (this.arr.length == this.data.index) {
                        // setTimeout(() => {
                        //   $('.vjs-icon-next-item').prop('disabled', true);
                        //   $('.vjs-icon-next-item').css('opacity', '0.5');
                        // }, 1000);

                      }
                    }

                  } else {
                    this.itemget = 0;
                  }
                } else {
                  this.itemget = 0;
                }

                if (this.videosrc.length - 1 != this.itemget) {
                  this.player.on("ended", () => {
                    this.contentPlaybackEnded = true;
                    this.agetime = true;
                    setTimeout(() => {
                      if (this.ageshow.is_allow == 1) {
                        setTimeout(() => {
                          this.agetime = false;
                        }, this.ageshow.duration_in_sec * 1000);
                      }
                    }, 1000);
                    $(this.player.posterImage.contentEl()).hide();
                    if (this.videosrc.length != this.itemget + 1) {
                      this.itemget++
                    }

                    if (this.videosrc[this.itemget].sources[0].drm == 0) {
                      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
                      setTimeout(() => {
                        this.player.src({
                          src: this.m3u8Main,
                          spriteThumbnails: {
                            url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                          },
                        })

                        setTimeout(() => {
                          this.player.play()
                          setTimeout(() => {
                            if (this.free_preview == 1 && this.isSubsInfo != 1) {
                              this.player.currentTime(0)
                            } else {
                              setTimeout(() => {
                                this.player.currentTime(this.playDuration)
                              }, 200);
                            }
                          }, 200);
                        }, 200);
                      }, 500);

                    } else if (this.isSubsInfo == 1) {
                      if (
                        this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
                      ) {
                        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                      }
                    } else {
                      this.mat.closeAll();
                      localStorage.setItem("woohoo", "1");
                      this.router.navigate(["/subscribe"]);
                    }

                    $(".moveToVideoJs").show();
                    setTimeout(() => {
                      $(".moveToVideoJs").hide();
                    }, 5000);

                    this.player.overlay({
                      overlays: [
                        {
                          start: "playing",
                          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
                          align: "center",
                        },
                      ],
                    });

                    // if (this.itemget != 0) {
                    //   $('.vjs-icon-previous-item').prop('disabled', false);
                    //   $('.vjs-icon-previous-item').css('opacity', '1.0');
                    // }

                    // if (this.videosrc.length - 1 == this.itemget) {
                    //   $('.vjs-icon-next-item').prop('disabled', true);
                    //   $('.vjs-icon-next-item').css('opacity', '0.5');
                    // } else {
                    //   $('.vjs-icon-next-item').prop('disabled', false);
                    //   $('.vjs-icon-next-item').css('opacity', '1.0');
                    // }
                    $('#ffffffffffffffffffffffff').hide();
                    $('#gggggggggggggggggggggggggg').hide();
                    $('#astonband').hide()
                    $(".video-js .vjs-tech").css("height", "100%");
                    $(".video-js .vjs-tech").css("width", "100%");

                    const userInfo: any = localStorage.getItem("taploginInfo") || {};
                    var u_id = JSON.parse(userInfo);
                    const formData = new FormData();
                    formData.append("c_id", this.videosrc[this.itemget - 1].sources[0].id);
                    formData.append("u_id", u_id?.id);
                    this.ds.clearContinueWatching(formData).subscribe((res: any) => {
                      if (res.code == 1) {
                      }
                    });
                  });
                }



                //   For next and prev
                var buttonComponent = videoJs.getComponent("Button");
                var prevButton = videoJs.extend(buttonComponent, {
                  constructor: function () {
                    buttonComponent.apply(this, arguments);
                    this.addClass("vjs-icon-previous-item");
                    this.controlText("Previous");
                  },
                  handleClick: (e: any) => {
                    this.agetime = true;
                    setTimeout(() => {
                      if (this.ageshow.is_allow == 1) {
                        setTimeout(() => {
                          this.agetime = false;
                        }, this.ageshow.duration_in_sec * 1000);
                      }
                    }, 1000);

                    if (this.videosrc[this.itemget].sources[0].drm == 0) {
                      if (this.itemget != 0) {
                        this.itemget--
                      }
                      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
                      setTimeout(() => {
                        this.player.src({
                          src: this.m3u8Main,
                          spriteThumbnails: {
                            url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                          },
                        })

                        setTimeout(() => {
                          this.player.play()
                          setTimeout(() => {
                            if (this.free_preview == 1 && this.isSubsInfo != 1) {
                              this.player.currentTime(0)
                            } else {
                              setTimeout(() => {
                                this.player.currentTime(this.playDuration)
                              }, 200);
                            }
                          }, 200);
                        }, 200);
                      }, 500);
                    } else if (this.isSubsInfo == 1) {
                      if (this.itemget != 0) {
                        this.itemget--
                      }
                      if (
                        this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
                      ) {
                        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                      }
                    } else {
                      this.mat.closeAll();
                      localStorage.setItem("woohoo", "1");
                      this.router.navigate(["/subscribe"]);
                    }

                    $(".moveToVideoJs").show();
                    setTimeout(() => {
                      $(".moveToVideoJs").hide();
                    }, 5000);

                    this.player.overlay({
                      overlays: [
                        {
                          start: "playing",
                          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
                          align: "center",
                        },
                      ],
                    });

                    // if (this.itemget == 0) {
                    //   $('.vjs-icon-previous-item').prop('disabled', true);
                    //   $('.vjs-icon-previous-item').css('opacity', '0.5');
                    // }

                    // if (this.videosrc.length - 1 != this.itemget)
                    //   $('.vjs-icon-next-item').prop('disabled', false);
                    // $('.vjs-icon-next-item').css('opacity', '1.0');

                    $('#ffffffffffffffffffffffff').hide();
                    $('#gggggggggggggggggggggggggg').hide();
                    $('#astonband').hide()
                    $(".video-js .vjs-tech").css("height", "100%");
                    $(".video-js .vjs-tech").css("width", "100%");

                    // const userInfo: any = localStorage.getItem("taploginInfo");
                    // let analytics: any = {
                    //   c_id: this.videosrc[this.itemget + 1].sources[0].id,
                    //   dod: "",
                    //   dd: "",
                    //   type: 2,
                    //   content_title: this.data.title,
                    //   total_duration: this.player.cache_.duration,
                    //   pd: Math.floor(this.player.cache_.currentTime),
                    //   cat_id: this.data.category_ids[0],
                    //   age_group: this.data.age_group,
                    //   gender: "Male",
                    //   network_provider: "Airtel",
                    //   customer_name: "User",
                    // };
                    // analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
                    // analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                    // const formData = new FormData();
                    // for (const key in analytics) {
                    //   formData.append(key, analytics[key]);
                    // }
                    // formData.append("u_id", JSON.parse(userInfo).id);
                    // formData.append("country", "India");
                    // formData.append("country_code", "IN");
                    // this.ds.analyticsSubmit(formData).subscribe((res: any) => {
                    //   if (res.code == 1) {
                    //     // this.ed.playDetailVideo.next(true);
                    //   }
                    // });
                    // this.analytics();
                  },



                });

                var nextButton = videoJs.extend(buttonComponent, {
                  constructor: function () {
                    buttonComponent.apply(this, arguments);
                    this.addClass("vjs-icon-next-item");
                    this.controlText("Next");
                  },
                  handleClick: (e: any) => {
                    this.agetime = true;
                    setTimeout(() => {
                      if (this.ageshow.is_allow == 1) {
                        setTimeout(() => {
                          this.agetime = false;
                        }, this.ageshow.duration_in_sec * 1000);
                      }
                    }, 1000);

                    if (this.videosrc.length != this.itemget + 1) {
                      this.itemget++
                    }
                    if (this.videosrc[this.itemget].sources[0].drm == 0) {
                      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
                      setTimeout(() => {
                        this.player.src({
                          src: this.m3u8Main,
                          spriteThumbnails: {
                            url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
                          },
                        })

                        setTimeout(() => {
                          this.player.play()
                          setTimeout(() => {
                            if (this.free_preview == 1 && this.isSubsInfo != 1) {
                              this.player.currentTime(0)
                            } else {
                              setTimeout(() => {
                                this.player.currentTime(this.playDuration)
                              }, 200);
                            }
                          }, 200);
                        }, 200);
                      }, 500);

                    } else if (this.isSubsInfo == 1) {
                      if (
                        this.videosrc[this.itemget].sources[0].drm == 1 && this.videosrc[this.itemget].sources[0].access == 'paid'
                      ) {
                        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
                      }
                    } else {
                      this.mat.closeAll();
                      localStorage.setItem("woohoo", "1");
                      this.router.navigate(["/subscribe"]);
                    }

                    $(".moveToVideoJs").show();
                    setTimeout(() => {
                      $(".moveToVideoJs").hide();
                    }, 5000);

                    this.player.overlay({
                      overlays: [
                        {
                          start: "playing",
                          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
                          align: "center",
                        },
                      ],
                    });

                    // if (this.itemget != 0) {
                    //   $('.vjs-icon-previous-item').prop('disabled', false);
                    //   $('.vjs-icon-previous-item').css('opacity', '1.0');
                    // }

                    // if (this.videosrc.length - 1 == this.itemget) {
                    //   $('.vjs-icon-next-item').prop('disabled', true);
                    //   $('.vjs-icon-next-item').css('opacity', '0.5');
                    // } else {
                    //   $('.vjs-icon-next-item').prop('disabled', false);
                    //   $('.vjs-icon-next-item').css('opacity', '1.0');
                    // }

                    $('#ffffffffffffffffffffffff').hide();
                    $('#gggggggggggggggggggggggggg').hide();
                    $('#astonband').hide()
                    $(".video-js .vjs-tech").css("height", "100%");
                    $(".video-js .vjs-tech").css("width", "100%");

                    // const userInfo: any = localStorage.getItem("taploginInfo");
                    // let analytics: any = {
                    //   c_id: this.videosrc[this.itemget - 1].sources[0].id,
                    //   dod: "",
                    //   dd: "",
                    //   type: 2,
                    //   content_title: this.data.title,
                    //   total_duration: this.player.cache_.duration,
                    //   pd: Math.floor(this.player.cache_.currentTime),
                    //   cat_id: this.data.category_ids[0],
                    //   age_group: this.data.age_group,
                    //   gender: "Male",
                    //   network_provider: "Airtel",
                    //   customer_name: "User",
                    // };
                    // analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
                    // analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                    // const formData = new FormData();
                    // for (const key in analytics) {
                    //   formData.append(key, analytics[key]);
                    // }
                    // formData.append("u_id", JSON.parse(userInfo).id);
                    // formData.append("country", "India");
                    // formData.append("country_code", "IN");
                    // this.ds.analyticsSubmit(formData).subscribe((res: any) => {
                    //   if (res.code == 1) {
                    //     // this.ed.playDetailVideo.next(true);
                    //   }
                    // });

                    // this.analytics();
                  },
                });

                videoJs.registerComponent("prevButton", prevButton);
                videoJs.registerComponent("nextButton", nextButton);

                this.player
                  .getChild("controlBar")
                  .addChild("prevButton", {}, 0);
                this.player
                  .getChild("controlBar")
                  .addChild("nextButton", {}, 2);
              }
            })
          )
          .subscribe();
      })(this.player);

      if (
        this.data.groupInfo != null &&
        this.data.groupInfo.child.length != 0
      )
        this.player.notesButton({});
    });
  }

  resetDelay1 = () => {
    clearTimeout(this.inactivityTimeout);

    this.inactivityTimeout = setTimeout(() => {
      this.player.userActive(false);
      $(".vjs-overlay").hide();
      $(".close-btn-video").hide();
    }, 5000);
  };

  crossEpisode() {
    $(".episodeSelector").hide();
    this.ed.pauseDetailVideo.next(false);
  }

  jsondata() {
    this.isTrailerPlaying = localStorage.getItem("tarilerplay") === "1";
    this.ds.faqData().subscribe((data: any) => {
      this.ageshow = data.Player[0].UA_setting;
      this.lBandShow = data.Player[0].ads_visible;
      // this.googleAdsAllow = data;
    });
  }



  playEpisode(episodedata: any, epidatai: any) {
    if (episodedata.is_ad == 1) {
      window.open(episodedata.ad_url);
    } else {
      $('#ffffffffffffffffffffffff').hide();
      $('#gggggggggggggggggggggggggg').hide();
      $('#astonband').hide()
      $(".video-js .vjs-tech").css("height", "100%");
      $(".video-js .vjs-tech").css("width", "100%");
      this.itemget = epidatai

      $(".episodeSelector").hide();
      this.agetime = true;
      setTimeout(() => {
        if (this.ageshow.is_allow == 1) {
          setTimeout(() => {
            this.agetime = false;
          }, this.ageshow.duration_in_sec * 1000);
        }
      }, 1000);
      this.player.overlay({
        overlays: [
          {
            start: "playing",
            content: `${episodedata.season_number} ${episodedata.episode_number} : ${episodedata.title}`,
            align: "center",
          },
        ],
      });

      if (this.itemget == 0) {
        $('.vjs-icon-previous-item').prop('disabled', true);
        $('.vjs-icon-previous-item').css('opacity', '0.5');
      }

      if (this.videosrc.length - 1 != this.itemget)
        $('.vjs-icon-next-item').prop('disabled', false);
      $('.vjs-icon-next-item').css('opacity', '1.0');

      if (this.itemget != 0) {
        $('.vjs-icon-previous-item').prop('disabled', false);
        $('.vjs-icon-previous-item').css('opacity', '1.0');
      }

      if (this.videosrc.length - 1 == this.itemget) {
        $('.vjs-icon-next-item').prop('disabled', true);
        $('.vjs-icon-next-item').css('opacity', '0.5');
      } else {
        $('.vjs-icon-next-item').prop('disabled', false);
        $('.vjs-icon-next-item').css('opacity', '1.0');
      }

      if (episodedata.access_type == 'paid' && this.isSubsInfo == 1 && episodedata.drm == 1) {

        this.userId = localStorage.getItem("taploginInfo");
        this.user = JSON.parse(this.userId);
        this.player = videoJs("video-player");
        this.adFirstTime = false;
        this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
        this.player.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            if (episodedata.sprite_url != null) {
              this.drmContent(
                episodedata.id,
                episodedata.k_id,
                episodedata.url,
                episodedata.access_type,
                episodedata.sprite_url.web
              );
            } else {
              this.drmContent(
                episodedata.id,
                episodedata.k_id,
                episodedata.url,
                episodedata.access_type,
                ""
              );
            }
          });
        })
        if (episodedata.sprite_url != null) {
          this.drmContent(
            episodedata.id,
            episodedata.k_id,
            episodedata.url,
            episodedata.access_type,
            episodedata.sprite_url.web
          );
        } else {
          this.drmContent(
            episodedata.id,
            episodedata.k_id,
            episodedata.url,
            episodedata.access_type,
            ""
          );
        }
      } else if (episodedata.drm == 0 || episodedata.access_type == 'free') {
        this.getm3u8Url(episodedata.id)

        this.player.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            if (episodedata.sprite_url != null) {
              setTimeout(() => {
                this.player.src({
                  src: this.m3u8Main,
                  spriteThumbnails: {
                    url: episodedata.sprite_url.web,
                  },
                })

                if (episodedata.sprite_url != "") {
                  this.player.spriteThumbnails({
                    interval: 5,
                    url: episodedata.sprite_url.web,
                    width: 224,
                    height: 127,
                    responsive: 600,
                  });
                }

                setTimeout(() => {
                  this.adFirstTime = false;
                  this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
                  this.player.play()
                  setTimeout(() => {
                    if (this.free_preview == 1 && this.isSubsInfo != 1) {
                      this.player.currentTime(0)
                    } else {
                      setTimeout(() => {
                        this.player.currentTime(this.playDuration)
                      }, 200);
                    }
                  }, 200);
                }, 200);
              }, 500);
            }
          });

        })
        setTimeout(() => {
          this.player.src({
            src: this.m3u8Main,
            spriteThumbnails: {
              url: episodedata.sprite_url.web,
            },
          })

          if (episodedata.sprite_url != "") {
            this.player.spriteThumbnails({
              interval: 5,
              url: episodedata.sprite_url.web,
              width: 224,
              height: 127,
              responsive: 600,
            });
          }

          setTimeout(() => {
            this.adFirstTime = false;
            this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                setTimeout(() => {
                  this.player.currentTime(this.playDuration)
                }, 200);
              }
            }, 200);
          }, 200);
        }, 500);
      } else {

        this.mat.closeAll();
        this.router.navigate(["/subscribe"]);
      }

      this.player.on("timeupdate", () => {
        if (Math.floor(this.player.currentTime()) == this.introSeconds) {
          $(".title").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.introSeconds
        ) {
          $(".title").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
          $(".title1").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.recapSeconds
        ) {
          $(".title1").hide();
        }

        if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
          $(".title2").show();
        } else if (
          Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.creditSeconds
        ) {
          $(".title2").hide();
        }
      });

      // const userInfo: any = localStorage.getItem("taploginInfo");
      // let analytics: any = {
      //   c_id: episodedata.id,
      //   dod: "",
      //   dd: "",
      //   type: 2,
      //   content_title: this.data.title,
      //   total_duration: this.player.cache_.duration,
      //   pd: Math.floor(this.player.cache_.currentTime),
      //   cat_id: this.data.category_ids[0],
      //   age_group: this.data.age_group,
      //   gender: "Male",
      //   network_provider: "Airtel",
      //   customer_name: "User",
      // };
      // analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
      // analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      // const formData = new FormData();
      // for (const key in analytics) {
      //   formData.append(key, analytics[key]);
      // }
      // formData.append("u_id", JSON.parse(userInfo).id);
      // formData.append("country", "India");
      // formData.append("country_code", "IN");
      // this.ds.Submit(formData).subscribe((res: any) => {
      //   if (res.code == 1) {
      //     // this.ed.playDetailVideo.next(true);
      //   }
      // });
    }


    if (this.getBrowserName == 'safari') {
      this.getm3u8Url(this.data.id)
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main
        })

        this.player.play()
        this.player.hlsQualitySelector()
      }, 1000);
    }
    if (episodedata.skip_duration.length != 0) {
      this.skipTime(episodedata.skip_duration)
    }
    setTimeout(() => {
      this.player.on("timeupdate", () => {

        if (
          Math.floor(this.player.currentTime()) == this.introSeconds
        ) {

          $(".title").show();
        } else if (
          Math.floor(this.player.currentTime()) >=
          this.introSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.introSeconds
        ) {
          $(".title").hide();
        }

        if (
          Math.floor(this.player.currentTime()) == this.recapSeconds
        ) {
          $("#titleTwo").appendTo($('#video-ls'));
          $(".title1").show();
        } else if (
          Math.floor(this.player.currentTime()) >=
          this.recapSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.recapSeconds
        ) {
          $(".title1").hide();
        }

        if (
          Math.floor(this.player.currentTime()) == this.creditSeconds
        ) {
          $("#titleThree").appendTo($('#video-ls'));
          $(".title2").show();
        } else if (
          Math.floor(this.player.currentTime()) >=
          this.creditSeconds1 ||
          Math.floor(this.player.currentTime()) <= this.creditSeconds
        ) {
          $(".title2").hide();
        }
      });
    }, 1000);
  }

  // playEpisode(episodedata: any, epidatai: any) {
  //   const ipDetail: any = localStorage.getItem("ipSaveData");
  //   const detail = JSON.parse(ipDetail);
  //   if (episodedata.content_publish.length != 0) {
  //     for (let i in episodedata.content_publish) {
  //       this.countryAllowed.push(episodedata.content_publish[i].country_code);
  //     }
  //     var a = this.countryAllowed.indexOf(detail.countryCode);
  //     if (a == -1 && episodedata.content_publish[0].country_code != "A") {
  //       const dialogRef = this.mat.open(CountryLockPopupComponent, {
  //         backdropClass: "popupBackdropClass",
  //         panelClass: "adultAgePopup",
  //         width: "390px",
  //       });
  //     } else {
  //       $('#ffffffffffffffffffffffff').hide();
  //       $('#gggggggggggggggggggggggggg').hide();
  //       $('#astonband').hide()
  //       $(".video-js .vjs-tech").css("height", "100%");
  //       $(".video-js .vjs-tech").css("width", "100%");
  //       this.itemget = epidatai
  //       $(".episodeSelector").hide();
  //       this.agetime = true;
  //       setTimeout(() => {
  //         if (this.ageshow.is_allow == 1) {
  //           setTimeout(() => {
  //             this.agetime = false;
  //           }, this.ageshow.duration_in_sec * 1000);
  //         }
  //       }, 1000);
  //       this.player.overlay({
  //         overlays: [
  //           {
  //             start: "playing",
  //             content: `${episodedata.season_number} ${episodedata.episode_number} : ${episodedata.title}`,
  //             align: "center",
  //           },
  //         ],
  //       });

  //       if (this.itemget == 0) {
  //         $('.vjs-icon-previous-item').prop('disabled', true);
  //         $('.vjs-icon-previous-item').css('opacity', '0.5');
  //       }

  //       if (this.videosrc.length - 1 != this.itemget)
  //         $('.vjs-icon-next-item').prop('disabled', false);
  //       $('.vjs-icon-next-item').css('opacity', '1.0');

  //       if (this.itemget != 0) {
  //         $('.vjs-icon-previous-item').prop('disabled', false);
  //         $('.vjs-icon-previous-item').css('opacity', '1.0');
  //       }

  //       if (this.videosrc.length - 1 == this.itemget) {
  //         $('.vjs-icon-next-item').prop('disabled', true);
  //         $('.vjs-icon-next-item').css('opacity', '0.5');
  //       } else {
  //         $('.vjs-icon-next-item').prop('disabled', false);
  //         $('.vjs-icon-next-item').css('opacity', '1.0');
  //       }

  //       if (episodedata.access_type == 'paid' && this.isSubsInfo == 1) {
  //         this.userId = localStorage.getItem("taploginInfo");
  //         this.user = JSON.parse(this.userId);
  //         this.player = videoJs("video-player");
  //         if (episodedata.sprite_url != null) {
  //           this.drmContent(
  //             episodedata.id,
  //             episodedata.k_id,
  //             episodedata.url,
  //             episodedata.access_type,
  //             episodedata.sprite_url.web
  //           );
  //         } else {
  //           this.drmContent(
  //             episodedata.id,
  //             episodedata.k_id,
  //             episodedata.url,
  //             episodedata.access_type,
  //             ""
  //           );
  //         }
  //       } else if (episodedata.drm == 0 || episodedata.access_type == 'free') {
  //         this.getm3u8Url(episodedata.id)
  //         setTimeout(() => {
  //           this.player.src({
  //             src: this.m3u8Main
  //           })

  //           setTimeout(() => {
  //             this.player.play()
  //             setTimeout(() => {
  //               this.player.currentTime(this.playDuration);
  //             }, 200);
  //           }, 200);
  //         }, 500);
  //       } else {

  //         this.mat.closeAll();
  //         this.router.navigate(["/subscribe"]);
  //       }

  // this.player.on("timeupdate", () => {
  //   if (Math.floor(this.player.currentTime()) == this.introSeconds) {
  //     $(".title").show();
  //   } else if (
  //     Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
  //     Math.floor(this.player.currentTime()) <= this.introSeconds
  //   ) {
  //     $(".title").hide();
  //   }

  //   if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
  //     $(".title1").show();
  //   } else if (
  //     Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
  //     Math.floor(this.player.currentTime()) <= this.recapSeconds
  //   ) {
  //     $(".title1").hide();
  //   }

  //   if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
  //     $(".title2").show();
  //   } else if (
  //     Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
  //     Math.floor(this.player.currentTime()) <= this.creditSeconds
  //   ) {
  //     $(".title2").hide();
  //   }
  // });

  //       const userInfo: any = localStorage.getItem("taploginInfo");
  //       let analytics: any = {
  //         c_id: episodedata.id,
  //         dod: "",
  //         dd: "",
  //         type: 2,
  //         content_title: this.data.title,
  //         total_duration: this.player.cache_.duration,
  //         pd: Math.floor(this.player.cache_.currentTime),
  //         cat_id: this.data.category_ids[0],
  //         age_group: this.data.age_group,
  //         gender: "Male",
  //         network_provider: "Airtel",
  //         customer_name: "User",
  //       };
  //       analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
  //       analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
  //       const formData = new FormData();
  //       for (const key in analytics) {
  //         formData.append(key, analytics[key]);
  //       }
  //       formData.append("u_id", JSON.parse(userInfo).id);
  //       formData.append("country", "India");
  //       formData.append("country_code", "IN");
  //       this.ds.analyticsSubmit(formData).subscribe((res: any) => {
  //         if (res.code == 1) {
  //           // this.ed.playDetailVideo.next(true);
  //         }
  //       });
  //     }
  //   } else {
  //     $('#ffffffffffffffffffffffff').hide();
  //     $('#gggggggggggggggggggggggggg').hide();
  //     $('#astonband').hide()
  //     $(".video-js .vjs-tech").css("height", "100%");
  //     $(".video-js .vjs-tech").css("width", "100%");
  //     this.itemget = epidatai
  //     $(".episodeSelector").hide();
  //     this.agetime = true;
  //     setTimeout(() => {
  //       if (this.ageshow.is_allow == 1) {
  //         setTimeout(() => {
  //           this.agetime = false;
  //         }, this.ageshow.duration_in_sec * 1000);
  //       }
  //     }, 1000);
  //     this.player.overlay({
  //       overlays: [
  //         {
  //           start: "playing",
  //           content: `${episodedata.season_number} ${episodedata.episode_number} : ${episodedata.title}`,
  //           align: "center",
  //         },
  //       ],
  //     });

  //     if (this.itemget == 0) {
  //       $('.vjs-icon-previous-item').prop('disabled', true);
  //       $('.vjs-icon-previous-item').css('opacity', '0.5');
  //     }

  //     if (this.videosrc.length - 1 != this.itemget)
  //       $('.vjs-icon-next-item').prop('disabled', false);
  //     $('.vjs-icon-next-item').css('opacity', '1.0');

  //     if (this.itemget != 0) {
  //       $('.vjs-icon-previous-item').prop('disabled', false);
  //       $('.vjs-icon-previous-item').css('opacity', '1.0');
  //     }

  //     if (this.videosrc.length - 1 == this.itemget) {
  //       $('.vjs-icon-next-item').prop('disabled', true);
  //       $('.vjs-icon-next-item').css('opacity', '0.5');
  //     } else {
  //       $('.vjs-icon-next-item').prop('disabled', false);
  //       $('.vjs-icon-next-item').css('opacity', '1.0');
  //     }

  //     if (episodedata.access_type == 'paid' && this.isSubsInfo == 1) {
  //       this.userId = localStorage.getItem("taploginInfo");
  //       this.user = JSON.parse(this.userId);
  //       this.player = videoJs("video-player");
  //       if (episodedata.sprite_url != null) {
  //         this.drmContent(
  //           episodedata.id,
  //           episodedata.k_id,
  //           episodedata.url,
  //           episodedata.access_type,
  //           episodedata.sprite_url.web
  //         );
  //       } else {
  //         this.drmContent(
  //           episodedata.id,
  //           episodedata.k_id,
  //           episodedata.url,
  //           episodedata.access_type,
  //           ""
  //         );
  //       }
  //     } else if (episodedata.drm == 0 || episodedata.access_type == 'free') {
  //       this.getm3u8Url(episodedata.id)
  //       setTimeout(() => {
  //         this.player.src({
  //           src: this.m3u8Main
  //         })

  //         setTimeout(() => {
  //           this.player.play()
  //           setTimeout(() => {
  //             this.player.currentTime(this.playDuration);
  //           }, 200);
  //         }, 200);
  //       }, 500);
  //     } else {

  //       this.mat.closeAll();
  //       this.router.navigate(["/subscribe"]);
  //     }

  //     this.player.on("timeupdate", () => {
  //       if (Math.floor(this.player.currentTime()) == this.introSeconds) {
  //         $(".title").show();
  //       } else if (
  //         Math.floor(this.player.currentTime()) >= this.introSeconds1 ||
  //         Math.floor(this.player.currentTime()) <= this.introSeconds
  //       ) {
  //         $(".title").hide();
  //       }

  //       if (Math.floor(this.player.currentTime()) == this.recapSeconds) {
  //         $(".title1").show();
  //       } else if (
  //         Math.floor(this.player.currentTime()) >= this.recapSeconds1 ||
  //         Math.floor(this.player.currentTime()) <= this.recapSeconds
  //       ) {
  //         $(".title1").hide();
  //       }

  //       if (Math.floor(this.player.currentTime()) == this.creditSeconds) {
  //         $(".title2").show();
  //       } else if (
  //         Math.floor(this.player.currentTime()) >= this.creditSeconds1 ||
  //         Math.floor(this.player.currentTime()) <= this.creditSeconds
  //       ) {
  //         $(".title2").hide();
  //       }
  //     });

  //     const userInfo: any = localStorage.getItem("taploginInfo");
  //     let analytics: any = {
  //       c_id: episodedata.id,
  //       dod: "",
  //       dd: "",
  //       type: 2,
  //       content_title: this.data.title,
  //       total_duration: this.player.cache_.duration,
  //       pd: Math.floor(this.player.cache_.currentTime),
  //       cat_id: this.data.category_ids[0],
  //       age_group: this.data.age_group,
  //       gender: "Male",
  //       network_provider: "Airtel",
  //       customer_name: "User",
  //     };
  //     analytics.dod = `{ "os_version": "6.0", "app_version": "2.8", "network_type": "wifi", "network_provider": "" }`;
  //     analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "${this.deviceService.deviceType}", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
  //     const formData = new FormData();
  //     for (const key in analytics) {
  //       formData.append(key, analytics[key]);
  //     }
  //     formData.append("u_id", JSON.parse(userInfo).id);
  //     formData.append("country", "India");
  //     formData.append("country_code", "IN");
  //     this.ds.analyticsSubmit(formData).subscribe((res: any) => {
  //       if (res.code == 1) {
  //         // this.ed.playDetailVideo.next(true);
  //       }
  //     });
  //   }




  // }

  slickInit(_e: any) { }

  breakpoint(_e: any) { }

  afterChange(_e: any) { }

  beforeChange(_e: any) { }

  skipIntro() {
    this.player.currentTime(this.introSeconds1);
  }

  skipRecap() {
    this.player.currentTime(this.recapSeconds1);
  }

  skipCredit() {
    this.player.currentTime(this.creditSeconds1);
  }
  analytics() {
    let allAnalytics: any = localStorage.getItem('ipSaveData')
    let allAnalyticsData = JSON.parse(allAnalytics)

    const agent = window.navigator


    if (this.data.category_ids[0] == '' || this.data.category_ids[0] == null) {
      this.cat_iid = '';
    } else {
      this.cat_iid = this.data.category_ids[0];
    }
    const userInfo: any = localStorage.getItem("taploginInfo");

    if (JSON.parse(userInfo)?.gender == " ") {
      this.session_gender = 'others'
    } else {
      this.session_gender = JSON.parse(userInfo)?.gender
    }
    if (this.data.is_group == 1) {


      let analytics: any = {
        c_id: this.videosrc[this.itemget].sources[0].id,
        dod: "",
        dd: "",
        type: this.data.is_live == '1' ? 1 : 2,
        content_title: this.videosrc[this.itemget].sources[0].title,
        total_duration: this.player.cache_.duration,
        pd: Math.floor(this.player.cache_.currentTime),
        // cat_id: this.data.category_ids[0],
        cat_id: this.cat_iid,
        gender: this.session_gender,
        network_provider: allAnalyticsData.connection.isp,
        customer_name: JSON.parse(userInfo).first_name ? JSON.parse(userInfo).first_name : "user",
        impression: 0
      };
      analytics.dod = `{ "os_version": "${allAnalyticsData.userAgent.browserVersion}", "app_version": "2.8", "network_type": "${allAnalyticsData.connection.type}", "network_provider": "${allAnalyticsData.connection.isp}" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "${this.deviceService.os}", "manufacturer": "${this.deviceService.deviceType}", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo)?.id);
      formData.append("country", allAnalyticsData.countryName);
      formData.append("country_code", allAnalyticsData.countryCode);
      formData.append("city", allAnalyticsData.city);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
    } else {
      console.log(Math.floor(this.player.currentTime()));
      
      const userInfo: any = localStorage.getItem("taploginInfo");
      if (JSON.parse(userInfo)?.gender == "") {
        this.session_gender = 'others'
      } else {
        this.session_gender = JSON.parse(userInfo)?.gender
      }
      let analytics: any = {
        c_id: this.data.id,
        dod: "",
        dd: "",
        type: this.data.is_live == '1' ? 1 : 2,
        content_title: this.data.title,
        total_duration: this.player.cache_.duration,
        pd: Math.floor(this.player.currentTime()),
        // cat_id: this.data.category_ids[0],
        cat_id: this.cat_iid,
        // age_group: "",
        gender: this.session_gender,
        network_provider: allAnalyticsData.connection.isp,
        customer_name: JSON.parse(userInfo).first_name ? JSON.parse(userInfo).first_name : "user",
        impression: 0
      };
      analytics.dod = `{ "os_version": "${allAnalyticsData.userAgent.browserVersion}", "app_version": "2.8", "network_type": "${allAnalyticsData.connection.type}", "network_provider": "${allAnalyticsData.connection.isp}" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "${this.deviceService.os}", "manufacturer": "${this.deviceService.deviceType}", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo)?.id);
      formData.append("country", allAnalyticsData.countryName);
      formData.append("country_code", allAnalyticsData.countryCode);
      formData.append("city", allAnalyticsData.city);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
    }
  }


  adUrl() {
    this.ds.getAdsApi().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData);

        localStorage.setItem('AdUrl', JSON.stringify(decryptData))
      }
    })
  }

  adGoogle(adUrl: any) {
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);

    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
    const adGoogle: any = localStorage.getItem('AdUrl')
    const getAdGoogle = JSON.parse(adGoogle);

    if (dataPopup.Player[0].google_ads.is_allow == 1 && getAdGoogle) {
      if (this.isSubsInfo == 1 && dataPopup.Player[0].google_ads.subscriber == 1) {
        if (getAdGoogle.subscribed.length != 0) {
          if (this.adFirstTime == true) {
            this.options1 = {
              adTagUrl: getAdGoogle.subscribed[0].tags
            };
            this.player.ima(this.options1);
            this.player.ima.initializeAdDisplayContainer();
          } else {
            this.player.ima.changeAdTag(getAdGoogle.subscribed[0].tags);
            this.player.ima.requestAds();
          }
          this.player.muted(false);
          this.player.volume(1);
          this.options1 = {
            adTagUrl: getAdGoogle.subscribed[0].tags
          };

        } else {
          this.player.volume(0);
        }
      } else if (this.user && this.isSubsInfo != 1 && dataPopup.Player[0].google_ads.registered == 1) {
        if (getAdGoogle.register.length != 0) {
          this.player.muted(false);
          this.player.volume(1);

          if (this.adFirstTime == true) {
            this.options1 = {
              adTagUrl: getAdGoogle.register[0].tags
            };
            this.player.ima(this.options1);
            this.player.ima.initializeAdDisplayContainer();
          } else {
            this.player.ima.changeAdTag(getAdGoogle.register[0].tags);
            this.player.ima.requestAds();
          }

          // google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true)
        } else {
          this.player.volume(0);
        }
      } else if (!this.user && this.isSubsInfo != 1 && dataPopup.Player[0].google_ads.guest == 1) {
        if (getAdGoogle.guest.length != 0) {
          this.player.muted(false);
          this.player.volume(1);
          if (this.adFirstTime == true) {
            this.options1 = {
              adTagUrl: getAdGoogle.guest[0].tags
            };
            this.player.ima(this.options1);
            this.player.ima.initializeAdDisplayContainer();
          } else {
            this.player.ima.changeAdTag(getAdGoogle.guest[0].tags);
            this.player.ima.requestAds();
          }
        } else {
          this.player.volume(0);
        }
      } else {
        this.player.volume(0);
      }
    } else {
      // this.player.volume(0);
    }
  }

  startFreePreviewWatcher() {

    if (this.isSubsInfo != 1 && this.free_preview === 1) {

      console.log(" Free preview watcher started");

      const checker = setInterval(() => {
        if (!this.player || !this.player.currentTime) {
          console.warn("Player not ready yet.");
          return;
        }

        const current = Math.floor(this.player.currentTime());
        // console.log("Current Time:", current, "Limit:", this.free_preview_duration);

        if (current >= this.free_preview_duration) {
          clearInterval(checker);
          this.player.pause();
          this.mat.closeAll();
          this.router.navigate(['/subscribe']);
        }
      }, 1000);
    }
  }

  onPlayerReady() {
    this.player.ready(() => {
      this.player.play();

      // this.startFreePreviewWatcher();
    });

    $("#waterMark").appendTo($("#video-player"));

    var hh = localStorage.getItem("tarilerplay");
    if (hh == "1") {
      if (this.getBrowserName == 'firefox') {
        // this.player.qualityMenu();
      } else if (this.getBrowserName == 'safari') {
        this.player.hlsQualitySelector();

        // this.player({
        //   html5: {
        //     hls: {
        //       overrideNative: false
        //     },
        //     nativeAudioTracks: true,
        //     nativeVideoTracks: true
        //   }
        // })

      } else {
        this.player.hlsQualitySelector();
      }
    }


    this.player.on('ads-manager', (response: any) => {
      this.isAdPlaying = false;
      this.player.on("ads-ad-started", () => {
        this.isAdPlaying = false;
      });

      this.player.on("ads-ad-ended", () => {
        this.isAdPlaying = true;
      });

      this.player.on("ads-ad-skipped", () => {
        this.isAdPlaying = true;
      });

      var adsManager = response.adsManager;
      adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
        setTimeout(() => {
          this.player.play();
          // this.startFreePreviewWatcher();
        }, 1000);


      });

      adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, (event: any) => {


        if (this.getBrowserName != 'safari') {
          setTimeout(() => {
            this.player.pause();
          }, 2000);
        }


        var adType = ""
        if (event.ad.data.adPodInfo.adPosition == 1) {
          adType = "pre_roll"
        } else if (event.ad.data.adPodInfo.adPosition == 2) {
          adType = "mid_roll"
        } else {
          adType = "post_roll"
        }
        this.player.ima.addEventListener(google.ima.AdEvent.Type.CLICK, () => {

        });


      });
    })

    // setTimeout(() => {
    //   this.mat.closeAll()
    //   this.router.navigate(["/subscribe"]);
    // }, 10000);

    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);

    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);

    if (dataPopup.Player[0].google_ads.is_allow == 1) {
      if (this.getBrowserName != 'firefox') {
        this.adGoogle(this.data.ad_tag)
      }
      this.adUrl()
    }

    if (hh != "1") {
      if (this.data.drm == 0) {
        if (this.getBrowserName == 'firefox') {
          if (this.data.is_group == 1) {
            this.player.qualityMenu();
          }

        } else if (this.getBrowserName == 'safari') {
          this.player.hlsQualitySelector();
        } else {
          this.player.hlsQualitySelector();
        }
      }
    }

    if (this.data.access_type == "free" || this.data.drm == 0) {
      setTimeout(() => {
        this.player.currentTime(this.playDuration)
      }, 1000);

    }




    if (this.data.sprite_url != null) {
      this.player.spriteThumbnails({
        interval: 5,
        url: this.data.sprite_url.web,
        width: 224,
        height: 127,
        responsive: 600,
      });
    }

    if (this.getBrowserName == 'safari') {
      // this.player.hlsQualitySelector();
    } else {
      if (this.data.access_type == 'paid' && this.data.drm == 1 && hh != "1") {
        this.getqualitycustom();
        this.getqualitycustom();
      } else if (this.data.access_type == 'free' && this.data.drm == 1 && hh != "1") {
        // this.player.hlsQualitySelector();
      }
    }

    if (this.data.access_type == 'free') {
      setTimeout(() => {
        this.player.currentTime(this.playDuration)
      }, 1000);

    }

    this.player.on("loadeddata", () => {
      // let languageNames = new Int;l.DisplayNames([], { type: 'language' });
      // const audioTrackList = this.player.audioTracks();
      // // const audioTrackList = this.player.audioTracks();
      // for (let i = 0; i < audioTrackList.length; i++) {
      //   const element = audioTrackList[i];
      //   element.label = "English"
      //   //player..selectedIndex.label = "English"
      //   // player.audioTracks[i].label = "English";
      // }
      //
      var tracks = this.player.textTracks();
      for (var i = 0; i < tracks.length; i++) {
        var track = tracks[i];
        // Find the English captions track and mark it as "showing".
        if (track.language === "en" || "eng") {
          // track.mode = 'showing';
          track.label = "English";
        }
      }
      //text track
    });

    setTimeout(() => {
      this.player.ready(() => {
        // Player is fully initialized
        setTimeout(() => {
          // this.player.qualityMenu();
          this.player.play();

          // this.player.httpSourceSelector();
          // setTimeout(() => {
          setTimeout(() => {
            document.addEventListener('keydown', (event) => {

              switch (event.code) {
                case 'Space':
                  if (this.player.paused()) {
                    this.player.play();
                  } else {
                    this.player.pause();
                  }
                  break;

                case 'KeyM':
                  if (this.player.muted()) {
                    this.player.muted(false);
                  } else {
                    this.player.muted(true);
                  }
                  break;

                case 'ArrowUp':
                  this.player.volume(this.player.volume() + 0.2);
                  break;

                case 'ArrowDown':
                  this.player.volume(this.player.volume() - 0.2);
                  break;
                case 'ArrowRight':
                  this.player.currentTime(this.player.currentTime() + 10);
                  break;
                case 'ArrowLeft':
                  this.player.currentTime(this.player.currentTime() - 10);
                  break;

              }
            });
          }, 1000);

          //   this.player.language_ = "english"
          // }, 2000);
        }, 500);

        // this.player.autoselect(true);
        //         if (this.getBrowserName == 'safari') {
        //           setTimeout(() => {
        //             this.player.requestFullscreen();
        //           }, 500);
        //         } else {
        //           var xc = window.innerWidth;
        //           if (xc < 992) {
        //             this.player.requestFullscreen();

        //             this.player.on("fullscreenchange", () => {
        //               if (this.player.isFullscreen()) {
        //                 if(this.getBrowserName=="safari"){
        // this.player.requestFullscreen();

        //                 }
        //               } else {
        //                 this.mat.closeAll();
        //               }
        //             });
        //           }
        //         }

        setTimeout(() => {
          this.player.ready(() => {
            if (this.getBrowserName == 'safari') {
              setTimeout(() => {
                this.player.requestFullscreen();
              }, 500);
              this.player.on("fullscreenchange", () => {
                if (this.player.isFullscreen()) {

                } else {
                  this.mat.closeAll();
                }
              });
            } else {
              var xc = window.innerWidth;
              if (xc < 992) {

                this.player.requestFullscreen();

                this.player.on("fullscreenchange", () => {
                  if (this.player.isFullscreen()) {

                  } else {
                    this.mat.closeAll();
                  }
                });
              }
            }


            setTimeout(() => {

              this.player.play();
            }, 500);
          });


        }, 500);

        $(".ageshow").appendTo($("#video-player"));
      });
    }, 500);

    //  var track = "English"
    // this.player.remoteTextTracks();
    //   this.player.addRemoteTextTrack({
    //     kind: "captions",
    //     label: "English",
    //     srclang: "en",
    //     // src: subtitleUrl,
    //     default: true,
    // })

    if (localStorage.getItem("taploginInfo") === null) {
      this.USER_ACCOUNT_id = "Unregistered user";
    } else {
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
    }

    //  var track = "English"
    // this.player.remoteTextTracks();
    //   this.player.addRemoteTextTrack({
    //     kind: "captions",
    //     label: "English",
    //     srclang: "en",
    //     // src: subtitleUrl,
    //     default: true,
    // })
    if (localStorage.getItem("taploginInfo") === null) {
    } else {
      const is_subscriber: any = localStorage.getItem("is_subscriber")
      if (is_subscriber == '0') {
      } else {
      }
    }
    this.inactivityTimeout









    var deviceDetails: any = localStorage.getItem("deviceDetails");
    var deviceDetail = JSON.parse(deviceDetails);
    var hh = localStorage.getItem("tarilerplay");
    if (hh == '1') {
      if (this.data.is_group == 1) {

      } else {

      }

    } else {

      if (this.data.is_group == 1) {

      } else {

      }

    }

    this.player.on("error", () => {
      var code = this.player.error_.code;
      var message = this.player.error_.message;
    });
    this.networkConnectionService.connected$.subscribe((connected) => {
      this.connected = connected;
      if (this.connected == false) {
      }
    });

    // plugin.unregisterAdapter();
    // $(document).ready(() =>{
    //   var w=window.innerWidth;
    //   var h=window.innerHeight;
    //   var myPlayer = videoJs("video-player");

    //   if(w/16 > h/9) {
    //     var r = (w - (16*(h/9)) ) / 2;
    //     myPlayer.dimensions((16*(h/9)),h);
    //     document.getElementById('slider')!.style.right = r + 'px';
    //   } else {
    //     var r = (h - (9*(w/16)) ) / 2;
    //     myPlayer.dimensions(w, (w/16) * 9);
    //     document.getElementById('video-player')!.style.marginTop = r + 'px';
    //   }
    // });

    // var tracks = this.player.textTracks_ = this.player.textTracks_ || [];
    // for (var i = 0; i != tracks.length; ++i)
    //     $(tracks[i]).remove();

    // this.player.trigger("textTracksChanged");

    // var track = this.player.removeTextTrack();
    // var track = this.player.addTextTrack("captions", "English", "en");

    // var track = this.player.addTextTrack("captions", "Hindi", "hi");
    // var track = this.player.addTextTrack("captions", "Bengali", "bn");
    // var track = this.player.addTextTrack("captions", "Urdu", "ur");
    // var track = this.player.addTextTrack("captions", "Punjabi", "pa");
    // var track = this.player.addTextTrack("captions", "Marathi", "mr");
    // var track = this.player.addTextTrack("captions", "Gujarati", "gu");
    // var track = this.player.addTextTrack("captions", "Kannada", "kn");
    var arrayLang = [
      {
        id: "hi",
        name: "Hindi",
      },
      {
        id: "bn",
        name: "Bengali",
      },
      {
        id: "ur",
        name: "Urdu",
      },
      {
        id: "pa",
        name: "Punjabi",
      },
      {
        id: "mr",
        name: "Marathi",
      },
      {
        id: "te",
        name: "Telugu",
      },
      {
        id: "ta",
        name: "Tamil",
      },
      {
        id: "gu",
        name: "Gujarati",
      },
      {
        id: "kn",
        name: "Kannada",
      },
      {
        id: "or",
        name: "oriya",
      },
      {
        id: "ml",
        name: "Malayalam",
      },
      {
        id: "as",
        name: "Assamese",
      },
      {
        id: "sa",
        name: "Sanskrit",
      },
      {
        id: "ar",
        name: "arabic",
      },
      {
        id: "en",
        name: "english",
      },
      {
        id: "ms",
        name: "Bahasa Melayu",
      },
      {
        id: "id",
        name: "Bahasa Indonesia",
      },
    ];



    //   this.player.addRemoteTextTrack(track);

    // videoAnalytics.setPlayer(this.player);
    // this.player.addChild('TitleBar', { text: this.mainelement });
    // this.player.addChild('CustomButton');
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"]) {
      if (
        this.data.is_group == 1 &&
        this.data.groupInfo != null &&
        this.data.groupInfo.child.length != 0
      ) {
        this.maxcounter = 500;
      }

      // this.getEpisode(this.data.season_id);
    }
  }
  userInfo: any;
  userDetails: any;







  secondsToHms(d: any) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ":" : ":") : "00:";
    var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "00:";
    var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
    return hDisplay + mDisplay + sDisplay;
  }

  ngOnDestroy(): void {
    localStorage.setItem('videoPlay', '0');
    $(".vjs-overlay").hide();
    $(".trailerRemove").show();
    if (this.player) {
      var parental: any = localStorage.getItem("taploginInfo");
      if (parental) {
        if (this.tarilerPlay != 1) {
          this.analytics();
        }

      }

      var currentDuration = Math.floor(this.player.currentTime());
      var quartileValue = Math.floor(Math.floor(this.player.duration()) / 4);
      var two_quartile = quartileValue * 2;
      var three_quartile = quartileValue * 3;
      var full_quartile = quartileValue * 4;
      var durationValue
      if (currentDuration < quartileValue) {
        durationValue = 25
      }
      if (currentDuration > quartileValue && currentDuration <= two_quartile) {
        durationValue = 50
      }
      if (currentDuration > two_quartile && currentDuration <= three_quartile) {
        durationValue = 75
      }
      if (currentDuration > three_quartile) {
        durationValue = 100
      }

      var secondConvert = this.secondsToHms(currentDuration)

      if (this.getBrowserName == 'safari') {
        const video = this.player?.tech_?.el_ as HTMLVideoElement;
        if (document.pictureInPictureElement === video) {
          document.exitPictureInPicture().finally(() => {
            this.player?.dispose();
          });
        } else {
          this.player?.dispose();
        }
      } else {
        this.player.dispose();
      }

      // this.player.ima.dispose();
      // this.player.dispose();


    }
  }
}
