import { AfterViewInit, Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { NgCacheRouteReuseService } from "ng-cache-route-reuse";
import { DeviceDetectorService } from "ngx-device-detector";
import { map } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { IResult } from "src/app/shared/models/result.data";
import { ISliderData } from "src/app/shared/models/sliderdata";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  showSkeletonForCarousel = false;
  showSkeletonForHome = true
  busyGettingData = false;
  sliderData: ISliderData[] = [];
  abc: [] = [];
  homeData = [];
  cardData = [];
  home_category: any[] = [];
  display_count: number = 0;
  display_offset: number = 0;
  scroll_offset: number = 4
  display_limit: number = 4;
  windowSize: number = 0;
  cat_id: any;
  defaultImages: any = localStorage.getItem("defaultImages");
  navMain: any;
  navNew: any;
  path: any;
  timeZoneOffset: any;
  FavoriteData: any = [];
  newContinueWatching: any = [];
  RegionalData: any = [];
  constructor(
    private route: ActivatedRoute,
    private _dd: DataService,
    private _hc: HomeCategoryUtilsService,
    private DEC_SER: DecryptService,
    private router: Router,
    private ed: ExchangeDataService,
    private titleService: Title,
    private _ar: ActivatedRoute,
    private deviceService: DeviceDetectorService,
  ) {

    // this._ar.queryParamMap.subscribe((param: any) => {
    //   if (param.get("id") == null || "") {
    //     localStorage.setItem("active", "HOME");
    //     this.ed.active.next("HOME");
    //   }
    // });
    // this.ed.playDetailVideo.subscribe((value) => {
    //   if (value != '0') {
    //     let numb: any = localStorage.getItem("DisplayCount");
    //     this.display_limit = numb
    //   }

    // });

    this.ed.reload.subscribe((value) => {
      if (value == true) {
        location.reload();
      }
    });
    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    this.windowSize = window.innerWidth;
    if (localStorage.getItem("ipSaveData") == null) {
      this._dd.apipip().subscribe((res: any) => {
        localStorage.setItem("ipSaveData", JSON.stringify(res));
      });
    }
    const a = localStorage.getItem('taploginInfo')
    if (a != null) {
      // this.leadSquare()
    }
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  ngAfterViewInit(): void {
    this._ar.paramMap.subscribe((params) => {
      if (params.get("id") == null) {
        localStorage.setItem("active", "The Art of Living App");
        this.ed.active.next("HOME");
      }
    })
    this.route.paramMap.subscribe((params) => {
      this.cat_id = params.get("id");
      if (this.cat_id == null) {
        this.navMain = localStorage.getItem("navbarData");
        this.navNew = JSON.parse(this.navMain);
        console.log(this.navNew);
        for (let i = 0; i < this.navNew.length; i++) {
          this.path = this.navNew[i].category;
          if (this.path == "Home" || this.path == "Home") {
            this.cat_id = this.navNew[i].id;
          }
        }
      } else {
        this.cat_id = params.get("id");
      }
    });
    let title: any = localStorage.getItem('active')

    this.titleService.setTitle(title)

    this._dd
      .getHomeData(this.display_offset, this.display_limit, this.cat_id)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.homeData = decryptData;
          console.log(this.homeData);
          localStorage.setItem("DisplayCount", this.homeData["display_count"]);
          this.home_category = decryptData["dashboard"]["home_category"];
          console.log(this.home_category);
          this.showSkeletonForHome = false
          const taplogininfo: any = localStorage.getItem("taploginInfo");
          const USER_ACCOUNT: any = JSON.parse(taplogininfo);
          if (USER_ACCOUNT) {

            this.home_category.forEach((ele: any) => {
              if (ele.category_type == "continue_watching") {
                this._dd
                  .continueWatch(USER_ACCOUNT.id, 'video')
                  .subscribe((res: any) => {
                    if (res.code == 1) {
                      this.DEC_SER.getDecryptedData(res?.result);
                      let decryptData = JSON.parse(this.DEC_SER.decryptData);
                      console.log(decryptData, "aaaa");
                      this.newContinueWatching = decryptData.content;
                      for (let i in decryptData.content) {
                        const item = decryptData.content[i];
                        item.index = ele.cat_cntn.length;      // index in row
                        item.category_type = ele.category_type;

                        ele.cat_cntn.push(item);
                      }
                      this.pushHomeData();
                    }
                  });
              }

              if (ele.category_type == "continue_listening") {
                this._dd
                  .continueWatch(USER_ACCOUNT.id, 'audio')
                  .subscribe((res: any) => {
                    if (res.code == 1) {
                      this.DEC_SER.getDecryptedData(res?.result);
                      let decryptData = JSON.parse(this.DEC_SER.decryptData);
                      console.log(decryptData, "aaaa");
                      this.newContinueWatching = decryptData.content;
                      for (let i in decryptData.content) {
                        const item = decryptData.content[i];
                        item.index = ele.cat_cntn.length;      // index in row
                        item.category_type = ele.category_type;
                        ele.cat_cntn.push(item);
                      }
                      this.pushHomeData();
                    }
                  });
              }

              const region: any = localStorage.getItem("regional");
              if (ele.category_type == "language" && region) {
                this._dd.regionalLang(USER_ACCOUNT.id).subscribe((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);

                    this.RegionalData = decryptData.content;
                    for (let i in decryptData.content) {
                      ele.cat_cntn.push(decryptData.content[i]);
                    }
                    this.pushHomeData();
                  }
                });
              }


            });
          }
          this.home_category.forEach((ele: any) => {
            if (ele.category_type == "singer") {
              ele.cat_cntn = []
              this._dd
                .getSingerList('singer')
                .subscribe((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);
                    console.log(decryptData, "singer");

                    console.log(decryptData, "aaaa");
                    this.newContinueWatching = decryptData.content;
                    for (let i in decryptData.data) {
                      console.log(decryptData.data);
                      console.log(decryptData.data[i]);
                      ele.cat_cntn.push(decryptData.data[i]);
                    }
                    this.pushHomeData();
                  }
                });
            }
            if (ele.category_type == "podcast") {
              ele.cat_cntn = []
              this._dd
                .getSingerList('composer')
                .subscribe((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);
                    console.log(decryptData, "singer");

                    console.log(decryptData, "aaaa");
                    this.newContinueWatching = decryptData.content;
                    for (let i in decryptData.data) {
                      console.log(decryptData.data);
                      console.log(decryptData.data[i]);
                      ele.cat_cntn.push(decryptData.data[i]);
                    }
                    this.pushHomeData();
                  }
                });
            }
          });



          localStorage.setItem(
            "banner_type",
            this.home_category[0].category_type
          );
          this.pushHomeData();
          this.display_offset = decryptData["display_offset"];
          this.display_count = decryptData["display_count"];
          this._hc.pushHomeCategoryData(this.home_category);

          this.ed.showFooter.next(true);
        })
      )
      .subscribe();

    if ("taploginInfo" in localStorage) {
      const userAccount: any = localStorage.getItem("taploginInfo");
      let history = {
        user_id: JSON.parse(userAccount).id,
        action: this.router.url.substring(1),
      };
    }
  }
  pushHomeData() {
    this.home_category.map((category: any) => {
      if (category.multiple_layout != null) {
        if (category.multiple_layout.platform === "web") {
          category.totalSlides = category.multiple_layout.slider;
          category.type = category.multiple_layout.layout;
          category.cat_cntn.forEach((cat: any) => {
            var hms = cat.duration;
            if (hms) {
              var a = hms.split(":");
              var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
              cat.result = Math.round((cat.play_duration / seconds) * 100);
            }


            cat.sliderImg = "";
            cat.sliderIdentifier = "";
            if (cat.is_group == 1 && cat.groupInfo != null) {
              if (category.category_type == "feature_banner") {
                if (cat.groupInfo.global_thumb != null || cat?.groupInfo?.global_thumb.length != 0) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      // if (thumb.layout == "square") {
                      //   thumb.layout = "circle";
                      // }
                      if (thumb.layout == category.multiple_layout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 360 ||
                            Number(img.width) == 854 || Number(img.width) == 480
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
                      if (thumb.layout == category.multiple_layout.layout) {
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
              } else if (
                category.category_type == "default" ||
                category.category_type == "language" ||
                category.category_type == "Binge_it_all" ||
                category.category_type == "genre" ||
                category.category_type == "ebook" ||
                category.category_type == "continue_watching" ||
                category.category_type == "audio" ||
                category.category_type == "continue_listening"

              ) {
                if (cat?.groupInfo?.global_thumb.length != 0) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == category.multiple_layout.layout) {

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
                      if (thumb.layout == category.multiple_layout.layout) {
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
                  if (thumb.layout == category.multiple_layout.layout) {
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
                      } else if (
                        category.category_type == "default" ||
                        category.category_type == "continue_watching" ||
                        category.category_type == "continue_listening" ||
                        category.category_type == "language" ||
                        category.category_type == "Binge_it_all" ||
                        category.category_type == "ebook" || category.category_type == "genre" || category.category_type == "audio"
                      ) {
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
            if (category.category_type == "genre" || category.category_type == "singer" || category.category_type == "podcast" || category.category_type == "continue_watching" || category.category_type == "continue_listening") {
              if (cat.layout_thumbs != null) {
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == category.multiple_layout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 360 ||
                        Number(img.width) == 854
                      ) {
                        cat.sliderImg = img.url;
                        cat.sliderIdentifier = img.identifier;
                      } else if (cat.sliderImg == "") {
                        cat.sliderImg = thumb?.image_size[0].url;
                        cat.sliderIdentifier = thumb?.image_size[0].identifier;
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
  onScrollingFinished() {
    if (this.busyGettingData) {
      return
    }
    this.busyGettingData = true
    console.log(this.display_count);
    console.log(this.scroll_offset);


    if (this.display_count >= this.scroll_offset) {
      this.showSkeletonForCarousel = true;

      this._dd
        .getHomeData(this.scroll_offset, this.display_limit, this.cat_id)
        .pipe(
          map((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData);
            localStorage.setItem("latestLimit", String(this.display_limit));
            this.scroll_offset = decryptData["display_offset"];
            console.log(this.scroll_offset);

            this.display_count = decryptData["display_count"];



            let hc = [];
            hc = decryptData["dashboard"]["home_category"];
            this.showSkeletonForCarousel = false;
            this.busyGettingData = false
            hc.forEach((ele: any) => {
              ele.cat_cntn.forEach((data: any) => {
                for (let i in this.FavoriteData) {
                  if (data.id == this.FavoriteData[i]) {
                    data.is_favourite = 1;
                  }
                }
              });
              if (ele.category_type == "singer") {
                ele.cat_cntn = []
                this._dd.getSingerList('singer').subscribe((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);
                    // ele.cat_cntn = []
                    for (let i in decryptData.data) {
                      ele.cat_cntn.push(decryptData.data[i]);
                    }
                  }
                });
              }
              if (ele.category_type == "podcast") {
                ele.cat_cntn = []
                this._dd.getSingerList('composer').subscribe((res: any) => {
                  if (res.code == 1) {
                    this.DEC_SER.getDecryptedData(res?.result);
                    let decryptData = JSON.parse(this.DEC_SER.decryptData);
                    // ele.cat_cntn = []
                    for (let i in decryptData.data) {
                      ele.cat_cntn.push(decryptData.data[i]);
                    }
                  }
                });
              }
              const region: any = localStorage.getItem("regional");
              const taplogininfo: any = localStorage.getItem("taploginInfo");
              const USER_ACCOUNT: any = JSON.parse(taplogininfo);
              if (USER_ACCOUNT) {
                if (ele.category_type == "continue_watching") {
                  this._dd
                    .continueWatch(USER_ACCOUNT.id, 'video')
                    .subscribe((res: any) => {
                      if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);

                        this.newContinueWatching = decryptData.content;
                        for (let i in decryptData.content) {
                          const item = decryptData.content[i];
                          item.index = ele.cat_cntn.length;      // index in row
                          item.category_type = ele.category_type;

                          ele.cat_cntn.push(item);
                        }
                        this.pushHomeData();
                      }
                    });
                }

                if (ele.category_type == "continue_listening") {
                  this._dd
                    .continueWatch(USER_ACCOUNT.id, 'audio')
                    .subscribe((res: any) => {
                      if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);

                        this.newContinueWatching = decryptData.content;
                        for (let i in decryptData.content) {
                          const item = decryptData.content[i];
                          item.index = ele.cat_cntn.length;      // index in row
                          item.category_type = ele.category_type;

                          ele.cat_cntn.push(item);
                        }
                        this.pushHomeData();
                      }
                    });
                }

                if (ele.category_type == "language" && region) {
                  this._dd.regionalLang(USER_ACCOUNT.id).subscribe((res: any) => {
                    if (res.code == 1) {
                      this.DEC_SER.getDecryptedData(res?.result);
                      let decryptData = JSON.parse(this.DEC_SER.decryptData);

                      this.RegionalData = decryptData.content;
                      for (let i in decryptData.content) {
                        ele.cat_cntn.push(decryptData.content[i]);
                      }
                      this.pushHomeData();
                    }
                  });
                }
              }

              this.home_category = [...this.home_category, ele];
              this.pushHomeData();
              this._hc.pushHomeCategoryData(this.home_category);
            });
          })
        )
        .subscribe();


    }
  }
  leadSquare() {
    let dateObj = new Date();
    let month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // Add leading zero if needed
    let day = ('0' + dateObj.getUTCDate()).slice(-2); // Add leading zero if needed
    let year = dateObj.getUTCFullYear();

    const newdate = year + "-" + month + "-" + day;
    const date = new Date();

    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);

    const time = date.toLocaleTimeString([], {
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const requestData = [
      {
        'Attribute': 'EmailAddress',
        'Value': USER_ACCOUNT.email
      },
      {
        'Attribute': 'mx_App_Last_Login_Date_Time',
        'Value': newdate + ' ' + time
      },
      {
        'Attribute': 'mx_App_User_Source',
        'Value': 'Web'
      }
    ];
    this._dd.leadSquare(requestData).subscribe((res: any) => {

    })
  }

}