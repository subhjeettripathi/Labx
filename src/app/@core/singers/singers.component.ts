import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { __values } from 'tslib';
import { Location } from "@angular/common";
import { AudioPlayerComponent } from 'src/app/shared/audio-player/audio-player.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { userContentDescription } from '../show-detail/show-detail.component';
import * as firebase from 'firebase/app';
import { AdultAgePopupComponent } from 'src/app/shared/dialogBoxes/adult-age-popup/adult-age-popup.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
declare var $: any
@Component({
  selector: 'app-singers',
  templateUrl: './singers.component.html',
  styleUrls: ['./singers.component.scss']
})
export class SingersComponent implements OnInit {
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
  singerData: any
  cat: any
  type: any
  title: any
  defaultImages: any
  DefaultBanner: any
  singerImage: any
  albumIds: any = []
  singerDescription: any
  totalCountLikes: any;
  similarSinger: any = []
  currentValue: any
  currentValue1: any
  constructor(private _dd: DataService,private analyticsService:AnalyticsService, private DEC_SER: DecryptService, private _ar: ActivatedRoute, private location: Location, private dialog: MatDialog , private router: Router) {

  }
  ngOnInit(): void {
    this.getSingerList()
    window.scroll(0, 0)
  }
  getSingerList() {
    const userInfo: any = localStorage.getItem("taploginInfo");
    if (userInfo) {
      const USER_ACCOUNT: any = JSON.parse(userInfo);
      // this.getContentUserBehaviour(USER_ACCOUNT.id)
    }

    this._ar.queryParams.subscribe((params) => {
      let types = params["type"];
      if (types == 'composer') {
        this.type = 'composer'
        this.title = 'Podcasts'
      } else {
        this.type = 'singer'
        this.title = 'Albums'
      }
    });
    this._ar.paramMap.subscribe((params) => {
      this.cat = params.get("singersId");
      this._dd.getSingerContetnList(this.cat, this.type).subscribe((res: any) => {
        if (res.code == 1) {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.singerData = decryptData.details.name

          this.singerImage = decryptData.details.image
          this.singerDescription = decryptData.details.description

          this.similarSinger = decryptData.content
          console.log(this.similarSinger);


          for (let i in this.similarSinger) {
            this.albumIds.push(this.similarSinger[i].season_id)
          }


          this.similarSinger.map((category: any) => {
            category.sliderImg = "";
            category.sliderIdentifier = "";
            if (category.is_group == 1 && category.groupInfo != null) {
              if (category.groupInfo.global_thumb != null && category.groupInfo.global_thumb.length != 0) {
                category.groupInfo.global_thumb.forEach((thumb: any) => {
                  if (thumb != null) {

                    if (thumb.layout == "square" &&
                      thumb.platform == "global") {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          category.sliderImg = img.url;
                          category.sliderIdentifier = img.identifier;
                        } else if (category.sliderImg == "") {
                          category.sliderImg = thumb?.image_size[0].url;
                          category.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
                      });
                    }
                  }
                });
              } else if (category.groupInfo.thumbs != null) {
                category.groupInfo.thumbs.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (
                      thumb.layout == "vertical_9x16" &&
                      thumb.platform == "web"
                    ) {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          category.sliderImg = img.url;
                          category.sliderIdentifier = img.identifier;
                        } else if (category.sliderImg == "") {
                          category.sliderImg = thumb?.image_size[0].url;
                          category.sliderIdentifier = thumb?.image_size[0].identifier;
                        }
                      });
                    }
                  }
                });
              }

            } else if (category.is_group == 0) {
              category.layout_thumbs.forEach((thumb: any) => {
                if (thumb.layout == "square") {
                  thumb?.image_size.filter((img: any) => {
                    if (Number(img.width) == 640 || Number(img.width) == 720) {
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
        }
      });
    });
  }

  addPlaylistContent(contentId: any) {
    console.log(contentId);

    this.dialog.open(AdultAgePopupComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "Playlistpop",
      width: "390px",
      data: { content_Id: contentId },
    });
  }

  // addLikes(watchers: any, season_id: any) {
  //   console.log(season_id);
  //   if (watchers == 0) {
  //     $('#fill' + season_id).hide()
  //     $('#unfill' + season_id).show()
  //   } else {
  //     $('#fill' + season_id).show()
  //     $('#unfill' + season_id).hide()
  //   }
  //   // this.currentValue=content_id
  //   const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
  //   if (userIsLoggedIn == "1") {
  //     const userInfo: any = localStorage.getItem("taploginInfo") || {};
  //     if (Object.keys(userInfo).length) {
  //       const formData = new FormData();
  //       formData.append("user_id", JSON.parse(userInfo).id);
  //       formData.append("season_id", season_id);
  //       formData.append("like", watchers);
  //       this._dd.likeVeiwsCountPostSeason(formData).subscribe((res) => {
  //         this.getContentUserBehaviour(season_id);
  //         // this.getLikesData(content_id)
  //       });
  //     }
  //   } else if (!userIsLoggedIn) {
  //     const dialogRef = this.dialog.open(LoginModalDialogComponent, {
  //       backdropClass: "popupBackdropClass",
  //       panelClass: "logindialog",
  //       width: "390px",
  //       data: { name: "login" },
  //     });
  //     dialogRef.disableClose = true;
  //   }
  // }

  //   add(add: any, id: any, cat_id: any) {
  //     if (id.is_favourite == 1 && this.isOttLoggedIn) {
  //         id.is_favourite = 0;
  //     } else if (this.isOttLoggedIn) {
  //         id.is_favourite = 1;
  //     }

  //     const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
  //     if (userIsLoggedIn == "1") {
  //         const userInfo: any = localStorage.getItem("taploginInfo") || {};
  //         if (Object.keys(userInfo).length) {
  //             const formData = new FormData();
  //             formData.append("user_id", JSON.parse(userInfo).id);
  //             formData.append("content_id", id.id);
  //             formData.append("watchlist", id.is_favourite);
  //             formData.append("content_type", id.content_type);
  //             formData.append("cat_id", cat_id);
  //             this._dd.addRemoveToWatchList(formData).subscribe((res) => { });
  //         }
  //     } else if (!userIsLoggedIn) {
  //         const dialogRef = this.dialog.open(LoginModalDialogComponent, {
  //             backdropClass: "popupBackdropClass",
  //             panelClass: "logindialog",
  //             width: "390px",
  //             data: { name: "login" },
  //         });
  //     }
  // }

  // addRemoveToWatchlist(watcher: any, slide: any) {
  //     const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
  //     if (userIsLoggedIn == "1") {
  //         const userInfo: any = localStorage.getItem("taploginInfo") || {};
  //         if (Object.keys(userInfo).length) {
  //             const formData = new FormData();
  //             formData.append("user_id", JSON.parse(userInfo).id);
  //             formData.append("content_id", slide.id);
  //             formData.append("watchlist", watcher);
  //             formData.append("content_type", slide.content_type);
  //             formData.append("cat_id", slide.category_ids[0]);
  //             this._dd.addRemoveToWatchList(formData).subscribe((res) => {
  //                 this.getContentUserBehaviour();
  //             });
  //         }
  //     } else if (!userIsLoggedIn) {
  //         const dialogRef = this.dialog.open(LoginModalDialogComponent, {
  //             backdropClass: "popupBackdropClass",
  //             panelClass: "logindialog",
  //             width: "390px",
  //             data: { name: "login" },
  //         });
  //     }
  // }

  getContentUserBehaviour(ids: any) {
    console.log(ids);
    const userInfo: any = localStorage.getItem("taploginInfo");
    if (userInfo) {
      const USER_ACCOUNT: any = JSON.parse(userInfo);

      if (Object.keys(userInfo).length) {
        // this._dd.getHomeFavorites(USER_ACCOUNT.id).subscribe((res: any) => {
        //   if (res.code == 1) {
        //     this.DEC_SER.getDecryptedData(res?.result);
        //     let decryptData = JSON.parse(this.DEC_SER.decryptData);
        //     console.log(decryptData, "daaaaaaaaaaaa");
        //     if (decryptData.season_likes.includes(ids)) {
        //       this.userContentDescription.behaviour.likes = 1
        //       $('#fill' + ids).hide()
        //       $('#unfill' + ids).show()
        //       console.log("1");
        //     } else {
        //       this.userContentDescription.behaviour.likes = 0
        //       $('#unfill' + ids).hide()
        //       $('#fill' + ids).show()
        //       console.log("0");
        //     }
        //   }
        // });
      }
    }

  }

  onImgError(event: any, type: any) {

    this.defaultImages = localStorage.getItem("defaultImages")
    this.DefaultBanner = JSON.parse(this.defaultImages).rectangle.path
    if (type == "circle") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    } else if (type == "rectangle_16x9") {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path;
    } else if (type == "vertical_9x16") {
      event.target.src = JSON.parse(this.defaultImages).vertical.path;
    }
  }
  openAudioPlayer(event: any) {
    if (this.dialog.openDialogs.length == 0) {
      const alertRef = this.dialog.open(AudioPlayerComponent, {
        panelClass: 'audio_player',
        maxWidth: '100vw',
        width: "100%",
        height: "100%",
        hasBackdrop: false,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        data: { data: event },
        closeOnNavigation: false
      });
    }
  }
  navigate(event: any) {
    const userIsLoggedIn: any = localStorage.getItem("ott_isLoggedIn");
    const eventParams = {
      item_id: event.id,
      item_name: event.title,
      item_type: event.content_type,
      item_value: event.access_type,
      page_name: 'singers',
      season_id: event.season_id,
      series_id: event.series_id
    };
    this.analyticsService.logEvent('select_item', eventParams);
    this.dialog.closeAll();
    if (userIsLoggedIn == "1") {
      setTimeout(() => {
        if (this.dialog.openDialogs.length == 0) {
          const alertRef = this.dialog.open(AudioPlayerComponent, {
            panelClass: 'audio_player',
            maxWidth: '100vw',
            width: "100%",
            height: "100%",
            hasBackdrop: false,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            data: { data: event },
            closeOnNavigation: false
          });
        }
      }, 500);
    }
    else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });
      dialogRef.disableClose = true;
    }


  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }

}
