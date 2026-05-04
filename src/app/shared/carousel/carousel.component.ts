import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { NavigationEnd, Router } from "@angular/router";
import { videoJs } from "src/app/video-player/videojs";
import { IHomeCategory } from "../models/homecategory";
import { VideojsDialogComponent } from "src/app/shared/videojs-dialog/videojs-dialog.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { DataService } from "src/app/services/data.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DecryptService } from "src/app/services/decrypt.service";
import { AdultAgePopupComponent } from "../dialogBoxes/adult-age-popup/adult-age-popup.component";
import { ChechPinParentalComponent } from "../dialogBoxes/chech-pin-parental/chech-pin-parental.component";
import { CountryLockPopupComponent } from "../dialogBoxes/country-lock-popup/country-lock-popup.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { AuthService } from "src/app/services/auth.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { StorageService } from "src/app/services/storage.service";
import { map } from "rxjs";
import { NetworkConnectionService } from "src/app/services/network-connection.service";
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
import { url } from "inspector";
import { ClearWatchingConsentComponent } from "../dialogBoxes/clear-watching-consent/clear-watching-consent.component";
import { CancelSubscriptionSuccessComponent } from "../dialogBoxes/cancel-subscription-success/cancel-subscription-success.component";
import { IResult } from "src/app/shared/models/result.data";
import Swal from 'sweetalert2';
declare var $: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
require("videojs-contrib-quality-levels");
@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.scss"],
})
export class CarouselComponent implements OnInit, OnDestroy {
  GifUrl: any;
  defaultImages: any = [];
  DefaultBanner: any;
  newoffset = 12;
  @ViewChild("slickModal") slickModal: any;
  visible: boolean = false;
  videoArray = [];
  Math: any;
  visibleSlides = 4;
  logoutAlertShown:boolean = false;
  // showLeftArrow = false;
  // showRightArrow = false;
  isVersionChanged: boolean = false;
  isWebVersion: boolean = false;

  @HostListener("window:scroll", ["$event"])
  @HostListener("window:resize", ["$event"])


  // ngAfterViewInit() {
  //   this.vid1 = videoJs('carouselPlayerC0');
  //   if (this.vid1) {
  //     document.addEventListener("visibilitychange", () => {
  //       if (!this.vid1) return;
  //       if (document.visibilityState === "hidden") {
  //         this.vid1.pause();
  //       } else {
  //         this.vid1.play();
  //       }
  //     });
  //   }

  // }



  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.setDefaultWidths();
  //     // this.updateArrowVisibility();
  //   }, 0);
  //   const videos: NodeListOf<HTMLVideoElement> =
  //     this.el.nativeElement.querySelectorAll('video[id^="carouselPlayerC"]');

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         const videoEl = entry.target as HTMLVideoElement;

  //         if (!entry.isIntersecting) {
  //           // Pause when out of view
  //           if (!videoEl.paused) {
  //             console.log('Paused:', videoEl.id);
  //             videoEl.pause();
  //           }
  //         } else {
  //           // Play when back in view
  //           if (videoEl.paused) {
  //             console.log('Playing:', videoEl.id);
  //             videoEl.play().catch(err => {
  //               console.warn('Auto-play failed for', videoEl.id, err);
  //             });
  //           }
  //         }
  //       });
  //     },
  //     { threshold: 0.5 } // 50% should be visible
  //   );

  //   videos.forEach((video) => {
  //     observer.observe(video);
  //   });
  // }
  onResize(event: any) {
    this.checkIfMobile();
    console.log(this.isMobile, "mobile");
    localStorage.setItem('videoCarousel', "0")
    this.scrollValue = $(window).scrollTop();
    if (
      this.scrollValue >= 270 &&
      !this.parentaltest &&
      this.lock1 &&
      !this.agehide
    ) {
      if (
        this.homeCategoryData[0].auto_play == 1 ||
        localStorage.getItem("VideoAutoPlay") == "0"
      ) {
        this.vid1.pause();
        this.playing = true;
      }
    } else if (!this.parentaltest && this.lock1 && !this.agehide) {
      if (
        this.homeCategoryData[0].auto_play == 1 ||
        localStorage.getItem("VideoAutoPlay") == "0"
      ) {
        if (localStorage.getItem("videoCarousel") == "0" && localStorage.getItem('videoPlay') == '0') {
          this.vid1.play();
          this.playing = false;
        }
      }
    }
  }

  // getVersionApiData(): void {
  //   this._dd.versionAPi().subscribe((res: any) => {
  //     console.log('API Response:', res);

  //     this.DEC_SER.getDecryptedData(res?.result);
  //     let decryptData = JSON.parse(this.DEC_SER.decryptData);
  //     const newCategoryVersion = decryptData?.category_version;

  //     if (!newCategoryVersion) {
  //       // 🚫 No version found → do nothing
  //       return;
  //     }

  //     const oldVersion = localStorage.getItem('category_version');

  //     if (oldVersion && Number(newCategoryVersion) !== Number(oldVersion)) {
  //       // ✅ Only show popup when version actually changes
  //       this.isVersionChanged = true;
  //       Swal.fire({
  //         html: `
  //           <div style="text-align: center;">
  //             <img src="https://static.creatorott.com/configration/5006/5006_68c8fc7215f66.png" 
  //                  alt="vive" style="width: 100px; margin-bottom: 10px;" />
  //             <h2 class="heyy">Hey, We’ve Got a New Version!</h2>
  //             <div class="refresh">
  //               Refresh the page to experience the latest upgrades and smoother performance.
  //             </div>
  //             <button id="refreshBtn" style="
  //               padding: 8px 16px;
  //               background-color: var(--theme-secondary-color);
  //               border: none;
  //               color: white;
  //               font-size: 14px;
  //               border-radius: 4px;
  //               cursor: pointer;
  //             ">
  //             Refresh
  //             </button>
  //           </div>
  //         `,
  //         customClass: {
  //           popup: 'my-custom-popup'
  //         },
  //         showConfirmButton: false,
  //         allowOutsideClick: false,
  //         didOpen: () => {
  //           document.getElementById('refreshBtn')?.addEventListener('click', () => location.reload());
  //         }
  //       });

  //       // update after change
  //       localStorage.setItem('category_version', newCategoryVersion);
  //     } else if (!oldVersion) {
  //       // 🚫 First time no old version → just save, no popup
  //       localStorage.setItem('category_version', newCategoryVersion);
  //     }
  //   });
  // }

  // getJson() {
  //   const storedData = localStorage.getItem('faqData');
  //   if (!storedData) return;

  //   try {
  //     const parsedData = JSON.parse(storedData);
  //     const newVersion = parsedData?.Website?.[0]?.footer_menu?.footer_version?.web_version;

  //     if (!newVersion) {
  //       // 🚫 No version found → do nothing
  //       return;
  //     }

  //     const oldVersion = localStorage.getItem('app_old_version');

  //     if (oldVersion && newVersion > oldVersion) {
  //       // ✅ Only show when version actually changes
  //       this.isWebVersion = true;
  //       Swal.fire({
  //         html: `
  //           <div style="text-align: center;">
  //             <img src="https://static.creatorott.com/configration/5006/5006_68806bc59ea49.png" 
  //                  alt="vive" style="width: 100px; margin-bottom: 10px;" />
  //             <h2 class="heyy">Hey, We’ve Got a New Version!</h2>
  //             <div class="refresh">
  //               Refresh the page to experience the latest upgrades and smoother performance.
  //             </div>
  //             <button id="refreshBtn" style="
  //               padding: 8px 16px;
  //               background-color: var(--theme-secondary-color);
  //               border: none;
  //               color: white;
  //               font-size: 14px;
  //               border-radius: 4px;
  //               cursor: pointer;
  //             ">
  //             Refresh
  //             </button>
  //           </div>
  //         `,
  //         customClass: {
  //           popup: 'my-custom-popup'
  //         },
  //         showConfirmButton: false,
  //         allowOutsideClick: false,
  //         didOpen: () => {
  //           document.getElementById('refreshBtn')?.addEventListener('click', () => location.reload());
  //         }
  //       });

  //       localStorage.setItem('app_old_version', newVersion);
  //     } else if (!oldVersion) {
  //       // 🚫 First time no old version → just save, no popup
  //       localStorage.setItem('app_old_version', newVersion);
  //     }
  //   } catch (error) {
  //     console.error('Error parsing FAQ data', error);
  //   }
  // }


  closeVersionBanner() {
    this.isVersionChanged = false;

  }
  closeWebVersionBanner() {
    this.isWebVersion = false;
  }
  // updateArrowVisibility() {

  //   const wrapper = document.getElementById('hoverCarousel');
  //   if (!wrapper) return;

  //   const scrollLeft = wrapper.scrollLeft;
  //   const scrollWidth = wrapper.scrollWidth;
  //   const clientWidth = wrapper.clientWidth;
  //   this.showLeftArrow = scrollLeft > 0;
  //   this.showRightArrow = scrollLeft + clientWidth < scrollWidth - 1; // -1 to account for precision
  // }









  // expandCard(event: MouseEvent) {
  //   $('.arrow').hide();
  //   const target = event.currentTarget as HTMLElement;
  //   const wrapper = document.getElementById('hoverCarousel');
  //   if (!wrapper) return;

  //   const slides = wrapper.querySelectorAll('.super-carousel-slide');
  //   const containerWidth = wrapper.clientWidth;
  //   const defaultWidth = containerWidth / 5;
  //   const expandedWidth = containerWidth * 0.4;

  //   // 1. Reset all cards to default width
  //   slides.forEach(slide => {
  //     const el = slide as HTMLElement;
  //     el.style.width = ${defaultWidth}px;
  //   });

  //   // 2. Calculate current + future position
  //   const currentLeft = target.offsetLeft;
  //   const currentRight = currentLeft + expandedWidth;
  //   const visibleStart = wrapper.scrollLeft;
  //   const visibleEnd = visibleStart + containerWidth;

  //   // 3. Scroll if expanding will overflow on right
  //   if (currentRight > visibleEnd) {
  //     const scrollAmount = currentRight - visibleEnd + 16;
  //     wrapper.scrollLeft += scrollAmount;
  //   }

  //   // ✅ 4. Scroll if expanding will overflow on left
  //   if (currentLeft < visibleStart) {
  //     const scrollBack = visibleStart - currentLeft + 16;
  //     wrapper.scrollLeft -= scrollBack;
  //   }

  //   // 5. Finally expand the hovered card
  //   target.style.width = ${expandedWidth}px;
  // }




  currentIndex = 0; // which set of 5 is visible
  isScrollLocked = false;
  isHovering = false


  setDefaultWidths() {
    const wrapper = document.getElementById('hoverCarousel');
    if (!wrapper) return;
    const slides = wrapper.querySelectorAll<HTMLElement>('.super-carousel-slide');
    const containerWidth = wrapper.clientWidth;
    const defaultWidth = containerWidth / 5; // exactly 5 per view

    slides.forEach(slide => {
      slide.style.width = `${defaultWidth}px`;
      slide.style.transition = 'width 0.3s ease';
    });
    this.isHovering = false;
    this.updateArrowVisibility();
  }

  // --------------------
  // Hover expand logic
  // --------------------
  async expandCard(event: MouseEvent) {

    if (this.isScrollLocked) return;

    const target = event.currentTarget as HTMLElement;
    if (!target.classList.contains('super-carousel-slide')) return;

    const wrapper = document.getElementById('hoverCarousel');
    if (!wrapper) return;

    this.isHovering = true;
    this.updateArrowVisibility();
    const slides = wrapper.querySelectorAll<HTMLElement>('.super-carousel-slide');
    const containerWidth = wrapper.clientWidth;
    const defaultWidth = containerWidth / 5;
    const expandedWidth = containerWidth * 0.4;

    const index = Array.from(slides).indexOf(target);

    // Visible range in terms of indexes
    const firstVisibleIndex = this.currentIndex;
    const lastVisibleIndex = this.currentIndex + 4;
    // Reset widths before deciding anything
    slides.forEach(slide => slide.style.width = `${defaultWidth}px`);
    let needsScroll = false;

    // CASE 1: Hovered card is outside the visible 5 → scroll to its set
    if (index < firstVisibleIndex || index > lastVisibleIndex) {
      this.currentIndex = Math.floor(index / 5) * 5;
      needsScroll = true;
    }
    // CASE 2: Hovered card is first visible (under left arrow) → shift left
    else if (index === firstVisibleIndex && firstVisibleIndex > 0) {
      this.currentIndex -= 1 - 1;
      if (this.currentIndex < 0) this.currentIndex = 0;
      needsScroll = true;
    }
    // CASE 3: Hovered card is last visible (under right arrow) → shift right
    else if (index === lastVisibleIndex && lastVisibleIndex < slides.length - 1) {
      this.currentIndex += 1; // move set one step forward
      if (this.currentIndex > slides.length - 5) {
        this.currentIndex = slides.length - 5;
      }
      needsScroll = true;
    }

    else if (index >= slides.length - 1 && this.currentIndex !== slides.length - 4) {
      this.currentIndex = slides.length - 4;
      needsScroll = true;
    }

    if (needsScroll) {
      this.isScrollLocked = true;

      wrapper.scrollTo({
        left: this.currentIndex * defaultWidth,
        behavior: 'smooth'
      });

      setTimeout(() => {
        this.isScrollLocked = false;
        slides.forEach(slide => slide.style.width = `${defaultWidth}px`);
        target.style.width = `${expandedWidth}px`;
      }, 400);
    } else {
      target.style.width = `${expandedWidth}px`;
    }

    // else if (index >= slides.length - 1) {
    //   this.currentIndex = slides.length - 4;
    //   needsScroll = true;

    // }
    // else if (index === lastVisibleIndex && lastVisibleIndex < slides.length - 1) {
    //   this.currentIndex += 1;
    //   if (this.currentIndex > slides.length - 5) {
    //     this.currentIndex = slides.length - 5;
    //   }
    //   needsScroll = true;
    // }
    // // Fix: Last card only expands
    // else if (index === slides.length - 1) {
    //   needsScroll = false;
    // }

    // if (needsScroll) {
    //   this.isScrollLocked = true;
    //   wrapper.scrollTo({
    //     left: this.currentIndex * defaultWidth,
    //     behavior: 'smooth'
    //   });

    //   setTimeout(() => {
    //     this.isScrollLocked = false;
    //     slides.forEach(slide => slide.style.width = `${defaultWidth}px`);
    //     target.style.width = `${expandedWidth}px`;
    //   }, 400);
    // } else {
    //   target.style.width = `${expandedWidth}px`;
    // }
  }


  resetCards() {
    this.setDefaultWidths();
  }

  // --------------------
  // Scroll arrows logic
  // --------------------
  scrollLeft() {
    const wrapper = document.getElementById('hoverCarousel');
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll<HTMLElement>('.super-carousel-slide');
    const containerWidth = wrapper.clientWidth;
    const defaultWidth = containerWidth / 5;

    this.currentIndex -= 5;
    if (this.currentIndex < 0) this.currentIndex = 0;

    this.isScrollLocked = true;
    wrapper.scrollTo({
      left: this.currentIndex * defaultWidth,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isScrollLocked = false;
      this.updateArrowVisibility();
    }, 400);
  }

  scrollRight() {
    const wrapper = document.getElementById('hoverCarousel');
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll<HTMLElement>('.super-carousel-slide');
    const containerWidth = wrapper.clientWidth;
    const defaultWidth = containerWidth / 5;

    this.currentIndex += 5;
    if (this.currentIndex > slides.length - 5) {
      this.currentIndex = slides.length - 5;
    }

    this.isScrollLocked = true;
    wrapper.scrollTo({
      left: this.currentIndex * defaultWidth,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.isScrollLocked = false;
      this.updateArrowVisibility();
    }, 400);
  }

  // --------------------
  // Arrow visibility helper
  // --------------------
  updateArrowVisibility() {
    const leftArrow = document.querySelector('.prev') as HTMLElement;
    const rightArrow = document.querySelector('.next') as HTMLElement;
    const wrapper = document.getElementById('hoverCarousel');
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll<HTMLElement>('.super-carousel-slide');
    leftArrow.style.display = this.currentIndex > 0 ? 'block' : 'none';
    rightArrow.style.display =
      this.currentIndex < slides.length - 5 ? 'block' : 'none';
    if (this.isHovering) {
      // // Always show arrows while hovering
      // leftArrow.style.display = 'none';
      // rightArrow.style.display = 'none';
    } else {
      // Normal carousel logic

    }
  }




  hoverTimeout: any = null;

  playVideo(event: MouseEvent, idd: any) {
    const slide = event.currentTarget as HTMLElement;
    const video = slide.querySelector('.hover-video') as HTMLVideoElement;
    var tt = videoJs(idd);
    setTimeout(() => {
      tt.play();
    }, 1000);
    tt.volume(0);
    tt.muted(true);

    if (this.mutedStates[idd] === undefined) {
      this.mutedStates[idd] = true;
      tt.muted(true);
      tt.volume(0);
    }

  }

  pauseVideo(event: MouseEvent, iddd: any) {
    clearTimeout(this.hoverTimeout);
    const slide = event.currentTarget as HTMLElement;
    const video = slide.querySelector('.hover-video') as HTMLVideoElement;

    if (iddd) {
      var ttt = videoJs(iddd);
      setTimeout(() => {
        ttt.pause();
      }, 500);
    }

  }


  // toggleMute(event: MouseEvent,IDDD:any) {
  //   event.stopPropagation();
  //   const button = event.currentTarget as HTMLElement;
  //   const card = button.closest('.carousel-slide');
  //   const video = card?.querySelector('video') as HTMLVideoElement;

  //   if (IDDD) {
  //     const player = videoJs(IDDD);
  //     const isMuted = player.muted();
  //     var img = button.querySelector('img') as HTMLImageElement;

  //     if (isMuted) {
  //       player.muted(false);
  //       player.volume(1); // Optional: set full volume when unmuting
  //       img.src = 'assets/vive/volume-mob.svg'
  //     } else {
  //       player.muted(true);
  //       player.volume(0); // Optional: silence volume too
  //       img.src = 'assets/vive/volume-slash-mob.svg';
  //     }
  //   }


  // }


  mutedStates: { [key: string]: boolean } = {};

  toggleMute(videoId: string) {
    const player = videoJs(videoId);

    const isCurrentlyMuted = this.mutedStates[videoId] ?? true;
    const newMutedState = !isCurrentlyMuted;

    this.mutedStates[videoId] = newMutedState;
    player.muted(newMutedState);
    player.volume(newMutedState ? 0 : 1); // Optional: Set volume to 1 when unmuted
  }


  taploginInfo: any = localStorage.getItem("taploginInfo") || {};
  homeCategoryData: IHomeCategory[] = [];
  isOttLoggedIn = false;
  playing: boolean = false;
  muted: boolean = true;
  screenWidth: any;
  adasda: any;
  scrollValue: any;
  isMobile: boolean = window.innerWidth >= 768;
  screenHeight: any;
  USER_ACCOUNT_id: any;
  vid1: any;
  remove1: any;
  hideContinue: boolean = true;
  adaddwatch1: any;
  lock: boolean = true;
  lock1: boolean = true;
  idd: any;
  idd1: any;
  getAd: any;
  parentaltest: boolean = false;
  vid: any;
  hideShare = false;
  agefound: any;
  replaynews: boolean = true;
  video2: any;
  mutedBtn: boolean = false;
  mutedBtnHover: boolean = false;
  mutedHover: boolean = false
  contentId: any;
  getFaqData: any = [];
  replay: boolean = true;
  more_content: any = false;
  userId: any;
  imageshow: boolean = true;
  videoHide: any;
  video1: any;
  videoJsData: any;
  isSubscribed = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isLoggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  playVid: any;
  successs: any;
  addwatchlist: boolean = true;
  token: any;
  parentalicon: boolean = false;
  recapSeconds: any;
  recapSeconds1: any;
  removewatchlist: boolean = true;
  logIn: any;
  agehide = false;
  getdrm: any;
  introSeconds: any;
  values: any;
  introSeconds1: any;
  shareNovac: any;
  getAgeDuration: any;
  getres: any;
  getlive: any;
  user: any;
  carouselPlayer: any;
  creditSeconds: any;
  getBrowserName: any;
  creditSeconds1: any;
  m3u8Main: any;
  iconAuto: boolean = true;
  gettitle: any;
  timeZoneOffset: any;
  countryAllowed: any = [];
  hideicon: boolean = true;
  seaonGet: any;
  hellData: any = [];
  ids: any;
  connected: boolean = true;
  isadTrue: any;
  adLoop: any = [];
  navbarAd: any;
  navvar: any;
  ad_data: any;
  isGroupGet: any;
  getSeason: any;
  subscribedButton: any;
  subscribedButtonshow: any;
  getsubs: any;
  mainData: any;
  app_version: any;
  parental: any = localStorage.getItem("taploginInfo");
  parental_read: any;
  crownImg: any;
  parentaltesting: any;
  @Input() sdasd: any;
  stars: boolean[] = [];
  ratings: any = [];
  rating: number = 0;
  fullStars: number = 0;
  hasHalfStar: boolean = false;
  seasonSelectData: any = [];
  totalEpisodes: any;
  display_offset: number = 0;
  episodesArray: any = [];
  episodeValue: any;
  episodeChange: any;
  selectedEpisode: any;
  selected: any;
  episodeBoolean: boolean = false;
  showDetails = false; // Used to toggle hover effect
  liveImg: any;
  itemsToShow = 4;
  showMore = false;
  freeImg: any;
  scrollBinge: any = [];
  displayedShows: any = [];
  hover: boolean = false;
  tooltipText: string | null = null;
  @Input() set homeCategory(home: IHomeCategory[]) {
    this.homeCategoryData = home;
    home.map((category: any) => {
      category.config = {
        slidesToShow: Number(category.totalSlides ?? 0),
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
          slidesToShow: category.totalSlides ? 2.5 : 0,
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
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      home[0].cat_cntn.map((category: any) => {
        this.hellData.push({
          content_id: category.id,
          is_favourite: category.is_favourite,
          islive: category.is_live,
        });
      });
    }
    if (home.length) {
      home[0].cat_cntn.map((category: any) => {
        if (category.is_ad == 1) {
          this.isadTrue = 1;
          category.trailer_url = "";
        }
      });

      home.forEach((element) => {
        this.adasda = element;
      });

      this.adasda.cat_cntn.filter((catData: any) => {
        if (catData.is_ad == 1) {
        }
      });

      if (
        this.homeCategoryData[0].cat_cntn &&
        this.homeCategoryData[0].cat_cntn.length > 0
      ) {
        this.selectedSlide = this.homeCategoryData[0].cat_cntn[0];
      }

      if (this.homeCategoryData[0].cat_cntn[0].is_group == "1") {
        this.homeCategoryData[0].cat_cntn[0].groupInfo.child.forEach(
          (thumb: any) => {

            if (thumb.id == this.homeCategoryData[0].cat_cntn[0].season_id) {
              this.episodesArray = thumb.episode_arrays;
              this.selectedEpisode = this.episodesArray[0].offset;
              if (thumb.total_episode > 10) {
                this.episodeBoolean = true;
              }

              this.selected = thumb.id;
              this.getData(thumb.id);
            }
          }
        );
      }

      this.homeCategoryData.map((cat: any) => {
        if (cat.category_type == "Binge_it_all_vertically") {
          // this.cat
          this.displayedShows = cat.cat_cntn.length;
          this.scrollBinge = cat.cat_id;
        }
      });
    }
  }
  slideConfig = {
    slidesToShow: 1,
    dots: true,
    arrows: true,
    slidesToScroll: 1,
    autoplay: false,
    swipe: false,
    lazyLoad: 'ondemand', // only load visible slides
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
          swipeToSlide: true,
          draggable: true,
          touchMove: true,
        },
      },
    ],
  };
  slideConfig1 = {
    slidesToShow: 6,
    dots: false,
    arrows: true,
    slidesToScroll: 3,
    autoplay: false,
    swipe: false,
    lazyLoad: 'ondemand', // only load visible slides
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
          swipeToSlide: true,
          draggable: true,
          touchMove: true,
        },
      },
    ],
  };
  constructor(
    private el: ElementRef,
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
    private networkConnectionService: NetworkConnectionService,
    private DEC_SCR_IOS: IosDecrycptionService,
    private cdr: ChangeDetectorRef
  ) {
    this.ed.pauseDetailVideo.subscribe((value) => {
      if (value == true) {
        this.pausebtn();
      } else if (
        value == false &&
        !this.parentaltest &&
        this.lock1 &&
        !this.agehide
      ) {
        if (localStorage.getItem("videoCarousel") == "1") {
          this.playbtn();
        }
      }
    });

    setTimeout(() => {
      if (this.homeCategoryData[0]?.auto_play == 0 && this.iconAuto) {
        localStorage.setItem("VideoAutoPlay", "1");
      }
      if (this.homeCategoryData[0]?.auto_play == 1 && !this.iconAuto) {
        localStorage.setItem("VideoAutoPlay", "0");
      }
    }, 500);

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
    // this.getVersionApiData();
    // this.getJson();
    setTimeout(() => {
      this.ratings = this.homeCategoryData[0]?.cat_cntn.map((category: any) => {
        return {
          categoryName: category.name, // Replace 'name' with the actual property name for the category
          rating: category.rating,
        };
      });
    }, 2000);


    this.checkIfMobile();

    localStorage.setItem("videoCarousel", "0");
    this.parental_read = JSON.parse(this.parental);
    this.parentaltesting = this.parental_read?.is_parental;
    setTimeout(() => {
      localStorage.setItem("videoPlay", "0");
    }, 500);

    //rating

    // for guest userId
    var guestUser = String(Math.floor(100000000 + Math.random() * 900000000));
    var guestId = btoa(JSON.stringify(Number(guestUser)));
    if (guestUser.length != 9) {
      localStorage.setItem("guestId", guestId);
    }

    this.networkConnectionService.connected$.subscribe((connect) => {
      this.connected = connect;
      this.subscribedButton = localStorage.getItem("faqData");
      this.getFaqData = JSON.parse(this.subscribedButton);
      this.subscribedButtonshow = JSON.parse(
        this.subscribedButton
      ).Website[0].subscription_btn;
    });
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('DASHBOARD_SCREEN', {
        page: 'HOME'
      });
    }
    this.getBrowserName = this.detectBrowserName();

    this.dialog.closeAll();

    this.screenHeight = $(document).height();
    this.defaultImages = localStorage.getItem("defaultImages");
    this.DefaultBanner = JSON.parse(this.defaultImages).rectangle.path;
    $("#ageRestrict").hide();
    $("#hidedata123").hide();

    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    setTimeout(() => { }, 2000);
    setTimeout(() => {
      $(".gifsocial").toggle();
    }, 2000);

    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.app_version = localStorage.getItem("appVersion");
    this.getCrownImg();
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
          this.router.navigate(["/subscribe"]);
        } else if (data.access_type == "free") {
          this.router.navigate(["/" + data.permalink]);
          window.scroll(0, 0);
        }
      }
    }
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
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

  openAd(url: any, type: any) {
    if (url.ad_url != "") {
      window.open(url.ad_url);
    }
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

  getData(event: any) {
    this._dd
      .getSeasonData(this.display_offset, event)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.seasonSelectData = decryptData.content;
            console.log(this.seasonSelectData, "jjsdksjdk");

            this.hellData = [];

            this.contentId = this.seasonSelectData[0].id;
            this.homeCategoryData[0].cat_cntn[0].groupInfo.child.forEach(
              (thumb: any) => {
                if (thumb.id == event) {
                  this.totalEpisodes = thumb.total_episode;

                  this.episodesArray = thumb.episode_arrays;

                  // this.selectedEpisode = this.episodesArray[0].offset;
                  if (localStorage.getItem("episode") == "1") {
                    this.episodeValue = localStorage.getItem("episodeSelected");

                    let contentIndx = this.episodesArray.findIndex(
                      (x: any) => x.offset === this.episodeValue
                    );

                    this.selectedEpisode =
                      this.episodesArray[contentIndx].offset;
                    this.getEpisodeData(this.selectedEpisode);
                  } else {
                    this.selectedEpisode = this.episodesArray[0].offset;
                    localStorage.setItem(
                      "episodechanges",
                      this.selectedEpisode
                    );
                  }
                }
              }
            );

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

  add(add: any, id: any, cat_id: any, category: any, title: any) {
    if (id.is_favourite === 1 && this.isOttLoggedIn) {
      id.is_favourite = 0;

      if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
        window.firebaseAnalytics.logEvent('REMOVE_FROM_FAVOURITES', {
          ContentTitle: id.title,
          ContentId: id.id
        });
      }

    } else if (this.isOttLoggedIn) {

      if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
        window.firebaseAnalytics.logEvent('ADD_TO_FAVOURITES', {
          ContentTitle: id.title,
          ContentId: id.id
        });
      }

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
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (localStorage.getItem("VideoAutoPlay") == "0") {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
      });
    }
  }
  callShare(share: any) {
    this.hideShare = true;
    this.shareNovac = share;
    var t = "gif" + share;
    var x = document.getElementById(t);
    $("#gifsocial" + share).toggle();
  }
  saveUrl(type: any, cat: any) {
    localStorage.setItem("cat_type", type);
    localStorage.setItem("catt", cat.cat_id);
    let numb: any = localStorage.getItem("DisplayCount");

    this._dd
      .getHomeData(0, numb, this.sdasd)
      .pipe(map(() => { }))
      .subscribe();

    localStorage.setItem("prevUrl", this.router.url);
  }
  hidesocialicon() {
    $("#gifsocial" + this.shareNovac).hide();
    this.hideShare = false;
  }

  hoverPause(iddd: any, catId: any, mainurln: any) {
    $(`.${catId}`).find(".slick-next").show();
    $(`.${catId}`).find(".slick-prev").show();
    if (mainurln.trailer_url != "") {
      if (iddd) {
        var ttt = videoJs(iddd);
        setTimeout(() => {
          ttt.pause();
        }, 500);

        $(`.${catId}`).find(".slick-next").show();
        $(`.${catId}`).find(".slick-prev").show();
      }
    }
  }

  afterChangesss(_e: any, id: any, e: any) {
    if (e.last == true) {
      this.newoffset = e.currentSlide + 4;
      this._dd
        .getDescriptionDataListHome(this.newoffset, _e)
        .pipe(
          map((res: any) => {
            if (res.code == 1) {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.homeCategoryData.filter((data: any) => {
                if (data.cat_id == _e) {
                  for (let i in decryptData.content) {
                    data.cat_cntn.push(decryptData.content[i]);

                    data.cat_cntn.map((category: any) => {
                      if (category.multiple_layout != null) {
                        let selectedLayout: any = {};
                        selectedLayout = category.multiple_layout.find(
                          (multi: any) => multi.platform === "web"
                        );
                        if (selectedLayout !== undefined) {
                          category.totalSlides = selectedLayout.slider;
                          category.type = selectedLayout.layout;

                          category.sliderImg = "";
                          category.sliderIdentifier = "";

                          if (
                            category.is_group == 1 &&
                            category.groupInfo != null
                          ) {
                            if (category.groupInfo.global_thumb != null) {
                              category.groupInfo.global_thumb.forEach(
                                (thumb: any) => {
                                  if (thumb != null) {
                                    if (
                                      thumb.layout == "square" &&
                                      selectedLayout.layout == "circle"
                                    ) {
                                      thumb.layout = "circle";
                                    }
                                    if (thumb.layout == selectedLayout.layout) {
                                      thumb?.image_size.filter((img: any) => {
                                        if (
                                          Number(img.width) == 360 ||
                                          Number(img.width) == 854
                                        ) {
                                          category.sliderImg = img.url;
                                          category.sliderIdentifier =
                                            img.identifier;
                                        } else if (category.sliderImg == "") {
                                          category.sliderImg =
                                            thumb?.image_size[0].url;
                                          category.sliderIdentifier =
                                            thumb?.image_size[0].identifier;
                                        }
                                      });
                                    }
                                  }
                                }
                              );
                            } else if (category.groupInfo.thumbs != null) {
                              category.groupInfo.thumbs.forEach(
                                (thumb: any) => {
                                  if (thumb != null) {
                                    if (
                                      thumb.layout == "square" &&
                                      selectedLayout.layout == "circle"
                                    ) {
                                      thumb.layout = "circle";
                                    }
                                    if (thumb.layout == selectedLayout.layout) {
                                      thumb?.image_size.filter((img: any) => {
                                        if (
                                          Number(img.width) == 360 ||
                                          Number(img.width) == 854
                                        ) {
                                          category.sliderImg = img.url;
                                          category.sliderIdentifier =
                                            img.identifier;
                                        } else if (category.sliderImg == "") {
                                          category.sliderImg =
                                            thumb?.image_size[0].url;
                                          category.sliderIdentifier =
                                            thumb?.image_size[0].identifier;
                                        }
                                      });
                                    }
                                  }
                                }
                              );
                            }
                          } else if (category.is_group == 0) {
                            if (category.layout_thumbs != null) {
                              category.layout_thumbs.forEach((thumb: any) => {
                                if (
                                  thumb.layout == "square" &&
                                  selectedLayout.layout == "circle"
                                ) {
                                  thumb.layout = "circle";
                                }
                                if (thumb.layout == selectedLayout.layout) {
                                  thumb?.image_size.filter((img: any) => {
                                    if (
                                      Number(img.width) == 360 ||
                                      Number(img.width) == 854
                                    ) {
                                      category.sliderImg = img.url;
                                      category.sliderIdentifier =
                                        img.identifier;
                                    } else if (category.sliderImg == "") {
                                      category.sliderImg =
                                        thumb?.image_size[0].url;
                                      category.sliderIdentifier =
                                        thumb?.image_size[0].identifier;
                                    }
                                  });
                                }
                              });
                            }
                          }
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

  getrating() {
    this.rating = this.homeCategoryData[0].cat_cntn[0].trailer_url;
  }

  hidesocialicon1(idd: any, catId: any, ageget: any, main: any) {
    $(`.${catId}`).find(".slick-next").hide();
    $(`.${catId}`).find(".slick-prev").hide();
    if (main.trailer_url != "") {
      if (this.isSubsInfo == 1) {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);

        if (parental_read?.is_parental == 1 && isSubscriberUser == "1") {
          if (Number(parental_read.restriction_level) == -1) {
            // set image
            var tt = videoJs(idd);
            $(".carouselhide").find(".vjs-poster").css("display", "none");
          } else if (Number(parental_read.restriction_level) == 999) {
            var tt = videoJs(idd);
            setTimeout(() => {
              tt.play();
            }, 1000);
            tt.volume(0);
            tt.muted(true);
            $(".carouselhide").find(".vjs-poster").css("display", "none");
          } else if (Number(parental_read.restriction_level) < 999) {
            if (Number(ageget) == 999) {
              var tt = videoJs(idd);
              setTimeout(() => {
                tt.play();
              }, 1000);
              tt.volume(0);
              tt.muted(true);
              $(".carouselhide").find(".vjs-poster").css("display", "none");
            } else if (
              Number(ageget) >= Number(parental_read.restriction_level) ||
              Number(ageget) == -1
            ) {
              // set image
              var tt = videoJs(idd);
              $(".carouselhide").find(".vjs-poster").css("display", "none");
            } else {
              var tt = videoJs(idd);
              setTimeout(() => {
                tt.play();
              }, 1000);
              tt.volume(0);
              tt.muted(true);
              $(".carouselhide").find(".vjs-poster").css("display", "none");
            }
          }
        } else {
          var tt = videoJs(idd);
          setTimeout(() => {
            tt.play();
            tt.volume(0);
            tt.muted(true);
          }, 1000);

          $(".carouselhide").find(".vjs-poster").css("display", "none");
        }
      } else {
        var tt = videoJs(idd);
        setTimeout(() => {
          tt.play();
          tt.volume(0);
          tt.muted(true);
        }, 1000);
        $(".carouselhide").find(".vjs-poster").css("display", "none");
      }
    }
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
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
        this._dd.addRemoveToWatchList(formData).subscribe((res) => { });
      }
    } else if (!userIsLoggedIn) {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (localStorage.getItem("VideoAutoPlay") == "0") {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
      });
    }
  }

  pausebtn() {
    this.vid1.pause();
    this.vid1.on("pause", () => {
      this.playing = true;
    });
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



  mutebtnHover() {
    this.vid1.muted(true);
    if (this.vid1.muted()) {
      this.mutedHover = true;
      this.vid1.volume(0);
    }
  }

  unmutebtnHover() {
    this.vid1.muted(false);
    if (!this.vid1.muted()) {
      this.mutedHover = false;
      this.vid1.volume(1);
    }
  }

  replaybtnhome(getid: any) {
    $(this.vid1.posterImage.contentEl()).hide();
    $(`#${this.idd}`).find(".iconlayout").show();
    $(`#${this.idd1}`).find(".iconlayout").show();
    this.replay = true;
    this.vid1.play();
  }

  replaybtn(getid: any) {
    $(this.vid1.posterImage.contentEl()).hide();
    $(`#${getid}`).find(".iconlayout").show();
    this.replaynews = true;
    this.vid1.play();
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
      $(".getre").show();
      $("#ageRestrict").show();
    }, 500);

    setTimeout(() => {
      this.vid1.requestFullscreen();
      this.vid1.landscapeFullscreen();
    }, 300);

    this.vid1.on("fullscreenchange", (e: any) => {
      if (this.vid1.isFullscreen()) {
        // var handle = setInterval(drawAll, 20);
        // clearInterval(handle);
        // handle = 0;
        var ageget = $(`#${this.idd1}`).find("#agegroup")[0].className;

        $(`#${this.idd1}`).find(".getre");

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
        if (gettime != "") {
          this.getAgeDuration = JSON.parse(gettime).Player[0].UA_setting;
        }
        let xc = window.innerWidth;
        if (xc < 576) {
          setTimeout(() => {
            $(".carousel").slick("slickSetOption", "swipe", false);
          }, 500);
        }
        setTimeout(() => {
          setTimeout(() => {
            $(".getre").hide();
          }, this.getAgeDuration.duration_in_sec * 1000);
        }, 400);
      } else {
        setTimeout(() => {
          $(".getre").hide();
          $("#ageRestrict").hide();
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
        setTimeout(() => {
          $(".carousel").slick("slickSetOption", "swipe", true);
        }, 1000);
      }
    });
  }

  onAnchorClick(event: any) {
    event.preventDefault();
  }

  agepopup(ageId: any) {
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogRef = this.dialog.open(AdultAgePopupComponent, {
      disableClose: true,
      panelClass: "adultAgePopup",
      width: "500px",
      data: { dat: ageId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.homeCategoryData[0]["auto_play"] == 1) {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });

    const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
      this.iconAuto = false;
      localStorage.setItem("VideoAutoPlay", "0");
      this.slickInitPlay();
    });
  }

  // for autoplay

  setpin(getid: any, getIDM: any) {
    this.parentaltest = true;
    $(`#homeMain${getIDM}`).find(".iconlayout").hide();
    if (this.homeCategoryData[0]["auto_play"] == 1) {
      $(`#${getid}`).find(".iconage").show();
      this.vid1.pause();
    }
    //  if (this.values == "0") {

    //  }
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.homeCategoryData[0]["auto_play"] == 1) {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = "auto";
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.parentaltest = false;
        if (this.homeCategoryData[0]["auto_play"] == 0) {
          $(`#homeMain${getIDM}`).find(".iconlayout").show();
          $(".iconage").hide();
        }

        $(".iconage").hide();
        $(`#homeMain${getIDM}`).find(".iconlayout").show();
        $(`#${getid}`).find(".iconage").hide();
        this.vid1.play();
        this.vid1.volume(0);
      }
    });
  }

  parentalset(ageget: any, idset: any, getMId: any) {
    var pinsetid = idset;
    var isSubscriberUser: any = localStorage.getItem("is_subscriber");
    var parental: any = localStorage.getItem("taploginInfo");
    var parental_read = JSON.parse(parental);
    // this.parentaltest = parental_read.is_parental;
    if (isSubscriberUser == "1") {
      if (parental_read?.is_parental == 1) {
        if (Number(parental_read.restriction_level) == -1) {
          this.setpin(pinsetid, getMId);
        } else if (Number(parental_read.restriction_level) == 999) {
          var xc = window.innerWidth;
          if (xc < 576) {
            setTimeout(() => {
              this.vid1.play();
            }, 1000);
          } else {
            setTimeout(() => {
              this.vid1.play();
            }, 500);
          }

          setTimeout(() => {
            $(".iconage").hide();
          }, 500);

          this.vid1.volume(0);
          this.agehide = false;
          this.parentaltest = false;
          if (this.homeCategoryData[0]["auto_play"] == 0) {
            $(`#homeMain${getMId}`).find(".iconlayout").show();
            $(".iconage").hide();
          }
        } else if (Number(parental_read.restriction_level) < 999) {
          if (Number(ageget.slice(3)) == 999) {
            var xc = window.innerWidth;
            if (xc < 576) {
              setTimeout(() => {
                this.vid1.play();
              }, 1000);
            } else {
              setTimeout(() => {
                this.vid1.play();
              }, 500);
            }

            setTimeout(() => {
              $(".iconage").hide();
            }, 500);

            this.vid1.volume(0);
            this.agehide = false;
            this.parentaltest = false;
            if (this.homeCategoryData[0]["auto_play"] == 0) {
              $(`#homeMain${getMId}`).find(".iconlayout").show();
              $(".iconage").hide();
            }
          } else if (
            Number(ageget.slice(3)) >=
            Number(parental_read.restriction_level) ||
            Number(ageget.slice(3)) == -1
          ) {
            this.setpin(pinsetid, getMId);
          } else {
            var xc = window.innerWidth;
            if (xc < 576) {
              setTimeout(() => {
                this.vid1.play();
              }, 1000);
            } else {
              setTimeout(() => {
                this.vid1.play();
              }, 500);
            }

            setTimeout(() => {
              $(".iconage").hide();
            }, 500);

            this.vid1.volume(0);
            this.agehide = false;
            this.parentaltest = false;
            if (this.homeCategoryData[0]["auto_play"] == 0) {
              $(`#homeMain${getMId}`).find(".iconlayout").show();
              $(".iconage").hide();
            }
          }
        }
      } else {
        var xc = window.innerWidth;
        if (xc < 576) {
          setTimeout(() => {
            this.vid1.play();
          }, 1000);
        } else {
          setTimeout(() => {
            this.vid1.play();
          }, 500);
        }

        setTimeout(() => {
          $(".iconage").hide();
        }, 500);
        this.agehide = false;
        this.parentaltest = false;
        this.vid1.volume(0);
        $(`#homeMain${getMId}`).find(".iconlayout").show();

        setTimeout(() => {
          $(".parentalicon").hide();
          $(".iconage").hide();
        }, 100);
      }
    }
  }

  agePopUpAuto(ageId: any) {
    let isLoggedInfound = localStorage.getItem("ott_isLoggedIn");
    if (!this.isSubscribed && !isLoggedInfound) {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(AdultAgePopupComponent, {
        disableClose: true,
        panelClass: "adultAgePopup",
        width: "500px",
        data: { dat: ageId },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (this.homeCategoryData[0].auto_play == 1) {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
      });

      const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
        this.iconAuto = false;
        localStorage.setItem("videoCarousel", "0");
        localStorage.setItem("VideoAutoPlay", "0");
        this.autoPlay();
      });
    } else {
      this.autoPlay();
    }
  }

  // end

  autoPlay() {
    this.vid1.play();
    this.iconAuto = false;
    localStorage.setItem("videoCarousel", "0");
    localStorage.setItem("VideoAutoPlay", "0");
    this.mutedBtn = true;
  }

  slickInitPlay() {
    this.vid1 = videoJs(`carouselPlayerC0`);
    this.vid1.src({
      src: this.homeCategoryData[0].cat_cntn[0].trailer_url,
    });

    if (this.homeCategoryData[0].auto_play == 1) {
      
      this.vid1.play();
      this.mutedBtn = true;
      this.cdr.detectChanges();
    }

    if (this.homeCategoryData[0].cat_cntn[0].trailer_url == "") {
      this.hideicon = false;
    } else {
      this.hideicon = true;
    }
  }

  playParental() {
    if (this.dialog.openDialogs.length == 0) {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(ChechPinParentalComponent, {
        disableClose: true,
        panelClass: "contactfooter",
        width: "390px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (this.homeCategoryData[0].auto_play == 1) {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
      });

      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow = "auto";
      });
      const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
        this.successs = e;

        if (this.successs) {
          this.iconAuto = false;
          localStorage.setItem("VideoAutoPlay", "0");
          localStorage.setItem("videoCarousel", "0");

          this.parentaltest = false;
          this.slickInitPlay();
        }
      });
    }
  }

  playParentalAuto() {
    var parental: any = localStorage.getItem("taploginInfo");
    var parental_read = JSON.parse(parental);
    this.parentaltest = parental_read.is_parental;
    if (this.dialog.openDialogs.length == 0) {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(ChechPinParentalComponent, {
        disableClose: true,
        panelClass: "contactfooter",
        width: "390px",
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (this.homeCategoryData[0].auto_play == 1) {
          this.ed.pauseDetailVideo.next(false);
          document.body.style.overflow = "auto";
        }
        localStorage.setItem("videoCarousel", "0");
      });

      const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
        this.successs = e;

        if (this.successs) {
          this.iconAuto = false;
          localStorage.setItem("VideoAutoPlay", "0");
          localStorage.setItem("videoCarousel", "0");
          this.parentaltest = false;
          this.autoPlay();
        }
      });
    }
  }

  slickInit(event: any, home: any) {
    
    let ageRestiction = this.homeCategoryData[0].cat_cntn[0].age_group;
    var parental_trailer = this.homeCategoryData[0].cat_cntn[0].trailer_url;

    let isLoggedInfound = localStorage.getItem("ott_isLoggedIn");
    if (!isLoggedInfound) {
      if (
        this.homeCategoryData[0].auto_play == 1 &&
        ((ageRestiction >= 18 && ageRestiction != 999) ||
          (ageRestiction == -1 && ageRestiction != 999))
      ) {
        if (this.dialog.openDialogs.length == 0) {
          this.agepopup(ageRestiction);
        }
      } else {
        this.slickInitPlay();
      }
    } else {
      var isSubscriberUser: any = localStorage.getItem("is_subscriber");

      var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
      var parental: any = localStorage.getItem("taploginInfo");
      var parental_read = JSON.parse(parental);
      // this.parentaltest = parental_read.is_parental;
      if (ottLogged == "1") {
        if (parental_read.is_parental == 0) {
          this.slickInitPlay();
        } else {
          if (
            parental_read.is_parental == 1 &&
            isSubscriberUser == "1" &&
            this.homeCategoryData[0].auto_play == 1 &&
            parental_trailer
          ) {
            if (Number(parental_read.restriction_level) == -1) {
              this.playParental();
            } else if (Number(parental_read.restriction_level) == 999) {
              this.slickInitPlay();
            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(ageRestiction) == 999) {
                this.slickInitPlay();
              } else if (
                Number(ageRestiction) >=
                Number(parental_read.restriction_level) ||
                Number(ageRestiction) == -1
              ) {
                this.playParental();
              } else {
                this.slickInitPlay();
              }
            }
          } else {
            this.slickInitPlay();
          }
        }
      } else {
        this.slickInitPlay();
      }
    }
  }

  OnslideChangePlay(event: any) {
    if (this.homeCategoryData[0].auto_play == 0) {
      this.iconAuto = true;
      localStorage.setItem("VideoAutoPlay", "1");
    }

    if (this.vid1) {
      this.vid1.pause();
      this.vid1.currentTime(0);
      this.vid1 = videoJs(`carouselPlayerC${event.currentSlide}`);
      if (
        this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url == ""
      ) {
        this.hideicon = false;
      } else {
        this.hideicon = true;
      }
      this.vid1.src({
        src: this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url,
      });
      this.vid1.load();
      if (this.homeCategoryData[0].auto_play == 1) {
        this.vid1.play();
        this.mutedBtn = true;
      }
    } else {
      this.vid1 = videoJs(`carouselPlayerC${event.currentSlide}`);
      if (
        this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url == ""
      ) {
        this.hideicon = false;
      } else {
        this.hideicon = true;
      }
      this.vid1.src({
        src: this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url,
      });
      this.vid1.load();
      if (this.homeCategoryData[0].auto_play == 1) {
        this.vid1.play();
        this.mutedBtn = true;
      }
    }

    this.mutebtn();
  }

  parentalPlay1(event: any) {
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.homeCategoryData[0].auto_play == 1) {
        this.ed.pauseDetailVideo.next(false);
        document.body.style.overflow = "auto";
      }
      localStorage.setItem("videoCarousel", "0");
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.OnslideChangePlay(event);
        this.iconAuto = false;
        localStorage.setItem("VideoAutoPlay", "0");
        localStorage.setItem("videoCarousel", "0");
      }
    });
  }

  onVideoPlay(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (!video) return;
  
    const container = video.closest('.video-container');
    const lcpImg = container?.querySelector('.video-poster-lcp') as HTMLElement;
  
    if (lcpImg) {
      lcpImg.style.display = 'none';
    }
  }

  onSlideChange(event: any) {
    this.mutedBtn = false;
    let ageRestiction =
      this.homeCategoryData[0].cat_cntn[event.currentSlide].age_group;
    var parental_trailer =
      this.homeCategoryData[0].cat_cntn[event.currentSlide].trailer_url;
    let isLoggedInfound = localStorage.getItem("ott_isLoggedIn");
   
    if (!this.isSubscribed && !isLoggedInfound) {
      if (
        this.homeCategoryData[0].auto_play == 1 &&
        ((ageRestiction >= 18 && ageRestiction != 999) ||
          (ageRestiction == -1 && ageRestiction != 999))
      ) {
        this.ed.pauseDetailVideo.next(true);
        localStorage.setItem("videoCarousel", "1");
        const dialogRef = this.dialog.open(AdultAgePopupComponent, {
          disableClose: true,
          panelClass: "adultAgePopup",
          width: "500px",
          data: { dat: ageRestiction },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (this.homeCategoryData[0].auto_play == 1) {
            this.ed.pauseDetailVideo.next(false);
          }
          localStorage.setItem("videoCarousel", "0");
        });
        const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {

          this.OnslideChangePlay(event);
          this.iconAuto = false;
          localStorage.setItem("VideoAutoPlay", "0");
          localStorage.setItem("videoCarousel", "0");
        });
      } else {
        this.OnslideChangePlay(event);
      }
    } else {
      var isSubscriberUser: any = localStorage.getItem("is_subscriber");
      var parental: any = localStorage.getItem("taploginInfo");
      var parental_read = JSON.parse(parental);

      var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
      if (ottLogged == "1") {
        if (parental_read?.is_parental == 0) {
          this.OnslideChangePlay(event);
        } else {
          if (
            parental_read.is_parental == 1 &&
            isSubscriberUser == "1" &&
            this.homeCategoryData[0].auto_play == 1 &&
            parental_trailer
          ) {
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
              this.parentalPlay1(event);
            } else if (Number(parental_read.restriction_level) == 999) {
              this.OnslideChangePlay(event);
            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(ageRestiction) == 999) {
                this.OnslideChangePlay(event);
              } else if (
                Number(ageRestiction) >=
                Number(parental_read.restriction_level) ||
                Number(ageRestiction) == -1
              ) {
                this.parentalPlay1(event);
              } else {
                this.OnslideChangePlay(event);
              }
            }
          } else {
            this.OnslideChangePlay(event);
          }
        }
      } else {
        this.OnslideChangePlay(event);
      }
    }
  }

  selectedSlide: any = null;
  onImageClick(slide: any) {
    this.selectedSlide = slide; // Update the selected slide data
  }

  IsAutoplay(getMMID: any) {
    this.vid1.play();
    $(`#homeMain${getMMID}`).find(".iconlayout").show();
    this.parentaltest = false;
    $(".iconage").hide();
    this.agehide = false;
    this.vid1.play();
    this.vid1.volume(0);
  }

  breakpoint(_e: any) { }

  afterChange(_e: any, id: any, home: any) {
    if (this.getAd.slice(2) == "1") {
    }

    // if(this.homeCategoryData[0]["auto_play"] == 1){

    setTimeout(() => {
      this.getSeason.split("/").join(" ");
    }, 3000);

    if (this.homeCategoryData[0]["auto_play"] == 1) {
    }
    // if(this.isadTrue ==1){

    // }
  }

  adultpopup(age: any) {
    $(".player").on("click", () => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
      const dialogRef = this.dialog.open(AdultAgePopupComponent, {
        panelClass: "adultAgePopup",
        width: "500px",
        data: { dat: age },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (this.homeCategoryData[0]["auto_play"] == 1) {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem("videoCarousel", "0");
      });
    });
  }

  more() {
    this.more_content = true;
  }
  less() {
    this.more_content = false;
  }

  hoverShareMain() {
    $(".shareaddMain").hide();
    $(".shareremoveMain").show();
  }

  hoverShareRemoveMain() {
    $(".shareaddMain").show();
    $(".shareremoveMain").hide();
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
  gificon() {
    $(".addChangeHover").show();
    $(".addChange").hide();
  }

  gificonRemove() {
    $(".addChangeHover").hide();
    $(".addChange").show();
  }

  gifTickicon() {
    $(".gifTick").hide();
    $(".gifTickRemove").show();
  }

  gifRemoveTick() {
    $(".gifTick").show();
    $(".gifTickRemove").hide();
  }

  gificonShare() {
    $(".shareAddChangeHover").show();
    $(".shareAddChange").hide();
  }

  gificonRemoveShare() {
    $(".shareAddChangeHover").hide();
    $(".shareAddChange").show();
  }

  gificonMore() {
    $(".moreAddChangeHover").show();
    $(".moreAddChange").hide();
  }

  gificonRemoveMore() {
    $(".moreAddChangeHover").hide();
    $(".moreAddChange").show();
  }

  playCarousel(data: any) {
    var con = localStorage.setItem("videoPlay", "1");
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
            if (!this.logoutAlertShown) {   // 👈 only show once
              this.logoutAlertShown = true;

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
            }
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
            if (!this.logoutAlertShown) {   // 👈 only show once
              this.logoutAlertShown = true;

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
            }
          } else if (res.code == 1) {
            this.verifyStatus(data, aged, event);
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            this.verifyStatus(data, aged, event);
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
                this.verifyStatus(data, aged, event);
              });
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
    this.getsubs = localStorage.getItem("ott_subscriptionPlan");
    this.mainData = JSON.parse(this.getsubs).packages_list[0];

    var d: any = new Date(this.mainData.end_date);
    var x: any = new Date();

    var sd: any = new Date(x);

    var s = d - sd;
  }

  verifyStatus(data: any, aged: any, event: any) {
    if (data.access_type == "free") {
      if (localStorage.getItem("taploginInfo") === null) {
        if (data.age_group >= 18 && data.age_group != 999) {
          if (this.dialog.openDialogs.length == 0) {
            this.ed.pauseDetailVideo.next(true);
            localStorage.setItem("videoCarousel", "1");
            const dialogRef = this.dialog.open(AdultAgePopupComponent, {
              panelClass: "adultAgePopup",
              width: "500px",
              data: { dat: event },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (this.homeCategoryData[0]["auto_play"] == 1) {
                this.ed.pauseDetailVideo.next(false);
              }
              localStorage.setItem("videoCarousel", "0");
            });

            const sub = dialogRef.componentInstance.sen.subscribe(
              (data: any) => {
                this.playVid = data;
                if (this.playVid) {
                  this.videoJsPopup();
                }
              }
            );
          }
        } else if (data.age_group == -1) {
          if (this.dialog.openDialogs.length == 0) {
            this.ed.pauseDetailVideo.next(true);
            localStorage.setItem("videoCarousel", "1");
            const dialogRef = this.dialog.open(AdultAgePopupComponent, {
              panelClass: "adultAgePopup",
              width: "500px",
              data: { dat: event },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (this.homeCategoryData[0]["auto_play"] == 1) {
                this.ed.pauseDetailVideo.next(false);
              }
              localStorage.setItem("videoCarousel", "0");
            });
            const sub = dialogRef.componentInstance.sen.subscribe(
              (data: any) => {
                this.playVid = data;
                if (this.playVid) {
                  this.videoJsPopup();
                }
              }
            );
          }
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
            if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
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
      if (this.isSubscribed == true) {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read?.is_parental == 0) {
          this.videoJsPopup();
        } else {
          if (parental_read?.is_parental == 1 && isSubscriberUser == "1") {
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

  showPin() {
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.homeCategoryData[0]["auto_play"] == 1) {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.videoJsPopup();
      }
    });
  }

  // videoJsPopup() {
  //   localStorage.setItem('videoPlay', '1');
  //   localStorage.setItem('CreatOrderC_id', this.videoJsData.id)
  //   this.getm3u8Url(this.videoJsData.id);
  //   setTimeout(() => {
  //     this.videoJsData.url = this.m3u8Main;
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
  //       alertRef.afterClosed().subscribe((result) => {

  //       });
  //     }
  //     this.vid1.pause()
  //   }, 500);

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
              }
            }
          });
      } else {
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

  navigate(event: any, cat: any, aged: any, type: any, home: any, e: any) {
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SELECT_CONTENT', {
        itemName: event.title,
        itemType: event.content_type,
        itemId: event.id
      });
    }
    e.preventDefault();
    localStorage.setItem("catt", home.cat_id);
    localStorage.setItem("CreatOrderC_id", event.id);
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
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
            if (!this.logoutAlertShown) {   // 👈 only show once
              this.logoutAlertShown = true;

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
            }
          } else if (res.code == 1) {

            // if (event.content_publish.length) {
            //   for (let i in event.content_publish) {
            //     this.countryAllowed.push(event.content_publish[i].country_code);
            //   }
            //   var a = this.countryAllowed.indexOf(detail.countryCode);
            //   if (a == -1 && event.content_publish[0].country_code != "A") {
            //     const dialogRef = this.dialog.open(CountryLockPopupComponent, {
            //       backdropClass: "popupBackdropClass",
            //       panelClass: "adultAgePopup",
            //       width: "390px",
            //     });

            //   } else {
            //     this.navigationFunction(event, cat, aged, type);
            //   }
            // } else {
            this.navigationFunction(event, cat, aged, type);
            // }
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            // if (event.content_publish.length) {
            //   for (let i in event.content_publish) {
            //     this.countryAllowed.push(event.content_publish[i].country_code);
            //   }
            //   var a = this.countryAllowed.indexOf(detail.countryCode);
            //   if (a == -1 && event.content_publish[0].country_code != "A") {
            //     const dialogRef = this.dialog.open(CountryLockPopupComponent, {
            //       backdropClass: "popupBackdropClass",
            //       panelClass: "adultAgePopup",
            //       width: "390px",
            //     });
            //   } else {
            //     this.navigationFunction(event, cat, aged, type);
            //   }
            // } else {
            this.navigationFunction(event, cat, aged, type);
            // }
          }
        });
      } else {
        const formData: any = new FormData();
        const userInfo: any = localStorage.getItem("taploginInfo") || {};
        const visitorIds: any = localStorage.getItem("device_id");
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append("session_status", "");
        formData.append("device", '"web"');
        formData.append("device_count", "");
        formData.append("type", "");
        this.auth.isAllowed(formData).subscribe((res) => {
          if (
            (res.code == 0 && res.error == "Device limit exceeded") ||
            (res.code == 4 && res.error == "user deleted")
          ) {
       if (!this.logoutAlertShown) {   // 👈 only show once
              this.logoutAlertShown = true;

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
            }
          } else if (res.code == 1) {
            // if (event.content_publish.length) {
            //   for (let i in event.content_publish) {
            //     this.countryAllowed.push(event.content_publish[i].country_code);
            //   }
            //   var a = this.countryAllowed.indexOf(detail.countryCode);
            //   if (a == -1 && event.content_publish[0].country_code != "A") {
            //     const dialogRef = this.dialog.open(CountryLockPopupComponent, {
            //       backdropClass: "popupBackdropClass",
            //       panelClass: "adultAgePopup",
            //       width: "390px",
            //     });
            //   } else {
            //     this.navigationFunction(event, cat, aged, type);
            //   }
            // } else {
            this.navigationFunction(event, cat, aged, type);
            // }
          } else if (res.code == 2) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            // if (event.content_publish.length) {
            //   for (let i in event.content_publish) {
            //     this.countryAllowed.push(event.content_publish[i].country_code);
            //   }
            //   var a = this.countryAllowed.indexOf(detail.countryCode);
            //   if (a == -1 && event.content_publish[0].country_code != "A") {
            //     const dialogRef = this.dialog.open(CountryLockPopupComponent, {
            //       backdropClass: "popupBackdropClass",
            //       panelClass: "adultAgePopup",
            //       width: "390px",
            //     });
            //   } else {
            //     this.navigationFunction(event, cat, aged, type);
            //   }
            // } else {
            this.navigationFunction(event, cat, aged, type);
            // }
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
                // if (event.content_publish.length) {
                //   for (let i in event.content_publish) {
                //     this.countryAllowed.push(
                //       event.content_publish[i].country_code
                //     );
                //   }
                //   var a = this.countryAllowed.indexOf(detail.countryCode);
                //   if (a == -1 && event.content_publish[0].country_code != "A") {
                //     const dialogRef = this.dialog.open(
                //       CountryLockPopupComponent,
                //       {
                //         backdropClass: "popupBackdropClass",
                //         panelClass: "adultAgePopup",
                //         width: "390px",
                //       }
                //     );
                //   } else {
                //     this.navigationFunction(event, cat, aged, type);
                //   }
                // } else {
                this.navigationFunction(event, cat, aged, type);
                // }
              });
          }
        });
      }
    } else {
      // if (event.content_publish.length) {
      //   for (let i in event.content_publish) {
      //     this.countryAllowed.push(event.content_publish[i].country_code);
      //   }
      //   var a = this.countryAllowed.indexOf(detail.countryCode);
      //   if (a == -1 && event.content_publish[0].country_code != "A") {
      //     const dialogRef = this.dialog.open(CountryLockPopupComponent, {
      //       backdropClass: "popupBackdropClass",
      //       panelClass: "adultAgePopup",
      //       width: "390px",
      //     });
      //   } else {
      //     this.navigationFunction(event, cat, aged, type);
      //   }
      // } else {
      this.navigationFunction(event, cat, aged, type);
      // }
    }
    let numb: any = localStorage.getItem("DisplayCount");

    this._dd
      .getHomeData(0, numb, this.sdasd)
      .pipe(map(() => { }))
      .subscribe();
  }

  navigationFunction(event: any, cat: any, aged: any, type: any) {

    if (type == "continue_watching") {
      if (event.access_type == "free") {

        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read?.is_parental == 0) {

          this.videoContinue(event);
        } else {
          if (parental_read?.is_parental == 1 && isSubscriberUser == "1") {
            if (Number(parental_read.restriction_level) == -1) {
              this.showPin1(event);
            } else if (Number(parental_read.restriction_level) == 999) {
              this.videoContinue(event);
            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(aged) == 999) {
                this.videoContinue(event);
              } else if (
                Number(aged) >= Number(parental_read.restriction_level) ||
                Number(aged) == -1
              ) {
                this.showPin1(event);
              } else {
                this.videoContinue(event);
              }
            }
          } else {
            this.videoContinue(event);
          }
        }
      } else if (event.access_type == "paid") {

        if (this.isSubscribed == true) {
          var isSubscriberUser: any = localStorage.getItem("is_subscriber");
          var parental: any = localStorage.getItem("taploginInfo");
          var parental_read = JSON.parse(parental);
          var group_age: any = localStorage.getItem("isParentalRestriction");
          if (parental_read.is_parental == 0) {

            console.log("aaaafbdjhgfcw");
            this.videoContinue(event);
          } else {
            if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
              // if (Number(parental_read.restriction_level) == -1) {
              //   this.showPin1(event);
              // } else if (Number(parental_read.restriction_level) == 999) {
              //   this.videoContinue(event);
              // } else if (
              //   (Number(parental_read.restriction_level) >= 18 &&
              //     Number(parental_read.restriction_level) < 999 &&
              //     Number(aged) == 999) ||
              //   (Number(parental_read.restriction_level) >= 18 &&
              //     Number(parental_read.restriction_level) < 999 &&
              //     Number(aged) == 16)
              // ) {
              //   this.videoContinue(event);
              // } else if (
              //   Number(parental_read.restriction_level) >= 18 &&
              //   Number(parental_read.restriction_level) < 999
              // ) {
              //   this.showPin1(event);
              // } else if (
              //   Number(parental_read.restriction_level) >= 16 &&
              //   Number(parental_read.restriction_level) < 999 &&
              //   Number(aged) == 999
              // ) {
              //   this.videoContinue(event);
              // } else {
              //   this.showPin1(event);
              // }

              if (Number(parental_read.restriction_level) == -1) {
                this.showPin1(event);
              } else if (Number(parental_read.restriction_level) == 999) {
                this.videoContinue(event);
              } else if (Number(parental_read.restriction_level) < 999) {
                if (Number(aged) == 999) {
                  this.videoContinue(event);
                } else if (
                  Number(aged) >= Number(parental_read.restriction_level) ||
                  Number(aged) == -1
                ) {
                  this.showPin1(event);
                } else {
                  this.videoContinue(event);
                }
              }
            } else {
              this.videoContinue(event);
            }
          }
        } else if (this.isSubscribed == false) {
          this.router.navigate(["/subscribe"]);
        }
      }
    } else {
      this.router.navigate(["/" + event.permalink]);
    }
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
  showPin1(event: any) {
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (this.homeCategoryData[0]["auto_play"] == 1) {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.videoContinue(event);
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

            this.m3u8Main = decryptData.url;
          }
        });
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.m3u8Main = decryptData.url;
          }
        });
      }
    }
  }

  videoContinue(event: any) {

    localStorage.setItem("videoPlay", "1");
    localStorage.setItem("getOrder", event.episode_number.slice(1));
    localStorage.setItem("CreatOrderC_id", event.id);
    if (this.getBrowserName == "safari") {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this._dd.getMainUrl(event.id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

            event.url = decryptData.url;
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result) => {

              });
            }
            this.vid1.pause();


          }
        });
      } else {
        this._dd.getUnknownUrl(event.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            event.url = decryptData.url;
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result) => { });
            }
            this.vid1.pause();
          }
        });
      }
    } else {

      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(event.id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            console.log("hhhhhhhh");
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData, "aaaaaa");

            event.url = decryptData.url;
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result) => { });
            }
            this.vid1.pause();
          }
        });
      } else {
        this._dd.getUnknownUrl(event.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            event.url = decryptData.url;
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: event },
              });
              alertRef.afterClosed().subscribe((result) => { });
            }
            this.vid1.pause();
          }
        });
      }
    }
  }
  deleteWatchList(id: any, index: any) {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    var u_id = JSON.parse(userInfo);
    const formData = new FormData();
    formData.append("c_id", id);
    formData.append("u_id", u_id?.id);
    this._dd.clearContinueWatching(formData).subscribe((res: any) => {
      if (res.code == 1) {
        this.homeCategoryData.map((category: any) => {
          if (category.category_type == "continue_watching") {
            category.cat_cntn.splice(index, 1);

            if (category.cat_cntn.length == 0) {
              this.hideContinue = false;
            }
          }
        });
      }
    });
  }

  sharing(type: string, url: any) {
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
      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=Altt%0A${url}`;
      window.open(urls, "TwitterWindow", newLocal);
    } else if (type === "copy") {
      navigator.clipboard.writeText(`${share_url}`);
    }
  }

  userInfo: any;
  userDetails: any;

  // hovergif(event:any){

  // }
  stop(event: any) {
    event.stopPropagation();
  }
  ngOnDestroy(): void {
    // delete videoJs.getPlayers()[`video-ls`];
    if (this.vid1) {
      this.vid1.dispose();
    }
    for (let key in videoJs.getPlayers()) {
      delete videoJs.getPlayers()[key];
    }
  }
  gotoSubscribePage(content: any, title: any) {
    localStorage.removeItem("packcheking");
    if (localStorage.getItem("taploginInfo") === null) {
    } else {
      const taplogininfo: any = localStorage.getItem("taploginInfo") || {};
      this.USER_ACCOUNT_id = JSON.parse(taplogininfo) || {};
      var userage: any = new Date(this.USER_ACCOUNT_id.dob) || {};
      var currentage: any = new Date() || {};
      var newage: any = new Date(currentage) || {};
      var age: any = newage - userage || {};
    }
  }

  getCrownImg() {
    this._dd.faqData().subscribe((res: any) => {
      this.crownImg = res.App[0].crown_logo;
      this.liveImg = res.Player[0].player_live_img;
      console.log(this.liveImg, "jfdhsjdhj");
      this.freeImg = res.App[0].free_logo;
    });
  }

  isNewRelease(releaseDate: string): boolean {
    if (!releaseDate) return false;

    const now = new Date();
    const release = new Date(releaseDate);

    return now < release;
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    this.itemsToShow = this.showMore ? this.displayedShows : 4;
    console.log(this.homeCategoryData[1].cat_cntn, "rrrrrrrrrrrrr");
    console.log(this.itemsToShow, "mmmmmmmmmmm");

    if (!this.showMore) {
      // Scroll to category name on collapse
      setTimeout(() => {
        const categoryElement = document.getElementById(this.scrollBinge);
        if (categoryElement) {
          categoryElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } else {
      // Scroll to last content when expanding
      setTimeout(() => {
        const lastItem = document.querySelector(".binge-item:last-child");
        if (lastItem) {
          lastItem.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 100);
    }
  }

  getDescriptionLength(): number {
    return this.isMobile ? 20 : 85; // Mobile: 55 characters, Web: 85 characters
  }

  getDescriptionLength1(): number {
    return this.isMobile ? 10 : 60; // Mobile: 55 characters, Web: 85 characters
  }

  showTooltip(text: string) {
    this.tooltipText = text;
    setTimeout(() => {
      this.tooltipText = null;
    }, 2000); // Tooltip hides after 2 seconds
  }


}
