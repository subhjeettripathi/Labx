import { Component, OnInit } from "@angular/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SeoService } from "src/app/services/seo.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import * as firebase from "firebase/app";
export interface ICountryAndCode {
  code: string;
  name: string;
  dial_code: string;
}
declare var $: any;
declare var AppleID: any;
@Component({
  selector: "app-subscribe",
  templateUrl: "./subscribe.component.html",
  styleUrls: ["./subscribe.component.scss"],
})
export class SubscribeComponent implements OnInit {
  title = 'My-subscrption';
  subscriptionType: 'recurring' | 'onetime' = 'recurring';
  descrption = 'watch all items with all ads but without any limits'
  activeButton: number = 1;
  listItems = [
    { item: "watch all items with all ads but without any limits" },
    { item: "no download option" },
    { item: "can catch all the show any time" },
    { item: "watch all items" },
    { item: "available in SD quality" },
  ];
  activeIndex = -1;
  subscribeInfo: any;
  subscribtionArr: any = [];
  subscribtionArr1: any = [];
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
  errorMsg: any
  dataRental: any = []
  isRental: boolean = false

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
    private fcs: FunctionCallingService
  ) {
    this.timeZoneOffset = new Date();
    this.ed.alreadySubscriber.subscribe((value) => {
      const userInfo: any = localStorage.getItem("taploginInfo") || {};
      if (Object.keys(userInfo).length) {
        this.continueFree = false;
      }
    });
    this.fcs.isRental.subscribe((value) => {
      if (value == true) {
        this.isRental = true
      }
    });
    this.ed.hideMemberAlert.subscribe((value) => {
      if (value == true) {
        this.vis = false;
      }
    });

  }

  ngOnInit(): void {
    let errorAlertData: any = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(errorAlertData)
    console.log(this.errorMsg);
    this._ar.queryParams.subscribe((params) => {
      if (params['promotion']) {
        this.handlePromotion(params['promotion']);
      } else {
        this.getSubcribeInfo();
      }
    });

    $('.arrow-bottom').hide()


    this.isLoggedIn = localStorage.getItem("ott_isLoggedIn");
    window.scroll(0, 0);

    // firebase.analytics().logEvent('USER_PLAN', {
    //   'click': 'userplan'
    // })

    this.getGeographicalState();
    // let pop =  localStorage.getItem('ott_isLoggedIn')

    $(".crossImg").click(() => {
      $(".subscontainer").hide();
    });
    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    if (Object.keys(userInfo).length) {
      this.continueFree = false;
    } else {
      this.openLogin()
    }
    this.getConfigData();

  }
  rentalData() {
    this.dataRental = localStorage.getItem("rentalData");
    this.subscribtionArr1 = JSON.parse(this.dataRental)
    console.log(this.subscribtionArr1)
  }
  successPaymentTab4(e: any) {
    console.log(e)

  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  // getValueFromUpi(e: any) {
  //   // this.activeButton = e;
  // }
  // payPalPayment(e: any) {
  //   // this.activeButton = e;
  // }
  // // couponDirect(r: any) {
  // //   this.activeButton = 4;
  // // }
  couponSwitch(a: any) {
    this.activeButton = a;
    window.scroll(0, 1)
  }
  closeBanner() {
    this.vis = false;
  }
  getConfigData() {
    var contin = JSON.parse(localStorage.getItem('faqData') || '{}');

    this.jsonData = contin.Others.ContinueFree
    console.log(this.jsonData);
    // this.ds.faqData().subscribe((res: any) => {
    //   // console.log(res.Form[0].signin)
    //   this.jsonData = res.Others.ContinueFree;
    //   console.log(this.jsonData);
    // });  this.activeButton = 2;
  }
  openLogin() {

    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      panelClass: "logindialog",
      width: "390px",
      data: { name: "login" },
    });
    dialogRef.disableClose = true;
  }
  getSubcribeInfo() {

    this.ds.apipip().subscribe((res: any) => {
      localStorage.setItem("ipSaveData", JSON.stringify(res));
      this.ds.getSubscribeInfo(res.countryCode).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.subscribeInfo = decryptData;
          this.subscribtionArr = this.subscribeInfo.package_list;
          this.razorPayKey = this.subscribeInfo.RazorpaySecretKey;
          console.log(this.subscribtionArr);
        }
      });
    });

  }
  handlePromotion(package_id: any) {
    this.ds.faqData().subscribe((res: any) => {
      localStorage.setItem('faqData', JSON.stringify(res))
      const dataPromotion = res;
      const upgradePlan = dataPromotion?.App?.[0]?.settings?.[0]?.upgrade_plan;

      let selectedPlan: any = null;

      if (upgradePlan?.highlight_plan?.package?.id == package_id) {
        selectedPlan = upgradePlan.highlight_plan
      } else {
        selectedPlan = upgradePlan.basic_plan.plans.find(
          (plan: any) => plan.package.id == package_id
        );
      }
      console.log(selectedPlan);

      if (!selectedPlan || !selectedPlan.package.id) {
        console.error('No valid promotion package found in upgradePlan');
        this.errorMsg = 'The promoted package is not available. Please select another package.';
        this.activeButton = 1;
        return;
      }
      this.ds.apipip().subscribe((res: any) => {
        localStorage.setItem("ipSaveData", JSON.stringify(res));
        const detail = res.countryCode
        console.log(res);

        if (detail == 'IN') {
          const promotionPackage = {
            package_id: selectedPlan?.package?.id,
            s_package: {
              p_name: selectedPlan?.title,
              p_currency: selectedPlan?.package?.currency,
              p_price: selectedPlan?.package?.price,
              period: selectedPlan?.package?.package_period,
              period_interval: selectedPlan?.package?.package_interval,
              package_mode: selectedPlan?.package?.package_mode,
              description: selectedPlan?.description
            }
          };
          this.activeIndex = 0;
          if (selectedPlan?.package?.package_mode == 'OTT') {
            this.addSubcription(promotionPackage, 0);
          } else {
            this.addSubcriptionRental(promotionPackage, 0);
          }

          this.activeButton = 2;
        } else {
          const promotionPackage = {
            package_id: selectedPlan?.package?.id,
            s_package: {
              p_name: selectedPlan?.title,
              p_currency: selectedPlan?.package?.ROW_currency,
              p_price: selectedPlan?.package?.ROW_price,
              period: selectedPlan?.package?.package_period,
              period_interval: selectedPlan?.package?.package_interval,
              package_mode: selectedPlan?.package?.package_mode,
              description: selectedPlan?.description
            }

          };
          this.activeIndex = 0;
          if (selectedPlan?.package?.package_mode == 'OTT') {
            this.addSubcription(promotionPackage, 0);
          } else {
            this.addSubcriptionRental(promotionPackage, 0);
          }
          this.activeButton = 2;
        }
      })
    });

  }

  getActiveNess(activeNumber: number) {

    let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
    switch (this.activeButton) {

      case 1:
        if (activeNumber === 3 || activeNumber === 2) {
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
        if (activeNumber === 3) {
          this.activeButton = 3;
        }
        break;
      case 4:
        if (activeNumber === 4) {
          //  this.activeButton=1
        }
        break;
      default:
        this.activeButton = activeNumber;

        break;
    }
  }


  addSubcription(sub: any, index: any) {

    this.uid = localStorage.getItem("taploginInfo");
    window.scroll(0, 0);

    if (this.uid) {

      this.Uid = JSON.parse(this.uid).id;
      this.ds.subscriptionPackCheck(this.Uid).subscribe((res: any) => {

        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        console.log(decryptData);
        console.log(sub);
        this.subscribeInfo1 = {
          s_id: sub.package_id,
          package_mode: sub.s_package.package_mode,
          price: sub.s_package.p_currency + sub.s_package.p_price,
          month: sub.s_package.period_interval,
          currency: sub.s_package.p_currency,
          total: sub.s_package.p_price,
          packageName: sub.s_package.p_name,

        }
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
        this.activeButton = 2;
      });
    } else {
      this.openLogin()
      console.log(sub);
      this.subscribeInfo1 = {
        s_id: sub.s_id,
        package_mode: sub.s_package.package_mode,
        price: sub.s_package.p_currency + sub.s_package.p_price,
        month: sub.s_package.period_interval,
        currency: sub.s_package.p_currency,
        packageName: sub.s_package.p_name,
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
        // this.activeButton = 3;
      } else if (!isLoggedIn) {
        // this.activeButton = 2;
      }
    }

    // if(index==0 ||index==1||index==2||index==3){
    //  this.activeButton=2
    // }
  }
  addSubcriptionRental(sub: any, index: any) {

    this.uid = localStorage.getItem("taploginInfo");
    window.scroll(0, 0);
    if (this.uid) {

      this.Uid = JSON.parse(this.uid).id;
      this.ds.subscriptionPackCheck(this.Uid).subscribe((res: any) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        const exists = decryptData.packages_list.some(
          (item: { package_id: any; }) => item.package_id === sub.package_id
        );

        if (res.code == 1 && exists) {
          this.router.navigate(["/my-subscriptions"]);

        } else {
          const currency = sub.currency !== undefined ? sub.currency : sub.s_package?.p_currency ?? '';
          const price = sub.price !== undefined ? sub.price : sub.s_package?.p_price ?? '';
          this.subscribeInfo1 = {
            s_id: sub.package_id,
            package_mode: sub.package_mode ?? sub.s_package?.package_mode,
            price: currency + price,
            month: sub.period_interval ?? sub.s_package?.period_interval,
            currency: sub.currency ?? sub.s_package?.p_currency,
            packageName: sub.s_package.p_name,
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
            sub.period_interval + " " + sub.period;
          this.priceToPayment =
            sub.currency + sub.price;
          this.activeButton = 2;

        }
      });
    } else {

      console.log(sub);
      this.subscribeInfo1 = {
        s_id: sub.package_id,
        package_mode: sub.package_mode,
        price: sub.currency + sub.price,
        month: sub.period_interval,
        currency: sub.currency,
        packageName: sub.s_package.p_name,
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
        sub.period_interval + " " + sub.period;
      this.priceToPayment = sub.currency + sub.price;

      let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
      if (isLoggedIn == "1") {
        // this.activeButton = 3;
      } else if (!isLoggedIn) {
        // this.activeButton = 2;
      }
    }
  }
  sendToPayment(e: any) {
    // this.activeButton = e;
  }
  getGeographicalState() {
    // dynamic :-
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    console.log(detail);
    if (detail.countryName == "India") {
      console.log(detail.countryName);

      this.statGeographical = detail.regionName;
      console.log(this.statGeographical);
      this.showStateCountry = true;
    } else {
      this.statGeographical = detail.countryName;
      this.showStateCountry = false;
    }
    // this.ds.apipip().subscribe((res:any)=>{
    //   console.log(res);
    //   if(res.countryName=="India"){
    //   const ipSaveData={
    //     'state':res.regionName,
    //     'country':res.countryName
    //   }
    //   console.log(ipSaveData);
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
    //   console.log(res);
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

  gotoCoupon() {
    this.activeButton = 3;
  }
  ngOnDestroy(): void {


    $('.arrow-bottom').show()


    // delete videoJs.getPlayers()[`video-ls`];

  }

}
function ipSaveData(ipSaveData: any): string {
  throw new Error("Function not implemented.");
}
