import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PaymentErrorDialogComponent } from "../payment-error-dialog/payment-error-dialog.component";
import { PaymentCheckoutService } from "src/app/services/payment-checkout.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import Swal from "sweetalert2";
import { PaytmOtpmodalDialogComponent } from "../paytm-otpmodal-dialog/paytm-otpmodal-dialog.component";
declare var $: any;
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
var baseUrl2 = environment.baseUrl2;
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
@Component({
  selector: "app-paytm-model",
  templateUrl: "./paytm-model.component.html",
  styleUrls: ["./paytm-model.component.scss"],
})
export class PaytmModelComponent implements OnInit {
  paytmForm!: FormGroup;
  cuponCode: any;
  sessionId: any;
  stateNamesend: any;
  mainData: any;
  country_code:any;
  currentDataUserInfo:any;
  content_id_Created:any;
  app_version:any;
  @Output() sendValueToPayment = new EventEmitter<any>();
  USER_ACCOUNT_id:any
  constructor(
    public dialogRef: MatDialogRef<PaytmModelComponent>,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private http: HttpClient,
    private checkout: PaymentCheckoutService,
    private DEC_SER: DecryptService,
    private _DS: DataService,
    private loaderService: LoaderService,
  ) {
    this.jsonDevData().subscribe((res: any) => {
      this.mainData = res.result;
    });
  }

  ngOnInit(): void {
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }
     });
    this.stateNamesend = this.data.state;

    this.paytmForm = this._fb.group({
      paytmInput: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
    this.paytmFormSubmit();

    this.content_id_Created=localStorage.getItem('CreatOrderC_id')
    this.app_version= localStorage.getItem('appVersion')
  }
  jsonDevData() {
    return this.http.get(`${baseUrl2}`);
  }
  onNoClick() {
    this.paytmForm.reset;
    this.dialogRef.close();
  }

  paytmFormSubmit() {
    if (this.paytmForm.valid) {
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
        // formData.append('paymentgateway', (this.geoLocationCountry === 'IN') ? 'razorpay' : 'stripe');
        formData.append("paymentgateway", "paytm");
        formData.append("region_type", "0");
        formData.append("country_code", this.country_code);
        formData.append("user_role", "1");
        formData.append("device", "web");
        formData.append("return_url", this.mainData.paytm_verify_payment);
        formData.append("cancel_url", this.mainData.paytm_verify_payment);
        formData.append("is_recurring", "1");
        formData.append("mobile_number", this.paytmForm.value.paytmInput);
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
        this.checkout.createPAYtmOrder(formData).subscribe(
          (data: any) => {
            if(data.code==1){
              this.loaderService.hide();
              this.sessionId = data;
              this.OtpValidation();
              this.loaderService.hide();
              this.currentDataUserInfo={
               amount:data.amount,
               pg_name:data.pg_name
              } 
              localStorage.setItem('paymentDataUser',this.currentDataUserInfo)
            }else{
              this.loaderService.hide();
              this.paymentErrorMsg()
            }
         
          },
          (err) => {
            this.loaderService.hide();
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
  userDetails:any
  userInfo:any;
  paymentErrorMsg() {
    
    this.dialogRef.close();
    document.body.style.overflow = "hidden";
    const dialogRef = this.dialog.open(PaymentErrorDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "adultAgePopup",
      width: "390px",
      data: {paytmDetails:'Paytm is not working!' },
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      document.body.style.overflow = "auto";
    });
    this.userDetails = localStorage.getItem('taploginInfo')
    this.userInfo=JSON.parse(this.userDetails);

  }
  OtpValidation() {
    this.paytmForm.reset;
    this.dialogRef.close();
    document.body.style.overflow = "hidden";
    const dialogRef = this.dialog.open(PaytmOtpmodalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "paytm_otp_modal",
      width: "390px",
      data: { name: "paytm", paytmDetails: this.sessionId },
    });
    const sub = dialogRef.componentInstance.sendValueToPayment.subscribe(
      (data: any) => {}
    );
    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = "auto";
    });
  }
}
