import { Component, OnInit, HostListener, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ProfileDialogComponent } from "src/app/shared/dialogBoxes/profile-dialog/profile-dialog.component";
import { AlertDialogComponent } from "src/app/shared/dialogBoxes/alert-dialog/alert-dialog.component";
import { DataService } from "src/app/services/data.service";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { map } from "rxjs";
import { IResult } from "src/app/shared/models/result.data";
import { VideojsDialogComponent } from "src/app/shared/videojs-dialog/videojs-dialog.component";
import { Location } from "@angular/common";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { ChechPinParentalComponent } from "src/app/shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { AdultAgePopupComponent } from "src/app/shared/dialogBoxes/adult-age-popup/adult-age-popup.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { AuthService } from "src/app/services/auth.service";
import { Meta, Title } from '@angular/platform-browser';
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
import { CountryLockPopupComponent } from "src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { videoJs } from "src/app/video-player/videojs";
import { ParentalOtpCreateComponent } from "src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";
declare var $: any;
export interface userContentDescription {
  behaviour: any;
}

@Component({
  selector: "app-show-detail",
  templateUrl: "./show-detail.component.html",
  styleUrls: ["./show-detail.component.scss"],
})
export class ShowDetailComponent implements OnInit {
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  isOttLoggedIn = false;
  isReadMore = true
  totalLikes: any;
  totalViews: any;
  ended: boolean = false;
  episodeBoolean: boolean = false;
  muted: boolean = true
  playing: boolean = true
  totalEpisodes: any
  more_content: any = false;
  trailerurl: any;
  contentId: any;
  rentalData: any
  showData: any = [];
  seasonData: any = [];
  cardCarousel: any;
  similarCarousel: any;
  selectedEpisode: any;
  windowSize: number = 0;
  display_offset: number = 0;
  detailData: any = [];
  m3u8Main: any;
  seasonSelectData: any = [];
  config: any;
  extrasData: any = [];
  selected1: any = "Season";
  trailerData: any = [];
  reviewData: any = [];
  genre: any = [];
  genre_ids: any;
  bannerImg: any;
  agegroup: any;
  countryAllowed: any = [];
  selected: any;
  isSubscribed = false;
  bannerPlayer: any;
  offset = 0;
  max_counter = 10;
  episodesArray: any = [];
  likeInProgress: boolean = false;
  bannerData: any;
  visitorId: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isloggedIn: any = localStorage.getItem('ott_isLoggedIn') || {};
  hellData: any = [];
  navbarAd: any = [];
  navvar: any;
  totalCountLikes: any
  ad_data: any
  userContentDescription: userContentDescription = {
    behaviour: {
      likes: "0",
      is_disliked: "0",
      favorite: "0",
      is_playback_allowed: "0",
      abused: "0",
      is_subscriber: "0",
      notification: "0",
      modified_date: "0",
    },
  };
  videoJsData: any;
  successs: any;
  watch: boolean | undefined;
  playVid: any;
  cat: any;
  fbTitle: any;
  fbCid: any;
  timeZoneOffset: any;
  getBrowserName: any
  defaultImages: any = [];
  vertical: any;
  rectangle: any;
  maindata: any = [];
  userId: any;
  user: any;
  navMain: any;
  navNew: any;
  USER_ACCOUNT_id: any
  hideicon: boolean = true;
  constructor(
    private auth: AuthService,
    private _FPS: FingerPrintService,
    private location: Location,
    private _ar: ActivatedRoute,
    private dialog: MatDialog,
    private _dd: DataService,
    private _hc: HomeCategoryUtilsService,
    private DEC_SER: DecryptService,
    private router: Router,
    private ed: ExchangeDataService,
    private fcs: FunctionCallingService,
    private deviceService: DeviceDetectorService,
    private meta: Meta,
    private title: Title,
    private DEC_SCR_IOS: IosDecrycptionService,
    private renderer: Renderer2,
    private analyticsService: AnalyticsService

  ) {

    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.timeZoneOffset = new Date();
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value
      }
    });
    this._ar.paramMap.subscribe((params) => {
      const ipSaveData = localStorage.getItem("ipSaveData");

      if (ipSaveData == null) {
        this._dd.apipip().subscribe((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const detail = res.countryCode
          if ((params.get("c_id") === '113788' || params.get("c_id") === '113787') && detail != 'IN') {
            window.location.href = 'https://live.artofliving.org';
          }
        })
      } else {
        const detail = JSON.parse(ipSaveData).countryCode;
        if ((params.get("c_id") === '113788' || params.get("c_id") === '113787') && detail != 'IN') {
          window.location.href = 'https://live.artofliving.org';
        }
      }

    })
  }

  ngOnInit(): void {

    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    this.getBrowserName = this.detectBrowserName()
    this.ed.hideNav.next(true);
    this.defaultImages = localStorage.getItem("defaultImages");
    $(window).scroll(() => {
      if ($(window).scrollTop() > 500) {
        this.ed.pauseDetailVideo.next(false);
      } else {
      }
    });



    this.getFooterConfig();
    this.config = {
      slidesToShow: 5,
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
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.windowSize = window.innerWidth;
    this.cardCarousel = {
      slidesToShow: 8,
      dots: false,
      arrows: true,
      infinite: false,
      slidesToScroll: 4,
      autoplay: false,

      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 1,
          },
        },
      ],
    };
    this.similarCarousel = {
      slidesToShow: 6,
      dots: false,
      arrows: true,
      infinite: false,
      slidesToScroll: 4,
      autoplay: false,

      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    };
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));
    this._ar.paramMap.subscribe((params) => {
      window.scroll(0, 0);
      this.contentId = params.get("c_id");
      if (this.contentId == '105003') {

      }
      this._dd
        .getDescriptionData(this.contentId)
        .pipe(
          map((res: IResult) => {
            if (res.code == 1) {


              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);

              this.showData = decryptData.content;
              console.log(this.showData, 'hello');
              if (this.showData.content_type != 'video') {
                this.router.navigateByUrl("/")
              }
              this.updateMetaData()

              this.getLikesData(this.showData.id)
              this.navMain = localStorage.getItem("navbarData");
              this.navNew = JSON.parse(this.navMain);

              this.navNew.forEach((data: any) => {
                if (data.id == this.showData.category_ids[0]) {
                  localStorage.setItem("active", data.category);
                  this.ed.active.next(data.category);
                }
              })

              for (let i in this.showData.genre) {
                this.genre.push(this.showData.genre[i].id);
                this.genre_ids = this.genre.toString();
              }

              this.maindata = this.showData;
              this.agegroup = this.showData.age_group;
              if (this.isSubscribed == true) {
                this.trailerurl = this.showData.url;
              } else if (this.showData.access_type == "free") {
                this.trailerurl = this.showData.url;
              } else {
                this.trailerurl = this.showData.trailer_url;
              }
              if (this.showData.is_group == 0) {
                if (this.showData.layout_thumbs != null) {
                  this.showData.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          this.bannerImg = thumb?.image_size[0].url;
                        }

                      });
                    }
                  });
                }
                else {
                  this.bannerImg = JSON.parse(this.defaultImages).rectangle.path;
                }
              }
              else if (this.showData.is_group == 1) {
                if (this.showData.groupInfo.global_thumb.length) {
                  this.showData.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "rectangle_16x9") {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            this.bannerImg = img.url;

                          } else if (this.bannerImg == "") {
                            this.bannerImg = thumb?.image_size.url
                          }
                        });
                      }
                    } else {
                      this.bannerImg = JSON.parse(this.defaultImages).rectangle.path;
                    }
                  });
                } else {
                  this.bannerImg = JSON.parse(this.defaultImages).rectangle.path;
                }

                this.showData.groupInfo.child.forEach((thumb: any) => {
                  if (thumb.id == this.showData.season_id) {
                    this.episodesArray = thumb.episode_arrays;
                    this.selectedEpisode = this.episodesArray[0].offset;
                    if (thumb.total_episode > 10) {
                      this.episodeBoolean = true;
                    }

                    this.selected = thumb.id;
                    console.log(thumb);
                    if (this.showData.is_group == 1 && this.showData.content_type == 'video') {
                      this.getData(thumb.id);
                    } else {
                      // this.albumdata(1640)
                    }
                    var thumb = thumb.banner;
                  }
                });
              }
              this.playVideoMiniPlayer(this.showData.trailer_url)
              if (this.showData.is_group == 1) {
                this.seasonData = this.showData.groupInfo.child;
              }
              this.getDescriptionData();
              this._dd.apipip().subscribe((res: any) => {
                const userInfo: any = localStorage.getItem("taploginInfo");
                let analytics: any = {
                  c_id: this.showData.id,
                  dod: "",
                  dd: "",
                  type: 2,
                  content_title: this.showData.title,
                  total_duration: 0,
                  pd: 0,
                  cat_id: '',
                  age_group: "other",
                  gender: "Male",
                  network_provider: "Airtel",
                  customer_name: JSON.parse(userInfo).full_name ? JSON.parse(userInfo).full_name : "user",
                  content_type: 'video',
                  impression: 1
                };
                analytics.dod = `{ "os_version": "6.0", "app_version": "26.04.024", "network_type": "wifi", "network_provider": "" }`;
                analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "android", "manufacturer": "HTC", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
                const formData = new FormData();
                for (const key in analytics) {
                  formData.append(key, analytics[key]);
                }
                // formData.append("u_id", userInfo ? JSON.parse(userInfo).id : 0);
                formData.append("u_id", JSON.parse(userInfo).id);
                formData.append("country", res?.countryName);
                formData.append("country_code", res?.countryCode);
                this._dd.analyticsSubmit(formData).subscribe((res: any) => {
                  if (res.code == 1) {
                  }
                });
              })
            } else {
              this.router.navigateByUrl("/404")
            }
          })
        )
        .subscribe();
    });

    let ip: any = localStorage.getItem("ipSaveData") || {};
    this.navbarAd = localStorage.getItem('faqData')
    this.navvar = JSON.parse(this.navbarAd)
    this.ad_data = this.navvar.Website[0].navbar[0];
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  showText() {
    this.isReadMore = !this.isReadMore
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

  updateCononicalUrl(url: string) {
    let link: HTMLLinkElement = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'canonical');
    this.renderer.setAttribute(link, 'href', url);

    const head = document.getElementsByTagName('head')[0];
    const existingLink = document.querySelector("link[rel='canonical']");

    if (existingLink) {
      head.removeChild(existingLink);
    }

    head.appendChild(link)
      ;
  }

  updateMetaData() {
    if (this.showData.seo_title != '') {
      this.title.setTitle(this.showData.seo_title);
    } else {
      if (this.showData.is_group == 1) {
        this.title.setTitle(this.showData.series_title + ' ' + this.showData.season_title);
      } else {
        this.title.setTitle(this.showData.title);
      }
    }

    if (this.showData.seo_description != '') {
      this.meta.updateTag({ name: 'description', content: this.showData.seo_description });
    } else {
      this.meta.updateTag({ name: 'description', content: this.showData.des });
    }

    if (this.showData.seo_keywords != '') {
      this.meta.updateTag({ name: 'keywords', content: this.showData.seo_keywords });
    } else {
      this.meta.updateTag({ name: 'keywords', content: this.showData.meta.genre });
    }
  }

  playVideoMiniPlayer(url: any) {
    if (url == "") {
      this.bannerPlayer = videoJs('my_video_1')
      this.bannerPlayer.load()

      this.bannerPlayer.src({
        src: "",
      })
      this.bannerPlayer.poster(this.bannerImg)
      this.hideicon = false;
    } else {
      this.bannerPlayer = videoJs('my_video_1')
      this.bannerPlayer.load()
      this.bannerPlayer.src({
        src: url,
      })
      this.hideicon = true;
    }
  }

  play() {
    this.bannerPlayer.play()
    this.playing = true
  }

  pause() {
    this.bannerPlayer.pause()
    this.playing = false
  }

  mute() {
    this.bannerPlayer.muted(true);
    if (this.bannerPlayer.muted()) {
      this.muted = true;
      this.bannerPlayer.volume(0);
    }
  }

  unmute() {
    this.dialog.closeAll();
    this.bannerPlayer.muted(false);
    if (!this.bannerPlayer.muted()) {
      this.muted = false;
      this.bannerPlayer.volume(1);
    }
  }




  fullscreen() {
    this.bannerPlayer.requestFullscreen();
    this.bannerPlayer.on("fullscreenchange", (e: any) => {
      if (this.bannerPlayer.isFullscreen() == true) {
        this.bannerPlayer.on("timeupdate", () => {
          if (this.bannerPlayer.userActive() == false) {

          } else {

          }
        });
        this.bannerPlayer.controls(true);
      } else {
        this.bannerPlayer.on("timeupdate", () => {
          if (this.bannerPlayer.userActive() == true) {
          }
        });
        this.bannerPlayer.controls(false);
      }
    });
  }

  getData(event: any) {
    this._dd
      .getSeasonData(this.display_offset, event)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {

            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData, "saeson_data");

            this.seasonSelectData = decryptData.content;
            console.log(this.seasonSelectData);
            this.hellData = [];


            this.contentId = this.seasonSelectData[0].id;
            this.showData.groupInfo.child.forEach((thumb: any) => {
              if (thumb.id == event) {
                this.totalEpisodes = thumb.total_episode
                this.episodesArray = thumb.episode_arrays;


                this.selectedEpisode = this.episodesArray[0].offset;
              }
            });

            this.seasonSelectData.map((category: any) => {
              this.hellData.push({
                content_id: category.id,
                is_favourite: category.is_favourite,
              });
              category.totalSlides = 6;
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
                      category.sliderIdentifier =
                        thumb?.image_size[0].identifier;
                    }
                  });
                }
              });


            });
          } else if (res.code == 0) {

            this.seasonSelectData = [];
            this.episodesArray = [];


          }
        })
      )
      .subscribe();
  }

  albumdata(season_id: any) {
    this._dd.getAlbumData(season_id, 200, 0).subscribe((res: any) => {

      if (res.code == 1) {
        console.log(res, "resonse");
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData.data, "reponse");

        this.seasonSelectData = decryptData.data.content;

        this.hellData = [];

        this.contentId = this.seasonSelectData[0].id;
        this.seasonChanged();
        this.showData.groupInfo.child.forEach((thumb: any) => {
          if (thumb.id == event) {
            this.totalEpisodes = thumb.total_episode
            this.episodesArray = thumb.episode_arrays;
            this.selectedEpisode = this.episodesArray[0].offset;
          }
        });

        this.seasonSelectData.map((category: any) => {
          this.hellData.push({
            content_id: category.id,
            is_favourite: category.is_favourite,
          });
          category.totalSlides = 6;
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
                  category.sliderIdentifier =
                    thumb?.image_size[0].identifier;
                }
              });
            }
          });
        });
      } else if (res.code == 0) {
        this.seasonSelectData = [];
        this.episodesArray = [];
      }
    })


  }

  getData2(event: any) {
    this._dd
      .getSeasonData(this.display_offset, event)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.seasonSelectData = decryptData.content;
            console.log(this.seasonSelectData)

            this.hellData = [];

            this.contentId = this.seasonSelectData[0].id;
            this.seasonChanged();

            this.showData.groupInfo.child.forEach((thumb: any) => {
              if (thumb.id == event) {
                this.totalEpisodes = thumb.total_episode
                this.episodesArray = thumb.episode_arrays;
                this.selectedEpisode = this.episodesArray[0].offset;
              }
            });

            this.seasonSelectData.map((category: any) => {
              this.hellData.push({
                content_id: category.id,
                is_favourite: category.is_favourite,
              });
              category.totalSlides = 6;
              category.sliderImg = "";
              category.sliderIdentifier = "";
              if (category.is_group == 0) {
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
              } else {
                if (category.groupInfo.global_thumb.length != 0) {
                  category.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "rectangle_16x9") {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            category.sliderImg = img.url;
                            category.sliderIdentifier = img.identifier;
                            this.bannerImg = img.url;
                            this.bannerPlayer.poster(this.bannerImg)
                          } else if (category.sliderImg == "") {
                            category.sliderImg = thumb?.image_size[0].url;
                            category.sliderIdentifier = thumb?.image_size[0].identifier;
                            this.bannerImg = img.url;
                            this.bannerPlayer.poster(this.bannerImg)
                          }
                        });
                      }
                    }
                  });
                } else {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
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
                    }
                  });
                }

              }
            });
          } else if (res.code == 0) {
            this.seasonSelectData = [];
            this.episodesArray = [];
            if (!this.seasonSelectData.length) {
              $(".no-data").css("min-height", "25vh");
            }
          }
        })
      )
      .subscribe();

  }
  seasonChanged() {
    this._dd
      .getDescriptionData(this.contentId)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.showData = decryptData.content;
          this.getLikesData(this.showData.id)

          for (let i in this.showData.genre) {
            this.genre.push(this.showData.genre[i].id);
            this.genre_ids = this.genre.toString();
          }

          this.updateUrl()
          this.maindata = this.showData;
          this.agegroup = this.showData.age_group;
          if (this.isSubscribed == true) {
            this.trailerurl = this.showData.url;
          } else if (this.showData.access_type == "free") {
            this.trailerurl = this.showData.url;
          } else {
            this.trailerurl = this.showData.trailer_url;
          }
          if (this.showData.is_group == 0) {
            if (
              this.showData.thumbs[0].thumb.large != null ||
              this.showData.thumbs[0].thumb.large != ""
            ) {
              this.bannerImg = this.showData.thumbs[0].thumb.large;
            } else {
              this.bannerImg = JSON.parse(this.defaultImages).rectangle.path;
            }
          } else if (this.showData.is_group == 1) {
            this.showData.groupInfo.child.forEach((thumb: any) => {
              if (thumb.id == this.showData.season_id) {
                this.episodesArray = thumb.episode_arrays;
                this.selectedEpisode = this.episodesArray[0].offset;
                if (thumb.total_episode > 10) {
                  this.episodeBoolean = true;
                }

                this.selected = thumb.id;

                var thumb = thumb.banner;
                if (thumb != null) {
                  thumb.filter((data: any) => {
                    if (
                      data.layout == "rectangle_16x9" &&
                      data.platform == "web"
                    ) {
                      data?.image_size.filter((img: any) => {
                        if (
                          Number(img.width) == 360 ||
                          Number(img.width) == 854
                        ) {
                          this.bannerImg = data?.image_size[0].url;
                        } else if (this.bannerImg == "") {
                          this.bannerImg = JSON.parse(
                            this.defaultImages
                          ).rectangle.path;
                        }
                      });
                    }
                  });
                } else {
                  this.bannerImg = JSON.parse(
                    this.defaultImages
                  ).rectangle.path;
                }
              }
            });
          }

          if (this.showData.is_group == 1) {
            this.seasonData = this.showData.groupInfo.child;
            console.log(this.seasonData, "kjhg;ljg")


          }
          this.getDescriptionData();
        })
      )
      .subscribe();
  }
  updateUrl() {
    this.location.go(this.showData.permalink)
  }
  getFooterConfig() {
    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
    this.bannerData = dataPopup.App[0].details_banner
    console.log(this.bannerData)
  }

  getEpisodeData(event: any) {
    this.seasonSelectData = [];
    this._dd
      .getSeasonData(Number(event), this.selected)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.seasonSelectData = decryptData.content;

            this.hellData = [];
            this.seasonSelectData.map((category: any) => {
              this.hellData.push({
                content_id: category.id,
                is_favourite: category.is_favourite,
              });
              category.totalSlides = 6;
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
                      category.sliderIdentifier =
                        thumb?.image_size[0].identifier;
                    }
                  });
                }
              });

            });
          } else if (res.code == 0) {
            this.seasonSelectData = [];

          }
        })
      )
      .subscribe();
  }
  getTrailersData() {
    this._dd
      .getExtras(this.display_offset, this.showData.id, "trailer")
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.trailerData = decryptData.content;

            this.trailerData.map((category: any) => {
              category.totalSlides = 6;
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
                      category.sliderIdentifier =
                        thumb?.image_size[0].identifier;
                    }
                  });
                }
              });
            });
          }
        })
      )
      .subscribe();
  }
  getExtrasData() {
    this._dd
      .getExtras(this.display_offset, this.showData.id, "extras")
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.extrasData = decryptData.content;

            this.extrasData.map((category: any) => {
              category.totalSlides = 6;
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
                      category.sliderIdentifier =
                        thumb?.image_size[0].identifier;
                    }
                  });
                }
              });
            });
          }
        })
      )
      .subscribe();
  }


  getDescriptionData() {
    if (this.genre_ids != undefined) {
      if (this.showData.season_id == 0) {
        this._dd
          .getSimilarContent(this.display_offset, this.genre_ids, this.showData.id)
          .pipe(
            map((res: IResult) => {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.detailData = decryptData.content;
              console.log(this.detailData, 'similarData');


              this.detailData.map((category: any) => {

                if (category.is_group == 1 && category.groupInfo != null) {
                  if (category.groupInfo.global_thumb != null && category.groupInfo.global_thumb.length != 0) {
                    category.groupInfo.global_thumb.forEach((thumb: any) => {
                      if (thumb != null) {

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
                        if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
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
                    if (thumb.layout == 'vertical_9x16') {
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
      } else {
        this._dd
          .getSimilarContentMovie(this.display_offset, this.genre_ids, this.showData.season_id)
          .pipe(
            map((res: IResult) => {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.detailData = decryptData.content;
              this.detailData.map((category: any) => {
                if (category.is_group == 1 && category.groupInfo != null) {
                  if (category.groupInfo.global_thumb != null && category.groupInfo.global_thumb.length != 0) {
                    category.groupInfo.global_thumb.forEach((thumb: any) => {
                      if (thumb != null) {

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
                        if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
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
                    if (thumb.layout == 'vertical_9x16') {
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
  }

  hoverShare() {
    $('.shareHoverRemove').hide()
    $('.shareRemove').show()
  }

  hoverShareRemove() {
    $('.shareHoverRemove').show()
    $('.shareRemove').hide()
  }

  hoverAddwatch() {
    $('.AddWatchHoverRemove').show()
    $('.addWatchRemove').hide()
    $('.hide3').hide()
  }

  hoverAddwatchRemove() {
    $('.AddWatchHoverRemove').hide()
    $('.addWatchRemove').show()
  }

  hoverTrailer() {
    $('.trailerHoverRemove').show()
    $('.trailerRemove').hide()
  }

  hoverRemoveTrailer() {
    $('.trailerHoverRemove').hide()
    $('.trailerRemove').show()
  }

  hoverTickwatch() {
    $('.hoverTickkRemove').show()
    $('.hovertickk').hide()
    $('.hide3').show()
  }

  hoverAddTickRemove() {
    $('.hoverTickkRemove').hide()
    $('.hovertickk').show()
    $('.hide3').hide()
  }

  showProfile() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      panelClass: "profile",
      width: "540px",
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  showAlertDialog() {
    const alertRef = this.dialog.open(AlertDialogComponent, {
      panelClass: "alertdialog",
      width: "360px",
    });
  }

  addRemoveToWatchlist(watcher: any, cat_id: any, category: any, title: any) {
    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {

      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {

        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        if (this.showData.is_group == 0) {

          formData.append("content_id", title.id);
        } else {
          formData.append("season_id", this.showData.season_id);
        }
        formData.append("favourite", watcher);
        this._dd.addRemoveToWatchList(formData).subscribe((res) => {
          if (res.code == 1) {
            if (watcher == 1) {
              const eventParams = {
                item_name: title.title,
                item_type: title.content_type,
                item_id: title.id,
              };
              this.analyticsService.logEvent('add_to_favorites', eventParams);
              this.userContentDescription.behaviour.favorite = 1
            } else {
              this.userContentDescription.behaviour.favorite = 0
            }

          }
        });
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


  addLikes(watchers: any, content_id: any) {
    console.log(content_id);

    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {
      const eventParams = {
        item_name: content_id.title,
        item_type: content_id.content_type,
        item_id: content_id.id,
        page_name: 'content_detail',
        series_id: content_id.series_id,
        season_id: content_id.season_id,
        item_value: content_id.acces_type,
      };
      this.analyticsService.logEvent('like_item', eventParams);
      const userInfo: any = localStorage.getItem("taploginInfo") || {};

      if (Object.keys(userInfo).length && !this.likeInProgress) {
        this.likeInProgress = true;

        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("like", watchers.toString());
        formData.append("content_id", content_id.id);

        this._dd.likeVeiwsCountPost(formData).subscribe((res) => {
          if (res.code == 1) {
            if (watchers == 1) {
              this.totalLikes += 1;
              this.userContentDescription.behaviour.likes = 1;
            } else {
              this.totalLikes -= 1;
              this.userContentDescription.behaviour.likes = 0;
            }
          }
          this.likeInProgress = false;
        }, (error) => {
          this.likeInProgress = false;
        });
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

  playtrailor(data: any) {
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    if (data.content_publish.length != 0) {
      for (let i in data.content_publish) {
        this.countryAllowed.push(data.content_publish[i].country_code);
      }
      var a = this.countryAllowed.indexOf(detail.countryCode);
      if (a == -1 && data.content_publish[0].country_code != "A") {
        const dialogRef = this.dialog.open(CountryLockPopupComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
        });
      } else {
        $('.trailerHoverRemove').hide()
        setTimeout(() => {
          this.ed.pauseDetailVideo.next(true);
        }, 500);

        localStorage.setItem('tarilerplay', "1")
        const event = data;
        const aged = data.age_group;
        this.videoJsData = data;
        let trailerURL = this.videoJsData.trailer_url;
        let mpdURL = this.videoJsData.url;
        this.videoJsData.url = trailerURL;

        setTimeout(() => {
          this.videoJsData.url = mpdURL;
        }, 1000);

        if (localStorage.getItem("taploginInfo") === null) {
          if (data.age_group >= 18 && data.age_group != 999) {
            const dialogRef = this.dialog.open(AdultAgePopupComponent, {
              panelClass: "adultAgePopup",
              width: "500px",
              data: { dat: event },
            });
            const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
              this.playVid = data;
              if (this.playVid) {
                this.videoJsPopup1();
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
                this.videoJsPopup1();
              }
            });
          } else {
            this.videoJsPopup1();
          }
        } else {
          var isSubscriberUser: any = localStorage.getItem("is_subscriber");
          var parental: any = localStorage.getItem("taploginInfo");
          var parental_read = JSON.parse(parental);
          var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
          if (ottLogged == "1") {
            if (parental_read.is_parental == 0) {
              this.videoJsPopup1();
            } else {
              if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
                if (Number(parental_read.restriction_level) == -1) {
                  this.showPin1();
                } else if (Number(parental_read.restriction_level) == 999) {
                  this.videoJsPopup1();
                } else if (Number(parental_read.restriction_level) < 999) {
                  if (Number(aged) == 999) {
                    this.videoJsPopup1();
                  } else if (Number(aged) >= Number(parental_read.restriction_level) || Number(aged) == -1) {
                    this.showPin1();
                  } else {
                    this.videoJsPopup1();
                  }
                }
              } else {
                this.videoJsPopup1();
              }
            }
          } else {
            this.videoJsPopup1();
          }
        }
        var deviceDetails: any = localStorage.getItem("deviceDetails");
        var deviceDetail = JSON.parse(deviceDetails);
      }
    } else {
      $('.trailerHoverRemove').hide()
      setTimeout(() => {
        this.ed.pauseDetailVideo.next(true);
      }, 500);
      localStorage.setItem('tarilerplay', "1")
      const event = data;
      const aged = data.age_group;
      this.videoJsData = data;
      let trailerURL = this.videoJsData.trailer_url;
      let mpdURL = this.videoJsData.url;
      this.videoJsData.url = trailerURL;

      setTimeout(() => {
        this.videoJsData.url = mpdURL;
      }, 1000);
      if (localStorage.getItem("taploginInfo") === null) {
        if (data.age_group >= 18 && data.age_group != 999) {
          const dialogRef = this.dialog.open(AdultAgePopupComponent, {
            panelClass: "adultAgePopup",
            width: "500px",
            data: { dat: event },
          });
          const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
            this.playVid = data;
            if (this.playVid) {
              this.videoJsPopup1();
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
              this.videoJsPopup1();
            }
          });
        } else {
          this.videoJsPopup1();
        }
      } else {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
        if (ottLogged == "1") {
          if (parental_read.is_parental == 0) {
            this.videoJsPopup1();
          } else {
            if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
              if (Number(parental_read.restriction_level) == -1) {
                this.showPin1();
              } else if (Number(parental_read.restriction_level) == 999) {
                this.videoJsPopup1();
              } else if (Number(parental_read.restriction_level) < 999) {
                if (Number(aged) == 999) {
                  this.videoJsPopup1();
                } else if (Number(aged) >= Number(parental_read.restriction_level) || Number(aged) == -1) {
                  this.showPin1();
                } else {
                  this.videoJsPopup1();
                }
              }
            } else {
              this.videoJsPopup1();
            }
          }
        } else {
          this.videoJsPopup1();
        }
      }
    }
  }

  playvideo(event: any) {
    if (this.bannerPlayer) {
      console.log(this.bannerPlayer);
      this.bannerPlayer.pause()
    }
    
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      console.log(event);
      this.videoJsData = event;
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
            if (event.is_event == 0) {
              this.videoJsPopup()
            } else {
              this.router.navigate(['/live'], { queryParams: { cat: event.id } });
            }
          } else if (res.code == 2) {
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data
            if (this.rentalData.price && this.rentalData.price !== 0 && this.rentalData.price != "") {
              this.playRental()
            } else {
              if (this.dialog.openDialogs.length == 0) {
                const dialogRef = this.dialog.open(CountryLockPopupComponent, {
                  backdropClass: 'popupBackdropClass',
                  panelClass: 'adultAgePopup',
                  width: "390px",
                });
              }
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
              if (event.is_event == 0) {
                this.videoJsPopup()
              } else {
                this.router.navigate(['/live'], { queryParams: { cat: event.id } });
              }
            })
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (event.access_type == 'paid' && event.is_allow != 1) {
              this.router.navigate(["/subscribe"]);
            } else {
              this.videoJsPopup()
            }
          }
        })
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

  playRental() {
    const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
      panelClass: 'rentalPop',
      width: "800px",
      data: { rent: this.rentalData }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.bannerPlayer.play()
    });

  }
  verifyStatus(data: any) {
    if (data?.is_event == 0) {
      if (data.access_type == 'free') {
        this.videoJsPopup()
      } else if (data.access_type == 'paid') {
        if (this.isSubscribed == false) {
          this.router.navigate(["/subscribe"]);
        } else {
          this.videoJsPopup()
        }
      }
    } else {
      this.router.navigate(['/live'], { queryParams: { cat: data.id } });
    }
  }

  showPin() {
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(ChechPinParentalComponent, {
        panelClass: "contactfooter",
        width: "390px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflowY = 'auto'
      });
      const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
        this.successs = e;

        if (this.successs) {
          this.videoJsPopup();
        }
      });
    }

  }

  showPin1() {
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflowY = 'auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;
      let trailerURL = this.videoJsData.trailer_url;
      let mpdURL = this.videoJsData.url;
      this.videoJsData.url = trailerURL;



      setTimeout(() => {
        this.videoJsData.url = mpdURL;


      }, 1000);
      if (this.successs) {
        this.videoJsPopup1();
      }
    });
  }

  getm3u8Url(id: any) {


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

  videoJsPopup() {
    this.dialog.closeAll()
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this._dd.getMainUrl(this.videoJsData.id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                this.videoJsData.url = decryptData.fairplay_url
              } else {
                this.videoJsData.url = decryptData.url
              }

            } else {
              this.videoJsData.url = decryptData.url
            }

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
                  this.bannerPlayer.play()
                });
              };
            }, 500);
          }
        })
      } else {
        this._dd.getMainUrl(this.videoJsData.id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                this.videoJsData.url = decryptData.fairplay_url
              } else {
                this.videoJsData.url = decryptData.url
              }

            } else {
              this.videoJsData.url = decryptData.url
            }
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
                  this.bannerPlayer.play()
                });
              };
            }, 500);

          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(this.videoJsData.id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.videoJsData.url = decryptData.url
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
                  this.bannerPlayer.play()
                });
              };
            }, 500);

          }
        })
      } else {
        this._dd.getMainUrl(this.videoJsData.id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.videoJsData.url = decryptData.url
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
                  this.bannerPlayer.play()
                });
              };
            }, 500);

          }
        })
      }
    }

    localStorage.setItem('miniplay', '0')
  }

  videoJsPopup1() {
    this.dialog.closeAll()
    this.videoJsData.url = this.videoJsData.trailer_url;
    if (this.dialog.openDialogs.length == 0) {
      const alertRef = this.dialog.open(VideojsDialogComponent, {
        maxWidth: "100vw",
        panelClass: "videojsplayer",
        maxHeight: "100vh",
        height: "calc(100% - 100px)",
        width: "100%",
        data: { url: this.videoJsData, trailerUrlPlay: '1' },
      });
      alertRef.afterClosed().subscribe((result) => {
      });
    }
    localStorage.setItem('miniplay', '0')
  }
  more() {
    this.more_content = true;
  }
  less() {
    this.more_content = false;
  }
  showProfiles(data: any) {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      backdropClass: "profileBackdropClass",
      panelClass: "profile",
      width: "670px",
      data: { data: data },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }
  onImgError(event: any, type: any) {

    if (type == "circle") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    } else if (type == "rectangle_16x9") {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path;
    } else if (type == "vertical_9x16") {
      event.target.src = JSON.parse(this.defaultImages).vertical.path;
    }
  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
  }

  ngOnDestroy(): void {
    this.ed.hideNav.next(false);
    if (this.bannerPlayer) {
      this.bannerPlayer.dispose();
    }

  }


  getLikesData(id: any) {
    this._dd.getUserData(id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      this.totalCountLikes = decryptData
      console.log(decryptData, 'dataaaa');
      if (this.showData.is_group == 0) {
        this.totalLikes = decryptData.Content_Data.total_likes
        this.totalViews = decryptData.Content_Data.total_views
        if (decryptData.Content_Data.is_liked == 1) {
          this.userContentDescription.behaviour.likes = 1
        } else {
          this.userContentDescription.behaviour.likes = 0
        }
        if (decryptData.Content_Data.is_favorite == 1) {
          this.userContentDescription.behaviour.favorite = 1
        } else {
          this.userContentDescription.behaviour.favorite = 0
        }
      } else {
        this.totalLikes = decryptData.Season_Data.total_likes
        this.totalViews = decryptData.Season_Data.total_views
        if (decryptData.Season_Data.is_liked == 1) {
          this.userContentDescription.behaviour.likes = 1
        } else {
          this.userContentDescription.behaviour.likes = 0
        }
        if (decryptData.Season_Data.is_favorite == 1) {
          this.userContentDescription.behaviour.favorite = 1
        } else {
          this.userContentDescription.behaviour.favorite = 0
        }
      }
    })
  }

  sharing(type: string, url: any) {
    const eventParams = {
      item_name: url.title,
      item_type: url.content_type,
      item_id: url.id,
    };
    this.analyticsService.logEvent('share', eventParams);

    const newLocal = "width=600,height=300";
    const share_url = url.share_url;
    if (type === "fb") {
      let link = `https://www.facebook.com/sharer/sharer.php?&u=${share_url}`
      window.open(link, "Facebook", newLocal);
    } else if (type === "tweet") {
      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=Altt%0A${url.share_url}`;
      window.open(urls, "TwitterWindow", newLocal);
    }
    else if (type === 'whatsapp') {
      let whatsappUrl = `https://api.whatsapp.com/send?text=${share_url}`;
      window.open(whatsappUrl, 'WhatsApp', newLocal);
    } else if (type === "copy") {
      navigator.clipboard.writeText(`${share_url}`);
    }
  }
  userInfo: any;
  userDetails: any;
  SimilarClick(data: any) {

    const eventParams = {
      item_id: data.id,
    };
    this.analyticsService.logEvent('recommendation_click', eventParams);
  }


  readmorepop(data: any) {
    // const dialogRef = this.dialog.open(ReadmoreDialogComponent, {
    //   panelClass: "show-more",
    //   backdropClass: "popupBackdropClass",
    //   width: "600px",
    //   data: { name: data },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   document.body.style.overflow = 'auto'
    // });
  }


}
