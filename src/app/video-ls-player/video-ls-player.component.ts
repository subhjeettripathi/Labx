import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { map } from "rxjs";
import { DataService } from "../services/data.service";
import { DecryptService } from "../services/decrypt.service";
import { ExchangeDataService } from "../services/exchange-data.service";
import { AdultAgePopupComponent } from "../shared/dialogBoxes/adult-age-popup/adult-age-popup.component";
import { ChechPinParentalComponent } from "../shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component";
import { videoJs } from "../video-player/videojs";
import 'videojs-contrib-quality-levels';
import { NetworkConnectionService } from "../services/network-connection.service";
import { IosDecrycptionService } from "../services/ios-decrycption.service";
import { CountryLockPopupComponent } from "../shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { LoginModalDialogComponent } from "../shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { FingerPrintService } from "../services/finger-print.service";
declare var $: any;
declare var DeviceUUID: any
declare var google: any
require("videojs-overlay-buttons");
require("videojs-sprite-thumbnails");
@Component({
  selector: "app-video-ls-player",
  templateUrl: "./video-ls-player.component.html",
  styleUrls: ["./video-ls-player.component.scss"],
})
export class VideoLsPlayerComponent implements OnInit, OnDestroy {
  @ViewChild("slickModal") slickModal: any;
  isTrailerPlaying: boolean = false
  // trailer:any;
  // isTrailerPlaying: boolean = false;
  // get isTrailerPlaying(): boolean {
  //   this.alldata.access_type == 'paid' && this.isSubscribed == false
  //   return localStorage.getItem("tarilerplay") === "1";
  // }
  isAdPlaying: boolean = false;
  USER_ACCOUNT_id: any;
  @HostListener("window:scroll", ["$event"])
  onScroll(event: any) {
    if (window.scrollY != 0) {
      if (window.scrollY > 300 && !this.agehide && !this.hideicon && this.playicon && !this.ended) {
        if (this.alldata.ad_tag.length != 0) {
          this.bannerPlayer.pause();
          this.bannerPlayer.ima.pauseAd();
          if (this.adplaying == true) {
            this.bannerPlayer.pause();
          }
        } else {
          this.bannerPlayer.pause();
        }
        this.playing = true;
        localStorage.setItem('pausedvideo', '0')
      } else if (!this.agehide && !this.hideicon && this.playicon && !this.ended && localStorage.getItem('pausedvideo') != "1") {
        if (this.alldata.ad_tag.length != 0) {
          this.bannerPlayer.play();
          this.bannerPlayer.ima.resumeAd();
          if (this.adplaying == true) {
            this.bannerPlayer.play();
          }
        } else {
          this.bannerPlayer.play();
        }
        this.playing = false;
      }
    }
  }

  videols!: ElementRef;
  player: any;
  url: any;
  bannerPlayer: any;
  set: boolean = true;
  ended: boolean = false;
  agehide: boolean = false;
  userId: any;
  @ViewChild("target", { static: true })
  target!: ElementRef;
  playicon: boolean = true;
  token: any;
  user: any;
  options1: any;
  introSeconds: any;
  recapSeconds: any;
  hours_minutes: any;
  findAd: boolean = false;
  getalldata: any
  adUrlLoopMini: any
  countryAllowed: any = [];
  EpiData: any;
  recapSeconds1: any;
  ageshow: any;
  lBandShowMini: any;
  arr: any = [];
  videosrc: any = [];
  astonBandImage: any;
  astonBandShare: any;
  astonBandTitle: any;
  introSeconds1: any;
  mainelement: any;
  maxcounter: any;
  creditSeconds: any;
  flickring: boolean = true
  creditSeconds1: any;
  defaultImages: any = [];
  adsLoader: any
  getindexepisode: any
  rentalIcon: boolean = false
  itemget: any;
  uniqueCharss: any
  p: any;
  ggMini: any = [];
  encryptedUserId: any
  setF = false;
  display_offset: number = 0;
  mainm3u8: any;
  bandimageMini: any = [];
  adplaying: boolean = false;
  hideicon: boolean = true;
  isLoggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  defaultposter: any = localStorage.getItem("jsonPlayer") || {};
  playing: boolean = false;
  muted: boolean = true;
  isSubscribed = false;
  adStaredNow: boolean = false;
  adsManagerGet: any
  getBrowserName: any
  adFirstTime: boolean = true;
  astonTemp: boolean = true;
  checked: any;
  waterMarkImg: any
  adsManager: any
  playVideo: any = 0;
  waterMarkImgAllow: any
  isReplay: boolean = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  connected: boolean = true;
  cat_iid: any
  session_gender: any
  constructor(
    private ed: ExchangeDataService,
    private dialog: MatDialog,
    private ds: DataService,
    private DEC_SER: DecryptService,
    private router: Router,
    private mat: MatDialog,
    private networkConnectionService: NetworkConnectionService,
    private deviceService: DeviceDetectorService,
    private DEC_SER_IOS: IosDecrycptionService,
    private _FPS: FingerPrintService
  ) {
    // this.isTrailerPlaying = localStorage.getItem("tarilerplay") === "1";
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isLoggedIn = 1;
      }
    });
    this.ed.pauseDetailVideo.subscribe((value) => {
      if (value == true) {
        if (this.bannerPlayer) {
          this.pause();
        }

      } else if (value == false) {
        //  console.log(this.agehide,"age");
        // console.log(this.ended,"ended");
        // console.log(this.isReplay,"is replay");
        // console.log(this.hideicon,"hideicon");
        // console.log(this.playicon,"playicon");
        // console.log(this.isSubscribed,"subscribed");
        if (!this.agehide && !this.ended && !this.hideicon && this.playicon && !this.isSubscribed) {

          if (this.bannerPlayer) {
            this.play();
          }

        }
      }
    });
  }
  @Input() videourl: any;
  @Input() poster: any;
  @Input() ageGroup: any;
  @Input() alldata: any;
  @Output() setShowdetailData: any = new EventEmitter<any>();
  successs: any;
  ngOnInit(): void {

    this.jsondata()
    this.networkConnectionService.connected$.subscribe(connect => {
      this.connected = connect;

      // if (this.connected == true) {
      //   setTimeout(() => {
      //     this.bannerPlayer.currentTime(this.bannerPlayer.cache_.currentTime)

      //   }, 1000);
      // }

    })
    // this.isTrailerPlaying = localStorage.getItem("tarilerplay") === "1";  
    // this.trailer=localStorage.getItem("tarilerplay")

    // this.trailer = localStorage.getItem("tarilerplay");
    // console.log(this.trailer,"trailer");
    // if (this.trailer === "1") {
    //   console.log("1");
    //   this.isTrailerPlaying = false; // Trailer already played
    // } else {
    //   console.log("2");
    //   this.isTrailerPlaying = true; // Show skip intro
    // }

    if (localStorage.getItem("tarilerplay"))
      //  this.isAdPlaying = true;
      if (this.bannerPlayer) {
        this.bannerPlayer.on("ads-ad-started", () => {
          this.isAdPlaying = true;
        });

        this.bannerPlayer.on("ads-ad-ended", () => {
          this.isAdPlaying = false;
        });

        this.bannerPlayer.on("ads-ad-skipped", () => {
          this.isAdPlaying = false;
        });
      } else {
        console.warn("bannerPlayer not initialized yet.");
      }
    this.getBrowserName = this.detectBrowserName()

    setTimeout(() => {
      this.bannerPlayer.on('ready', () => {
        if (this.lBandShowMini.is_allow == 1 && (this.isSubsInfo == 1 || this.alldata.access_type == "free"))
          this.getLbandData();
      })
    }, 500);

    setTimeout(() => {
      $(".moveToVideoJs").hide();
      $(".moveToVideoJs").appendTo($("#video-ls"));
    }, 1000);

    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      $(".vjs-icon-hd").on("click touchstart", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").hide();
        $('.speedIcon').hide();
      });

      $(".vjs-quality-selector").on("click touchstart", () => {
        $(".vjs-quality-selector .vjs-menu-content").show();
        $(".vjs-subs-caps-button .vjs-menu-content").hide();
        $('.speedIcon').hide();
      })

      $(".vjs-subs-caps-button").on("click touchstart", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").show()
        $(".hd-mode").hide()
        $('.speedIcon').hide();
      });

      $('.vjs-icon-audio-main1').on("click touchstart", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").hide()
        $(".hd-mode").hide()
      })

      $("#titleOne").appendTo('#video-ls')
      $("#titleTwo").appendTo('#video-ls')
      $("#titleThree").appendTo('#video-ls')
    }, 3000);

    if (this.alldata.season_id != "") {
      setTimeout(() => {
        this.checked = this.alldata.season_id;
      }, 1000);
    }


    this.getalldata = this.alldata

    this.bannerPlayer = videoJs("video-ls", {
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          overrideNative: true
        },
        dash: {
          setLimitBitrateByPortal: true,
          setMaxAllowedBitrateFor: ['video', 2000]
        },
        vhs: {
          overrideNative: true,
          experimentalBufferBasedABR: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false,
      },


      // techOrder: ["html5"],
      // plugins: {
      //   dashHlsBitrateSwitcher: {
      //     support: "both",
      //   },
      //   settingsMenu: {
      //     items: [
      //       "AudioTrackButton",
      //       "ChaptersButton",
      //       "SubsCapsButton",
      //       "PlaybackRateMenuButton",
      //       "RatesButton",
      //     ],
      //     languages: {
      //       settings: "Settings",
      //       loading: "Loading",
      //       back: "Back",
      //       captions_off: "Captions Off",
      //       default_audio: "Default Audio",
      //       audio: "Audio",
      //       subtitles: "Subtitles",
      //       chapters: "Chapters",
      //       speed: "Speed",
      //       quality: "Quality",
      //     },
      //   },
      // },
      // crossOrigin: "anonymous",
      // liveui: true,
      // autoplay: true,
      // muted: true,
      // playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      // nativeControlsForTouch: false,

    });

    setTimeout(() => {
      $(".vjs-overlay").hide();
    }, 1000);

    setTimeout(() => {
      $(".vjs-overlay").hide();
      $("#waterMarkLs").appendTo($('#video-ls'));
    }, 2000);

    this.bannerPlayer.muted(true)
    this.bannerPlayer.volume(0);

    this.defaultImages = JSON.parse(
      this.defaultposter
    ).Website[0].default_images.rectangle.path;

    this.bannerPlayer.seekButtons({
      forward: 10,
      back: 10,
    });

    this.bannerPlayer.on("pause", () => {
      this.playing = true;
      localStorage.setItem('pausedvideo', '1')
    });

    this.bannerPlayer.on("play", () => {
      setTimeout(() => {
        this.hideicon = false
      }, 1000);
      setTimeout(() => {
        this.hideicon = false
      }, 2000);
      this.playing = false;
      this.playicon = true;
      setTimeout(() => {
        $('.vjs-seek-button').show()
      }, 500);

      $(".vjs-overlay").hide();
      $(this.bannerPlayer.posterImage.contentEl()).hide();
      $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(100%)");
    });

    setTimeout(() => {
      document.addEventListener('keydown', (event) => {

        switch (event.code) {
          case 'Space':
            if (this.bannerPlayer.paused()) {
              this.bannerPlayer.play();
            } else {
              this.bannerPlayer.pause();
            }
            break;

          case 'KeyM':
            if (this.bannerPlayer.muted()) {
              this.bannerPlayer.muted(false);
            } else {
              this.bannerPlayer.muted(true);
            }
            break;

          case 'ArrowUp':
            this.bannerPlayer.volume(this.bannerPlayer.volume() + 0.2);
            break;

          case 'ArrowDown':
            this.bannerPlayer.volume(this.bannerPlayer.volume() - 0.2);
            break;
          case 'ArrowRight':
            this.bannerPlayer.currentTime(this.bannerPlayer.currentTime() + 10);
            break;
          case 'ArrowLeft':
            this.bannerPlayer.currentTime(this.bannerPlayer.currentTime() - 10);
            break;

        }
      });
    }, 1000);

    $(".vjs-mute-control").on("click", () => {
      if (this.muted == true) {
        this.unmute()
        this.muted == true;
      } else {
        this.mute()
        this.muted == false;
      }
    });

    this.bannerPlayer.on("volumechange", () => {
      var vol = this.bannerPlayer.volume();
      if (vol == 0) {
        this.muted = true;
      } else {
        this.muted = false;
      }
    });

    setTimeout(() => {
      if (this.alldata.sprite_url != null && this.alldata.sprite_url != '' && this.alldata.access_type == 'free') {
        this.bannerPlayer.spriteThumbnails({
          interval: 5,
          url: this.alldata.sprite_url.web,
          width: 224,
          height: 127,
        });
      }
    }, 500);

    setTimeout(() => {
      if (this.alldata.sprite_url != null && this.alldata.sprite_url != '' && this.alldata.access_type == 'paid' && this.isSubsInfo == 1) {
        this.bannerPlayer.spriteThumbnails({
          interval: 5,
          url: this.alldata.sprite_url.web,
          width: 224,
          height: 127,
        });
      }
    }, 500);

    // this.bannerPlayer.on("ended", () => {
    //   setTimeout(() => {
    //     $('.vjs-seek-button').hide()
    //   }, 500);

    //   if (this.alldata.rental == 0) {
    //     if (this.alldata.is_group == 0) {
    //       if (this.alldata.access_type == "paid" && this.isSubscribed == false) {
    //         $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
    //         this.bannerPlayer.exitFullscreen();
    //         $(this.bannerPlayer.posterImage.contentEl()).show();
    //         this.ended = true;
    //       } else {
    //         this.hideicon = true;
    //         this.playicon = false;
    //         this.bannerPlayer.exitFullscreen();
    //         $(this.bannerPlayer.posterImage.contentEl()).show();
    //         this.isReplay = true;
    //         $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
    //         setTimeout(() => {
    //           this.hideicon = true
    //         }, 500);
    //         setTimeout(() => {
    //           this.hideicon = true
    //         }, 2000);
    //       }
    //     } else {
    //       if (this.alldata.access_type == "paid" && this.isSubscribed == false) {
    //         $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
    //         this.bannerPlayer.exitFullscreen();
    //         $(this.bannerPlayer.posterImage.contentEl()).show();
    //         this.ended = true;

    //         this.playicon = true;
    //       }
    //     }
    //   } else {
    //     if (this.alldata.rentalPurchased == 0 && this.alldata.rental != 0) {
    //       $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
    //       this.bannerPlayer.exitFullscreen();
    //       $(this.bannerPlayer.posterImage.contentEl()).show();
    //       this.ended = true;
    //     }
    //   }

    // });

    this.bannerPlayer.on("timeupdate", () => {
      console.log('assasas');

      if (
        Math.floor(this.bannerPlayer.currentTime()) == this.introSeconds
      ) {

        $(".title").show();
      } else if (
        Math.floor(this.bannerPlayer.currentTime()) >=
        this.introSeconds1 ||
        Math.floor(this.bannerPlayer.currentTime()) <= this.introSeconds
      ) {
        $(".title").hide();
      }

      if (
        Math.floor(this.bannerPlayer.currentTime()) == this.recapSeconds
      ) {
        $("#titleTwo").appendTo($('#video-ls'));
        $(".title1").show();
      } else if (
        Math.floor(this.bannerPlayer.currentTime()) >=
        this.recapSeconds1 ||
        Math.floor(this.bannerPlayer.currentTime()) <= this.recapSeconds
      ) {
        $(".title1").hide();
      }

      if (
        Math.floor(this.bannerPlayer.currentTime()) == this.creditSeconds
      ) {
        $("#titleThree").appendTo($('#video-ls'));
        $(".title2").show();
      } else if (
        Math.floor(this.bannerPlayer.currentTime()) >=
        this.creditSeconds1 ||
        Math.floor(this.bannerPlayer.currentTime()) <= this.creditSeconds
      ) {
        $(".title2").hide();
      }
    });

    this.bannerPlayer.on("ended", () => {
      if (this.alldata.is_group == 0) {
        if (this.alldata.access_type == "paid" && this.isSubscribed == false) {
          $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
          this.bannerPlayer.exitFullscreen();
          $(this.bannerPlayer.posterImage.contentEl()).show();
          this.ended = true;
          if (this.ended) {
            localStorage.setItem('endedPlay', '1');
          }
        }
      } else {
        if (this.alldata.access_type == "paid" && this.isSubscribed == false) {
          $(this.bannerPlayer.posterImage.contentEl()).css("filter", "brightness(20%)");
          this.bannerPlayer.exitFullscreen();
          $(this.bannerPlayer.posterImage.contentEl()).show();
          this.ended = true;
          if (this.ended) {
            localStorage.setItem('endedPlay', '1');
          }
        }
      }
    });




    setTimeout(() => {
      if (this.alldata?.skip_duration && this.alldata.skip_duration.length > 0) {
        console.log("aaaaaaaaa");
        console.log(this.alldata.skip_duration, "1");
        console.log(this.alldata.skip_duration.length, "2");
        this.skipTime(this.alldata.skip_duration);
      }
    }, 1000);



    this.bannerPlayer.on('ads-manager', (response: any) => {
      // this.isAdPlaying = true
      this.adsManager = response.adsManager;

    })


    this.bannerPlayer.on('ads-loader', (response: any) => {
      this.adsLoader = response.adsLoader;

      // this.adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdsLoaderError, false, this);
      // this.adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.adsManagerLoaded, false, this);

    })

    this.bannerPlayer.on('ads-request', (response: any) => {
      var adsRequest = response.AdsRequest;


    })

    this.bannerPlayer.on('ads-manager', (response: any) => {
      var adsManager = response.adsManager;
      adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
        this.adplaying = true
        this.isAdPlaying = false
      });

      adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, (event: any) => {


        setTimeout(() => {
          this.player.pause();
        }, 2000);

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





    this.bannerPlayer.on('ads-ad-started', (response: any) => {
      this.adStaredNow = true
      var adsRequest = response.AdsRequest;

    })

    this.defaultImages = localStorage.getItem("defaultImages");
    setTimeout(() => {
      // var buttonComponent = videoJs.getComponent("Button");
      // var settingButton = videoJs.extend(buttonComponent, {
      //   constructor: function () {
      //     buttonComponent.apply(this, arguments);
      //     this.addClass("vjs-icon-audio-main1");
      //     this.controlText("Setting");
      //   },

      //   handleClick: (e: any) => {
      //     $("#speedLevelV1").toggle()
      //     $("#speedLevelV1").appendTo($(".vjs-icon-audio-main1"));
      //     $('#bitrateLevels').hide();
      //     $(".vjs-subs-caps-button .vjs-menu-content").hide();
      //     // $(".vjs-quality-selector .vjs-menu-content").hide();
      //   },
      // });
      videoJs.registerComponent("settingButton", settingButton);
      this.bannerPlayer.getChild("controlBar").addChild("settingButton", {}, 14);

      if (this.alldata.rental != 0 && this.alldata.rentalPurchased == 1) {
        var buttonComponent = videoJs.getComponent("Button");
        var settingButton = videoJs.extend(buttonComponent, {
          constructor: function () {
            buttonComponent.apply(this, arguments);
            this.addClass("vjs-icon-hd-main");
            this.controlText("Setting");
          },

          handleClick: (e: any) => {
            $("#bitrateLevels").appendTo($('#video-ls'));
            $("#bitrateLevels").toggle()
            $('#speedLevelV1').hide()
            $(".vjs-subs-caps-button .vjs-menu-content").hide()
          },
        })
        videoJs.registerComponent("settingButton", settingButton);
        this.bannerPlayer.getChild("controlBar").addChild("settingButton", {}, 14);
        // }
        if (this.getBrowserName != 'safari') {
          this.sssss()
        }
      }
      if (this.alldata.is_group == 0 && this.alldata.rental == 0) {
        if (this.alldata.access_type == 'paid' && this.isSubsInfo == 1) {
          if (this.alldata.access_type == "paid") {
            // setTimeout(() => {
            // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            // if (this.videourl.includes('mpd')) {
            var buttonComponent = videoJs.getComponent("Button");
            var settingButton = videoJs.extend(buttonComponent, {
              constructor: function () {
                buttonComponent.apply(this, arguments);
                this.addClass("vjs-icon-hd-main");
                this.controlText("Setting");
              },

              handleClick: (e: any) => {
                $("#bitrateLevels").appendTo($('#video-ls'));
                $("#bitrateLevels").toggle()
                $('#speedLevelV1').hide()
                $(".vjs-subs-caps-button .vjs-menu-content").hide()
              },
            })
            videoJs.registerComponent("settingButton", settingButton);
            this.bannerPlayer.getChild("controlBar").addChild("settingButton", {}, 14);
            // }
            if (this.getBrowserName != 'safari') {
              this.sssss()
            }

            // }, 500);

            setTimeout(() => {
              this.bannerPlayer.overlay({
                overlays: [
                  {
                    start: "playing",
                    content: this.alldata.title,
                    align: "center",
                  },
                ],
              });

              $(".vjs-overlay").hide();
              setTimeout(() => {
                $(".vjs-overlay").hide();
              }, 1000);

              this.bannerPlayer.on("timeupdate", () => {
                if (
                  Math.floor(this.bannerPlayer.currentTime()) == this.introSeconds
                ) {

                  $(".title").show();
                } else if (
                  Math.floor(this.bannerPlayer.currentTime()) >=
                  this.introSeconds1 ||
                  Math.floor(this.bannerPlayer.currentTime()) <= this.introSeconds
                ) {
                  $(".title").hide();
                }

                if (
                  Math.floor(this.bannerPlayer.currentTime()) == this.recapSeconds
                ) {
                  $("#titleTwo").appendTo($('#video-ls'));
                  $(".title1").show();
                } else if (
                  Math.floor(this.bannerPlayer.currentTime()) >=
                  this.recapSeconds1 ||
                  Math.floor(this.bannerPlayer.currentTime()) <= this.recapSeconds
                ) {
                  $(".title1").hide();
                }

                if (
                  Math.floor(this.bannerPlayer.currentTime()) == this.creditSeconds
                ) {
                  $("#titleThree").appendTo($('#video-ls'));
                  $(".title2").show();
                } else if (
                  Math.floor(this.bannerPlayer.currentTime()) >=
                  this.creditSeconds1 ||
                  Math.floor(this.bannerPlayer.currentTime()) <= this.creditSeconds
                ) {
                  $(".title2").hide();
                }
              });
            }, 1000);

          }
        }

      }
    }, 1000);
    // New player start
    setTimeout(() => {
      if (this.alldata.is_group == 1 && (this.isSubscribed || this.alldata.access_type == 'free')) {
        var buttonComponent = videoJs.getComponent("Button");
        var settingButton = videoJs.extend(buttonComponent, {
          constructor: function () {
            buttonComponent.apply(this, arguments);
            this.addClass("vjs-notes-btn");
            this.controlText("Episode");
          },

          handleClick: (e: any) => {
            // $("#bitrateLevels").appendTo($('#video-ls'));
            // $("#bitrateLevels").toggle()
            $('#bitrateLevels').hide();
            $(".vjs-subs-caps-button .vjs-menu-content").hide();
            $('#speedLevelV1').hide()
          },
        })
        videoJs.registerComponent("episodeButton", settingButton);
        this.bannerPlayer.getChild("controlBar").addChild("episodeButton", {}, 13);
        if (this.alldata.is_group == 1 && this.alldata.groupInfo != null && this.alldata.groupInfo.child.length != 0) {
          this.maxcounter = 500;
        }

        $(".vjs-overlay").hide();
        if (this.alldata.access_type == "paid" && this.isSubsInfo == 1 && this.alldata.rental == 0) {
          if (this.alldata.drm == 1) {
            // if (this.videourl.includes('mpd')) {
            var buttonComponent = videoJs.getComponent("Button");
            var settingButton = videoJs.extend(buttonComponent, {
              constructor: function () {
                buttonComponent.apply(this, arguments);
                this.addClass("vjs-icon-hd-main");
                this.controlText("Setting");
              },

              handleClick: (e: any) => {
                $("#bitrateLevels").appendTo($('#video-ls'));
                $("#bitrateLevels").toggle()
                $('#speedLevelV1').hide()
                $(".vjs-subs-caps-button .vjs-menu-content").hide()
              },
            })
            videoJs.registerComponent("settingButton", settingButton);
            this.bannerPlayer.getChild("controlBar").addChild("settingButton", {}, 14);
            // }
            // this.bannerPlayer.reset();
            // this.bannerPlayer.fluid(true)
            // if(this.alldata.groupInfo != null && this.alldata.groupInfo.child.length != 0)  {
            // this.bannerPlayer.notesButton({});
            // }

            // condition Start

            if (this.isSubsInfo == 1) {
              var parental: any = localStorage.getItem("taploginInfo");
              var parental_read = JSON.parse(parental);
              if (parental_read?.is_parental == 1 && this.isSubsInfo == 1) {
                this.playicon = false;
                // if (Number(parental_read.restriction_level) == -1) {
                //   setTimeout(() => {
                //     // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url);
                //     this.sssss()
                //   }, 500);
                // } else if (Number(parental_read.restriction_level) == 999) {
                //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {

                //     // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
                //     this.sssss()

                //   } else {
                //     this.bannerPlayer = videoJs('video-ls')
                //     videoJs(`#video-ls`).src({
                //       src: this.videourl, // dynamic link
                //     });
                //     this.bannerPlayer.play();
                //     this.bannerPlayer.hlsQualitySelector();
                //   }
                //   this.playicon = true;
                // } else if (
                //   (Number(parental_read.restriction_level) >= 18 &&
                //     Number(parental_read.restriction_level) < 999 &&
                //     Number(this.alldata.age_group) == 999) ||
                //   (Number(parental_read.restriction_level) >= 18 &&
                //     Number(parental_read.restriction_level) < 999 &&
                //     Number(this.alldata.age_group) == 16)
                // ) {
                //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
                //     setTimeout(() => {
                //       // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
                //       this.sssss()
                //     }, 500);
                //   } else {
                //     this.bannerPlayer = videoJs('video-ls')
                //     videoJs(`#video-ls`).src({
                //       src: this.videourl, // dynamic link
                //     });
                //     this.bannerPlayer.play();
                //     this.bannerPlayer.hlsQualitySelector();
                //   }
                //   this.playicon = true;
                // } else if (
                //   Number(parental_read.restriction_level) >= 18 &&
                //   Number(parental_read.restriction_level) < 999
                // ) {
                //   setTimeout(() => {
                //     // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url);
                //     this.sssss()
                //   }, 500);
                // } else if (
                //   Number(parental_read.restriction_level) >= 16 &&
                //   Number(parental_read.restriction_level) < 999 &&
                //   Number(this.alldata.age_group) == 999
                // ) {
                //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
                //     setTimeout(() => {
                //       // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
                //       this.sssss()
                //     }, 500);
                //   } else {
                //     this.bannerPlayer = videoJs('video-ls')
                //     videoJs(`#video-ls`).src({
                //       src: this.videourl, // dynamic link
                //     });
                //     this.bannerPlayer.play();
                //     this.bannerPlayer.hlsQualitySelector();
                //   }
                //   $(this.bannerPlayer.posterImage.contentEl()).hide();
                //   this.playicon = true;
                // } else {
                //   setTimeout(() => {
                //     // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url);
                //     this.sssss()
                //   }, 500);
                // }

                if (Number(parental_read.restriction_level) == -1) {
                  setTimeout(() => {
                    // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url);
                    this.sssss()
                  }, 500);
                } else if (Number(parental_read.restriction_level) == 999) {
                  if (this.alldata.drm == 1) {

                    // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
                    this.sssss()

                  } else {
                    this.bannerPlayer = videoJs('video-ls')
                    videoJs(`#video-ls`).src({
                      src: this.videourl, // dynamic link
                    });
                    this.bannerPlayer.play();
                    this.bannerPlayer.hlsQualitySelector();
                  }
                  this.playicon = true;
                } else if (Number(parental_read.restriction_level) < 999) {
                  if (Number(this.alldata.age_group) == 999) {
                    if (this.alldata.drm == 1) {

                      // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
                      this.sssss()

                    } else {
                      this.bannerPlayer = videoJs('video-ls')
                      videoJs(`#video-ls`).src({
                        src: this.videourl, // dynamic link
                      });
                      this.bannerPlayer.play();
                      this.bannerPlayer.hlsQualitySelector();
                    }
                    this.playicon = true;
                  } else if (Number(this.alldata.age_group) >= Number(parental_read.restriction_level) || Number(this.alldata.age_group) == -1) {
                    setTimeout(() => {
                      // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url);
                      this.sssss()
                    }, 500);
                  } else {
                    if (this.alldata.drm == 1) {

                      // this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
                      this.sssss()

                    } else {
                      this.bannerPlayer = videoJs('video-ls')
                      videoJs(`#video-ls`).src({
                        src: this.videourl, // dynamic link
                      });
                      this.bannerPlayer.play();
                      this.bannerPlayer.hlsQualitySelector();
                    }
                    this.playicon = true;
                  }
                }
              } else {
                this.sssss()
              }
            }


            // condition End
            setTimeout(() => {
              // this.bannerPlayer.overlay({
              //   overlays: [
              //     {
              //       start: "playing",
              //       content: this.alldata.title,
              //       align: "center",
              //     },
              //   ],
              // });

              this.bannerPlayer.overlay({
                overlays: [
                  {
                    start: "playing",
                    content: (`${this.alldata.season_number} ${this.alldata.episode_number} : ${this.alldata.title}`),
                    align: "center",
                  },
                ],
              });



              this.bannerPlayer.on("timeupdate", () => {
                if (
                  Math.floor(this.bannerPlayer.currentTime()) == this.introSeconds
                ) {
                  $(".title").show();
                } else if (
                  Math.floor(this.bannerPlayer.currentTime()) >=
                  this.introSeconds1 ||
                  Math.floor(this.bannerPlayer.currentTime()) <= this.introSeconds
                ) {
                  $(".title").hide();
                }

                if (
                  Math.floor(this.bannerPlayer.currentTime()) == this.recapSeconds
                ) {
                  $(".title1").show();
                } else if (
                  Math.floor(this.bannerPlayer.currentTime()) >=
                  this.recapSeconds1 ||
                  Math.floor(this.bannerPlayer.currentTime()) <= this.recapSeconds
                ) {
                  $(".title1").hide();
                }

                if (
                  Math.floor(this.bannerPlayer.currentTime()) == this.creditSeconds
                ) {
                  $(".title2").show();
                } else if (
                  Math.floor(this.bannerPlayer.currentTime()) >=
                  this.creditSeconds1 ||
                  Math.floor(this.bannerPlayer.currentTime()) <= this.creditSeconds
                ) {
                  $(".title2").hide();
                }
              });
            }, 1000);

          }

        }

        if (this.alldata.access_type == 'free' || (this.alldata.access_type == 'paid' && this.isSubscribed)) {
          this.bannerPlayer.ready(() => {
            this.bannerPlayer = window.videoPlayer || {};
            this.bannerPlayer = videoJs("video-ls");



            this.bannerPlayer.on("timeupdate", () => {
              if (
                Math.floor(this.bannerPlayer.currentTime()) == this.introSeconds
              ) {
                $(".title").show();
              } else if (
                Math.floor(this.bannerPlayer.currentTime()) >= this.introSeconds1 ||
                Math.floor(this.bannerPlayer.currentTime()) <= this.introSeconds
              ) {
                $(".title").hide();
              }

              if (
                Math.floor(this.bannerPlayer.currentTime()) == this.recapSeconds
              ) {
                $(".title1").show();
              } else if (
                Math.floor(this.bannerPlayer.currentTime()) >= this.recapSeconds1 ||
                Math.floor(this.bannerPlayer.currentTime()) <= this.recapSeconds
              ) {
                $(".title1").hide();
              }

              if (
                Math.floor(this.bannerPlayer.currentTime()) == this.creditSeconds
              ) {
                $(".title2").show();
              } else if (
                Math.floor(this.bannerPlayer.currentTime()) >=
                this.creditSeconds1 ||
                Math.floor(this.bannerPlayer.currentTime()) <= this.creditSeconds
              ) {
                $(".title2").hide();
              }
            });



            ((o: any) => {
              this.ds
                .getEpisodeData(
                  this.display_offset,
                  this.maxcounter,
                  this.alldata.season_id
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

                                      if (Number(img.width) == 360 || Number(img.width) == 854) {

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

                          // this.mainelement = element.title;

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
                                  drm: element.drm,
                                  season: element.season_number,
                                  episode: element.episode_number,
                                  k_id: element.k_id,
                                  spriteThumbnails: {
                                    url: sprite,
                                  },
                                  adUrls: element.ad_tag,
                                  skipDuration: duartionGet,
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



                      if (this.alldata.hasOwnProperty('index')) {
                        if (this.alldata.index != "") {
                          if (this.alldata.index == 0) {
                            this.itemget = this.alldata.index
                            if (this.arr.length == this.alldata.index) {
                              setTimeout(() => {
                                $(".vjs-icon-next-item").prop("disabled", true);
                                $(".vjs-icon-next-item").css("opacity", "0.5");
                              }, 1000);
                            }
                          } else {
                            this.itemget = this.alldata.index - 1
                            if (this.arr.length == this.alldata.index) {
                              setTimeout(() => {
                                $(".vjs-icon-next-item").prop("disabled", true);
                                $(".vjs-icon-next-item").css("opacity", "0.5");
                              }, 1000);
                            }
                          }

                        } else {
                          this.itemget = 0;
                        }

                      } else {
                        this.itemget = 0;
                      }

                      if (this.videosrc.length - 1 != this.itemget) {
                        this.bannerPlayer.on("ended", () => {
                          var parental: any = localStorage.getItem("taploginInfo");
                          var parental_read = JSON.parse(parental);
                          var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
                          if (ottLogged == "1") {
                            if (parental_read?.is_parental == 0) {
                              this.endBtnPlay()
                            } else {
                              if (parental_read?.is_parental == 1) {
                                if (Number(parental_read.restriction_level) == -1) {
                                  this.setPinNTE('next')
                                } else if (Number(parental_read.restriction_level) == 999) {
                                  this.endBtnPlay()
                                } else if (Number(parental_read.restriction_level) < 999) {
                                  if (this.videosrc[this.itemget].sources[0].age_group == 999) {
                                    this.endBtnPlay()
                                  } else if (this.videosrc[this.itemget].sources[0].age_group >= Number(parental_read.restriction_level) || this.videosrc[this.itemget].sources[0].age_group == -1) {
                                    this.setPinNTE('next')
                                  } else {
                                    this.endBtnPlay()
                                  }
                                }
                              } else {
                                this.endBtnPlay()
                              }
                            }
                          } else {
                            this.endBtnPlay()
                          }
                        });
                      }
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

                      //   For next and prev
                      var buttonComponent = videoJs.getComponent("Button");
                      var prevButton = videoJs.extend(buttonComponent, {
                        constructor: function () {
                          buttonComponent.apply(this, arguments);
                          this.addClass("vjs-icon-previous-item");
                          this.controlText("Previous");
                        },
                        handleClick: (e: any) => {
                          var parental: any = localStorage.getItem("taploginInfo");
                          var parental_read = JSON.parse(parental);
                          var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
                          if (ottLogged == "1") {
                            if (parental_read?.is_parental == 0) {
                              this.prevBtnPlay()
                            } else {
                              if (parental_read?.is_parental == 1) {
                                if (Number(parental_read.restriction_level) == -1) {
                                  this.setPinNTE('prev')
                                } else if (Number(parental_read.restriction_level) == 999) {
                                  this.prevBtnPlay()
                                } else if (Number(parental_read.restriction_level) < 999) {
                                  if (this.videosrc[this.itemget].sources[0].age_group == 999) {
                                    this.prevBtnPlay()
                                  } else if (this.videosrc[this.itemget].sources[0].age_group >= Number(parental_read.restriction_level) || this.videosrc[this.itemget].sources[0].age_group == -1) {
                                    this.setPinNTE('prev')
                                  } else {
                                    this.prevBtnPlay()
                                  }
                                }
                              } else {
                                this.prevBtnPlay()
                              }
                            }
                          } else {
                            this.prevBtnPlay()
                          }
                        },
                      });

                      var nextButton = videoJs.extend(buttonComponent, {
                        constructor: function () {
                          buttonComponent.apply(this, arguments);
                          this.addClass("vjs-icon-next-item");
                          this.controlText("Next");
                        },
                        handleClick: (e: any) => {
                          var parental: any = localStorage.getItem("taploginInfo");
                          var parental_read = JSON.parse(parental);
                          var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
                          if (ottLogged == "1") {
                            if (parental_read?.is_parental == 0) {
                              this.nextBtnPlay()
                            } else {
                              if (parental_read?.is_parental == 1) {
                                if (Number(parental_read.restriction_level) == -1) {
                                  this.setPinNTE('next')
                                } else if (Number(parental_read.restriction_level) == 999) {
                                  this.nextBtnPlay()
                                } else if (Number(parental_read.restriction_level) < 999) {
                                  if (this.videosrc[this.itemget].sources[0].age_group == 999) {
                                    this.nextBtnPlay()
                                  } else if (this.videosrc[this.itemget].sources[0].age_group >= Number(parental_read.restriction_level) || this.videosrc[this.itemget].sources[0].age_group == -1) {
                                    this.setPinNTE('next')
                                  } else {
                                    this.nextBtnPlay()
                                  }
                                }
                              } else {
                                this.nextBtnPlay()
                              }
                            }
                          } else {
                            this.nextBtnPlay()
                          }
                        },
                      });

                      $('#titleOne').appendTo('#video-ls')
                      $('#titleTwo').appendTo('#video-ls')
                      $('#titleThree').appendTo('#video-ls')



                      videoJs.registerComponent("prevButton", prevButton);
                      videoJs.registerComponent("nextButton", nextButton);

                      this.bannerPlayer
                        .getChild("controlBar")
                        .addChild("prevButton", {}, 0);
                      this.bannerPlayer
                        .getChild("controlBar")
                        .addChild("nextButton", {}, 2);
                    }
                  })
                )
                .subscribe();
            })(this.bannerPlayer);

            // if(this.alldata.groupInfo != null && this.alldata.groupInfo.child.length != 0) 
            // this.bannerPlayer.notesButton({});
          });
        }

      }
    }, 500);



    // New player end
  }

  rePlayI() {
    this.bannerPlayer.play();
    this.isReplay = false;
    this.playicon = true;
    $(this.bannerPlayer.posterImage.contentEl()).hide();
  }

  playUrl(c_id: any, sprite: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(c_id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.bannerPlayer.src({
              src: decryptData.url,
              spriteThumbnails: {
                url: sprite,
              },
            })
            this.bannerPlayer.play();
          }
        })
      } else {
        this.ds.getUnknownUrl(c_id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.bannerPlayer.src({
              src: decryptData.url,
              spriteThumbnails: {
                url: sprite,
              },
            })
            this.bannerPlayer.play();
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(c_id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.bannerPlayer.src({
              src: decryptData.url,
              spriteThumbnails: {
                url: sprite,
              },
            })
            this.bannerPlayer.play();
          }
        })
      } else {
        this.ds.getUnknownUrl(c_id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.bannerPlayer.src({
              src: decryptData.url,
              spriteThumbnails: {
                url: sprite,
              },
            })
            this.bannerPlayer.play();
          }
        })
      }
    }
  }

  playUrlOne(c_id: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(c_id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.bannerPlayer = videoJs('video-ls')
            videoJs(`#video-ls`).src({
              src: decryptData.url,
            });
            setTimeout(() => {

              this.bannerPlayer.play();

            }, 500);
            this.bannerPlayer.hlsQualitySelector()
          }
        })
      } else {
        this.ds.getUnknownUrl(c_id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.bannerPlayer = videoJs('video-ls')
            videoJs(`#video-ls`).src({
              src: decryptData.url,
            });
            setTimeout(() => {

              this.bannerPlayer.play();

            }, 500);
            this.bannerPlayer.hlsQualitySelector()
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(c_id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.bannerPlayer = videoJs('video-ls')
            videoJs(`#video-ls`).src({
              src: decryptData.url,
            });

            setTimeout(() => {

              this.bannerPlayer.play();

            }, 500);
            this.bannerPlayer.hlsQualitySelector()
          }
        })
      } else {
        this.ds.getUnknownUrl(c_id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.bannerPlayer = videoJs('video-ls')
            videoJs(`#video-ls`).src({
              src: decryptData.url,
            });
            setTimeout(() => {

              this.bannerPlayer.play();

            }, 500);
            this.bannerPlayer.hlsQualitySelector()
          }
        })
      }
    }
  }

  prevBtnPlay() {
    if (this.videosrc[this.itemget].sources[0].access == "free") {
      if (this.itemget != 0) {
        this.itemget--
      }
      this.adFirstTime = false;
      this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
      this.bannerPlayer.on('ads-manager', (response: any) => {
        var adsManager = response.adsManager;
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url);
        });
      })

      this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
    } else if (this.isSubsInfo == 1) {
      if (this.itemget != 0) {
        this.itemget--
      }
      this.adFirstTime = false;
      this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
      if (
        this.videosrc[this.itemget].sources[0].drm == 1
      ) {
        this.drm(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].k_id, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        this.bannerPlayer.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drm(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].k_id, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)

          });
        })
      } else {
        this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
      }
      this.ds.getDescriptionData(this.videosrc[this.itemget].sources[0].id).subscribe((res: any) => {

        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        this.setShowdetailData.emit(decryptData);
      })


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
    this.bannerPlayer.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });

    this.bannerPlayer.spriteThumbnails({
      interval: 5,
      url: this.videosrc[this.itemget].sources[0].spriteUrl,
      width: 224,
      height: 127,
    });
    if (this.itemget == 0) {
      $(".vjs-icon-previous-item").prop("disabled", true);
      $(".vjs-icon-previous-item").css("opacity", "0.5");
    }

    if (this.videosrc.length - 1 != this.itemget)
      $(".vjs-icon-next-item").prop("disabled", false);
    $(".vjs-icon-next-item").css("opacity", "1.0");
  }

  nextBtnPlay() {
    if (this.videosrc.length != this.itemget + 1) {
      this.itemget++
    }

    this.adFirstTime = false;
    this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
    if (this.videosrc[this.itemget].sources[0].access == "free") {
      this.bannerPlayer.on('ads-manager', (response: any) => {
        var adsManager = response.adsManager;
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        });
      })

      this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)

    } else if (this.isSubsInfo == 1) {
      if (
        this.videosrc[this.itemget].sources[0].drm == 1
        // this.videosrc[this.itemget].sources[0].src.includes("mpd")
      ) {
        this.drm(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].k_id, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        this.bannerPlayer.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drm(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].k_id, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)

          });
        })
      } else {
        this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
      }
      this.ds.getDescriptionData(this.videosrc[this.itemget].sources[0].id).subscribe((res: any) => {

        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        this.setShowdetailData.emit(decryptData);
      })


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
    this.bannerPlayer.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });

    this.bannerPlayer.spriteThumbnails({
      interval: 5,
      url: this.videosrc[this.itemget].sources[0].spriteUrl,
      width: 224,
      height: 127,
    });

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

  }

  endBtnPlay() {
    $(this.bannerPlayer.posterImage.contentEl()).hide();
    if (this.videosrc.length != this.itemget + 1) {
      this.itemget++
    }
    if (this.videosrc[this.itemget].sources[0].access == "free") {
      this.bannerPlayer.on('ads-manager', (response: any) => {
        var adsManager = response.adsManager;
        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
          this.adFirstTime = false;
          this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        });
      })
      this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
      this.adFirstTime = false;
      this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
    } else if (this.isSubsInfo == 1) {

      if (
        this.videosrc[this.itemget].sources[0].drm == 1
      ) {
        this.adFirstTime = false;
        this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
        this.drm(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].k_id, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        this.bannerPlayer.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drm(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].k_id, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)

          });
        })
      } else {
        this.adFirstTime = false;
        this.playUrl(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
        this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
      }


      this.ds.getDescriptionData(this.videosrc[this.itemget].sources[0].id).subscribe((res: any) => {

        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        this.setShowdetailData.emit(decryptData);
      })
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
    this.bannerPlayer.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].season} ${this.videosrc[this.itemget].sources[0].episode} : ${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });

    this.bannerPlayer.spriteThumbnails({
      interval: 5,
      url: this.videosrc[this.itemget].sources[0].spriteUrl,
      width: 224,
      height: 127,
    });
  }

  setPinNTE(type: any) {
    this.bannerPlayer.exitFullscreen()
    this.bannerPlayer.pause()
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      document.body.style.overflow = 'auto'
      this.bannerPlayer.play()
      this.bannerPlayer.requestFullscreen()
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        if (type == 'prev') {
          this.prevBtnPlay()
        } else if (type == 'next') {
          this.nextBtnPlay()
        } else {
          this.endBtnPlay()
        }
      }
      this.bannerPlayer.requestFullscreen()
    });
  }

  changePlaybackRate(value: any, event: any) {
    $("ul li.activeModespeed").removeClass("activeModespeed");
    event.target.classList.value = 'activeModespeed'


    if (this.bannerPlayer) {
      this.bannerPlayer.playbackRate(value);
    }
  }

  skipTime(skipTimeGet: any) {
    if (skipTimeGet.length == 1) {
      console.log("1");
      // skip intro
      var hms = skipTimeGet[0].start;
      var hms1 = skipTimeGet[0].end;
      var a = hms.split(":");
      var b = hms1.split(":");

      this.introSeconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
      this.introSeconds1 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];
      console.log(this.introSeconds, "11111");
      console.log(this.introSeconds1, "222222");
    }

    if (skipTimeGet.length == 2) {
      console.log("2");
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
      console.log("3");
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

    skipTimeGet = [];
  }

  jsondata() {
    this.ds.faqData().subscribe((data: any) => {
      this.ageshow = data.Player[0].UA_setting;
      this.lBandShowMini = data.Player[0].ads_visible;
      this.waterMarkImg = data.Player[0].watermarking[0].image
      this.waterMarkImgAllow = data.Player[0].watermarking[0].is_allow

      // this.googleAdsAllow = data;
    });
  }
  asLbandClick(a: any, b: any, c: any) {
  }

  astoncross() {
    var lbandMini: any = document.getElementById("astonbandMini");
    lbandMini.style.display = "none";
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
        this.bandimageMini = decryptData.ad_data;

        this.bandimageMini.forEach((ele: any) => {
          this.ggMini.push(ele)
        });

        var hours = Number(this.alldata.duration.slice(0, 2));
        var minute = Number(this.alldata.duration.slice(3, 5));
        var second = Number(this.alldata.duration.slice(6, 8));
        var total = (hours * 60 * 60) + (minute * 60) + second;

        const adsArr = this.ggMini;
        const length = total;
        const gap = this.lBandShowMini.gap_duration_min * 60;
        const arr = [];
        const lopcount = Math.ceil(length / gap);

        for (let i = 0; i < lopcount; i++) {
          arr.push({
            adsItem: adsArr[i % adsArr.length],
            nextAd: this.lBandShowMini.start_time_sec + (gap * i)
          });
        }

        this.adUrlLoopMini = arr;

        setTimeout(() => {
          this.bannerPlayer.on("timeupdate", () => {
            this.adUrlLoopMini.forEach((element: any) => {
              if (Math.floor(this.bannerPlayer.currentTime()) == element.nextAd) {
                if (element.adsItem.source_type == "aston_band") {
                  let xc = window.innerWidth;
                  if (this.lBandShowMini.close_button != 1) {
                    var astoncancel: any =
                      document.getElementById("astoncancel");
                    astoncancel.style.display = "none";
                  }

                  $('#astonbandMini').appendTo('#video-ls')
                  this.astonBandImage = element.adsItem.img_url[0].url;
                  this.astonBandShare = element.adsItem.share_url;
                  this.astonBandTitle = element.adsItem.title;
                  var lbandMini: any = document.getElementById("astonbandMini");
                  lbandMini.style.display = "flex";
                  lbandMini.style.left = "20%"
                  lbandMini.style.position = "absolute";
                  lbandMini.style.width = "60%";
                  lbandMini.style.height = "15%"
                  lbandMini.style.zIndex = "9";
                  if (xc < 920) {
                    lbandMini.style.bottom = "21%";
                  } else if (xc <= 1370) {
                    lbandMini.style.bottom = "14%";
                  } else {
                    lbandMini.style.bottom = "10%";
                  }
                  lbandMini.style.justifyContent = "center";

                  if (this.astonTemp == true) {
                  }

                  setTimeout(() => {
                    lbandMini.style.display = "none";
                  }, this.lBandShowMini.end_time_sec * 1000);
                }
              }
            });
          });
        }, 1000);
      }
    });

  }




  getEpisode12() {
    this.EpiData = [];
    // this.slickModal.unslick();
    this.ds
      .getEpisodeData(this.display_offset, 1000, this.alldata.season_id)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            $(".episodeSelector").appendTo($("#video-player"));
            // this.slickModal.initSlick(this.slideConfig);
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
                    }
                  });
                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
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

              // this.mainelement = element.title;

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
                      drm: element.drm,
                      season: element.season_number,
                      episode: element.episode_number,
                      k_id: element.k_id,
                      spriteThumbnails: {
                        url: sprite,
                      },
                      adUrls: element.ad_tag,
                      skipDuration: duartionGet,
                    },
                  ],
                });
              }, 500);

              this.arr.push(element.id);

            });
            // this.slickModal.slick()
            // this.slickModal.initSlick(this.slideConfig);
          }
        })
      )
      .subscribe();

    // this.slickModal.initSlick(this.slideConfig);
  }


  getId(i: any) {
    this.setF = true;
    this.p = i;
    this.checked = i;
  }

  getEpisode1(event: any, seasonCount: any) {
    this.EpiData = [];
    // this.slickModal.unslick();
    this.ds
      .getEpisodeData(this.display_offset, seasonCount, event)
      .pipe(
        map((res: any) => {
          if (res.code == 1) {
            $(".episodeSelector").appendTo($("#video-player"));
            // this.slickModal.initSlick(this.slideConfig);
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
                    }
                  });
                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
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

              // this.mainelement = element.title;

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
                      drm: element.drm,
                      season: element.season_number,
                      episode: element.episode_number,
                      k_id: element.k_id,
                      spriteThumbnails: {
                        url: sprite,
                      },
                      adUrls: element.ad_tag,
                      skipDuration: duartionGet,
                    },
                  ],
                });
              }, 500);

              this.arr.push(element.id);

            });
            // this.slickModal.slick();
            // this.slickModal.initSlick(this.slideConfig);
          }
        })
      )
      .subscribe();
  }

  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path;
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

  slickInit(_e: any) { }

  breakpoint(_e: any) { }

  afterChange(_e: any) { }

  beforeChange(_e: any) { }

  getm3u8(id: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);

            // id = decryptData.id;
            // kId = decryptData.k_id;
            this.mainm3u8 = decryptData.url;
            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;

          }
        })
      } else {
        this.ds.getUnknownUrl(id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);

            // id = decryptData.id;
            // kId = decryptData.k_id;
            this.mainm3u8 = decryptData.url;
            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            // id = decryptData.id;
            // kId = decryptData.k_id;
            this.mainm3u8 = decryptData.url;


            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      } else {
        this.ds.getUnknownUrl(id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            // id = decryptData.id;
            // kId = decryptData.k_id;
            this.mainm3u8 = decryptData.url;

            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      }
    }

  }

  drm(id: any, kId: any, url: any, type: any, spritU: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);

            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      } else {
        this.ds.getUnknownUrl(id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);

            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      }

      setTimeout(() => {
        this.bannerPlayer.src({
          src: url,
          spriteThumbnails: {
            url: spritU,
          },
        })

        if (spritU != "") {
          this.bannerPlayer.spriteThumbnails({
            interval: 5,
            url: spritU,
            width: 224,
            height: 127,
          });
        }

        $(this.bannerPlayer.posterImage.contentEl()).hide();
      }, 500);


      setTimeout(() => {
        this.muted = true
        this.bannerPlayer.play();
      }, 1000);
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;


            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      } else {
        this.ds.getUnknownUrl(id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;


            // this.playDuration = decryptData.played_duration;
            // accessType = decryptData.price_type;
          }
        })
      }

      // this.userId = localStorage.getItem("taploginInfo");
      // this.user = JSON.parse(this.userId);
      // var authcode = localStorage.getItem("auth_token");
      // var packages: any = localStorage.getItem("ott_subscriptionPlan");
      // var packageId = JSON.parse(packages);
      // var uuid = new DeviceUUID().get();
      // var encryptedUserId = btoa((uuid));


      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      var authcode = localStorage.getItem('auth_token')
      var packages: any = localStorage.getItem("ott_subscriptionPlan");
      var packageId = JSON.parse(packages);
      var uuid = new DeviceUUID().get();
      this.encryptedUserId = btoa((uuid));

      if (type == "paid") {
        if (this.user && this.isSubsInfo != 1) {
          var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "21600", "package_id": packageId.packages_list[0].package_id, "download": "0", "content_type": "1", "rental_duration": "21600", "security_level": "3", "user_id": String(this.user.id) }
          var gettoken = btoa(JSON.stringify(dataOfContent))
        } else if (this.user && this.isSubsInfo == 1) {
          var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "21600", "package_id": packageId.packages_list[0].package_id, "download": "0", "content_type": "1", "rental_duration": "21600", "security_level": "3", "user_id": String(this.user.id) }
          var gettoken = btoa(JSON.stringify(dataOfContent))
        } else {
          var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "21600", "package_id": "", "download": "0", "content_type": "1", "rental_duration": "21600", "security_level": "3", "user_id": "" }
          var gettoken = btoa(JSON.stringify(dataOfContent))
        }
      } else {
        if (this.user && this.isSubsInfo != 1) {
          var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "21600", "package_id": "", "download": "0", "content_type": "0", "rental_duration": "21600", "security_level": "3", "user_id": String(this.user.id) }
          var gettoken = btoa(JSON.stringify(dataOfContent))
        } else if (this.user && this.isSubsInfo == 1) {
          var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "21600", "package_id": packageId.packages_list[0].package_id, "download": "0", "content_type": "0", "rental_duration": "21600", "security_level": "3", "user_id": String(this.user.id) }
          var gettoken = btoa(JSON.stringify(dataOfContent))
        } else {
          var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "21600", "package_id": "", "download": "0", "content_type": "0", "rental_duration": "21600", "security_level": "3", "user_id": "" }
          var gettoken = btoa(JSON.stringify(dataOfContent))
        }
      }


      this.bannerPlayer = videoJs("video-ls");
      setTimeout(() => {
        if (url.includes('.m3u8')) {
          this.bannerPlayer.src({
            src: url,
            spriteThumbnails: {
              url: spritU,
            },
          })

          if (spritU != "") {
            this.bannerPlayer.spriteThumbnails({
              interval: 5,
              url: spritU,
              width: 224,
              height: 127,
            });

          }
          setTimeout(() => {
            this.muted = false
            this.bannerPlayer.play();
          }, 1000);
        } else {
          this.bannerPlayer.src({
            src: url,
            type: 'application/dash+xml',
            'keySystemOptions': [
              {
                'name': 'com.widevine.alpha',
                'options': {
                  'serverURL': 'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=BB00A6&user_id= ' + this.encryptedUserId + '&type=widevine&authorization=' + authcode + '&payload=' + gettoken
                }
              },
              {
                'name': 'com.microsoft.playready',
                'options': {
                  'serverURL': "https://playready.ezdrm.com/cency/preauth.aspx?pX=B3F37F&user_id=" + this.encryptedUserId + "&type=playready&authorization=" +
                    authcode +
                    "&payload=" +
                    gettoken,
                }
              }
            ],
            spriteThumbnails: {
              url: spritU,
            },
          });
          $(this.bannerPlayer.posterImage.contentEl()).hide();
          // this.bannerPlayer.play();
          this.sssss()
          if (spritU != "") {
            this.bannerPlayer.spriteThumbnails({
              interval: 5,
              url: spritU,
              width: 224,
              height: 127,
            });
          }
        }
        // $('.vjs-quality-selector').hide()
      }, 1000);



      setTimeout(() => {
        this.muted = true
        this.bannerPlayer.play();
        this.sssss()

      }, 2000);



      // this.userId = localStorage.getItem("taploginInfo");
      // this.user = JSON.parse(this.userId);
      // var authcode = localStorage.getItem('auth_token')
      // var packages: any = localStorage.getItem("ott_subscriptionPlan");
      // var packageId = JSON.parse(packages);

      // if(this.alldata.access_type == "paid"){
      //   if (this.user && this.isSubsInfo != 1) {
      //     var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "rental_duration": "300","download":"0", "content_type":"1", "security_level": "3", "user_id": String(this.user.id)}
      //     var gettoken = btoa(JSON.stringify(dataOfContent))
      //   } else if (this.user && this.isSubsInfo == 1) {
      //     var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": packageId.packages_list[0].package_id, "rental_duration": "300", "download":"0", "content_type":"1", "security_level": "3", "user_id": String(this.user.id) }
      //     var gettoken = btoa(JSON.stringify(dataOfContent))
      //   } else {
      //     var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "rental_duration": "300","download":"0", "content_type":"1", "security_level": "3", "user_id": "" }
      //     var gettoken = btoa(JSON.stringify(dataOfContent))
      //   }
      // } else {
      //   if (this.user && this.isSubsInfo != 1) {
      //     var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "rental_duration": "300","download":"0", "content_type":"0", "security_level": "3", "user_id": String(this.user.id) }
      //     var gettoken = btoa(JSON.stringify(dataOfContent))
      //   } else if (this.user && this.isSubsInfo == 1) {
      //     var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": packageId.packages_list[0].package_id, "rental_duration": "300", "download":"0", "content_type":"0", "security_level": "3", "user_id": String(this.user.id) }
      //     var gettoken = btoa(JSON.stringify(dataOfContent))
      //   } else {
      //     var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "rental_duration": "300","download":"0", "content_type":"0", "security_level": "3", "user_id": "" }
      //     var gettoken = btoa(JSON.stringify(dataOfContent))
      //   }
      // }


      // this.bannerPlayer = videoJs("video-ls");
      // setTimeout(() => {
      //   this.bannerPlayer.src({
      //     src: url,
      //     type: 'application/dash+xml',
      //     'keySystemOptions': [
      //       {
      //         'name': 'com.widevine.alpha',
      //         'options': {
      //           'serverURL': 'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=C947D1&type=widevine&authorization=' + authcode + '&payload=' + gettoken
      //         }
      //       },
      //     ]
      //   });
      // }, 1000);

      // setTimeout(() => {
      //   this.muted = true
      //   this.bannerPlayer.play();
      // }, 1500);
    }

  }


  // drmContent(id: any, kId: any, url: any) {
  //   this.userId = localStorage.getItem("taploginInfo");
  //   this.user = JSON.parse(this.userId);
  //   var authcode = localStorage.getItem('auth_token')
  //   var packages: any = localStorage.getItem("ott_subscriptionPlan");
  //   var packageId = JSON.parse(packages);

  //   if (this.data.access_type == "paid") {
  //     if (this.user && this.isSubsInfo != 1) {
  //       var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "download": "0", "content_type": "1", "rental_duration": "300", "security_level": "3", "user_id": String(this.user.id) }
  //       var gettoken = btoa(JSON.stringify(dataOfContent))
  //     } else if (this.user && this.isSubsInfo == 1) {
  //       var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": packageId.packages_list[0].package_id, "download": "0", "content_type": "1", "rental_duration": "300", "security_level": "3", "user_id": String(this.user.id) }
  //       var gettoken = btoa(JSON.stringify(dataOfContent))
  //     } else {
  //       var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "download": "0", "content_type": "1", "rental_duration": "300", "security_level": "3", "user_id": "" }
  //       var gettoken = btoa(JSON.stringify(dataOfContent))
  //     }
  //   } else {
  //     if (this.user && this.isSubsInfo != 1) {
  //       var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "download": "0", "content_type": "0", "rental_duration": "300", "security_level": "3", "user_id": String(this.user.id) }
  //       var gettoken = btoa(JSON.stringify(dataOfContent))
  //     } else if (this.user && this.isSubsInfo == 1) {
  //       var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": packageId.packages_list[0].package_id, "download": "0", "content_type": "0", "rental_duration": "300", "security_level": "3", "user_id": String(this.user.id) }
  //       var gettoken = btoa(JSON.stringify(dataOfContent))
  //     } else {
  //       var dataOfContent: any = { "content_id": id, "k_id": kId, "licence_duration": "300", "package_id": "", "download": "0", "content_type": "0", "rental_duration": "300", "security_level": "3", "user_id": "" }
  //       var gettoken = btoa(JSON.stringify(dataOfContent))
  //     }
  //   }


  //   this.player = videoJs("video-player");
  //   setTimeout(() => {
  //     this.player.src({
  //       src: url,
  //       type: 'application/dash+xml',
  //       'keySystemOptions': [
  //         {
  //           'name': 'com.widevine.alpha',
  //           'options': {
  //             'serverURL': 'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=C947D1&type=widevine&authorization=' + authcode + '&payload=' + gettoken
  //           }
  //         },
  //       ]
  //     });

  //     this.player.play();
  //   }, 3000);
  // }

  // pause() {
  //   this.bannerPlayer = videoJs("video-ls");
  //   if (this.alldata.ad_tag.length != 0) {
  //     if (this.adStaredNow == true) {
  //       this.bannerPlayer.ima.pauseAd();
  //       if (this.adplaying == true) {
  //         this.bannerPlayer.pause();
  //       }
  //       this.bannerPlayer.on("pause", () => {
  //         this.playing = true;
  //       });
  //     } else {
  //       this.bannerPlayer.pause();
  //       this.bannerPlayer.on("pause", () => {
  //         this.playing = true;
  //       });
  //     }

  //     this.playing = true;
  //   } else {
  //     this.bannerPlayer.pause();
  //     this.bannerPlayer.on("pause", () => {
  //       this.playing = true;
  //     });
  //   }

  // }


  pause() {
    this.bannerPlayer = videoJs("video-ls");
    if (this.findAd) {
      if (this.adStaredNow == true) {
        this.bannerPlayer.ima.pauseAd();
        if (this.adplaying == true) {
          this.bannerPlayer.pause();
        }
        this.bannerPlayer.on("pause", () => {
          this.playing = true;
        });
      } else {
        this.bannerPlayer.pause();
        this.bannerPlayer.on("pause", () => {
          this.playing = true;
        });
      }

      this.playing = true;
    } else {
      this.bannerPlayer.pause();
      this.bannerPlayer.on("pause", () => {
        this.playing = true;
      });
    }

  }

  // play() {
  //   this.bannerPlayer = videoJs("video-ls");
  //   if (this.alldata.ad_tag.length != 0) {
  //     if (this.adStaredNow == true) {
  //       this.bannerPlayer.ima.resumeAd();
  //       if (this.adplaying == true) {
  //         this.bannerPlayer.play();
  //       }
  //       this.bannerPlayer.on("play", () => {
  //         this.playing = false;
  //       });
  //     } else {
  //       this.bannerPlayer.play();
  //       this.bannerPlayer.on("play", () => {
  //         this.playing = false;
  //       });
  //     }


  //     this.playing = false;
  //   } else {
  //     this.bannerPlayer.play();
  //     this.bannerPlayer.on("play", () => {
  //       this.playing = false;
  //     });
  //   }

  // }

  play() {
    this.bannerPlayer = videoJs("video-ls");
    if (this.findAd) {
      if (this.adStaredNow == true) {
        this.bannerPlayer.ima.resumeAd();
        if (this.adplaying == true) {
          this.bannerPlayer.play();
        }
        this.bannerPlayer.on("play", () => {
          this.playing = false;
        });
      } else {
        this.bannerPlayer.play();
        this.bannerPlayer.on("play", () => {
          this.playing = false;
        });
      }


      this.playing = false;
    } else {
      this.bannerPlayer.play();
      this.bannerPlayer.on("play", () => {
        this.playing = false;
      });
    }

  }

  setpin() {
    // if(this.dialog.openDialogs.length==0){

    // }
    this.flickring = false

    this.bannerPlayer.pause();
    setTimeout(() => {
      $(this.bannerPlayer.posterImage.contentEl()).show();
    }, 500);

    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = 'auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        setTimeout(() => {
          this.flickring = true

        }, 1000);

        if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
          if (this.alldata.is_group == 1) {
            this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
          } else {
            this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
          }
        } else {
          this.playUrlOne(this.alldata.id)
        }
        $(this.bannerPlayer.posterImage.contentEl()).hide();
        this.playicon = true;
      }
    });
  }

  crossEpisode() {
    $(".episodeSelector1").hide();
    this.bannerPlayer.play()
  }

  mute() {
    if (this.alldata.ad_tag.length != 0) {
      if (this.adStaredNow == true) {
        if (this.adplaying == false) {
          this.adsManagerGet = this.bannerPlayer.ima.getAdsManager();
          this.adsManagerGet.setVolume(0);
          this.bannerPlayer.muted(true);
          this.bannerPlayer.volume(0);
        }

        if (this.adplaying == true) {
          this.bannerPlayer.muted(true);
          this.bannerPlayer.volume(0);
        }
      } else {
        this.bannerPlayer.muted(true);
        // if (this.bannerPlayer.muted()) {
        this.muted = true;
        this.bannerPlayer.volume(0);
      }

      this.muted = true;
    } else {
      this.bannerPlayer.muted(true);
      // if (this.bannerPlayer.muted()) {
      this.muted = true;
      this.bannerPlayer.volume(0);
      // }
    }
  }

  unmute() {
    if (this.alldata.ad_tag.length != 0) {
      if (this.adStaredNow == true) {
        if (this.adplaying == false) {
          this.adsManagerGet = this.bannerPlayer.ima.getAdsManager();
          this.adsManagerGet.setVolume(1);
          this.bannerPlayer.volume(1);
          this.bannerPlayer.muted(false);
        }

        if (this.adplaying == true) {
          this.bannerPlayer.muted(false);
          this.bannerPlayer.volume(1);
        }
      } else {
        this.bannerPlayer.muted(false);
        // if (this.bannerPlayer.muted()) {
        this.muted = false;
        this.bannerPlayer.volume(1);
      }

      this.muted = false;
    } else {
      this.bannerPlayer.muted(false);
      // if (this.bannerPlayer.muted()) {
      this.muted = false;
      this.bannerPlayer.volume(1);
      // }
    }
  }

  fullscreen() {
    let xc = window.innerWidth;
 

    if (xc < 992) {
      $(".vjs-notes-btn").on('touchstart', () => {
        this.slickModal.unslick()
        $(".episodeSelector1").appendTo($('#video-ls'));
        this.slickModal.initSlick(this.slideConfig)
        $('.episodeSelector1').show()
        $('#bitrateLevels').hide();
        $(".vjs-subs-caps-button .vjs-menu-content").hide();
        $('#speedLevelV1').hide()
        // if (this.bannerPlayer) {
        //   this.bannerPlayer.pause()
        // }

      });
    }

    setTimeout(() => {
      $('.vjs-notes-btn').attr('title', 'Season-Selector');
      $('.vjs-icon-hd').attr('title', 'Settings');
      $(".title").appendTo($('#video-ls'));
      $(".title").show();
      $("#titleOnePlayer1").appendTo($('#video-ls'))
    }, 1000);
    setTimeout(() => {
      $(".vjs-notes-btn").show();
    }, 100);
    $(".vjs-notes-btn").click(() => {
      this.slickModal.unslick()
      $(".episodeSelector1").appendTo($('#video-ls'));
      this.slickModal.initSlick(this.slideConfig)
      $('.episodeSelector1').show()
      $('#bitrateLevels').hide();
      $(".vjs-subs-caps-button .vjs-menu-content").hide();
      $('#speedLevelV1').hide()
      if (this.bannerPlayer) {
        this.bannerPlayer.pause()
      }


    });

    $(document).mouseup((e: any) => {
      if ($(e.target).closest(".episodeSelector1").length === 0) {
        $(".episodeSelector1").hide();
      }
    });

    if (this.alldata.is_live == 1) {
      $(".vjs-progress-control").addClass("hideprogress");
      $(".vjs-seek-button").addClass("hideprogress");
      $(".vjs-play-control").addClass("hideprogress");
      $(".vjs-time-control").addClass("hideprogress");
      $(".vjs-notes-btn").addClass("hideprogress");
      $(".vjs-icon-previous-item").addClass("hideprogress");
      $(".vjs-icon-next-item").addClass("hideprogress");
      $(".vjs-quality-selector").addClass("hideprogress")
    }

    setTimeout(() => {
      this.bannerPlayer.requestFullscreen();
      if (xc < 992) {
        this.bannerPlayer.landscapeFullscreen();
      }
      this.bannerPlayer.on("fullscreenchange", (e: any) => {
        $(".moveToVideoJs").show();
        setTimeout(() => {
          $(".moveToVideoJs").hide();
        }, 5000);

        if (this.bannerPlayer.isFullscreen() == true) {

          $('#waterMarkLs').show()

          setTimeout(() => {
            $('.title').show()
            const el = document.querySelector('.title');
            if (el) {
              (el as HTMLElement).style.bottom = '9em';
            }
          }, 100);
          this.bannerPlayer.on("timeupdate", () => {

            if (this.bannerPlayer.userActive() == false) {
              $(".vjs-overlay").hide();
              $('#bitrateLevels').hide();
              $(".vjs-subs-caps-button .vjs-menu-content").hide();
              $('#speedLevelV1').hide();

            } else {
              $(".vjs-overlay").show();
              $(".age").show()
            }
          });
          this.bannerPlayer.addClass("video-js");
          this.bannerPlayer.controls(true);
        } else {
          const el = document.querySelector('.title');
          if (el) {
            (el as HTMLElement).style.bottom = '5em';
          }
          $('#waterMarkLs').hide()
          $(".vjs-overlay").hide();
          $("#bitrateLevels").hide()
          $(".episodeSelector1").hide()
          $('#speedLevelV1').hide()
          $(".vjs-subs-caps-button .vjs-menu-content").hide();
          this.bannerPlayer.on("timeupdate", () => {
            if (this.bannerPlayer.userActive() == true) {
              $(".vjs-overlay").hide();
            }
          });

          this.bannerPlayer.controls(false);
          this.bannerPlayer.removeClass("video-js");

          $(".moveToVideoJs").hide();
        }
      });
    }, 300);


  }

  imgSubs() {
    this.router.navigate(["/subscribe"]);
  }

  agepopup() {
    // setTimeout(() => {
    //   this.hideicon = true;
    // }, 2000);
    this.bannerPlayer.pause();
    const dialogRef = this.dialog.open(AdultAgePopupComponent, {
      panelClass: "adultAgePopup",
      width: "500px",
      data: { dat: event },
    });
    const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
      if (this.isSubsInfo != 1 && this.alldata.trailer_url == "" && this.alldata.access_type == 'paid') {
        this.router.navigate(["/subscribe"]);
      }
      // setTimeout(() => {
      //   this.hideicon = true;
      // }, 1000);

      this.playing = false;
      if (this.alldata.drm == 1 && this.alldata.access_type == "paid" && this.isSubsInfo == 1) {
        this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
        this.sssss()
      } else if (this.alldata.access_type == 'free' && this.isSubsInfo != 1) {
        this.playUrlOne(this.alldata.id)
        $(this.bannerPlayer.posterImage.contentEl()).hide();
        this.agehide = false;
      } if (this.alldata.access_type == 'paid' && this.isSubsInfo != 1) {
        setTimeout(() => {
          this.bannerPlayer = videoJs('video-ls')
          videoJs(`#video-ls`).src({
            src: this.videourl, // dynamic link
          });
          $(".vjs-overlay").hide();
          setTimeout(() => {
            this.bannerPlayer.play();
          }, 500);
        }, 500);

        $(this.bannerPlayer.posterImage.contentEl()).hide();
        this.agehide = false;
        this.bannerPlayer.hlsQualitySelector();
      }
      $(this.bannerPlayer.posterImage.contentEl()).hide();
      this.agehide = false;
    });
  }

  sssss() {
    this.bannerPlayer.on('loadeddata', () => {
      // if (this.videourl.includes('mpd')) {

      const mediaPlayer = this.bannerPlayer.dash.mediaPlayer;
      this.bannerPlayer.dashQualityLevels = mediaPlayer.getBitrateInfoListFor('video');
      this.bannerPlayer.trigger('dashQualityLevels');

      this.bannerPlayer.on("dashQualityLevelsSelected", (e: any) => {

        let select = e.target.player.dashQualityLevelsSelected;


        let cfg: any = {
          'streaming': {
            'abr': {
              'autoSwitchBitrate': {}
            }
          }
        };

        cfg.streaming.abr.autoSwitchBitrate['video'] = false;
        mediaPlayer.updateSettings(cfg);
        mediaPlayer.setQualityFor('video', select, true);

      });



      if (this.bannerPlayer.dashQualityLevels.length == 9) {
        this.bannerPlayer.on("dashQualityLevels", (e: any) => {

          let levels = e.target.player.dashQualityLevels;


          const ul: any = document.getElementById('bitrateLevels');

          let li: any = document.getElementById("quality11");
          li.innerHTML = `${levels[0].height}p`;
          li.setAttribute('height', levels[0].height);
          li.classList.add(`activeMode${0}`);
          li.setAttribute('index', 0);

          li.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li.classList.add('activemode')

          }
          ul.appendChild(li);


          let li1: any = document.getElementById("quality21");
          li1.innerHTML = `${levels[1].height}p`;
          li1.setAttribute('height', levels[1].height);
          li1.classList.add(`activeMode${1}`);
          li1.setAttribute('index', 1);

          li1.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li1.classList.add('activemode')

          }
          ul.appendChild(li1);


          let li2: any = document.getElementById("quality31");
          li2.innerHTML = `${levels[2].height}p`;
          li2.setAttribute('height', levels[2].height);
          li2.classList.add(`activeMode${2}`);
          li2.setAttribute('index', 2);

          li2.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li2.classList.add('activemode')

          }
          ul.appendChild(li2);

          let li3: any = document.getElementById("quality41");
          li3.innerHTML = `${levels[3].height}p`;
          li3.setAttribute('height', levels[3].height);
          li3.classList.add(`activeMode${3}`);
          li3.setAttribute('index', 3);

          li3.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li3.classList.add('activemode')

          }
          ul.appendChild(li3);

          let li4: any = document.getElementById("quality51");
          li4.innerHTML = `${levels[4].height}p`;
          li4.setAttribute('height', levels[4].height);
          li4.classList.add(`activeMode${4}`);
          li4.setAttribute('index', 4);

          li4.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li4.classList.add('activemode')

          }
          ul.appendChild(li4);

          let li5: any = document.getElementById("quality61");
          li5.innerHTML = `${levels[5].height}pl`;
          li5.setAttribute('height', levels[5].height);
          li5.classList.add(`activeMode${5}`);
          li5.setAttribute('index', 5);

          li5.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li5.classList.add('activemode')

          }
          ul.appendChild(li5);

          let li6: any = document.getElementById("quality71");
          li6.innerHTML = `${levels[6].height}ph`;
          li6.setAttribute('height', levels[6].height);
          li6.classList.add(`activeMode${6}`);
          li6.setAttribute('index', 6);

          li6.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li6.classList.add('activemode')

          }

          ul.appendChild(li6);

          let li7: any = document.getElementById("quality81");
          li7.innerHTML = `${levels[7].height}pl`;
          li7.setAttribute('height', levels[7].height);
          li7.classList.add(`activeMode${7}`);
          li7.setAttribute('index', 7);

          li7.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li7.classList.add('activemode')

          }

          ul.appendChild(li7);

          let li8: any = document.getElementById("quality91");
          li8.innerHTML = `${levels[8].height}ph`;
          li8.setAttribute('height', levels[8].height);
          li8.classList.add(`activeMode${8}`);
          li8.setAttribute('index', 8);

          li8.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li8.classList.add('activemode')

          }


          ul.appendChild(li8);

          let li9: any = document.getElementById("quality101");
          li9.innerHTML = 'Auto';
          li9.setAttribute('height', 'auto');
          li9.classList.add(`activeModeauto`);
          li9.setAttribute('index', 6);

          li9.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li9.classList.add('activemode')

          }
          ul.appendChild(li9);
        });


      }

      if (this.bannerPlayer.dashQualityLevels.length == 3) {

        this.bannerPlayer.on("dashQualityLevels", (e: any) => {

          let levels = e.target.player.dashQualityLevels;


          const ul: any = document.getElementById('bitrateLevels');

          let li: any = document.getElementById("quality11");
          li.innerHTML = `${levels[0].height}p`;
          li.setAttribute('height', levels[0].height);
          li.classList.add(`activeMode${0}`);
          li.setAttribute('index', 0);

          li.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li.classList.add('activemode')

          }
          ul.appendChild(li);


          let li1: any = document.getElementById("quality21");
          li1.innerHTML = `${levels[1].height}p`;
          li1.setAttribute('height', levels[1].height);
          li1.classList.add(`activeMode${1}`);
          li1.setAttribute('index', 1);

          li1.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li1.classList.add('activemode')

          }
          ul.appendChild(li1);


          let li2: any = document.getElementById("quality31");
          li2.innerHTML = `${levels[2].height}p`;
          li2.setAttribute('height', levels[2].height);
          li2.classList.add(`activeMode${2}`);
          li2.setAttribute('index', 2);

          li2.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li2.classList.add('activemode')

          }
          ul.appendChild(li2);

          let li9: any = document.getElementById("quality101");
          li9.innerHTML = 'Auto';
          li9.setAttribute('height', 'auto');
          li9.classList.add(`activeModeauto`);
          li9.setAttribute('index', 1);

          li9.onclick = (el: any) => {

            this.bannerPlayer.dashQualityLevelsSelected = el.target.getAttribute('index');
            this.bannerPlayer.trigger('dashQualityLevelsSelected');
            $("#bitrateLevels").hide()
            // $(this).parent().addClass('activemode').siblings().removeClass('activemode5')
            $('ul li.activeModeauto').removeClass('activeModeauto');
            $('ul li.activemode').removeClass('activemode');
            // li.classList.remove('activeMode5')
            li9.classList.add('activemode')

          }
          ul.appendChild(li9);
        });
        setTimeout(() => {
          // $('#quality1').hide()
          // $('#quality2').hide()
          $('#quality41').hide()
          $('#quality51').hide()
          $('#quality61').hide()
          $('#quality71').hide()
          $('#quality81').hide()
          $('#quality91').hide()
        }, 100);
      }

      // }
    })

  }

  skipIntro() {
    this.bannerPlayer.currentTime(this.introSeconds1);
  }

  skipRecap() {
    this.bannerPlayer.currentTime(this.recapSeconds1);
  }

  skipCredit() {
    this.bannerPlayer.currentTime(this.creditSeconds1);
  }

  checkage() {
    // this.agehide = true
    setTimeout(() => {
      // For Anonymous User Start
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      if (this.isLoggedIn != 1) {
        if (this.alldata.is_group == 0) {
          if (this.ageGroup >= 18 && this.ageGroup != 999) {

            $(this.bannerPlayer.posterImage.contentEl()).show();
            this.agepopup();

            this.agehide = true;
            if (this.alldata.drm == 1 && this.alldata.access_type == "paid" && this.isSubsInfo == 1) {
              this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            }
          } else if (this.ageGroup == -1) {
            $(this.bannerPlayer.posterImage.contentEl()).show();
            this.agepopup();

            this.agehide = true;
            if (this.alldata.drm == 1 && this.alldata.access_type == 'paid' && this.isSubsInfo == 1) {
              this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            }
          } else if (this.ageGroup == 999) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                videoJs(`#video-ls`).src({
                  src: this.videourl,
                });
                setTimeout(() => {
                  this.bannerPlayer.play();
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)
            }

            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            // }
          } else {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)
            }

            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            // }
          }

        } else {

          if ((this.ageGroup >= 18) && (this.ageGroup < 999)) {
            $(this.bannerPlayer.posterImage.contentEl()).show();
            this.agepopup();

            this.agehide = true;
          } else if (this.ageGroup == -1) {
            $(this.bannerPlayer.posterImage.contentEl()).show();
            this.agepopup();

            this.agehide = true;
          } else if (this.ageGroup == 999) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {
                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            // }
          } else {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {
                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }


            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            // }
          }
        }

        // For Registered User Start
        if (this.bannerPlayer) {
          this.bannerPlayer.on('loadeddata', () => {
            if (this.bannerPlayer) {
              const tech = this.bannerPlayer.tech({ IWillNotUseThisInPlugins: true });

              if (tech?.hls?.representations) {
                const representations = tech.hls.representations();
                representations.forEach((rep: any) => rep.enabled(true));
              }
            }
          })
        }

      } else if (this.isLoggedIn == 1 && this.isSubsInfo != 1) {
        if (this.alldata.is_group == 0) {
          if (this.ageGroup == 18) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          } else if (this.ageGroup == -1) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          } else if (this.ageGroup == 999) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          } else {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          }

        } else {
          if (this.ageGroup == 18) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          } else if (this.ageGroup == -1) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          } else if (this.ageGroup == 999) {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          } else {
            if (this.alldata.access_type == 'paid') {
              if (this.videourl == '') {
                this.bannerPlayer.load()
                setTimeout(() => {
                  this.bannerPlayer.poster(this.poster)

                }, 500);
              } else {

                this.bannerPlayer = videoJs('video-ls')
                setTimeout(() => {
                  videoJs(`#video-ls`).src({
                    src: this.videourl,
                  });
                  setTimeout(() => {
                    this.bannerPlayer.play();
                  }, 500);
                }, 500);
                this.bannerPlayer.hlsQualitySelector()
              }

            } else {
              this.playUrlOne(this.alldata.id)

            }
            // if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //   this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            //   this.sssss()
            // }
          }
        }

        // For Subscribed User Start
        if (this.bannerPlayer) {
          this.bannerPlayer.on('loadeddata', () => {
            if (this.bannerPlayer) {
              const tech = this.bannerPlayer.tech({ IWillNotUseThisInPlugins: true });

              if (tech?.hls?.representations) {
                const representations = tech.hls.representations();
                representations.forEach((rep: any) => rep.enabled(true));
              }
            }
          })
        }
      } else {
        if (this.alldata.is_group == 0) {
          var parental: any = localStorage.getItem("taploginInfo");
          var parental_read = JSON.parse(parental);
          if (parental_read.is_parental == 1) {


            // if (Number(parental_read.restriction_level) == -1) {
            //   this.setpin();
            // } else if (Number(parental_read.restriction_level) == 999) {
            //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //     this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            //   } else {
            //     this.bannerPlayer = videoJs('video-ls')
            //     videoJs(`#video-ls`).src({
            //       src: this.videourl, // dynamic link
            //     });
            //     setTimeout(() => {
            //       this.bannerPlayer.play();
            //     }, 500);
            //     this.bannerPlayer.hlsQualitySelector();
            //   }
            //   this.playicon = true;
            // } else if (
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(this.alldata.age_group) == 999) ||
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(this.alldata.age_group) == 16)
            // ) {
            //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //     this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            //   } else {
            //     this.bannerPlayer = videoJs('video-ls')
            //     videoJs(`#video-ls`).src({
            //       src: this.videourl, // dynamic link
            //     });
            //     setTimeout(() => {
            //       this.bannerPlayer.play();
            //     }, 500);
            //     this.bannerPlayer.hlsQualitySelector();
            //   }
            //   this.playicon = true;
            // } else if (
            //   Number(parental_read.restriction_level) >= 18 &&
            //   Number(parental_read.restriction_level) < 999
            // ) {
            //   this.setpin();
            // } else if (
            //   Number(parental_read.restriction_level) >= 16 &&
            //   Number(parental_read.restriction_level) < 999 &&
            //   Number(this.alldata.age_group) == 999
            // ) {
            //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //     this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            //   } else {
            //     this.bannerPlayer = videoJs('video-ls')
            //     videoJs(`#video-ls`).src({
            //       src: this.videourl, // dynamic link
            //     });
            //     setTimeout(() => {
            //       this.bannerPlayer.play();
            //     }, 500);
            //     this.bannerPlayer.hlsQualitySelector();
            //   }
            //   $(this.bannerPlayer.posterImage.contentEl()).hide();
            //   this.playicon = true;
            // } else {
            //   this.setpin();
            // }
            if (Number(parental_read.restriction_level) == -1) {
              this.playicon = false;
              this.setpin();
            } else if (Number(parental_read.restriction_level) == 999) {

              if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
              } else {
                this.playUrlOne(this.alldata.id)
                this.playicon = true;
              }

            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(this.alldata.age_group) == 999) {
                if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                  this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
                } else {
                  this.playUrlOne(this.alldata.id)
                  this.playicon = true;
                }

              } else if (Number(this.alldata.age_group) >= Number(parental_read.restriction_level) || Number(this.alldata.age_group) == -1) {

                this.playicon = false;
                this.setpin();
              } else {
                if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                  this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
                } else {
                  this.playUrlOne(this.alldata.id)
                  this.playicon = true;
                }

              }
            }

          } else {
            if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
              this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);

            } else {
              this.playUrlOne(this.alldata.id)
            }
          }

        } else {
          var parental: any = localStorage.getItem("taploginInfo");
          var parental_read = JSON.parse(parental);
          if (parental_read.is_parental == 1) {


            // if (Number(parental_read.restriction_level) == -1) {
            //   this.setpin();
            // } else if (Number(parental_read.restriction_level) == 999) {
            //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //     this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            //   } else {
            //     this.bannerPlayer = videoJs('video-ls')
            //     videoJs(`#video-ls`).src({
            //       src: this.videourl, // dynamic link
            //     });
            //     setTimeout(() => {
            //       this.bannerPlayer.play();
            //     }, 500);
            //     this.bannerPlayer.hlsQualitySelector();
            //   }
            //   this.playicon = true;
            // } else if (
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(this.alldata.age_group) == 999) ||
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(this.alldata.age_group) == 16)
            // ) {
            //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //     this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            //   } else {
            //     this.bannerPlayer = videoJs('video-ls')
            //     videoJs(`#video-ls`).src({
            //       src: this.videourl, // dynamic link
            //     });
            //     setTimeout(() => {
            //       this.bannerPlayer.play();
            //     }, 500);
            //     this.bannerPlayer.hlsQualitySelector();
            //   }
            //   this.playicon = true;
            // } else if (
            //   Number(parental_read.restriction_level) >= 18 &&
            //   Number(parental_read.restriction_level) < 999
            // ) {
            //   this.setpin();
            // } else if (
            //   Number(parental_read.restriction_level) >= 16 &&
            //   Number(parental_read.restriction_level) < 999 &&
            //   Number(this.alldata.age_group) == 999
            // ) {
            //   if (this.alldata.drm == 1 && this.videourl.includes("mpd")) {
            //     this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type);
            //   } else {
            //     this.bannerPlayer = videoJs('video-ls')
            //     videoJs(`#video-ls`).src({
            //       src: this.videourl, // dynamic link
            //     });
            //     setTimeout(() => {
            //       this.bannerPlayer.play();
            //     }, 500);
            //     this.bannerPlayer.hlsQualitySelector();
            //   }
            //   $(this.bannerPlayer.posterImage.contentEl()).hide();
            //   this.playicon = true;
            // } else {
            //   this.setpin();
            // }

            if (Number(parental_read.restriction_level) == -1) {
              this.playicon = false;
              this.setpin();
            } else if (Number(parental_read.restriction_level) == 999) {

              if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
              } else {
                this.playicon = true;
                this.playUrlOne(this.alldata.id)
              }

            } else if (Number(parental_read.restriction_level) < 999) {

              if (Number(this.alldata.age_group) == 999) {

                if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                  this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
                } else {
                  this.playUrlOne(this.alldata.id)
                  this.playicon = true;

                }

              } else if (Number(this.alldata.age_group) >= Number(parental_read.restriction_level) || Number(this.alldata.age_group) == -1) {

                this.playicon = false;
                this.setpin();
              } else {
                if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                  this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
                } else {
                  this.playUrlOne(this.alldata.id)
                  this.playicon = true;

                }

              }
            }
          } else {
            if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {

              this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
            } else {
              this.playUrlOne(this.alldata.id)


            }
          }

        }
        if (this.bannerPlayer) {
          this.bannerPlayer.on('loadeddata', () => {
            if (this.bannerPlayer) {
              const tech = this.bannerPlayer.tech({ IWillNotUseThisInPlugins: true });

              if (tech?.hls?.representations) {
                const representations = tech.hls.representations();
                representations.forEach((rep: any) => rep.enabled(true));
              }
            }
          })
        }
      }
      this.bannerPlayer.on('loadeddata', () => {
        // let languageNames = new Intl.DisplayNames([], { type: 'language' });

        // const audioTrackList = this.bannerPlayer.audioTracks();
        // // const audioTrackList = this.player.audioTracks();
        // for (let i = 0; i < audioTrackList.length; i++) {
        //   const element = audioTrackList[i];
        //   element.label = "English"
        //   //player..selectedIndex.label = "English"
        //   // player.audioTracks[i].label = "English";
        // }
        //
        var tracks = this.bannerPlayer.textTracks();
        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          // Find the English captions track and mark it as "showing".
          if (track.language === 'en' || 'eng') {
            // track.mode = 'showing';
            track.label = 'English';
          }
        }
        //text track
      })



    }, 500);

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
            this.bannerPlayer.ima(this.options1);
            this.bannerPlayer.ima.initializeAdDisplayContainer();
          } else {

            this.bannerPlayer.ima.changeAdTag(getAdGoogle.subscribed[0].tags);
            setTimeout(() => {
              this.bannerPlayer.ima.requestAds();
            }, 1000);
          }
          // this.bannerPlayer.muted(false);
          // this.bannerPlayer.volume(1);
          // google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true)

          var removeStyle = document.getElementById('video-ls_ima-ad-container')
          removeStyle?.removeAttribute("style");

        } else {
          this.bannerPlayer.volume(0);
        }
      } else if (this.user && this.isSubsInfo != 1 && dataPopup.Player[0].google_ads.registered == 1) {
        if (getAdGoogle.register.length != 0) {
          // this.bannerPlayer.muted(false);
          // this.bannerPlayer.volume(1);
          if (this.adFirstTime == true) {
            this.options1 = {
              adTagUrl: getAdGoogle.register[0].tags
            };

            this.bannerPlayer.ima(this.options1);
            this.bannerPlayer.ima.initializeAdDisplayContainer();
          } else {
            this.bannerPlayer.ima.changeAdTag(getAdGoogle.register[0].tags);
            setTimeout(() => {
              this.bannerPlayer.ima.requestAds();
            }, 1000);

          }
          var removeStyle = document.getElementById('video-ls_ima-ad-container')
          removeStyle?.removeAttribute("style");
          // google.ima.settings.setDisableCustomPlaybackForIOS10Plus(true)
        } else {
          this.bannerPlayer.volume(0);
        }
      } else if (!this.user && this.isSubsInfo != 1 && dataPopup.Player[0].google_ads.guest == 1) {
        if (getAdGoogle.guest.length != 0) {
          // this.bannerPlayer.muted(false);
          // this.bannerPlayer.volume(1);
          if (this.adFirstTime == true) {
            this.options1 = {
              adTagUrl: getAdGoogle.guest[0].tags
            };

            this.bannerPlayer.ima(this.options1);
            this.bannerPlayer.ima.initializeAdDisplayContainer();
          } else {
            this.bannerPlayer.ima.changeAdTag(getAdGoogle.guest[0].tags);
            setTimeout(() => {
              this.bannerPlayer.ima.requestAds();
            }, 1000);
          }
          var removeStyle = document.getElementById('video-ls_ima-ad-container')
          removeStyle?.removeAttribute("style");
        } else {
          this.bannerPlayer.volume(0);
        }
      } else {
        this.bannerPlayer.volume(0);
      }
    } else {
      this.bannerPlayer.volume(0);
    }

    this.adFirstTime = false;
  }

  // rentalBuy() {
  //   if (this.isLoggedIn == 1) {
  //     this.ds.rentalApi(this.alldata.rental).subscribe((res: any) => {
  //       if (res.code == 1) {
  //         this.DEC_SER.getDecryptedData(res?.result);
  //         let decryptData = JSON.parse(this.DEC_SER.decryptData);


  //         localStorage.setItem('packcheking', '1')
  //         let pkgData = {
  //           'level': decryptData.package_list[0].s_package.p_price || '',
  //           'pkdId': decryptData.package_list[0].s_package.package_id || '',
  //           'discount': '',
  //           'coupon_code': '',
  //           'month': decryptData.package_list[0].s_package.period_interval + ' ' + decryptData.package_list[0].s_package.period || '',
  //           'currency': decryptData.package_list[0].s_package.p_currency || '',
  //           'mode': 'RENTAL',
  //         };
  //         localStorage.setItem('pkgData', JSON.stringify(pkgData))
  //         this.router.navigate(["/subscribe"]);
  //       }
  //     })
  //   } else {
  //     const dialogRef = this.dialog.open(LoginModalDialogComponent, {
  //       backdropClass: 'popupBackdropClass',
  //       panelClass: 'logindialog',
  //       width: "520px",
  //       disableClose: true,
  //       data: { name: "login" },
  //     });
  //   }
  // }

  playEpisode(episodedata: any, epidata: any) {
    var parental: any = localStorage.getItem("taploginInfo");
    var parental_read = JSON.parse(parental);
    var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
    if (ottLogged == "1") {
      if (parental_read?.is_parental == 0) {
        this.playEpisiodeData(episodedata, epidata)
      } else {
        if (parental_read?.is_parental == 1) {
          if (Number(parental_read.restriction_level) == -1) {
            this.setPinEpisode(episodedata, epidata)
          } else if (Number(parental_read.restriction_level) == 999) {
            this.playEpisiodeData(episodedata, epidata)
          } else if (Number(parental_read.restriction_level) < 999) {
            if (episodedata.age_group == 999) {
              this.playEpisiodeData(episodedata, epidata)
            } else if (episodedata.age_group >= Number(parental_read.restriction_level) || episodedata.age_group == -1) {
              this.setPinEpisode(episodedata, epidata)
            } else {
              this.playEpisiodeData(episodedata, epidata)
            }
          }
        } else {
          this.playEpisiodeData(episodedata, epidata)
        }
      }
    } else {
      this.playEpisiodeData(episodedata, epidata)
    }

  }

  setPinEpisode(episodedata: any, epidata: any) {
    this.bannerPlayer.exitFullscreen()
    this.bannerPlayer.pause()
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      document.body.style.overflow = 'auto'
      this.bannerPlayer.play()
      this.bannerPlayer.requestFullscreen()
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.playEpisiodeData(episodedata, epidata)
      }
      this.bannerPlayer.requestFullscreen()
    });
  }


  analyticsVideo(alldataVideo: any) {
    let allAnalytics: any = localStorage.getItem('ipSaveData')
    let allAnalyticsData = JSON.parse(allAnalytics)

    if (this.alldata.category_ids[0] == '' || this.alldata.category_ids[0] == null) {
      this.cat_iid = '';
    } else {
      this.cat_iid = this.alldata.category_ids[0];
    }
    const userInfo: any = localStorage.getItem("taploginInfo");
    if (JSON.parse(userInfo)?.gender == "") {
      this.session_gender = 'others'
    } else {
      this.session_gender = JSON.parse(userInfo)?.gender
    }
    if (this.alldata.is_group == 1) {


      let analytics: any = {
        c_id: this.videosrc[this.itemget].sources[0].id,
        dod: "",
        dd: "",
        type: this.alldata.is_live == '1' ? 1 : 2,
        content_title: this.videosrc[this.itemget].sources[0].title,
        total_duration: alldataVideo.duration,
        pd: Math.floor(this.bannerPlayer.cache_.currentTime),
        // cat_id: this.data.category_ids[0],
        cat_id: this.cat_iid,
        // age_group: "",
        gender: this.session_gender,
        network_provider: allAnalyticsData?.connection?.isp,
        customer_name: JSON.parse(userInfo)?.first_name ? JSON.parse(userInfo)?.first_name : "user",
        impression: 0
      };
      analytics.dod = `{ "os_version": "${allAnalyticsData?.userAgent?.browserVersion}", "app_version": "2.8", "network_type": "${allAnalyticsData?.connection?.type}", "network_provider": "${allAnalyticsData?.connection?.isp}" }`;
      analytics.dd = `{ "make_model": "${this.deviceService?.browser}", "os": "${this.deviceService?.os}", "manufacturer": "${this.deviceService?.deviceType}", "screen_resolution": "${window?.innerWidth} * ${window?.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo)?.id);
      formData.append("country", allAnalyticsData?.countryName);
      formData.append("country_code", allAnalyticsData?.countryCode);
      formData.append("city", allAnalyticsData?.city);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
    } else {

      const userInfo: any = localStorage.getItem("taploginInfo");
      let analytics: any = {
        c_id: alldataVideo.id,
        dod: "",
        dd: "",
        type: this.alldata.is_live == '1' ? 1 : 2,
        content_title: alldataVideo.title,
        total_duration: alldataVideo.duration,
        pd: Math.floor(this.bannerPlayer.cache_.currentTime),
        // cat_id: this.data.category_ids[0],
        cat_id: this.cat_iid,
        // age_group: "",
        gender: this.session_gender,
        network_provider: allAnalyticsData?.connection?.isp,
        customer_name: JSON.parse(userInfo)?.first_name ? JSON.parse(userInfo)?.first_name : "user",
        impression: 0
      };
      analytics.dod = `{ "os_version": "${allAnalyticsData?.userAgent?.browserVersion}", "app_version": "2.8", "network_type": "${allAnalyticsData?.connection?.type}", "network_provider": "${allAnalyticsData?.connection?.isp}" }`;
      analytics.dd = `{ "make_model": "${this.deviceService?.browser}", "os": "${this.deviceService?.os}", "manufacturer": "${this.deviceService?.deviceType}", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo)?.id);
      formData.append("country", allAnalyticsData?.countryName);
      formData.append("country_code", allAnalyticsData?.countryCode);
      formData.append("city", allAnalyticsData?.city);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
    }


  }

  playEpisiodeData(episodedata: any, epidata: any) {
    if (episodedata.is_ad == 1) {
      window.open(episodedata.ad_url);
    } else {
      this.itemget = epidata;

      $(".moveToVideoJs").show();
      setTimeout(() => {
        $(".moveToVideoJs").hide();
      }, 5000);
      if (this.itemget == 0) {
        $('.vjs-icon-previous-item').prop('disabled', true);
        $('.vjs-icon-previous-item').css('opacity', '0.5');
      }

      if (this.videosrc.length - 1 != this.itemget) {
        $('.vjs-icon-next-item').prop('disabled', false);
        $('.vjs-icon-next-item').css('opacity', '1.0');
      }

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
        this.bannerPlayer = videoJs("video-ls");
        this.adFirstTime = false;
        this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
        if (episodedata.sprite_url != null) {
          this.drm(
            episodedata.id,
            episodedata.k_id,
            episodedata.url,
            episodedata.access_type,
            episodedata.sprite_url.web
          );
        } else {
          this.drm(
            episodedata.id,
            episodedata.k_id,
            episodedata.url,
            episodedata.access_type,
            ""
          );
        }

        this.bannerPlayer.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            if (episodedata.sprite_url != null) {
              this.drm(
                episodedata.id,
                episodedata.k_id,
                episodedata.url,
                episodedata.access_type,
                episodedata.sprite_url.web
              );
            } else {
              this.drm(
                episodedata.id,
                episodedata.k_id,
                episodedata.url,
                episodedata.access_type,
                ""
              );
            }

          });
        })


        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: `${episodedata.season_number} ${episodedata.episode_number} : ${episodedata.title}`,
              align: "center",
            },
          ],
        });

        this.ds.getDescriptionData(episodedata.id).subscribe((res: any) => {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.setShowdetailData.emit(decryptData);
        })
      } else if (episodedata.drm == 0 && episodedata.access_type == 'free') {
        this.getm3u8(episodedata.id)
        setTimeout(() => {
          this.bannerPlayer.src({
            src: this.mainm3u8,
            spriteThumbnails: {
              url: episodedata.sprite_url.web,
            },
          })

          if (episodedata.sprite_url != "") {
            this.bannerPlayer.spriteThumbnails({
              interval: 5,
              url: episodedata.sprite_url.web,
              width: 224,
              height: 127,
              responsive: 600,
            });
          }

          this.bannerPlayer.on('ads-manager', (response: any) => {
            var adsManager = response.adsManager;
            adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
              this.getm3u8(episodedata.id)
              this.bannerPlayer.src({
                src: this.mainm3u8,
                spriteThumbnails: {
                  url: episodedata.sprite_url.web,
                },
              })

              if (episodedata.sprite_url != "") {
                this.bannerPlayer.spriteThumbnails({
                  interval: 5,
                  url: episodedata.sprite_url.web,
                  width: 224,
                  height: 127,
                  responsive: 600,
                });
              }

            });
          })

          this.bannerPlayer.overlay({
            overlays: [
              {
                start: "playing",
                content: `${episodedata.season_number} ${episodedata.episode_number} : ${episodedata.title}`,
                align: "center",
              },
            ],
          });

          setTimeout(() => {
            this.adFirstTime = false;
            this.adGoogle(this.videosrc[this.itemget].sources[0].adUrls)
            this.bannerPlayer.play()
          }, 200);
        }, 500);
        this.ds.getDescriptionData(episodedata.id).subscribe((res: any) => {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.setShowdetailData.emit(decryptData);
        })
      } else {

        this.mat.closeAll();
        this.router.navigate(["/subscribe"]);
      }

      // 
    }
    if (episodedata.skip_duration.length != 0) {
      this.skipTime(episodedata.skip_duration)
    }
    setTimeout(() => {
      this.bannerPlayer.on("timeupdate", () => {

        if (
          Math.floor(this.bannerPlayer.currentTime()) == this.introSeconds
        ) {

          $(".title").show();
        } else if (
          Math.floor(this.bannerPlayer.currentTime()) >=
          this.introSeconds1 ||
          Math.floor(this.bannerPlayer.currentTime()) <= this.introSeconds
        ) {
          $(".title").hide();
        }

        if (
          Math.floor(this.bannerPlayer.currentTime()) == this.recapSeconds
        ) {
          $("#titleTwo").appendTo($('#video-ls'));
          $(".title1").show();
        } else if (
          Math.floor(this.bannerPlayer.currentTime()) >=
          this.recapSeconds1 ||
          Math.floor(this.bannerPlayer.currentTime()) <= this.recapSeconds
        ) {
          $(".title1").hide();
        }

        if (
          Math.floor(this.bannerPlayer.currentTime()) == this.creditSeconds
        ) {
          $("#titleThree").appendTo($('#video-ls'));
          $(".title2").show();
        } else if (
          Math.floor(this.bannerPlayer.currentTime()) >=
          this.creditSeconds1 ||
          Math.floor(this.bannerPlayer.currentTime()) <= this.creditSeconds
        ) {
          $(".title2").hide();
        }
      });
    }, 1000);
  }

  forGuestReantalPin() {

    setTimeout(() => {
      this.flickring = false
      setTimeout(() => {
        if (this.bannerPlayer) {
          this.bannerPlayer.pause();
          $(this.bannerPlayer.posterImage.contentEl()).show();
        }
      }, 500);

      const dialogRef = this.dialog.open(ChechPinParentalComponent, {
        panelClass: "contactfooter",
        width: "390px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow = 'auto'
      });
      const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
        this.successs = e;
        if (this.successs) {
          setTimeout(() => {
            this.flickring = true
          }, 1000);


          if (this.alldata.rental == 0) {
            this.checkage()
          } else {
            if (this.alldata.rentalPurchased == 1) {
              if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
                this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
              } else {
                this.playUrlOne(this.alldata.id)


              }
            } else {
              this.checkage();
            }
          }
          $(this.bannerPlayer.posterImage.contentEl()).hide();
          this.playicon = true;
        }
      });
    }, 1000);

  }

  forGuestRental() {
    var parental: any = localStorage.getItem("taploginInfo");
    var parental_read = JSON.parse(parental);
    if (parental_read.is_parental == 1) {
      this.rentalIcon = true;
      if (Number(parental_read.restriction_level) == -1) {
        this.playicon = false;
        this.forGuestReantalPin()
      } else if (Number(parental_read.restriction_level) == 999) {
        this.bannerPlayer = videoJs('video-ls')
        setTimeout(() => {
          videoJs(`#video-ls`).src({
            src: this.alldata.trailer_url,
          });
          setTimeout(() => {
            this.bannerPlayer.play();
          }, 500);
        }, 500);
        this.bannerPlayer.hlsQualitySelector()
        setTimeout(() => {
          this.hideicon = false;
        }, 2000);
      } else if (Number(parental_read.restriction_level) < 999) {
        if (Number(this.alldata.age_group) == 999) {
          this.bannerPlayer = videoJs('video-ls')
          setTimeout(() => {
            videoJs(`#video-ls`).src({
              src: this.alldata.trailer_url,
            });
            setTimeout(() => {
              this.bannerPlayer.play();
            }, 500);
          }, 500);
          this.bannerPlayer.hlsQualitySelector()
          setTimeout(() => {
            this.hideicon = false;
          }, 2000);
        } else if (Number(this.alldata.age_group) >= Number(parental_read.restriction_level) || Number(this.alldata.age_group) == -1) {
          this.playicon = false;
          this.forGuestReantalPin()
        } else {
          this.bannerPlayer = videoJs('video-ls')
          setTimeout(() => {
            videoJs(`#video-ls`).src({
              src: this.alldata.trailer_url,
            });
            setTimeout(() => {
              this.bannerPlayer.play();
            }, 500);
          }, 500);
          this.bannerPlayer.hlsQualitySelector()
          setTimeout(() => {
            this.hideicon = false;
          }, 2000);
        }
      }

    } else {
      if (this.alldata.rentalPurchased == 1) {
        if (this.alldata.drm == 1 && this.alldata.access_type == 'paid') {
          this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
        } else {
          this.playUrlOne(this.alldata.id)


        }
      } else {
        this.checkage();
      }
    }
  }

  forSubscribeRentalPin() {
    this.flickring = false
    setTimeout(() => {
      this.muted = true
    }, 100);

    setTimeout(() => {
      if (this.bannerPlayer) {
        this.bannerPlayer.pause();
        $(this.bannerPlayer.posterImage.contentEl()).show();
      }
    }, 500);

    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = 'auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;
      if (this.successs) {
        setTimeout(() => {
          this.flickring = true
        }, 1000);

        this.bannerPlayer = videoJs('video-ls')
        setTimeout(() => {
          videoJs(`#video-ls`).src({
            src: this.alldata.trailer_url,
          });
          setTimeout(() => {
            this.bannerPlayer.play();
          }, 500);
          this.bannerPlayer.hlsQualitySelector()
        }, 500);

        setTimeout(() => {
          this.hideicon = false;
        }, 2000);
        $(this.bannerPlayer.posterImage.contentEl()).hide();
        this.playicon = true;
      }
    });
  }

  forguestWithoutParental() {

  }

  forSubscribeRental() {
    var parental: any = localStorage.getItem("taploginInfo");
    var parental_read = JSON.parse(parental);
    if (parental_read.is_parental == 1) {
      if (Number(parental_read.restriction_level) == -1) {
        this.playicon = false;
        this.forSubscribeRentalPin();
      } else if (Number(parental_read.restriction_level) == 999) {
        this.bannerPlayer = videoJs('video-ls')
        setTimeout(() => {
          videoJs(`#video-ls`).src({
            src: this.alldata.trailer_url,
          });
          setTimeout(() => {
            this.bannerPlayer.play();
          }, 500);
        }, 500);
        this.bannerPlayer.hlsQualitySelector()
        setTimeout(() => {
          this.hideicon = false;
        }, 2000);
      } else if (Number(parental_read.restriction_level) < 999) {
        if (Number(this.alldata.age_group) == 999) {
          this.bannerPlayer = videoJs('video-ls')
          setTimeout(() => {
            videoJs(`#video-ls`).src({
              src: this.alldata.trailer_url,
            });
            setTimeout(() => {
              this.bannerPlayer.play();
            }, 500);
          }, 500);
          this.bannerPlayer.hlsQualitySelector()
          setTimeout(() => {
            this.hideicon = false;
          }, 2000);
        } else if (Number(this.alldata.age_group) >= Number(parental_read.restriction_level) || Number(this.alldata.age_group) == -1) {
          this.playicon = false;
          this.forSubscribeRentalPin();
        } else {
          this.bannerPlayer = videoJs('video-ls')
          setTimeout(() => {
            videoJs(`#video-ls`).src({
              src: this.alldata.trailer_url,
            });
            setTimeout(() => {
              this.bannerPlayer.play();
            }, 500);
          }, 500);
          this.bannerPlayer.hlsQualitySelector()
          setTimeout(() => {
            this.hideicon = false;
          }, 2000);
        }
      }

    } else {
      this.bannerPlayer = videoJs('video-ls')
      setTimeout(() => {
        videoJs(`#video-ls`).src({
          src: this.alldata.trailer_url,
        });
        setTimeout(() => {
          this.bannerPlayer.play();
        }, 500);
      }, 500);
      this.bannerPlayer.hlsQualitySelector()
      setTimeout(() => {
        this.hideicon = false;
      }, 2000);
    }
  }

  adUrl() {
    this.ds.getAdsApi().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.findAd = true;
        localStorage.setItem('AdUrl', JSON.stringify(decryptData))
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ended = false
    this.hideicon = true
    this.playing = false
    this.isReplay = false;
    this.isTrailerPlaying = false

    $(".vjs-overlay").hide();
    if (this.alldata.is_group == 1 && this.alldata.access_type == 'free') {
      setTimeout(() => {
        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.season_number} ${this.alldata.episode_number} : ${this.alldata.title}`),
              align: "center",
            },
          ],
        });
      }, 1000);

    } else if (this.alldata.is_group == 1 && this.alldata.access_type == 'paid' && this.isSubscribed == true) {
      setTimeout(() => {
        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.season_number} ${this.alldata.episode_number} : ${this.alldata.title}`),
              align: "center",
            },
          ],
        });
      }, 1000);

    }
    else if (this.alldata.is_group == 1 && this.alldata.access_type == 'paid' && this.isSubscribed == false) {
      this.isTrailerPlaying = true
      setTimeout(() => {

        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.series_title} ${this.alldata.season_title} Trailer`),
              align: "center",
            },
          ],
        });

      }, 1000);

    }
    else if (this.alldata.is_group == 0 && this.alldata.access_type == 'free') {
      setTimeout(() => {
        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.title}`),
              align: "center",
            },
          ],
        });
      }, 1000);

    }
    else if (this.alldata.is_group == 0 && this.alldata.access_type == 'paid' && this.isSubscribed == false) {
      this.isTrailerPlaying = true
      setTimeout(() => {

        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.title} Trailer`),
              align: "center",
            },
          ],
        });

      }, 1000);

    }
    else if (this.alldata.is_group == 0 && this.alldata.access_type == 'paid' && this.isSubscribed == true) {
      // this.isAdPlaying = false;
      setTimeout(() => {
        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.title}`),
              align: "center",
            },
          ],
        });
      }, 1000);

    } else if (this.alldata.is_group == 0 && this.alldata.access_type == 'paid' && this.isSubscribed == false) {
      this.isTrailerPlaying = true
      setTimeout(() => {
        this.bannerPlayer.overlay({
          overlays: [
            {
              start: "playing",
              content: (`${this.alldata.title}`),
              align: "center",
            },
          ],
        });
      }, 1000);

    }

    $(".vjs-overlay-center").hide();
    if (changes["alldata"]) {
      if (this.ageGroup) {
        if (this.isSubsInfo == 1) {
          if (this.alldata.rental == 0) {
            this.checkage()
          } else {
            if (this.alldata.rentalPurchased != 1) {
              this.forSubscribeRental()
            } else {
              this.checkage()
            }
          }
        } else if (this.isLoggedIn == 1 && this.isSubsInfo != 1) {
          this.forGuestRental()
        } else {
          setTimeout(() => {
            this.checkage()
          }, 300);
        }

        const popup: any = localStorage.getItem('faqData');
        const dataPopup: any = JSON.parse(popup);
        if (dataPopup.Player[0].google_ads.is_allow == 1) {
          if (this.videourl != '') {
            this.adGoogle(this.alldata.adUrls)
            this.adUrl()
          } else {
            if (this.bannerPlayer.ima) {
              this.bannerPlayer.ima.changeAdTag("");
              this.bannerPlayer.ima.requestAds();
            }

          }

        }

        // 
        // 
        // if (parental_read?.is_parental == 1 && this.isSubsInfo == 1) {
        //   this.checkage()
        // } else if (parental_read?.is_parental == 1 && this.isSubsInfo != 1) {
        //   this.rentalIcon = true;
        //   if (this.alldata.rentalPurchased == 1) {
        //     this.forRental()
        //   } else {
        //     if (Number(parental_read.restriction_level) == -1) {
        //       this.playicon = false;
        //       this.forRentalPinGuest();
        //     } else if (Number(parental_read.restriction_level) == 999) {
        //       this.checkage()
        //     } else if (Number(parental_read.restriction_level) < 999) {
        //       if (Number(this.alldata.age_group) == 999) {
        //         this.checkage()
        //       } else if (Number(this.alldata.age_group) >= Number(parental_read.restriction_level) || Number(this.alldata.age_group) == -1) {
        //         this.playicon = false;
        //         this.forRentalPinGuest();
        //       } else {
        //         this.checkage()
        //       }
        //     }
        //   }
        // } else {
        //   if (this.alldata.rental != 0 && this.alldata.rentalPurchased == 1) {
        //     if (this.isLoggedIn == 1 && this.isSubsInfo != 1) {
        //       this.drm(this.alldata.id, this.alldata.k_id, this.alldata.url, this.alldata.access_type, this.alldata.sprite_url.web);
        //     } else if (this.isLoggedIn != 1) {
        //       this.checkage()
        //     } else {
        //       this.checkage()
        //     }
        //   } else if (this.alldata.rental == 0) {
        //     this.checkage();
        //   } else if (this.alldata.rental != 0 && this.alldata.rentalPurchased == 0) {
        //     if (this.isLoggedIn == 1 && this.isSubsInfo != 1) {
        //       this.bannerPlayer = videoJs('video-ls')
        //       setTimeout(() => {
        //         videoJs(`#video-ls`).src({
        //           src: this.alldata.trailer_url,
        //         });
        //         setTimeout(() => {
        //           this.bannerPlayer.play();
        //         }, 500);
        //       }, 500);
        //       this.bannerPlayer.hlsQualitySelector()
        //       setTimeout(() => {
        //         this.hideicon = false;
        //       }, 2000);
        //     } else if (this.isLoggedIn != 1) {
        //       this.checkage()
        //     } else {
        //       this.forRental()
        //     }
        //   }
        // }



        this.getEpisode12()
        this.checked = this.alldata.season_id;
        if (this.alldata.is_group == 1) {
          this.itemget = this.alldata.index - 1;

          if (this.itemget == 0) {
            $('.vjs-icon-previous-item').prop('disabled', true);
            $('.vjs-icon-previous-item').css('opacity', '0.5');
          }

          if (this.videosrc.length - 1 != this.itemget) {
            $('.vjs-icon-next-item').prop('disabled', false);
            $('.vjs-icon-next-item').css('opacity', '1.0');
          }

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

          setTimeout(() => {
            $('#titleOne').appendTo('#video-ls')
            $('#titleTwo').appendTo('#video-ls')
            $('#titleThree').appendTo('#video-ls')
          }, 1000);
        }

        if ((this.isLoggedIn == 1 && this.alldata.access_type == 'free') || this.isSubsInfo == 1) {
          // this.analyticsVideo(this.alldata)
        }

      }

      this.ended = false;
      setTimeout(() => {
        this.bannerPlayer.poster(this.poster)
      }, 0);


      setTimeout(() => {
        // if (this.isSubscribed == true) {
        //   if (this.alldata.drm == 1 && this.alldata.access_type == "paid") {
        //     $('.vjs-icon-hd-main').show()
        //     $('.vjs-quality-selector').hide()
        //   } else {
        //     $('.vjs-quality-selector').show()
        //     $('.vjs-icon-hd-main').hide()

        //   }
        // }

      }, 1500);
    }

  }


  ngOnDestroy(): void {
    $(".vjs-overlay").hide();
    if (this.bannerPlayer) {
      if ((this.isLoggedIn == 1 && this.alldata.access_type == "free") || this.isSubsInfo == 1) {
        // this.analyticsVideo(this.alldata)
      }
      this.bannerPlayer = null;
      // this.bannerPlayer.dispose();
      delete videoJs.getPlayers()[`video-ls`];
    }
  }
}