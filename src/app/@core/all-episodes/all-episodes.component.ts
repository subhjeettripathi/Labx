import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { IosDecrycptionService } from 'src/app/services/ios-decrycption.service';
import { StorageService } from 'src/app/services/storage.service';
import { AdultAgePopupComponent } from 'src/app/shared/dialogBoxes/adult-age-popup/adult-age-popup.component';
import { ChechPinParentalComponent } from 'src/app/shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { ParentalOtpCreateComponent } from 'src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component';
import { IResult } from 'src/app/shared/models/result.data';
import { VideojsDialogComponent } from 'src/app/shared/videojs-dialog/videojs-dialog.component';

@Component({
  selector: 'app-all-episodes',
  templateUrl: './all-episodes.component.html',
  styleUrls: ['./all-episodes.component.scss']
})
export class AllEpisodesComponent implements OnInit {
  contentId: any;
  showData: any = [];
  episodesArray: any = []
  episodeBoolean: boolean = false
  selected: any;
  seasonData: any = []
  title: any;
  rentalData: any;
  seasonSelectData: any = []
  selected1: any = 'Season'
  selectedEpisode: any;
  windowSize: number = 0;
  display_offset: number = 0;
  getBrowserName: any
  hellData: any = []
  totalEpisodes: any
  cat: any;
  fbTitle: any
  fbCid: any;
  userId: any;
  user: any;
  defaultImages: any = []
  videoJsData: any;
  visitorId: any;
  isSubscribed = false
  isSubsInfo: any = localStorage.getItem('is_subscriber') || {};
  playVid: any;
  successs: any;
  constructor(private _FPS: FingerPrintService, private _storage: StorageService, private _ar: ActivatedRoute, private _dd: DataService, private DEC_SER: DecryptService, private _location: Location, private dialog: MatDialog, private ed: ExchangeDataService, private auth: AuthService, private fcs: FunctionCallingService, private router: Router, private DEC_SCR_IOS: IosDecrycptionService,) {

    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });


  }

  ngOnInit(): void {
    this.getBrowserName = this.detectBrowserName()
    this.defaultImages = localStorage.getItem("defaultImages")
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true
    } else {
      this.isSubscribed = false
    }
    this.windowSize = window.innerWidth;
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));
    this._ar.queryParamMap.subscribe((params: any) => {
      window.scroll(0, 0);
      this.contentId = params.get("id");

      this._dd.getDescriptionData(this.contentId).pipe(map((res: IResult) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        this.showData = decryptData.content;
        console.log(this.showData)
        console.log(this.showData);
        if (this.showData.is_group == 1) {
          this.title = this.showData.groupInfo.name
          this.seasonData = this.showData.groupInfo.child
          console.log(this.seasonData, 'hjhjh');

          this.showData.groupInfo.child.forEach((thumb: any) => {
            if (thumb.id == this.showData.season_id) {
              this.episodesArray = thumb.episode_arrays
              this.selectedEpisode = this.episodesArray[0].offset
              console.log(this.episodesArray);

              if (thumb.total_episode > 10) {
                this.episodeBoolean = true
              }

              this.selected = thumb.id
              console.log(this.selected);
              this.getData(thumb.id)
            }
          })
        }



      })).subscribe();
    })
  }

  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  playvideo(event: any) {
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      console.log(event);
      this.videoJsData = event;
      const subs: any = localStorage.getItem("ott_subscriptionPlan");
      const userInfo: any = localStorage.getItem('taploginInfo') || {};
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      if (Object.keys(userInfo).length) {
        const formData: any = new FormData();
        const visitorIds: any = localStorage.getItem('device_id')
        formData.append("customer_id", JSON.parse(userInfo).id);
        formData.append("device_unique_id", visitorIds);
        formData.append('country_code', detail.countryCode);
        formData.append('content_id', event.id);
        formData.append('package_type', event.package_mode);
        if (subs != null && JSON.parse(subs).packages_list.length) {
          const firstOTTPackage = JSON.parse(subs).packages_list.find((res: any) => res.package_mode === 'OTT');
          if (firstOTTPackage) {
            formData.append("session_status", 1);
            formData.append("device", "web");
            formData.append("device_count", firstOTTPackage.device_restriction);
            formData.append("type", firstOTTPackage.restriction_type);
          }
        } else {
          formData.append("session_status", '');
          formData.append("device", '');
          formData.append("device_count", '');
          formData.append("type", '');
        }
        this.auth.isAllowed(formData).subscribe((res) => {
          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.fcs.logoutProfile.next(true);
          } else if (res.code == 1) {
            this.videoJsPopup()
          } else if (res.code == 2) {
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data

            this.playRental()

          } else if (res.code == 3) {
            this._dd.getUserSubscriptionDetails(JSON.parse(userInfo).id).subscribe(res => {
              this.DEC_SER.getDecryptedData(res.result);
              const data: any = JSON.parse(this.DEC_SER.decryptData);
              if (data.is_subscriber == 1) {
                this.ed.isSubscribe.next(true);
                this.ed.alreadySubscriber.next(true)
                localStorage.setItem('is_subscriber', '1')
              } else if (data.is_subscriber == 0) {
                localStorage.setItem('is_subscriber', '0')
              }
              // this._storage.setData('ott_subscriptionPlan', data);
              this.videoJsPopup()
            })
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            if (event.access_type == 'paid' && event.is_allow != 1) {
              this.router.navigate(["/subscribe"]);
            } else {
              this.videoJsPopup()
            }
          }
        })
      } else {
        const dialogRef = this.dialog.open(LoginModalDialogComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "logindialog",
          width: "390px",
          data: { name: "login" },
        });
        dialogRef.disableClose = true;
      }
    }

  }

  playRental() {
    const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
      panelClass: 'rentalPop',
      width: "800px",
      data: { rent: this.rentalData }
    });

  }
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path
  }
  verifyStatus(data: any, aged: any, event: any) {
    if (data.access_type == "free") {
      if (localStorage.getItem("taploginInfo") === null) {
        if (data.age_group >= 18) {
          if (this.dialog.openDialogs.length == 0) {
            const dialogRef = this.dialog.open(AdultAgePopupComponent, {
              panelClass: "adultAgePopup",
              width: "500px",
              data: { dat: event },
            });
            const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
              this.playVid = data;
              if (this.playVid) {
                this.videoJsPopup()
              }
            });

          }
        } else {
          this.videoJsPopup()
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
            if (parental_read.is_parental == 1 && isSubscriberUser == '1') {

              if (Number(aged) >= parental_read.restriction_level) {
                const dialogRef = this.dialog.open(ChechPinParentalComponent, {
                  panelClass: "contactfooter",
                  width: "390px",
                });

                dialogRef.afterClosed().subscribe((result) => { });
                const sub = dialogRef.componentInstance.isSuccess.subscribe(
                  (e: any) => {
                    this.successs = e;

                    if (this.successs) {
                      this.videoJsPopup();
                    }
                  }
                );
              } else {
                this.videoJsPopup()
              }
            } else {
              this.videoJsPopup();
            }
          }
        } else {
          this.videoJsPopup();
        }
      }
    }
    else if (data.access_type == "paid") {
      if (this.isSubscribed == true) {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read.is_parental == 0) {
          this.videoJsPopup();
        } else {
          if (parental_read.is_parental == 1 && isSubscriberUser == '1') {
            if (Number(aged) >= Number(parental_read.restriction_level)) {

              const dialogRef = this.dialog.open(ChechPinParentalComponent, {
                panelClass: "contactfooter",
                width: "390px",
              });

              dialogRef.afterClosed().subscribe((result) => { });
              const sub = dialogRef.componentInstance.isSuccess.subscribe(
                (e: any) => {
                  this.successs = e;

                  if (this.successs) {
                    this.videoJsPopup();
                  }
                }
              );
            } else {
              this.videoJsPopup();
            }
            // }
          } else {


            this.videoJsPopup();
          }
        }
      } else if (this.isSubscribed == false) {
        this.router.navigate(["/subscribe"]);
      }
    }
  }

  convertTimeToMinutes(timeString: any): string {
    const hours = Number(timeString.slice(0, 2));
    const minutes = Number(timeString.slice(3, 5));
    const seconds = Number(timeString.slice(6, 8));
    let totalMinutes = (hours * 60) + minutes;
    if (seconds >= 30) {
      totalMinutes += 1;
    }
    const formattedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;
    return formattedMinutes;
  }

  videoJsPopup() {
    this.dialog.closeAll()
    if (this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
      if (this.user) {
        this._dd.getMainUrl(this.videoJsData.id, this.user.id).subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                this.videoJsData.url = decryptData.fairplay_url
              } else {
                this.videoJsData.url = decryptData.url
              }
            } else {
              this.videoJsData.url = decryptData.url
            }

            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: this.videoJsData },
              });
              alertRef.afterClosed().subscribe(result => {

              });
            };
          }
        })
      } else {
        this._dd.getMainUrl(this.videoJsData.id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
            if (decryptData.fairplay_allow == 1) {
              if (decryptData.fairplay_url != '') {
                this.videoJsData.url = decryptData.fairplay_url
              } else {
                this.videoJsData.url = decryptData.url
              }

            } else {
              this.videoJsData.url = decryptData.url
            }
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: this.videoJsData },
              });
              alertRef.afterClosed().subscribe(result => {

              });
            };
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);

      if (this.user) {
        this._dd.getMainUrl(this.videoJsData.id, this.user.id).subscribe((res: any) => {

          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            // this.m3u8Main = decryptData.url;
            // setTimeout(() => {
            this.videoJsData.url = decryptData.url
            // }, 600);
            // setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: this.videoJsData },
              });
              alertRef.afterClosed().subscribe(result => {

              });
            };
            // }, 1000);


          }
        })
      } else {
        this._dd.getMainUrl(this.videoJsData.id, "").subscribe((res: any) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            // this.m3u8Main = decryptData.url;

            // setTimeout(() => {
            this.videoJsData.url = decryptData.url
            // }, 600);
            // setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(VideojsDialogComponent, {
                maxWidth: "100vw",
                panelClass: "videojsplayer",
                maxHeight: "100vh",
                height: "calc(100% - 100px)",
                width: "100%",
                data: { url: this.videoJsData },
              });
              alertRef.afterClosed().subscribe(result => {

              });
            };
            // }, 1000);


          }
        })
      }
    }
    // 
    // this.getm3u8Url(this.videoJsData.id)

    localStorage.setItem('miniplay', '0')

    // 

    // if (this.dialog.openDialogs.length == 0) {
    //   const alertRef = this.dialog.open(VideojsDialogComponent, {
    //     maxWidth: '100vw',
    //     panelClass: 'videojsplayer',
    //     maxHeight: '100vh',
    //     height: 'calc(100% - 100px)',
    //     width: '100%',
    //     data: { url: this.videoJsData },
    //   })

    //   alertRef.afterClosed().subscribe(result => {

    //     console.log('The dialog was closed', result)
    //   });
    // }
  }
  getData(event: any) {

    this._dd.getSeasonData(this.display_offset, event).pipe(map((res: IResult) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.seasonSelectData = decryptData.content;
        console.log(this.seasonSelectData, 'ghjkjhgfdfghjk');
        this.hellData = []
        this.showData.groupInfo.child.forEach((thumb: any) => {
          if (thumb.id == event) {
            this.totalEpisodes = thumb.total_episode
            this.episodesArray = thumb.episode_arrays;
            console.log(this.episodesArray, 'eppppp');

            this.selectedEpisode = this.episodesArray[0].offset
          }
        });
        this.seasonSelectData.map((category: any) => {
          this.hellData.push({ 'content_id': category.id, 'is_favourite': category.is_favourite })
          category.totalSlides = 6;
          category.sliderImg = "";
          category.sliderIdentifier = "";

          category.layout_thumbs.forEach((thumb: any) => {

            if (thumb.layout == "rectangle_16x9") {
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
          });


        });
      }
      else if (res.code == 0) {
        this.seasonSelectData = []
        console.log(this.seasonSelectData);
      }


    })).subscribe();
  }

  getEpisodeData(event: any) {

    this.seasonSelectData = []
    this._dd.getSeasonData(Number(event), this.selected).pipe(map((res: IResult) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.seasonSelectData = decryptData.content;
        console.log(this.seasonSelectData);
        this.hellData = []
        this.seasonSelectData.map((category: any) => {
          this.hellData.push({ 'content_id': category.id, 'is_favourite': category.is_favourite })
          category.totalSlides = 6;
          category.sliderImg = "";
          category.sliderIdentifier = "";

          category.layout_thumbs.forEach((thumb: any) => {

            if (thumb.layout == "rectangle_16x9") {
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
          });


        });
      }
      else if (res.code == 0) {
        this.seasonSelectData = []
        console.log(this.seasonSelectData);
      }
    })).subscribe();


  }
  addEpisodeToWatchlist(watcher: any, cat_id: any, content_id: any) {
    const userIsLoggedIn: any = localStorage.getItem('ott_isLoggedIn')
    if (userIsLoggedIn == "1") {
      this.hellData.map((category: any) => {
        if (category.content_id == content_id) {
          category.is_favourite = watcher
        }

      })
      // console.log(this.hellData);
      const userInfo: any = localStorage.getItem('taploginInfo') || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append('user_id', JSON.parse(userInfo).id);
        formData.append('content_id', content_id)
        formData.append('favourite', watcher)
        // formData.append('content_type', 'video');
        // formData.append('cat_id', cat_id);
        this._dd.addRemoveToWatchList(formData).subscribe(res => {

        });
      }
    }
    else if (!userIsLoggedIn) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: 'popupBackdropClass',
        panelClass: 'logindialog',
        width: "390px",
        data: { name: "login" },
      });
    }
  }
  sharing(type: string, url: any) {
    const newLocal = 'width=600,height=300';
    const share_url = url.share_url;
    if (type === 'fb') {

      this.cat = url.categories
      this.fbTitle = url.title
      this.fbCid = url.id

      let link = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faltpdev.faste.tv%2F${this.cat}%2F${this.fbTitle}%2F${this.fbCid}&amp;src=sdkpreparse"`;
      window.open(link, 'Facebook', newLocal);
    } else if (type === 'tweet') {

      this.cat = url.categories
      this.fbTitle = url.title

      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=${this.fbTitle}%0A${share_url}`;

      window.open(urls, 'TwitterWindow', newLocal);
    } else if (type === 'copy') {
      navigator.clipboard.writeText(`${share_url}`);

    }
  }
  backClicked() {
    this._location.back();
  }
}
