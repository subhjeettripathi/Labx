import { Component, OnInit, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HomeCategoryUtilsService } from "src/app/services/home-category-utils.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DecryptService } from "src/app/services/decrypt.service";
import { HttpClient } from "@angular/common/http";
import { DataService } from "src/app/services/data.service";
import { Location } from "@angular/common";
import { map } from "rxjs";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import * as firebase from "firebase/app";
import { Meta, Title } from "@angular/platform-browser";
import { AnalyticsService } from "src/app/services/analytics.service";
export interface userContentDescription {
  behaviour: any;
}
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  totalLikes: any
  totalViews: any
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
  user: any;
  newUser: any;
  mainData: any;
  taploginInfo: any = localStorage.getItem('taploginInfo') || {};
  windowSize: number = 0;
  isOttLoggedIn = false;
  display_offset: number = 0;
  display_limit: number = 4;
  homeData: any;
  likeInProgress: boolean = false;
  cat_id: any;
  decryptData: any;
  contentId: any
  ebookData: any = []
  defaultImages: any = [];
  bannerImg: any
  totalCountLikes: any;
  constructor(private dialog: MatDialog, private _hc: HomeCategoryUtilsService, private analyticsService: AnalyticsService,
    private homeservice: HomeCategoryUtilsService, private _ar: ActivatedRoute, private DEC_SER: DecryptService, private http: HttpClient, private dep_ser: DecryptService, public router: Router, private ds: DataService, private location: Location, private ed: ExchangeDataService, private renderer: Renderer2, private meta: Meta,
    private title: Title,) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value
      }
    });

  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
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
  ngOnInit(): void {
    this.eBookData()
    window.scroll(0, 0);
    this.defaultImages = localStorage.getItem("defaultImages");
    if (Object.keys(this.taploginInfo).length) {
      this.isOttLoggedIn = true;
    } else {
      this.isOttLoggedIn = false;
    }
    this.windowSize = window.innerWidth;
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
    if (this.ebookData.is_group == 1) {
      this.title.setTitle(this.ebookData.series_title + ' ' + this.ebookData.season_title)
      this.meta.updateTag({ name: 'description', content: this.ebookData.season_des });
    } else {
      this.title.setTitle(this.ebookData.title)
      this.meta.updateTag({ name: 'description', content: this.ebookData.des });
    }

    this.meta.updateTag({ name: 'keywords', content: this.ebookData.meta.genre });
  }


  onImgError(event: any, type: any) {
    console.log(type);
    if (type == 'circle') {
      event.target.src = JSON.parse(this.defaultImages).square.path
    }
    else if (type == 'rectangle_16x9') {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path
    }
    else if (type == 'vertical_9x16') {
      event.target.src = JSON.parse(this.defaultImages).vertical.path
    }
  }
  addRemoveToWatchlist(watcher: any, slide: any) {
    console.log(watcher, "watcher");


    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {

        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("content_id", slide.id);
        formData.append("favourite", watcher);
        this.ds.addRemoveToWatchList(formData).subscribe((res) => {
          if (res.code == 1) {
            if (res.code == 1) {
              if (watcher == 1) {
                this.userContentDescription.behaviour.favorite = 1

                const eventParams = {
                  item_name: slide.title,
                  item_type: slide.content_type,
                  item_id: slide.id,
                };
                this.analyticsService.logEvent('add_to_favorites', eventParams);
              } else {
                this.userContentDescription.behaviour.favorite = 0
              }

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
    }
  }


  getLikesData(id: any) {
    this.ds.getUserData(id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      this.totalCountLikes = decryptData
      console.log(decryptData, 'dataaaa');

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

    })
  }
  navigateToEbook(url: any) {
    this.router.navigate(['/epubPage']);
  }
  eBookData() {
    this._ar.paramMap.subscribe((params) => {
      window.scroll(0, 0);
      this.contentId = params.get("c_id");
      console.log(this.contentId)
      localStorage.setItem('ebookUrlId', this.contentId)
      this.ds
        .getDescriptionData(this.contentId)
        .pipe(
          map((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData.content, "ppp");
            this.ebookData = decryptData.content
            this.updateMetaData()
            this.getLikesData(this.ebookData.id)
            this.ebookData.sliderImg = ''
            if (this.ebookData.is_group == 1 && this.ebookData.groupInfo != null) {
              if (this.ebookData.groupInfo.global_thumb != null) {
                this.ebookData.groupInfo.global_thumb.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (thumb.layout == "square") {
                      thumb.layout = "circle";
                    }
                    if (thumb.layout == "vertical_9x16" &&
                      thumb.platform == "global") {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          this.ebookData.sliderImg = img.url;
                          this.ebookData.sliderIdentifier = img.identifier;
                        } else if (this.ebookData.sliderImg == "") {
                          this.ebookData.sliderImg = thumb?.image_size[0].url;
                          this.ebookData.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
                      });
                    }
                  }
                });
              } else if (this.ebookData.groupInfo.thumbs != null) {
                this.ebookData.groupInfo.thumbs.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (
                      thumb.layout == "vertical_9x16" &&
                      thumb.platform == "web"
                    ) {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          this.ebookData.sliderImg = img.url;
                          this.ebookData.sliderIdentifier = img.identifier;
                        } else if (this.ebookData.sliderImg == "") {
                          this.ebookData.sliderImg = thumb?.image_size[0].url;
                          this.ebookData.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
                      });
                    }
                  }
                });
              }

            }
            else if (this.ebookData.is_group == 0) {
              this.ebookData.layout_thumbs.forEach((thumb: any) => {
                if (thumb.layout == "vertical_9x16") {
                  thumb?.image_size.filter((img: any) => {
                    if (Number(img.width) == 360 || Number(img.width) == 854) {
                      this.ebookData.sliderImg = img.url;
                      this.ebookData.sliderIdentifier = img.identifier;
                    } else if (this.ebookData.sliderImg == "") {
                      this.ebookData.sliderImg = thumb?.image_size[0].url;
                      this.ebookData.sliderIdentifier = thumb?.image_size[0].identifier;
                    }
                  });
                }
              });
            }
          })
        )
        .subscribe();
    });
  }



  addLikes(watchers: any, content_id: any) {

    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (userIsLoggedIn == "1") {
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      const eventParams = {
        item_name: content_id.title,
        item_type: content_id.content_type,
        item_id: content_id.id,
        page_name: 'ebook',
        series_id: content_id.series_id,
        season_id: content_id.season_id,
        item_value: content_id.acces_type,
      };
      this.analyticsService.logEvent('like_item', eventParams);
      if (Object.keys(userInfo).length && !this.likeInProgress) {
        this.likeInProgress = true;

        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("like", watchers.toString());
        formData.append("content_id", this.contentId);

        this.ds.likeVeiwsCountPost(formData).subscribe((res: any) => {
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
      // const userInfo: any = localStorage.getItem("taploginInfo") || {};
      // if (Object.keys(userInfo).length) {
      //   const formData = new FormData();
      //   formData.append("user_id", JSON.parse(userInfo).id);
      //   formData.append("content_id", this.contentId);
      //   formData.append("like", watchers);
      //   this.ds.likeVeiwsCountPost(formData).subscribe((res) => {
      //     if (res.code == 1) {
      //       if (watchers == 1) {
      //         this.totalLikes = this.totalLikes + 1
      //         this.userContentDescription.behaviour.likes = 1
      //       } else {
      //         this.totalLikes = this.totalLikes - 1
      //         this.userContentDescription.behaviour.likes = 0
      //       }
      //     }
      //   });
      // }
    } else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });
    }
  }





}
