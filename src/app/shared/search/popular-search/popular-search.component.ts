import { Component, OnInit, Input } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { environment } from 'src/environments/environment';
import { Router } from "@angular/router";
import { CountryLockPopupComponent } from "../../dialogBoxes/country-lock-popup/country-lock-popup.component";
import { MatDialog } from "@angular/material/dialog";
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
  selector: "app-popular-search",
  templateUrl: "./popular-search.component.html",
  styleUrls: ["./popular-search.component.scss"],
})
export class PopularSearchComponent implements OnInit {
  // @Output() newItemEvent = new EventEmitter<string>();

  // addNewItem(value: string) {
  //   this.newItemEvent.emit(value);
  // }
 
  @Input() item: any = [];
  show_img: any = true;
  popular_data: any;
  windowSize: any = 0;
  popularImg_url: any = [];
  defaultImages:any=[]
  defaultThumb:any;
  countryAllowed: any = [];
  isSubscribed = false;
  crownImg:any;
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  liveImg:any
  freeImg:any

  constructor(private ds: DataService, private DEC_SER: DecryptService, private ed:ExchangeDataService,private router: Router,private dialog: MatDialog,) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }

  ngOnInit(): void {
    this.defaultImages=localStorage.getItem("defaultImages")
    this.defaultThumb=JSON.parse(this.defaultImages).rectangle.path
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.popular_search();

    this.windowSize = window.innerWidth;
    localStorage.removeItem('episode')
    this.getCrownImg();
  }
  // onImgError(event: any) {
  //   event.target.src = JSON.parse(this.defaultImages).vertical.path
  // }
  getUniqueCategories(): string[] {
    // Extract unique category names
    return Array.from(new Set(this.popular_data.map((item:any) => item.categories)));
  }
  popular_search() {
    // var searched: any = this.searchForm.value.search;
    var decrypt_data: any;

    this.ds.popularRes().subscribe((data: any) => {
      if (data.code == 1) {
        decrypt_data = this.DEC_SER.getDecryptedData(data.result);
        let UserInfo = JSON.parse(this.DEC_SER.decryptData);
       
        this.popular_data = UserInfo.content;
        console.log(this.popular_data);
        
        for (let i in this.popular_data) {
          if (this.popular_data[i].categories == 'Episode') {
            this.popular_data[i].categories = 'Shows'
          }
        }
        this.popular_data.map((data: any) => {
          data.sliderImg = "";
          data.sliderIdentifier = "";
          if (data.is_group == 1 && data.groupInfo != null) {
            if (data.groupInfo.global_thumb != null && data.groupInfo.global_thumb.length != 0) {
              data.groupInfo.global_thumb.forEach((thumb: any) => {
                if (thumb != null) {
                
                  if ( thumb.layout == "rectangle_16x9" &&
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
            }else if(data.groupInfo.thumbs!=null){
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
    });
  }


  naviagte(event: any) {
  
    if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
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

      if (a ==-1 && event.content_publish[0].country_code != "A") {
        const dialogRef = this.dialog.open(CountryLockPopupComponent, {
          backdropClass: "popupBackdropClass",
          panelClass: "adultAgePopup",
          width: "390px",
        });
      } else {
        if(event.permalink!=null && event.permalink !="" && event.permalink.length!=0){
          this.router.navigate(["/" + event.permalink]);
        }else{
          this.router.navigate(['/404'])
        }
      
      }
    } else {
      if(event.permalink!=null && event.permalink !="" && event.permalink.length!=0){
        this.router.navigate(["/" + event.permalink]);
      }else{
        this.router.navigate(['/404'])
      }
    }
  
  
}

getCrownImg() {
  this.ds.faqData().subscribe((res: any) => {
    this.crownImg = res.App[0].crown_logo;
    this.liveImg = res.Player[0].player_live_img
    console.log(this.liveImg,"jfdhsjdhj");
    this.freeImg = res.App[0].free_logo
  })
}
 
    userInfo:any;
    userDetails:any;

}
