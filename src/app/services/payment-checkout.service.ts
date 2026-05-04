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
 this.mainData =
    {
      "result": {
        "abuse": "https://api.vivetv.in/ottapi/v1/comments/abuse/device",
        "activation_code": "https://api.vivetv.in/ottapi/v1/activation/code/generate",
        "add": "https://api.vivetv.in/ottapi/v1/user/add",
        "add_watchlist": "https://api.vivetv.in/ottapi/v1/content/addwatchlist",
        "addetail": "https://api.vivetv.in/ottapi/v1/ads/adDetail_enc",
        "advance_search": "https://api.vivetv.in/ottapi/v1/content/advance/search",
        "age_group": "https://api.vivetv.in/ottapi/v1/age_group/list",
        "analytics_mservice": "https://subs.vivetv.in/ott_mservice/v1/analyticapi/analytics-data",
        "autosuggest": "https://api.vivetv.in/ottapi/v1/content/autosuggest",
        "billing_history": "https://api.vivetv.in/ottapi/v1/billing/history",
        "cancel_subscription": "https://subs.vivetv.in/ott_subscription/v1/subscription/cancel_subscription",
        "catlist": "https://api.vivetv.in/ottapi/v1/content/catlist",
        "channel_detail": "https://api.vivetv.in/ottapi/v1/content/channel_detail",
        "channel_list": "https://api.vivetv.in/ottapi/v1/channel/list",
        "clear_continue_watching": "https://subs.vivetv.in/ott_mservice/v1/clear/continue/watching",
        "clear_watchlist": "https://api.vivetv.in/ottapi/v1/clear/watchlist",
        "comment_add": "https://api.vivetv.in/ottapi/v1/comments/add",
        "comment_list": "https://api.vivetv.in/ottapi/v1/comments/list",
        "consent": "https://api.vivetv.in/ottapi/v1/consent/add",
        "contact_us": "https://api.vivetv.in/ottapi/v1/contactus/send",
        "coupon_validate": "https://subs.vivetv.in/ott_subscription/v1/subscription/coupon_validate",
        "csession": "https://subs.vivetv.in/ott_mservice/v1/customer/session",
        "delete_account": "https://api.vivetv.in/ottapi/v1/delete/account/user",
        "detail": "https://api.vivetv.in/ottapi/v1/content/detail",
        "deviceinfo": "https://api.vivetv.in/ottapi/v1/user/deviceinfo",
        "dislike": "https://api.vivetv.in/ottapi/v1/content/dislike",
        "dob_complete_order": "https://subs.vivetv.in/ott_subscription/v1/subscription/DobCompletePayment",
        "drm": "https://api.vivetv.in/ottapi/v1/drm/keys",
        "edit": "https://api.vivetv.in/ottapi/v1/user/edit",
        "extra_list": "https://api.vivetv.in/ottapi/v1/content/assets",
        "favlist": "1|,https://api.vivetv.in/ottapi/v1/content/favlist",
        "favorite": "https://api.vivetv.in/ottapi/v1/content/favorite",
        "user_favorite_content": "https://api.vivetv.in/ottapi/v1/user/favorite/content",
        "user_content_data": "https://api.vivetv.in/ottapi/v1/user/content/data",
        "feedback": "https//api-aut.multitvsolution.com/automatorapi/v6/user/feedback",
        "forgot_link": "https://api.vivetv.in/ottapi/v1/user/forgot/link",
        "genre": "https://api.vivetv.in/ottapi/v1/content/getgenreLive",
        "genre_list": "https://api.vivetv.in/ottapi/v1/content/genre/list",
        "get_setting": "https://api.vivetv.in/ottapi/v1/get/settings",
        "home": "https://api.vivetv.in/ottapi/v1/content/home",
        "home_cat": "https://api.vivetv.in/ottapi/v1/content/home3",
        "home4": "https://api.vivetv.in/ottapi/v1/content/home4",
        "home5": "https://api.vivetv.in/ottapi/v1/content/home5",
        "continue_watching": "https://subs.vivetv.in/ott_mservice/v1/content/continue_watching",
        "lang_content": "https://subs.vivetv.in/ott_mservice/v1/content/LangContent",
        "ifallowed": "https://api.vivetv.in/ottapi/v1/content/ifallowed",
        "device_ifallowed": "https://api.vivetv.in/ottapi/v1/device/ifallowed",
        "isplaybackallowed": "https://api.vivetv.in/ottapi/v1/content/isPlayAllowed",
        "like": "https://api.vivetv.in/ottapi/v1/content/like",
        "list": "https://api.vivetv.in/ottapi/v1/content/list",
        "live": "https://api.vivetv.in/ottapi/v1/content/getLiveGenre",
        "login": "https://api.vivetv.in/ottapi/v1/user/login",
        "logout": "https://api.vivetv.in/ottapi/v1/auth/device/logout",
        "device_list": "https://api.vivetv.in/ottapi/v1/device/list",
        "login_phone": "https://api.vivetv.in/ottapi/v1/user/login/phone",
        "lookup": "https://api.vivetv.in/ottapi/v1/user/lookup",
        "menu": "https://api.vivetv.in/ottapi/v1/cms/links",
        "otp_generate": "https://api.vivetv.in/ottapi/v1/user/OTP_generate",
        "otp_mail_verify": "https://api.vivetv.in/ottapi/v1/send/otp",
        "pages": "https://console.multitvsolution.com/cms/page?",
        "parental_add": "https://api.vivetv.in/ottapi/v1/parental/create/pin",
        "parental_change": "https://api.vivetv.in/ottapi/v1/parental/pin/change",
        "parental_forgot": "https://api.vivetv.in/ottapi/v1/parental/forget/otp/send",
        "parental_level": "https://api.vivetv.in/ottapi/v1/parental/restriction/level",
        "parental_reset_pin": "https://api.vivetv.in/ottapi/v1/parental/forget/pin",
        "parental_validate": "https://api.vivetv.in/ottapi/v1/parental/auth",
        "playlist": "https://api.vivetv.in/ottapi/v1/content/playlist",
        "popular_add": "https://api.vivetv.in/ottapi/v1/popular/content/add",
        "popular_search": "https://api.vivetv.in/ottapi/v1/content/popularsearch",
        "privacy_policy": "http://creator.multitvsolution.com/privacy.html",
        "push_content": "https://api.altt.studio/automatorapi/v5/content/content_detail",
        "rating": "https://api.vivetv.in/ottapi/v1/content/rating",
        "recent_search": "https://api.vivetv.in/ottapi/v1/content/recentsearch",
        "recomended": "https://api.vivetv.in/ottapi/v1/content/recomended",
        "renew_download": "https://api.vivetv.in/ottapi/v1/check/download/expiry",
        "reset_password": "https://api.vivetv.in/ottapi/v1/user/resetpassword",
        "reset_password_link": "https://api.vivetv.in/ottapi/v1/user/resetpassword/link",
        "search": "https://api.vivetv.in/ottapi/v1/content/list",
        "setting": "https://api.vivetv.in/ottapi/v1/settings",
        "social": "https://api.vivetv.in/ottapi/v1/user/social",
        "subs_cancel_subscription": "https://subs.vivetv.in/ott_subscription/v1/subscription/cancel_subscription",
        "subs_cancel_request": "https://subs.vivetv.in/ott_subscription/v1/cancel/user/subscription/request",
        "subs_complete_gift_order": "https://subs.vivetv.in/ott_subscription/v1/subscription/complete_gift_subscription",
        "subs_complete_order_autorenewl": "https://subs.vivetv.in/ott_subscription/v1/subscription/complete_order",
        "subs_complete_order_onetime": "https://subs.vivetv.in/ott_subscription/v1/subscription/onetime_complete_order",
        "subs_create_gift_order": "https://subs.vivetv.in/ott_subscription/v1/subscription/create_gift_subscription",
        "subs_create_order_autorenewl": "https://subs.vivetv.in/ott_subscription/v1/subscription/create_order",
        "subs_create_order_onetime": "https://subs.vivetv.in/ott_subscription/v1/subscription/onetime_create_order",
        "subs_free_subscription": "https://subs.vivetv.in/ott_subscription/v1/subscription/free_subscription",
        "subs_package_list": "https://subs.vivetv.in/ott_subscription/v1/spackage/subscription/device",
        "subs_package_list_test": "https://subs.vivetv.in/ott_subscription/v1/spackage/test/subscription/device",
        "subs_paytm_checksum": "https://console.multitvsolution.com/paytm/veqta_paytm/generateChecksum.php?",
        "subs_paytm_verifychecksum": "https://console.multitvsolution.com/paytm/veqta_paytm/verifyChecksum.php",
        "subs_redeem_coupon": "https://subs.vivetv.in/ott_subscription/v1/subscription/redeem_coupon",
        "subs_redeem_refferal": "https://subs.vivetv.in/ott_subscription/v1/subscription/redeem_refferal",
        "subs_user_subscriptions": "https://subs.vivetv.in/ott_subscription/v1/spackage/user_packages",
        "subscribe": "https://api.vivetv.in/ottapi/v1/channel/chsubscribe",
        "stream_url": "https://api.vivetv.in/ottapi/v1/get/stream/project_name",
        "t_c": "http://creator.multitvsolution.com/terms.html",
        "udatedevice": "https://api.vivetv.in/ottapi/v1/user/udatedevice",
        "unsubscribe": "https://api.vivetv.in/ottapi/v1/channel/chunsubscribe",
        "user_behavior": "https://api.vivetv.in/ottapi/v1/content/user_behavior",
        "userrelated": "https://api.vivetv.in/ottapi/v1/content/userrelated_content",
        "generate_otp": "https://api.vivetv.in/ottapi/v1/user/generate/otp",
        "user_verify_otp": "https://api.vivetv.in/ottapi/v1/user/verify/otp",
        "forgot_verify_otp": "https://api.vivetv.in/ottapi/v1/forgot/user/verify/otp",
        "resend_otp": "https://api.vivetv.in/ottapi/v1/user/resend/otp",
        "version": "https://api.vivetv.in/ottapi/v1/content/version/device",
        "version_check": "https://api.vivetv.in/ottapi/v1/user/version_check/device",
        "watchduration": "https://api.vivetv.in/ottapi/v1/content/watchDurationSubs",
        "watchlist": "https://api.vivetv.in/ottapi/v1/content/watchlist",
        "createorder": "https://payment-ms.altt.studio/payment",
        "paytm_otp_verify_recurring": "https://payment-ms.altt.studio/paytm/validate/otp",
        "paypal_complete_order": "https://payment-ms.altt.studio/paypal/verify/complete",
        "mobikwik": "https://walletapi.mobikwik.com/wallet?mid=",
        "activation_validate": "https://api.vivetv.in/ottapi/v1/activation/validate",
        "auth_access_token": "https://api.vivetv.in/ottapi/v1/auth/access/token",
        "lazypay_otp_resend": "https://payment-ms.altt.studio/lazypay/otpresend",
        "lazypay_payment": "https://payment-ms.altt.studio/lazypay/pay",
        "count_otp_email": "https://api.vivetv.in/ottapi/v1/Count/otp/username/",
        "user_package": "https://subs.vivetv.in/ott_subscription/v1/spackage/user_packages/device/webs/uid/",
        "count_otp_contact": "https://api.vivetv.in/ottapi/v1/Count/otp/contact/",
        "paytm_verify_payment": "https://payment-ms.altt.studio/paytm/verify/payment",
        "mobikwik_verify_payment": "https://payment-ms.altt.studio/mobikwik/verify/payment",
        "payu_verify_payment": "https://payment-ms.altt.studio/payu/verify/payment",
        "check_email": "https://api.vivetv.in/ottapi/v1/check/email",
        "last_package_inapp_purchase": "https://api.vivetv.in/ottapi/v1/get/last/package",
        "ip_location": "https://api.vivetv.in/ottapi/v1/get/location/api/ip",
        "custom_ad": "https://subs.vivetv.in/ott_subscription/v1/custom_ad/user_package",
        "epg_list": "https://api.vivetv.in/ottapi/v1/get/channels/list",
        "get_channel": "https://api.vivetv.in/ottapi/v1/get/channels/id",
        "get_epg_date": "https://api.vivetv.in/ottapi/v1/get/epg/data/channel_id",
        "create_complete_order": "https://subs.vivetv.in/ott_subscription/v1/subscription/user/create/plan",
        "config_main_developer": "https://static.creatorott.com/configration/5006/config-main.json",
        "config_inner_developer": "https://static.creatorott.com/configration/5006/config-inner.json",
        "config_error_messages": "https://static.creatorott.com/configration/5006/config-error-messages.json",
        "config_popup_developer": "https://static.creatorott.com/configration/5006/config-popup.json",
        "langauge_list": "https://api.vivetv.in/ottapi/v1/get/language",
        "create_user_profile": "https://api.vivetv.in/ottapi/v1/create/user/profile",
        "update_user_profile": "https://api.vivetv.in/ottapi/v1/update/user/profile",
        "delete_user_profile": "https://api.vivetv.in/ottapi/v1/delete/user/profile",
        "list_user_profile": "https://api.vivetv.in/ottapi/v1/list/user/profile/device"
      }
    }
   

  }

  // jsonDevData() {
  //   return this.http.get(`${baseUrl2}`);
  // }


  createOrder(createOrder: any): Observable<any> {
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
    const url = this.mainData.result.subs_complete_order_onetime + "/device/web";
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
