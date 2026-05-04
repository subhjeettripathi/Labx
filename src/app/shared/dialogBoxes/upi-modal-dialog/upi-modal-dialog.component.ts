import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PaymentCheckoutService } from "src/app/services/payment-checkout.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { PaymentErrorDialogComponent } from "../payment-error-dialog/payment-error-dialog.component";
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
import Swal from "sweetalert2";
declare var $: any;
declare var Razorpay: any;
@Component({
  selector: "app-upi-modal-dialog",
  templateUrl: "./upi-modal-dialog.component.html",
  styleUrls: ["./upi-modal-dialog.component.scss"],
})
export class UpiModalDialogComponent implements OnInit {
  upiForm!: FormGroup;
  razorPayKey: any;
  sessionId: any;
  uid: any;
  Uid: any;
  contact: any;
  email: any;
  targetId: any;
  reedmeForm: any;
  stateNamesend: any;
  errorMsg:any;
  country_code:any;
  USER_ACCOUNT_id:any
  userDetails:any;
  userInfo:any
  ipAddress:any;
  currency:any;
  app_version:any;
  content_id_Created:any;
  @Output() sendValueToPayment = new EventEmitter<any>();
  constructor(
    public dialogRef: MatDialogRef<UpiModalDialogComponent>,
    public dialog: MatDialog,
    private router: Router,
    private ed: ExchangeDataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private checkout: PaymentCheckoutService,
    private DEC_SER: DecryptService,
    private _DS: DataService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }
     });
    this.targetId = this.data.name;
    this.reedmeForm = this.data.reedmeForm;
    // if( this.reedmeForm==null){
    //   this.reedmeForm="";
    // }
    
    this.stateNamesend = this.data.state;
  

    this.upiForm = this._fb.group({
      upiInput: ["", Validators.required],
    });
    this.content_id_Created=localStorage.getItem('CreatOrderC_id')
    this.app_version= localStorage.getItem('appVersion')
    // this.getJson()
  }
  onNoClick() {
    this.upiForm.reset;
    this.dialogRef.close();
  }
  // getJson() {
  //   this._DS.faqData().subscribe((data: any) => {

  //      this.razorPayKey = data.ThirdParty[0].Razorpay.SECRET_KEY;



  //   })
  // }

  upiFormSubmit() {
    if (this.upiForm.valid) {
      let userInfo: any = localStorage.getItem("taploginInfo") || {};

      let cardDetails: any = localStorage.getItem("subscribeInfo") || {};
      let ip: any = localStorage.getItem("ipSaveData");
      this.country_code = JSON.parse(ip).countryCode;
      const formData = new FormData();
      if (Object.keys(userInfo).length >= 1) {
        formData.append("c_id", JSON.parse(userInfo).id);
        formData.append(
          "cart",
          `{"items":[{"id":${JSON.parse(cardDetails).s_id},"package_mode":"${
            JSON.parse(cardDetails).package_mode
          }"}]}`
        );
        formData.append("paymentgateway", "razorpay");
        formData.append("country_code", this.country_code);
        formData.append("region_type", "1");
        formData.append("coupon_code",this.reedmeForm);
        formData.append("user_role", "1");
        formData.append("device", "web");
        formData.append('content_id',this.content_id_Created || '')
        if (this.stateNamesend) {
          formData.append("state", this.stateNamesend);
        } else {
          formData.append("state", JSON.parse(userInfo).state);
        }
        formData.append("country", JSON.parse(userInfo).country);
        let location = {
          loc_country: JSON.parse(ip).countryName,
          city: JSON.parse(ip).city,
          loc_state: JSON.parse(ip).regionName,
          ip: JSON.parse(ip).ip,
          lat: JSON.parse(ip).latitude,
          device_make:JSON.parse(ip).userAgent.platform +' '+JSON.parse(ip).userAgent.browser,
          long: JSON.parse(ip).longitude,
          pincode: JSON.parse(ip).postalCode,
          isp:JSON.parse(ip).connection.isp,
        };
        formData.append("location", JSON.stringify(location));
        this.checkout.createOrder(formData).subscribe(
          (data: any) => {
          if(data.code==1){
            this.DEC_SER.getDecryptedData(data.result);
            let checkoutData = JSON.parse(this.DEC_SER.decryptData);
            this.sessionId = checkoutData;
          

            // this.DEC_SER.getDecryptedData(data.razorpay);

            // let checkoutDataRazorPay = JSON.parse(this.DEC_SER.decryptData);
          

            this.razorPayKey = this.sessionId.razorpay_creds.SECRET_KEY;
           
            
            Object.assign(checkoutData, {
              currency: this.targetId?.currency,
              amount: this.targetId?.amount,
            });

            this.goToUPIRazorpay(this.upiForm.value.upiInput);
            this.loaderService.show();
          }else{
            this.loaderService.hide()
            this.errorMsg=data.error
            this.paymentErrorMsg()
          }

           
          },
          (err) => {
            this.loaderService.hide();
            this.errorMsg='Upi is not working!'
            this.paymentErrorMsg()
            // Swal.fire({
            //   icon: "error",
            //   title: "Oops...",
            //   text: "Something went wrong!",
            // });
          }
        );
      }
    }
  }
  goToUPIRazorpay(input: any) {
    
    var razorpay = new Razorpay({
      key: this.razorPayKey,
    });

  

    const userInfo: any = localStorage.getItem("taploginInfo") || {};
    this.contact = JSON.parse(userInfo).contact_no;
    const userInfoEmail: any = localStorage.getItem("taploginInfo") || {};
    this.email = JSON.parse(userInfoEmail).email;

    if (this.email == "") {
      this.email = "test@test65.com";
    } else {
      this.email;
    }
    if (this.contact == "") {
      this.contact = "9999999999";
    } else {
      this.contact;
    }
   
    var data = {
      amount: this.sessionId.total, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
      // currency: "INR",// Default is INR. We support more than 90 currencies.

      email: this.email,
      contact: this.contact,
      notes: {
        web_order_id: this.sessionId.rzrpy_trans_id,
        // web_order_id:JSON.parse(this.sessionId).id,
      },
      order_id: this.sessionId.gateway_ref_id, // Replace with Order ID generated in Step 4
      method: "upi",
      // method specific fields
      upi: {
        vpa: input,
        flow: "collect",
      },
    };
   
    $(document).ready(() => {
      $("#btn").trigger("click");
      razorpay.createPayment(data);
      razorpay.on("payment.success", (resp: any) => {
        this.makeRazorpayPayment(resp);
      }); // will pass payment ID, order ID, and Razorpay signature to success handler.

      razorpay.on("payment.error",  (resp: any) => {
        this.loaderService.hide()
       
        this.errorMsg=resp.error.description
        this.paymentErrorMsg()
      }); // will pass error object to error handler
    });
  }
 
  paymentErrorMsg() {
   
    
    this.dialogRef.close();
    document.body.style.overflow = "hidden";
    const dialogRef = this.dialog.open(PaymentErrorDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "adultAgePopup",
      width: "390px",
      data: {paytmDetails: this.errorMsg },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      document.body.style.overflow = "auto";
    });
    let ip: any = localStorage.getItem("ipSaveData");
    this.ipAddress = JSON.parse(ip).countryName;
    this.userDetails = localStorage.getItem('taploginInfo')
    this.userInfo=JSON.parse(this.userDetails);
    if(this.ipAddress=='India'){
      this.currency='INR'
   }else{
    this.currency='USD'
   }

  }

  makeRazorpayPayment(data: any) {
    let userInfo: any = localStorage.getItem("taploginInfo") || {};

    let ip: any = localStorage.getItem("ipSaveData");

    const formData = new FormData();
    formData.append("c_id", JSON.parse(userInfo).id);
    formData.append("subscription_id", this.sessionId.gateway_ref_id);
    formData.append("paymentgateway", "razorpay");
    formData.append("order_id", this.sessionId.id);

    formData.append("trans_id", data.razorpay_payment_id);
    formData.append("status", "1");
    formData.append("device", "web");
    formData.append("pg_ref_id", this.sessionId.rzrpy_trans_id);
    // if(this.stateDefault==this.stateName){
    //   formData.append("state",JSON.parse(ip).regionName);
    // }else{
    //   formData.append("state",this.stateName);
    // }

    formData.append("state", JSON.parse(ip).regionName);
    formData.append("country", JSON.parse(ip).countryName);

    let location = {
      loc_country: JSON.parse(ip).countryName,
      city: JSON.parse(ip).city,
      loc_state: JSON.parse(ip).regionName,
      ip: JSON.parse(ip).ip,
      device_make:JSON.parse(ip).userAgent.browser,
      lat: JSON.parse(ip).latitude,
      long: JSON.parse(ip).longitude,
      pincode: JSON.parse(ip).postalCode,
    };

    formData.append("location", JSON.stringify(location));

    this.checkout.makeRazorPayPayment(formData).subscribe((res: any) => {
      this.dialogRef.close();
      this.DEC_SER.getDecryptedData(res.result);
    
      if (res.code == 1) {
        this.loaderService.hide()
        this.sendValueToPayment.emit(4);
        // this.router.navigate(['/subscribe'], {queryParams:{'tab':'4'}});
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
      }else{
        this.errorMsg=res.error
        this.paymentErrorMsg()
      }
    });
  }

}
