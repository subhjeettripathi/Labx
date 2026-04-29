import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataService } from './data.service';
import { DecryptService } from './decrypt.service';
import { HomeCategoryUtilsService } from './home-category-utils.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
var baseUrl2 = environment.baseUrl2;
@Injectable({
  providedIn: 'root'
})


export class PaymentCheckoutService {
  mainData: any
  constructor(private _ar: ActivatedRoute, private http: HttpClient, private dep_ser: DecryptService, public router: Router, private homeservice: HomeCategoryUtilsService, private ds: DataService) {
    this.jsonDevData().subscribe((res: any) => {
      this.mainData = res.result;
      
      
    });
  }
  jsonDevData() {
    return this.http.get(`${baseUrl2}`);
  }


  createOrder(createOrder: any): Observable<any> {
    // const url =`https://api-altb.multitvsolution.com:9017/aol_subs/v10/subscription/onetime_create_order/device/web`;
    const url = this.mainData.subs_create_order_onetime + "/device/web";
    return this.http.post(url, createOrder);
  }
  createPAYtmOrder(createOrder: any): Observable<any> {

    // const url =`${this.baseUrl}/payment`;
    const url = this.mainData.createorder;
    return this.http.post(url, createOrder);
  }

  paytmOtpValidation(paytmOtp: any): Observable<any> {
    const url = this.mainData.paytm_otp_verify_recurring;
    return this.http.post(url, paytmOtp);
  }


  createPayUOrder(createOrder: any): Observable<any> {

    const url = this.mainData.createorder;
    return this.http.post(url, createOrder);
  }
  // httpHeader = { headers: new HttpHeaders({

  //   'Content-Type':'multipart/form-data',
  //   'access-control-allow-origin': 'https://api-playground.payu.in'

  // })};
  // createPayUOrder2(createOrder:any):Observable<any>{

  //   const url = "https://test.payu.in/_payment";
  //   return this.http.post(url,createOrder,this.httpHeader);
  // }
  paypalVerifyPayment(data: any) {
    const url = this.mainData.paypal_complete_order;
    return this.http.post(url, data);

  }


  makeRazorPayPayment(paying: any): Observable<any> {
    const url = this.mainData.subs_complete_order_onetime + "/device/web";
    return this.http.post<any>(url, paying)
  }
  makeRazorPayRecuuringPayment(paying: any): Observable<any> {
    const url = this.mainData.subs_complete_order_autorenewl + "/device/web";
    return this.http.post<any>(url, paying)
  }

  SubscriptionRazorPayPayment(paying: any): Observable<any> {
    const url = this.mainData.subs_create_order_autorenewl + "/device/web";
    return this.http.post<any>(url, paying)
  }
  httpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'text/html;charset=ISO-8859-1',
      'Access-Control-Allow-Origin': '*',
      'Accept': '*/*',
    })
  };
  // Mobikwik payment get api 
  getMobikwikPayment(mid: any, orderid: any, redirecturl: any, checksum: any, amount: any) {
    return this.http.get(this.mainData.mobikwik + `=${mid}&orderid=${orderid}&redirecturl=${redirecturl}&checksum=${checksum}&amount=${amount}`, this.httpHeaders);
  }
  lazypayOtpValidation(data: any): Observable<any> {
    // return this.http.post(`https://tp-staging.multitvsolution.com/lazypay/pay`, data);
    //  return this.http.post(`https://tp.multitvsolution.com/lazypay/pay`, data);
    const url = this.mainData.lazypay_payment;
    return this.http.post(url, data);
  }
  lazypayResendOtp(data: any): Observable<any> {
    // return this.http.post(`https://tp-staging.multitvsolution.com/lazypay/otpresend`, data);
    //  return this.http.post(`https://tp.multitvsolution.com/lazypay/otpresend`, data);
    const url = this.mainData.lazypay_otp_resend;
    return this.http.post(url, data);

  }
}
