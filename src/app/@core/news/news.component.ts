import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DecryptService } from "src/app/services/decrypt.service";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";
import { environment } from "src/environments/environment";
//import * as amplitude from '@amplitude/analytics-browser';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  user: any;
  newUser: any;
  mainData: any;
  windowSize: number = 0;
  display_offset: number = 0;
  display_limit: number = 4;
  homeData: any;
  cat_id: any;
  decryptData: any;

  constructor(private dialog: MatDialog, private _hc: HomeCategoryUtilsService,
    private homeservice: HomeCategoryUtilsService, private _ar: ActivatedRoute, private http: HttpClient, private dep_ser: DecryptService, public router: Router, private ds: DataService) { }

  ngOnInit(): void {
    window.scroll(0, 0);
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
           
            this.getNewsData();
          });
      });
    } else {
      this.mainData = this.user.dashboard.home_category
      this.getNewsData();

    }
    // this.trackMe();
  }
  getNewsData() {
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
               else if(cat.groupInfo.season_banner!=null){
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
                if(cat.groupInfo!=null && cat.groupInfo.global_thumb!=null){
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
               else if(cat.groupInfo!=null && cat.groupInfo.thumbs!=null){
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
              if(cat.layout_thumbs !=null){
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

 
     userInfo:any;
     userDetails:any;
   
     

}
