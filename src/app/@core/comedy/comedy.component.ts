import { Component, HostListener, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DecryptService } from "src/app/services/decrypt.service";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { AuthService } from "src/app/services/auth.service";
import { map } from "rxjs";
import { StorageService } from "src/app/services/storage.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { Location } from "@angular/common";
import { IosDecrycptionService } from "src/app/services/ios-decrycption.service";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";
declare var $: any
declare var ePub: any

@Component({
  selector: 'app-comedy',
  templateUrl: './comedy.component.html',
  styleUrls: ['./comedy.component.scss']
})
export class ComedyComponent implements OnInit {
  busyGettingData = false;
  category_id: any;
  getBrowserName: any;
  new_offset: number = 12
  getlive: any;
  isOttLoggedIn = false;
  userId: any;
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  FavoriteData: any = []
  epubUrl: any
  @HostListener("window:scroll", ["$event"])
  onResize(event: any) {
    if (window.pageYOffset > 270 && !this.agehide && !this.parentaltest && this.lock1) {
      this.vid1.pause();
      this.playing = true;
    } else if (!this.agehide && !this.parentaltest && this.lock1) {
      this.vid1.play();
      this.playing = false;
    }
  }

  user: any;
  newUser: any;
  mainData: any;
  windowSize: number = 0;
  display_offset: number = 0;
  display_limit: number = 4;
  homeData: any;
  cat_id: any;
  video: any;
  idd1: any;
  agehide = true;
  vid1: any;
  appsflyer: any
  isSubscribed: any;
  data: any
  parentaltest: boolean = false
  timeZoneOffset: any;
  gettitle: any
  videoJsData: any;
  playVid: any;
  successs: any
  contentId: any;
  lock1: boolean = true;
  video1: any;
  isLoggedIn: any = localStorage.getItem("ott_isLoggedIn") || {};
  video2: any;
  getres: any
  getAgeDuration: any;
  idd: any;
  replay: boolean = true
  playing: boolean = false;
  muted: boolean = true;
  lock: boolean = true;
  countryAllowed: any = []
  agefound: any;
  vid: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  hellData: any = []
  visitorId: any;
  defaultImages: any = []
  DefaultBanner: any
  urlEpub: any
  urlEbook: any
  constructor(private dialog: MatDialog, private _storage: StorageService, private _FPS: FingerPrintService, private fcs: FunctionCallingService, private auth: AuthService, private DEC_SCR_IOS: IosDecrycptionService, private analyticsService: AnalyticsService,
    private homeservice: HomeCategoryUtilsService, private DEC_SER: DecryptService, private _dd: DataService, private ed: ExchangeDataService, private _ar: ActivatedRoute, private http: HttpClient, private dep_ser: DecryptService, public router: Router, private ds: DataService, private deviceService: DeviceDetectorService, private location: Location) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value
      }
    });
  }
  ngOnInit(): void {
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    this.getUrlEpub()
    $(function () {
      var $window = $(window);
      var toggleMenu = function () {
        if ($window.width()) {
          $(".toc-list").slideToggle(250);
        }
      };
      var collapseMenu = function () {
        if ($window.width()) {
          $(".toc-list").slideUp(250);
        }
      };

      $(".toc-toggle").click(toggleMenu);


      $(".toc-list a").click(collapseMenu);
      $("#viewer").css("background-color", "white");
      $(document).click(function (event: any) {
        // console.log(!$(event.target).closest('.table-of-contents').length);
        if (!$(event.target).closest('.table-of-contents').length) {
          collapseMenu();
        }
      });

      var handleMatchMedia = function (md: any) {
        if (md.matches) {
          $(".toc-list").show();
        }
        else {
          $(".toc-list").hide();
        }
      };

      var mq = window.matchMedia("(min-width: " + "px)");
      handleMatchMedia(mq);
      mq.addListener(handleMatchMedia);
    });
    this.getBrowserName = this.detectBrowserName();

    // var epubUrl = this.urlEpub.substring(1, this.urlEpub.length-1);





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

  getUrlEpub() {
    this.urlEbook = localStorage.getItem('ebookUrlId')
    this.ds
      .getDescriptionData(this.urlEbook)
      .pipe(
        map((res: any) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          // console.log(decryptData.content, "ppp");
          this.data = decryptData.content

          const now = new Date();
          const currentTime = now.toLocaleTimeString();
          const eventParams = {
            item_name: this.data.title,
            item_id: this.data.id,
            start_time: currentTime,
          };
          this.analyticsService.logEvent('ebook_open', eventParams);
          // console.log(this.data);
          if (this.getBrowserName == "safari") {
            this.userId = localStorage.getItem("taploginInfo");
            this.user = JSON.parse(this.userId);

            if (this.user) {
              this._dd.getMainUrl(this.data.id, this.user.id).subscribe((res: any) => {
                if (res.code == 1) {
                  this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
                  let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

                  console.log(decryptData);

                  this.urlEpub = decryptData.url;
                  this.initializeEpub()
                }
              });
            } else {
              this._dd.getMainUrl(this.data.id, "").subscribe((res: any) => {
                if (res.code == 1) {
                  this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
                  let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);

                  console.log(decryptData);

                  this.urlEpub = decryptData.url;
                  this.initializeEpub()
                }
              });
            }
          } else {
            this.userId = localStorage.getItem("taploginInfo");
            this.user = JSON.parse(this.userId);

            if (this.user) {
              this._dd.getMainUrl(this.data.id, this.user.id).subscribe((res: any) => {
                if (res.code == 1) {
                  this.DEC_SER.getDecryptedData(res?.result);
                  let decryptData = JSON.parse(this.DEC_SER.decryptData);
                  console.log(decryptData);

                  this.data.url = decryptData.url
                  this.urlEpub = decryptData.url;
                  this.initializeEpub()
                }
              });
            } else {
              this._dd.getMainUrl(this.data.id, "").subscribe((res: any) => {
                if (res.code == 1) {
                  this.DEC_SER.getDecryptedData(res?.result);
                  let decryptData = JSON.parse(this.DEC_SER.decryptData);
                  console.log(decryptData);

                  this.data.url = decryptData.url
                  this.urlEpub = decryptData.url;
                  this.initializeEpub()
                }
              });
            }
          }
        })
      )
      .subscribe();

  }

  initializeEpub() {
    var epubUrl = this.urlEpub;
    var data = this.data
    console.log(epubUrl);

    var book = ePub(epubUrl);
    var rendition = book.renderTo("viewer", {
      // method: "continuous",
      // flow: "auto",
      width: "100%",
      height: "100%",

    });
    if (book) {
      book.opened.then(() => {
        // Replace 'chapterIndex' with the desired chapter index (0-based)
        const chapterIndex = 2;

        // Replace 'pageIndex' with the desired page index (0-based)
        const pageIndex = 4;

        // Navigate to a specific chapter
        const chapter = book.spine.get(chapterIndex);
        // console.log(book);

        // book.goto(chapter).then(() => {
        //   // console.log(`Navigated to chapter ${chapterIndex + 1}`);

        //   // Navigate to a specific page within the chapter
        //   const page = chapter.pages[pageIndex];
        //   book.rendition.display(page);
        //   // console.log(`Navigated to page ${pageIndex + 1} in chapter ${chapterIndex + 1}`);
        //   // Additional actions after navigating to the page
        // });
      });
    }

    //  epub bear must used
    // console.log(rendition)
    var hash = window.location.hash.slice(2);
    // console.log(hash);
    rendition.display(hash || undefined);
    var next: any = document.getElementById("next");

    const taploginInfo = localStorage.getItem("taploginInfo");
    const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';

    next.addEventListener("click", (e: any) => {
      var page = rendition.currentLocation()?.start?.displayed?.page;

      console.log(page);

      const eventParams = {
        item_id: data.id,
        page_number: page,
      };
      this.analyticsService.logEvent('ebook_open', eventParams);
      rendition.next();
      e.preventDefault();
    }, false);
    next.addEventListener("touchstart", (e: any) => {
      var page = rendition.currentLocation()?.start?.displayed?.page

      const eventParams = {
        item_id: data.id,
        page_number: page,
      };
      this.analyticsService.logEvent('ebook_page_turn', eventParams);
      rendition.next();
      e.preventDefault();
    }, false);

    var prev: any = document.getElementById("prev");

    prev.addEventListener("click", (e: any) => {
      var page = rendition.currentLocation()?.start?.displayed?.page
      const eventParams = {
        item_id: data.id,
        page_number: page,
      };
      this.analyticsService.logEvent('ebook_page_turn', eventParams);
      rendition.prev();
      e.preventDefault();
    }, false);
    prev.addEventListener("touchstart", (e: any) => {
      var page = rendition.currentLocation()?.start?.displayed?.page
      const eventParams = {
        item_id: data.id,
        page_number: page,
      };
      this.analyticsService.logEvent('ebook_page_turn', eventParams);
      rendition.prev();
      e.preventDefault();
    }, false);


    rendition.on("rendered", (section: any) => {
      prev.style.display = 'block'
      next.style.display = 'block'
      const iframe = document.querySelector('#viewer iframe') as HTMLIFrameElement;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const tocLinks = doc.querySelectorAll('nav ol li a');
          tocLinks.forEach(link => {
            link.addEventListener('click', (event: Event) => {
              event.preventDefault();
              const href: any = (event.target as HTMLAnchorElement).getAttribute('href');
              const newHref = href.replace(/^(\.\.\/)*/, '');
              if (href) {
                rendition.display(newHref);
              }
            });
          })
        }
      }

      var nextSection = section.next();
      var prevSection = section.prev();


      if (nextSection) {
        var nextNav = book.navigation.get(nextSection.href);

        var $window = $(window);
        var collapseMenu = function () {
          if ($window.width()) {
            $(".toc-list").slideUp(250);

          }
        };
        $(".toc-list a").click(collapseMenu);
        collapseMenu();

      }

      if (prevSection) {
        var prevNav = book.navigation.get(prevSection.href);

        var $window = $(window);
        var collapseMenu = function () {
          if ($window.width()) {
            $(".toc-list").slideUp(250);
          }

        };
        $(".toc-list a").click(collapseMenu);
        collapseMenu();
      }
    });

    rendition.on("relocated", function (location: any) {

    });

    book.loaded.navigation.then(function (toc: any) {
      var $nav: any, docfrag: any;
      $nav = document.getElementById("toc");
      docfrag = document.createDocumentFragment();

      var addTocItems = function (parent: any, tocItems: any) {

        var $ul = document.createElement("ul");
        $ul.style.listStyle = "none";
        $ul.style.display = "flex";
        $ul.style.flexDirection = "column";
        $ul.style.gap = "12px";
        $ul.style.fontFamily = "PoppinsRegular";
        $ul.style.fontSize = "16px";
        $ul.style.padding = '0';

        tocItems.forEach(function (chapter: any) {

          var item = document.createElement("li");
          var link = document.createElement("a");
          link.style.color = "black";
          link.textContent = chapter.label;
          link.href = chapter.href;
          item.appendChild(link);

          if (chapter.subitems) {
            addTocItems(item, chapter.subitems);

          }

          link.onclick = function () {
            var url: any = link.getAttribute("href");


            // Display the chapter in the EPUB reader
            console.log(rendition);
            var cleanUrl = url.replace(/^(\.\.\/)+/, '');
            console.log("Navigating to:", cleanUrl);
            rendition.display(cleanUrl).then(() => {
              console.log("Navigation successful");
            }).catch((error: any) => {
              console.error("Navigation error:", error);
            });

            return false;
          };


          $ul.appendChild(item);
        });
        parent.appendChild($ul);
      };

      addTocItems(docfrag, toc);

      $nav.appendChild(docfrag);

      if ($nav.offsetHeight + 60 < window.innerHeight) {
        $nav.classList.add("fixed");
      }
    });
  }
  back() {
    this.location.back();
  }
  analytics() {
    // const userInfo: any = localStorage.getItem("taploginInfo");
    // let analytics: any = {
    //   c_id: this.data.id || "",
    //   dod: "",
    //   dd: "",
    //   type: 2,
    //   content_title: this.data.title,
    //   total_duration: '0',
    //   pd: '0',
    //   cat_id: this.data.category_ids[0] || "",
    //   age_group: this.data.age_group,
    //   gender: "Male",
    //   network_provider: "Airtel",
    //   customer_name: "User",
    //   content_type: this.data.content_type
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
    // formData.append("s_id", this.data.season_id);
    // formData.append("index", '0');
    // formData.append("page", '0');
    // this._dd.analyticsSubmit(formData).subscribe((res: any) => {
    //   if (res.code == 1) {

    //   }
    // });
  }
  ngOnDestroy() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();

    const eventParams = {
      item_name: this.data.title,
      item_id: this.data.id,
      completion_time: currentTime
    };
    this.analyticsService.logEvent('ebook_complete', eventParams);
  }
}
