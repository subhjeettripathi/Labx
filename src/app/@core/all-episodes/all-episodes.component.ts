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
import { IResult } from 'src/app/shared/models/result.data';
import { VideojsDialogComponent } from 'src/app/shared/videojs-dialog/videojs-dialog.component';
import { environment } from 'src/environments/environment';
//import * as amplitude from '@amplitude/analytics-browser';
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
  userId: any
  user: any
  title: any;
  seasonSelectData: any = []
  m3u8Main: any
  selected1: any = 'Season'
  selectedEpisode: any;
  windowSize: number = 0;
  display_offset: number = 0;
  hellData: any = []
  totalEpisodes: any
  cat: any;
  getBrowserName:any;
  fbTitle: any
  fbCid: any;
  defaultImages: any = []
  videoJsData: any;
  isSubscribed = false
  isSubsInfo: any = localStorage.getItem('is_subscriber') || {};
  playVid: any;
  successs: any;
  navbarAd:any=[]
  navvar:any=[];
  episodeValue:any;
  constructor(private _FPS: FingerPrintService, private _storage: StorageService, private _ar: ActivatedRoute, private _dd: DataService, private DEC_SER: DecryptService, private _location: Location, private dialog: MatDialog, private ed: ExchangeDataService, private auth: AuthService, private fcs: FunctionCallingService, private router: Router, private DEC_SCR_IOS:IosDecrycptionService) {

    this.ed.isSubscribe.subscribe(value => {
      this.isSubscribed = value;
    });


  }

  ngOnInit(): void {

    this.defaultImages = localStorage.getItem("defaultImages")
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true
    } else {
      this.isSubscribed = false
    }
    this.navbarAd = localStorage.getItem('faqData')
    this.navvar = JSON.parse(this.navbarAd)
    this.windowSize = window.innerWidth;
    this._ar.queryParamMap.subscribe((params: any) => {
      window.scroll(0, 0);
      this.contentId = params.get("id");
         
      this._dd.getDescriptionData(this.contentId).pipe(map((res: IResult) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        this.showData = decryptData.content;
       
        if (this.showData.is_group == 1) {
          this.title = this.showData.groupInfo.name
          this.seasonData = this.showData.groupInfo.child
         
          

          this.showData.groupInfo.child.forEach((thumb: any) => {
            if (thumb.id == this.showData.season_id) {
              this.episodesArray = thumb.episode_arrays
              this.selectedEpisode = this.episodesArray[0].offset
            

              if (thumb.total_episode > 10) {
                this.episodeBoolean = true
              }

              this.selected = thumb.id
              
              this.getData(thumb.id,0)
            }
          })
        }



      })).subscribe();
    })
    this.getBrowserName = this.detectBrowserName()
 
  }
  EpisodeNavigation(data:any){
    
    if(data.is_ad == 1) {
      window.open(data.ad_url);
    } else {
      if(this.isSubscribed){
        this.router.navigate(["/" + data.permalink]);
        window.scroll(0,0)
        localStorage.setItem('episode','1')
        if(this.episodeChange!=1){
          localStorage.setItem('episodeSelected',data.groupInfo.child[0].episode_arrays[0].offset)
        }
        
      }else{
        if(data.access_type == "paid"){
          this.router.navigate(["/subscribe"]);
        }else if(data.access_type == "free"){
     
          this.router.navigate(["/" + data.permalink]);
          window.scroll(0,0)
        }
      }
    }
  
  }
  
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path
  }

  verifyStatus(data: any, aged: any, event: any) {
    if (data.access_type == "free") {
      if (localStorage.getItem("taploginInfo") === null) {
        if (data.age_group >= 18 && data.age_group != 999) {
          if (this.dialog.openDialogs.length == 0) {
            const dialogRef = this.dialog.open(AdultAgePopupComponent, {
              panelClass: "adultAgePopup",
              width: "500px",
              data: { dat: event },
            });
            const sub = dialogRef.componentInstance.sen.subscribe(
              (data: any) => {
                this.playVid = data;
                if (this.playVid) {
                  this.videoJsPopup();
                }
              }
            );
          }
        } else if (data.age_group == -1) {
          if (this.dialog.openDialogs.length == 0) {
            const dialogRef = this.dialog.open(AdultAgePopupComponent, {
              panelClass: "adultAgePopup",
              width: "500px",
              data: { dat: event },
            });
            const sub = dialogRef.componentInstance.sen.subscribe(
              (data: any) => {
                this.playVid = data;
                if (this.playVid) {
                  this.videoJsPopup();
                }
              }
            );
          }
        } else {
          this.videoJsPopup();
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
            if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
              if (Number(parental_read.restriction_level) == -1) {
                this.showPin();
              } else if (Number(parental_read.restriction_level) == 999) {
                this.videoJsPopup();
              } else if (Number(parental_read.restriction_level) < 999) {
                if (Number(aged) == 999) {
                  this.videoJsPopup();
                } else if (
                  Number(aged) >= Number(parental_read.restriction_level) ||
                  Number(aged) == -1
                ) {
                  this.showPin();
                } else {
                  this.videoJsPopup();
                }
              }
            } else {
              this.videoJsPopup();
            }
          }
        } else {
          this.videoJsPopup();
        }
      }
    } else if (data.access_type == "paid") {
      if (this.isSubscribed == true) {
        var isSubscriberUser: any = localStorage.getItem("is_subscriber");
        var parental: any = localStorage.getItem("taploginInfo");
        var parental_read = JSON.parse(parental);
        var group_age: any = localStorage.getItem("isParentalRestriction");
        if (parental_read.is_parental == 0) {
          this.videoJsPopup();
        } else {
          if (parental_read.is_parental == 1 && isSubscriberUser == "1") {
            if (Number(parental_read.restriction_level) == -1) {
              this.showPin();
            } else if (Number(parental_read.restriction_level) == 999) {
              this.videoJsPopup();
            } else if (Number(parental_read.restriction_level) < 999) {
              if (Number(aged) == 999) {
                this.videoJsPopup();
              } else if (
                Number(aged) >= Number(parental_read.restriction_level) ||
                Number(aged) == -1
              ) {
                this.showPin();
              } else {
                this.videoJsPopup();
              }
            }
          } else {
            this.videoJsPopup();
          }
        }
      } else if (this.isSubscribed == false) {
        this.router.navigate(["/subscribe"]);
      }
    }
  }

  showPin() {
    const dialogRef = this.dialog.open(ChechPinParentalComponent, {
      panelClass: "contactfooter",
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow='auto'
    });
    const sub = dialogRef.componentInstance.isSuccess.subscribe((e: any) => {
      this.successs = e;

      if (this.successs) {
        this.videoJsPopup();
      }
    });
  }

  // verifyStatus(data: any, aged: any, event: any) {
  //   if (data.access_type == "free") {
  //     if (localStorage.getItem("taploginInfo") === null) {
  //       if (data.age_group >= 18) {
  //         const dialogRef = this.dialog.open(AdultAgePopupComponent, {
  //           panelClass: "adultAgePopup",
  //           width: "500px",
  //           data: { dat: event },
  //         });
  //         const sub = dialogRef.componentInstance.sen.subscribe((data: any) => {
  //           this.playVid = data;
  //           if (this.playVid) {
  //             this.videoJsPopup()
  //           }
  //         });
  //       } else {
  //         this.videoJsPopup()
  //       }
  //     } else {
  //       var isSubscriberUser: any = localStorage.getItem("is_subscriber");
  //       var parental: any = localStorage.getItem("taploginInfo");
  //       var parental_read = JSON.parse(parental);
  //       var ottLogged: any = localStorage.getItem("ott_isLoggedIn");
  //       if (ottLogged == "1") {
  //         if (parental_read.is_parental == 0) {
  //           this.videoJsPopup();
  //         } else {
  //           if (parental_read.is_parental == 1 && isSubscriberUser == '1') {

  //             if (Number(aged) >= parental_read.restriction_level) {
  //               const dialogRef = this.dialog.open(ChechPinParentalComponent, {
  //                 panelClass: "contactfooter",
  //                 width: "390px",
  //               });

  //               dialogRef.afterClosed().subscribe((result) => { });
  //               const sub = dialogRef.componentInstance.isSuccess.subscribe(
  //                 (e: any) => {
  //                   this.successs = e;

  //                   if (this.successs) {
  //                     this.videoJsPopup();
  //                   }
  //                 }
  //               );
  //             } else {
  //               this.videoJsPopup()
  //             }
  //           } else {
  //             this.videoJsPopup();
  //           }
  //         }
  //       } else {
  //         this.videoJsPopup();
  //       }
  //     }
  //   }
  //   else if (data.access_type == "paid") {
  //     if (this.isSubscribed == true) {
  //       var isSubscriberUser: any = localStorage.getItem("is_subscriber");
  //       var parental: any = localStorage.getItem("taploginInfo");
  //       var parental_read = JSON.parse(parental);
  //       var group_age: any = localStorage.getItem("isParentalRestriction");
  //       if (parental_read.is_parental == 0) {
  //         this.videoJsPopup();
  //       } else {
  //         if (parental_read.is_parental == 1 && isSubscriberUser == '1') {
  //           if (Number(aged) >= Number(parental_read.restriction_level)) {

  //             const dialogRef = this.dialog.open(ChechPinParentalComponent, {
  //               panelClass: "contactfooter",
  //               width: "390px",
  //             });

  //             dialogRef.afterClosed().subscribe((result) => { });
  //             const sub = dialogRef.componentInstance.isSuccess.subscribe(
  //               (e: any) => {
  //                 this.successs = e;

  //                 if (this.successs) {
  //                   this.videoJsPopup();
  //                 }
  //               }
  //             );
  //           } else {
  //             this.videoJsPopup();
  //           }
  //           // }
  //         } else {


  //           this.videoJsPopup();
  //         }
  //       }
  //     } else if (this.isSubscribed == false) {
  //       this.router.navigate(["/subscribe"]);
  //     }
  //   }
  // }

  
  getm3u8Url(id: any) {
    if(this.getBrowserName == 'safari') {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
  
      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
         
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
          
            this.m3u8Main = decryptData.url;
          }
        })
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
       
          if (res.code == 1) {
            this.DEC_SCR_IOS.getDecryptedDataIos(res?.result);
            let decryptData = JSON.parse(this.DEC_SCR_IOS.decryptData);
           
            this.m3u8Main = decryptData.url;
          }
        })
      }
    } else {
      this.userId = localStorage.getItem("taploginInfo");
      this.user = JSON.parse(this.userId);
  
      if (this.user) {
        this._dd.getMainUrl(id, this.user.id).subscribe((res: any) => {
         
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
         
            this.m3u8Main = decryptData.url;
          }
        })
      } else {
        this._dd.getUnknownUrl(id).subscribe((res: any) => {
        
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
         
            this.m3u8Main = decryptData.url;
          }
        })
      }
    }
   
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

  videoJsPopup() {
    localStorage.setItem('CreatOrderC_id' , this.videoJsData.id);
    this.getm3u8Url(this.videoJsData.id)
    setTimeout(() => {
      this.videoJsData.url = this.m3u8Main
    }, 600);
    setTimeout(() => {
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
    }, 1000);


  }
  getData(event: any,episodeCheck:any) {
    
    this._dd.getSeasonData(this.display_offset, event).pipe(map((res: IResult) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.seasonSelectData = decryptData.content;
        this.contentId = this.seasonSelectData[0].id;
        this.seasonChanged();
        this.hellData = [];
        this.title = this.seasonSelectData[0].groupInfo.name
        this.showData.groupInfo.child.forEach((thumb: any) => {
          if (thumb.id == event) {
            this.totalEpisodes = thumb.total_episode
            this.episodesArray = thumb.episode_arrays;
            // this.selectedEpisode = this.episodesArray[0].offset
            if(localStorage.getItem('showdetails')=='1' && episodeCheck==0){
                           
              this.episodeValue =localStorage.getItem('episodechanges')
          
              let contentIndx = this.episodesArray.findIndex((x:any) => x.offset ===  this.episodeValue);
                  this.selectedEpisode = this.episodesArray[contentIndx].offset;
              this.getEpisodeData(this.selectedEpisode)
             }else{
           
              this.selectedEpisode = this.episodesArray[0].offset;
              localStorage.setItem('episodeSelected',this.selectedEpisode)
             }
           
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
       
      }


    })).subscribe();
  }




  
  episodeChange:any
  getEpisodeData(event: any) {
      this.episodeChange=1
      localStorage.removeItem('showdetails')
    localStorage.setItem('episodeSelected',event)
    this.seasonSelectData = []
    this._dd.getSeasonData(Number(event), this.selected).pipe(map((res: IResult) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.seasonSelectData = decryptData.content;
      
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
       
      }
    })).subscribe();


  }
  seasonChanged() {
    this._dd
      .getDescriptionData(this.contentId)
      .pipe(
        map((res: IResult) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);

          this.showData = decryptData.content;


         

          this.updateUrl()
        
         
       

        
          
        })
      )
      .subscribe();
  }
  updateUrl() {
  
    this._location.go(this.showData.permalink);
  }
  addEpisodeToWatchlist(watcher: any, cat_id: any, content_id: any) {
    const userIsLoggedIn: any = localStorage.getItem('ott_isLoggedIn')
    if (userIsLoggedIn == "1") {
      this.hellData.map((category: any) => {
        if (category.content_id == content_id) {
          category.is_favourite = watcher
        }

      })
   
      const userInfo: any = localStorage.getItem('taploginInfo') || {};
      if (Object.keys(userInfo).length) {
        const formData = new FormData();
        formData.append('user_id', JSON.parse(userInfo).id);
        formData.append('content_id', content_id)
        formData.append('watchlist', watcher)
        formData.append('content_type', 'video');
        formData.append('cat_id', cat_id);
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
    const share_url = url;
    if (type === 'fb') {

      this.cat = url.categories
      this.fbTitle = url.title
      this.fbCid = url.id

      // let link = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faltpdev.faste.tv%2F${this.cat}%2F${this.fbTitle}%2F${this.fbCid}&amp;src=sdkpreparse"`;
      let link = `https://www.facebook.com/sharer/sharer.php?&u=${share_url}`;
      window.open(link, 'Facebook', newLocal);
    } else if (type === 'tweet') {

      this.cat = url.categories
      this.fbTitle = url.title

      // let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=${this.fbTitle}%0A${share_url}`;
      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=Altt%0A${url}`;

      window.open(urls, 'TwitterWindow', newLocal);
    } else if (type === 'copy') {
      navigator.clipboard.writeText(`${share_url}`);

    }
  }
  backClicked() {
    // this.router.navigate([this.showData.permalink])
    this._location.back();
    // if( this.episodeChange==1){
   
    //   localStorage.setItem('episode','1')
    // }else{
   
    //   localStorage.setItem('episode','0')
    // }
   
  }
  userInfo: any;
  userDetails: any;




}
