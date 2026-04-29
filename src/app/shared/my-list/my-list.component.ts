import { Component, NgZone, OnInit, HostListener, ElementRef } from '@angular/core';
declare var $: any;
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { CountryLockPopupComponent } from '../dialogBoxes/country-lock-popup/country-lock-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AudioPlayerComponent } from '../audio-player/audio-player.component';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { createSecretKey } from 'crypto';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import * as firebase from 'firebase/app';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ParentalOtpEnableComponent } from '../dialogBoxes/parental-otp-enable/parental-otp-enable.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss']
})
export class MyListComponent implements OnInit {
  regionalOpen() {
    throw new Error('Method not implemented.');
  }
  close() {
    throw new Error('Method not implemented.');
  }
  checked: boolean = false
  watchids: any = []
  watchidsAudio: any = []
  watchidsEbooks: any = []
  WatchlistType: any = []
  WatchlistData: any = []
  defaultImages: any = [];
  countryAllowed: any = [];
  playlistShow: any = []
  getP_id: any
  isSubscribed = false;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  otherContentpLaylist: any = []
  playlistImage: any
  c_type: any
  currentValue: any
  abc: any = []
  checked1: boolean = false
  sliderImage: any
  inputValue: any
  speechRecognition: any;
  checked2: any
  checked3: any
  speech: string = '';
  checked4: any
  btnDisable: boolean;
  voiceSearch: any
  btnStyle: boolean = true;
  voice = ''
  boo = false;
  checked5: any
  constructor(public router: Router, private ds: DataService,private analyticsService:AnalyticsService ,private ed: ExchangeDataService, private DEC_SER: DecryptService, private dialog: MatDialog, private _SWAL: SwalMsgService, private deviceService: DeviceDetectorService, private _ngZone: NgZone, private eRef: ElementRef) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.ed.closeAudioGetCallList.subscribe((value) => {
      console.log(value)
      if (value == true) {
        this.getPlaylistData()
      }
    });

    if (this.deviceService.browser == "Firefox") {
      this.btnDisable = false

    } else {
      this.btnDisable = true


    }
  }
  userInfo: any = localStorage.getItem("taploginInfo") || {};
  ngOnInit(): void {

    this.defaultImages = localStorage.getItem("defaultImages");
    this.getPlaylistData()
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    window.scroll(0, 0)
    this.ds.getWatchlistType().subscribe((res: any) => {
      this.WatchlistType = res.result.type
      this.getWatchlistData(res.result.type[0].title)
      this.c_type = res.result.type[0].title
      console.log(this.WatchlistData);
    })
  }
  onImgError(event: any, type: any) {
    if (type == "circle") {
      event.target.src = JSON.parse(this.defaultImages).square.path;
    } else if (type == "rectangle_16x9") {
      event.target.src = JSON.parse(this.defaultImages).rectangle.path;
    } else if (type == "vertical_9x16") {
      event.target.src = JSON.parse(this.defaultImages).vertical.path;
    }
  }

  // checkValue(x: any, event: any) {
  //   // console.log('For Video Select Single Content');
  //   // if (event.target.checked === false) {
  //   //   this.watchids = this.watchids.filter((item: any) => item !== x);
  //   //   this.checked2 = false;
  //   // } else {
  //   //   if (!this.watchids.includes(x)) {
  //   //     this.watchids.push(x);
  //   //   }
  //   //   if (this.watchids.length === this.WatchlistData.length) {
  //   //     this.checked2 = true;
  //   //   }
  //   // }
  //   // console.log(this.watchids, "Updated selected item IDs");

  //   console.log('For Video Select Single Content');

  //   if (event.target.checked === false) {
  //     // If an item is unchecked, remove it from `watchids`
  //     this.watchids = this.watchids.filter((item: any) => item !== x);
  //     // Uncheck "Select All" if any individual item is unchecked
  //     alert("checked1")
  //     this.checked2 = false;

  //   } else {
  //     // If an item is checked, add it to `watchids`
  //     if (!this.watchids.includes(x)) {
  //       this.watchids.push(x);
  //     }

  //     // Check "Select All" if all items are now selected
  //     if (this.watchids.length === this.WatchlistData.length) {
  //       alert('unchecked')
  //       this.checked2 = true;
  //     }
  //   }

  //   console.log(this.watchids, "Updated selected item IDs");
  // }


  checkValue(x: any, event: any) {
    if (event.target.checked === false) {
      // Remove from selected items
      this.watchids = this.watchids.filter((item: any) => item !== x);
      this.checked2 = false;  // Uncheck "Select All" if one item is unchecked
    } else {
      // Add to selected items
      if (!this.watchids.includes(x)) {
        this.watchids.push(x);
      }

      // If all items are selected, check "Select All"
      if (this.watchids.length === this.WatchlistData.length) {
        this.checked2 = true;
      }
    }
  }

  checkValue1(x: any, event: any) {
    if (event.target.checked === false) {
      // Remove from selected items
      this.watchidsAudio = this.watchidsAudio.filter((item: any) => item !== x);
      this.checked3 = false;  // Uncheck "Select All" if one item is unchecked
    } else {
      // Add to selected items
      if (!this.watchidsAudio.includes(x)) {
        this.watchidsAudio.push(x);
      }

      // If all items are selected, check "Select All"
      if (this.watchidsAudio.length === this.WatchlistData.length) {
        this.checked3 = true;
      }
    }
  }
  checkValue3(x: any, event: any) {
    if (event.target.checked === false) {
      // Remove from selected items
      this.watchidsEbooks = this.watchidsEbooks.filter((item: any) => item !== x);
      this.checked4 = false;  // Uncheck "Select All" if one item is unchecked
    } else {
      // Add to selected items
      if (!this.watchidsEbooks.includes(x)) {
        this.watchidsEbooks.push(x);
      }

      // If all items are selected, check "Select All"
      if (this.watchidsEbooks.length === this.WatchlistData.length) {
        this.checked4 = true;
      }
    }
  }
  getWatchlistData(c_type: any) {
    this.WatchlistData = []
    this.c_type = c_type
    this.ds.getWatchlistData(c_type).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      this.WatchlistData = decryptData.content
      console.log(this.WatchlistData);
      if (this.WatchlistData) {
        this.WatchlistData.map((cat: any) => {
          cat.sliderImg = "";
          cat.sliderIdentifier = "";
          if (cat.is_group == 0) {
            if (cat.content_type != "ebook") {
              cat.layout_thumbs.forEach((thumb: any) => {
                if (thumb != null) {
                  if (thumb.layout == "rectangle_16x9") {
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
            } else {
              cat.layout_thumbs.forEach((thumb: any) => {
                if (thumb != null) {
                  if (thumb.layout == "vertical_9x16") {
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

          } else if (cat.is_group == 1) {
            if (cat.content_type != "ebook") {
              if (
                cat.groupInfo.global_thumb != null &&
                cat.groupInfo.global_thumb.length != 0
              ) {
                cat.groupInfo.global_thumb.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (
                      thumb.layout == "rectangle_16x9" &&
                      thumb.platform == "global"
                    ) {
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
                    if (
                      thumb.layout == "rectangle_16x9" &&
                      thumb.platform == "web"
                    ) {
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
            } else {
              if (
                cat.groupInfo.global_thumb != null &&
                cat.groupInfo.global_thumb.length != 0
              ) {
                cat.groupInfo.global_thumb.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (
                      thumb.layout == "vertical_9x16" &&
                      thumb.platform == "global"
                    ) {
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
                    if (
                      thumb.layout == "vertical_9x16" &&
                      thumb.platform == "web"
                    ) {
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

          }
        });
      }

    })
  }

  navigate(event: any) {
    const eventParams = {
      item_id: event.id,
      item_name: event.title,
      item_type: event.content_type,
      item_value: event.access_type,
      page_name: 'my_list',
      season_id: event.season_id,
      series_id: event.series_id
    };
    this.analyticsService.logEvent('select_item', eventParams);
    console.log(event);

    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    if (event.content_publish && event.content_publish.length) {
      for (let i in event.content_publish) {
        this.countryAllowed.push(event.content_publish[i].country_code);
        console.log(this.countryAllowed);
      }
      var a = this.countryAllowed.indexOf(detail.countryCode);
      if (a == -1 && event.content_publish[0].country_code != "A") {
        const dialogRef = this.dialog.open(CountryLockPopupComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
        });
      } else {
        this.router.navigate(["/" + event.permalink]);
        localStorage.setItem('prevUrl', this.router.url)
      }
    } else {
      this.router.navigate(["/" + event.permalink]);
      localStorage.setItem('prevUrl', this.router.url)
    }
  }

  // selAllVideo(event: any) {
  //   // console.log('For Video Select All Content');
  //   // this.watchids = [];
  //   // if (event.target.checked === true) {
  //   //   this.checked = true;
  //   //   for (let i in this.WatchlistData) {
  //   //     this.watchids.push(this.WatchlistData[i].id);
  //   //   }
  //   // } else {
  //   //   this.checked = false;
  //   //   this.watchids = [];
  //   // }
  //   // console.log(this.watchids, "Updated selected item IDs after Select All");
  //   console.log('For Video Select All Content');

  //   console.log(this.checked);
  //   if (event.target.checked === true) {
  //     // Select all items
  //     this.watchids = this.WatchlistData.map((item:any) => item.id); // Add all IDs to watchids
  //     alert("check")
  //     this.checked = true;

  //     console.log(this.watchids, "All items selected after Select All");
  //     console.log(this.checked);
  //   } else {

  //     // Unselect all items
  //     this.checked = false;
  //     this.watchids = []; // Clear the selected items array

  //     console.log(this.watchids, "All items unselected after Select All");
  //     console.log(this.checked);
  //   }
  // }

  selAllVideo(event: any) {
    if (event.target.checked) {
      // Select all items
      this.watchids = this.WatchlistData.map((item: any) => item.id);
      console.log(this.watchids)
      this.checked2 = true;

      // Update "Select All" to be checked
    } else {
      // Unselect all items
      this.watchids = [];
      this.checked2 = false; // Update "Select All" to be unchecked
    }
  }
  selAllVideo1(event: any) {
    if (event.target.checked) {
      // Select all items
      this.watchidsAudio = this.WatchlistData.map((item: any) => item.id);
      console.log(this.watchidsAudio)
      this.checked3 = true;

      // Update "Select All" to be checked
    } else {
      // Unselect all items
      this.watchidsAudio = [];
      this.checked3 = false; // Update "Select All" to be unchecked
    }
  }
  selAllebook(event: any) {
    if (event.target.checked) {
      // Select all items
      this.watchidsEbooks = this.WatchlistData.map((item: any) => item.id);
      this.checked4 = true;

      // Update "Select All" to be checked
    } else {
      // Unselect all items
      this.watchidsEbooks = [];
      this.checked4 = false; // Update "Select All" to be unchecked
    }
  }

  deleteWatchList() {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    const formData = new FormData();
    let str = String(this.watchids)
    console.log(str)
    if (str != '') {
      formData.append("c_id", str);
      formData.append("u_id", JSON.parse(userInfo).id);
      this.ds.clearWatchlist(formData).subscribe((res) => {
        this.getWatchlistData(this.c_type)
        this.checked = false
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please Select the content",
        timer: 1500
      });
    }

  }
  deleteWatchList1() {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    const formData = new FormData();
    let str = String(this.watchidsAudio)
    console.log(str)
    if (str != '') {
      formData.append("c_id", str);
      formData.append("u_id", JSON.parse(userInfo).id);
      this.ds.clearWatchlist(formData).subscribe((res) => {
        this.getWatchlistData(this.c_type)
        this.checked1 = false
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please Select the content",
        timer: 1500
      });
    }

  }

  deleteWatchList2() {
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    const formData = new FormData();
    let str = String(this.watchidsEbooks)
    console.log(str)
    if (str != '') {
      formData.append("c_id", str);
      formData.append("u_id", JSON.parse(userInfo).id);
      this.ds.clearWatchlist(formData).subscribe((res) => {
        this.getWatchlistData(this.c_type)
        this.checked1 = false
      });
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please Select the content",
        timer: 1500
      });
    }

  }



  openAudioPlayer(event: any) {
    if (this.dialog.openDialogs.length == 0) {
      const alertRef = this.dialog.open(AudioPlayerComponent, {
        panelClass: 'audio_player',
        maxWidth: '100vw',
        width: "100%",
        hasBackdrop: false,
        height: "100%",
        data: { data: event },
      });
    }
  }


  openebook(permalink: any) {
    this.router.navigate(["/aol/ebook/" + permalink]);
  }

  back() {
    this.router.navigate(['/']);
  }

  getPlaylistData() {
    this.ds.getPlaylistNameUser(JSON.parse(this.userInfo).id).subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.playlistShow = decryptData.content
        console.log(this.playlistShow)
        // this.ds.getPlaylist().subscribe((res:any)=>{


        // })
        // this.playlistShow.map((res: any) => {
        //   console.log(res.thumbs)
        //   res.sliderImg = "";
        //   if (res.thumbs != null) {
        //     res.thumbs.forEach((ress: any) => {
        //       // console.log(ress)
        //       if (ress.layout == "square") {
        //         ress.image_size.filter((img: any) => {
        //           if (Number(img.width == 640)) {
        //             res.sliderImg = img.url
        //           }
        //         })
        //       }
        //     })
        //   }

        // })
        // this.playlistShow.forEach((res:any)=>{
        //   console.log(res.thumbs);
        //   this.abc.push(res.thumbs[2])
        //   console.log(this.abc)

        //   this.abc.forEach((ress:any)=>{
        //     console.log(res)
        //   })
        // })

        // console.log(this.abc, "aaaa")
      }

    })
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const divElement = document.querySelector(`.mob-dots`) as HTMLElement;

    if (divElement && !divElement.contains(clickedElement)) {
      this.currentValue = null
    }
  }

  toggle(id: any) {
    if (this.currentValue === id) {
      setTimeout(() => {
        this.currentValue = null;
      }, 30);

    } else {
      setTimeout(() => {
        this.currentValue = id;
      }, 20);

    }
  }
  // toggle(id: any) {
  //   this.currentValue = id
  //   if (id == this.currentValue) {
  //     $(`.options${id}`).toggle();
  //   }
  // }
  // addPlaylistContent(playlist_id: any) {
  //   const formData: any = new FormData();
  //   formData.append("playlist_id", playlist_id);
  //   formData.append("content_id", 'hsg');
  //   formData.append("device", "web");
  //   this.ds.addPlaylistContent(formData).subscribe((res: any) => {
  //     if (res.code == 1) {

  //     }
  //   })
  // }
  otherPlaylistContent(p_id: any) {
    this.getP_id = p_id;
    this.ds.otherContentListPlaylist(p_id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      // console.log(decryptData)
      this.otherContentpLaylist = decryptData.content
      this.getImageList(p_id)
      console.log(this.otherContentpLaylist)

      this.toggle(p_id)
    })
  }

  rename(contentData: any) {
    const dialogRef = this.dialog.open(ParentalOtpEnableComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "createPlaylistpop",
      width: "390px",
      data: { contenId: contentData, getType: 'audio' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getPlaylistData()
    });
  }
  getImageList(p_id: any) {
    // console.log(this.otherContentpLaylist)
    this.otherContentpLaylist.map((cat: any) => {
      // console.log(cat);

      cat.sliderImage = ''
      cat.p_id = p_id
      //  console.log(cat)
      if (cat.is_group == "1" && cat.groupInfo != null) {
        cat.groupInfo.global_thumb.forEach((thumb: any) => {
          // console.log(thumb)
          if (thumb.layout == 'square') {
            thumb.image_size.filter((res: any) => {
              cat.sliderImage = res.url
            })

          }
        })
      } else {
        if (cat.is_group == "0" && cat.layout_thumbs != null) {
          cat.layout_thumbs.forEach((thumb: any) => {
            if (thumb.layout == 'square') {
              thumb.image_size.filter((res: any) => {
                cat.sliderImage = res.url
              })
            }
          })
        }
      }
    })
  }

  addToPlaylist(listId: any, p_id: any, index: any) {


    const formData: any = new FormData();
    formData.append("playlist_id", p_id);
    formData.append("content_id", listId);
    formData.append("device", "web");
    formData.append("type", "content");
    this.ds.addPlaylistContent(formData).subscribe((res: any) => {
      console.log(res);

      if (res.code == 1) {
        // this.DEC_SER.getDecryptedData();
        // let decryptData = JSON.parse(this.DEC_SER.decryptData);
        // console.log(decryptData);
        this.inputValue = "";
        this._SWAL.getSwalmsg(res?.result, 'success');
        $('#exampleModalCenter').modal('hide')
      } else {
        this._SWAL.getSwalmsg(res?.result, 'error');
      }
    })
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

  searchPlaylist(event: any) {
    if (event.target.value.length >= 3) {
      var searched: any = event.target.value;
      this.ds.playlistSearch(0, 10, this.getP_id, searched).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          //  console.log(decryptData.content);

          this.otherContentpLaylist = []
          decryptData.content.forEach((item: any) => {
            // console.log(item);
            this.otherContentpLaylist.push(item)
          })

        }

        this.getImageList(this.getP_id)

        // console.log(this.otherContentpLaylist);

        // console.log(res, "response===============>")
      })

      if (searched != '') {
        event.stopPropagation();
      } else {
        event.stopPropagation();
      }
    }

    if (event.target.value.length == 0) {
      this.ds.otherContentListPlaylist(this.getP_id).subscribe((res: any) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.otherContentpLaylist = []
        decryptData.content.forEach((item: any) => {
          this.otherContentpLaylist.push(item)
        })
        this.getImageList(this.getP_id)
      })
    }
    event.stopPropagation();
  }

  stopService() {

    this.speechRecognition.stop();
    this.btnStyle = true;
    // this.voiceSearchHide=false

  }

  getTranscript({ locale = 'en-US' }: { locale?: string } = {}): Observable<string> {

    return new Observable(observer => {
      const SpeechRecognition = window['webkitSpeechRecognition'];
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = locale;
      this.speechRecognition.onresult = (speechRecognitionEvent: any) => {
        var interim_transcript = '';
        for (var i = speechRecognitionEvent.resultIndex; i < speechRecognitionEvent.results.length; ++i) {
          if (speechRecognitionEvent.results[i].isFinal) {
            this.boo = true;
            this._ngZone.run(() => observer.next(speechRecognitionEvent.results[i][0].transcript.trim()));
          }
          else {
            this.boo = false;
            interim_transcript += speechRecognitionEvent.results[i][0].transcript;
            this._ngZone.run(() => observer.next(interim_transcript.trim()));
          }

        }
      };
      this.speechRecognition.start();

      return () => this.speechRecognition.abort();
    });
  }

  search_voice() {
    this.voiceSearch = this.voice;
    this.inputValue = this.voice;
    console.log(this.voiceSearch);
    if (this.voiceSearch.length >= 3) {
      var searched: any = this.voiceSearch
      this.ds.playlistSearch(0, 20, this.getP_id, searched).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          //  console.log(decryptData.content);

          this.otherContentpLaylist = []
          decryptData.content.forEach((item: any) => {
            // console.log(item);
            this.otherContentpLaylist.push(item)
          })

        }

        this.getImageList(this.getP_id)

        // console.log(this.otherContentpLaylist);

        // console.log(res, "response===============>")
      })

      // if (searched != '') {
      //   event.stopPropagation();
      // } else {
      //   event.stopPropagation();
      // }
    }


    // if (this.voiceSearch) {
    //   this.search_url = [];
    //   this.searchRes = false;
    //   var searched: any = this.voiceSearch;

    //   this.searchDataShow = searched;
    //   var decrypt_data: any;
    //   this.ds.getSearchApi(searched).subscribe((data: any) => {
    //     if (data.code == 1) {
    //       this.viewSearchFilter = true;
    //       this.show = false;
    //       this.DEC_SER.getDecryptedData(data.result);
    //       this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
    //       this.searchData = this.UserInfo.content;
    //       console.log(this.searchData, "searchdatafound");
    //       if (this.UserInfo.content != 0) {
    //         this.FilterData();
    //       }

    //       if (this.searchData.length != 0) {
    //         this.searchData.map((data: any) => {
    //           data.sliderImg = "";
    //           data.sliderIdentifier = "";

    //           if (data.is_group == 1 && data.groupInfo != null) {
    //             data.groupInfo.thumbs.forEach((thumb: any) => {
    //               if (thumb != null) {
    //                 if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
    //                   thumb?.image_size.filter((img: any) => {
    //                     if (Number(img.width) == 360 || Number(img.width) == 854) {
    //                       data.sliderImg = img.url;
    //                       data.sliderIdentifier = img.identifier;
    //                     } else if (data.sliderImg == "") {
    //                       data.sliderImg = thumb?.image_size[0].url;
    //                       data.sliderIdentifier = thumb?.image_size[0].identifier;
    //                     }

    //                   });
    //                 }


    //               }
    //             });


    //           } else if (data.is_group == 0) {
    //             data.layout_thumbs.forEach((thumb: any) => {
    //               if (thumb.layout == 'vertical_9x16') {
    //                 thumb?.image_size.filter((img: any) => {

    //                   if (Number(img.width) == 360 || Number(img.width) == 854) {
    //                     data.sliderImg = img.url;
    //                     data.sliderIdentifier = img.identifier;
    //                   } else if (data.sliderImg == "") {
    //                     data.sliderImg = thumb?.image_size[0].url;
    //                     data.sliderIdentifier = thumb?.image_size[0].identifier;
    //                   }

    //                 });
    //               }
    //             });

    //           }
    //         });
    //       } else {
    //         this.show = true;
    //         this.searchRes = false;
    //         this.viewSearchFilter = false;
    //       }
    //     }
    //   });
    // } else {
    //   this.show = true;
    //   this.searchRes = false;
    //   this.viewSearchFilter = false;
    //   this.searchForm.reset();
    //   this.search_url = [];
    // }
  }

  startService() {
    this.voice = ''
    this.btnStyle = false;
    this.getTranscript()
      .subscribe(transcript => {
        if (transcript !== '' && this.boo) {

          this.voice = transcript;
          this.search_voice();
        }
        else {
          this.speech = transcript
        }
      });
    setTimeout(() => {
      this.stopService();
    }, 5000);
  }

  getPlaylistContent(playlistId: any, playlist_name: any) {
    this.ds.getPlaylistContent(playlistId).subscribe((res: any) => {
      if (res.code == 1) {

        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData)
        if (decryptData.total_count != 0) {

          this.dialog.closeAll();
          setTimeout(() => {
            if (this.dialog.openDialogs.length == 0) {
              const alertRef = this.dialog.open(AudioPlayerComponent, {
                panelClass: 'audio_player',
                maxWidth: '100vw',
                width: "100%",
                height: "100%",
                hasBackdrop: false,
                data: { data: decryptData.content, dataPlaylist: 'playlistData', playlist_Id: playlistId, playlistNmae: playlist_name },
              });
            }
          }, 1000);

        } else {

          this._SWAL.getSwalmsg('There is no song added', 'error');
        }
      } else {

        this._SWAL.getSwalmsg('There is no song added', 'error');
      }
    })
  }
  playlistDelete(playlist_id: any, index: any) {
    const formData = new FormData();
    formData.append("playlist_id", playlist_id);
    formData.append("type", '2');
    formData.append("device", 'web');

    this.ds.deletePlaylist(formData).subscribe((res: any) => {
      this.playlistShow.filter((res: any) => {
        if (res.id == playlist_id) {
          this.playlistShow.splice(index, 1);
        }
      })
      this._SWAL.getSwalmsg('Playlist successfully deleted', 'success');
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      console.log(decryptData)
    })
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
}


$(document).on("click", "#cust_btn", function () {

  $("#myModal").modal("toggle");

})
