import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs";
import { FormGroup } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { IResult } from "src/app/shared/models/result.data";
import { MatDialog } from "@angular/material/dialog";
import { Location } from "@angular/common";
import { CountryLockPopupComponent } from "src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { Console } from "console";
declare var AF: any;
// declare var firebase: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
@Component({
  selector: "app-all-data",
  templateUrl: "./all-data.component.html",
  styleUrls: ["./all-data.component.scss"],
})
export class AllDataComponent implements OnInit {

  p: number = 1;
  collection: any = [];
  searchForm!: FormGroup;
  display_offset: number = 0;
  cat_id: any;
  title: any;
  cat: any;
  busyGettingData = false;
  defaultImages: any = [];
  windowSize: number = 0;
  contentData: any = [];
  user: any;
  @ViewChild("searchbar") searchbar!: ElementRef;
  searchText = "";
  searchRes: any = true;
  toggleSearch: boolean = false;
  searchData: any = [];
  UserInfo: any;
  totalItems: any;
  showKey: boolean = true
  arrowShow: boolean = true;
  show: boolean = false;
  countryAllowed: any = [];
  timeZoneOffset: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed = false;
  prevUrl: any;
  buttonsData: any;
  pageCatId: any;
  genreShow: boolean = true;
  id: any
  navbarAd: any
  navvar: any
  ad_data: any
  crownImg: any
  freeImg: any
  constructor(
    private _dd: DataService,
    private router: Router,
    private _location: Location,
    private DEC_SER: DecryptService,
    private _ar: ActivatedRoute,
    private dialog: MatDialog,
    private ed: ExchangeDataService
  ) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });

    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    window.scroll(0, 0);

    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.user = localStorage.getItem("taploginInfo");
    this.defaultImages = localStorage.getItem("defaultImages");
    this.prevUrl = localStorage.getItem("prevUrl");
    this.windowSize = window.innerWidth;
    this._ar.paramMap.subscribe((params) => {
      this.cat_id = params.get("id");
      console.log(this.cat_id)
      this.title = params.get("title");
    });
    let numb: any = localStorage.getItem("cat_type");

    this._ar.queryParams.subscribe((params) => {
      this.cat = params["cat"];
      console.log(this.cat)
      this.id = params["id"];
      if (this.cat == "Genre") {
        // this.getButtonsJson()
        this.getGenreList()

      } else if (numb == "language") {
        this.getRegioanlList();
      } else {
        this.getList();
      }
    });

    this.getCrownImg();

  }
  searchIconShow: boolean = true;

  searchCLoseButton(event: any) {
    if (event.target.value.length != 0) {
      this.searchIconShow = false;
    } else {
      this.searchIconShow = true;
    }
  }
  // showsLoad(data: any) {
  //   this.genreShow = true;
  //   this.pageCatId = data
  //   if (this.showKey == true) {
  //     this.getGenreList(data);
  //   }
  //   this.showKey = false;
  // }

  // moviesLoad(data: any) {
  //   this.genreShow = false;
  //   if (this.showKey == false) {
  //     this.getGenreList(data);
  //   }
  //   this.showKey = true;
  // }

  // getButtonsJson() {
  //   this._dd.getGenreListButton().subscribe((data: any) => {

  //     if (data.code == 1) {
  //       this.buttonsData = data.result


  //       this.getGenreList(this.buttonsData.category[0].id);
  //       this.showKey = false;
  //     }


  //   });
  // }

  getGenreList() {


    this.display_offset = 0
    this.p = 1;
    // this.pageCatId = catData
    console.log(this.pageCatId)
    this._dd
      .getGenreContentList(this.display_offset, this.cat_id)
      .pipe(
        map((res: IResult) => {
          if (res.code == 1) {
            this.show = false;
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.contentData = decryptData.content;
            this.totalItems = decryptData.totalCount;
            this.display_offset = decryptData.offset;


            this.contentData.map((category: any) => {
              category.sliderImg = "";
              category.sliderIdentifier = "";

              if (category.is_group == 1 && category.groupInfo != null) {
                if (
                  category.groupInfo.global_thumb != null &&
                  category.groupInfo.global_thumb.length != 0
                ) {
                  category.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (
                        thumb.layout == "rectangle_16x9" &&
                        thumb.platform == "global"
                      ) {
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
                } else if (category.groupInfo.thumbs != null) {
                  category.groupInfo.thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (
                        thumb.layout == "rectangle_16x9" &&
                        thumb.platform == "web"
                      ) {
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
          } else {

            this.show = true;
            this.contentData = []
          }
        })
      )
      .subscribe();
  }
  getRegioanlList() {
    window.scroll(0, 0);
    this._dd
      .regionalLangAllData(this.display_offset)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.contentData = decryptData.content;
          this.totalItems = decryptData.totalCount;

          this.display_offset = decryptData.offset;
          this.contentData.map((category: any) => {
            category.sliderImg = "";
            category.sliderIdentifier = "";
            if (category.is_group == 1 && category.groupInfo != null) {
              if (
                category.groupInfo.global_thumb != null &&
                category.groupInfo.global_thumb.length != 0
              ) {
                category.groupInfo.global_thumb.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (thumb.layout == "square") {
                      thumb.layout = "circle";
                    }
                    if (
                      thumb.layout == "rectangle_16x9" &&
                      thumb.platform == "global"
                    ) {
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
              } else if (category.groupInfo.thumbs != null) {
                category.groupInfo.thumbs.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (
                      thumb.layout == "rectangle_16x9" &&
                      thumb.platform == "web"
                    ) {
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
        })
      )
      .subscribe();
  }
  getList() {


    this._dd
      .getDescriptionDataList(this.display_offset, this.cat_id)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.contentData = decryptData.content;
          this.totalItems = decryptData.totalCount;

          this.display_offset = decryptData.offset;
          console.log(this.contentData);

          this.contentData.map((category: any) => {

            if (category.is_ad == 1) {
            }
            category.sliderImg = "";
            category.sliderIdentifier = "";
            if (category.is_group == 1 && category.groupInfo != null) {
              if (
                category.groupInfo.global_thumb != null &&
                category.groupInfo.global_thumb.length != 0
              ) {
                category.groupInfo.global_thumb.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (thumb.layout == "square") {
                      thumb.layout = "circle";
                    }
                    if (
                      thumb.layout == "rectangle_16x9" &&
                      thumb.platform == "global"
                    ) {
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
              } else if (category.groupInfo.thumbs != null) {
                category.groupInfo.thumbs.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (
                      thumb.layout == "rectangle_16x9" &&
                      thumb.platform == "web"
                    ) {
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
        })
      )
      .subscribe();
  }
  gty(page: any) {

  }
  closeinput(): void {
    this.searchIconShow = true;
    this.toggleSearch = false;
  }

  backClicked() {

    if (this.id) {
      //  this.ed.playDetailVideo.next('1');
      this._location.back()
    } else {
      // this.ed.playDetailVideo.next('1');
      setTimeout(() => {
        this._location.back()
      }, 100);
    }
  }
  ngOnDestroy(): void {

  }
  navigate(event: any) {
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SELECT_CONTENT', {
        'itemName': event.title,
        'itemType': event.content_type,
        'itemId': event.id
      })

    }

    localStorage.setItem('CreatOrderC_id', event.id);
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      if (event.content_publish && event.content_publish.length) {
        for (let i in event.content_publish) {
          this.countryAllowed.push(event.content_publish[i].country_code);

        }
        var a = this.countryAllowed.indexOf(detail.countryCode);

        if (a && event.content_publish[0].country_code != "A") {
          const dialogRef = this.dialog.open(CountryLockPopupComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "adultAgePopup",
            width: "390px",
          });
        } else {
          this.router.navigate(["/" + event.permalink]);
        }
      } else {
        this.router.navigate(["/" + event.permalink]);
      }
    }

  }


  backClickedSearch() {
    this.display_offset = 0;
    this.getList();

    this.arrowShow = true;
    this.show = false;
  }
  search_bar() {
    this.toggleSearch = true;
  }
  searchDataShow: any;

  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path;
  }
  clear() {
    this.searchRes = true;
    this.toggleSearch = false;
    this.display_offset = 0;
    this.getList();
  }
  // getPage(page: any) {
  //   this.showKey = false;
  //   window.scroll(0, 0);
  //   this.p = page;
  //   let numb: any = localStorage.getItem("cat_type");

  //   if (this.cat == 'Genre') {
  //     this._dd
  //       .getGenreContentList((page - 1) * 12, this.cat_id, this.pageCatId)
  //       .pipe(
  //         map((res: IResult) => {
  //           if (res.code == 1) {
  //             this.show = false;
  //             this.DEC_SER.getDecryptedData(res?.result);
  //             let decryptData = JSON.parse(this.DEC_SER.decryptData);

  //             this.contentData = decryptData.content;
  //             this.totalItems = decryptData.totalCount;
  //             this.display_offset = decryptData.offset;


  //             this.contentData.map((category: any) => {
  //               category.sliderImg = "";
  //               category.sliderIdentifier = "";

  //               if (category.is_group == 1 && category.groupInfo != null) {
  //                 if (
  //                   category.groupInfo.global_thumb != null &&
  //                   category.groupInfo.global_thumb.length != 0
  //                 ) {
  //                   category.groupInfo.global_thumb.forEach((thumb: any) => {
  //                     if (thumb != null) {
  //                       if (thumb.layout == "square") {
  //                         thumb.layout = "circle";
  //                       }
  //                       if (
  //                         thumb.layout == "rectangle_16x9" &&
  //                         thumb.platform == "global"
  //                       ) {
  //                         thumb?.image_size.filter((img: any) => {
  //                           if (
  //                             Number(img.width) == 360 ||
  //                             Number(img.width) == 854
  //                           ) {
  //                             category.sliderImg = img.url;
  //                             category.sliderIdentifier = img.identifier;
  //                           } else if (category.sliderImg == "") {
  //                             category.sliderImg = thumb?.image_size[0].url;
  //                             category.sliderIdentifier =
  //                               thumb?.image_size[0].identifier;
  //                           }
  //                         });
  //                       }
  //                     }
  //                   });
  //                 } else if (category.groupInfo.thumbs != null) {
  //                   category.groupInfo.thumbs.forEach((thumb: any) => {
  //                     if (thumb != null) {
  //                       if (
  //                         thumb.layout == "rectangle_16x9" &&
  //                         thumb.platform == "web"
  //                       ) {
  //                         thumb?.image_size.filter((img: any) => {
  //                           if (
  //                             Number(img.width) == 360 ||
  //                             Number(img.width) == 854
  //                           ) {
  //                             category.sliderImg = img.url;
  //                             category.sliderIdentifier = img.identifier;
  //                           } else if (category.sliderImg == "") {
  //                             category.sliderImg = thumb?.image_size[0].url;
  //                             category.sliderIdentifier =
  //                               thumb?.image_size[0].identifier;
  //                           }
  //                         });
  //                       }
  //                     }
  //                   });
  //                 }
  //               } else if (category.is_group == 0) {
  //                 category.layout_thumbs.forEach((thumb: any) => {
  //                   if (thumb.layout == "rectangle_16x9") {
  //                     thumb?.image_size.filter((img: any) => {
  //                       if (Number(img.width) == 360 || Number(img.width) == 854) {
  //                         category.sliderImg = img.url;
  //                         category.sliderIdentifier = img.identifier;
  //                       } else if (category.sliderImg == "") {
  //                         category.sliderImg = thumb?.image_size[0].url;
  //                         category.sliderIdentifier =
  //                           thumb?.image_size[0].identifier;
  //                       }
  //                     });
  //                   }
  //                 });
  //               }
  //             });
  //           } else {

  //             this.show = true;
  //             this.contentData = []
  //           }
  //         })
  //       )
  //       .subscribe();
  //   } else {
  //     if (numb == "language") {
  //       this._dd
  //         .regionalLangAllData((page - 1) * 12)
  //         .pipe(
  //           map((res: IResult) => {
  //             this.DEC_SER.getDecryptedData(res?.result);
  //             let decryptData = JSON.parse(this.DEC_SER.decryptData);

  //             this.contentData = decryptData.content;
  //             this.totalItems = decryptData.totalCount;

  //             this.display_offset = decryptData.offset;
  //             this.contentData.map((category: any) => {
  //               category.sliderImg = "";
  //               category.sliderIdentifier = "";
  //               if (category.is_group == 1 && category.groupInfo != null) {
  //                 if (
  //                   category.groupInfo.global_thumb != null &&
  //                   category.groupInfo.global_thumb.length != 0
  //                 ) {
  //                   category.groupInfo.global_thumb.forEach((thumb: any) => {
  //                     if (thumb != null) {
  //                       if (thumb.layout == "square") {
  //                         thumb.layout = "circle";
  //                       }
  //                       if (
  //                         thumb.layout == "rectangle_16x9" &&
  //                         thumb.platform == "global"
  //                       ) {
  //                         thumb?.image_size.filter((img: any) => {
  //                           if (
  //                             Number(img.width) == 360 ||
  //                             Number(img.width) == 854
  //                           ) {
  //                             category.sliderImg = img.url;
  //                             category.sliderIdentifier = img.identifier;
  //                           } else if (category.sliderImg == "") {
  //                             category.sliderImg = thumb?.image_size[0].url;
  //                             category.sliderIdentifier =
  //                               thumb?.image_size[0].identifier;
  //                           }
  //                         });
  //                       }
  //                     }
  //                   });
  //                 } else if (category.groupInfo.thumbs != null) {
  //                   category.groupInfo.thumbs.forEach((thumb: any) => {
  //                     if (thumb != null) {
  //                       if (
  //                         thumb.layout == "rectangle_16x9" &&
  //                         thumb.platform == "web"
  //                       ) {
  //                         thumb?.image_size.filter((img: any) => {
  //                           if (
  //                             Number(img.width) == 360 ||
  //                             Number(img.width) == 854
  //                           ) {
  //                             category.sliderImg = img.url;
  //                             category.sliderIdentifier = img.identifier;
  //                           } else if (category.sliderImg == "") {
  //                             category.sliderImg = thumb?.image_size[0].url;
  //                             category.sliderIdentifier =
  //                               thumb?.image_size[0].identifier;
  //                           }
  //                         });
  //                       }
  //                     }
  //                   });
  //                 }
  //               } else if (category.is_group == 0) {
  //                 category.layout_thumbs.forEach((thumb: any) => {
  //                   if (thumb.layout == "rectangle_16x9") {
  //                     thumb?.image_size.filter((img: any) => {
  //                       if (Number(img.width) == 360 || Number(img.width) == 854) {
  //                         category.sliderImg = img.url;
  //                         category.sliderIdentifier = img.identifier;
  //                       } else if (category.sliderImg == "") {
  //                         category.sliderImg = thumb?.image_size[0].url;
  //                         category.sliderIdentifier =
  //                           thumb?.image_size[0].identifier;
  //                       }
  //                     });
  //                   }
  //                 });
  //               }
  //             });
  //           })
  //         )
  //         .subscribe();
  //     } else {
  //       this._dd
  //         .getDescriptionDataList((page - 1) * 12, this.cat_id)
  //         .pipe(
  //           map((res: IResult) => {
  //             this.DEC_SER.getDecryptedData(res?.result);
  //             let decryptData = JSON.parse(this.DEC_SER.decryptData);

  //             this.contentData = decryptData.content;
  //             this.totalItems = decryptData.totalCount;

  //             this.display_offset = decryptData.offset;
  //             this.contentData.map((category: any) => {
  //               category.sliderImg = "";
  //               category.sliderIdentifier = "";
  //               if (category.is_group == 1 && category.groupInfo != null) {
  //                 if (category.groupInfo.global_thumb != null) {
  //                   category.groupInfo.global_thumb.forEach((thumb: any) => {
  //                     if (thumb != null) {
  //                       if (thumb.layout == "square") {
  //                         thumb.layout = "circle";
  //                       }
  //                       if (
  //                         thumb.layout == "rectangle_16x9" &&
  //                         thumb.platform == "global"
  //                       ) {
  //                         thumb?.image_size.filter((img: any) => {
  //                           if (
  //                             Number(img.width) == 360 ||
  //                             Number(img.width) == 854
  //                           ) {
  //                             category.sliderImg = img.url;
  //                             category.sliderIdentifier = img.identifier;
  //                           } else if (category.sliderImg == "") {
  //                             category.sliderImg = thumb?.image_size[0].url;
  //                             category.sliderIdentifier =
  //                               thumb?.image_size[0].identifier;
  //                           }
  //                         });
  //                       }
  //                     }
  //                   });
  //                 } else if (category.groupInfo.thumbs != null) {
  //                   category.groupInfo.thumbs.forEach((thumb: any) => {
  //                     if (thumb != null) {
  //                       if (
  //                         thumb.layout == "rectangle_16x9" &&
  //                         thumb.platform == "web"
  //                       ) {
  //                         thumb?.image_size.filter((img: any) => {
  //                           if (
  //                             Number(img.width) == 360 ||
  //                             Number(img.width) == 854
  //                           ) {
  //                             category.sliderImg = img.url;
  //                             category.sliderIdentifier = img.identifier;
  //                           } else if (category.sliderImg == "") {
  //                             category.sliderImg = thumb?.image_size[0].url;
  //                             category.sliderIdentifier =
  //                               thumb?.image_size[0].identifier;
  //                           }
  //                         });
  //                       }
  //                     }
  //                   });
  //                 }
  //               } else if (category.is_group == 0) {
  //                 category.layout_thumbs.forEach((thumb: any) => {
  //                   if (thumb.layout == "rectangle_16x9") {
  //                     thumb?.image_size.filter((img: any) => {
  //                       if (Number(img.width) == 360 || Number(img.width) == 854) {
  //                         category.sliderImg = img.url;
  //                         category.sliderIdentifier = img.identifier;
  //                       } else if (category.sliderImg == "") {
  //                         category.sliderImg = thumb?.image_size[0].url;
  //                         category.sliderIdentifier =
  //                           thumb?.image_size[0].identifier;
  //                       }
  //                     });
  //                   }
  //                 });
  //               }
  //             });
  //           })
  //         )
  //         .subscribe();
  //     }

  //   }

  // }

  onScrollingFinished() {
    let numb: any = localStorage.getItem("cat_type");


    if (this.display_offset >= 4) {
      if (this.cat == 'genre') {

        this._dd
          .getGenreContentList(this.display_offset, this.cat_id)
          .pipe(
            map((res: IResult) => {
              if (res.code == 1) {
                this.show = false;
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);

                for (let i in decryptData.content) {
                  this.contentData.push(decryptData.content[i]);
                }

                this.totalItems = decryptData.totalCount;
                this.display_offset = decryptData.offset;


                this.contentData.map((category: any) => {
                  category.sliderImg = "";
                  category.sliderIdentifier = "";

                  if (category.is_group == 1 && category.groupInfo != null) {
                    if (
                      category.groupInfo.global_thumb != null &&
                      category.groupInfo.global_thumb.length != 0
                    ) {
                      category.groupInfo.global_thumb.forEach((thumb: any) => {
                        if (thumb != null) {
                          if (thumb.layout == "square") {
                            thumb.layout = "circle";
                          }
                          if (
                            thumb.layout == "rectangle_16x9" &&
                            thumb.platform == "global"
                          ) {
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
                    } else if (category.groupInfo.thumbs != null) {
                      category.groupInfo.thumbs.forEach((thumb: any) => {
                        if (thumb != null) {
                          if (
                            thumb.layout == "rectangle_16x9" &&
                            thumb.platform == "web"
                          ) {
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
              }
            })
          )
          .subscribe();
      } else {
        if (numb == "language") {
          this._dd
            .regionalLangAllData(this.display_offset)
            .pipe(
              map((res: IResult) => {
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);
                for (let i in decryptData.content) {
                  this.contentData.push(decryptData.content[i]);
                }
                // this.contentData = decryptData.content;
                this.totalItems = decryptData.totalCount;
                this.display_offset = decryptData.offset;
                this.contentData.map((category: any) => {
                  category.sliderImg = "";
                  category.sliderIdentifier = "";
                  if (category.is_group == 1 && category.groupInfo != null) {
                    if (
                      category.groupInfo.global_thumb != null &&
                      category.groupInfo.global_thumb.length != 0
                    ) {
                      category.groupInfo.global_thumb.forEach((thumb: any) => {
                        if (thumb != null) {
                          if (thumb.layout == "square") {
                            thumb.layout = "circle";
                          }
                          if (
                            thumb.layout == "rectangle_16x9" &&
                            thumb.platform == "global"
                          ) {
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
                    } else if (category.groupInfo.thumbs != null) {
                      category.groupInfo.thumbs.forEach((thumb: any) => {
                        if (thumb != null) {
                          if (
                            thumb.layout == "rectangle_16x9" &&
                            thumb.platform == "web"
                          ) {
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
              })
            )
            .subscribe();
        } else {

          this._dd
            .getDescriptionDataList(this.display_offset, this.cat_id)
            .pipe(
              map((res: IResult) => {
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);

                for (let i in decryptData.content) {
                  this.contentData.push(decryptData.content[i]);
                }
                // this.contentData = decryptData.content;
                this.totalItems = decryptData.totalCount;
                this.display_offset = decryptData.offset;
                this.contentData.map((category: any) => {
                  category.sliderImg = "";
                  category.sliderIdentifier = "";
                  if (category.is_group == 1 && category.groupInfo != null) {
                    if (category.groupInfo.global_thumb != null) {
                      category.groupInfo.global_thumb.forEach((thumb: any) => {
                        if (thumb != null) {
                          if (thumb.layout == "square") {
                            thumb.layout = "circle";
                          }
                          if (
                            thumb.layout == "rectangle_16x9" &&
                            thumb.platform == "global"
                          ) {
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
                    } else if (category.groupInfo.thumbs != null) {
                      category.groupInfo.thumbs.forEach((thumb: any) => {
                        if (thumb != null) {
                          if (
                            thumb.layout == "rectangle_16x9" &&
                            thumb.platform == "web"
                          ) {
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
              })
            )
            .subscribe();
        }

      }
    }


  }

  getCrownImg() {
    this._dd.faqData().subscribe((res: any) => {
      this.crownImg = res.App[0].crown_logo;
      this.freeImg = res.App[0].free_logo
      console.log(this.freeImg);
    })
  }

  isNewRelease(releaseDate: string): boolean {
    if (!releaseDate) return false;

    const now = new Date();
    const release = new Date(releaseDate);

    return now < release;
  }
}
