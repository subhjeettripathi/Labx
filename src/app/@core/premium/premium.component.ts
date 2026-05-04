import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DecryptService } from "src/app/services/decrypt.service";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";
import { environment } from 'src/environments/environment';
//import * as amplitude from '@amplitude/analytics-browser';
import { ExchangeDataService } from "src/app/services/exchange-data.service";
@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {
  user: any;
  newUser: any;
  mainData: any;
  windowSize: number = 0;
  display_offset: number = 0;
  display_limit: number = 4;
  homeData: any;
  cat_id: any;
  decryptData: any;
  FavoriteData: any = [];

  constructor(private dialog: MatDialog, private _hc: HomeCategoryUtilsService,  private ed: ExchangeDataService,
    private homeservice: HomeCategoryUtilsService, private _ar: ActivatedRoute, private http: HttpClient, private dep_ser: DecryptService, public router: Router, private ds: DataService) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    localStorage.setItem("active", 'Premium');
    this.ed.active.next("Premium");
    this.windowSize = window.innerWidth;
    this.homeservice.castUser.subscribe(user => this.user = user);
   
   
    if (this.user == 0) {
      this._ar.paramMap.subscribe((params) => {
        this.cat_id = params.get("id");
        this.ds
          .getHomeData(this.display_offset, this.display_limit, this.cat_id)
          .subscribe((res: any) => {
            this.dep_ser.getDecryptedData(res?.result);
            this.decryptData = JSON.parse(this.dep_ser.decryptData);
            this.homeData = this.decryptData;
            this.homeservice.sendDataToComponent(this.homeData);
            this.mainData = this.homeData.dashboard.home_category
         
            this.getPremiumData();
          });
      });
    } else {
      this.mainData = this.user.dashboard.home_category
      this.getPremiumData();

    }
    // this.trackMe()
  }
  getPremiumData() {
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    if (USER_ACCOUNT) {
      this.ds.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
        if (res.code == 1) {
          this.dep_ser.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.dep_ser.decryptData);
          this.FavoriteData = decryptData.content_id;
        

          this.mainData.forEach((ele: any) => {
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
    }
    this.mainData.map((category: any) => {
      if (category.multiple_layout != null) {
        let selectedLayout: any = {};
        selectedLayout = category.multiple_layout.find(
          (multi: any) => multi.platform === "web"
        );
        if (selectedLayout !== undefined) {
          category.totalSlides = selectedLayout.slider;
          category.type = selectedLayout.layout;
          category.cat_cntn.forEach((cat: any) => {
            cat.sliderImg = "";
            cat.sliderIdentifier = "";
            if (cat.is_group == 1 && cat.groupInfo != null) {
              if (category.category_type == "feature_banner") {
                if (cat.groupInfo.global_thumb != null) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier = thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }
                else if (cat.groupInfo.season_banner != null) {
                  cat.groupInfo.season_banner.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 854) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier = thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }
              }
              else if (category.category_type == "default") {
                if (cat.groupInfo != null && cat.groupInfo.global_thumb != null) {
                  cat.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier = thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }
                else if (cat.groupInfo != null && cat.groupInfo.thumbs != null) {
                  cat.groupInfo.thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == selectedLayout.layout) {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            cat.sliderImg = img.url;
                            cat.sliderIdentifier = img.identifier;
                          } else if (cat.sliderImg == "") {
                            cat.sliderImg = thumb?.image_size[0].url;
                            cat.sliderIdentifier = thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                }

              }

            }
            else if (cat.is_group == 0) {
              if (cat.layout_thumbs != null) {
                cat.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == "square") {
                    thumb.layout = "circle";
                  }
                  if (thumb.layout == selectedLayout.layout) {
                    thumb?.image_size.filter((img: any) => {
                      if (category.category_type == "feature_banner") {
                        if (Number(img.width) == 854) {
                          cat.sliderImg = img.url;
                          cat.sliderIdentifier = img.identifier;
                        } else if (cat.sliderImg == "") {
                          cat.sliderImg = thumb?.image_size[0].url;
                          cat.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
                      } else if (category.category_type == "default") {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          cat.sliderImg = img.url;
                          cat.sliderIdentifier = img.identifier;
                        } else if (cat.sliderImg == "") {
                          cat.sliderImg = thumb?.image_size[0].url;
                          cat.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
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

    this._hc.pushHomeCategoryData(this.mainData);
  }


  newUsers(user: any) {
    this.homeservice.sendDataToComponent(this.newUser);
  }

  userInfo: any;
  userDetails: any;

}
