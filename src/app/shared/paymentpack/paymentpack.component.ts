import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Inject,
  Injectable,
  ViewChild,
  PipeTransform,
  Pipe,
  NgZone,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  NgForm
} from "@angular/forms";

import { PaymentCheckoutService } from "src/app/services/payment-checkout.service";
import { DecryptService } from "src/app/services/decrypt.service";

import Swal from "sweetalert2";

import { Subscription } from "rxjs";

declare var $: any;
declare var amazon: any;
declare var Razorpay: any;

declare var paypal: any;
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { UpiModalDialogComponent } from "../dialogBoxes/upi-modal-dialog/upi-modal-dialog.component";
import { LazypayDialogMobileOtpComponent } from "../dialogBoxes/lazypay-dialog-mobile-otp/lazypay-dialog-mobile-otp.component";
import { Router } from "@angular/router";
import { MatRadioChange } from "@angular/material/radio";
import { DataService } from "src/app/services/data.service";
import { PaytmModelComponent } from "../dialogBoxes/paytm-model/paytm-model.component";
import { statesModel } from "./stateModel";
import { state, country } from "./state";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { GeographicalInformationComponent } from "../dialogBoxes/geographical-information/geographical-information.component";
import { NgxSpinnerService } from "ngx-spinner";
import { SwitchCouponComponent } from "../dialogBoxes/switch-coupon/switch-coupon.component";
import { StorageService } from "src/app/services/storage.service";
// declare var AF: any;
import { environment } from 'src/environments/environment';
import { PaymentErrorDialogComponent } from "../dialogBoxes/payment-error-dialog/payment-error-dialog.component";
import { StatePopupComponent } from "../dialogBoxes/state-popup/state-popup.component";
var baseUrl2 = environment.baseUrl2;
const url = 'https://static-na.payments-amazon.com/checkout.js';
const urlRazorpay = 'https://checkout.razorpay.com/v1/checkout.js';
const urlPaypal = 'https://www.paypal.com/sdk/js?client-id=AS26hUgwRJ4fX9ggbLMCUsaUoOcdvk3vveiygFcuxfjnghRFZSukhT0LEqwlsUEw5gT_UHTG291M-cC6&components=buttons';
@Component({
  selector: "app-paymentpack",
  templateUrl: "./paymentpack.component.html",
  styleUrls: ["./paymentpack.component.scss"],
})

export class PaymentpackComponent implements OnInit {
  loadAPI!: Promise<any>;
  // key = "rzp_live_3WhaZfJwk0bfCR";
  searchText: any
  states: any = [];
  // countryAll=country
  currencySymbol: any
  isCheckoutVisible: boolean = false;
  countryAll: any = [];
  razorPayKey: any;
  bankOptions: any;
  bankCode: any;
  sessionId: any;
  show: boolean = false;
  showUpi: boolean = true;
  autoRenewHIde: boolean = true;
  autoRenewMOdal: boolean = true;
  domain: any;
  subscriptionId: any;
  Uid: any;
  uid: any;
  contact: any;
  email: any;
  selectedCountry = new FormControl();
  value = true;
  showCountry = true;
  packageId: any;
  dd: any;
  tot: any;
  discountedCouponCode: any;
  totolDiscount: number | undefined;
  showDiscount = true;
  code = true;
  showCodeLine = false;
  showDiscountMsg = false;
  showMsgError = false;
  tickIcon = false;
  stopIcon = false;
  targetId: any;
  couponHide: boolean = false;
  resetHIde: boolean = false;
  couponpageShow: boolean = true;
  @Input() public subscriptionMonth: any;
  @Input() public razorPayKeyGet: any;
  @Input() public subscriptionPrice: any;
  @Input() public stateDefault: any;
  @Input() public subscribtionArr: any = [];
  @Input() public showCountry1: any;
  @Output() activeBtnValue = new EventEmitter<any>();
  // @Output() sendValueToNetbankingpayment = new EventEmitter<any>();
  @Output() sendValueToPaytmpayment = new EventEmitter<any>();
  @Output() sendValueTorecurringpayment = new EventEmitter<any>();
  @Output() sendValueToPaypal = new EventEmitter<any>();
  @Output() openTab4 = new EventEmitter<any>();
  @Output() openTab1 = new EventEmitter<any>();
  @Output() sendValueToPayment = new EventEmitter<any>();


  paymentItems: any[] = [];
  thirdPartyDetails: any;
  mobikwikDetails: any;
  @ViewChild('FormDir') FormDir!: NgForm;
  paytms: any;
  paymentForm!: FormGroup;
  RedeemForm!: FormGroup;
  upiForm!: FormGroup;
  autoRenewForm!: FormGroup;
  user: any;
  userId: any;
  package: any;
  subs: any = Subscription;
  amazonHide: boolean = true;
  loginId = JSON.parse(localStorage.getItem("taploginInfo") || "{}");
  showSuccess: boolean = false;
  showCancel: boolean = false;
  showError: boolean = false;
  oneTimeCreditSHow: boolean = false;
  subscription: any;
  packagePrice: any;
  ipAddress: any;
  errorMsg: any;
  errorAlertData: any;
  paymentDetails: any = [];
  Offer: any = [];
  autoRenew: any;
  allHIde: boolean = true;
  country_code: any;
  mainData: any;
  paymentErrorMessage: any;

  discloseCoupon: any
  coupunSubscriber: any;
  firstValue: any;
  global_coupon: any;
  global_coupons: any

  constructor(

    private router: Router,
    private http: HttpClient,
    private _fb: FormBuilder,
    private _DS: DataService,
    private DEC_SER: DecryptService,
    private checkout: PaymentCheckoutService,
    public dialog: MatDialog,
    private ed: ExchangeDataService,
    private fcs: FunctionCallingService,
    private SpinnerService: NgxSpinnerService,
    private _storage: StorageService,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: any
  ) {
    this.jsonDevData().subscribe((res: any) => {
      this.mainData = res.result


    });
    this.fcs.fgh.subscribe((value) => {
      if (value.countryName == "India") {
        if (value.regionName == "National Capital Territory of Delhi") {
          value.regionName = "Delhi";
        }
        this.stateDefault = value.regionName;
        this.showCountry = true;
      } else {
        this.stateDefault = value.countryName;
        this.showCountry = false;
      }
    });
    this.fcs.removeCoupon.subscribe(val => {
      if (val == true) {
        this.RedeemForm.reset();
      }

    });
    this.fcs.statePopup.subscribe(val => {
      this.stateDefault = val
      this.stateNamesend = val
    });
  }


  ngOnInit(): void {
    const popup: any = localStorage.getItem('faqData');
    const faq: any = JSON.parse(popup);
    this.global_coupon = faq.Others.global_coupon;
    if (this.global_coupon == 0) {
      this.couponpageShow = false
      this.gotoPaymentpay('1');
    }



    let ip: any = localStorage.getItem("ipSaveData");
    this.ipAddress = JSON.parse(ip).countryName;
    this.country_code = JSON.parse(ip).countryCode;
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.packagePrice = sessionStorage.getItem("subscribePack");
    this.subscription = JSON.parse(this.packagePrice);
    if (!this.subscriptionPrice) {
      this.subscriptionPrice = this.subscription;
    }
    if (this.stateDefault == "National Capital Territory of Delhi") {
      this.stateDefault = "Delhi";
    }
    this.getCountryStatesList();
    this.showCountry = this.showCountry1;
    // this.getJson();

    this.RedeemForm = this._fb.group({
      redeem: ["", Validators.required],
    });


    this.domain = this.document.location.hostname;
    this.loadScript();



  }
  loadScript() {

    let nodeRazorpay = document.createElement('script');
    nodeRazorpay.src = urlRazorpay;
    nodeRazorpay.type = 'text/javascript';
    nodeRazorpay.async = true;
    document.getElementsByTagName('head')[0].appendChild(nodeRazorpay);

  }
  jsonDevData() {
    return this.http.get(`${baseUrl2}`);
  }

  getCountryStatesList() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.states = res.state;
      this.countryAll = res.country;

    });
  }

  getJson() {
    var data: any = localStorage.getItem('innerJson')
    data = JSON.parse(data)
    // this._DS.json2().subscribe((data: any) => {
    this.paymentItems = data.payment_providers;
    this.paymentDetails = data.payment_providers;

    this.paymentDetails.forEach((element: any) => {
      this.Offer.push(element.is_offer);
    });

    for (let i in this.Offer) {
      if (this.Offer[i] == 1) {
        this.allHIde = true;

      } else if (this.Offer[i] == 0) {
        this.allHIde = false;
      }
    }

  }
  openInformation() {
    const dialogRef = this.dialog.open(GeographicalInformationComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "390px",
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  redeemSubmit() {
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }
    });

    const subscribeInfo = {
      currency: this.subscriptionPrice.currency,
      s_id: this.subscriptionPrice.s_id,
      package_mode: this.subscriptionPrice.package_mode,
      price: this.subscriptionPrice.price,
      month: this.subscriptionPrice.month,
      autorenew: this.subscriptionPrice.s_package.autorenewal,

    };
    localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    this.packageId = localStorage.getItem("subscribeInfo");
    this.package = JSON.parse(this.packageId);
    console.log(this.package, "package")

    const formData = new FormData();
    formData.append("c_id", this.user.id);
    formData.append("coupon_code", this.RedeemForm.value.redeem);
    formData.append("device", "web");
    formData.append("package_id", this.package.s_id);
    formData.append("country_code", this.country_code);
    formData.append("package_mode", "OTT");
    if (this.RedeemForm.valid) {
      this._DS.redeemCoupon(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.discloseCoupon = decryptData;

          if (decryptData.code == 1) {
            setTimeout(() => {
              this._DS.getUserSubscriptionDetails(this.loginId.id).subscribe(res => {
                this.DEC_SER.getDecryptedData(res.result);
                this.coupunSubscriber = JSON.parse(this.DEC_SER.decryptData);
                if (this.coupunSubscriber.is_subscriber == 1) {
                  this.ed.isSubscribe.next(true);
                  const exp_date = new Date(this.coupunSubscriber['packages_list'][0]['subscription_end']).getTime();
                  localStorage.setItem('is_subscriber', '1')
                  this.ed.parentalLock.next(false)
                } else if (this.coupunSubscriber.is_subscriber == 0) {

                  localStorage.setItem('is_subscriber', '0')
                  this.ed.parentalLock.next(true)
                }
                this._storage.setData('ott_subscriptionPlan', this.coupunSubscriber);
              })

              this.openTab1.emit(3)
            }, 700);

          }
          else if (this.discloseCoupon.code == 2) {
            this.couponHide = true
            this.code = false;
            this.showMsgError = false;
            this.showDiscountMsg = true;
            this.tickIcon = true;
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.discountedCouponCode = decryptData;
            this.showCodeLine = true;
            this.dd = Number(this.subscriptionPrice.price.slice(1));
            let a = this.discountedCouponCode.value;

            let b = Number(this.subscriptionPrice.price.slice(1));
            this.firstValue = b;
            let c = b - a;
            this.tot = c;
            // this.tot = this.subscriptionPrice.currency + c;

            // this.subs()
            this.showDiscount = false;

            const subscribeInfo = {
              currency: this.subscriptionPrice.currency,
              s_id: this.subscriptionPrice.s_id,
              package_mode: this.subscriptionPrice.package_mode,
              price: this.tot,
              month: this.subscriptionPrice.month,
              autorenew: this.subscriptionPrice.s_package.autorenewal,

            };
            localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
          }
          else if (this.discloseCoupon.code == 3) {

            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.discountedCouponCode = decryptData;

            const dialogRef = this.dialog.open(SwitchCouponComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'adultAgePopup',
              width: "469px",
              data: { redeem: this.RedeemForm.value.redeem, package_id: this.discountedCouponCode.data },
            });
            const sub = dialogRef.componentInstance.sendToFirstTab.subscribe((verify: any) => {
              this.couponHide = true
              this.code = false;
              this.showMsgError = false;
              this.showDiscountMsg = true;
              this.tickIcon = true;
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.discountedCouponCode = decryptData;
              this.subscriptionMonth = this.discountedCouponCode.data.interval + ' ' + this.discountedCouponCode.data.period
              this.showCodeLine = true;
              this.dd = Number(this.discountedCouponCode.data.price);
              let a = verify;

              let b = Number(this.discountedCouponCode.data.price);
              this.firstValue = b;
              let c = b - a;
              this.tot = c
              // this.tot = this.subscriptionPrice.currency + c;

              // this.subs()
              this.showDiscount = false;

              const subscribeInfo = {
                currency: this.subscriptionPrice.currency,
                s_id: this.discountedCouponCode.data.package_id,
                package_mode: this.subscriptionPrice.package_mode,
                price: this.tot,
                month: this.discountedCouponCode.data.interval,
                autorenew: this.subscriptionPrice.s_package.autorenewal,

              };
              localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
            })
          }
        } else {
          this.stopIcon = true;
          this.showMsgError = true;
        }
      });
    } else {
      // this.showMsgError = true;
    }
  }

  onOtpChange(otp: any) {

    if (otp.length != 0) {
      this.showMsgError = false;

    }
  }

  removeCode() {

    this.RedeemForm.reset();
    this.code = true;
    this.couponHide = false;
    this.showCodeLine = false;
    this.showDiscount = true;
    this.showDiscountMsg = false;

    const subscribeInfo = {
      currency: this.subscriptionPrice.currency,
      s_id: this.subscriptionPrice.s_id,
      package_mode: this.subscriptionPrice.package_mode,
      price: this.subscriptionPrice.price,
      month: this.subscriptionPrice.month,
      autorenew: this.subscriptionPrice.s_package.autorenewal,

    };
    localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
  }






  openPayment() {
    let isLoggedIn = localStorage.getItem("ott_isLoggedIn");
    if (isLoggedIn == "1") {
      const subscribeInfo = {
        s_id: this.subscriptionPrice.s_id,
        package_mode: this.subscriptionPrice.s_package.package_mode,
        price: this.subscriptionPrice.s_package.p_currency + this.subscriptionPrice.s_package.p_price,
        month: this.subscriptionPrice.s_package.period_interval,
        currency: this.subscriptionPrice.s_package.p_currency,
        des: this.subscriptionPrice.s_package.description,
        autorenew: this.subscriptionPrice.s_package.autorenewal,

      };
      localStorage.setItem(
        "subscribeInfo",
        JSON.stringify(subscribeInfo)
      );
      sessionStorage.setItem(
        "subscribePack",
        JSON.stringify(subscribeInfo)
      );
      this.gotoPaymentpay('1')


    } else if (!isLoggedIn) {
      this.openTab1.emit(2)
      // this.openLogin();
    }



  }





  // gotoPaymentpay(value: any) {

  //   // if(value==1){
  //   //   this.removeCode()
  //   //  this.RedeemForm.value.redeem=''
  //   // }
  //   this._DS.apipip().subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.DEC_SER.getDecryptedData(res?.result);
  //       let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
  //       localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
  //     }
  //   });
  //   window.scrollTo(0, 0);

  //   let userInfo: any = localStorage.getItem("taploginInfo") || {};
  //   let cardDetails: any = localStorage.getItem("subscribeInfo") || {};
  //   let ip: any = localStorage.getItem("ipSaveData");
  //   if (JSON.parse(ip).countryCode == "IN") {
  //     this.currencySymbol = 'INR'
  //   } else {
  //     this.currencySymbol = 'USD'
  //   }
  //   const formData = new FormData();

  //   if (Object.keys(userInfo).length >= 1) {

  //     formData.append("c_id", JSON.parse(userInfo).id);
  //     formData.append(
  //       "cart",
  //       `{"items":[{"id":${JSON.parse(cardDetails).s_id},"package_mode":"${JSON.parse(cardDetails).package_mode
  //       }"}]}`
  //     );
  //     formData.append("autorenewal",this.subscriptionPrice.autorenew)
  //     formData.append("paymentgateway", "juspay");
  //     formData.append("region_type", "1");
  //     formData.append("coupon_code", '');
  //     formData.append("user_role", "1");
  //     formData.append("device", "web");
  //     formData.append("country_code", JSON.parse(ip).countryCode);
  //     formData.append("state", JSON.parse(ip).regionName);
  //     formData.append("country", JSON.parse(ip).countryName);
  //     let location = {
  //       loc_country: JSON.parse(ip).countryName,
  //       city: JSON.parse(ip).city,
  //       loc_state: JSON.parse(ip).regionName,
  //       ip: JSON.parse(ip).ip,
  //       lat: JSON.parse(ip).latitude,
  //       long: JSON.parse(ip).longitude,
  //       pincode: JSON.parse(ip).postalCode,
  //       isp: JSON.parse(ip).connection.isp,
  //     };

  //     formData.append("location", JSON.stringify(location));

  //     this.checkout.createOrder(formData).subscribe((data: any) => {

  //       if (data.code == 1) {
  //         this.DEC_SER.getDecryptedData(data.result);
  //         localStorage.setItem("checkoutData", this.DEC_SER.decryptData);
  //         let checkoutData = JSON.parse(this.DEC_SER.decryptData);
  //         this.sessionId = checkoutData;


  //         this.goToRazorpay(checkoutData)

  //       }

  //     },

  //       (err) => {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: "Something went wrong!",
  //         });
  //       }
  //     );
  //   }
  // }
  gotoPaymentpay(value: any) {

    // if(value==1){
    //   this.removeCode()
    //  this.RedeemForm.value.redeem=''
    // }
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }
    });
    window.scrollTo(0, 0);

    let userInfo: any = localStorage.getItem("taploginInfo") || {};
    let cardDetails: any = localStorage.getItem("subscribeInfo") || {};
    let ip: any = localStorage.getItem("ipSaveData");
    if (JSON.parse(ip).countryCode == "IN") {
      this.currencySymbol = 'INR'
    } else {
      this.currencySymbol = 'USD'
    }
    const formData = new FormData();

    if (Object.keys(userInfo).length >= 1) {

      formData.append("c_id", JSON.parse(userInfo).id);

      formData.append(
        "cart",
        `{"items":[{"id":${JSON.parse(cardDetails).s_id},"package_mode":"${JSON.parse(cardDetails).package_mode
        }"}]}`
      );

      formData.append("paymentgateway", "razorpay");
      formData.append("region_type", "1");
      formData.append("coupon_code", '');
      formData.append("user_role", "1");
      formData.append("device", "web");
      formData.append("country_code", JSON.parse(ip).countryCode);
      formData.append("state", JSON.parse(ip).regionName);
      formData.append("country", JSON.parse(ip).countryName);
      let location = {
        loc_country: JSON.parse(ip).countryName,
        city: JSON.parse(ip).city,
        loc_state: JSON.parse(ip).regionName,
        ip: JSON.parse(ip).ip,
        lat: JSON.parse(ip).latitude,
        long: JSON.parse(ip).longitude,
        pincode: JSON.parse(ip).postalCode,
        isp: JSON.parse(ip).connection.isp,
      };

      formData.append("location", JSON.stringify(location));
      formData.append("autorenew", JSON.parse(cardDetails).autorenew);
      this._DS.createOrder(formData).subscribe((res) => {

        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          localStorage.setItem("checkoutData", this.DEC_SER.decryptData);
          let checkoutData = JSON.parse(this.DEC_SER.decryptData);
          this.sessionId = checkoutData;
          let autorenew = JSON.parse(cardDetails).autorenew
          // if (autorenew == 1) {
          //   this.goToRazorpayauto(checkoutData)
          // } else if (autorenew == 0) {
          //   this.goToRazorpay(checkoutData)
          // }

          this.goToRazorpay(checkoutData,autorenew)


          // this.uid = localStorage.getItem("taploginInfo");
          // this.Uid = JSON.parse(this.uid).id;
          // this.uid;
          // setTimeout(() => {
          //   this._DS.getUserSubscriptionDetails(this.Uid).subscribe((res) => {
          //     this.DEC_SER.getDecryptedData(res.result);
          //     const data: any = JSON.parse(this.DEC_SER.decryptData);
          //     console.log(data)
          //     if (data.is_subscriber == 1) {
          //       this.openTab1.emit(4)
          //       localStorage.setItem("is_subscriber", "1");
          //       // location.reload()
          //       this.ed.isSubscribe.next(true);  

          //     }
          //   });
          //   this.router.navigate(['/subscribe'], {queryParams:{'tab':'4'}});
          // }, 1000);




        }

      },

        (err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      );
    }
  }
  options: object = {};
  verifyPay: any;
  // goToRazorpay(checkoutdata: any) {

  //   const userInfo: any = localStorage.getItem('taploginInfo') || {};
  //   this.options = {
  //     'key': 'rzp_live_UeJrCH8yutrbT5', // Enter the Key ID generated from the Dashboard
  //     'amount': this.sessionId.total, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //     'currency': this.currencySymbol,
  //     'name': 'VIVE',
  //     'description': 'VIVE',
  //     // 'image': 'assets/book.png',
  //     'order_id': checkoutdata.gateway_ref_id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //     'handler': (response: any) => {

  //       this.verifyPay = response;
  //       this.makeRazorpayPayment(response);

  //     },
  //     'prefill': {
  //       'name': userInfo.firstName + ' ' + userInfo.last_name,
  //       'email': userInfo.email,
  //       "contact": userInfo.contact
  //     },
  //     'notes': {
  //       'address': 'Razorpay Corporate Office'
  //     },
  //     'theme': {
  //       'color': '#3399cc'
  //     },
  //     'modal': {
  //       ondismiss: () => {
  //         // console.log("ddddddddddd");
  //         this.zone.run(() => {
  //           this.openTab1.emit(1);
  //         });
  //         // console.log('User cancelled the payment or closed the Razorpay modal');
  //       }
  //     }
  //   };
  //   const rzp1 = new Razorpay(this.options);
  //   rzp1.open();
  //   rzp1.on('payment.failed', (response: any) => {
  //     console.error('Payment Failed:', response);
  //     const now = new Date();
  //     const currentTime = now.toLocaleTimeString();
  //     const eventParams = {
  //       plan_name: JSON.parse(this.packagePrice).packageName,
  //       transaction_id: this.sessionId.rzrpy_trans_id,
  //       cancel_reason: 'Payment failed',
  //       cancel_time: currentTime,
  //     };

  //   });

  // }

  // goToRazorpayauto(checkoutdata: any) {
  //   const userInfo: any = JSON.parse(localStorage.getItem('taploginInfo') || '{}');

  //   let options: any = {
  //     key: 'rzp_live_UeJrCH8yutrbT5',
  //     name: 'VIVE',
  //     description: 'VIVE Subscription',
  //     handler: (response: any) => {
  //       this.verifyPay = response;
  //       console.log('Payment Success:', response);
  //       this.makeRazorpayPayment(response); // always subscription
  //     },
  //     prefill: {
  //       name: (userInfo.firstName || '') + ' ' + (userInfo.last_name || ''),
  //       email: userInfo.email,
  //       contact: userInfo.contact
  //     },
  //     notes: {
  //       address: 'Razorpay Corporate Office'
  //     },
  //     theme: { color: '#3399cc' },
  //     modal: {
  //       ondismiss: () => {
  //         this.zone.run(() => {
  //           this.openTab1.emit(1);
  //         });
  //       }
  //     },
  //     subscription_id: checkoutdata.gateway_ref_id
  //   };

  //   const rzp1 = new Razorpay(options);
  //   rzp1.open();

  //   rzp1.on('payment.failed', (response: any) => {
  //     console.error('Payment Failed:', response);
  //     const now = new Date();
  //     const currentTime = now.toLocaleTimeString();

  //     const eventParams = {
  //       plan_name: JSON.parse(this.packagePrice).packageName,
  //       transaction_id: this.sessionId.rzrpy_trans_id,
  //       cancel_reason: 'Payment failed',
  //       cancel_time: currentTime,
  //     };

  //     // send eventParams to backend/analytics
  //   });
  // }

  goToRazorpay(checkoutdata: any, autoRenew:any) {
    const userInfo: any = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  
    const options: any = {
      key: 'rzp_live_UeJrCH8yutrbT5',
      name: 'VIVE MOVIES',
      description: autoRenew ? 'VIVE Subscription' : 'VIVE One-Time Purchase',
      image: 'https://static.creatorott.com/configration/5006/5006_68c8fc7215f66.png', // ✅ your logo here
      handler: (response: any) => {
        this.verifyPay = response;
        console.log('Payment Success:', response);
        this.makeRazorpayPayment(response);
      },
      prefill: {
        name: (userInfo.firstName || '') + ' ' + (userInfo.last_name || ''),
        email: userInfo.email,
        contact: userInfo.contact
      },
      notes: {
        address: 'Razorpay Corporate Office'
      },
      theme: { color: '#3399cc' },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.openTab1.emit(1);
          });
        }
      }
    };
  
    // 🔹 Decide between subscription or one-time
    if (autoRenew == '1') {
      options.subscription_id = checkoutdata.gateway_ref_id;
    } else if(autoRenew == '0') {
      options.order_id = checkoutdata.gateway_ref_id;
    }
  
    const rzp1 = new Razorpay(options);
    rzp1.open();
  
    rzp1.on('payment.failed', (response: any) => {
      console.error('Payment Failed:', response);
      const now = new Date();
      const currentTime = now.toLocaleTimeString();
  
      const eventParams = {
        plan_name: JSON.parse(this.packagePrice).packageName,
        transaction_id: this.sessionId.rzrpy_trans_id,
        cancel_reason: 'Payment failed',
        cancel_time: currentTime,
      };
  
    });
  }
  



  stateNamesend: any;
  stateNameSelect(stateName: any) {

    if (stateName != '') {
      this.stateNamesend = stateName;
    }
  }
  onSearch(item: any) {
  }

  testSearch(term: any, item: any) {
    return item.name.startsWith(term);
  }
  stateSelected(state: any) {
    if (state != '') {
      this.stateNamesend = state;
      this.stateDefault = state
    }
  }



  makeRazorpayPayment(data: any) {
    // this.sendValueToPayment.emit(3);
    let userInfo: any = localStorage.getItem("taploginInfo") || {};
    this.sessionId = localStorage.getItem("checkoutData");
    let ip: any = localStorage.getItem("ipSaveData");
    const formData = new FormData();
    formData.append("c_id", JSON.parse(userInfo).id);
    formData.append(
      "subscription_id",
      JSON.parse(this.sessionId).gateway_ref_id
    );
    formData.append("paymentgateway", "razorpay");
    formData.append("order_id", JSON.parse(this.sessionId).id);
    formData.append("trans_id", data.razorpay_payment_id);
    formData.append("status", "1");
    formData.append("device", "web");
    formData.append("pg_ref_id", JSON.parse(this.sessionId).rzrpy_trans_id);

    this.checkout.makeRazorPayPayment(formData).subscribe((res: any) => {
      console.log(res);

      // this.DEC_SER.getDecryptedData(res.result);

      if (res.code == 1) {
        // this.removeCode()
        // this.openTab1.emit(3)
        // this.sendValueToNetbankingpayment.emit(3);
        this.uid = localStorage.getItem("taploginInfo");
        // this.Uid=this.uid.id
        this.Uid = JSON.parse(this.uid).id;
        this.uid;
        this._DS.getUserSubscriptionDetails(this.Uid).subscribe((res) => {
          console.log(res);
          this.DEC_SER.getDecryptedData(res.result);
          const data: any = JSON.parse(this.DEC_SER.decryptData);
          if (data.is_subscriber == 1) {

            this.zone.run(() => {
              this.openTab1.emit(4);
            });

            // this.sendValueToPayment.emit(4);
            localStorage.setItem("is_subscriber", "1");
            this.ed.isSubscribe.next(true);
          }
        });
        // this.router.navigate(['/subscribe'], {queryParams:{'tab':'4'}});
      }
    });
  }
  triggerEvent() {
    this.searchText = ''
  }

  paymentErrorMsg() {
    document.body.style.overflow = "hidden";
    const dialogRef = this.dialog.open(PaymentErrorDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "adultAgePopup",
      width: "390px",
      data: { paytmDetails: this.paymentErrorMessage },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      document.body.style.overflow = "auto";
    });
  }

  openState() {
    const dialogRef = this.dialog.open(StatePopupComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "statepopup",
      width: "390px",
    });
  }

}

@Pipe({
  name: 'filter',
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}