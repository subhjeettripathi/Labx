import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PaymentCheckoutService } from "src/app/services/payment-checkout.service";
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import {LazypayDialogMobileVerifyComponent} from '../lazypay-dialog-mobile-verify/lazypay-dialog-mobile-verify.component'
import { eventNames } from 'process';
import { LoaderService } from "src/app/shared/loader.service";
@Component({
  selector: 'app-lazypay-dialog-mobile-otp',
  templateUrl: './lazypay-dialog-mobile-otp.component.html',
  styleUrls: ['./lazypay-dialog-mobile-otp.component.scss']
})
export class LazypayDialogMobileOtpComponent implements OnInit {
  upiForm!: FormGroup;
  razorPayKey:any;
  sessionId: any;
  uid:any;
  Uid:any;
  contact:any;
  email:any;
  targetId:any;
  reedmeForm:any;
  stateNamesend:any;
  errorMSg:boolean=false;
  country_code:any;
  @Output() lazyPayButton=new EventEmitter<any>()
  
  constructor(public dialogRef: MatDialogRef<LazypayDialogMobileOtpComponent>,public dialog: MatDialog,private router:Router,private ed:ExchangeDataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private checkout: PaymentCheckoutService, private loaderService: LoaderService,   private DEC_SER: DecryptService,private _DS: DataService) { }

  ngOnInit(): void {
    this.reedmeForm=this.data.reedmeForm
    this.stateNamesend=this.data.state
    this.upiForm = this._fb.group({
      upiInput: ["", Validators.required],
    });
  }
  onNoClick() {
    this.upiForm.reset
    this.dialogRef.close();
  }
  inputLength(event:any){
  if(event.target.value.length!=10){
    this.errorMSg=false;
 }
  }
  upiFormSubmit() {
 if (this.upiForm.valid) {
      let userInfo: any = localStorage.getItem("taploginInfo") || {};
     let cardDetails: any = localStorage.getItem("subscribeInfo") || {};
     let ip: any = localStorage.getItem("ipSaveData");
     this.country_code=JSON.parse(ip).countryCode;
     const formData = new FormData();
     if (Object.keys(userInfo).length >= 1) {
       formData.append("c_id", JSON.parse(userInfo).id);
       formData.append("cart", `{"items":[{"id":${JSON.parse(cardDetails).s_id},"package_mode":"${JSON.parse(cardDetails).package_mode}"}]}`);
 
       formData.append("paymentgateway", "lazypay");
       formData.append("region_type", "1");
       formData.append("country_code", this.country_code);
       formData.append("coupon_code",this.reedmeForm);
       formData.append("user_role", "1");
       formData.append("device", "web");
       formData.append("mobile_number",this.upiForm.value.upiInput);
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
        long: JSON.parse(ip).longitude,
        pincode: JSON.parse(ip).postalCode,
        isp:JSON.parse(ip).connection.isp,
      };
      formData.append("location", JSON.stringify(location));
       this.checkout.createPAYtmOrder(formData).subscribe(
         (data: any) => {
         if(data.code==1){
          this.loaderService.hide()
          this.OtpValidation(data)
         }else if(data.code==2){
          this.loaderService.hide()
          this.errorMSg=true;
         }else{
          this.loaderService.hide()
         }
        
         
           
           
         
          },
       
       );
     }
    
     
    }

  }

  OtpValidation(data:any){
    this.upiForm.reset
      this.dialogRef.close();
      document.body.style.overflow = "hidden";
    const dialogRef = this.dialog.open(LazypayDialogMobileVerifyComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'upiPopup',
      width: "390px",
      data: { name:data},
    });
    const sub = dialogRef.componentInstance.sendValueToLazypay.subscribe(
      (data: any) => {
        this.lazyPayButton.emit(data);
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = "auto";
    });
  
  
  }
}
