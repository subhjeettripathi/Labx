import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { map, subscribeOn } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { IResult } from "src/app/shared/models/result.data";
@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit, AfterViewInit {
  busyGettingData = false;
  abc: [] = [];
  new_offset: number = 12;
  homeData = [];
  totalCount: number = 0;
  cardData = [];
  home_category: any[] = [];
  regional_offset: number = 0;
  display_count: number = 0;
  display_offset: number = 0;
  display_limit: number = 6;
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
  USER_ACCOUNT_id: any;
  loginId = JSON.parse(localStorage.getItem("taploginInfo") || "{}");
  navbarAd: any = [];
  navvar: any;
  ad_data: any;
  region: any;
  homeMargin:boolean = false;
  showSkeletonForCarousel = false;
  showSkeletonForHome = true
  constructor(
    private route: ActivatedRoute,
    private _dd: DataService,
    private _hc: HomeCategoryUtilsService,
    private DEC_SER: DecryptService,
    private router: Router,
    private ed: ExchangeDataService,
    private _ar: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private fcs: FunctionCallingService,
    private cdr: ChangeDetectorRef
  ) {
    this.ed.playDetailVideo.subscribe((value) => {
      if (value != "0") {
        let value: any = localStorage.getItem("catt");
        if (value != null) {
          let numb: any = localStorage.getItem("DisplayCount");
          this.display_limit = numb;
        }
      }
    });
    setTimeout(() => {
      this.homeMargin = this.home_category[0].category_type != 'feature_banner'
      console.log(this.homeMargin,"lkl")
    }, 1000);
  
    this.ed.reload.subscribe((value) => {
      if (value == true) {
        location.reload();
      }
    });
    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    this.getSub();
    this.windowSize = window.innerWidth;
    this.apip();
    localStorage.removeItem("episode");
  }

  apip() {
    if (localStorage.getItem("ipSaveData") == null) {
      this._dd.apipip().subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res?.result);
          let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
          localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
        }
      });
    }
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  ngAfterViewInit(): void {
    this._ar.paramMap.subscribe((params) => {
      if (params.get("id") == null) {
        localStorage.setItem("active", "HOME");
        this.ed.active.next("HOME");
      }
    });
    this.route.paramMap.subscribe((params) => {
      this.cat_id = params.get("id");
      if (this.cat_id == null) {
        this.navMain = localStorage.getItem("navbarData");
        this.navNew = JSON.parse(this.navMain);
        for (let i = 0; i < this.navNew.length; i++) {
          this.path = this.navNew[i].name;
          if (this.path.toLowerCase() === "home") {
            this.cat_id = this.navNew[i].id;
          }
        }
      } else {
        this.cat_id = params.get("id");
      }
      this.cdr.detectChanges();
    });

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
          this.showSkeletonForHome=false
          const taplogininfo: any = localStorage.getItem("taploginInfo");
          const USER_ACCOUNT: any = JSON.parse(taplogininfo);
          if (USER_ACCOUNT) {
            this._dd.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
              if (res.code == 1) {
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);
                this.FavoriteData = decryptData.content_id;
                this.home_category.forEach((ele: any) => {
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

            this.home_category.forEach((ele: any) => {
              if (ele.category_type == "continue_watching") {
            
                this._dd
                  .continueWatch(USER_ACCOUNT.id)
                  .subscribe((res: any) => {
                    if (res.code == 1) {
                      this.DEC_SER.getDecryptedData(res?.result);
                      let decryptData = JSON.parse(this.DEC_SER.decryptData);
                      console.log(decryptData, "aaaaaaaa");
                      this.newContinueWatching = decryptData.content;
                      for (let i in decryptData.content) {
                        ele.cat_cntn.push(decryptData.content[i]);
                      }
                      this.pushHomeData();
                    }
                  });
              }

              const region: any = localStorage.getItem("regional");
              if (ele.category_type == "language" && region) {
                this._dd
                  .regionalLang(this.regional_offset)
                  .subscribe((res: any) => {
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
          this.pushHomeData();
          this.display_offset = decryptData["display_offset"];
          this.display_count = decryptData["display_count"];
          this._hc.pushHomeCategoryData(this.home_category);
        })
      )
      .subscribe();
  }

  pushHomeData() {

    this.home_category.map((category: any) => {
      if (category.multiple_layout != null) {
        let selectedLayout: any = {};
        selectedLayout = category.multiple_layout.find(
          (multi: any) => multi.platform === "web"
        );
        if (selectedLayout !== undefined) {
          category.totalSlides = selectedLayout.slider;
          category.type = selectedLayout.layout;
          category.cat_cntn.forEach((cat: any) => {
            var hms = cat.duration;
            var a = hms.split(":");
            var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
            cat.result = Math.round((cat.play_duration / seconds) * 100);
            cat.sliderImg = "";
            cat.sliderIdentifier = "";
            cat.showCaseImg = "";
            if (cat.is_group == 1 && cat.groupInfo != null) {
              if (category.category_type == "feature_banner") {
                if (cat.groupInfo.global_thumb != null) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
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
              } else if (
                category.category_type == "default" ||
                category.category_type == "language" ||
                category.category_type == "Binge_it_all" ||
                category.category_type == "list" ||
                category.category_type == "Binge_it_all_vertically"
              ) {
                if (cat.groupInfo.global_thumb != null) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
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
                            Number(img.width) == 1080 ||
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
                      if (
                        thumb.layout == "square" &&
                        selectedLayout.layout == "circle"
                      ) {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (
                            Number(img.width) == 1080 ||
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
              } else if (category.category_type == "continue_watching") {
             
                // console.log(cat.result,"aaaaaaaaaaaaaaaaaaaa");
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (
                    thumb.layout == "square" &&
                    selectedLayout.layout == "circle"
                  ) {
                    thumb.layout = "circle";
                  }
                  if (thumb.layout == selectedLayout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 1080 ||
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
            } else if (cat.is_group == 0) {
              if (cat.layout_thumbs != null) {
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (
                    thumb.layout == "square" &&
                    selectedLayout.layout == "circle"
                  ) {
                    thumb.layout = "circle";
                  }
                  if (thumb.layout == selectedLayout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (category.category_type == "feature_banner") {
                        if (Number(img.width) == 1920) {
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
                        category.category_type == "language" ||
                        category.category_type == "Binge_it_all" ||
                        category.category_type == "list" ||
                        category.category_type == "Binge_it_all_vertically"
                      ) {
                        if (
                          Number(img.width) == 1080 ||
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
            if (category.category_type == "genre") {
              if (cat.layout_thumbs != null) {
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == selectedLayout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 1080 ||
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

            if (category.category_type == "showcase") {
              if (cat.layout_thumbs != null) {
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == selectedLayout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 1080 ||
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

               if (cat.layout_thumbs1 != null) {
                cat.layout_thumbs1.forEach((thumb: any) => {
                  if (thumb.layout == "rectangle_16x9") {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 1080 ||
                        Number(img.width) == 854
                      ) {
                        cat.showCaseImg = img.url;
                        cat.sliderIdentifier = img.identifier;
                      } else if (cat.showCaseImg == "") {
                        cat.showCaseImg = thumb?.image_size[0].url;
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
      return;
    }
    this.busyGettingData = true;
    let mainHomeCount = 0;
    this.home_category.forEach((element) => {
      if ("cat_id" in element) {
        mainHomeCount++;
      }
    });
    let dataCount = 0;
    this.home_category.filter((data: any) => {
      if (data.category_type == "list") {
        data.cat_cntn.forEach((element: any) => {
          if ("id" in element) {
            dataCount++;
          }
        });
        this._dd
          .getDescriptionDataList(0, data.cat_id)
          .pipe(
            map((res: any) => {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.totalCount = decryptData.totalCount;
              if (this.totalCount > dataCount) {
                this._dd
                  .getDescriptionDataList(this.new_offset, data.cat_id)
                  .pipe(
                    map((res: any) => {
                      this.DEC_SER.getDecryptedData(res?.result);
                      let decryptData = JSON.parse(this.DEC_SER.decryptData);
                      console.log(decryptData, "jkjkj");
                      this.new_offset = decryptData.offset;
                      this.display_offset = decryptData.offset;
                      this.busyGettingData = false;
                      this.home_category.filter((data: any) => {
                        if (data.category_type == "list") {
                          decryptData.content.forEach((ele: any) => {
                            data.cat_cntn.push(ele);
                          });
                          this.pushHomeData();
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
    });

    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    if (this.display_count > mainHomeCount) {
      if (this.display_offset < this.display_count) {
        this.showSkeletonForCarousel = true;
        this._dd
          .getHomeData(this.display_offset, this.display_limit, this.cat_id)
          .pipe(
            map((res: any) => {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              localStorage.setItem("latestLimit", String(this.display_limit));
              this.display_offset = decryptData["display_offset"];
              this.display_count = decryptData["display_count"];
              let hc = [];
              
              hc = decryptData["dashboard"]["home_category"];
              this.showSkeletonForCarousel = false;
 
              console.log(hc);
              this.busyGettingData = false;
              hc.forEach((ele: any) => {
                if (ele.category_type == "continue_watching") {
                  this._dd
                    .continueWatch(USER_ACCOUNT.id)
                    .subscribe((res: any) => {
                      if (res.code == 1) {
                        this.DEC_SER.getDecryptedData(res?.result);
                        let decryptData = JSON.parse(this.DEC_SER.decryptData);
                        this.newContinueWatching = decryptData.content;
                        for (let i in decryptData.content) {
                          ele.cat_cntn.push(decryptData.content[i]);
                        }
                        this.pushHomeData();
                      }
                    });
                }
                const region: any = localStorage.getItem("regional");
                if (ele.category_type == "language" && region) {
                  this._dd
                    .regionalLang(this.regional_offset)
                    .subscribe((res: any) => {
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

              hc.forEach((ele: any) => {
                ele.cat_cntn.forEach((data: any) => {
                  for (let i in this.FavoriteData) {
                    if (data.id == this.FavoriteData[i]) {
                      data.is_favourite = 1;
                    }
                  }
                });
                this.home_category = [...this.home_category, ele];
                this.pushHomeData();
                this._hc.pushHomeCategoryData(this.home_category);
              });
            })
          )
          .subscribe();
      }
    }
  }
  userInfo: any;
  userDetails: any;

  onWindowResize() {
    this.windowSize = window.innerWidth;
  }

  getSub() {
    var isSubscriberUser: any = localStorage.getItem("is_subscriber");
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    if (ids) {
      this._dd.getSubtitle(ids.id).subscribe((res: any) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData,"hsssssssssssss");
        const sendTosett = decryptData;
        var hey = this.loginId;
        hey.is_parental = sendTosett.parental.is_parental;
        localStorage.setItem("taploginInfo", JSON.stringify(hey));
        if (sendTosett.parental.is_parental == "1" && isSubscriberUser == "1") {
          this.fcs.LevelSetToSetting.next(
            sendTosett.parental.restriction_title
          );
          var level = this.loginId;
          level.restriction_level = sendTosett.parental.restriction_level;
          localStorage.setItem("taploginInfo", JSON.stringify(level));
          var title = this.loginId;
          title.restriction_title = sendTosett.parental.restriction_title;
          localStorage.setItem("taploginInfo", JSON.stringify(title));
          var parentaId = this.loginId;
          parentaId.parental_id = sendTosett.parental.parental_id;
          localStorage.setItem("taploginInfo", JSON.stringify(parentaId));
        }
      });
    }
  }
}
