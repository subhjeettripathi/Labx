import { identifierName } from "@angular/compiler";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { StorageService } from "src/app/services/storage.service";
import { Location } from "@angular/common";
import { forkJoin } from "rxjs";
import { CountryLockPopupComponent } from "src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component";
import { SwalMsgService } from "src/app/services/swal-msg.service";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { environment } from "src/environments/environment";
//import * as amplitude from '@amplitude/analytics-browser';
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
@Component({
  selector: "app-watchlist",
  templateUrl: "./watchlist.component.html",
  styleUrls: ["./watchlist.component.scss"],
})


export class WatchlistComponent implements OnInit {
  data: any;
  offset = 0;
  max_counter = 10;
  totalCount: any;
  watchingList: any[] = [];
  cat_cntn: any[] = [];
  windowSize: number = 0;
  calls: any = [];
  daa: any = [];
  countryAllowed: any = [];
  cat: any;
  fbTitle: any;
  navbarAd: any = [];
  navvar: any;
  showBanner: any = false;
  fbCid: any;
  config: any;
  defaultImages: any = [];
  crownImg: any;
  @ViewChild("clearWatchListModal") clearWatchListModal!: TemplateRef<any>;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed = false;
  private watchListClearConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  constructor(
    private _dd: DataService,
    private ed: ExchangeDataService,
    private DEC_SER: DecryptService,
    private _STORAGE: StorageService,
    private location: Location,
    private router: Router,
    private dialog: MatDialog,
    private swal: SwalMsgService
  ) {
    this.getWatchlistData();
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }
  baseJson: any = [];
  ngOnInit(): void {
    this.defaultImages = localStorage.getItem("defaultImages");
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.getConfigData();
    this.navbarAd = localStorage.getItem("faqData");
    this.navvar = JSON.parse(this.navbarAd);
    this.windowSize = window.innerWidth;
    this.config = {
      slidesToShow: 5,
      dots: false,
      arrows: true,
      slidesToScroll: 2,
      autoplay: false,
      infinite: false,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            dots: true,
            arrows: true,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 2000,
            swipe: true,
          },
        },
      ],
    };

    this.getCrownImg();
  }
  getConfigData() {
    const popup: any = localStorage.getItem("allJsonPopupData");
    const dataPopup: any = JSON.parse(popup);
    this.baseJson = dataPopup.PopupList[0];

    // this._dd.popupJson().subscribe((res: any) => {
    //   this.baseJson = res.PopupList[0]
    // })
  }
  onImgError(event: any) {
    event.target.src = JSON.parse(this.defaultImages).rectangle.path;
  }
  getWatchlistData() {
    this._dd.getWatchList(this.offset, this.max_counter).subscribe((res) => {
      if (res.code === 1) {
        this.DEC_SER.getDecryptedData(res.result);

        this.totalCount = JSON.parse(this.DEC_SER.decryptData).totalCount;

        this.watchingList = JSON.parse(this.DEC_SER.decryptData).category;

        for (var _i = 0; _i < this.watchingList.length; _i++) {
          this.calls.push(
            this._dd.getWatchListById(
              this.offset,
              this.max_counter,
              this.watchingList[_i].id
            )
          );
        }
        forkJoin(this.calls).subscribe((data) => {
          this.daa = data;
          console.log(this.daa.length, "lllllll");
          for (var _j = 0; _j < this.daa.length; _j++) {
            this.DEC_SER.getDecryptedData(this.daa[_j].result);
            this.data = JSON.parse(this.DEC_SER.decryptData).content;
            this.watchingList[_j].cat_cntn = this.data;
          }
          this.watchingList.map((category: any) => {
            category.cat_cntn.forEach((cat: any) => {
              cat.sliderImg = "";
              cat.sliderIdentifier = "";
              if (cat.is_group == 0) {
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
              } else if (cat.is_group == 1) {
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
              }
            });
          });
        });
        console.log(this.daa.length, "lllllll");

      } else if (res.code === 0) {
        this.daa = [];
        this.showBanner = true;
      }
    });
  }
  deleteWatchList(id: any) {
    const userAccount = this._STORAGE.loginInfoData();
    const formData = new FormData();
    formData.append("c_id", id);
    formData.append("u_id", userAccount?.id);
    this._dd.clearWatchlist(formData).subscribe((res) => {
      for (let i in this.watchingList) {
        const findIndex = this.watchingList[i].cat_cntn.findIndex(
          (a: { id: any }) => a.id === id
        );

        findIndex !== -1 && this.watchingList[i].cat_cntn.splice(findIndex, 1);

        if (this.watchingList.every((subArr) => subArr.cat_cntn.length === 0)) {
          this.totalCount = 0;
        }
      }
    });
  }
  hasItemsInAnyCategory(): boolean {
    return this.watchingList?.some((item) => item.cat_cntn?.length > 0);
  }
  removeWatchlistContent(c_id: any) {
    this.watchListClearConfirmationDialogRef.close();
    const userAccount = this._STORAGE.loginInfoData();
    const formData = new FormData();
    formData.append("c_id", c_id);
    formData.append("u_id", userAccount?.id);
    this._dd.clearWatchlist(formData).subscribe((res) => {
      this.watchingList = [];
      this.calls = [];
      this.daa = [];
      // this.getWatchlistData();
      this.swal.getSwalmsg("Removed from watchlist", "success");
    });
  }
  navigate(event: any) {

    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
      window.firebaseAnalytics.logEvent('SELECT_CONTENT', {
        itemName: event.title,
        itemType: event.content_type,
        itemId: event.id
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
        this.router.navigate(["/" + event.permalink]);
      }
    } else {
      this.router.navigate(["/" + event.permalink]);
    }
  }
  sharing(type: string, url: any) {
    const newLocal = "width=600,height=300";
    const share_url = url.share_url;
    if (type === "fb") {
      this.cat = url.categories;
      this.fbTitle = url.title;
      this.fbCid = url.id;

      let link = `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Faltpdev.faste.tv%2F${this.cat}%2F${this.fbTitle}%2F${this.fbCid}&amp;src=sdkpreparse"`;
      window.open(link, "Facebook", newLocal);
    } else if (type === "tweet") {
      this.cat = url.categories;
      this.fbTitle = url.title;

      let urls = `https://twitter.com/intent/tweet?original_referer=${window.location.host}tw_p=tweetbutton&text=${this.fbTitle}%0A${share_url}`;

      window.open(urls, "TwitterWindow", newLocal);
    } else if (type === "copy") {
      navigator.clipboard.writeText(`${share_url}`);
    }
  }
  backToLocation() {
    this.location.back();
  }
  userInfo: any;
  userDetails: any;

  openWatchListConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";
    dialogConfig.panelClass = "signoutConfirmation";
    dialogConfig.backdropClass = "popupBackdropClass";
    dialogConfig.width = "420px";
    this.watchListClearConfirmationDialogRef = this.dialog.open(
      this.clearWatchListModal,
      dialogConfig
    );
    this.router.events.subscribe(() => {
      this.watchListClearConfirmationDialogRef.close();
    });
  }
  watchListConfirmationclose() {
    this.watchListClearConfirmationDialogRef.close();
  }

  getCrownImg() {
    this._dd.faqData().subscribe((res: any) => {
      this.crownImg = res.App[0].crown_logo;
    });
  }
}
