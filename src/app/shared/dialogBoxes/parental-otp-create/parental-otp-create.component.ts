import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DeleteAccountPopupComponent } from '../delete-account-popup/delete-account-popup.component';
import Swal from 'sweetalert2';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { Router } from '@angular/router';
import { RentalService } from 'src/app/services/rental.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { PaymentCheckoutService } from 'src/app/services/payment-checkout.service';
import { ParentalPinCreatedSuccesComponent } from '../parental-pin-created-succes/parental-pin-created-succes.component';
import { LoaderService } from '../../loader.service';
declare var Razorpay: any;
import { Location } from "@angular/common";
import { AnalyticsService } from 'src/app/services/analytics.service';
import { TranslationService } from 'src/app/services/translation.service';
const urlRazorpay = 'https://checkout.razorpay.com/v1/checkout.js';
@Component({
  selector: 'app-parental-otp-create',
  templateUrl: './parental-otp-create.component.html',
  styleUrls: ['./parental-otp-create.component.scss']
})
export class ParentalOtpCreateComponent implements OnInit {
  loadAPI!: Promise<any>;
  // key = "rzp_live_3WhaZfJwk0bfCR";
  searchText: any
  states: any = [];
  currencySymbol: any
  // countryAll=country
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
  isInputNotEmpty: boolean = false; // For tracking input status
  upiForm!: FormGroup;
  autoRenewForm!: FormGroup;
  user: any;
  userId: any;
  package: any;
  // subs: any = Subscription;
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
  visitorId: any
  discloseCoupon: any
  coupunSubscriber: any;
  firstValue: any;
  stateNamesend: any;
  subscribeInfo1: any
  constructor(private translate: TranslationService, public dialogRef: MatDialogRef<ParentalOtpCreateComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    private rs: RentalService, private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private analyticsService: AnalyticsService,
    private auth: AuthService, private ds: DataService, private ed: ExchangeDataService,
    private router: Router, private fcs: FunctionCallingService, private _fb: FormBuilder, private _DS: DataService,
    private DEC_SER: DecryptService, private checkout: PaymentCheckoutService, private loaderService: LoaderService, private location: Location) { }


  ngOnInit(): void {
    this.subscribeInfo1 = this.data.rent;
    console.log(this.subscribeInfo1);
    this._DS.apipip().subscribe((res: any) => {
      localStorage.setItem("ipSaveData", JSON.stringify(res));
    });
    let ip: any = localStorage.getItem("ipSaveData");
    this.packagePrice = sessionStorage.getItem("subscribePack");
    this.subscription = JSON.parse(this.packagePrice);
    this.ipAddress = JSON.parse(ip).countryName;
    this.country_code = JSON.parse(ip).countryCode;
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.RedeemForm = this._fb.group({
      redeem: ["", Validators.required],
    });
    this.loadScript();
  }
  loadScript() {

    let nodeRazorpay = document.createElement('script');
    nodeRazorpay.src = urlRazorpay;
    nodeRazorpay.type = 'text/javascript';
    nodeRazorpay.async = true;
    document.getElementsByTagName('head')[0].appendChild(nodeRazorpay);

  }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }

  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: msg
    })
  }
  subscribe() {
    this.router.navigateByUrl('/subscribe')
    this.dialogRef.close()
  }
  rental() {
    // this.rs.pushHomeCategoryData('ss')
    this.router.navigateByUrl('/subscribe')
    this.fcs.isRental.next(true)
    this.dialogRef.close()
  }

  onOtpChange(otp: any) {
    const inputValue = this.RedeemForm.get('redeem')?.value;
    this.isInputNotEmpty = inputValue && inputValue.trim().length > 0;

    if (otp.length != 0) {
      this.showMsgError = false;

    }
  }



  redeemSubmit() {
    this._DS.apipip().subscribe((res: any) => {
      localStorage.setItem("ipSaveData", JSON.stringify(res));
    });
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    // this.packageId = localStorage.getItem("subscribeInfo");
    // this.package = JSON.parse(this.packageId);

    const formData = new FormData();
    formData.append("c_id", this.user.id);
    formData.append("coupon_code", this.RedeemForm.value.redeem);
    formData.append("device", "web");
    formData.append("package_id", this.subscribeInfo1.package_id); formData.append("country_code", this.country_code);
    formData.append("package_mode", "Prime");
    if (this.RedeemForm.valid) {
      this._DS.redeemCoupon(formData).subscribe((res: any) => {
        console.log(res)
        if (res.code == 1) {

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.discloseCoupon = decryptData;
          console.log(this.discloseCoupon);
          const eventParams = {
            plan_name: this.subscribeInfo1.package_name,
            coupon_code: this.RedeemForm.value.redeem,
            coupon_value: this.discloseCoupon.value,
          };
          this.analyticsService.logEvent('apply_coupon', eventParams);
          if (decryptData.code == 1) {

            // this.couponHide==true
            // 
            // console.log(this.discloseCoupon.code);

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
            // this.dd = Number(this.subscriptionPrice.price.slice(1));
            let a = this.discountedCouponCode.value;
            console.log(a);

            // let b = Number(this.subscriptionPrice.price.slice(1));
            // this.firstValue=b;
            // let c = b - a;
            // this.tot =  c;
            // this.tot = this.subscriptionPrice.currency + c;


            // this.subs()
            this.showDiscount = false;

            const subscribeInfo = {
              currency: this.subscriptionPrice.currency,
              s_id: this.subscriptionPrice.package_id,
              package_mode: this.subscriptionPrice.package_mode,
              price: this.tot,
              month: this.subscriptionPrice.month,
            };
            // localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
          }
          // else if (this.discloseCoupon.code == 3) {

          //   this.DEC_SER.getDecryptedData(res?.result);
          //   let decryptData = JSON.parse(this.DEC_SER.decryptData);
          //   this.discountedCouponCode = decryptData;
          //   console.log(this.discountedCouponCode);
          //   console.log(this.subscriptionMonth)
          //   const dialogRef = this.dialog.open(SwitchCouponComponent, {
          //     backdropClass: 'popupBackdropClass',
          //     panelClass: 'adultAgePopup',
          //     width: "469px",
          //     data: { redeem: this.RedeemForm.value.redeem, package_id: this.discountedCouponCode.data },
          //   });
          //   const sub = dialogRef.componentInstance.sendToFirstTab.subscribe((verify: any) => {
          //     this.couponHide=true
          //     this.code = false;
          //     this.showMsgError = false;
          //     console.log(res.result);
          //     this.showDiscountMsg = true;
          //     this.tickIcon = true;
          //     this.DEC_SER.getDecryptedData(res?.result);
          //     let decryptData = JSON.parse(this.DEC_SER.decryptData);
          //     this.discountedCouponCode = decryptData;
          //     console.log(this.discountedCouponCode);
          //     this.subscriptionMonth = this.discountedCouponCode.data.interval + ' ' + this.discountedCouponCode.data.period
          //     this.showCodeLine = true;
          //     this.dd = Number(this.discountedCouponCode.data.price);
          //     let a = verify;
          //     console.log(a);

          //     let b = Number(this.discountedCouponCode.data.price);
          //     this.firstValue=b;
          //     let c = b - a;
          //     this.tot=c
          //     // this.tot = this.subscriptionPrice.currency + c;
          //     console.log(c);

          //     // this.subs()
          //     this.showDiscount = false;

          //     const subscribeInfo = {
          //       currency: this.subscriptionPrice.currency,
          //       s_id: this.subscriptionPrice.s_id,
          //       package_mode: this.subscriptionPrice.package_mode,
          //       price: this.tot,
          //       month: this.subscriptionPrice.month,
          //     };
          //     localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
          //   })
          // }
        } else {
          this.stopIcon = true;
          this.showMsgError = true;
        }
      });
    } else {
      // this.showMsgError = true;
    }
  }
  removeCode() {

    this.RedeemForm.reset();
    this.code = true;
    this.couponHide = false;
    this.showCodeLine = false;
    this.showDiscount = true;
    this.showDiscountMsg = false;
    this.showMsgError = false
    // const subscribeInfo = {
    //   currency: this.subscriptionPrice.currency,
    //   s_id: this.subscriptionPrice.s_id,
    //   package_mode: this.subscriptionPrice.package_mode,
    //   price: this.subscriptionPrice.price,
    //   month: this.subscriptionPrice.month,
    // };
    // localStorage.setItem("subscribeInfo", JSON.stringify(subscribeInfo));
  }
  gotoRazorpay(value: any) {
    if (value == 1) {
      this.removeCode()
      this.RedeemForm.value.redeem = ''
    }
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
    if (Object.keys(userInfo).length >= 1 && this.subscribeInfo1.package_id != null) {
      formData.append("c_id", JSON.parse(userInfo).id);
      formData.append(
        "cart",
        `{"items":[{"id":${this.subscribeInfo1.package_id},"package_mode":"${this.subscribeInfo1.package_mode
        }"}]}`
      );

      formData.append("paymentgateway", "razorpay");
      formData.append("region_type", "1");
      formData.append("coupon_code", this.RedeemForm.value.redeem);
      formData.append("user_role", "1");
      formData.append("device", "web");
      formData.append("country_code", JSON.parse(ip).countryCode);
      if (!JSON.parse(userInfo).state) {
        formData.append("state", JSON.parse(ip).regionName);
      } else {
        formData.append("state", JSON.parse(userInfo).state);
      }
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
            console.log(this.subscribeInfo1);

            const eventParams = {
              plan_name: this.subscribeInfo1?.package_name,
              plan_type: this.subscribeInfo1?.package_mode,
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
    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    this.packageId = localStorage.getItem("subscribeInfo");
    this.package = JSON.parse(this.packageId);

    console.log(this.package);
    console.log(this.packagePrice);


    this.options = {
      'key': 'rzp_live_TfBIlXkcoo7dbK',
      'amount': this.sessionId.total,
      'currency': this.currencySymbol,
      'name': 'THE ART OF LIVING',
      'description': this.sessionId.id,
      'order_id': checkoutdata.gateway_ref_id,
      'handler': (response: any) => {
        this.loaderService.show()
        this.verifyPay = response;
        console.log(this.verifyPay);
        this.makeRazorpayPayment(response);
        this.onSuccess(response)
      },
      'prefill': {
        'name': userInfo.firstName + ' ' + userInfo.last_name,
        'email': userInfo.email,
        "contact": userInfo.contact || '999999999'

      },
      'notes': {
        'TransactionId': this.sessionId.rzrpy_trans_id,
        // 'Contact_email':userInfo.email,
        // "Contact_phone": userInfo.contact_no,
        'Plan_name': 'Prime',
        'Plan_value': this.subscribeInfo1.price,
        'Discount_coupon_code': this.RedeemForm.value.redeem || 'NA',
        'Discount_value': this.sessionId.sub_total,
        'Platform': 'Web'
      },
      'customer': {
        'contact': userInfo.contact_no,
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
            timer: 999999999
          });

          const now = new Date();
          const currentTime = now.toLocaleTimeString();


          (window as any).pagesense = (window as any).pagesense || [];
          (window as any).pagesense.push(['trackEvent', 'purchase_cancel']);
          const eventParams = {
            plan_name: this.subscribeInfo1.package_name,
            transaction_id: this.sessionId.rzrpy_trans_id,
            cancel_reason: 'Payment cancelled by user',
            cancel_time: currentTime,
          };
          this.analyticsService.logEvent('purchase_cancel', eventParams);

        },
      },
    };



    var rzp1 = new Razorpay(this.options);

    // document.getElementById('rzp-button1').onclick = function(e){
    rzp1.open();
    // rzp1.on("payment.success", (resp: any) => {


    //   this.makeRazorpayPayment(resp);

    // });
    rzp1.on("payment.error", (resp: any) => {
      console.log(resp);
      this.location.back()

      this.paymentErrorMessage = resp.error.description
      // this.paymentErrorMsg();

    });
    rzp1.on('payment.failed', (response: any) => {
      console.error('Payment Failed:', response);
      const now = new Date();
      const currentTime = now.toLocaleTimeString();
      const eventParams = {
        plan_name: this.subscribeInfo1.package_name,
        transaction_id: this.sessionId.rzrpy_trans_id,
        cancel_reason: 'Payment failed',
        cancel_time: currentTime,
      };
      this.analyticsService.logEvent('purchase_cancel', eventParams);

    });

  }
  onSuccess(response: any) {
    setTimeout(() => {

      (window as any).pagesense = (window as any).pagesense || [];
      (window as any).pagesense.push(['trackEvent', 'purchase']);
      this.dialogRef.close()

      const eventParams = {
        plan_name: this.subscribeInfo1.package_name,
        transaction_id: this.sessionId.rzrpy_trans_id,
        currency: this.sessionId.currency,
        value: this.sessionId.sub_total,
      };
console.log(eventParams);

      this.analyticsService.logEvent('purchase', eventParams);

    }, 2000);
  }
  makeRazorpayPayment(data: any) {
    // console.log("1")
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
        this.cdr.detectChanges();
        this.dialogRef.close()

        // this.dialogRef.close()
        const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
          panelClass: "contactfooter",
          width: "390px",
        });
   
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

            // this.openTab1.emit(3)
            // localStorage.setItem("is_prime", "1");
          }
        });
      }
    });
  }
}
