import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
  Injector,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { SearchFilterComponent } from "../dialogBoxes/search-filter/search-filter.component";
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { DecryptService } from "src/app/services/decrypt.service";
import { Subscription } from "rxjs";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { WrongOtpPopupComponent } from "../../shared/dialogBoxes/wrong-otp-popup/wrong-otp-popup.component"

import { AuthService } from "src/app/services/auth.service";
import { LoginModalDialogComponent } from "../dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DeviceDetectorService } from "ngx-device-detector";
import { TitleCasePipe } from "@angular/common";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSelect } from "@angular/material/select";
import { AudioPlayerComponent } from "../audio-player/audio-player.component";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { ParentalOtpCreateComponent } from "../dialogBoxes/parental-otp-create/parental-otp-create.component";
import { StorageService } from "src/app/services/storage.service";
import { ContentLoaderService } from "../content-loader.service";
import * as firebase from "firebase/app";
import { AnalyticsService } from "src/app/services/analytics.service";
declare var $: any;

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  providers: [TitleCasePipe],
})
export class SearchComponent implements OnInit {
  @ViewChild("editCompanyModal")
  editCompanyModal!: TemplateRef<any>;
  private editCompanyDialogRef!: MatDialogRef<TemplateRef<any>>;

  inputEl!: ElementRef;
  show: boolean = false;
  searchDataShow: any;
  viewSearchFilter: boolean = false;
  searchForm!: FormGroup;
  searchDataForm!: FormGroup;
  searchDataFormMobile!: FormGroup;
  thumb_img: any;
  Img_url: any;
  img_size: [] = [];
  windowSize: number = 0;
  img_url: any = [];
  img_identifier: any = [];
  searchImage: any;
  imageData: [] = [];
  data_layout: any = [];
  layout_thumbs: any;
  searchData: any = [];
  rentalData: any
  search_url: any = [];
  searchRes: any = true;
  popularSearch: any = true;
  recentSearch: any = true;
  speechRecognition: any;
  UserInfo: any = [];
  text = "";
  searchcontent: any;
  allData: any = [];
  yearData: any = [];
  genreData: any = [];
  languageData: any = [];
  year: any = [];
  genre: any = [];
  returncategory: any = [];
  content_type: any = [];
  advancedsearchData: any = [];
  user: any;
  value: any = "";
  service: any;
  btnStyle: boolean = true;
  defaultImages: any = [];
  defaultThumb: any
  isSubscribed = false;
  boo = false;
  isUserLoggedIn: any
  speech: string = '';
  voice = ''
  panelOpenState: boolean = false
  @ViewChild('selectYear') private select!: MatSelect;
  @ViewChild('selectLanguage') private selectLan!: MatSelect;
  @ViewChild('selectGenre') private selectGen!: MatSelect;
  @ViewChild('selectCategory') private selectCate!: MatSelect;
  btnDisable: boolean;
  // voiceSearchHide:boolean=false;
  isSubsInfo: any;
  constructor(
    private _ngZone: NgZone,
    private dialog: MatDialog,
    private ds: DataService,
    private _fb: FormBuilder,
    private DEC_SER: DecryptService,
    private location: Location,
    private router: Router,
    private fcs: FunctionCallingService,
    private auth: AuthService,
    private deviceService: DeviceDetectorService,
    private titlecasePipe: TitleCasePipe,
    private ed: ExchangeDataService,
    private _storage: StorageService,
    private loader: ContentLoaderService,
    private analyticsService: AnalyticsService
  ) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });

    this.ed.isUserLoggedIn.subscribe((value) => {
      this.isUserLoggedIn = value;
      if (this.isUserLoggedIn == true) {
        this.recentSearch = true;
      }
    });

    if (this.deviceService.browser == "Firefox") {
      this.btnDisable = false

    } else {
      this.btnDisable = true


    }

  }

  ngOnInit(): void {
    this.user = localStorage.getItem("ott_isLoggedIn");
    if (this.user != 1) {
      this.recentSearch = false;
      this.popularSearch = false;
    } else {
      this.recentSearch = true
      // location.reload();
    }

    // var myInput = $('#myInput');
    // myInput.on('focus', function () {
    //   disableZoom();
    // });
    // myInput.on('blur', function () {
    //   enableZoom();
    // });
    // function disableZoom() {
    //   $('body, html').css('touch-action', 'none');
    // }

    // function enableZoom() {
    //   $('body, html').css('touch-action', 'auto');
    // }

    window.scroll(0, 0);
    this.defaultImages = localStorage.getItem("defaultImages")
    this.defaultThumb = JSON.parse(this.defaultImages).vertical.path;
    this.isSubsInfo = localStorage.getItem("is_subscriber") || {};
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }

    this.searchDataForm = this._fb.group({
      search: [null],
    });
    this.searchForm = this._fb.group({
      year: [""],
      type: [""],
      // genre: [""],
      language: [""],
      category: [""],
    });
    this.searchDataFormMobile = this._fb.group({
      searchMobile: [null]
    })

    // firebase.analytics().logEvent('SEARCH', {
    //   'click': 'search',
    // })
    this.windowSize = window.innerWidth;
    this.user = localStorage.getItem("taploginInfo");
    const a = localStorage.getItem('taploginInfo')
    if (a != null) {
      // this.leadSquare()
    }
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

  startService() {
    this.voice = ''
    this.btnStyle = false;
    // this.voiceSearchHide=true
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
    // navigator.mediaDevices.getUserMedia( { audio: true, video: false } )
    // .then( ( stream ) => {
    //   this.startListing();
    // },
    // e => {
    //   const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
    //    panelClass: "adultAgePopup",
    //    width: "420px",
    //    backdropClass: "backdropBackground",
    //    data: { name: "openmic"},

    //  });



    // } );


  }
  // startListing(){

  // }

  stopService() {

    this.speechRecognition.stop();
    this.btnStyle = true;
    // this.voiceSearchHide=false

  }



  // ngAfterViewInit() {
  //   this.inputEl.nativeElement.focus();
  // }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  recent() {
    // this.user = localStorage.getItem("ott_isLoggedIn");
    // if (this.user != 1) {
    //   // const dialogRef = this.dialog.open(LoginModalDialogComponent, {
    //   //   panelClass: "logindialog",
    //   //   backdropClass: "popupBackdropClass",
    //   //   width: "390px",
    //   //   data: { name: "login" },
    //   // });
    //   // dialogRef.afterClosed().subscribe((result) => { });
    //   // dialogRef.disableClose = true;
    // } else {
    this.popularSearch = true;
    // }
  }
  popular() {
    this.popularSearch = false;
  }
  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/'])
    }
  }
  backSearch() {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate(["/search"]));
  }
  search_data(event: any) {
    if (event.target.value.length >= 3) {
      var searched: any = event.target.value;
      this.searchDataShow = searched;
      if (this.searchData != '') {
        event.stopPropagation();
        this.viewSearchFilter = true;
        this.show = false;
        this.FilterData();

      } else {
        event.stopPropagation();
        this.show = true;
        this.searchRes = false;
        this.viewSearchFilter = false;
      }
    }
    event.stopPropagation();



  }

  voiceSearch: any;
  search_voice() {


    this.voiceSearch = this.voice;
    if (this.voiceSearch) {
      this.search_url = [];
      this.searchRes = false;
      var searched: any = this.voiceSearch;

      this.searchDataShow = searched;
      var decrypt_data: any;
      const taploginInfo = localStorage.getItem("taploginInfo");
      const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';
      this.ds.getSearchApi(searched).subscribe((data: any) => {
        if (data.code == 1) {
          this.viewSearchFilter = true;
          this.show = false;
          this.DEC_SER.getDecryptedData(data.result);
          this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
          this.searchData = this.UserInfo.content;
          console.log(this.searchData, "searchdatafound");

          const eventParams = {
            search_term: this.voice,
            result_count: this.searchData.length,
          };
          this.analyticsService.logEvent('voice_search', eventParams);
          if (this.UserInfo.content != 0) {
            this.FilterData();
          }

          if (this.searchData.length != 0) {
            this.searchData.map((data: any) => {
              data.sliderImg = "";
              data.sliderIdentifier = "";

              if (data.is_group == 1 && data.groupInfo != null) {
                data.groupInfo.thumbs.forEach((thumb: any) => {
                  if (thumb != null) {
                    if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
                      thumb?.image_size.filter((img: any) => {
                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          data.sliderImg = img.url;
                          data.sliderIdentifier = img.identifier;
                        } else if (data.sliderImg == "") {
                          data.sliderImg = thumb?.image_size[0].url;
                          data.sliderIdentifier = thumb?.image_size[0].identifier;
                        }

                      });
                    }


                  }
                });


              } else if (data.is_group == 0) {
                data.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == 'vertical_9x16') {
                    thumb?.image_size.filter((img: any) => {

                      if (Number(img.width) == 360 || Number(img.width) == 854) {
                        data.sliderImg = img.url;
                        data.sliderIdentifier = img.identifier;
                      } else if (data.sliderImg == "") {
                        data.sliderImg = thumb?.image_size[0].url;
                        data.sliderIdentifier = thumb?.image_size[0].identifier;
                      }

                    });
                  }
                });

              }
            });
          } else {
            this.show = true;
            this.searchRes = false;
            this.viewSearchFilter = false;
          }
        }
      });
    } else {
      this.show = true;
      this.searchRes = false;
      this.viewSearchFilter = false;
      this.searchForm.reset();
      this.search_url = [];
    }
  }
  autoData: any;
  autoSuggestHide: boolean = true;
  autoSuggest(event: any) {
    setTimeout(() => {

      if (event.target.value.length >= 3) {

        var searched = event.target.value;
        this.searchRes = false;
        const taploginInfo = localStorage.getItem("taploginInfo");
        const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';
        this.ds.getSearchApi(searched).subscribe((data: any) => {
          if (data.code == 1) {
            this.show = false;
            this.DEC_SER.getDecryptedData(data.result);
            this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
            this.searchData = this.UserInfo.content;
            console.log(this.searchData);

            const eventParams = {
              search_term: searched,
            };
            this.analyticsService.logEvent('search', eventParams);
            if (this.searchData != "") {
              const eventParams = {
                search_term: searched,
                result_count: this.searchData.length,
              };
              this.analyticsService.logEvent('view_search_results', eventParams);
              this.searchData.map((data: any) => {
                data.sliderImg = "";
                data.sliderIdentifier = "";
                if (data.is_group == 1 && data.groupInfo != null) {
                  if (data.groupInfo.global_thumb != null && data.groupInfo.global_thumb.length != 0) {
                    data.groupInfo.global_thumb.forEach((thumb: any) => {
                      if (thumb != null) {

                        if (thumb.layout == "vertical_9x16" &&
                          thumb.platform == "global") {
                          thumb?.image_size.filter((img: any) => {
                            if (Number(img.width) == 360 || Number(img.width) == 854) {
                              data.sliderImg = img.url;
                              data.sliderIdentifier = img.identifier;
                            } else if (data.sliderImg == "") {
                              data.sliderImg = thumb?.image_size[0].url;
                              data.sliderIdentifier = thumb?.image_size[0].identifier;
                            }
                          });
                        }
                      }
                    });
                  } else if (data.groupInfo.thumbs != null) {
                    data.groupInfo.thumbs.forEach((thumb: any) => {
                      if (thumb != null) {
                        if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
                          thumb?.image_size.filter((img: any) => {
                            if (Number(img.width) == 360 || Number(img.width) == 854) {
                              data.sliderImg = img.url;
                              data.sliderIdentifier = img.identifier;
                            } else if (data.sliderImg == "") {
                              data.sliderImg = thumb?.image_size[0].url;
                              data.sliderIdentifier = thumb?.image_size[0].identifier;
                            }

                          });
                        }


                      }
                    });
                  }



                }
                else if (data.is_group == 0) {
                  data.layout_thumbs.forEach((thumb: any) => {
                    if (thumb.layout == 'vertical_9x16') {
                      thumb?.image_size.filter((img: any) => {

                        if (Number(img.width) == 360 || Number(img.width) == 854) {
                          data.sliderImg = img.url;
                          data.sliderIdentifier = img.identifier;
                        } else if (data.sliderImg == "") {
                          data.sliderImg = thumb?.image_size[0].url;
                          data.sliderIdentifier = thumb?.image_size[0].identifier;
                        }

                      });
                    }
                  });

                }
              });
            }

            else {
              this.show = true;
              this.searchRes = false;
              this.viewSearchFilter = false;
            }
          } else {
            this.show = true;
            this.searchRes = false;
            this.viewSearchFilter = false;
          }
        });

      } else {
        this.searchRes = true;
        this.search_url = [];
        this.show = false;

        this.viewSearchFilter = false;
        this.searchForm.reset();


      }
    }, 1000);

  }

  FilterData() {
    this.allData = this.UserInfo.content;
    console.log(this.allData);

    for (var i = 0; i < this.allData.length; i++) {
      // FOR YEAR LOOP

      let yearValue = this.allData[i].year;
      this.yearData.push(yearValue);
      let removedups = this.yearData.filter(
        (item: any, indx: any, arr: any[]) => {
          if (
            arr.findIndex(
              (x: any) => JSON.stringify(x) === JSON.stringify(item)
            ) === indx
          ) {
            return item;
          }
        }
      );
      this.year = removedups;
      console.log(this.year);

      // FOR GENRE LOOP

      let genre = this.allData[i].genre;

      for (let i = 0; i < genre.length; i++) {
        this.genreData.push(this.titlecasePipe.transform(genre[i].genre_name));
        let removedupsGenre = this.genreData.filter(
          (item: any, indx: any, arr: any[]) => {
            if (
              arr.findIndex(
                (x: any) => JSON.stringify(x) === JSON.stringify(item)
              ) === indx
            ) {
              return item;
            }
          }
        );
        this.genre = removedupsGenre;
        console.log(this.genre);
      }

      // FOR LANGUAGE LOOP

      let returnlanguage = this.allData[i].language;

      this.languageData.push(this.titlecasePipe.transform(returnlanguage));
      let removedupsLanguage = this.languageData.filter(
        (item: any, indx: any, arr: any[]) => {
          if (
            arr.findIndex(
              (x: any) => JSON.stringify(x) === JSON.stringify(item)
            ) === indx
          ) {
            return item;
          }
        }
      );
      this.languageData = removedupsLanguage;
      console.log(this.languageData);
      // FOR CATEGORY LOOP

      // categories

      let returncategory = this.allData[i].categories;
      console.log(returncategory);

      this.returncategory.push(this.titlecasePipe.transform(returncategory));
      let removedupsCategory = this.returncategory.filter(
        (item: any, indx: any, arr: any[]) => {
          if (
            arr.findIndex(
              (x: any) => JSON.stringify(x) === JSON.stringify(item)
            ) === indx
          ) {
            return item;
          }
        }
      );

      let removeDuplicate = removedupsCategory;
      const resultArray = removeDuplicate
        .flatMap((item: any) => item.split(','))
        .filter((item: any) => item.trim() !== '');
      this.returncategory = resultArray

      // content type

      let content_type = this.allData[i].content_type;
      this.content_type.push(this.titlecasePipe.transform(content_type));
      let removedupsContentType = this.content_type.filter(
        (item: any, indx: any, arr: any[]) => {
          if (
            arr.findIndex(
              (x: any) => JSON.stringify(x) === JSON.stringify(item)
            ) === indx
          ) {
            return item;
          }
        }
      );
      this.content_type = removedupsContentType;
      console.log(this.content_type);

    }
  }

  clear() {

    this.autoSuggestHide = true;
    this.searchDataForm.reset();
    this.show = false;
    this.searchRes = true;
    this.viewSearchFilter = false;

    this.search_url = [];
    this.searchDataShow = [];
  }
  clickMObile() {
    this.searchDataFormMobile.reset();
    this.autoSuggestHide = true;

    this.show = false;
    this.searchRes = true;
    this.viewSearchFilter = false;

    this.search_url = [];
    this.searchDataShow = [];
  }
  openModalshow: boolean = true;
  openCompanyDetailsDialog(): void {
    // $('#searchDiv').css("background", "transparent linear-gradient(270deg, #1E1E1E 0%, #1E1E1E 40%, rgba(30, 30, 30, 0) 100%) 0% 0% no-repeat padding-box");
    $(".sec-top").css("opacity", ".25");
    // $(".filterCLoseButton").css("filter", "blur(50px)");
    $(".arrow-bottom").css("margin-top", "140px");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";
    dialogConfig.panelClass = "searchfilter";
    dialogConfig.width = "360px"
    dialogConfig.backdropClass = "hey";
    this.editCompanyDialogRef = this.dialog.open(
      this.editCompanyModal,
      dialogConfig
    );
    this.router.events.subscribe(() => {
      this.editCompanyDialogRef.close();
    });
    // this.editCompanyDialogRef.afterClosed().subscribe(result => {
    //   this.editCompanyDialogRef.close();
    // });
  }

  // closeCompanyDetailsDialog() {
  //   this.editCompanyDialogRef.close();
  // }

  close() {
    this.searchForm.reset();
    this.editCompanyDialogRef.close();
    $(".sec-top").css("opacity", "1");
    $(".arrow-bottom").css("margin-top", "unset");
    $(".filterCLoseButton").css("filter", "none");
  }
  clearFIlters() {
    this.searchForm.reset();
  }



  onFilterFOrmSubmit() {


    if (this.searchForm.valid) {
      let search_tag = {
        q: this.searchDataShow,
        language: this.searchForm.value.language,
        year: this.searchForm.value.year,
        genre: null,
        category: this.searchForm.value.category,
        Type: this.searchForm.value.type,
      };
      const formData: any = new FormData();
      formData.append("search_tag", JSON.stringify(search_tag));
      this.auth.advancedSearch(formData).subscribe((res: any) => {
        if (res.code == 1) {
          $(".sec-top").css("opacity", "1");
          $(".arrow-bottom").css("margin-top", "unset");
          $(".filterCLoseButton").css("filter", "none");
          this.DEC_SER.getDecryptedData(res.result);
          this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
          this.searchData = this.UserInfo.content;
          // this.searchForm.reset();
          this.editCompanyDialogRef.close();
          console.log(this.searchData);

          if (this.searchData != "") {
            this.searchData.map((data: any) => {
              data.sliderImg = "";
              data.sliderIdentifier = "";
              if (data.is_group == 1 && data.groupInfo != null) {
                if (data.groupInfo.global_thumb != null && data.groupInfo.global_thumb.length != 0) {
                  data.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == "square") {
                        thumb.layout = "circle";
                      }
                      if (thumb.layout == "vertical_9x16" &&
                        thumb.platform == "global") {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            data.sliderImg = img.url;
                            data.sliderIdentifier = img.identifier;
                          } else if (data.sliderImg == "") {
                            data.sliderImg = thumb?.image_size[0].url;
                            data.sliderIdentifier = thumb?.image_size[0].identifier;
                          }
                        });
                      }
                    }
                  });
                } else if (data.groupInfo.thumbs != null) {
                  data.groupInfo.thumbs.forEach((thumb: any) => {
                    if (thumb != null) {
                      if (thumb.layout == 'vertical_9x16' && thumb.platform == 'web') {
                        thumb?.image_size.filter((img: any) => {
                          if (Number(img.width) == 360 || Number(img.width) == 854) {
                            data.sliderImg = img.url;
                            data.sliderIdentifier = img.identifier;
                          } else if (data.sliderImg == "") {
                            data.sliderImg = thumb?.image_size[0].url;
                            data.sliderIdentifier = thumb?.image_size[0].identifier;
                          }

                        });
                      }


                    }
                  });
                }



              } else if (data.is_group == 0) {
                data.layout_thumbs.forEach((thumb: any) => {
                  if (thumb.layout == 'vertical_9x16') {
                    thumb?.image_size.filter((img: any) => {
                      if (Number(img.width) == 360 || Number(img.width) == 854) {
                        data.sliderImg = img.url;
                        data.sliderIdentifier = img.identifier;
                      } else if (data.sliderImg == "") {
                        data.sliderImg = thumb?.image_size[0].url;
                        data.sliderIdentifier = thumb?.image_size[0].identifier;
                      }

                    });
                  }
                });

              }
            });
          }
        } else {
        }
      });
    }
  }

  addRecentSearchData(content_id: any) {
    this.user = localStorage.getItem("taploginInfo");

    if (this.user) {
      const formData: any = new FormData();
      formData.append("uid", JSON.parse(this.user).id);
      formData.append("cid", content_id);
      this.ds.addPopularContent(formData).subscribe((res: any) => {
        if (res.code == 1) {
        }
      });
    }

  }
  // navigationFunction(event: any) {
  //   if (event.content_type == 'audio') {
  //     this.openAudioPlayer(event)
  //   }
  //   else if (event.content_type == 'ebook') {
  //     this.router.navigate(["/aol/ebook/content/" + event.permalink]);
  //   }
  //   else {
  //     this.router.navigate(["/" + event.permalink]);
  //   }
  // }

  navigate(event: any) {
    if (event.is_ad == 1) {
      window.open(event.ad_url);
    } else {
      const eventParams = {
        item_id: event.id,
        item_name: event.title,
        item_type: event.content_type,
        item_value: event.access_type,
        season_id: event.season_id,
        series_id: event.series_id
      };
      this.analyticsService.logEvent('view_search_item', eventParams);



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
            if (event.content_type == 'video') {
              this.router.navigate(["/" + event.permalink]);
              localStorage.setItem('prevUrl', this.router.url)
            } else if (event.content_type == 'audio') {
              this.openAudioPlayer(event)
            } else if (event.content_type == 'ebook') {
              this.router.navigate(["/aol/ebook/" + event.permalink]);
            }
          } else if (res.code == 2) {
            //rental flow//
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
            console.log(data);
            this.rentalData = data
            if (event.content_type == 'video') {
              this.router.navigate(["/" + event.permalink]);
              localStorage.setItem('prevUrl', this.router.url)
            } else {
              this.playRental()
            }

          } else if (res.code == 3) {
            this.ds.getUserSubscriptionDetails(JSON.parse(userInfo).id).subscribe(res => {
              this.DEC_SER.getDecryptedData(res.result);
              const data: any = JSON.parse(this.DEC_SER.decryptData);
              if (data.is_subscriber == 1) {
                this.ed.isSubscribe.next(true);
                this.ed.alreadySubscriber.next(true)
                localStorage.setItem('is_subscriber', '1')
              } else if (data.is_subscriber == 0) {
                localStorage.setItem('is_subscriber', '0')
              }
              this._storage.setData('ott_subscriptionPlan', data);
            })
          } else if (res.code == 4) {
            this.ed.isSubscribe.next(false);
            this.ed.alreadySubscriber.next(false);
            localStorage.setItem("is_subscriber", "0");
            this.navigationFunction(event)
          }
        })

      } else {
        if (event.content_type != 'video') {
          const dialogRef = this.dialog.open(LoginModalDialogComponent, {
            backdropClass: "popupBackdropClass",
            panelClass: "logindialog",
            width: "390px",
            data: { name: "login" },
          });
          dialogRef.disableClose = true;
        } else {
          this.router.navigate(["/" + event.permalink]);
          localStorage.setItem('prevUrl', this.router.url)
        }
      }
    }

  }

  navigationFunction(event: any) {

    if (event.access_type == 'free') {
      if (event.content_type == 'video') {
        this.router.navigate(["/" + event.permalink]);
        localStorage.setItem('prevUrl', this.router.url)
      } else if (event.content_type == 'audio') {

        this.openAudioPlayer(event)
      } else if (event.content_type == 'ebook') {
        this.router.navigate(["/aol/ebook/" + event.permalink]);
      }
    } else if (event.access_type == 'paid') {
      if (event.content_type != 'video') {
        this.router.navigate(["/subscribe"]);
      } else {
        this.router.navigate(["/" + event.permalink]);
        localStorage.setItem('prevUrl', this.router.url)
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
  leadSquare() {
    let dateObj = new Date();
    let month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // Add leading zero if needed
    let day = ('0' + dateObj.getUTCDate()).slice(-2); // Add leading zero if needed
    let year = dateObj.getUTCFullYear();

    const newdate = year + "-" + month + "-" + day;
    const date = new Date();

    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);

    const time = date.toLocaleTimeString([], {
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const requestData = [
      {
        'Attribute': 'EmailAddress',
        'Value': USER_ACCOUNT.email
      },
      {
        'Attribute': 'mx_App_Last_Login_Date_Time',
        'Value': newdate + ' ' + time
      },
      {
        'Attribute': 'mx_App_User_Source',
        'Value': 'Web'
      }
    ];
    this.ds.leadSquare(requestData).subscribe((res: any) => {

    })
  }
  openAudioPlayer(event: any) {
    this.dialog.closeAll()

    if (this.dialog.openDialogs.length == 0) {
      setTimeout(() => {

        const alertRef = this.dialog.open(AudioPlayerComponent, {
          panelClass: 'audio_player',
          maxWidth: '100vw',
          width: "100%",
          height: "100%",
          hasBackdrop: false,
          backdropClass: 'cdk-overlay-transparent-backdrop',
          data: { data: event },
        });

      }, 500);
    }
  }
}
