import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { videoJs } from "src/app/video-player/videojs";
import { Location } from "@angular/common";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { MatDialog } from "@angular/material/dialog";
declare var $: any;
@Component({
  selector: "app-review",
  templateUrl: "./review.component.html",
  styleUrls: ["./review.component.scss"],
})
export class ReviewComponent implements OnInit {
  constructor(
    private ds: DataService,
    private _ar: ActivatedRoute,
    private DEC_SER: DecryptService,
    private router: Router,
    private ed: ExchangeDataService,
    private location: Location,
    private dialog: MatDialog
  ) {}
  reviewData: any;
  player: any;
  private boundKeyHandler = this.handleKeyboardEvent.bind(this);

  audioSrc: any = [];
  itemget: any;
  hidePlay: boolean = false;
  hidePause: boolean = true;
  hideMute: boolean = true;
  hideUnmute: boolean = false;
  mappingId: any;
  abc: any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed = false;
  layoutThumb: any;
  shareUrl: any;
  offset: any = 0;
  limit: any = 20;
  isAd: any;
  tCount: any;
  adPath: any;
  id: any;
  FavoriteData: any;
  title:any

  ngOnInit(): void {
    window.addEventListener("keydown", this.boundKeyHandler);
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });

    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }

    this._ar.params.subscribe(params => {
      this.id = params["id"];
      console.log("Route ID:", this.id);
    
      this.title = params["title"];
      console.log("Route Title:", this.title);
    });
    // this.ed.showFooter.next(true);
    this.feels();

    localStorage.removeItem("episode");
  }
  goToSubscribe() {
    this.router.navigate(["/subscribe"], { state: { from: "feels" } });
  }
  feels() {
    this.ds.feels(this.offset, this.limit).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      this.reviewData = decryptData.content;
      this.tCount = decryptData.totalCount;
      this.getContentUserBehaviour();
      this.reviewData.forEach((element: any) => {
        this.reviewData.map((category: any) => {
          category.sliderImg = "";
          category.sliderIdentifier = "";

          if (category.is_group == 1 && category.groupInfo != null) {
            category.layout_thumbs.forEach((thumb: any) => {
              if (thumb != null) {
                if (thumb.layout == "vertical_9x16") {
                  thumb?.image_size.filter((img: any) => {
                    if (Number(img.width) == 1080 || Number(img.width) == 360) {
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
          } else if (category.is_group == 0) {
            category.layout_thumbs.forEach((thumb: any) => {
              if (thumb.layout == "vertical_9x16") {
                thumb?.image_size.filter((img: any) => {
                  if (Number(img.width) == 1080 || Number(img.width) == 360) {
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

        this.audioSrc.push({
          sources: [
            {
              title: element.title,
              duration: element.duration,
              url: element.hls_url,
              id: element.id,
              permalink: element.permalink,
              share_url: element.share_url,
              mapping_id: element.mapping_id,
              is_ad: element.is_ad,
              ad_url: element.ad_url,
              adImageUrl: element.sliderImg,
              category_id: element.category_ids[0],
              is_favourite: element.is_favourite,
            },
          ],
        });
        this.abc = element.title;
      });

      this.itemget = 0;
      if (this.itemget >= this.audioSrc.length) this.itemget = 0;

      if (this.id) {
        const index = this.audioSrc.findIndex(
          (item: any) => item?.sources[0]?.id == this.id
        );
        if (index != -1) {
          this.itemget = index;
        } else {
        }
      }

      this.player = videoJs("feelsplayer");
      this.player.on("play", () => {
        this.hidePlay = false;
        this.hidePause = true;
      });

      this.player.on("pause", () => {
        this.hidePlay = true;
        this.hidePause = false;
      });

      this.player.play().catch((error: any) => {
        if (error.name === "NotAllowedError") {
          this.hidePlay = true;
          this.hidePause = false;
        }
      });

      // this.player.src({
      //   src: this.audioSrc[this.itemget].sources[0].url
      // })

      // this.player.play()

      if (this.audioSrc[this.itemget].sources[0].is_ad == 1) {
        this.isAd = 1;

        $(".vjs-poster").css("right", "auto");
        this.player.load();
        this.player.reset();
        this.player.poster(this.audioSrc[this.itemget].sources[0].adImageUrl);
        if (this.hideMute == false) {
          this.player.volume(0);
        } else {
          this.player.volume(1);
        }
      } else {
        this.isAd = 0;
        // this.player.load()
        this.player.src({
          src: this.audioSrc[this.itemget].sources[0].url,
        });
        this.player.play();
        this.player.poster("");
      }
      this.abc = this.audioSrc[this.itemget].sources[0].title;
      this.mappingId = this.audioSrc[this.itemget].sources[0].mapping_id;
      var ad = this.audioSrc[this.itemget].sources[0].is_ad;
    });
  }
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      this.left();
    } else if (event.key === "ArrowRight") {
      this.right();
    }
  }
  getContentUserBehaviour() {
    const userInfo: any = localStorage.getItem("taploginInfo");
    if (userInfo) {
      const USER_ACCOUNT: any = JSON.parse(userInfo);
      if (Object.keys(userInfo).length) {
        this.ds.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.FavoriteData = decryptData.content_id;
            this.audioSrc.forEach((ele: any) => {
              // for (let i in this.FavoriteData) {
              //   if (ele.sources[0].mapping_id == this.FavoriteData[i]) {
              //     ele.sources[0].is_favourite = 1;
              //   } else {
              //     ele.sources[0].is_favourite = 0;
              //   }
              // }

              if (this.FavoriteData.includes(ele.sources[0].mapping_id)) {
                ele.sources[0].is_favourite = 1;
              } else {
                ele.sources[0].is_favourite = 0;
              }
            });
          }
        });
      }
    }
  }
  addRemoveToWatchlist() {
    const content_id = this.audioSrc[this.itemget].sources[0].mapping_id;

    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    if (
      this.audioSrc[this.itemget].sources[0].is_favourite == 1 &&
      userIsLoggedIn
    ) {
      this.audioSrc[this.itemget].sources[0].is_favourite = 0;
    } else if (userIsLoggedIn) {
      this.audioSrc[this.itemget].sources[0].is_favourite = 1;
    }
    if (userIsLoggedIn == "1") {
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append("user_id", JSON.parse(userInfo).id);
        formData.append("content_id", content_id);
        formData.append(
          "watchlist",
          this.audioSrc[this.itemget].sources[0].is_favourite
        );
        formData.append("content_type", "video");
        formData.append(
          "cat_id",
          this.audioSrc[this.itemget].sources[0].category_id
        );
        this.ds.addRemoveToWatchList(formData).subscribe((res) => {
          // this.getContentUserBehaviour();
        });
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
    }
  }
  left() {
    if (this.itemget == 0) {
      this.itemget = this.tCount;
    }
    this.hidePlay = false;
    this.hidePause = true;
    this.player.play();
    if (this.itemget != 0) {
      this.itemget--;
      this.abc = this.audioSrc[this.itemget].sources[0].title;
      this.mappingId = this.audioSrc[this.itemget].sources[0].mapping_id;
      this.shareUrl = this.audioSrc[this.itemget].sources[0].share_url;
      this.adPath = this.audioSrc[this.itemget].sources[0].adImageUrl;
      if (this.audioSrc[this.itemget].sources[0].is_ad == 1) {
        this.isAd = 1;
        this.player.load();
        this.player.reset();
        this.player.poster(this.adPath);
        if (this.hideMute == false) {
          this.player.volume(0);
        } else {
          this.player.volume(1);
        }
        // this.player.src({
        //   src: this.audioSrc[this.itemget].sources[0].url,
        // })
      } else {
        this.isAd = 0;
        this.player.src({
          src: this.audioSrc[this.itemget].sources[0].url,
        });
        this.player.play();
        this.player.poster("");
      }
    }
  }

  play() {
    this.player.play();
    this.hidePlay = false;
    this.hidePause = true;
  }

  pause() {
    this.player.pause();
    this.hidePlay = true;
    this.hidePause = false;
  }

  mute() {
    this.player.muted(true);
    this.hideMute = false;
    this.hideUnmute = true;
    if (this.player.muted()) {
      this.player.volume(0);
    }
  }

  unmute() {
    this.player.muted(false);
    this.hideMute = true;
    this.hideUnmute = false;
    if (!this.player.muted()) {
      this.player.volume(1);
    }
  }
  right() {
    if (this.tCount == this.itemget + 1) {
      this.itemget = 0;
    }
    if (this.limit - 2 == this.itemget) {
      this.offset = this.offset + 20;
      this.limit = this.limit + 20;

      this.ds.feels(this.offset, 20).subscribe((res: any) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.reviewData = decryptData.content;
        this.reviewData.forEach((element: any) => {
          this.reviewData.map((category: any) => {
            category.sliderImg = "";
            category.sliderIdentifier = "";

            if (category.is_group == 1 && category.groupInfo != null) {
              category.layout_thumbs.forEach((thumb: any) => {
                if (thumb != null) {
                  if (thumb.layout == "vertical_9x16") {
                    thumb?.image_size.filter((img: any) => {
                      if (
                        Number(img.width) == 1080 ||
                        Number(img.width) == 360
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
            } else if (category.is_group == 0) {
              category.layout_thumbs.forEach((thumb: any) => {
                if (thumb.layout == "vertical_9x16") {
                  thumb?.image_size.filter((img: any) => {
                    if (Number(img.width) == 1080 || Number(img.width) == 360) {
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

          this.audioSrc.push({
            sources: [
              {
                title: element.title,
                duration: element.duration,
                url: element.hls_url,
                id: element.id,
                permalink: element.permalink,
                share_url: element.share_url,
                mapping_id: element.mapping_id,
                is_ad: element.is_ad,
                ad_url: element.ad_url,
                adImageUrl: element.sliderImg,
              },
            ],
          });
          this.abc = element.title;
        });

        this.player = videoJs("feelsplayer");
        // this.player.src({
        //   src: this.audioSrc[this.itemget].sources[0].url
        // })

        // this.player.play()

        if (this.audioSrc[this.itemget].sources[0].is_ad == 1) {
          this.isAd = 1;

          $(".vjs-poster").css("right", "auto");
          this.player.load();
          this.player.reset();
          this.player.poster(this.audioSrc[this.itemget].sources[0].adImageUrl);
          if (this.hideMute == false) {
            this.player.volume(0);
          } else {
            this.player.volume(1);
          }

          this.isAd = 0;
          // this.player.load()
          this.player.src({
            src: this.audioSrc[this.itemget].sources[0].url,
          });
          this.player.play();
          this.player.poster("");
        }
        this.abc = this.audioSrc[this.itemget].sources[0].title;
        var ad = this.audioSrc[this.itemget].sources[0].is_ad;
      });
    }

    this.player.play();
    this.hidePlay = false;
    this.hidePause = true;
    if (this.audioSrc.length != this.itemget + 1) {
      this.itemget++;
      this.abc = this.audioSrc[this.itemget].sources[0].title;

      this.mappingId = this.audioSrc[this.itemget].sources[0].mapping_id;
      this.adPath = this.audioSrc[this.itemget].sources[0].adImageUrl;
      this.shareUrl = this.audioSrc[this.itemget].sources[0].share_url;
      if (this.audioSrc[this.itemget].sources[0].is_ad == 1) {
        this.isAd = 1;
        this.player.load();
        this.player.reset();
        this.player.poster(this.adPath);
        if (this.hideMute == false) {
          this.player.volume(0);
        } else {
          this.player.volume(1);
        }
        // this.player.src({
        //   src: this.audioSrc[this.itemget].sources[0].url,
        // })
      } else {
        this.isAd = 0;
        this.player.src({
          src: this.audioSrc[this.itemget].sources[0].url,
        });
        this.player.play();
        this.player.poster("");
      }
    }
  }
  back() {
    this.router.navigate(["/"]);
  }
  sharing(type: string) {
    const newLocal = "width=600,height=300";

    const share_url = this.audioSrc[this.itemget].sources[0].share_url;
    const redirect_url = share_url.replace(/(https:\/\/[^/]+)\/[^/]+/, "$1/reels");
    console.log(redirect_url);
    
    console.log(share_url)
    if (type === "fb") {
      let link = `https://www.facebook.com/sharer/sharer.php?&u=${redirect_url}`;
      window.open(link, "Facebook", newLocal);
    } else if (type === "twitter") {
      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=vive%0A${redirect_url}`;
      window.open(urls, "TwitterWindow", newLocal);
    }
  }
  share() {
    if (this.mappingId != 0) {
      this.router.navigate(["/alt/title/" + this.mappingId]);
    } else {
      this.router.navigate(["**"]);
    }
    // this.router.navigate(["/alt/title/" + this.mappingId]);
  }
  touchStart(event: any) {
    if (this.audioSrc[this.itemget].sources[0].is_ad == 1) {
      window.open(this.audioSrc[this.itemget].sources[0].ad_url, "_blank");
    }
  }
  adClick() {
    if (this.audioSrc[this.itemget].sources[0].is_ad == 1) {
      window.open(this.audioSrc[this.itemget].sources[0].ad_url, "_blank");
    }
  }

  ngOnDestroy(): void {
    this.player.dispose();
    window.removeEventListener("keydown", this.boundKeyHandler);
    // this.ed.showFooter.next(false);
  }
}
