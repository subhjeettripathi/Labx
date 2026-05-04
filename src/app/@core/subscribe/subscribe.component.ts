import { Component, HostListener, NgZone, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SeoService } from "src/app/services/seo.service";
import { environment } from 'src/environments/environment';
//import * as amplitude from '@amplitude/analytics-browser';
import { Location } from "@angular/common";
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
import { StorageService } from "src/app/services/storage.service";
import { FacebookLoggerService } from "src/app/services/facebook-logger.service";
import { FacebookPixelService } from "src/app/services/facebook-pixel.service";
// declare var FB:any
export interface ICountryAndCode {
  code: string;
  name: string;
  dial_code: string;
}
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
declare var $: any;
declare var AppleID: any;
@Component({
  selector: "app-subscribe",
  templateUrl: "./subscribe.component.html",
  styleUrls: ["./subscribe.component.scss"],
})
export class SubscribeComponent implements OnInit {
  // @ViewChild('subscriptionDetailsModal') subscriptionDetailsModal!: TemplateRef<any>;
  selectedSub: any;
  title = 'My-subscrption';
  couponpageShow: boolean = true;
  global_coupon: any;
  global_coupons: any
  activeButton: number = 1;
  isMobileView = false;
  activeIndex = -1;
  subscribeInfo: any;
  subscribtionArr: any = [];
  monthToPayment: any;
  priceToPayment: any;
  domain: any;
  currentRoute: any;
  tabValue: any;
  statGeographical!: string;
  showStateCountry: any;
  subscribeInfo1: any;
  isLoggedIn: any;
  timeZoneOffset: any;
  jsonData: any = [];
  vis: any = true;
  continueFree = true;
  woohoo: any;
  show: boolean = true;
  uid: any;
  Uid: any;
  isloggedIn: boolean = true;
  isSubscribed = false;
  tab3: any;
  razorPayKey: any;
  payPalKey: any;
  errorMsg: any
  getResponseTime: any;
  USER_ACCOUNT_id: any
  loc_country_code: any;
  subdata: any;
  dataPkg: any
  checkDiscountValue: any
  guestUserFlow: any
  islength: boolean = false
  selectedOption: string | null = null;
  device_limit: any
  device_limit1: any;
  cameFromFeels = false;
  dynamicImgUrl: any
  selectedIndex: number = -1;
  constructor(
    public dialog: MatDialog,
    private ds: DataService,
    private deviceService: DeviceDetectorService,
    private DEC_SER: DecryptService,
    private _ar: ActivatedRoute,
    private router: Router,
    private _DS: DataService,
    private ed: ExchangeDataService,
    private meta: SeoService,
    private _dd: DataService,
    private location: Location,
    private LS: LoaderService,
    private zone: NgZone,
    private _storage: StorageService,
    private fbLogger: FacebookLoggerService,
    private fbPixelService: FacebookPixelService,

  ) {


    const nav = this.router.getCurrentNavigation();
    this.cameFromFeels = nav?.extras?.state?.["from"] === 'feels';

    this.getSubcribeInfo();
    this.getManualPackage();
    if (localStorage.getItem("packcheking") == "1" && this.router.url == "/subscribe") {
      this.getSubcribeInfo();
    } else {
      if (this.router.url == "/subscribe" && localStorage.getItem("is_subscriber") == "1") {
        this.router.navigate(["/my-subscription"]);
      }
    }
    this.timeZoneOffset = new Date();
    this.ed.alreadySubscriber.subscribe((value) => {
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        this.continueFree = false;
      }
      if (localStorage.getItem("packcheking") == "1") {
        this.activeButton = 3;

      } else {

        if (this.router.url == "/subscribe" && value == true) {
          this.router.navigate(["/my-subscription"]);

        }
      }


    });

    this.ed.isUserLoggedInModal.subscribe((value) => {
      if (localStorage.getItem("packcheking") == "1") {
        this.dataPkg = localStorage.getItem("pkgData")
        this.subdata = JSON.parse(this.dataPkg)


        this.activeButton = 3;
        this.subscribeInfo1 = {
          s_id: this.subdata.pkdId,
          package_mode: "OTT",
          price: this.subdata.currency + this.subdata.level,
          month: this.subdata.month,
          currency: this.subdata.currency,
        };
        this.monthToPayment = this.subdata.month
        localStorage.setItem(
          "subscribeInfo",
          JSON.stringify(this.subscribeInfo1)
        );
        sessionStorage.setItem(
          "subscribePack",
          JSON.stringify(this.subscribeInfo1)
        );
      } else {

        if (value == true) {
          this.activeButton = 1;
        }
      }

    });

    this.ed.hideMemberAlert.subscribe((value) => {
      if (value == true) {
        this.vis = false;
      }
    });
    //   this.meta.updateTitle(this.title);
    //  this.meta.updateMetaInfo(this.descrption);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobileView = window.innerWidth < 992;
  }
  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      // this.dynamicImgUrl = '/assets/img/mobile-background.jpg';
    } else {
      // this.dynamicImgUrl = '/assets/img/desk-background.jpg';
    }
    setTimeout(() => {
      window.scroll(0, 0);
    }, 500);

    //  this.selectedIndex = 0;

    this.ed.hider.next(false)

    const recommendedIndex = this.subscribtionArr?.findIndex((sub: any) => sub?.s_package?.recommend == 1);

    this.selectedIndex = recommendedIndex !== -1 ? recommendedIndex : 0;
    this.subscribeInfo1 = this.subscribtionArr[this.selectedIndex];



    this.isMobileView = window.innerWidth < 992;
    const popup: any = localStorage.getItem('faqData');
    const faq: any = JSON.parse(popup);
    this.global_coupon = faq.Others.global_coupon;
    // this.dynamicImgUrl = faq.Others.subscription_background
    const bg = faq.Others.subscription_background;
    console.log(bg);
    if(bg?.is_allow == 1){
      if (window.innerWidth <= 768) {
        if (bg.device_allow?.android == '1') {
          this.dynamicImgUrl = bg.android;
        } else {
          this.dynamicImgUrl = bg.default || ''; // fallback
        }
      } else {
        // Desktop
        if (bg.device_allow?.web == '1') {
          this.dynamicImgUrl = bg.web;
        } else {
          this.dynamicImgUrl = bg.default || ''; // fallback
        }
      }
    }
 
    // Mobile

  

    console.log(this.dynamicImgUrl, "Selected Background");
  if(this.global_coupon == 0) {
  this.couponpageShow = false

  // this.gotoPaymentpay('1');
}

localStorage.setItem("active", 'subscribe');
this.ed.active.next('subscribe');
let errorAlertData: any = localStorage.getItem('errorMsg')
this.errorMsg = JSON.parse(errorAlertData)
$('.arrow-bottom').hide()
this.isLoggedIn = localStorage.getItem("ott_isLoggedIn");

// this.getSubcribeInfo();



this.getGeographicalState();
// let pop =  localStorage.getItem('ott_isLoggedIn')

$(".crossImg").click(() => {
  $(".subscontainer").hide();
});
const userInfo: any = localStorage.getItem("taploginInfo") || {};
if (Object.keys(userInfo).length) {
  this.continueFree = false;
}
this.getConfigData();

this.woohoo = localStorage.getItem("woohoo");
if (this.woohoo == 1) {
  this.show = false;
} else {
  this.show = true;
}


// if(pop == '1'){
//   this.activeButton = 3
// }else{
//   this.activeButton = 1
// }

// const link='altp.faste.tv/subscribe?tab=4';


const urlSearchParams = new URLSearchParams(window.location.search);
this.tabValue = urlSearchParams.get("tab");

if (this.tabValue == "4") {
  window.history.pushState("", "", '/subscribe');
  this.activeButton = 4;

  this.uid = localStorage.getItem("taploginInfo");
  // this.Uid=this.uid.id
  this.Uid = JSON.parse(this.uid).id;
  this.uid;
  this._DS.getUserSubscriptionDetails(this.Uid).subscribe((res) => {
    this.DEC_SER.getDecryptedData(res.result);
    const data: any = JSON.parse(this.DEC_SER.decryptData);

    if (data.is_subscriber == 1) {
      localStorage.setItem("is_subscriber", "1");
      this.ed.isSubscribe.next(true);
      this.ed.parentalLock.next(false);
    }
  });

}
this.tab3 = sessionStorage.getItem("tab3");
if (this.tab3 == "3") {

  this.activeButton = 3;
  sessionStorage.removeItem("tab3");
}

    // let ip: any = localStorage.getItem("ipSaveData") || {};
    // AF("pba", "event", {
    //   eventType: "EVENT",
    //   eventValue: {
    //     device_make: this.deviceDetection.os,
    //     device_timestamp: this.timeZoneOffset,
    //     page_title: "subscribe",
    //     geo_country: JSON.parse(ip).countryName,
    //     geo_city: JSON.parse(ip).city,
    //     platform: "web",
    //   },
    //   eventName: "Subscription Page",
    // });
  }



  get deviceDetection(): any {
  return this.deviceService.getDeviceInfo();
}


getValueFromUpi(e: any) {
  this.activeButton = e;
}
payPalPayment(e: any) {
  this.activeButton = e;
}
couponDirect(r: any) {
  this.activeButton = 4;
}
couponSwitch(a: any) {
  this.activeButton = a;
}
closeBanner() {
  this.vis = false;
}
getConfigData() {
  var contin = JSON.parse(localStorage.getItem('faqData') || '{}');
  this.guestUserFlow = contin.Others.is_guest_discount
  this.jsonData = contin.Others.ContinueFree

  // this.ds.faqData().subscribe((res: any) => {

  //   this.jsonData = res.Others.ContinueFree;

  // });
}
openLogin() {

  const dialogRef = this.dialog.open(LoginModalDialogComponent, {
    panelClass: "logindialog",
    width: "390px",
    data: { name: "login" },
  });
  const sub = dialogRef.componentInstance.isLoggedIn.subscribe(
    (data: any) => {

      this.continueFree = false

    }
  );
}
closeSubscriptionModal() {
  this.dialog.closeAll();
}
getSubcribeInfo() {
  // const begin=Date.now()
  this._dd.apipip().subscribe((res: any) => {

    // this.loc_country_code = res.countryCode;

    if (res.code == 1) {
      this.DEC_SER.getDecryptedData(res?.result);
      let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
      localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      this.loc_country_code = ipSaveData.countryCode;

    }
    // localStorage.setItem("ipSaveData", JSON.stringify(res));

    this.ds.getSubscribeInfo(this.loc_country_code).subscribe((res: any) => {
      // this.LS.show();
      if (res.code == 1) {
        // this.LS.hide();
        this.getResponseTime = Date.now() - this.timeZoneOffset
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.subscribeInfo = decryptData;


        this.subscribtionArr = this.subscribeInfo.package_list;
        console.log(this.subscribtionArr);

        for (let i in this.subscribtionArr) {
          if (this.subscribtionArr[i].s_package.device_restriction == 1) {

            this.device_limit = 'Single Device';
          }
        }

        if (this.subscribtionArr.length == 1) {
          this.islength = true
        }
        else {
          this.islength = false
        }

        this.razorPayKey = this.subscribeInfo.RazorpaySecretKey;
        this.payPalKey = this.subscribeInfo.paypalClientId;
        if (localStorage.getItem("packcheking") != "1") {

        }

        const recommendedIndex = this.subscribtionArr.findIndex(
          (sub: any) => sub?.s_package?.recommend == 1
        );
        this.selectedIndex = recommendedIndex !== -1 ? recommendedIndex : 0;
        this.subscribeInfo1 = this.subscribtionArr[this.selectedIndex];

      }
    });
  });
  //    let ip: any = localStorage.getItem("ipSaveData");
  //  var loc_country_code= JSON.parse(ip).countryCode;


}

getActiveNess(activeNumber: number) {
  this.isLoggedIn = localStorage.getItem("ott_isLoggedIn");

  switch (this.activeButton) {

    case 1:
      if (activeNumber === 4 || activeNumber === 3 || activeNumber === 2) {
        this.activeButton = this.activeButton;
      } else {
        this.activeButton = activeNumber;
      }

      break;

    case 2:
      if (activeNumber === 2) {
        //  this.activeButton=1
      } else if (activeNumber === 1) {
        this.activeButton = 1;
      }
      break;
    case 3:
      if (activeNumber === 1) {
        if (localStorage.getItem("packcheking") == "1") {

        } else if (localStorage.getItem('newuser') == '0') {

          if (!this.checkDiscountValue) {

            this.activeButton = 1;
          }
        }

        else {
          this.activeButton = 1;
        }

      }
      break;
    case 4:
      if (activeNumber === 3) {
        //  this.activeButton=1
      }
      break;
    default:
      this.activeButton = activeNumber;

      break;
  }
}
netBankingSuccess(e: any) {
  this.activeButton = e;
}
paytmSuccess(e: any) {
  this.activeButton = e;
}
paytmRecurring(e: any) {
  this.activeButton = e;
}
razorPayRecurring(e: any) {
  this.activeButton = e;
}
lazyPay(e: any) {
  this.activeButton = e;
}


openLoginpackage() {

}



addSubcription(sub: any, index: any) {
  if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
    window.firebaseAnalytics.logEvent('CHECKOUT', {
      currency: sub.s_package.p_currency,
      amount: sub.s_package.p_currency + sub.s_package.p_price,
      package_id: sub.s_id
    });
  }
  this.fbLogger.logCheckoutEvent(sub);
  this.fbPixelService.trackCheckoutEvent(sub);
  localStorage.removeItem('newuser')
  this.uid = localStorage.getItem("taploginInfo");
  window.scroll(0, 0);
  if (this.uid) {

    this.Uid = JSON.parse(this.uid).id;
    this.ds.subscriptionPackCheck(this.Uid).subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        if (decryptData.is_subscriber == 1) {

          localStorage.setItem("is_subscriber", "1");
          this.ed.isSubscribe.next(true);
          this.ed.parentalLock.next(false);
          this.router.navigate(["/my-subscription"]);
        } else {
          console.log("qqqqqqqqqqqqq");
          // if(sub.s_package.discounted_price){
          //   this.price=sub.s_package.p_currency + sub.s_package.discounted_price
          // }else{
          //   this.price=sub.s_package.p_currency + sub.s_package.p_price
          // }
          this.subscribeInfo1 = {
            s_id: sub.s_id,
            package_mode: sub.s_package.package_mode,
            price: sub.s_package.p_currency + sub.s_package.p_price,
            month: sub.s_package.period_interval,
            currency: sub.s_package.p_currency,
            des: sub.s_package.description,
            autorenew: sub.s_package.autorenewal,

          };




          localStorage.setItem(
            "subscribeInfo",
            JSON.stringify(this.subscribeInfo1)
          );
          sessionStorage.setItem(
            "subscribePack",
            JSON.stringify(this.subscribeInfo1)
          );
          this.monthToPayment =
            sub.s_package.period_interval + " " + sub.s_package.period;
          this.priceToPayment =
            sub.s_package.p_currency + sub.s_package.p_price;

          let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
          if (isLoggedIn == "1") {

            this.activeButton = 3;
          } else if (!isLoggedIn) {
            this.activeButton = 2;
            // this.openLogin();
          }
        }

        // this.subscribeInfo = decryptData;
        // this.subscribtionArr = this.subscribeInfo.package_list;
        // this.razorPayKey=this.subscribeInfo.RazorpaySecretKey

      }
    });

  } else {



    this.subscribeInfo1 = {
      s_id: sub.s_id,
      package_mode: sub.s_package.package_mode,
      price: sub.s_package.p_currency + sub.s_package.p_price,
      month: sub.s_package.period_interval,
      currency: sub.s_package.p_currency,
      des: sub.s_package.description,
      autorenew: sub.s_package.autorenewal,
    };
    localStorage.setItem(
      "subscribeInfo",
      JSON.stringify(this.subscribeInfo1)
    );
    sessionStorage.setItem(
      "subscribePack",
      JSON.stringify(this.subscribeInfo1)
    );
    this.monthToPayment =
      sub.s_package.period_interval + " " + sub.s_package.period;
    this.priceToPayment = sub.s_package.p_currency + sub.s_package.p_price;

    let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
    if (isLoggedIn == "1") {
      this.activeButton = 3;
    } else if (!isLoggedIn) {
      this.activeButton = 2;
      // this.openLogin();
      this.checkDiscountValue = sub.s_package.discounted_price
      let pkgData = {
        price: sub.s_package.p_price,
        pkdId: sub.s_id,
        discount: sub.s_package.discounted_price,
        coupon_code: sub.s_package.guest_coupon.coupon_code,
        month: sub.s_package.period_interval,
        currency: sub.s_package.p_currency

      };
      localStorage.setItem('newUserData', JSON.stringify(pkgData))
    }
  }

  // if(index==0 ||index==1||index==2||index==3){
  //  this.activeButton=2
  // }
}

getManualPackage() {
  this.uid = localStorage.getItem("taploginInfo");
  window.scroll(0, 0);
  if (this.uid) {
    this.Uid = JSON.parse(this.uid).id;
    this.ds.subscriptionPackCheck(this.Uid).subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);

        if (decryptData.is_subscriber == 1) {
          localStorage.setItem("is_subscriber", "1");
          this.ed.isSubscribe.next(true);
          this.ed.parentalLock.next(false);
          this.router.navigate(["/my-subscription"]);
        }

        this._storage.setData("ott_subscriptionPlan", decryptData);
      }

    })
  }
}
sendToPayment(e: any) {
  this.activeButton = e;
}
sendToPayment1(e: any) {
  this.activeButton = e;
}
getGeographicalState() {
  // dynamic :-
  const ipDetail: any = localStorage.getItem("ipSaveData");
  const detail = JSON.parse(ipDetail);

  if (detail.countryName == "India") {


    this.statGeographical = detail.regionName;

    this.showStateCountry = true;
  } else {
    this.statGeographical = detail.countryName;
    this.showStateCountry = false;
  }
  // this.ds.apipip().subscribe((res:any)=>{

  //   if(res.countryName=="India"){
  //   const ipSaveData={
  //     'state':res.regionName,
  //     'country':res.countryName
  //   }

  //   localStorage.setItem("ipSaveData",JSON.stringify(ipSaveData))
  // }

  //   let name="india"
  //   if(res.countryName=="India"){
  //   this.statGeographical=res.regionName
  //   this.showStateCountry=true
  //   }else{
  //   this.statGeographical=res.countryName
  //   this.showStateCountry=false
  //   }

  // })

  // static:-
  // this.ds.apipip().subscribe((res:any)=>{

  //   let name="india"
  //   // if(res.countryName=="India"){
  //     if(name=="india"){
  //       // this.statGeographical=res.regionName
  //   this.statGeographical="Uttar Pradesh"
  //   this.showStateCountry=true
  //   }else{
  //   this.statGeographical=res.countryName
  //   this.showStateCountry=false
  //   }

  // })
}

userInfo: any;
userDetails: any;

ngOnDestroy(): void {


  $('.arrow-bottom').show()


  // delete videoJs.getPlayers()[`video-ls`];

}


back() {
  if (this.cameFromFeels) {
    window.history.back();
  } else {
    this.zone.run(() => {
      this.router.navigateByUrl("/");
    });
  }
}

// back() {
//   this.zone.run(() => {
//     this.router.navigateByUrl("/");
//   });
// }

onSelectionChange(sub: any, index: number): void {
  this.selectedOption = sub;
  this.selectedIndex = index;
  //       if (window.innerWidth < 992) {
  //   this.selectedSub = sub;
  //   this.dialog.open(this.subscriptionDetailsModal, {
  //     panelClass: 'subscriptionModalClass',
  //     width: '95vw',
  //       backdropClass: 'subscription-backdrop-class'
  //   });
  // }
}

successPaymentTab4(e: any) {
  this.activeButton = e
}

}
function ipSaveData(ipSaveData: any): string {
  throw new Error("Function not implemented.");
}

