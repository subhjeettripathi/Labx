import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
  Injector,
  ElementRef,
  AfterViewInit,
  Renderer2,
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
import { environment } from 'src/environments/environment';
import { CountryLockPopupComponent } from "../dialogBoxes/country-lock-popup/country-lock-popup.component";
//import * as amplitude from '@amplitude/analytics-browser';
declare var $: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
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
  @ViewChild('myInput') myInputField!: ElementRef;
  item: any = []
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
  search_url: any = [];
  searchRes: any = true;
  popularSearch: any = true;
  speechRecognition: any;
  UserInfo: any = [];
  text = "";
  searchcontent: any;
  countryAllowed: any = [];
  allData: any = [];
  yearData: any = [];
  genreData: any = [];
  languageData: any = [];
  year: any = [];
  genre: any = [];
  returncategory: any = [];
  advancedsearchData: any = [];
  user: any;
  value: any = "";
  service: any;
  btnStyle: boolean = true;
  defaultImages: any = [];
  defaultThumb: any
  isSubscribed = false;
  boo = false;
  speech: string = '';
  voice = '';
  crownImg: any
  searchMobileHIde: boolean = true;
  panelOpenState: boolean = false
  liveImg:any
  freeImg:any
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

    private auth: AuthService,
    private deviceService: DeviceDetectorService,
    private titlecasePipe: TitleCasePipe,
    private ed: ExchangeDataService,
    private renderer: Renderer2
  ) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });

    if (this.deviceService.browser == "Firefox") {
      this.btnDisable = false

    } else {
      this.btnDisable = true


    }

  }

  ngOnInit(): void {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 100);
    this.defaultImages = localStorage.getItem("defaultImages")
    this.defaultThumb = JSON.parse(this.defaultImages).rectangle.path;
    this.isSubsInfo = localStorage.getItem("is_subscriber") || {};
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }

    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SEARCH', {
        click: 'search'
      });
    }
    

    this.searchDataForm = this._fb.group({
      search: [null],
    });
    this.searchForm = this._fb.group({
      year: [""],
      genre: [""],
      language: [""],
      category: [""],
    });
    this.searchDataFormMobile = this._fb.group({
      searchMobile: [null]
    })


    // this.searchForm.valueChanges.subscribe(() => {
    //   this.select.close();
    //   this.selectGen.close();
    //   this.selectLan.close();
    //   this.selectCate.close();
    // });
    this.windowSize = window.innerWidth;
    this.user = localStorage.getItem("taploginInfo");
    let xc = window.innerWidth;
    if (xc < 576 && this.deviceService.browser == "Safari") {
      this.searchMobileHIde = false
    }
    localStorage.removeItem('episode')
    this.getCrownImg()
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
  ngAfterViewInit() {

    this.myInputField.nativeElement.focus();
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  recent() {
    this.user = localStorage.getItem("ott_isLoggedIn");
    if (this.user != 1) {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        panelClass: "logindialog",
        backdropClass: "popupBackdropClass",
        width: "390px",
        data: { name: "login" },
      });
      dialogRef.afterClosed().subscribe((result) => { });
    } else {
      this.popularSearch = false;
    }
  }
  popular() {
    this.popularSearch = true;
  }
  back() {
    this.location.back();
    // this.router.navigate()
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
        this.viewSearchFilter = true;
        this.show = false;
        this.FilterData();
      } else {
        this.show = true;
        this.searchRes = false;
        this.viewSearchFilter = false;
      }
    }



  }

  voiceSearch: any;
  search_voice() {

    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('VOICE_SEARCH', {
        click: 'voicesearch'
      });
    }
    
    this.voiceSearch = this.voice;
    if (this.voiceSearch) {
      this.search_url = [];
      this.searchRes = false;
      var searched: any = this.voiceSearch;

      this.searchDataShow = searched;
      var decrypt_data: any;
      this.ds.getSearchApi(searched).subscribe((data: any) => {
        if (data.code == 1) {
          this.viewSearchFilter = true;
          this.show = false;
          this.DEC_SER.getDecryptedData(data.result);
          this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
          this.searchData = this.UserInfo.content;
          for (let i in this.searchData) {
            if (this.searchData[i].categories == 'Episode') {
              this.searchData[i].categories = 'Shows'
            }
          }



          if (this.UserInfo.content != 0) {
            this.FilterData();
          }

          if (this.searchData.length != 0) {
            this.searchData.map((data: any) => {
              data.sliderImg = "";
              data.sliderIdentifier = "";

              if (data.is_group == 1 && data.groupInfo != null) {
                if (data.groupInfo.global_thumb != null && data.groupInfo.global_thumb.length != 0) {
                  data.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {

                      if (thumb.layout == "rectangle_16x9" &&
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
                      if (thumb.layout == 'rectangle_16x9' && thumb.platform == 'web') {
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
                  if (thumb.layout == 'rectangle_16x9') {
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
  getUniqueCategories(): string[] {
    const uniqueCategories = Array.from(new Set<string>(this.searchData.map((item: any) => item.categories)));
    const sortedCategories = uniqueCategories.sort((a, b) => (b as string).localeCompare(a as string));
    return sortedCategories;
  }
  autoSuggest(event: any) {
    if (event.target.value.length >= 3) {
      var searched = event.target.value;
      this.searchRes = false;
      this.searchDataShow = searched;
      this.ds.getSearchApi(searched).subscribe((data: any) => {
        if (data.code == 1) {
          this.show = false;
          this.DEC_SER.getDecryptedData(data.result);
          this.UserInfo = JSON.parse(this.DEC_SER.decryptData);
          this.searchData = this.UserInfo.content;
          for (let i in this.searchData) {
            if (this.searchData[i].categories == 'Episode') {
              this.searchData[i].categories = 'Shows'
            }
          }



          if (this.searchData != "") {
            this.searchData.map((data: any) => {
              data.sliderImg = "";
              data.sliderIdentifier = "";
              if (data.is_group == 1 && data.groupInfo != null) {
                if (data.groupInfo.global_thumb != null && data.groupInfo.global_thumb.length != 0) {
                  data.groupInfo.global_thumb.forEach((thumb: any) => {
                    if (thumb != null) {

                      if (thumb.layout == "rectangle_16x9" &&
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
                      if (thumb.layout == 'rectangle_16x9' && thumb.platform == 'web') {
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
                  if (thumb.layout == 'rectangle_16x9') {
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
          this.searchData = []

        }
      });

    } else {

      this.show = false;
      this.searchRes = true;
      this.viewSearchFilter = false;
      this.searchForm.reset();
      this.search_url = [];

    }
  }

  FilterData() {
    this.allData = this.UserInfo.content;


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
      this.year = removedups.sort();


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
        this.genre = removedupsGenre.sort();
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
      this.languageData = removedupsLanguage.sort();

      // FOR CATEGORY LOOP

      // categories

      let returncategory = this.allData[i].categories;
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
      this.returncategory = removedupsCategory.sort();
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
    $(".filterCLoseButton").css("filter", "blur(50px)");
    $(".arrow-bottom").css("margin-top", "140px");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";
    dialogConfig.panelClass = "searchfilter";
    dialogConfig.width = "400px";
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
        genre: this.searchForm.value.genre,
        category: this.searchForm.value.category,
        // type:'["video"]',
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
          this.show = false;
          this.searchRes = false;

          this.editCompanyDialogRef.close();


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
                      if (thumb.layout == "rectangle_16x9" &&
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
                      if (thumb.layout == 'rectangle_16x9' && thumb.platform == 'web') {
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
                  if (thumb.layout == 'rectangle_16x9') {
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

          }
        } else {
          this.show = true;
          this.searchRes = false;
          this.searchData = [];
          this.editCompanyDialogRef.close();
          $(".sec-top").css("opacity", "1");
          $(".arrow-bottom").css("margin-top", "unset");
          $(".filterCLoseButton").css("filter", "none");
        }
      });
    }
  }

  addRecentSearchData(event: any) {

    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {

      // SEARCH event
      window.firebaseAnalytics.logEvent('search', {
        item_id: event.id,
        item_name: event.title,
        content_type: event.content_type
      });
    
      // SELECT_CONTENT event
      window.firebaseAnalytics.logEvent('select_content', {
        item_id: event.id,
        item_name: event.title,
        content_type: event.content_type
      });
    
    }
    


    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    if (event.content_publish && event.content_publish.length) {
      for (let i in event.content_publish) {
        this.countryAllowed.push(event.content_publish[i].country_code);

      }
      var a = this.countryAllowed.indexOf(detail.countryCode);

      if (a == -1 && event.content_publish[0].country_code != "A") {
        const dialogRef = this.dialog.open(CountryLockPopupComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
        });
      } else {
        if (event.permalink != null && event.permalink != "" && event.permalink.length != 0) {
          this.router.navigate(["/" + event.permalink]);
        } else {

          this.router.navigate(['/404'])
        }

      }
    } else {
      if (event.permalink != null && event.permalink != "" && event.permalink.length != 0) {
        this.router.navigate(["/" + event.permalink]);
      } else {

        this.router.navigate(['/404'])
      }
    }

    const loggedIn: any = localStorage.getItem('ott_isLoggedIn')

    if (loggedIn == 1) {
      this.user = localStorage.getItem("taploginInfo");
      const formData: any = new FormData();
      formData.append("uid", JSON.parse(this.user).id);
      formData.append("cid", event.id);
      this.ds.addPopularContent(formData).subscribe((res: any) => {
        if (res.code == 1) {
        }
      });
    }

  }
  getCrownImg() {
    this.ds.faqData().subscribe((res: any) => {
      this.crownImg = res.App[0].crown_logo;
      this.liveImg = res.Player[0].player_live_img
      console.log(this.liveImg, "jfdhsjdhj");
      this.freeImg = res.App[0].free_logo
    })
  }


  userInfo: any;
  userDetails: any;
}
