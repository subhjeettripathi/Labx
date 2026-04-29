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
  ChangeDetectorRef,
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
declare var Razorpay: any;

declare var Paytm: any;
import Swal from "sweetalert2";
import { CheckoutService } from "paytm-blink-checkout-angular";
import { Subscription } from "rxjs";

declare var $: any;
declare var amazon: any;


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
import { AnalyticsService } from "src/app/services/analytics.service";
import { TranslationService } from "src/app/services/translation.service";
//const url = 'https://static-na.payments-amazon.com/checkout.js';
const urlRazorpay = 'https://checkout.razorpay.com/v1/checkout.js';
//const urlPaypal = 'https://www.paypal.com/sdk/js?client-id=AS26hUgwRJ4fX9ggbLMCUsaUoOcdvk3vveiygFcuxfjnghRFZSukhT0LEqwlsUEw5gT_UHTG291M-cC6&components=buttons';
@Component({
  selector: "app-paymentpack",
  templateUrl: "./paymentpack.component.html",
  styleUrls: ["./paymentpack.component.scss"],
})

export class PaymentpackComponent implements OnInit {
  isInputNotEmpty: boolean = false; // For tracking input status
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
  @Input() public subscriptionMonth: any;
  @Input() public razorPayKeyGet: any;
  @Input() public subscriptionPrice: any;
  @Input() public stateDefault: any;

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
  ishighlight: boolean = false

  constructor(
    private translate: TranslationService,
    private readonly checkoutService: CheckoutService,
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
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private analyticsService: AnalyticsService,

    @Inject(DOCUMENT) private document: any
  ) {
    this.jsonDevData().subscribe((res: any) => {
      this.mainData = res.result
      console.log(this.mainData);


    });
    this.fcs.fgh.subscribe((value) => {
      if (value.countryName == "India") {
        console.log(value.countryName);
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



    console.log(this.subscriptionPrice)
    console.log(this.loginId)
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
    // console.log(this.countryAll);
    this.showCountry = this.showCountry1;
    this.getJson();

    this.RedeemForm = this._fb.group({
      redeem: ["", Validators.required],
    });



    this.domain = this.document.location.hostname;
    this.loadScript();

    // if (this.domain == "altbweb-dev.multitvsolution.com") {
    //   this.show = true;
    // }
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
    console.log(this.paymentDetails);

    this.paymentDetails.forEach((element: any) => {
      this.Offer.push(element.is_offer);
    });
    // console.log("leng", this.Offer);
    for (let i in this.Offer) {
      if (this.Offer[i] == 1) {
        this.allHIde = true;

      } else if (this.Offer[i] == 0) {
        this.allHIde = false;
      }
    }
    // this.razorPayKey = data.ThirdParty[0].Razorpay.SECRET_KEY;
    // this.mobikwikDetails = data.ThirdParty[0].Mobikwik.MOBIKWIK_MERCHANTID;
    // });
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
      localStorage.setItem("ipSaveData", JSON.stringify(res));
    });
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    this.packageId = localStorage.getItem("subscribeInfo");
    this.package = JSON.parse(this.packageId);

    const formData = new FormData();
    formData.append("c_id", this.user.id);
    formData.append("coupon_code", this.RedeemForm.value.redeem);
    formData.append("device", "web");
    formData.append("package_id", this.package.s_id);
    formData.append("country_code", this.country_code);
    formData.append("package_mode", "OTT");
    if (this.RedeemForm.valid) {
      this._DS.redeemCoupon(formData).subscribe((res: any) => {
        console.log(res)
        if (res.code == 1) {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.discloseCoupon = decryptData;
          console.log(this.discloseCoupon);
          const eventParams = {
            plan_name: this.package.packageName,
            coupon_code: this.RedeemForm.value.redeem,
            coupon_value: this.discloseCoupon.value,
          };
          this.analyticsService.logEvent('apply_coupon', eventParams);
          if (decryptData.code == 1) {

            // this.couponHide==true

            // console.log(this.discloseCoupon.code);
            setTimeout(() => {
              this._DS.getUserSubscriptionDetails(this.loginId.id).subscribe(res => {
                this.DEC_SER.getDecryptedData(res.result);
                this.coupunSubscriber = JSON.parse(this.DEC_SER.decryptData);

                console.log(JSON.parse(this.DEC_SER.decryptData));
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
            console.log(res.result);
            this.showDiscountMsg = true;
            this.tickIcon = true;
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.discountedCouponCode = decryptData;
            console.log(this.discountedCouponCode);
            this.showCodeLine = true;
            this.dd = Number(this.subscriptionPrice.price.slice(1));
            let a = this.discountedCouponCode.value;
            console.log(a);

            let b = Number(this.subscriptionPrice.price.slice(1));
            this.firstValue = b;
            let c = b - a;
            this.tot = c;
            // this.tot = this.subscriptionPrice.currency + c;
            console.log(c);

            // this.subs()
            this.showDiscount = false;

            const subscribeInfo = {
              currency: this.subscriptionPrice.currency,
              s_id: this.subscriptionPrice.s_id,
              package_mode: this.subscriptionPrice.package_mode,
              price: this.tot,
              month: this.subscriptionPrice.month,
            };
            localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
          }
          else if (this.discloseCoupon.code == 3) {

            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.discountedCouponCode = decryptData;
            console.log(this.discountedCouponCode);
            console.log(this.subscriptionMonth)
            const dialogRef = this.dialog.open(SwitchCouponComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'adultAgePopup',
              width: "469px",
              data: { redeem: this.RedeemForm.value.redeem, package_id: this.discountedCouponCode.data },
            });
            const sub = dialogRef.componentInstance.sendToFirstTab.subscribe((verify: any) => {
              console.log(verify)
              this.couponHide = true
              this.code = false;
              this.showMsgError = false;
              console.log(res.result);
              this.showDiscountMsg = true;
              this.tickIcon = true;
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.discountedCouponCode = decryptData;
              console.log(this.discountedCouponCode);
              this.subscriptionMonth = this.discountedCouponCode.data.interval + ' ' + this.discountedCouponCode.data.period
              this.showCodeLine = true;
              this.dd = Number(this.discountedCouponCode.data.price);
              let a = verify;
              console.log(a);

              let b = Number(this.discountedCouponCode.data.price);
              this.firstValue = b;
              let c = b - a;
              this.tot = c
              // this.tot = this.subscriptionPrice.currency + c;
              console.log(c);

              // this.subs()
              this.showDiscount = false;

              const subscribeInfo = {
                currency: this.subscriptionPrice.currency,
                s_id: this.discountedCouponCode.data.package_id,
                package_mode: this.subscriptionPrice.package_mode,
                price: this.tot,
                month: this.discountedCouponCode.data.interval,
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
    const inputValue = this.RedeemForm.get('redeem')?.value;
    this.isInputNotEmpty = inputValue && inputValue.trim().length > 0;
    console.log(otp.length)
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
    this.showMsgError = false;

    const subscribeInfo = {
      currency: this.subscriptionPrice.currency,
      s_id: this.subscriptionPrice.s_id,
      package_mode: this.subscriptionPrice.package_mode,
      price: this.subscriptionPrice.price,
      month: this.subscriptionPrice.month,
    };
    localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
  }

  // openDirect($event: MatRadioChange) {
  //   if ($event.value == 1) {
  //     this.removeCode()
  //     this.oneTimeCreditSHow = false;
  //     this.autoRenewHIde = false;
  //     this.autoRenewMOdal = true;
  //     this.showMsgError = false;
  //     this.showDiscountMsg = false
  //     this.autoRenewForm.reset();
  //     this.RedeemForm.reset();
  //     this.show = false;
  //   } else {
  //     this.autoRenewForm.reset();
  //     this.autoRenewHIde = true;
  //     this.oneTimeCreditSHow = false;
  //   }
  // }










  gotoRazorpay(value: any) {

    console.log((window as any).pagesense)
    if (value == 1) {
      this.removeCode()
      this.RedeemForm.value.redeem = ''
    }
    this._DS.apipip().subscribe((res: any) => {
      localStorage.setItem("ipSaveData", JSON.stringify(res));
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
    if (Object.keys(userInfo).length >= 1 && JSON.parse(cardDetails).s_id != null) {
      formData.append("c_id", JSON.parse(userInfo).id);
      formData.append(
        "cart",
        `{"items":[{"id":${JSON.parse(cardDetails).s_id},"package_mode":"${JSON.parse(cardDetails).package_mode
        }"}]}`
      );

      formData.append("paymentgateway", "razorpay");
      formData.append("region_type", "1");
      formData.append("coupon_code", this.RedeemForm.value.redeem);
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
      //  this.sendValueToPayment.emit(3);
      this.checkout.createOrder(formData).subscribe(
        (data: any) => {
          if (data.code == 1) {
            this.DEC_SER.getDecryptedData(data.result);
            localStorage.setItem("checkoutData", this.DEC_SER.decryptData);
            let checkoutData = JSON.parse(this.DEC_SER.decryptData);
            this.sessionId = checkoutData;
            console.log(this.sessionId);
            console.log(this.sessionId.rzrpy_trans_id);
            this.packagePrice = sessionStorage.getItem("subscribePack");
            console.log(this.packagePrice);

            const eventParams = {
              plan_name: JSON.parse(this.packagePrice).packageName,
              plan_type: JSON.parse(this.packagePrice).package_mode,
              transaction_id: this.sessionId.rzrpy_trans_id,
              currency: this.sessionId.currency,
              value: this.sessionId.sub_total,
            };
            this.analyticsService.logEvent('purchase_start', eventParams);


            this.goToRazorpay(checkoutData)

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
  goToRazorpay(checkoutdata: any) {
    console.log(checkoutdata);

    console.log(this.packagePrice);
    this.packageId = localStorage.getItem("subscribeInfo");
    this.package = JSON.parse(this.packageId);


    const userData: any = localStorage.getItem('taploginInfo') || {};
    const userInfo = JSON.parse(userData)
    let dialogOpened = false;
    this.options = {
      // rzp_test_U85lR3pxmQxgtq  test key
      // rzp_live_gtG7Du44HJPsx6  live key
      'key': 'rzp_live_TfBIlXkcoo7dbK', // Enter the Key ID generated from the Dashboard
      'amount': this.sessionId.total, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      'currency': this.currencySymbol,
      'name': JSON.parse(this.packagePrice).packageName,
      'description': this.sessionId.id,
      // 'image': 'assets/book.png',
      'order_id': checkoutdata.gateway_ref_id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      'handler': (response: any) => {

        this.verifyPay = response;
        console.log(this.verifyPay);
        this.makeRazorpayPayment(response);
        this.onSuccess(response)
      },
      'prefill': {
        'name': userInfo.firstName + ' ' + userInfo.last_name,
        'email': userInfo.email,
        "contact": userInfo.contact_no
      },
      'customer': {
        contact: userInfo.contact_no || '9999999999',
        email: userInfo.email
      },
      'notes': {

        'TransactionId': this.sessionId.rzrpy_trans_id,
        // 'Contact_email':userInfo.email,
        // "Contact_phone": userInfo.contact_no,
        'Plan_name': this.package.packageName,
        'Plan_value': this.package.price,
        'Discount_coupon_code': this.RedeemForm.value.redeem || 'NA',
        'Discount_value': this.packagePrice.total,
        'Platform': 'Web'

      },
      'theme': {
        'color': '#3399cc'
      },

      modal: {

        ondismiss: () => {

          Swal.fire({
            position: "center",
            icon: "error",
            // title: " Your payment has been cancelled. Try again or complete the payment later. ",
            title:  this.translate.instant('cancelled_payment'),
              confirmButtonText: this.translate.instant('ok'),

            timer: 999999999
          });

          const now = new Date();
          const currentTime = now.toLocaleTimeString();

          (window as any).pagesense = (window as any).pagesense || [];
          (window as any).pagesense.push(['trackEvent', 'purchase_cancel']);
          const eventParams = {
            plan_name: JSON.parse(this.packagePrice).packageName,
            transaction_id: this.sessionId.rzrpy_trans_id,
            cancel_reason: 'Payment cancelled by user',
            cancel_time: currentTime,
          };
          this.analyticsService.logEvent('purchase_cancel', eventParams);

        },
      },
    };
    const rzp1 = new Razorpay(this.options);
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
      this.analyticsService.logEvent('purchase_cancel', eventParams);
    });
  }

  onSuccess(response: any) {
    setTimeout(() => {
      this.zone.run(() => {
        this.openTab1.emit(3);
      });
      this.openTab1.emit(3);
      this.cdr.detectChanges();
      (window as any).pagesense = (window as any).pagesense || [];
      (window as any).pagesense.push(['trackEvent', 'purchase']);
      console.log(JSON.parse(this.packagePrice).packageName);
      const eventParams = {
        plan_name: JSON.parse(this.packagePrice).packageName,
        transaction_id: this.sessionId.rzrpy_trans_id,
        currency: this.sessionId.currency,
        value: this.sessionId.sub_total,
      };
      this.analyticsService.logEvent('purchase', eventParams);
    }, 2000);
  }


  stateNamesend: any;
  stateNameSelect(stateName: any) {
    console.log(stateName);

    if (stateName != '') {
      this.stateNamesend = stateName;
    }
  }
  onSearch(item: any) {
    console.log('search called' + item.term);
  }

  testSearch(term: any, item: any) {
    console.log(item);
    console.log(term);
    return item.name.startsWith(term);
  }
  stateSelected(state: any) {
    console.log(state);
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
      this.DEC_SER.getDecryptedData(res.result);

      if (res.code == 1) {
        console.log(res.result)

        this.removeCode()
        // this.openTab1.emit(3)
        // this.sendValueToNetbankingpayment.emit(3);
        this.uid = localStorage.getItem("taploginInfo");
        // this.Uid=this.uid.id
        this.Uid = JSON.parse(this.uid).id;
        this.uid;
        this._DS.getUserSubscriptionDetails(this.Uid).subscribe((res) => {
          this.DEC_SER.getDecryptedData(res.result);
          const data: any = JSON.parse(this.DEC_SER.decryptData);
          console.log(data);
          if (data.is_subscriber == 1) {


            localStorage.setItem("is_subscriber", "1");
            this.ed.isSubscribe.next(true);
            this.openTab1.emit(3)
            // this.leadSquare()
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
  leadSquare() {
    const subs: any = localStorage.getItem('ott_subscriptionPlan')
    console.log("hi");

    console.log(JSON.parse(subs).packages_list[0].title);

    // const formData = new FormData();
    // formData.append("EmailAddress", this.loginId.email);
    // formData.append("FirstName",this.loginId.first_name);
    // formData.append("LastName",this.loginId.last_name);
    // formData.append("Phone",this.loginId.contact_no);
    // formData.append("mx_App_Subscriptions_Plan",`${JSON.parse(subs).packages_list[0].period_interval}+${JSON.parse(subs).packages_list[0].period} plan`);
    // formData.append("mx_App_Subcription_Date",JSON.parse(subs).packages_list[0].start_date );
    // formData.append("mx_App_User_Source","Web");
    // formData.append("mx_APP_Plan_Expiry_Date",JSON.parse(subs).packages_list[0].end_date);
    const requestData = [
      {
        "Attribute": "EmailAddress",
        "Value": this.loginId.email
      },
      {
        "Attribute": "FirstName",
        "Value": this.loginId.first_name
      },
      {
        "Attribute": "LastName",
        "Value": this.loginId.last_name
      },
      {
        "Attribute": "Phone",
        "Value": this.loginId.contact_no
      }, {
        "Attribute": "mx_App_Subscriptions_Plan",
        "Value": JSON.parse(subs).packages_list[0].title + ' ' + 'plan'
      }, {
        "Attribute": "mx_App_Subcription_Date",
        "Value": JSON.parse(subs).packages_list[0].subscription_start
      }, {
        "Attribute": "mx_App_User_Source",
        "Value": "Web"

      }, {
        "Attribute": "mx_APP_Plan_Expiry_Date",
        "Value": JSON.parse(subs).packages_list[0].subscription_end
      }
    ]
    this._DS.leadSquare(requestData).subscribe((res: any) => {


    })
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