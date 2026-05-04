import { Component, OnInit, HostListener, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ProfileDialogComponent } from "src/app/shared/dialogBoxes/profile-dialog/profile-dialog.component";
import { AlertDialogComponent } from "src/app/shared/dialogBoxes/alert-dialog/alert-dialog.component";
import { DataService } from "src/app/services/data.service";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { delay, map } from "rxjs";
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
import { Meta, Title } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { ReadmoreDialogComponent } from "src/app/shared/dialogBoxes/readmore-dialog/readmore-dialog.component";
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
import { CountryLockPopupComponent } from "src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { SwalMsgService } from "src/app/services/swal-msg.service";
import Swal from 'sweetalert2';
//import * as amplitude from '@amplitude/analytics-browser';
declare var $: any;
declare var firebase: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
export interface userContentDescription {
  behaviour: any;
}

@Component({
  selector: "app-show-detail",
  templateUrl: "./show-detail.component.html",
  styleUrls: ["./show-detail.component.scss"],
})
export class ShowDetailComponent implements OnInit {
  isReadMore = true;
  ended: boolean = false;
  episodeBoolean: boolean = false;
  totalEpisodes: any;
  more_content: any = false;
  trailerurl: any;
  contentId: any;
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
  bannerData: any;

  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isloggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  hellData: any = [];
  navbarAd: any = [];
  navvar: any;
  ad_data: any;
  episodeValue: any;
  episodeChange: any;
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
  getBrowserName: any;
  defaultImages: any = [];
  vertical: any;
  rectangle: any;
  maindata: any = [];
  userId: any;
  user: any;
  navMain: any;
  navNew: any;
  USER_ACCOUNT_id: any;
  app_version: any;
  crownImg: any;
  cat_iid: any;
  session_gender: any;
  isOttLoggedIn: boolean = false;
  castData: any;
  isPageLoaded: boolean = false;
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
    private _location: Location,
    private DEC_SCR_IOS: IosDecrycptionService,
    private renderer: Renderer2,
    private swal: SwalMsgService
  ) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.timeZoneOffset = new Date();
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;
      }
    });
  }

  ngOnInit(): void {

    this.fetchData();
    this.getBrowserName = this.detectBrowserName();
    this.ed.hideNav.next(true);
    this.defaultImages = localStorage.getItem("defaultImages");
    $(window).scroll(() => {
      if ($(window).scrollTop() > 500) {
        this.ed.pauseDetailVideo.next(false);
      } else {
      }
    });

    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }

    this.impressionAnalytics();

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
    // this.cardCarousel = {
    //   slidesToShow: 8,
    //   dots: false,
    //   arrows: true,
    //   infinite: false,
    //   slidesToScroll: 4,
    //   autoplay: false,

    //   autoplaySpeed: 2000,
    //   responsive: [
    //     {
    //       breakpoint: 1024,
    //       settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 1,
    //         infinite: false,
    //         dots: false,
    //       },
    //     },
    //     {
    //       breakpoint: 600,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 1,
    //       },
    //     },
    //     {
    //       breakpoint: 480,
    //       settings: {
    //         slidesToShow: 2.5,
    //         slidesToScroll: 1,
    //       },
    //     },
    //   ],
    // };
    // this.similarCarousel = {
    //   slidesToShow: 5,
    //   dots: false,
    //   arrows: true,
    //   infinite: false,
    //   slidesToScroll: 4,
    //   autoplay: false,

    //   autoplaySpeed: 2000,
    //   responsive: [
    //     {
    //       breakpoint: 1024,
    //       settings: {
    //         slidesToShow: 3,
    //         slidesToScroll: 1,
    //         infinite: false,
    //         dots: false,
    //       },
    //     },
    //     {
    //       breakpoint: 600,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 1,
    //       },
    //     },
    //     {
    //       breakpoint: 480,
    //       settings: {
    //         slidesToShow: 2,
    //         slidesToScroll: 1,
    //       },
    //     },
    //   ],
    // };
    this.cardCarousel = {
      slidesToShow: 5,           // adjust for desktop
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dots: false,
      swipe: true,               // ✅ allow swipe
      swipeToSlide: true,
      autoplay: false,      // ✅ smooth finger drag
      touchThreshold: 100,       // ✅ controls swipe sensitivity (lower = faster swipe)
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 50
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 50   // ✅ smoother on mobile
          }
        },
        {
          breakpoint: 480,       // small mobile
          settings: {
            slidesToShow: 2,   // shows half next card (nice effect)
            slidesToScroll: 1,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 30
          }
        }
      ]
    }
    this.similarCarousel = {
      slidesToShow: 5,           // adjust for desktop
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dots: false,
      swipe: true,               // ✅ allow swipe
      swipeToSlide: true,
      autoplay: false,      // ✅ smooth finger drag
      touchThreshold: 100,       // ✅ controls swipe sensitivity (lower = faster swipe)
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 50
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 50   // ✅ smoother on mobile
          }
        },
        {
          breakpoint: 480,       // small mobile
          settings: {
            slidesToShow: 2,   // shows half next card (nice effect)
            slidesToScroll: 1,
            swipe: true,
            swipeToSlide: true,
            touchThreshold: 30
          }
        }
      ]
    };
    this._ar.paramMap.subscribe((params) => {
      window.scroll(0, 0);

      this.contentId = params.get("c_id");
      this._dd
        .getDescriptionData(this.contentId)
        .pipe(
          map((res: IResult) => {
            if (res.code == 1) {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);

              this.showData = decryptData.content;
              if (this.showData.id == "") {
                setTimeout(() => {
                  this.router.navigateByUrl("/404");
                }, 0);
              }
              console.log(this.showData);
              if (
                (this.showData.access_type == "paid" &&
                  this.showData.access_type == "free") ||
                this.showData.trailer_url == ""
              ) {
                localStorage.setItem("showVIdeoPLay", "1");
              }
              this.navMain = localStorage.getItem("navbarData");
              this.navNew = JSON.parse(this.navMain);
              this.updateMetaData()
              if (this.showData.category_ids != null) {
                this.navNew.forEach((data: any) => {
                  if (data.id == this.showData.category_ids[0]) {
                    localStorage.setItem("active", data.name);
                    this.ed.active.next(data.name);
                  }
                });
              }

              for (let i in this.showData.genre) {
                this.genre.push(this.showData.genre[i].id);
                this.genre_ids = this.genre.toString();
              }

              this.maindata = this.showData;
              localStorage.setItem("CreatOrderC_id", this.showData.id);
              this.agegroup = this.showData.age_group;
              if (this.isSubscribed == true) {
                localStorage.setItem("tarilerplay", "0");

                this.trailerurl = this.showData.url;
              } else if (this.showData.access_type == "free") {
                // this.trailerurl = this.showData.url;
                this.getm3u8Url(this.showData.id);
                setTimeout(() => {
                  this.showData.url = this.m3u8Main;
                  console.log(this.trailerurl);
                }, 300);
              } else {
                localStorage.setItem("tarilerplay", "1");

                this.trailerurl = this.showData.trailer_url;
              }
              if (this.showData.is_group == 0) {
                this.showData.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == "rectangle_16x9") {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 1080 ||
                        Number(img.width) == 854
                      ) {
                        this.bannerImg = thumb?.image_size[0].url;
                      } else if (thumb.layout == "") {
                        this.bannerImg = this.showData.thumbs[0].thumb.large;
                      }
                    });
                  }
                });
                if (this.bannerImg == "") {
                  this.bannerImg = JSON.parse(
                    this.defaultImages
                  ).rectangle.path;
                }
                // if (
                //   this.showData.thumbs[0].thumb.large != null ||
                //   this.showData.thumbs[0].thumb.large != ""
                // ) {
                //   this.bannerImg = this.showData.thumbs[0].thumb.large;
                // } else {
                //   this.bannerImg = JSON.parse(this.defaultImages).rectangle.path;
                // }
              } else if (this.showData.is_group == 1) {
                this.showData.groupInfo.child.forEach((thumb: any) => {
                  if (thumb.id == this.showData.season_id) {
                    this.episodesArray = thumb.episode_arrays;
                    this.selectedEpisode = this.episodesArray[0].offset;
                    if (thumb.total_episode > 10) {
                      this.episodeBoolean = true;
                    }

                    this.selected = thumb.id;
                    this.getData(thumb.id);

                    // var thumb = thumb.banner;
                    // if (thumb != null && thumb != '') {

                    //   thumb.filter((data: any) => {
                    //     if (
                    //       data.layout == "rectangle_16x9" &&
                    //       data.platform == "web"
                    //     ) {
                    //       data?.image_size.filter((img: any) => {
                    //         if (
                    //           Number(img.width) == 360 ||
                    //           Number(img.width) == 854
                    //         ) {
                    //           this.bannerImg = img.url;

                    //         } else if (this.bannerImg == "") {
                    //           this.bannerImg = JSON.parse(
                    //             this.defaultImages
                    //           ).rectangle.path;
                    //         }
                    //       });
                    //     }
                    //   });
                    // } else {
                    //   this.bannerImg = JSON.parse(
                    //     this.defaultImages
                    //   ).rectangle.path;
                    // }
                  }
                });

                this.showData.groupInfo.global_thumb.forEach(
                  (getthumb: any) => {
                    if (getthumb != null && getthumb != "") {
                      if (getthumb.layout == "rectangle_16x9") {
                        // getthumb?.image_size.filter((img: any) => {
                        //   if (
                        //     Number(img.width) == 360 ||
                        //     Number(img.width) == 854
                        //   ) {
                        //     this.bannerImg = img.url;

                        //   } else if (this.bannerImg == "") {
                        //     this.bannerImg = JSON.parse(
                        //       this.defaultImages
                        //     ).rectangle.path;
                        //   }
                        // });

                        this.bannerImg = getthumb.image_size[0].url;
                      }
                    } else {
                      this.bannerImg = JSON.parse(
                        this.defaultImages
                      ).rectangle.path;
                    }
                  }
                );
              }

              if (this.showData.is_group == 1) {
                this.seasonData = this.showData.groupInfo.child;

                this.getExtrasData();
                this.getReviewsData();
                this.getTrailersData();
              }
              this.getDescriptionData();
              this.getContentUserBehaviour();
              // this.meta.updateTag({ property: 'og:title', content: this.showData.title })
              // this.meta.updateTag({ property: 'og:description', content: this.showData.des })
              // this.meta.updateTag({ property: 'og:image', content: this.bannerImg })
              // // <meta property="og:type" content="website" />
              // this.meta.updateTag({ property: 'og:type', content: "website" })
              // this.meta.updateTag({ property: 'og:url', content: window.location.href })
            } else {
              this.router.navigateByUrl("/404");
            }
          })
        )
        .subscribe();
    });

    let ip: any = localStorage.getItem("ipSaveData") || {};

    this.navbarAd = localStorage.getItem("faqData");
    this.navvar = JSON.parse(this.navbarAd);

    this.ad_data = this.navvar.Website[0].navbar[0];

    this.app_version = localStorage.getItem("appVersion");
    this.getCrownImg();
  }

  fetchData() {
    // Simulating API/data loading delay
    setTimeout(() => {
      // Your API/data logic here
      this.isPageLoaded = true; // Set true when everything is ready
    }, 500); // Replace with actual data loading logic
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  showText() {
    this.isReadMore = !this.isReadMore;
  }

  copyLink() {
    const link = window.location.href; // Get the current URL
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard successfully!");
        this.swal.getSwalmsg("Link is copied successfully!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  }

  updateCononicalUrl(url: string) {
    let link: HTMLLinkElement = this.renderer.createElement("link");
    this.renderer.setAttribute(link, "rel", "canonical");
    this.renderer.setAttribute(link, "href", url);

    const head = document.getElementsByTagName("head")[0];
    const existingLink = document.querySelector("link[rel='canonical']");

    if (existingLink) {
      head.removeChild(existingLink);
    }

    head.appendChild(link);
  }

  updateMetaData() {
    if (this.showData.is_group == 1) {
      this.title.setTitle(this.showData.series_title + ' ' + this.showData.season_title)
      this.meta.updateTag({ name: 'description', content: this.showData.season_des });
    } else {
      this.title.setTitle(this.showData.title)
      this.meta.updateTag({ name: 'description', content: this.showData.des });
    }

    this.meta.updateTag({ name: 'keywords', content: this.showData.meta.genre });
    this.updateCononicalUrl('https://www.vive.movie/' + this.showData.permalink)
  }

  getData(event: any) {
    this._dd
      .getSeasonData(this.display_offset, event)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.seasonSelectData = decryptData.content;

            this.hellData = [];

            this.contentId = this.seasonSelectData[0].id;
            this.showData.groupInfo.child.forEach((thumb: any) => {
              if (thumb.id == event) {
                this.totalEpisodes = thumb.total_episode;

                this.episodesArray = thumb.episode_arrays;

                // this.selectedEpisode = this.episodesArray[0].offset;
                if (localStorage.getItem("episode") == "1") {
                  this.episodeValue = localStorage.getItem("episodeSelected");

                  let contentIndx = this.episodesArray.findIndex(
                    (x: any) => x.offset === this.episodeValue
                  );

                  this.selectedEpisode = this.episodesArray[contentIndx].offset;
                  this.getEpisodeData(this.selectedEpisode);
                } else {
                  this.selectedEpisode = this.episodesArray[0].offset;
                  localStorage.setItem("episodechanges", this.selectedEpisode);
                }
              }
            });

            this.seasonSelectData.map((category: any) => {
              if (category.is_ad == 1) {
              }
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
                    if (Number(img.width) == 1080 || Number(img.width) == 854) {
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

  onAnchorClick(event: any) {
    event.preventDefault();
  }
  EpisodeNavigation(data: any) {
    if (this.episodeChange == 1) {
      localStorage.setItem("episode", "1");
    }

    if (data.is_ad == 1) {
      window.open(data.ad_url);
    } else {
      if (this.isSubscribed) {
        this.router.navigate(["/" + data.permalink]);
        window.scroll(0, 0);
      } else {
        if (data.access_type == "paid") {
          console.log("qqqqq");
          this.router.navigate(["/subscribe"]);
        } else if (data.access_type == "free") {
          this.router.navigate(["/" + data.permalink]);
          window.scroll(0, 0);
        }
      }
    }
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

            console.log(this.seasonSelectData);
            this.hellData = [];

            this.contentId = this.seasonSelectData[0].id;
            this.seasonChanged();
            this.showData.groupInfo.child.forEach((thumb: any) => {
              if (thumb.id == event) {
                this.totalEpisodes = thumb.total_episode;

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
                    if (Number(img.width) == 1080 || Number(img.width) == 854) {
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
  seasonChanged() {
    this._dd
      .getDescriptionData(this.contentId)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.showData = decryptData.content;

          for (let i in this.showData.genre) {
            this.genre.push(this.showData.genre[i].id);
            this.genre_ids = this.genre.toString();
          }

          this.updateUrl();
          this.maindata = this.showData;
          this.agegroup = this.showData.age_group;
          if (this.isSubscribed == true) {
            this.trailerurl = this.showData.url;
          } else if (this.showData.access_type == "free") {
            this.getm3u8Url(this.showData.id);
            setTimeout(() => {
              this.showData.url = this.m3u8Main;
              console.log(this.trailerurl);
            }, 300);
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
                localStorage.setItem("episodeSelected", this.selectedEpisode);
                localStorage.setItem("episodechanges", this.selectedEpisode);
                if (thumb.total_episode > 10) {
                  localStorage.setItem("episodechanges", "0");
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

            this.getExtrasData();
            this.getReviewsData();
            this.getTrailersData();
          }
          this.getDescriptionData();
          this.getContentUserBehaviour();
        })
      )
      .subscribe();
  }
  updateUrl() {
    this._location.go(this.showData.permalink);
  }

  clearEpisode() {
    localStorage.setItem("episode", "0");
    localStorage.setItem("episodechanges", "0");
  }
  getFooterConfig() {
    const popup: any = localStorage.getItem("faqData");
    const dataPopup: any = JSON.parse(popup);
    this.bannerData = dataPopup.App[0].details_banner;
    if (
      this.bannerData &&
      this.bannerData.is_allow == 1 &&
      this.isSubsInfo != 1
    ) {
    }
    // this._dd.faqData().subscribe((res: any) => {

    //   this.bannerData = res.App[0].details_banner;

    // });
  }

  getEpisodeData(event: any) {
    this.episodeChange = 1;

    localStorage.setItem("episodeSelected", event);
    localStorage.setItem("episodechanges", event);

    this.seasonSelectData = [];
    this._dd
      .getSeasonData(Number(event), this.selected)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.seasonSelectData = decryptData.content;
            console.log(this.seasonSelectData);
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
                    if (Number(img.width) == 1080 || Number(img.width) == 854) {
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
                    if (Number(img.width) == 1080 || Number(img.width) == 854) {
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
                    if (Number(img.width) == 1080 || Number(img.width) == 854) {
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
  getReviewsData() {
    this._dd
      .getExtras(this.display_offset, this.showData.id, "review")
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.reviewData = decryptData.content;

            this.reviewData.map((category: any) => {
              category.totalSlides = 6;
              category.sliderImg = "";
              category.sliderIdentifier = "";
              category.layout_thumbs.forEach((thumb: any) => {
                if (thumb.layout == "rectangle_16x9") {
                  thumb?.image_size.filter((img: any) => {
                    if (Number(img.width) == 1080 || Number(img.width) == 854) {
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
          .getSimilarContent(
            this.display_offset,
            this.genre_ids,
            this.showData.id
          )
          .pipe(
            map((res: IResult) => {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.detailData = decryptData.content;
              console.log(this.detailData, "similar");

              this.detailData.map((category: any) => {
                if (category.is_group == 1 && category.groupInfo != null) {
                  if (
                    category.groupInfo.global_thumb != null &&
                    category.groupInfo.global_thumb.length != 0
                  ) {
                    category.groupInfo.global_thumb.forEach((thumb: any) => {
                      if (thumb != null) {
                        if (
                          thumb.layout == "rectangle_16x9" &&
                          thumb.platform == "global"
                        ) {
                          thumb?.image_size.filter((img: any) => {
                            if (
                              Number(img.width) == 1080 ||
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
                        if (
                          thumb.layout == "rectangle_16x9" &&
                          thumb.platform == "web"
                        ) {
                          thumb?.image_size.filter((img: any) => {
                            if (
                              Number(img.width) == 1080 ||
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
                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
                      thumb?.image_size.filter((img: any) => {
                        if (
                          Number(img.width) == 1080 ||
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
            })
          )
          .subscribe();
      } else {
        this._dd
          .getSimilarContentMovie(
            this.display_offset,
            this.genre_ids,
            this.showData.season_id
          )
          .pipe(
            map((res: IResult) => {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.detailData = decryptData.content;

              this.detailData.map((category: any) => {
                if (category.is_group == 1 && category.groupInfo != null) {
                  if (
                    category.groupInfo.global_thumb != null &&
                    category.groupInfo.global_thumb.length != 0
                  ) {
                    category.groupInfo.global_thumb.forEach((thumb: any) => {
                      if (thumb != null) {
                        if (
                          thumb.layout == "rectangle_16x9" &&
                          thumb.platform == "global"
                        ) {
                          thumb?.image_size.filter((img: any) => {
                            if (
                              Number(img.width) == 1080 ||
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
                        if (
                          thumb.layout == "rectangle_16x9" &&
                          thumb.platform == "web"
                        ) {
                          thumb?.image_size.filter((img: any) => {
                            if (
                              Number(img.width) == 1080 ||
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
                } else if (category.is_group == 0) {
                  category.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == "rectangle_16x9") {
                      thumb?.image_size.filter((img: any) => {
                        if (
                          Number(img.width) == 1080 ||
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
            })
          )
          .subscribe();
      }
    }
  }
  getepisodeid() {
    localStorage.setItem("showdetails", "1");
  }
  hoverShare() {
    $(".shareHoverRemove").hide();
    $(".shareRemove").show();
  }

  hoverShareRemove() {
    $(".shareHoverRemove").show();
    $(".shareRemove").hide();
  }

  hoverAddwatch() {
    $(".AddWatchHoverRemove").show();
    $(".addWatchRemove").hide();
    $(".hide3").hide();
  }

  hoverAddwatchRemove() {
    $(".AddWatchHoverRemove").hide();
    $(".addWatchRemove").show();
  }

  hoverTrailer() {
    $(".trailerHoverRemove").show();
    $(".trailerRemove").hide();
  }

  hoverRemoveTrailer() {
    $(".trailerHoverRemove").hide();
    $(".trailerRemove").show();
  }

  hoverTickwatch() {
    $(".hoverTickkRemove").show();
    $(".hovertickk").hide();
    $(".hide3").show();
  }

  hoverAddTickRemove() {
    $(".hoverTickkRemove").hide();
    $(".hovertickk").show();
    $(".hide3").hide();
  }

  showProfile() {
    this.ed.pauseDetailVideo.next(true);
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      panelClass: "profile",
      width: "540px",
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ed.pauseDetailVideo.next(false);
    });
  }

  showAlertDialog() {
    this.ed.pauseDetailVideo.next(true);
    const alertRef = this.dialog.open(AlertDialogComponent, {
      panelClass: "alertdialog",
      width: "360px",
    });

    alertRef.afterClosed().subscribe((result) => {
      this.ed.pauseDetailVideo.next(false);
    });
  }
  getContentUserBehaviour() {
    const userInfo: any = localStorage.getItem("taploginInfo");

    if (userInfo) {
      const USER_ACCOUNT: any = JSON.parse(userInfo);

      if (Object.keys(userInfo).length) {
        this._dd.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            if (decryptData.content_id.includes(this.contentId)) {
              this.userContentDescription.behaviour.favorite = 1;
            } else {
              this.userContentDescription.behaviour.favorite = 0;
            }
          }
        });
      }
    }
  }
  addRemoveToWatchlist(watcher: any, cat_id: any, category: any, title: any) {

    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      if (watcher === 1) {
        window.firebaseAnalytics.logEvent('ADD_TO_FAVOURITES', {
          itemName: title.title,
          itemType: title.content_type,
          itemId: title.id
        });
      } else {
        window.firebaseAnalytics.logEvent('REMOVE_TO_FAVOURITES', {
          itemName: title.title,
          itemType: title.content_type,
          itemId: title.id
        });
      }
    }
    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {

      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {

        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("content_id", this.contentId);
        formData.append("watchlist", watcher);
        formData.append("content_type", "video");
        formData.append("cat_id", cat_id);
        this._dd.addRemoveToWatchList(formData).subscribe((res) => {
          this.getContentUserBehaviour();
          this.getWatchlistData();
        });
        if (watcher == 1) {
        } else {
        }
      }
    } else if (!userIsLoggedIn) {
      this.ed.pauseDetailVideo.next(true);
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ed.pauseDetailVideo.next(false);
      });
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
          this.getWatchlistData();
        });
      }
    } else if (!userIsLoggedIn) {
      this.ed.pauseDetailVideo.next(true);
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ed.pauseDetailVideo.next(false);
      });
    }
  }

  playtrailor(data: any) {

    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    // if (data.content_publish.length != 0) {
    //   for (let i in data.content_publish) {
    //     this.countryAllowed.push(data.content_publish[i].country_code);
    //   }
    //   var a = this.countryAllowed.indexOf(detail.countryCode);
    //   if (a == -1 && data.content_publish[0].country_code != "A") {
    //     const dialogRef = this.dialog.open(CountryLockPopupComponent, {
    //       backdropClass: "popupBackdropClass",
    //       panelClass: "adultAgePopup",
    //       width: "390px",
    //     });
    //   } else {
    //     $('.trailerHoverRemove').hide()
    //     setTimeout(() => {
    //       this.ed.pauseDetailVideo.next(true);
    //     }, 500);

    //     localStorage.setItem('tarilerplay', "1")
    //     const event = data;
    //     const aged = data.age_group;
    //     this.videoJsData = data;
    //     let trailerURL = this.videoJsData.trailer_url;
    //     let mpdURL = this.videoJsData.url;
    //     this.videoJsData.url = trailerURL;

    //     setTimeout(() => {
    //       this.videoJsData.url = mpdURL;
    //     }, 1000);

    //     if (localStorage.getItem("taploginInfo") === null) {
    //       if (data.age_group >= 18 && data.age_group != 999) {
    //         const dialogRef = this.dialog.open(AdultAgePopupComponent, {
    //           panelClass: "adultAgePopup",
    //           width: "500px",
    //           data: { dat: event },
    //         });
    //         const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
    //           this.playVid = data;
    //           if (this.playVid) {
    //             this.videoJsPopup1();
    //           }
    //         });
    //       } else if (data.age_group == -1) {
    //         const dialogRef = this.dialog.open(AdultAgePopupComponent, {
    //           panelClass: "adultAgePopup",
    //           width: "500px",
    //           data: { dat: event },
    //         });
    //         const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
    //           this.playVid = data;
    //           if (this.playVid) {
    //             this.videoJsPopup1();
    //           }
    //         });
    //       } else {
    //         this.videoJsPopup1();
    //       }
    //     } else {
    //       var isSubscriberUser: any = localStorage.getItem("is_subscriber");
    //       var parental: any = localStorage.getItem("taploginInfo");
    //       var parental_read = JSON.parse(parental);
    //       var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
    //       if (ottLogged == "1") {
    //         if (parental_read.is_parental == 0) {
    //           this.videoJsPopup1();
    //         } else {
    //           if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
    //             if (Number(parental_read.restriction_level) == -1) {
    //               this.showPin1();
    //             } else if (Number(parental_read.restriction_level) == 999) {
    //               this.videoJsPopup1();
    //             } else if (Number(parental_read.restriction_level) < 999) {
    //               if (Number(aged) == 999) {
    //                 this.videoJsPopup1();
    //               } else if (Number(aged) >= Number(parental_read.restriction_level) || Number(aged) == -1) {
    //                 this.showPin1();
    //               } else {
    //                 this.videoJsPopup1();
    //               }
    //             }
    //           } else {
    //             this.videoJsPopup1();
    //           }
    //         }
    //       } else {
    //         this.videoJsPopup1();
    //       }
    //     }

    //     if (localStorage.getItem("taploginInfo") === null) {
    //       this.USER_ACCOUNT_id = "Unregistered user";
    //     } else {
    //       const taplogininfo: any = localStorage.getItem("taploginInfo");
    //       this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
    //     }
    //     if (localStorage.getItem("taploginInfo") === null) {
    //     } else {
    //       const is_subscriber: any = localStorage.getItem("is_subscriber")
    //       if (is_subscriber == '0') {
    //       } else {
    //       }
    //     }

    //     var deviceDetails: any = localStorage.getItem("deviceDetails");
    //     var deviceDetail = JSON.parse(deviceDetails);

    //     if (data.is_group == 1) {

    //     } else {

    //     }

    //   }
    // } else {
    $(".trailerHoverRemove").hide();
    localStorage.setItem("tarilerplay", "1");
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
    }, 500);


    const event = data;
    const aged = data.age_group;
    this.videoJsData = data;
    let trailerURL = this.videoJsData.trailer_url;
    let mpdURL = this.videoJsData.url;
    this.videoJsData.url = trailerURL;
    console.log(this.videoJsData, "url");
    // setTimeout(() => {
    //   this.videoJsData.url = mpdURL;
    // }, 1000);

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
              } else if (
                Number(aged) >= Number(parental_read.restriction_level) ||
                Number(aged) == -1
              ) {
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

    if (localStorage.getItem("taploginInfo") === null) {
      this.USER_ACCOUNT_id = "Unregistered user";
    } else {
      const taplogininfo: any = localStorage.getItem("taploginInfo");
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
      const is_subscriber: any = localStorage.getItem("is_subscriber");
      if (is_subscriber == "0") {
      } else {
      }
    }

    var deviceDetails: any = localStorage.getItem("deviceDetails");
    var deviceDetail = JSON.parse(deviceDetails);
    if (data.is_group == 1) {
    } else {
    }
  }

  // }

  addtoSign() {
    this.ed.pauseDetailVideo.next(true);
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "390px",
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ed.pauseDetailVideo.next(false);
    });
  }
  setShowData(e: any) {
    this.showData = e.content;
  }

  playvideo(data: any, age: any) {
    console.log(data);

    if (data.is_ad == 1) {
      window.open(data.ad_url);
    } else {
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      localStorage.setItem("tarilerplay", "0");
      setTimeout(() => {
        this.ed.pauseDetailVideo.next(true);
      }, 500);
      localStorage.setItem("getOrder", data.index);
      const event = data;
      const aged = data.age_group;
      localStorage.setItem("redirect", data.permalink);
      this.videoJsData = data;
      const subs = localStorage.getItem("ott_subscriptionPlan");
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        if (subs != null && JSON.parse(subs).packages_list.length) {
          const formData: any = new FormData();
          const userInfo: any = localStorage.getItem("taploginInfo") || {};
          const visitorIds: any = localStorage.getItem("device_id");
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
            if (
              (res.code == 0 && res.error == "Device limit exceeded") ||
              (res.code == 4 && res.error == "user deleted")
            ) {
              Swal.fire({
                icon: 'warning',
                title: 'Session Ended',
                text: res.error === "Device limit exceeded"
                  ? "You’ve reached the maximum number of devices allowed. Please log in again."
                  : "Your account has been removed. Please contact support if this is unexpected.",
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                iconColor: 'var(--theme-secondary-color)',
                background: '#fff',
                width: 400,
                padding: '2em',
                showConfirmButton: true,
                confirmButtonColor: 'var(--theme-secondary-color)',
                allowEscapeKey: false,
                customClass: {
                  popup: 'my-custom-popup',
                  title: 'swal-custom-title',
                  confirmButton: 'swal-custom-button'
                }
              }).then(() => {
                this.fcs.logoutProfile.next(true);
              });
            } else if (res.code == 1) {

              this.verifyStatus(data, aged, event);
            } else if (res.code == 2) {
              this.ed.isSubscribe.next(false);
              this.ed.alreadySubscriber.next(false);
              localStorage.setItem("is_subscriber", "0");
              this.verifyStatus(data, aged, event);
            }
          });
        } else {
          const formData: any = new FormData();
          const userInfo: any = localStorage.getItem("taploginInfo") || {};
          const visitorIds: any = localStorage.getItem("device_id");
          formData.append("customer_id", JSON.parse(userInfo).id);
          formData.append("device_unique_id", visitorIds);
          formData.append("session_status", "");
          formData.append("device", "");
          formData.append("device_count", "");
          formData.append("type", "");
          this.auth.isAllowed(formData).subscribe((res) => {
            if (
              (res.code == 0 && res.error == "Device limit exceeded") ||
              (res.code == 4 && res.error == "user deleted")
            ) {
              Swal.fire({
                icon: 'warning',
                title: 'Session Ended',
                text: res.error === "Device limit exceeded"
                  ? "You’ve reached the maximum number of devices allowed. Please log in again."
                  : "Your account has been removed. Please contact support if this is unexpected.",
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                iconColor: 'var(--theme-secondary-color)',
                background: '#fff',
                width: 400,
                padding: '2em',
                showConfirmButton: true,
                confirmButtonColor: 'var(--theme-secondary-color)',
                allowEscapeKey: false,
                customClass: {
                  popup: 'my-custom-popup',
                  title: 'swal-custom-title',
                  confirmButton: 'swal-custom-button'
                }
              }).then(() => {
                this.fcs.logoutProfile.next(true);
              });
            } else if (res.code == 1) {
              this.verifyStatus(data, aged, event);
            } else if (res.code == 2) {
              this.ed.isSubscribe.next(false);
              this.ed.alreadySubscriber.next(false);
              localStorage.setItem("is_subscriber", "0");
              this.verifyStatus(data, aged, event);
            }
          });
        }
      } else {
        const dialogRef = this.dialog.open(LoginModalDialogComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "logindialog",
          width: "390px",
          data: { name: "login" },
        });
      }
    }
  }

  verifyStatus(data: any, aged: any, event: any) {
    if (data.access_type == "free") {
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
          if (parental_read?.is_parental == 0) {
            this.videoJsPopup();
          } else {
            if (parental_read?.is_parental == 1 && isSubscriberUser == "1") {
              // if (Number(parental_read.restriction_level) == -1) {
              //   this.showPin();
              // } else if (Number(parental_read.restriction_level) == 999) {
              //   this.videoJsPopup();
              // } else if (
              //   (Number(parental_read.restriction_level) >= 18 &&
              //     Number(parental_read.restriction_level) < 999 &&
              //     Number(aged) == 999) ||
              //   (Number(parental_read.restriction_level) >= 18 &&
              //     Number(parental_read.restriction_level) < 999 &&
              //     Number(aged) == 16)
              // ) {
              //   this.videoJsPopup();
              // } else if (
              //   Number(parental_read.restriction_level) >= 18 &&
              //   Number(parental_read.restriction_level) < 999
              // ) {
              //   this.showPin();
              // } else if (
              //   Number(parental_read.restriction_level) >= 16 &&
              //   Number(parental_read.restriction_level) < 999 &&
              //   Number(aged) == 999
              // ) {
              //   this.videoJsPopup();
              // } else {
              //   this.showPin();
              // }
              if (Number(parental_read.restriction_level) == -1) {
                this.showPin();
              } else if (Number(parental_read.restriction_level) == 999) {
                this.videoJsPopup();
              } else if (Number(parental_read.restriction_level) < 999) {
                if (Number(aged) == 999) {
                  this.videoJsPopup();
                } else if (
                  Number(aged) >= Number(parental_read.restriction_level) ||
                  Number(aged) == -1
                ) {
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
      // this.videoJsPopup();x
      if (this.isSubscribed == true) {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read?.is_parental == 0) {
          this.videoJsPopup();
        } else {
          if (parental_read?.is_parental == 1 && isSubscriberUser == "1") {
            // if (Number(parental_read.restriction_level) == -1) {
            //   this.showPin();
            // } else if (Number(parental_read.restriction_level) == 999) {
            //   this.videoJsPopup();
            // } else if (
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(aged) == 999) ||
            //   (Number(parental_read.restriction_level) >= 18 &&
            //     Number(parental_read.restriction_level) < 999 &&
            //     Number(aged) == 16)
            // ) {
            //   this.videoJsPopup();
            // } else if (
            //   Number(parental_read.restriction_level) >= 18 &&
            //   Number(parental_read.restriction_level) < 999
            // ) {
            //   this.showPin();
            // } else if (
            //   Number(parental_read.restriction_level) >= 16 &&
            //   Number(parental_read.restriction_level) < 999 &&
            //   Number(aged) == 999
            // ) {
            //   this.videoJsPopup();
            // } else {
            //   this.showPin();
            // }
            if (Number(parental_read.restriction_level) == -1) {
              this.showPin();
            } else if (Number(parental_read.restriction_level) == 999) {
              this.videoJsPopup();
            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(aged) == 999) {
                this.videoJsPopup();
              } else if (
                Number(aged) >= Number(parental_read.restriction_level) ||
                Number(aged) == -1
              ) {
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
  goToSubscribe() {
    this.router.navigate(["/subscribe"]);
  }
  showPin() {
    this.ed.pauseDetailVideo.next(true);
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(ChechPinParentalComponent, {
        panelClass: "contactfooter",
        width: "390px",
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow = "auto";
        this.ed.pauseDetailVideo.next(false);
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
    this.ed.pauseDetailVideo.next(true);
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = "auto";
      this.ed.pauseDetailVideo.next(false);
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      //this.videoJsData.url=this.videoJsData.trailer_url
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
    if (this.getBrowserName == "safari") {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            this.m3u8Main = decryptData.url;
          }
        });
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            this.m3u8Main = decryptData.url;
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
            console.log(decryptData, "////////////");
            this.m3u8Main = decryptData.url;
          }
        });
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData, "aaaaaaaaaaaaaaaaaaaaaaa");
            this.m3u8Main = decryptData.url;
            console.log(decryptData, "jkk");
            console.log(this.m3u8Main, "aaaaaaa");
          }
        });
      }
    }
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

  // videoJsPopup() {
  //   localStorage.setItem('CreatOrderC_id', this.videoJsData.id);
  //   this.getm3u8Url(this.videoJsData.id)
  //   setTimeout(() => {
  //     this.videoJsData.url = this.m3u8Main
  //   }, 300);
  //   setTimeout(() => {
  //     if (this.dialog.openDialogs.length == 0) {
  //       const alertRef = this.dialog.open(VideojsDialogComponent, {
  //         maxWidth: "100vw",
  //         panelClass: "videojsplayer",
  //         maxHeight: "100vh",
  //         height: "calc(100% - 100px)",
  //         width: "100%",
  //         data: { url: this.videoJsData },
  //       });

  //     };
  //   }, 500);
  //   if (localStorage.getItem("taploginInfo") === null) {
  //   } else {
  //     const is_subscriber: any = localStorage.getItem("is_subscriber")
  //     if (is_subscriber == '0') {
  //     } else {
  //     }
  //   }

  // }

  videoJsPopup() {
    if (this.getBrowserName == "safari") {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this._dd
          .getMainUrl(this.videoJsData.id, this.user.id)
          .subscribe((res: any) => {
            if (res.code == 1) {
              this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
              let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
              this.videoJsData.url = decryptData.url;
              if (this.dialog.openDialogs.length == 0) {
                const alertRef = this.dialog.open(VideojsDialogComponent, {
                  maxWidth: "100vw",
                  panelClass: "videojsplayer",
                  maxHeight: "100vh",
                  height: "calc(100% - 100px)",
                  width: "100%",
                  data: { url: this.videoJsData },
                });
                alertRef.afterClosed().subscribe((result) => {
                  setTimeout(() => {
                    this.ed.pauseDetailVideo.next(false);
                  }, 500);
                });
              }
            }
          });
      } else {
        console.log(this.videoJsData.id, "llllllll");
        this._dd.getUnknownUrl(this.videoJsData.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            this.videoJsData.url = decryptData.url;
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: this.videoJsData },
              });
              alertRef.afterClosed().subscribe((result) => {
                setTimeout(() => {
                  this.ed.pauseDetailVideo.next(false);
                }, 500);
              });
            }
          }
        });
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this._dd
          .getMainUrl(this.videoJsData.id, this.user.id)
          .subscribe((res: any) => {
            if (res.code == 1) {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);

              this.videoJsData.url = decryptData.url;
              if (this.dialog.openDialogs.length == 0) {
                const alertRef = this.dialog.open(VideojsDialogComponent, {
                  maxWidth: "100vw",
                  panelClass: "videojsplayer",
                  maxHeight: "100vh",
                  height: "calc(100% - 100px)",
                  width: "100%",
                  data: { url: this.videoJsData },
                });
                alertRef.afterClosed().subscribe((result) => {
                  setTimeout(() => {
                    this.ed.pauseDetailVideo.next(false);
                  }, 500);
                });
              }
            }
          });
      } else {
        this._dd.getUnknownUrl(this.videoJsData.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.videoJsData.url = decryptData.url;
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: this.videoJsData },
              });
              alertRef.afterClosed().subscribe((result) => {
                setTimeout(() => {
                  this.ed.pauseDetailVideo.next(false);
                }, 500);
              });
            }
          }
        });
      }
    }

    localStorage.setItem("CreatOrderC_id", this.videoJsData.id);
    if (localStorage.getItem("taploginInfo") === null) {
    } else {
      const is_subscriber: any = localStorage.getItem("is_subscriber");
      if (is_subscriber == "0") {
      } else {
      }
    }
  }

  videoJsPopup1() {
    localStorage.setItem("CreatOrderC_id", this.videoJsData.id);

    //this.videoJsData.url=this.videoJsData.trailer_url
    this.videoJsData.url = this.videoJsData.trailer_url;
    console.log(this.videoJsData.url, "urll");


    const alertRef = this.dialog.open(VideojsDialogComponent, {
      maxWidth: "100vw",
      panelClass: "videojsplayer",
      maxHeight: "100vh",
      height: "calc(100% - 100px)",
      width: "100%",
      data: { url: this.videoJsData, trailerUrlPlay: "1" },
    });
    alertRef.afterClosed().subscribe((result) => {
      // this._dd.getDescriptionData(this.contentId)
      // .pipe(
      //   map((res: IResult) => {
      //     if (res.code == 1) {
      //       this.DEC_SER.getDecryptedData(res?.result);
      //       let decryptData = JSON.parse(this.DEC_SER.decryptData);
      //       this.showData = decryptData.content;
      //     }
      //   })
      // )
      // .subscribe();
    });
    if (localStorage.getItem("taploginInfo") === null) {
    } else {
      const is_subscriber: any = localStorage.getItem("is_subscriber");
      if (is_subscriber == "0") {
      } else {
      }
    }
  }
  more() {
    this.more_content = true;
  }
  less() {
    this.more_content = false;
  }
  showProfiles(data: any) {
    this.ed.pauseDetailVideo.next(true);

    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      backdropClass: "profileBackdropClass",
      panelClass: "profile",
      width: "670px",
      data: { data: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ed.pauseDetailVideo.next(false);
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
      this.router.navigate(['/']);
    }
    if (this.bannerPlayer) {
      this.bannerPlayer.dispose();
    }
  }

  ngOnDestroy(): void {
    this.ed.hideNav.next(false);
    if (this.bannerPlayer) {
      this.bannerPlayer.dispose();
    }
  }
  getWatchlistData() {
    this._dd.getWatchList(this.offset, this.max_counter).subscribe((res) => { });
  }
  sharing(type: string, url: any) {
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SHARE', {
        itemName: url.title,
        itemType: url.content_type,
        itemId: url.id
      });
    }
    const newLocal = "width=600,height=300";
    const share_url = url;

    if (type === "fb") {
      //  let link = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faltp.faste.tv%2F${this.cat}%2F${this.fbTitle}%2F${this.fbCid}&amp;src=sdkpreparse"`;
      // let link = `https://www.facebook.com/sharer/sharer.php?app_id=2407604909394715&sdk=joey&u=${share_url}`;
      let link = `https://www.facebook.com/sharer/sharer.php?&u=${share_url}`;
      //  let link=`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faltp.faste.tv%2F${url}&amp;src=sdkpreparse`;
      window.open(link, "Facebook", newLocal);
    } else if (type === "tweet") {
      // let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=ALTBalaji%0Aaltp.faste.tv/${url}`;
      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=vive%0A${url}`;
      window.open(urls, "TwitterWindow", newLocal);
    } else if (type === "copy") {
      navigator.clipboard.writeText(`${share_url}`);
    }
  }
  userInfo: any;
  userDetails: any;

  readmorepop(data: any) {
    const dialogRef = this.dialog.open(ReadmoreDialogComponent, {
      panelClass: "show-more",
      backdropClass: "popupBackdropClass",
      width: "600px",
      data: { name: data },
    });
    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = "auto";
    });
  }

  onCustomBanner(url: any) {
    this.customBannerClick("show_details_page_bottom", "detail_page", url);
  }
  customBannerClick(ad_type: any, ad_partner: any, url: any) { }

  getCrownImg() {
    this._dd.faqData().subscribe((res: any) => {
      this.crownImg = res.App[0].crown_logo;
    });
  }

  impressionAnalytics() {
    this._dd.apipip().subscribe((res: any) => {
      const userInfo: any = localStorage.getItem("taploginInfo");
      let allAnalytics: any = localStorage.getItem("ipSaveData");
      let allAnalyticsData = JSON.parse(allAnalytics);
      if (
        this.showData?.category_ids != "" ||
        this.showData?.category_ids[0] == "" ||
        this.showData?.category_ids[0] == null
      ) {
        this.cat_iid = "";
      } else {
        this.cat_iid = this.showData.category_ids[0];
      }

      if (JSON.parse(userInfo)?.gender == "") {
        this.session_gender = "others";
      } else {
        this.session_gender = JSON.parse(userInfo)?.gender;
      }
      let analytics: any = {
        c_id: this.showData.id,
        dod: "",
        dd: "",
        type: this.showData.is_live == "1" ? 1 : 2,
        content_title: this.showData.title,
        total_duration: 0,
        pd: 0,
        cat_id: this.cat_iid,
        gender: this.session_gender,
        network_provider: allAnalyticsData.connection.isp,
        customer_name: JSON.parse(userInfo).first_name
          ? JSON.parse(userInfo).first_name
          : "user",
        impression: 1,
      };
      analytics.dod = `{ "os_version": "${allAnalyticsData.userAgent.browserVersion}", "app_version": "2.8", "network_type": "${allAnalyticsData.connection.type}", "network_provider": "${allAnalyticsData.connection.isp}" }`;
      analytics.dd = `{ "make_model": "${this.deviceService.browser}", "os": "${this.deviceService.os}", "manufacturer": "${this.deviceService.deviceType}", "screen_resolution": "${window.innerWidth} * ${window.innerHeight}", "push_device_token": "", "device_type": "web", "platform": "web", "device_unique_id": "${this._FPS.deviceVisitorId}" }`;
      const formData = new FormData();
      for (const key in analytics) {
        formData.append(key, analytics[key]);
      }
      formData.append("u_id", userInfo ? JSON.parse(userInfo).id : 0);
      formData.append("country", allAnalyticsData?.countryName);
      formData.append("country_code", allAnalyticsData?.countryCode);
      formData.append("city", allAnalyticsData.city);
      this._dd.analyticsSubmit(formData).subscribe((res: any) => {
        if (res.code == 1) {
        }
      });
    });
  }
  // setMetaData(description: any) {
  //   this.metaService.updateTag({ property: 'og:title', content: pageTitle });

  // }

  getCastData(id: any) { }
}
