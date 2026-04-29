import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DeviceDetectorService } from "ngx-device-detector";
import { map } from "rxjs";
import { VideoJsOptions } from "src/app/shared/models/videojs-options";
import { DataService } from "../services/data.service";
import { DecryptService } from "../services/decrypt.service";
import { ExchangeDataService } from "../services/exchange-data.service";
import { FingerPrintService } from "../services/finger-print.service";
import CustomVideoJsComponent from "./custom-video-js-components";
import "videojs-contrib-ads";
import "videojs-ima";
import "./notes-plugin";
import "./sprites-plugin";
import { videoJs } from "./videojs";
import { Router } from "@angular/router";
import * as firebase from "firebase/app";
require("video.js");
import { IosDecrycptionService } from "../services/ios-decrycption.service";
import { AuthService } from "../services/auth.service";
import { FunctionCallingService } from "../services/function-calling.service";
import { ParentalOtpCreateComponent } from "../shared/dialogBoxes/parental-otp-create/parental-otp-create.component";
import { settings } from "cluster";
import { AnalyticsService } from "../services/analytics.service";
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
  selectedId: any
  @ViewChild("slickModal") slickModal: any;
  [x: string]: any;
  user: any;
  token: any;
  introSeconds!: number;
  introSeconds1!: number;
  recapSeconds!: number;
  recapSeconds1!: number;
  checked: any;
  creditSeconds!: number;
  rentalData: any = []
  creditSeconds1!: number;
  contentPlaybackEnded: any;
  getLanguage: any;
  getTextTrack: any
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
  getCurrentPlay: number = 0;
  isOttLoggedIn = false;
  display_offset: number = 0;
  inactivityTimeout: any;
  title: any;
  showepisode: boolean = false;
  userId: any;
  agetime: boolean = true;
  gg: any = [];
  subtitleurl: any;
  getUserText: any
  free_preview: any;
  free_preview_duration: any;
  mainelement: any;
  countryAllowed: any = [];
  options1: any;
  val: any = [];
  tarilerPlay = localStorage.getItem("tarilerplay") || {};
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  videosrc: any = [];
  maxcounter: any;
  watermark: any;
  lBandShow: any;
  junk = false;
  getBrowserName: any
  p: any;
  getSelctText: any
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
  getSelctAudio: any
  adFirstTime: boolean = true;
  adUrlLoop: any
  mainUrl: any
  playDuration: any
  lbandTemp: boolean = true;
  replayFlag: boolean = false;
  LBandTitle: any
  getid: any;
  @Input() data: any;
  @Input() trailerUrlPlay: any;
  defaultImages: any = [];
  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  EpiData: any;
  randomInter: any
  getUserAudio: any
  config: any;
  connected: boolean = true;
  npawType: any
  buttonNextDisable: any
  buttonPrevDisable: any
  speedValue: number = 1;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkOrientation();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
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
  }

  constructor(
    private ed: ExchangeDataService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    private ds: DataService,
    private DEC_SER: DecryptService,
    private router: Router,
    private mat: MatDialog,
    private DEC_SER_IOS: IosDecrycptionService,
    private auth: AuthService,
    private fcs: FunctionCallingService,
    private dialog: MatDialog,
    private analyticsService: AnalyticsService
  ) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;
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
          this.slickModal.slickGoTo(this.itemget - 1);
        });
      }

      $(".vjs-notes-btn").click(() => {
        this.slickModal.unslick();
        $(".episodeSelector").appendTo($("#video-player"));
        this.slickModal.initSlick(this.slideConfig);
        $(".episodeSelector").show();
        this.slickModal.slickGoTo(this.itemget - 1);
        console.log($('.slick-carousel'));
      });
    }, 2000);
  }

  ngOnInit(): void {
    this.jsondata()
    this.getBrowserName = this.detectBrowserName()
    setTimeout(() => {
      if (this.data.is_group == 1) {
        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: `${this.data.title}`,
              align: "center",
            },
          ],
        });
      } else if (this.data.is_group == 0) {
        this.player.overlay({
          overlays: [
            {
              start: "playing",
              content: `${this.data.title}`,
              align: "center",
            },
          ],
        });
      }
      this.selectedId = this.data.id
    }, 1000);

    setTimeout(() => {
      $(".vjs-notes-btn").attr("title", "Season-Selector");
      $(".vjs-icon-hd").attr("title", "Settings");
      $(".vjs-icon-hd-main").attr("title", "Settings");


    }, 1000);

    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
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
      this.maxcounter = 100
    }

    if (this.getBrowserName != 'safari') {
      if (this.data.drm == 0) {
        this.getm3u8Url(this.data.id);
      }
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
            //landscape-specific logic
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
            //portrait-specific logic
          }
        }, 1000);
      }
    }

  }

  getEpisode(event: any, seasonCount: any) {
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
            console.log(this.EpiData);

            this.EpiData.forEach((element: any) => {
              this.EpiData.map((category: any) => {
                category.sliderImg = "";
                category.sliderIdentifier = "";

                if (category.is_group == 1) {
                  if (category.layout_thumbs != null) {
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
                  } else {
                    if (category.groupInfo.global_thumb.length != 0) {
                      category.groupInfo.global_thumb.forEach((thumb: any) => {
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
                    }
                  }
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
                      package_mode: element.package_mode
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

  getm3u8Url(id: any) {
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this.ds.getMainUrl(id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            console.log(decryptData);
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                this.m3u8Main = decryptData.fairplay_url;
              } else {
                this.m3u8Main = decryptData.url;
              }

            } else {
              this.m3u8Main = decryptData.url;
            }
            this.playDuration = decryptData.played_duration;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
            this.player.src({
              src: this.m3u8Main,
            })
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
        this.ds.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            console.log(decryptData);
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                this.m3u8Main = decryptData.fairplay_url;
              } else {
                this.m3u8Main = decryptData.url;
              }

            } else {
              this.m3u8Main = decryptData.url;
            }
            this.playDuration = decryptData.played_duration;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
            this.player.src({
              src: this.m3u8Main,
              // spriteThumbnails: {
              //   url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              // },
            })
            this.player.play()
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              this.player.currentTime(this.playDuration)
            }
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
            console.log(decryptData);
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            this.m3u8Main = decryptData.url;
            this.playDuration = decryptData.played_duration;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
            this.player.src({
              src: this.m3u8Main,
              // spriteThumbnails: {
              //   url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              // },
            })
            this.player.play()
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              this.player.currentTime(this.playDuration)
            }
          }
        })
      } else {
        this.ds.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData);
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            this.m3u8Main = decryptData.url;
            this.playDuration = decryptData.played_duration;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
            this.player.src({
              src: this.m3u8Main,
              // spriteThumbnails: {
              //   url: this.videosrc[this.itemget].sources[0].spriteThumbnails.url,
              // },
            })
            this.player.play()
            if (this.free_preview == 1 && this.isSubsInfo != 1) {
              this.player.currentTime(0)
            } else {
              this.player.currentTime(this.playDuration)
            }




          }
        })
      }
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
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            id = decryptData.id;
            kId = decryptData.k_id;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                url = decryptData.fairplay_url;
                var fairplaysrc = {
                  src: url,
                  type: 'application/x-mpegURL',
                  keySystems: {
                    'com.apple.fps.1_0': {
                      certificateUri: 'https://www.artofliving.app/fairplay/fairplay.cer', licenseUri: 'https://fps.ezdrm.com/api/licenses/auth?px=8e7f69',
                      options: {
                        persistentState: 'required'
                      }
                    }
                  }
                };

                setTimeout(() => {
                  this.player.eme()
                  this.player.src(fairplaysrc)

                  if (spriteU != "") {
                    this.player.spriteThumbnails({
                      interval: 5,
                      url: spriteU,
                      width: 224,
                      height: 127,
                      responsive: 600,
                    });
                  }

                  // this.getqualitycustom()
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
                url = decryptData.url;
                this.player.src({
                  src: url,
                  spriteThumbnails: {
                    url: spriteU,
                  },
                })

                setTimeout(() => {
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
              }

            } else {
              url = decryptData.url;
              this.player.src({
                src: url,
                spriteThumbnails: {
                  url: spriteU,
                },
              })

              setTimeout(() => {
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
            }
          }
        })
      } else {
        this.ds.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SER_IOS.decryptData);
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            id = decryptData.id;
            kId = decryptData.k_id;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
            if (decryptData.fairplay_allow == 1) {
              url = decryptData.fairplay_url;
              if (decryptData.fairplay_url != '') {
                var fairplaysrc = {
                  src: url,
                  type: 'application/x-mpegURL',
                  keySystems: {
                    'com.apple.fps.1_0': {
                      certificateUri: 'https://www.artofliving.app/fairplay/fairplay.cer', licenseUri: 'https://fps.ezdrm.com/api/licenses/auth?px=8e7f69',
                      options: {
                        persistentState: 'required'
                      }
                    }
                  }
                };

                setTimeout(() => {
                  this.player.eme()
                  this.player.src(fairplaysrc)

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
                url = decryptData.url;
                this.player.src({
                  src: url,
                  spriteThumbnails: {
                    url: spriteU,
                  },
                })

                setTimeout(() => {
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
              }

            } else {
              url = decryptData.url;
              this.player.src({
                src: url,
                spriteThumbnails: {
                  url: spriteU,
                },
              })

              setTimeout(() => {
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
            }
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
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
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
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
                  package_id: "",
                  download: "0",
                  content_type: "0",
                  rental_duration: "360",
                  security_level: "3",
                  user_id: String(this.user.id),
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
              } else if (this.user && this.isSubsInfo == 1) {
                var dataOfContent: any = {
                  content_id: id,
                  k_id: kId,
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
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

              this.player.src({
                'src': url,
                'type': 'application/dash+xml',
                'keySystemOptions': [
                  {
                    'name': 'com.widevine.alpha',
                    'options': {
                      'serverURL': "https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=63CF74&user_id=" + encryptedUserId + "&type=widevine&authorization=" +
                        authcode +
                        "&payload=" +
                        gettoken,
                    }
                  },
                  {
                    'name': 'com.microsoft.playready',
                    'options': {
                      'serverURL': "https://playready.ezdrm.com/cency/preauth.aspx?pX=4FDF8C&user_id=" + encryptedUserId + "&type=playready&authorization=" +
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

            setTimeout(() => {
              this.player.play();
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  console.log(this.playDuration)
                  this.player.currentTime(this.playDuration)
                }
              }, 200);
            }, 1500);
          }
        })
      } else {
        this.ds.getMainUrl(id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.free_preview = decryptData.is_allow
            this.free_preview_duration = decryptData.free_preview_duration
            id = decryptData.id;
            kId = decryptData.k_id;
            url = decryptData.url;
            this.playDuration = decryptData.played_duration;
            accessType = decryptData.price_type;
            this.getLanguage = decryptData.audio_language
            this.getTextTrack = decryptData.srt_language
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
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
                  package_id: "",
                  download: "0",
                  content_type: "0",
                  rental_duration: "360",
                  security_level: "3",
                  user_id: String(this.user.id),
                };
                var gettoken = btoa(JSON.stringify(dataOfContent));
              } else if (this.user && this.isSubsInfo == 1) {
                var dataOfContent: any = {
                  content_id: id,
                  k_id: kId,
                  licence_duration: "30000000",
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
                  licence_duration: "30000000",
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

              this.player.src({
                'src': url,
                'type': 'application/dash+xml',
                'keySystemOptions': [
                  {
                    'name': 'com.widevine.alpha',
                    'options': {
                      'serverURL': "https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=63CF74&user_id=" + encryptedUserId + "&type=widevine&authorization=" +
                        authcode +
                        "&payload=" +
                        gettoken,
                    }
                  },
                  {
                    'name': 'com.microsoft.playready',
                    'options': {
                      'serverURL': "https://playready.ezdrm.com/cency/preauth.aspx?pX=4FDF8C&user_id=" + encryptedUserId + "&type=playready&authorization=" +
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

            setTimeout(() => {
              this.player.play();
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  console.log(this.playDuration)
                  this.player.currentTime(this.playDuration)
                }
              }, 200);
            }, 1500);
          }
        })
      }


    }
  }

  ngAfterViewInit(): void {
    document.addEventListener("visibilitychange", () => {

      // console.log('YESSSSSSSSSSSSSSSSSS');
      // this.dialog.closeAll();

    })

    const taploginInfo = localStorage.getItem("taploginInfo");
    const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';


    const eventParams = {
      item_name: this.data.title,
      item_type: this.data.content_type,
      item_id: this.data.id,
    };
    this.analyticsService.logEvent('video_start', eventParams);
    setTimeout(() => {
      $(".vjs-icon-hd-main").on("click", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").hide()
        $('.custom-quality-menu').show()
      });

      $(".vjs-icon-hd-main").on("touchstart", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").hide()
        $(".vjs-audio-button .vjs-menu-content").hide()
        $('.custom-quality-menu').show()
      });

      $(".vjs-subs-caps-button").on("click", () => {
        $(".vjs-subs-caps-button .vjs-menu-content").show()
        $(".hd-mode").hide()

      });

      $("#bitrateLevels1").on("click", () => {
        // $(".vjs-subs-caps-button .vjs-menu-content").show()
        // $(".hd-mode").hide()

      });

      $(".vjs-audio-button").on("click", () => {
        $(".hd-mode").hide();
        $(".speedIcon").hide()
        $(".vjs-audio-button .vjs-menu-content").show()
      });

      $(".vjs-audio-button").on("touchstart", () => {
        $(".hd-mode").hide();
        $(".speedIcon").hide();
        $(".vjs-audio-button .vjs-menu-content").show()
      });

      $('.vjs-playback-rate').on('click', () => {
        $('.vjs-menu-button-popup .vjs-menu').show()

      })

      // $('#leftArrow').on('click' , () =>{
      //   $('#speedLevelV').show()
      // })


      $('.vjs-quality-selector').on('click', () => {
        // $('#speedLevelV').hide();
        // $('#bitrateLevels1').hide();

      })

      $('.vjs-notes-btn').on('click', () => {
        // $('#speedLevelV').hide();
        // $('#bitrateLevels1').hide();
        // $('.custom-quality-menu').hide()
      })

      $('.vjs-icon-previous-item').on('click', () => {
        // $('#speedLevelV').hide();
        // $('#bitrateLevels1').hide();
        // $('.custom-quality-menu').hide()
      })

      $('.vjs-icon-next-item').on('click', () => {
        // $('#speedLevelV').hide();
        // $('#bitrateLevels1').hide();
        // $('.custom-quality-menu').hide()
      })


      $('.vjs-menu-item').on('click', () => {
        $('.vjs-menu-button-popup .vjs-menu').hide()
      })
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
        $(".close-btn").show();
        if (this.inactivityTimeout != null) {
          clearTimeout(this.inactivityTimeout);
        }
        this.inactivityTimeout = setTimeout(() => {
          $("#video-player").find(".control-overlay-buttons").hide();
          this.player.controls(false);
          $(".vjs-overlay").hide();
          $(".close-btn").hide();
          // $("#bitrateLevels1").hide();
          $("#speedLevelV").hide();
          $('.vjs-menu-button-popup .vjs-menu').hide()
          // $('.custom-quality-menu').hide()
        }, 5000);
      });
    }

    if (xc < 992) {
      $("#video-player").on('touchstart', () => {
        $("#video-player").find(".control-overlay-buttons").show();
        this.player.controls(true);
        $(".vjs-overlay").show();
        if (this.inactivityTimeout != null) {
          clearTimeout(this.inactivityTimeout);
        }
        this.inactivityTimeout = setTimeout(() => {
          $("#video-player").find(".control-overlay-buttons").hide();
          this.player.controls(false);
          $(".vjs-overlay").hide();
          // $("#bitrateLevels1").hide()
          $("#speedLevelV").hide();
          $('.vjs-menu-button-popup .vjs-menu').hide()
          // $('.custom-quality-menu').hide()
        }, 6000);
      });

      this.player.on('touchstart', () => {
        if (this.player.userActive() === true) {
          this.player.userActive(false);
        } else {
          this.player.userActive(true);
        }
      });

      this.player.on('touchstart', () => {
        $(".close-btn").show()
        // $(".vjs-overlay").show();
        this.resetDelay1();
      })
    }

    // drm player
    if (this.data.is_group == 0) {
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

        console.log(this.data.access_type, '--------------------------->');
        console.log(this.data.drm, '------------------------------>');


      } else if (this.data.access_type == 'paid' && this.data.drm == 0) {
        if (this.getBrowserName != 'safari') {
          this.getm3u8Url(this.data.id)
          setTimeout(() => {
            this.player.src({
              src: this.m3u8Main
            })

            this.player.play()
            console.log('asasasasasasa');

            // this.player.hlsQualitySelector()
            this.getqualitycustom()
          }, 1000);
        }
      } else if (this.data.access_type == 'free' && this.data.drm == 1) {
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
      }


    }
    if (this.data.drm == 1) {
      if (this.getBrowserName == 'safari') {
        var buttonComponent = videoJs.getComponent("Button");
        var settingButton = videoJs.extend(buttonComponent, {
          constructor: function () {
            buttonComponent.apply(this, arguments);
            this.addClass("vjs-icon-hd-mainSafari");
            this.controlText("Setting");
          },

          handleClick: (e: any) => {
            $("#speedLevelVSafari").appendTo($(".vjs-icon-hd-mainSafari"));
            $('#speedLevelVSafari').toggle()

          },
        });
        videoJs.registerComponent("settingButton", settingButton);
        this.player.getChild("controlBar").addChild("settingButton", {}, 14);
      }
    }


    if (this.data.drm == 1 && this.getBrowserName != 'safari') {
      var buttonComponent = videoJs.getComponent("Button");
      var settingButton = videoJs.extend(buttonComponent, {
        constructor: function () {
          buttonComponent.apply(this, arguments);
          this.addClass("vjs-icon-hd-main");
          this.controlText("Setting");
        },

        handleClick: (e: any) => {
          e.stopPropagation();

          if (!$.contains($('.vjs-icon-hd-main')[0], $('#bitrateLevels1')[0])) {
            $('#bitrateLevels1').appendTo($('.vjs-icon-hd-main'));
          }
          if (!$.contains($('.vjs-icon-hd-main')[0], $('#speedLevelV')[0])) {
            $('#speedLevelV').appendTo($('.vjs-icon-hd-main'));
          }

          $('#bitrateLevels1, #speedLevelV').off('click').on('click', (e: any) => {
            e.stopPropagation();
          });

          $('#bitrateLevels1, #speedLevelV').off('touchstart').on('touchstart', (e: any) => {
            e.stopPropagation();
          });

          const isBitrateVisible = $('#bitrateLevels1').is(':visible');
          const isSpeedVisible = $('#speedLevelV').is(':visible');

          if (isSpeedVisible) {
            $('#bitrateLevels1, #speedLevelV').hide();
          } else if (isBitrateVisible) {
            $('#bitrateLevels1').hide();
          } else {
            $('#bitrateLevels1').show();
            $('#speedLevelV').hide();
          }
        }

      });
      videoJs.registerComponent("settingButton", settingButton);
      this.player.getChild("controlBar").addChild("settingButton", {}, 14);
    }

    // setup episode selector Start
    if (this.data.is_group == 1) {
      if (this.data.drm == 1) {
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
              content: `${this.data.title}`,
              align: "center",
            },
          ],
        });

        if (this.data.drm == 0 && this.getBrowserName != 'safari') {
          var buttonComponent = videoJs.getComponent("Button");
          var settingButton = videoJs.extend(buttonComponent, {
            constructor: function () {
              buttonComponent.apply(this, arguments);
              this.addClass("vjs-icon-hd-main");
              this.controlText("Setting");
            },

            handleClick: (e: any) => {

              var div1Visible = $('#bitrateLevels1').hasClass('visible');
              var div2Visible = $('#speedLevelV').hasClass('visible');

              if (div2Visible) {
                $('#bitrateLevels1').removeClass('visible').addClass('hidden');
                $('#speedLevelV').removeClass('visible').addClass('hidden');
              } else if (div1Visible) {
                $('#bitrateLevels1').removeClass('visible').addClass('hidden');
                $('#speedLevelV').removeClass('hidden').addClass('visible');

              } else {
                $('#bitrateLevels1').removeClass('hidden').addClass('visible');
              }

              // $("#bitrateLevels1").toggle();
              $("#bitrateLevels1").appendTo($(".videojs-quality"));
              $("#speedLevelV").appendTo($(".videojs-quality"));
              console.log($("#speedLevelV").appendTo($(".videojs-quality")));

              $('.vjs-icon-hd-main').css({ "display": "flex", "justify-content": "center", "align-items": "center" })
              this.randomPositionQuality()
            },
          });
          videoJs.registerComponent("settingButton", settingButton);
          this.player.getChild("controlBar").addChild("settingButton", {}, 14);
        }
      }

      this.player.ready(() => {
        this.player = window.videoPlayer || {};
        this.player = videoJs("video-player");
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

                  console.log(this.EpiData);
                  this.getCurrentPlay = this.data.indexing;
                  if (decryptData.content) {

                    this.EpiData.forEach((element: any) => {

                      this.EpiData.map((category: any) => {
                        category.sliderImg = "";
                        category.sliderIdentifier = "";

                        if (category.is_group == 1) {
                          if (category.layout_thumbs != null) {
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
                          } else {
                            if (category.groupInfo.global_thumb.length != 0) {
                              category.groupInfo.global_thumb.forEach((thumb: any) => {
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
                            }
                          }
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
                              skipDuration: duartionGet,
                              package_mode: element.package_mode
                            },
                          ],
                        });
                      }, 500);

                      this.arr.push(element.id);

                    });
                  }
                  this.itemget = 0;
                  if (this.itemget >= this.videosrc.length) this.itemget = 0;

                  console.log(this.data);

                  if (this.data.hasOwnProperty('indexing')) {
                    if (this.data.indexing != "" && this.data.indexing != 0) {

                      this.itemget = this.data.indexing - 1
                      console.log(this.itemget);

                      if (this.arr.length == this.data.indexing) {
                        // setTimeout(() => {
                        //   $('.vjs-icon-next-item').prop('disabled', true);
                        //   $('.vjs-icon-next-item').css('opacity', '0.5');
                        // }, 1000);
                      }
                    } else if (this.data.indexing == 0) {
                      this.itemget = 0;
                    } else {
                      this.itemget = 0;
                    }

                  } else {
                    this.itemget = 0;
                  }

                  setTimeout(() => {
                    if (this.itemget == 0) {
                      $('.vjs-icon-previous-item').prop('disabled', true);
                      $('.vjs-icon-previous-item').css('opacity', '0.5');
                    } else {
                      $('.vjs-icon-previous-item').prop('disabled', false);
                      $('.vjs-icon-previous-item').css('opacity', '1.0');
                    }
                  }, 500);

                  setTimeout(() => {
                    if (this.arr.length == this.itemget + 1) {
                      $('.vjs-icon-next-item').prop('disabled', true);
                      $('.vjs-icon-next-item').css('opacity', '0.5');
                    } else {
                      $('.vjs-icon-next-item').prop('disabled', false);
                      $('.vjs-icon-next-item').css('opacity', '1.0');
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

                  if (this.videosrc.length - 1 != this.itemget) {
                    this.player.on("ended", () => {
                      console.log(this.videosrc.length);
                      console.log(this.itemget + 1);
                      const taploginInfo = localStorage.getItem("taploginInfo");
                      const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';

                      const eventParams = {
                        item_id: this.videosrc[this.itemget].sources[0].id,
                        item_name: this.videosrc[this.itemget].sources[0].title
                      };
                      this.analyticsService.logEvent('video_complete', eventParams);
                      if (this.videosrc.length != this.itemget + 1) {
                        this.itemget++

                        if (this.videosrc[this.itemget].sources[0].package_mode == 'Prime') {
                          if (this.videosrc[this.itemget].sources[0].access == 'free') {
                            this.endBtn()
                          } else {
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
                              formData.append('content_id', this.videosrc[this.itemget].sources[0].id);
                              formData.append('package_type', this.videosrc[this.itemget].sources[0].package_mode);
                              if (subs != null && JSON.parse(subs).packages_list.length) {
                                JSON.parse(subs).packages_list.filter((res: any) => {

                                })
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
                                  this.endBtn()
                                } else if (res.code == 2) {
                                  this.DEC_SER.getDecryptedData(res.result);
                                  const data: any = JSON.parse(this.DEC_SER.decryptData);
                                  console.log(data);
                                  this.rentalData = data
                                  this.dialog.closeAll()
                                  this.playRental()
                                }
                              })
                            }
                          }
                        } else {
                          this.endBtn()
                        }
                      }

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
                      this.prevBtn()
                    },
                  });

                  var nextButton = videoJs.extend(buttonComponent, {
                    constructor: function () {
                      buttonComponent.apply(this, arguments);
                      this.addClass("vjs-icon-next-item");
                      this.controlText("Next");
                    },
                    handleClick: (e: any) => {
                      console.log(this.videosrc)
                      if (this.videosrc.length != this.itemget + 1) {
                        this.itemget++
                      }

                      if (this.videosrc[this.itemget].sources[0].package_mode == 'Prime') {
                        if (this.videosrc[this.itemget].sources[0].access == 'free') {
                          this.nextBtn()
                        } else {
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
                            formData.append('content_id', this.videosrc[this.itemget].sources[0].id);
                            formData.append('package_type', this.videosrc[this.itemget].sources[0].package_mode);
                            if (subs != null && JSON.parse(subs).packages_list.length) {
                              JSON.parse(subs).packages_list.filter((res: any) => {

                              })
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
                                this.nextBtn()
                              } else if (res.code == 2) {
                                this.DEC_SER.getDecryptedData(res.result);
                                const data: any = JSON.parse(this.DEC_SER.decryptData);
                                console.log(data);
                                this.rentalData = data
                                this.dialog.closeAll()
                                this.playRental()
                              }
                            })
                          }
                        }
                      } else {
                        this.nextBtn()
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
    }

    this.config = {
      slidesToShow: 8,
      dots: false,
      arrows: true,
      slidesToScroll: 5,
      autoplay: false,
      infinite: false,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 5,
          },
        },
      ],
    };

    if (this.data.is_group == 0) {

      this.player.on("ended", () => {
        this.replayFlag = true;


        const eventParams = {
          item_id: this.data.id,
          item_name: this.data.title
        };
        this.analyticsService.logEvent('video_complete', eventParams);
        // if(this.getBrowserName == 'safari') {
        var endedBtnT = document.querySelector('button[title="Replay"]');
        console.log(endedBtnT);

        endedBtnT!.addEventListener('touchstart', () => {
          if (this.replayFlag) {
            this.player.pause()
            setTimeout(() => {
              this.player.currentTime(0)
            }, 1000);
            setTimeout(() => {
              this.player.play();
            }, 1500);
            this.replayFlag = false;
          }
        })

        endedBtnT!.addEventListener('click', () => {
          if (this.replayFlag) {
            this.player.pause()
            setTimeout(() => {
              this.player.currentTime(0)
            }, 1000);

            setTimeout(() => {
              this.player.play();
            }, 1500);

            this.replayFlag = false;
          }
        })
        // }
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

    this.player.on("play", () => {
      // firebase.analytics().logEvent('VIDEO_ACTION', {
      //   'itemName': this.data.title,
      //   'itemType': this.data.content_type,
      //   'itemId': this.data.id,
      //   'action': 'play'
      // })
      $(".vjs-seek-button").show();
      const forwardButton = document.querySelector('.vjs-seek-button.skip-forward.skip-10');
      if (forwardButton) {
        forwardButton.addEventListener('click', () => {
          const eventParams = {
            item_id: this.videosrc[this.itemget].sources[0].id,
            item_name: this.videosrc[this.itemget].sources[0].title,
            item_type: 'video',
            video_length: Math.round(this.player.duration()),
            duration_time: this.player.currentTime()
          };
          this.analyticsService.logEvent('video_forward', eventParams);
        });
      }
      const rewindButton = document.querySelector('.vjs-seek-button.skip-back.skip-10');
      if (rewindButton) {
        rewindButton.addEventListener('click', () => {
          const eventParams = {
            item_id: this.videosrc[this.itemget].sources[0].id,
            item_name: this.videosrc[this.itemget].sources[0].title,
            item_type: 'video',
            video_length: Math.round(this.player.duration()),
            duration_time: this.player.currentTime()
          };
          this.analyticsService.logEvent('video_rewind', eventParams);
        });
      }
    });

    this.player.on("pause", () => {
      console.log(this.player.currentTime(), "llllll");
      setTimeout(() => {
        const eventParams = {
          item_id: this.data.id,
          duration_played: this.player.currentTime()
        };
        this.analyticsService.logEvent('video_pause', eventParams);
      }, 1500);

    });



    if (this.data.is_group == 1) {
      this.player.overlay({
        overlays: [
          {
            start: "playing",

            content: `${this.data.title}`,
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

    // var options2 = {
    //   seekLeft: {
    //     handleClick: () => {
    //       const time = Number(this.player.currentTime()) - 10;

    //       this.player.currentTime(time);
    //     },
    //     doubleTap: true,
    //   },
    //   play: {
    //     handleClick: () => {
    //       if (this.player.paused()) {
    //         this.player.play();
    //       } else {
    //         this.player.pause();
    //       }
    //     },
    //   },
    //   seekRight: {
    //     handleClick: () => {
    //       const time = Number(this.player.currentTime()) + 10;

    //       this.player.currentTime(time);
    //     },
    //     doubleTap: true,
    //   },
    //   lockButton: false,
    // };
  }

  endBtn() {
    this.contentPlaybackEnded = true;
    this.agetime = true;

    $(this.player.posterImage.contentEl()).hide();


    if (this.videosrc[this.itemget].sources[0].package_mode == 'Prime') {
      if (this.videosrc[this.itemget].sources[0].drm == 0 && this.videosrc[this.itemget].sources[0].access == "free") {
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

            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                this.player.currentTime(this.playDuration)
              }
            }, 200);
          }, 200);
        }, 500);


      }
      else {
        if (
          this.videosrc[this.itemget].sources[0].drm == 1
        ) {
          this.adFirstTime = false;

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

              this.player.play()
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  this.player.currentTime(this.playDuration)
                }
              }, 200);
            }, 200);
          }, 500);
        }
      }
    } else {
      if (this.videosrc[this.itemget].sources[0].drm == 0 && this.videosrc[this.itemget].sources[0].access == "free") {
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

            this.player.play()
            setTimeout(() => {
              if (this.free_preview == 1 && this.isSubsInfo != 1) {
                this.player.currentTime(0)
              } else {
                this.player.currentTime(this.playDuration)
              }
            }, 200);
          }, 200);
        }, 500);


      } else if (this.isSubsInfo == 1) {
        if (
          this.videosrc[this.itemget].sources[0].drm == 1
        ) {
          this.adFirstTime = false;

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

              this.player.play()
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  this.player.currentTime(this.playDuration)
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
    }



    $(".moveToVideoJs").show();
    setTimeout(() => {
      $(".moveToVideoJs").hide();
    }, 5000);

    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });
    this.selectedId = this.videosrc[this.itemget].sources[0].id
    if (this.itemget != 0) {
      $('.vjs-icon-previous-item').prop('disabled', false);
      $('.vjs-icon-previous-item').css('opacity', '1.0');
    }

    if (this.videosrc.length - 1 == this.itemget) {


      this.buttonNextDisable = document.querySelector('.vjs-icon-previous-item');
      this.buttonNextDisable.style.pointerEvents = 'none'; // Disable touch
      this.buttonNextDisable.addEventListener('touchstart', function (event: any) {
        event.preventDefault(); // Prevent touch
      });

      // $('.vjs-icon-next-item').prop('disabled', true);
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

  prevBtn() {
    console.log(this.itemget);

    this.agetime = true;
    if (this.itemget != 0) {
      this.itemget--
    }
    if (this.videosrc[this.itemget].sources[0].drm == 0 && this.videosrc[this.itemget].sources[0].access == "free") {

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
                  this.player.currentTime(this.playDuration)
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
              this.player.currentTime(this.playDuration)
            }
          }, 200);
        }, 200);
      }, 500);
    } else if (this.isSubsInfo == 1) {
      // if (this.itemget != 0) {
      //   this.itemget--
      // }
      this.adFirstTime = false;

      if (
        this.videosrc[this.itemget].sources[0].drm == 1
      ) {
        this.player.on('ads-manager', (response: any) => {
          var adsManager = response.adsManager;
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
          });
        })
        this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
      } else {
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
                    this.player.currentTime(this.playDuration)
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
                this.player.currentTime(this.playDuration)
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

    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });
    this.selectedId = this.videosrc[this.itemget].sources[0].id

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
    if (this.itemget == 0) {
      $('.vjs-icon-previous-item').prop('disabled', true);
      $('.vjs-icon-previous-item').css('opacity', '0.5');
    }


    // if (this.itemget == 0) {
    //   this.buttonPrevDisable = document.querySelector('.vjs-icon-previous-item');
    //   this.buttonPrevDisable.style.pointerEvents = 'none'; // Disable touch
    //   this.buttonPrevDisable.addEventListener('touchstart', function (event: any) {
    //     event.preventDefault(); // Prevent touch
    //   });
    //   // $('.vjs-icon-previous-item').prop('disabled', true);
    //   $('.vjs-icon-previous-item').css('opacity', '0.5');
    // }

    if (this.videosrc.length - 1 != this.itemget)
      $('.vjs-icon-next-item').prop('disabled', false);
    $('.vjs-icon-next-item').css('opacity', '1.0');

    $('#ffffffffffffffffffffffff').hide();
    $('#gggggggggggggggggggggggggg').hide();
    $('#astonband').hide()
    $(".video-js .vjs-tech").css("height", "100%");
    $(".video-js .vjs-tech").css("width", "100%");

    this.ds.apipip().subscribe((res: any) => {
      const userInfo: any = localStorage.getItem("taploginInfo");
      let analytics: any = {
        c_id: this.videosrc[this.itemget + 1].sources[0].id,
        dod: "",
        dd: "",
        type: 2,
        content_title: this.data.title,
        total_duration: this.player.cache_.duration,
        pd: Math.floor(this.player.cache_.currentTime),
        cat_id: '',
        age_group: "other",
        gender: "Male",
        network_provider: "Airtel",
        customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
        content_type: 'video',
        impression: 0
      };
      analytics.dod = `{ "os_version": "6.0", "app_version": "26.04.024", "network_type": "wifi", "network_provider": "" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo).id);
      formData.append("country", res?.countryName);
      formData.append("country_code", res?.countryCode);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
      // this.analytics();
    })


  }

  nextBtn() {
    console.log(this.itemget);

    this.agetime = true;
    console.log(this.videosrc[this.itemget].sources[0]);

    if (this.videosrc[this.itemget].sources[0].package_mode == 'Prime') {
      if (this.videosrc[this.itemget].sources[0].drm == 0 && this.videosrc[this.itemget].sources[0].access == "free") {
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
                    this.player.currentTime(this.playDuration)
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
                this.player.currentTime(this.playDuration)
              }
            }, 200);
          }, 200);
        }, 500);

      } else {
        this.adFirstTime = false;
        if (
          this.videosrc[this.itemget].sources[0].drm == 1
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
                      this.player.currentTime(this.playDuration)
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
                  this.player.currentTime(this.playDuration)
                }
              }, 200);
            }, 200);
          }, 500);
        }
      }
    } else {
      if (this.videosrc[this.itemget].sources[0].drm == 0 && this.videosrc[this.itemget].sources[0].access == "free") {
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
                    this.player.currentTime(this.playDuration)
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
                this.player.currentTime(this.playDuration)
              }
            }, 200);
          }, 200);
        }, 500);

      } else if (this.isSubsInfo == 1) {
        this.adFirstTime = false;
        if (
          this.videosrc[this.itemget].sources[0].drm == 1
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
                      this.player.currentTime(this.playDuration)
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
                  this.player.currentTime(this.playDuration)
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
    }






    $(".moveToVideoJs").show();
    setTimeout(() => {
      $(".moveToVideoJs").hide();
    }, 5000);

    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });
    this.selectedId = this.videosrc[this.itemget].sources[0].id
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


    // if (this.itemget != 0) {
    //   $('.vjs-icon-previous-item').prop('disabled', false);
    //   $('.vjs-icon-previous-item').css('opacity', '1.0');
    // }

    // if (this.videosrc.length - 1 == this.itemget) {


    //   this.buttonNextDisable = document.querySelector('.vjs-icon-next-item');
    //   this.buttonNextDisable.style.pointerEvents = 'none'; // Disable touch
    //   this.buttonNextDisable.addEventListener('touchstart', function (event: any) {
    //     event.preventDefault(); // Prevent touch
    //   });

    //   // $('.vjs-icon-next-item').attr('disabled', 'disabled');
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

    this.ds.apipip().subscribe((res: any) => {
      const userInfo: any = localStorage.getItem("taploginInfo");
      let analytics: any = {
        c_id: this.videosrc[this.itemget - 1].sources[0].id,
        dod: "",
        dd: "",
        type: 2,
        content_title: this.data.title,
        total_duration: this.player.cache_.duration,
        pd: Math.floor(this.player.cache_.currentTime),
        cat_id: '',
        age_group: "other",
        gender: "Male",
        network_provider: "Airtel",
        customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
        content_type: 'video',
        impression: 0
      };
      analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", JSON.parse(userInfo).id);
      formData.append("country", res?.countryName);
      formData.append("country_code", res?.countryCode);
      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          // this.ed.playDetailVideo.next(true);
        }
      });
      // this.analytics();
    })
  }
  nextBtnRental() {
    this.drmContent(this.videosrc[this.itemget].sources[0].id, this.videosrc[this.itemget].sources[0].kId, this.videosrc[this.itemget].sources[0].src, this.videosrc[this.itemget].sources[0].access, this.videosrc[this.itemget].sources[0].spriteThumbnails.url)
    $(".moveToVideoJs").show();
    setTimeout(() => {
      $(".moveToVideoJs").hide();
    }, 5000);

    this.player.overlay({
      overlays: [
        {
          start: "playing",
          content: (`${this.videosrc[this.itemget].sources[0].title}`),
          align: "center",
        },
      ],
    });
    this.selectedId = this.videosrc[this.itemget].sources[0].id
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

    const userInfo: any = localStorage.getItem("taploginInfo");
    let analytics: any = {
      c_id: this.videosrc[this.itemget - 1].sources[0].id,
      dod: "",
      dd: "",
      type: 2,
      content_title: this.data.title,
      total_duration: this.player.cache_.duration,
      pd: Math.floor(this.player.cache_.currentTime),
      cat_id: '',
      age_group: "other",
      gender: "Male",
      network_provider: "Airtel",
      customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
      content_type: 'video',
      impression: 0
    };
    analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
    analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
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

  rightArr() {
    $('#bitrateLevels1').show();
    $("#speedLevelV").hide();
  }

  leftArr() {
    $('#bitrateLevels1').show();
    $("#speedLevelV").hide();
  }

  getqualitycustom() {
    // setTimeout(() => {
      this.player.on("loadeddata", () => {
        if (this.data.drm == 1) {
          const mediaPlayer = this.player.dash.mediaPlayer;
          this.player.dashQualityLevels =
            mediaPlayer.getBitrateInfoListFor("video");

          console.log(mediaPlayer);

          this.player.trigger("dashQualityLevels");
          this.player.on("dashQualityLevels", (e: any) => {
            let levels = e.target.player.dashQualityLevels;
            console.log(levels);

            const ul: any = document.getElementById("bitrateLevels1");
            ul.innerHTML = "";

            let divAboveAuto = document.createElement("div");
            divAboveAuto.classList.add("quality");

            let leftArrowImg = document.createElement("img");
            leftArrowImg.src = "../../assets/icons/left-down.svg";
            leftArrowImg.alt = "";
            leftArrowImg.width = 25;
            leftArrowImg.addEventListener('click', () => {
              $('#bitrateLevels1').hide();
              $("#speedLevelV").show();
            });

            // leftArrowImg.addEventListener('touchstart', () => {
            //   $('#bitrateLevels1').hide();
            //   $("#speedLevelV").show();
            // });

            divAboveAuto.appendChild(leftArrowImg);

            let title = document.createElement("h3");
            title.textContent = "Quality";
            title.style.fontFamily = 'PoppinsRegular';
            title.style.fontSize = '16px';
            title.style.fontWeight = '800';
            title.style.margin = '0';
            title.style.textAlign = 'center'

            divAboveAuto.appendChild(title);

            let rightArrowImg = document.createElement("img");
            rightArrowImg.src = "../../assets/icons/right-down.svg";
            rightArrowImg.alt = "";
            rightArrowImg.width = 25;
            rightArrowImg.addEventListener('click', () => {
              $('#bitrateLevels1').hide();
              $("#speedLevelV").show();
            });

            // rightArrowImg.addEventListener('touchstart', () => {
            //   $('#bitrateLevels1').hide();
            //   $("#speedLevelV").show();
            // });

            divAboveAuto.appendChild(rightArrowImg);

            ul.insertBefore(divAboveAuto, ul.childNodes[0]);

            let liAuto = document.createElement("li");
            liAuto.innerHTML = "Auto";
            liAuto.setAttribute("height", "auto");
            liAuto.setAttribute("index", '2');
            liAuto.classList.add(`activeModeauto`);
            liAuto.addEventListener('click', (event: any) => {
              this.handleQualityLevelClick(event.target);
              $('#bitrateLevels1').hide()
            });

            liAuto.addEventListener('touchstart', (event: any) => {
              this.handleQualityLevelClick(event.target);
              $('#bitrateLevels1').hide()
            });
            ul.appendChild(liAuto);

            levels.forEach((level: any, index: any) => {
              let li = document.createElement("li");
              li.innerHTML = `${level.height}p`;
              li.setAttribute("height", level.height);
              li.classList.add(`activeMode${index}`);
              li.setAttribute("index", index);
              li.addEventListener('click', (event: any) => {
                this.handleQualityLevelClick(event.target);
                $('#bitrateLevels1').hide()
              });

              li.addEventListener('touchstart', (event: any) => {
                this.handleQualityLevelClick(event.target);
                $('#bitrateLevels1').hide()
              });
              ul.appendChild(li);
            });
          });

          this.player.on("dashQualityLevelsSelected", (e: any) => {
            let select = e.target.player.dashQualityLevelsSelected;
            let cfg: any = {
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
        } else {
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa====================================>');

          let existingButton: any = document.querySelector('.videojs-quality');

          if (existingButton) {
            existingButton.parentNode.removeChild(existingButton);
          }

          let calidades = this.player
            .tech({ IWillNotUseThisInPlugins: true })
            .hls.representations();

          console.log(calidades);
          crearBotonCalidad({
            class: "custom-quality-button",
            calidades: calidades,
            // father: this.player.controlBar.el_
            insertIndex: 17
          });

          // $('.custom-quality-menu').hide()

          function crearBotonCalidad(params: any) {
            let customButton = document.createElement("button");
            customButton.className = "vjs-custom-control vjs-control videojs-quality";
            customButton.innerHTML = "";

            let menu = document.createElement('div');
            menu.className = 'custom-quality-menu';
            // menu.id = 'bitrateLevels1'

            let divAboveAuto = document.createElement("div");
            divAboveAuto.classList.add("quality");
            let leftArrowImg = document.createElement("img");
            leftArrowImg.src = "../../assets/icons/left-down.svg";
            leftArrowImg.alt = "";
            leftArrowImg.width = 25;
            leftArrowImg.id = 'leftArrow'

            // touchstart
            leftArrowImg.addEventListener('click', () => {
              $('.bit-main').hide()
              $('.speedIcon').show()
              $('#speedLevelV').show()
            })

            leftArrowImg.addEventListener('touchstart', () => {
              $('.bit-main').hide()
              $('.speedIcon').show()
              $('#speedLevelV').show()
            })
            divAboveAuto.appendChild(leftArrowImg);

            let title = document.createElement("h3");
            title.textContent = "Quality";
            divAboveAuto.appendChild(title);

            let rightArrowImg = document.createElement("img");
            rightArrowImg.src = "../../assets/icons/right-down.svg";
            rightArrowImg.alt = "";
            rightArrowImg.width = 25;
            rightArrowImg.id = 'rightArrow'
            rightArrowImg.addEventListener('click', () => {
              $('#bitrateLevels1').hide()
              $('.bit-main').hide()
              $('.speedIcon').show()
            })

            rightArrowImg.addEventListener('touchstart', () => {
              $('#bitrateLevels1').hide()
              $('.bit-main').hide()
              $('.speedIcon').show()
            })
            divAboveAuto.appendChild(rightArrowImg);

            menu.insertBefore(divAboveAuto, menu.childNodes[0]);

            let autoMenuItem = document.createElement("div");
            autoMenuItem.className = "custom-quality-menu-item selected"; // Initially selected
            autoMenuItem.innerText = "Auto";
            autoMenuItem.addEventListener("click", () => {
              resetCalidad(params);
              autoMenuItem.classList.add("selected");
              params.calidades.forEach((calidad: any) => calidad.enabled(true));
            });

            autoMenuItem.addEventListener("touchstart", () => {
              resetCalidad(params);
              autoMenuItem.classList.add("selected");
              params.calidades.forEach((calidad: any) => calidad.enabled(true));
            });
            menu.appendChild(autoMenuItem);

            params.calidades.sort((a: any, b: any) => {
              return a.height > b.height ? 1 : 0;
            });

            params.calidades.forEach((calidad: any) => {
              let menuItem = document.createElement("div");
              menuItem.className = "custom-quality-menu-item";
              menuItem.innerText = calidad.height + "p";



              menuItem.addEventListener("touchstart", () => {
                resetCalidad(params);
                menuItem.classList.add("selected");
                calidad.enabled(true);
              });

              menu.appendChild(menuItem);
            });

            customButton.appendChild(menu);
            customButton.addEventListener('click', () => {
              var div1Visible = $('.custom-quality-menu').hasClass('visible');
              var div2Visible = $('.speed-mode').hasClass('visible');

              if (div2Visible) {
                $('.custom-quality-menu').removeClass('visible').addClass('hidden');
                $('.speed-mode').removeClass('visible').addClass('hidden');
              } else if (div1Visible) {
                $('.custom-quality-menu').removeClass('visible').addClass('hidden');
                $('.speed-mode').removeClass('hidden').addClass('visible');

              } else {
                $('.custom-quality-menu').removeClass('hidden').addClass('visible');
              }

              // if (div2Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden');
              //   $('.speed-mode').removeClass('visible').addClass('hidden');
              // } else if (div1Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden')
              //   $('.speed-mode').removeClass('hidden').addClass('visible');
              // } else {
              //   $('.custom-quality-menu').removeClass('hidden').addClass('visible');
              // }

              // var div1Visible = $('.custom-quality-menu').hasClass('visible');
              // var div2Visible = $('.speed-mode').hasClass('visible');

              // if (div2Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden');
              //   $('.speed-mode').removeClass('visible').addClass('hidden');
              // } else if (div1Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden');
              //   $('.speed-mode').removeClass('hidden').addClass('visible');
              // } else {
              //   $('.custom-quality-menu').removeClass('hidden').addClass('visible');
              //   $(".custom-quality-menu").show();
              // }


              $(".custom-quality-menu").appendTo($(".videojs-quality"));
              $(".speed-mode").appendTo($(".videojs-quality"));
            });

            customButton.addEventListener('touchstart', () => {
              var div1Visible = $('.custom-quality-menu').hasClass('visible');
              var div2Visible = $('.speed-mode').hasClass('visible');

              if (div2Visible) {
                $('.custom-quality-menu').removeClass('visible').addClass('hidden');
                $('.speed-mode').removeClass('visible').addClass('hidden');
              } else if (div1Visible) {
                $('.custom-quality-menu').removeClass('visible').addClass('hidden');
                $('.speed-mode').removeClass('hidden').addClass('visible');

              } else {
                $('.custom-quality-menu').removeClass('hidden').addClass('visible');
              }

              // if (div2Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden');
              //   $('.speed-mode').removeClass('visible').addClass('hidden');
              // } else if (div1Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden')
              //   $('.speed-mode').removeClass('hidden').addClass('visible');
              // } else {
              //   $('.custom-quality-menu').removeClass('hidden').addClass('visible');
              // }

              // var div1Visible = $('.custom-quality-menu').hasClass('visible');
              // var div2Visible = $('.speed-mode').hasClass('visible');

              // if (div2Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden');
              //   $('.speed-mode').removeClass('visible').addClass('hidden');
              // } else if (div1Visible) {
              //   $('.custom-quality-menu').removeClass('visible').addClass('hidden');
              //   $('.speed-mode').removeClass('hidden').addClass('visible');
              // } else {
              //   $('.custom-quality-menu').removeClass('hidden').addClass('visible');
              //   $(".custom-quality-menu").show();
              // }


              $(".custom-quality-menu").appendTo($(".videojs-quality"));
              $(".speed-mode").appendTo($(".videojs-quality"));
            });

            let player = videoJs('video-player')
            let controlBar = player.controlBar.el_;
            let children = controlBar.children;
            if (params.insertIndex < children.length) {
              controlBar.insertBefore(customButton, children[params.insertIndex]);
            } else {
              controlBar.appendChild(customButton);
            }

            // params.father.appendChild(customButton);
          }

          function resetCalidad(params: any) {
            let menuItems = document.querySelectorAll(".custom-quality-menu-item");
            menuItems.forEach(item => {
              item.classList.remove("selected");
            });

            params.calidades.forEach((calidad: any) => {
              calidad.enabled(false);
            });
          }
        }

      });
    // }, 1000);

  }

  handleQualityLevelClick(target: HTMLElement) {
    this.player.dashQualityLevelsSelected = target.getAttribute("index");
    this.player.trigger("dashQualityLevelsSelected");
    setTimeout(() => {
      // document.getElementById("bitrateLevels1")!.style.display = "none";
    }, 200);
    document.querySelectorAll("ul li.activeModeauto").forEach((el) => {
      el.classList.remove("activeModeauto");
    });
    document.querySelectorAll("ul li.activemode").forEach((el) => {
      el.classList.remove("activemode");
    });
    target.classList.add("activemode");
  }

  slideConfig = {
    slidesToShow: 6,
    dots: false,
    arrows: true,
    slidesToScroll: 3,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 2000,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          dots: false,
          arrows: false,
          slidesToScroll: 4,
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
          slidesToScroll: 4,
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
            content: `${this.data.title}`,
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
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa----------------------------->');

    } else if (this.data.drm == 0 && this.data.access_type == 'paid') {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa---------------------->');

      this.getm3u8Url(this.data.id)
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main
        })

        this.player.play()
        // this.player.hlsQualitySelector()
        this.getqualitycustom()
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

                console.log(this.EpiData);

                if (decryptData.content) {
                  this.EpiData.forEach((element: any) => {
                    this.EpiData.map((category: any) => {
                      category.sliderImg = "";
                      category.sliderIdentifier = "";
                      if (category.is_group == 1) {
                        if (category.layout_thumbs != null) {
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
                        } else {
                          if (category.groupInfo.global_thumb.length != 0) {
                            category.groupInfo.global_thumb.forEach((thumb: any) => {
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
                          }
                        }
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
                            package_mode: element.package_mode
                          },
                        ],
                      });
                    }, 500);

                    this.arr.push(element.id);

                  });
                }
                this.itemget = 0;
                if (this.itemget >= this.videosrc.length) this.itemget = 0;

                if (this.data.hasOwnProperty('indexing')) {
                  if (this.data.indexing != "") {
                    this.itemget = this.data.indexing - 1
                    if (this.arr.length == this.data.indexing) {

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
                    $(this.player.posterImage.contentEl()).hide();
                    if (this.videosrc.length != this.itemget + 1) {
                      this.itemget++
                    }
                    console.log(this.videosrc[this.itemget].sources[0].id);
                    const taploginInfo = localStorage.getItem("taploginInfo");
                    const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';

                    const eventParams = {
                      item_id: this.videosrc[this.itemget].sources[0].id,
                      item_name: this.videosrc[this.itemget].sources[0].title
                    };
                    this.analyticsService.logEvent('video_complete', eventParams);
                    if (this.videosrc[this.itemget].sources[0].drm == 0 && this.videosrc[this.itemget].sources[0].access == 'free') {
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
                              this.player.currentTime(this.playDuration)
                            }
                          }, 200);
                        }, 200);
                      }, 500);

                    } else if (this.isSubsInfo == 1) {
                      if (
                        this.videosrc[this.itemget].sources[0].drm == 1
                      ) {
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
                                this.player.currentTime(this.playDuration)
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

                    this.player.overlay({
                      overlays: [
                        {
                          start: "playing",
                          content: (`${this.videosrc[this.itemget].sources[0].title}`),
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
                              this.player.currentTime(this.playDuration)
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
                          content: (`${this.videosrc[this.itemget].sources[0].title}`),
                          align: "center",
                        },
                      ],
                    });

                    $('#ffffffffffffffffffffffff').hide();
                    $('#gggggggggggggggggggggggggg').hide();
                    $('#astonband').hide()
                    $(".video-js .vjs-tech").css("height", "100%");
                    $(".video-js .vjs-tech").css("width", "100%");

                    this.ds.apipip().subscribe((res: any) => {
                      const userInfo: any = localStorage.getItem("taploginInfo");
                      let analytics: any = {
                        c_id: this.videosrc[this.itemget + 1].sources[0].id,
                        dod: "",
                        dd: "",
                        type: 2,
                        content_title: this.data.title,
                        total_duration: this.player.cache_.duration,
                        pd: Math.floor(this.player.cache_.currentTime),
                        cat_id: '',
                        age_group: "other",
                        gender: "Male",
                        network_provider: "Airtel",
                        customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
                        content_type: 'video'
                      };
                      analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
                      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                      const formData = new FormData();
                      for (const key in analytics) {
                        formData.append(key, analytics[key]);
                      }
                      formData.append("u_id", JSON.parse(userInfo).id);
                      formData.append("country", res?.countryName);
                      formData.append("country_code", res?.countryCode);
                      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
                        if (res.code == 1) {
                          // this.ed.playDetailVideo.next(true);
                        }
                      });
                      // this.analytics();
                    })
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
                              this.player.currentTime(this.playDuration)
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
                          content: (`${this.videosrc[this.itemget].sources[0].title}`),
                          align: "center",
                        },
                      ],
                    });

                    $('#ffffffffffffffffffffffff').hide();
                    $('#gggggggggggggggggggggggggg').hide();
                    $('#astonband').hide()
                    $(".video-js .vjs-tech").css("height", "100%");
                    $(".video-js .vjs-tech").css("width", "100%");

                    this.ds.apipip().subscribe((res: any) => {
                      const userInfo: any = localStorage.getItem("taploginInfo");
                      let analytics: any = {
                        c_id: this.videosrc[this.itemget - 1].sources[0].id,
                        dod: "",
                        dd: "",
                        type: 2,
                        content_title: this.data.title,
                        total_duration: this.player.cache_.duration,
                        pd: Math.floor(this.player.cache_.currentTime),
                        cat_id: '',
                        age_group: "other",
                        gender: "Male",
                        network_provider: "Airtel",
                        customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
                        content_type: 'video',
                        impression: 0
                      };
                      analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
                      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                      const formData = new FormData();
                      for (const key in analytics) {
                        formData.append(key, analytics[key]);
                      }
                      formData.append("u_id", JSON.parse(userInfo).id);
                      formData.append("country", res?.countryName);
                      formData.append("country_code", res?.countryCode);
                      this.ds.analyticsSubmit(formData).subscribe((res: any) => {
                        if (res.code == 1) {
                          // this.ed.playDetailVideo.next(true);
                        }
                      });
                      // this.analytics();
                    })
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
      $(".close-btn").hide();
    }, 4000);
  };

  crossEpisode() {
    $(".episodeSelector").hide();
    this.player.play();
  }

  jsondata() {
    this.ds.faqData().subscribe((data: any) => {
      this.watermark = data?.Player[0]?.watermarking[0]
      console.log(this.watermark);
      if (this.watermark.is_allow == 1 && this.watermark.type == "UserId") {
        this.randomInter = setInterval(() => {
          var randomX = Math.floor(Math.random() * (window.innerWidth - 100));
          var randomY = Math.floor(Math.random() * (window.innerHeight - 100));
          var div: any = document.getElementById('watermark');
          div.style.left = randomX + 'px';
          div.style.top = randomY + 'px';
          div.style.display = 'block';
          div.style.color = this.watermark.color;
          div.style.opacity = this.watermark.opacity;
          div.style.fontSize = this.watermark.font;
          setTimeout(function () {
            div.style.display = 'none';
          }, this.watermark.visibility * 1000);
        }, this.watermark.duration_gap * 1000)
        $("#watermark").appendTo($("#video-player"));

      }
    });
  }

  episodePlatbtn(episodedata: any, epidatai: any) {
    console.log(episodedata)
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
      this.player.overlay({
        overlays: [
          {
            start: "playing",
            content: `${episodedata.title}`,
            align: "center",
          },
        ],
      });
      this.selectedId = episodedata.id

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

      if (episodedata.package_mode == 'Prime') {
        if (episodedata.drm == 1) {
          this.userId = localStorage.getItem("taploginInfo");
          this.user = JSON.parse(this.userId);
          this.player = videoJs("video-player");
          this.adFirstTime = false;

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
          this.episodeAnalytics()
          setTimeout(() => {
            this.getCurrentPlay = episodedata.indexing
          }, 2000);

        } else if (episodedata.drm == 0 && episodedata.access_type == 'free') {

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

                    this.player.play()
                    setTimeout(() => {
                      if (this.free_preview == 1 && this.isSubsInfo != 1) {
                        this.player.currentTime(0)
                      } else {
                        this.player.currentTime(this.playDuration)
                      }
                    }, 200);
                  }, 200);
                }, 500);
              }
            });

          })
          setTimeout(() => {
            if (episodedata.sprite_url != "" && episodedata.sprite_url != null)
              this.player.src({
                src: this.m3u8Main,
                spriteThumbnails: {
                  url: episodedata.sprite_url.web,
                },
              })

            if (episodedata.sprite_url != "" && episodedata.sprite_url != null) {
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

              this.player.play()
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  this.player.currentTime(this.playDuration)
                }
              }, 200);
            }, 200);
          }, 500);
          this.episodeAnalytics()
          setTimeout(() => {
            this.getCurrentPlay = episodedata.indexing
          }, 2000);
        } else if (episodedata.drm == 0) {

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

                    this.player.play()
                    setTimeout(() => {
                      if (this.free_preview == 1 && this.isSubsInfo != 1) {
                        this.player.currentTime(0)
                      } else {
                        this.player.currentTime(this.playDuration)
                      }
                    }, 200);
                  }, 200);
                }, 500);
              }
            });

          })
          setTimeout(() => {
            if (episodedata.sprite_url != "" && episodedata.sprite_url != null)
              this.player.src({
                src: this.m3u8Main,
                spriteThumbnails: {
                  url: episodedata.sprite_url.web,
                },
              })

            if (episodedata.sprite_url != "" && episodedata.sprite_url != null) {
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

              this.player.play()
              setTimeout(() => {
                this.player.currentTime(this.playDuration);
              }, 200);
            }, 200);
          }, 500);

          this.episodeAnalytics()
          setTimeout(() => {
            this.getCurrentPlay = episodedata.indexing
          }, 2000);
        }
      } else {
        if (this.isSubsInfo == 1 && episodedata.drm == 1) {

          this.userId = localStorage.getItem("taploginInfo");
          this.user = JSON.parse(this.userId);
          this.player = videoJs("video-player");
          this.adFirstTime = false;

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
          this.episodeAnalytics()
          setTimeout(() => {
            this.getCurrentPlay = episodedata.indexing
          }, 2000);
        } else if (episodedata.drm == 0 && episodedata.access_type == 'free') {

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

                    this.player.play()
                    setTimeout(() => {
                      if (this.free_preview == 1 && this.isSubsInfo != 1) {
                        this.player.currentTime(0)
                      } else {
                        this.player.currentTime(this.playDuration)
                      }
                    }, 200);
                  }, 200);
                }, 500);
              }
            });

          })
          setTimeout(() => {
            if (episodedata.sprite_url != "" && episodedata.sprite_url != null)
              this.player.src({
                src: this.m3u8Main,
                spriteThumbnails: {
                  url: episodedata.sprite_url.web,
                },
              })

            if (episodedata.sprite_url != "" && episodedata.sprite_url != null) {
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

              this.player.play()
              setTimeout(() => {
                if (this.free_preview == 1 && this.isSubsInfo != 1) {
                  this.player.currentTime(0)
                } else {
                  this.player.currentTime(this.playDuration)
                }
              }, 200);
            }, 200);
          }, 500);
          this.episodeAnalytics()
          setTimeout(() => {
            this.getCurrentPlay = episodedata.indexing
          }, 2000);
        } else if (this.isSubsInfo == 1 && episodedata.drm == 0) {

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

                    this.player.play()
                    setTimeout(() => {
                      if (this.free_preview == 1 && this.isSubsInfo != 1) {
                        this.player.currentTime(0)
                      } else {
                        this.player.currentTime(this.playDuration)
                      }
                    }, 200);
                  }, 200);
                }, 500);
              }
            });

          })
          setTimeout(() => {
            if (episodedata.sprite_url != "" && episodedata.sprite_url != null)
              this.player.src({
                src: this.m3u8Main,
                spriteThumbnails: {
                  url: episodedata.sprite_url.web,
                },
              })

            if (episodedata.sprite_url != "" && episodedata.sprite_url != null) {
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

              this.player.play()
              setTimeout(() => {
                this.player.currentTime(this.playDuration);
              }, 200);
            }, 200);
          }, 500);
          this.episodeAnalytics()
          setTimeout(() => {
            this.getCurrentPlay = episodedata.indexing
          }, 2000);
        } else {
          this.mat.closeAll();
          this.router.navigate(["/subscribe"]);
        }
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

    if (this.getBrowserName == 'safari') {
      this.getm3u8Url(this.videosrc[this.itemget].sources[0].id)
      setTimeout(() => {
        this.player.src({
          src: this.m3u8Main
        })

        this.player.play()
        // this.player.hlsQualitySelector()
        this.getqualitycustom()
      }, 1000);
    }
  }

  playEpisode(episodedata: any, epidatai: any) {
    if (episodedata.package_mode == 'Prime') {
      if (episodedata.access_type == 'free') {
        this.episodePlatbtn(episodedata, epidatai)
      } else {
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
          formData.append('content_id', episodedata.id);
          formData.append('package_type', episodedata.package_mode);
          if (subs != null && JSON.parse(subs).packages_list.length) {
            JSON.parse(subs).packages_list.filter((res: any) => {

            })
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
              this.episodePlatbtn(episodedata, epidatai)
            } else if (res.code == 2) {
              this.DEC_SER.getDecryptedData(res.result);
              const data: any = JSON.parse(this.DEC_SER.decryptData);
              console.log(data);
              this.rentalData = data
              this.dialog.closeAll()
              this.playRental()
            }
          })
        }
      }
    } else {
      this.episodePlatbtn(episodedata, epidatai)
    }
  }

  convertTimeToMinutes(timeString: any): string {
    const hours = Number(timeString.slice(0, 2));
    const minutes = Number(timeString.slice(3, 5));
    const seconds = Number(timeString.slice(6, 8));
    let totalMinutes = (hours * 60) + minutes;
    if (seconds >= 30) {
      totalMinutes += 1;
    }
    const formattedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;
    return formattedMinutes;
  }

  slickInit(_e: any) { }

  breakpoint(_e: any) { }

  afterChange(_e: any) { }

  beforeChange(_e: any) { }

  episodeAnalytics() {
    console.log(this.getCurrentPlay);
    console.log(this.videosrc[this.getCurrentPlay - 1].sources[0].id);
    console.log(this.videosrc);


    this.ds.apipip().subscribe((res: any) => {
      console.log(this.getCurrentPlay)
      if (this.videosrc.length != 0) {
        const userInfo: any = localStorage.getItem("taploginInfo");
        let analytics: any = {
          c_id: this.videosrc[this.getCurrentPlay - 1].sources[0].id,
          dod: "",
          dd: "",
          type: 2,
          content_title: this.data.title,
          total_duration: this.player.cache_.duration,
          pd: Math.floor(this.player.cache_.currentTime),
          cat_id: '',
          age_group: "other",
          gender: "Male",
          network_provider: "Airtel",
          customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
          content_type: 'video',
          impression: 0
        };
        analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
        analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
        const formData = new FormData();
        for (const key in analytics) {
          formData.append(key, analytics[key]);
        }
        formData.append("u_id", JSON.parse(userInfo).id);
        formData.append("country", res?.countryName);
        formData.append("country_code", res?.countryCode);
        formData.append("s_id", this.data.season_id);
        this.ds.analyticsSubmit(formData).subscribe((res: any) => {
          if (res.code == 1) {
            // this.ed.playDetailVideo.next(true);
          }
        });
      }
    })

  }
  analytics() {
    console.log(Math.floor(this.player.cache_.currentTime));

    this.ds.apipip().subscribe((res: any) => {
      if (this.data.is_group == 1) {
        if (this.videosrc.length != 0) {
          const userInfo: any = localStorage.getItem("taploginInfo");
          let analytics: any = {
            c_id: this.videosrc[this.itemget].sources[0].id,
            dod: "",
            dd: "",
            type: 2,
            content_title: this.data.title,
            total_duration: this.player.cache_.duration,
            pd: Math.floor(this.player.cache_.currentTime),
            cat_id: '',
            age_group: "other",
            gender: "Male",
            network_provider: "Airtel",
            customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
            content_type: 'video',
            impression: 0
          };
          analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
          analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
          const formData = new FormData();
          for (const key in analytics) {
            formData.append(key, analytics[key]);
          }
          formData.append("u_id", JSON.parse(userInfo).id);
          formData.append("country", res?.countryName);
          formData.append("country_code", res?.countryCode);
          formData.append("s_id", this.data.season_id);
          this.ds.analyticsSubmit(formData).subscribe((res: any) => {
            if (res.code == 1) {
              // this.ed.playDetailVideo.next(true);
            }
          });
        }
      } else {
        const userInfo: any = localStorage.getItem("taploginInfo");
        let analytics: any = {
          c_id: this.data.id,
          dod: "",
          dd: "",
          type: 2,
          content_title: this.data.title,
          total_duration: this.player.cache_.duration,
          pd: Math.floor(this.player.cache_.currentTime),
          cat_id: '',
          age_group: "other",
          gender: "Male",
          network_provider: "Airtel",
          customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
          content_type: 'video',
          impression: 0
        };
        analytics.dod = `{ "os_version": "6.0", "app_version":  "26.04.024", "network_type": "wifi", "network_provider": "" }`;
        analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
        const formData = new FormData();
        for (const key in analytics) {
          formData.append(key, analytics[key]);
        }
        formData.append("u_id", JSON.parse(userInfo).id);
        formData.append("country", res?.countryName);
        formData.append("country_code", res?.countryCode);
        this.ds.analyticsSubmit(formData).subscribe((res: any) => {
          if (res.code == 1) {
            // this.ed.playDetailVideo.next(true);
          }
        });
      }
    })
  }

  randomPositionAudio() {
    // document.addEventListener('click', function (event) {
    //   var myDiv: any = document.getElementsByClassName('vjs-icon-audio-main')[0];
    //   if (!myDiv.contains(event.target)) {
    //     $('#speedLevelV').hide();
    //   }
    // });
  }

  randomPositionQuality() {
    // document.addEventListener('click', function (event) {
    //   var myDivQuality: any = document.getElementsByClassName('vjs-icon-hd-main')[0];
    //   if (!myDivQuality.contains(event.target)) {
    //     // $('#bitrateLevels1').hide();
    //   }
    // });
  }

  onPlayerReady() {
    this.player.on("timeupdate", () => {

      if (this.isSubsInfo != 1 && this.free_preview == 1) {
        if (Math.floor(this.player.currentTime()) >= this.free_preview_duration) {
          this.mat.closeAll();
          this.router.navigate(["/subscribe"]);


        }
      }

    });
    if (this.data.drm != 1) {
      if (this.getBrowserName == 'firefox') {
        this.player.qualityMenu();
      } else if (this.getBrowserName == 'safari') {
        // this.player.hlsQualitySelector();
        this.getqualitycustom()
      } else {
        if (this.data.is_group == 1 && this.data.access_type == 'free' && this.data.drm == 0) {
          this.getqualitycustom()
        } else if (this.data.is_group == 0 && this.data.access_type == 'free' && this.data.drm == 0) {
          this.getqualitycustom()
        }

        // this.player.hlsQualitySelector();
        // this.getqualitycustom()
      }
    }


    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);

    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);

    if (this.data.access_type == "free" || this.data.drm == 0) {
      setTimeout(() => {
        // this.player.currentTime(this.data.play_duration)
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
    } else {
      if (this.data.access_type == 'paid' && this.data.drm == 1) {
        this.getqualitycustom();
        this.getqualitycustom();
      } else if (this.data.access_type == 'free' && this.data.drm == 1) {
        this.getqualitycustom();
        this.getqualitycustom();
      } else if (this.data.access_type == 'paid' && this.data.drm == 0) {
        this.getqualitycustom();
      }
    }

    // if (this.data.access_type == 'free') {
    //   setTimeout(() => {
    //     this.player.currentTime(this.data.play_duration)
    //   }, 1000);

    // }

    // JSON
    let language = [
      {
        "id": "hin",
        "name": "Hindi"
      },
      {
        "id": "ben",
        "name": "Bengali"
      },
      {
        "id": "urd",
        "name": "Urdu"
      },
      {
        "id": "pan",
        "name": "Punjabi"
      },
      {
        "id": "mar",
        "name": "Marathi"
      },
      {
        "id": "tel",
        "name": "Telugu"
      },
      {
        "id": "tam",
        "name": "Tamil"
      },
      {
        "id": "guj",
        "name": "Gujarati"
      },
      {
        "id": "kan",
        "name": "Kannada"
      },
      {
        "id": "ori",
        "name": "Oriya"
      },
      {
        "id": "mal",
        "name": "Malayalam"
      },
      {
        "id": "asm",
        "name": "Assamese"
      },
      {
        "id": "san",
        "name": "Sanskrit"
      },
      {
        "id": "ara",
        "name": "Arabic"
      },
      {
        "id": "eng",
        "name": "English"
      },
      {
        "id": "may",
        "name": "Bahasa Melayu"
      },
      {
        "id": "ind",
        "name": "Bahasa Indonesia"
      },
      {
        "id": "hi",
        "name": "Hindi"
      },
      {
        "id": "bn",
        "name": "Bengali"
      },
      {
        "id": "ur",
        "name": "Urdu"
      },
      {
        "id": "pa",
        "name": "Punjabi"
      },
      {
        "id": "mr",
        "name": "Marathi"
      },
      {
        "id": "te",
        "name": "Telugu"
      },
      {
        "id": "ta",
        "name": "Tamil"
      },
      {
        "id": "gu",
        "name": "Gujarati"
      },
      {
        "id": "kn",
        "name": "Kannada"
      },
      {
        "id": "or",
        "name": "Oriya"
      },
      {
        "id": "ml",
        "name": "Malayalam"
      },
      {
        "id": "as",
        "name": "Assamese"
      },
      {
        "id": "sa",
        "name": "Sanskrit"
      },
      {
        "id": "ar",
        "name": "Arabic"
      },
      {
        "id": "en",
        "name": "English"
      },
      {
        "id": "ms",
        "name": "Bahasa Melayu"
      },
      {
        "id": "id",
        "name": "Bahasa Indonesia"
      },
      {
        "id": "nl",
        "name": "Dutch"
      }
    ]

    // JSON

    this.player.on("loadeddata", () => {
      const tracks = this.player.textTracks();


      if (this.getUserText == '') {
        this.getSelctText = this.getTextTrack;
      } else {
        this.getSelctText = this.getUserText;
      }

      var hindiText = this.player.textTracks().tracks_.find((track: any) => {
        console.log(track);

        if (track.language !== '') {
          return track.language === this.getSelctText;
        } else {
          return track.label === this.getSelctText;
        }
      });

      console.log(hindiText);

      if (hindiText) {
        hindiText.mode = "showing";
      }

      console.log(tracks);

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (track.language != '') {
          const languageMatch = language.find(lang => lang.id === track.language);
          if (languageMatch) {
            track.label = languageMatch.name;
          }
        } else {
          const languageMatch = language.find(lang => lang.id === track.label);
          if (languageMatch) {
            track.label = languageMatch.name;
          }
        }
      }

      this.player.on("texttrackchange", () => {
        const currentSpeed = this.player.playbackRate();

        const activeTrack: any = Array.from(tracks).find((track: any) => track.mode === "showing");
        if (activeTrack) {
          if (activeTrack.id != '') {
            this.getUserText = activeTrack.id
          } else if (activeTrack.language != '') {
            this.getUserText = activeTrack.language
          } else {
            this.getUserText = activeTrack.label
          }
        }

        if (activeTrack) {
          if (activeTrack.label) {
            const eventParams = {
              item_id: this.videosrc[this.itemget].sources[0].id,
              item_name: this.videosrc[this.itemget].sources[0].title,
              item_type: 'video',
              video_length: Math.round(this.player.duration()),
              video_speed: currentSpeed,
              video_caption: activeTrack.label
            };
            this.analyticsService.logEvent('video_captions_change', eventParams);
          }
        }


      });

      if (this.player) {
        this.player.playbackRate(this.speedValue);
      } else {
        this.player.core.activePlayback.el.playbackRate = this.speedValue;
      }
    });

    this.player.on("loadeddata", () => {
      var audioTracks = this.player.audioTracks();
      // if(this.player.cache_.src.includes('mpd')) {
      //   var getTrack = this.player.audioTracks().tracks_[0];
      //   if(getTrack) {
      //     getTrack.enabled = true;
      //   }
      // }
      console.log(audioTracks);

      if (this.getUserAudio == '') {
        this.getSelctAudio = this.getLanguage
      } else {
        this.getSelctAudio = this.getUserAudio
      }

      var hindiAudio = this.player.audioTracks().tracks_.find((track: any) => {
        if (track.language !== '') {
          return track.language === this.getSelctAudio;
        } else {
          return track.label === this.getSelctAudio;
        }
      });

      if (hindiAudio) {
        hindiAudio.enabled = true;
      }

      for (var i = 0; i < audioTracks.tracks_.length; i++) {
        var track = audioTracks[i];
        if (track.language != '') {
          const languageMatch = language.find(lang => lang.id === track.language);
          if (languageMatch) {
            track.label = languageMatch.name
          }
        } else {
          const languageMatch = language.find(lang => lang.id === track.label);
          if (languageMatch) {
            track.label = languageMatch.name
          }
        }
      }

      audioTracks.addEventListener('change', () => {

        console.log(this.data);


        const selectedTrack: any = Array.from(audioTracks).find((track: any) => track.enabled);
        if (selectedTrack) {
          if (selectedTrack.language != '') {
            this.getUserAudio = selectedTrack.language
          } else {
            this.getUserAudio = selectedTrack.label
          }
        }
        const eventParams = {
          item_name: this.videosrc[this.itemget].sources[0].title,
          item_type: 'video',
          item_id: this.videosrc[this.itemget].sources[0].id,
          video_length: Math.round(this.player.duration()),
          audio_lang: this.getUserAudio,
        };
        this.analyticsService.logEvent('video_audiolang_change', eventParams);
      });
    });




    // this.player.on("loadeddata", () => {
    //   var tracks = this.player.textTracks();
    //   for (var i = 0; i < tracks.length; i++) {
    //     var track = tracks[i];
    //     console.log(track, "track")
    //     if (track.language === "nl") {
    //       track.label = "Dutch";
    //     } else if (track.language === "en") {
    //       track.label = "English"
    //     }
    //   }
    // });

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

            // var videoElement: any = document.getElementById('video-player');
            // videoElement.classList.add('rotate-landscape');
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
          // firebase.analytics().logEvent('VIDEO_ACTION', {
          //   'itemName': this.data.title,
          //   'itemType': this.data.content_type,
          //   'itemId': this.data.id,
          //   'action': 'start'
          // })
          this.player.play();
        }, 500);
      });


      // var buttonComponent = videoJs.getComponent("Button");
      // var settingButton = videoJs.extend(buttonComponent, {
      //   constructor: function () {
      //     buttonComponent.apply(this, arguments);
      //     this.addClass("vjs-icon-audio-main");
      //     this.controlText("Audio");
      //   },

      //   handleClick: (e: any) => {
      //     $("#speedLevelV").appendTo($(".vjs-icon-audio-main"));
      //     $("#speedLevelV").toggle();
      //     $('#bitrateLevels1').hide();
      //     $('.custom-quality-menu').hide()
      //     $('.vjs-icon-audio-main').css({ "display": "flex", "justify-content": "center", "align-items": "center" })
      //     this.randomPositionAudio()
      //   },
      // });
      // videoJs.registerComponent("settingButton", settingButton);
      // this.player.getChild("controlBar").addChild("settingButton", {}, 16);
    }, 500);

    // this.inactivityTimeout
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"]) {
      if (
        this.data.is_group == 1 &&
        this.data.groupInfo != null &&
        this.data.groupInfo.child.length != 0
      ) {
        this.maxcounter = 100
      }
    }
  }

  changePlaybackRate(value: any, event: any) {

    const eventParams = {
      item_name: this.data.title,
      item_type: this.data.content_type,
      item_id: this.data.id,
      video_length: Math.round(this.player.duration()),
      video_speed: value
    };
    this.analyticsService.logEvent('video_speed_change', eventParams);
    this.speedValue = value;
    $("ul li.activeModespeed").removeClass("activeModespeed");
    event.target.classList.value = 'activeModespeed'
    // $('#speedLevelV').hide();
    // setTimeout(() => {
    //   $('#bitrateLevels1').hide();
    // }, 1);
    // $('#speedLevelV').hide();
    // setTimeout(() => {
    //   $('.custom-quality-menu').hide()

    // }, 1);

    if (this.player) {
      this.player.playbackRate(value);
    } else {
      this.player.core.activePlayback.el.playbackRate = value;
    }

    $('#speedLevelV').hide()
  }
  playRental() {
    const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
      panelClass: 'rentalPop',
      width: "800px",
      data: { rent: this.rentalData }
    });



  }

  continueWatchClear() {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    var u_id = JSON.parse(userInfo);
    const formData = new FormData();
    if (this.data.is_group == 1) {
      formData.append("c_id", this.videosrc[this.itemget].sources[0].id);
    } else {
      formData.append("c_id", this.data.id);
    }
    formData.append("u_id", u_id?.id);
    this.ds.clearContinueWatching(formData).subscribe((res: any) => {
      if (res.code == 1) {
      }
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.analytics();
      console.log(Math.round(this.player.currentTime()));
      console.log(Math.round(this.player.duration()));

      setTimeout(() => {
        if (Math.round(this.player.currentTime()) >= Math.round(this.player.duration()) - 10) {
          this.continueWatchClear()
        }
        this.player.dispose();
      }, 1000);

      clearInterval(this.randomInter);


      const eventParams = {
        item_name: this.data.title,
        item_type: this.data.content_type,
        item_id: this.data.id,
        watch_time: Math.round(this.player.currentTime()),
        video_length: Math.round(this.player.duration())
      };
      this.analyticsService.logEvent('video_stop', eventParams);

    }
  }
}
