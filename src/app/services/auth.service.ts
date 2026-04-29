
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiConstants } from "./api.constants";
import { Login } from "./model/login";
import { SocialLogin } from "./model/social-login";
import { HttpClient } from "@angular/common/http";
var baseUrl2 = environment.baseUrl2;
@Injectable({
  providedIn: "root",
})
export class AuthService {
  storageSub = new Subject<any>();
  public loginObservable = new Subject<boolean>();
  storageSS = this.storageSub.asObservable();
  BASE_URL = environment.baseUrl;
  LOGIN = ApiConstants.LOGIN;
  SIGNUP = ApiConstants.SIGNUP;
  ALLOWED = ApiConstants.IS_ALLOWED;
  ANALYTICS = this.BASE_URL + "/" + ApiConstants.ANALYTICS;

  mainData: any;
  constructor(private http: HttpClient) {
    this.mainData = {
      "abuse": "https://api.artofliving.app/artoflivingapi/v10/comments/abuse",
      "activation_code": "https://api.artofliving.app/artoflivingapi/v10/activation/code/generate",
      "add": "https://api.artofliving.app/artoflivingapi/v10/user/add",
      "add_watchlist": "https://api.artofliving.app/artoflivingapi/v10/content/addwatchlist",
      "add_watchlist2": "https://api.artofliving.app/artoflivingapi/v10/content/season/addwatchlist",
      "addetail": "https://api.artofliving.app/artoflivingapi/v10/ads/adDetail_enc",
      "advance_search": "https://api.artofliving.app/artoflivingapi/v10/content/advance/search",
      "analytics_mservice": "https://subs.artofliving.app/aol_mservice/v10/analyticapi/analytics-data",
      "billing_history": "https://api.artofliving.app/artoflivingapi/v10/billing/history",
      "cancel_subscription": "https://subs.artofliving.app/aol_subs/v10/subscription/cancel_subscription",
      "catlist": "https://api.artofliving.app/artoflivingapi/v10/content/catlist",
      "clear_continue_watching": "https://subs.artofliving.app/aol_mservice/v10/clear/continue/watching",
      "clear_watchlist": "https://api.artofliving.app/artoflivingapi/v10/clear/watchlist",
      "comment_add": "https://api.artofliving.app/artoflivingapi/v10/comments/add",
      "coupon_validate": "https://subs.artofliving.app/aol_subs/v10/subscription/coupon_validate",
      "csession": "https://api.artofliving.app/artoflivingapi/v10/customer/session",
      "delete_account": "https://api.artofliving.app/artoflivingapi/v10/delete/account/user",
      "delete_account_lookup": "https://api.artofliving.app/artoflivingapi/v10/delete/account/user/lookup",
      "detail": "https://api.artofliving.app/artoflivingapi/v10/content/detail",
      "detail2": "https://api.artofliving.app/artoflivingapi/v10/content/detail2",
      "deviceinfo": "https://api.artofliving.app/artoflivingapi/v10/user/deviceinfo",
      "drm": "https://api.artofliving.app/artoflivingapi/v10/drm/keys",
      "edit": "https://api.artofliving.app/artoflivingapi/v10/user/edit",
      "extra_list": "https://api.artofliving.app/artoflivingapi/v10/content/assets",
      "favlist": "1|,https://api.artofliving.app/artoflivingapi/v10/content/favlist",
      "favorite": "https://api.artofliving.app/artoflivingapi/v10/content/favorite",
      "user_favorite_content": "https://subs.artofliving.app/aol_mservice/v10/user/favorite/content",
      "user_content_data": "https://api.artofliving.app/artoflivingapi/v10/user/content/data",
      "content_data": "https://api.artofliving.app/artoflivingapi/v10/users/content/season/data",
      "genre": "https://api.artofliving.app/artoflivingapi/v10/content/getgenreLive",
      "get_setting": "https://api.artofliving.app/artoflivingapi/v10/get/settings",
      "home4": "https://api.artofliving.app/artoflivingapi/v10/content/home4",
      "home5": "https://api.artofliving.app/artoflivingapi/v10/content/home5",
      "continue_watching": "https://subs.artofliving.app/aol_mservice/v10/content/continue_watching",
      "lang_content": "https://subs.artofliving.app/aol_mservice/v10/content/LangContent",
      "ifallowed": "https://api.artofliving.app/artoflivingapi/v10/content/ifallowed",
      "device_ifallowed": "https://api.artofliving.app/artoflivingapi/v10/device/content/ifallowed",
      "isplaybackallowed": "https://api.artofliving.app/artoflivingapi/v10/content/isPlayAllowed",
      "like": "https://api.artofliving.app/artoflivingapi/v10/content/like",
      "list": "https://api.artofliving.app/artoflivingapi/v10/content/list",
      "content_list2": "https://api.artofliving.app/artoflivingapi/v10/content/list2",
      "season_list2": "https://api.artofliving.app/artoflivingapi/v10/season/list2",
      "login": "https://api.artofliving.app/artoflivingapi/v10/user/login",
      "logout": "https://api.artofliving.app/artoflivingapi/v10/auth/device/logout",
      "device_list": "https://api.artofliving.app/artoflivingapi/v10/device/list",
      "login_phone": "https://api.artofliving.app/artoflivingapi/v10/user/login/phone",
      "lookup": "https://api.artofliving.app/artoflivingapi/v10/user/lookup",
      "menu": "https://api.artofliving.app/artoflivingapi/v10/cms/links",
      "pages": "https://console.multitvsolution.com/cms/page?",
      "playlist": "https://api.artofliving.app/artoflivingapi/v10/content/playlist",
      "popular_add": "https://api.artofliving.app/artoflivingapi/v10/popular/content/add",
      "popular_search": "https://api.artofliving.app/artoflivingapi/v10/content/popularsearch",
      "privacy_policy": "http:/creator.multitvsolution.com/privacy.html",
      "rating": "https://api.artofliving.app/artoflivingapi/v10/content/rating",
      "recent_search": "https://api.artofliving.app/artoflivingapi/v10/content/recentsearch",
      "recomended": "https://api.artofliving.app/artoflivingapi/v10/content/recomended",
      "renew_download": "https://api.artofliving.app/artoflivingapi/v10/check/download/expiry",
      "reset_password": "https://api.artofliving.app/artoflivingapi/v10/user/resetpassword",
      "search": "https://api.artofliving.app/artoflivingapi/v10/content/list",
      "setting": "https://api.artofliving.app/artoflivingapi/v10/settings",
      "social": "https://api.artofliving.app/artoflivingapi/v10/user/social",
      "subs_complete_order_onetime": "https://subs.artofliving.app/aol_subs/v10/subscription/onetime_complete_order",
      "subs_create_order_onetime": "https://subs.artofliving.app/aol_subs/v10/subscription/onetime_create_order",
      "subs_package_list": "https://subs.artofliving.app/aol_subs/v10/spackage/subscription",
      "subs_paytm_checksum": "https://console.multitvsolution.com/paytm/veqta_paytm/generateChecksum.php?",
      "subs_paytm_verifychecksum": "https://console.multitvsolution.com/paytm/veqta_paytm/verifyChecksum.php",
      "t_c": "http:/creator.multitvsolution.com/terms.html",
      "unsubscribe": "https://api.artofliving.app/artoflivingapi/v10/channel/chunsubscribe",
      "user_behavior": "https://api.artofliving.app/artoflivingapi/v10/content/user_behavior",
      "userrelated": "https://api.artofliving.app/artoflivingapi/v10/content/userrelated_content",
      "verify_otp_phone": "https://api.artofliving.app/artoflivingapi/v10/user/verify/phone",
      "verify_otp_email": "https://api.artofliving.app/artoflivingapi/v10/user/verify/email",
      "user_verify_otp": "https://api.artofliving.app/artoflivingapi/v10/user/verify/otp",
      "version": "https://api.artofliving.app/artoflivingapi/v10/content/version",
      "version_check": "https://api.artofliving.app/artoflivingapi/v10/user/version_check",
      "watchduration": "https://api.artofliving.app/artoflivingapi/v10/content/watchDurationSubs",
      "watchlist": "https://api.artofliving.app/artoflivingapi/v10/content/watchlist",
      "mobikwik": "https://walletapi.mobikwik.com/wallet?mid=",
      "activation_validate": "https://api.artofliving.app/artoflivingapi/v10/activation/validate",
      "auth_access_token": "https://api.artofliving.app/artoflivingapi/v10/auth/access/token",
      "count_otp_email": "https://api.artofliving.app/artoflivingapi/v10/Count/otp/username/",
      "user_package": "https://subs.artofliving.app/aol_subs/v10/spackage/user_packages",
      "count_otp_contact": "https://api.artofliving.app/artoflivingapi/v10/Count/otp/contact/",
      "check_email": "https://api.artofliving.app/artoflivingapi/v10/check/email",
      "country_list": "https://api.artofliving.app/artoflivingapi/v10/country/list",
      "state_list": "https://api.artofliving.app/artoflivingapi/v10/state/list/country_id/",
      "city_list": "https://api.artofliving.app/artoflivingapi/v10/city/list/state_id/",
      "change_password": "https://api.artofliving.app/artoflivingapi/v10/customer/update/password",
      "user_feedback": "https://api.artofliving.app/artoflivingapi/v10/user/feedback",
      "singer_list_content": "https://api.artofliving.app/artoflivingapi/v10/get/singer/podcast/list",
      "add_playlist_content": "https://api.artofliving.app/artoflivingapi/v10/add/playlist",
      "get_playlist_uid_pid": "https://api.artofliving.app/artoflivingapi/v10/get/playlist",
      "user_genrate_otp": "https://api.artofliving.app/artoflivingapi/v10/user/genrate/otp",
      "edit_playlist": "https://api.artofliving.app/artoflivingapi/v10/edit/playlist",
      "edit_content_playlist": "https://api.artofliving.app/artoflivingapi/v10/edit/content/playlist",
      "stream_url": "https://api.artofliving.app/artoflivingapi/v10/get/stream",
      "ip_location": "https://apiip.net/api/check?&accessKey=339be8f8-1e75-4eba-b2e2-301675977938",
      "watchlist_type": "https:///static.altt.studio/configration/717/watchlist_type.json",
      "home_menu": "https://static.artofliving.app/configration/717/home_menu.json",
      "playlist_add": "https://api.artofliving.app/artoflivingapi/v10/add/playlist/content",
      "other_than_playlist": "https://api.artofliving.app/artoflivingapi/v10/get/playlist/content",
      "get_album": "https://api.artofliving.app/artoflivingapi/v10/get/album",
      "add_recent_search": "https://api.artofliving.app/artoflivingapi/v10/content/recentsearch",
      "get_radio": "https://api.artofliving.app/artoflivingapi/v10/get/radio/data",
      "zoom_webcast": "https://api.artofliving.app/artoflivingapi/v10/get/zoom/list",
      "customer_session": "https://subs.artofliving.app/aol_mservice/v10/customer/session",
      "get_views": "https://api.artofliving.app/artoflivingapi/v10/get/views",
      "user_like_content": "https://api.artofliving.app/artoflivingapi/v10/user/favorite/like/content",
      "zoom_sdk": "https://api.artofliving.app/artoflivingapi/v10/zoom/sdk/token/meeting_id",
      "config_country_developer": "https://static.artofliving.app/configration/717/570-config-country-developer.json",
      "config_popup_developer": "https://static.artofliving.app/configration/717/570-config-popup-developer.json",
      "config_error_messages": "https://static.artofliving.app/configration/717/570-config-error-messages-developer.json",
      "config_main_developer": "https://static.artofliving.app/configration/717/570-config-main-developer.json",
      "config_inner_developer": "https://static.artofliving.app/configration/717/570-config-inner-developer.json",
      "user_analytics": "https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=u%24r41e9cf79fbe9e8fb1379734e8f44322a&secretKey=ae137b8814e8fe740b0ac0158898e7f5b1051110",
      "zoom_sdk_token": "https://api.artofliving.app/artoflivingapi/v10/zoom/sdk/token/meeting_id",
      "season_data": "https://api.artofliving.app/artoflivingapi/v10/users/season/data",
      "season_like": "https://api.artofliving.app/artoflivingapi/v10/season/like",
      "app_languages": "https://static.altt.studio/configration/717/app_languages.json"
    }

    // this.mainData = {
    //   "abuse": "https://preprodapi.artofliving.app/artoflivingapi/v10/comments/abuse",
    //   "activation_code": "https://preprodapi.artofliving.app/artoflivingapi/v10/activation/code/generate",
    //   "add": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/add",
    //   "add2":"https://preprodapi.artofliving.app/artoflivingapi/v10/user/add_new ",
    //   "add_watchlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/addwatchlist",
    //   "add_watchlist2": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/season/addwatchlist",
    //   "addetail": "https://preprodapi.artofliving.app/artoflivingapi/v10/ads/adDetail_enc",
    //   "advance_search": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/advance/search",
    //   "analytics_mservice": "https://preprodsubs.artofliving.app/aol_mservice/v10/analyticapi/analytics-data",
    //   "billing_history": "https://preprodapi.artofliving.app/artoflivingapi/v10/billing/history",
    //   "cancel_subscription": "https://preprodsubs.artofliving.app/aol_subs/v10/subscription/cancel_subscription",
    //   "catlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/catlist",
    //   "clear_continue_watching": "https://preprodsubs.artofliving.app/aol_mservice/v10/clear/continue/watching",
    //   "clear_watchlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/clear/watchlist",
    //   "comment_add": "https://preprodapi.artofliving.app/artoflivingapi/v10/comments/add",
    //   "coupon_validate": "https://preprodsubs.artofliving.app/aol_subs/v10/subscription/coupon_validate",
    //   "csession": "https://preprodapi.artofliving.app/artoflivingapi/v10/customer/session",
    //   "delete_account": "https://preprodapi.artofliving.app/artoflivingapi/v10/delete/account/user",
    //   "delete_account_lookup": "https://preprodapi.artofliving.app/artoflivingapi/v10/delete/account/user/lookup",
    //   "detail": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/detail",
    //   "detail2": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/detail2",
    //   "deviceinfo": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/deviceinfo",
    //   "drm": "https://preprodapi.artofliving.app/artoflivingapi/v10/drm/keys",
    //   "edit": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/edit",
    //   "extra_list": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/assets",
    //   "favlist": "1|,https://preprodapi.artofliving.app/artoflivingapi/v10/content/favlist",
    //   "favorite": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/favorite",
    //   "user_favorite_content": "https://preprodsubs.artofliving.app/aol_mservice/v10/user/favorite/content",
    //   "user_content_data": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/content/data",
    //   "content_data": "https://preprodapi.artofliving.app/artoflivingapi/v10/users/content/season/data",
    //   "genre": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/getgenreLive",
    //   "get_setting": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/settings",
    //   "home4": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/home4",
    //   "home5": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/home5",
    //   "continue_watching": "https://preprodsubs.artofliving.app/aol_mservice/v10/content/continue_watching",
    //   "lang_content": "https://preprodsubs.artofliving.app/aol_mservice/v10/content/LangContent",
    //   "ifallowed": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/ifallowed",
    //   "device_ifallowed": "https://preprodapi.artofliving.app/artoflivingapi/v10/device/content/ifallowed",
    //   "isplaybackallowed": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/isPlayAllowed",
    //   "like": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/like",
    //   "list": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/list",
    //   "content_list2": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/list2",
    //   "season_list2": "https://preprodapi.artofliving.app/artoflivingapi/v10/season/list2",
    //   "login": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/login",
    //   "logout": "https://preprodapi.artofliving.app/artoflivingapi/v10/auth/device/logout",
    //   "device_list": "https://preprodapi.artofliving.app/artoflivingapi/v10/device/list",
    //   "login_phone": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/login/phone",
    //   "lookup": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/lookup",
    //   "menu": "https://preprodapi.artofliving.app/artoflivingapi/v10/cms/links",
    //   "pages": "https://console.multitvsolution.com/cms/page?",
    //   "playlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/playlist",
    //   "popular_add": "https://preprodapi.artofliving.app/artoflivingapi/v10/popular/content/add",
    //   "popular_search": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/popularsearch",
    //   "privacy_policy": "http:/creator.multitvsolution.com/privacy.html",
    //   "rating": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/rating",
    //   "recent_search": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/recentsearch",
    //   "recomended": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/recomended",
    //   "renew_download": "https://preprodapi.artofliving.app/artoflivingapi/v10/check/download/expiry",
    //   "reset_password": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/resetpassword",
    //   "search": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/list",
    //   "setting": "https://preprodapi.artofliving.app/artoflivingapi/v10/settings",
    //   "social": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/social",
    //   "subs_complete_order_onetime": "https://preprodsubs.artofliving.app/aol_subs/v10/subscription/onetime_complete_order",
    //   "subs_create_order_onetime": "https://preprodsubs.artofliving.app/aol_subs/v10/subscription/onetime_create_order",
    //   "subs_package_list": "https://preprodsubs.artofliving.app/aol_subs/v10/spackage/subscription",
    //   "subs_paytm_checksum": "https://console.multitvsolution.com/paytm/veqta_paytm/generateChecksum.php?",
    //   "subs_paytm_verifychecksum": "https://console.multitvsolution.com/paytm/veqta_paytm/verifyChecksum.php",
    //   "t_c": "http:/creator.multitvsolution.com/terms.html",
    //   "unsubscribe": "https://preprodapi.artofliving.app/artoflivingapi/v10/channel/chunsubscribe",
    //   "user_behavior": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/user_behavior",
    //   "userrelated": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/userrelated_content",
    //   "verify_otp_phone": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/verify/phone",
    //   "verify_otp_phone2": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/verify/phone_new",
    //   "verify_otp_email": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/verify/email",
    //   "verify_otp_email2": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/verify/email_new",
    //   "user_verify_otp": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/verify/otp",
    //   "version": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/version",
    //   "version_check": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/version_check",
    //   "watchduration": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/watchDurationSubs",
    //   "watchlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/watchlist",
    //   "mobikwik": "https://walletapi.mobikwik.com/wallet?mid=",
    //   "activation_validate": "https://preprodapi.artofliving.app/artoflivingapi/v10/activation/validate",
    //   "auth_access_token": "https://preprodapi.artofliving.app/artoflivingapi/v10/auth/access/token",
    //   "count_otp_email": "https://preprodapi.artofliving.app/artoflivingapi/v10/Count/otp/username/",
    //   "user_package": "https://preprodsubs.artofliving.app/aol_subs/v10/spackage/user_packages",
    //   "count_otp_contact": "https://preprodapi.artofliving.app/artoflivingapi/v10/Count/otp/contact/",
    //   "check_email": "https://preprodapi.artofliving.app/artoflivingapi/v10/check/email",
    //   "country_list": "https://preprodapi.artofliving.app/artoflivingapi/v10/country/list",
    //   "state_list": "https://preprodapi.artofliving.app/artoflivingapi/v10/state/list/country_id/",
    //   "city_list": "https://preprodapi.artofliving.app/artoflivingapi/v10/city/list/state_id/",
    //   "change_password": "https://preprodapi.artofliving.app/artoflivingapi/v10/customer/update/password",
    //   "user_feedback": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/feedback",
    //   "singer_list_content": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/singer/podcast/list",
    //   "add_playlist_content": "https://preprodapi.artofliving.app/artoflivingapi/v10/add/playlist",
    //   "get_playlist_uid_pid": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/playlist",
    //   "user_genrate_otp": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/genrate/otp",
    //   "edit_playlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/edit/playlist",
    //   "edit_content_playlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/edit/content/playlist",
    //   "stream_url": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/stream",
    //   "ip_location": "https://apiip.net/api/check?&accessKey=339be8f8-1e75-4eba-b2e2-301675977938",
    //   "watchlist_type": "https://static.altt.studio/configration/717/watchlist_type.json",
    //   "home_menu": "https://static.altt.studio/configration/717/home_menu.json",
    //   "playlist_add": "https://preprodapi.artofliving.app/artoflivingapi/v10/add/playlist/content",
    //   "other_than_playlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/playlist/content",
    //   "get_album": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/album",
    //   "add_recent_search": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/recentsearch",
    //   "get_radio": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/radio/data",
    //   "zoom_webcast": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/zoom/list",
    //   "customer_session": "https://preprodsubs.artofliving.app/aol_mservice/v10/customer/session",
    //   "get_views": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/views",
    //   "user_like_content": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/favorite/like/content",
    //   "zoom_sdk": "https://preprodapi.artofliving.app/artoflivingapi/v10/zoom/sdk/token/meeting_id",
    //   "config_country_developer": "https://static.artofliving.app/configration/717/570-config-country-developer.json",
    //   "config_popup_developer": "https://static.artofliving.app/configration/717/570-config-popup-developer.json",
    //   "config_error_messages": "https://static.artofliving.app/configration/717/570-config-error-messages-developer.json",
    //   "config_main_developer": "https://static.artofliving.app/configration/717/570-config-main-developer.json",
    //   "config_inner_developer": "https://static.artofliving.app/configration/717/570-config-inner-developer.json",
    //   "user_analytics": "https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=u%24r41e9cf79fbe9e8fb1379734e8f44322a&secretKey=ae137b8814e8fe740b0ac0158898e7f5b1051110",
    //   "zoom_sdk_token": "https://preprodapi.artofliving.app/artoflivingapi/v10/zoom/sdk/token/meeting_id",
    //   "season_data": "https://preprodapi.artofliving.app/artoflivingapi/v10/users/season/data",
    //   "season_like": "https://preprodapi.artofliving.app/artoflivingapi/v10/season/like",
    //   "app_languages": "https://static.altt.studio/configration/717/app_languages.json",
    //   "app_language": "https://preprodapi.artofliving.app/artoflivingapi/v10/get/language",
    //   "user_current_package": "https://preprodsubs.artofliving.app/aol_subs/v10/spackage/user/current/purchased"
    // }

  }
  jsonDevData() {
    return this.http.get(`${baseUrl2}`);
  }

  ottLogin(login: Login): Observable<Login> {
    return this.http.post<Login>(this.mainData.login, login);
  }
  ottLogin1(login: any): Observable<Login> {
    return this.http.post<Login>(this.mainData.check_email, login);

  }
  ottSignup(signup: any): Observable<any> {
    return this.http.post<any>(this.mainData.add, signup);
  }
  ottSocialLogin(socialLogin: SocialLogin): Observable<SocialLogin> {
    return this.http.post<SocialLogin>(this.mainData.social, socialLogin);
  }
  isAllowed(data: any): Observable<any> {
    return this.http.post<any>(this.mainData.device_ifallowed, data);
  }
  generateOtp(data: any): Observable<any> {
    return this.http.post<any>(this.mainData.user_genrate_otp, data);
  }
  verifyEmail(data: any): Observable<any> {
    return this.http.post<any>(this.mainData.verify_otp_email, data);
  }

  verifyPhone(data: any): Observable<any> {
    return this.http.post<any>(this.mainData.verify_otp_phone, data);
  }
  OttcheckUserExisted(status: any): Observable<any> {
    return this.http.post(this.mainData.lookup, status);
  }
  ottOtpLogin(otp: any): Observable<any> {
    return this.http.post(this.mainData.login_phone, otp);
  }
  verifyottOtp(otp: any): Observable<any> {
    return this.http.post(this.mainData.user_verify_otp, otp);
  }
  verifOtpPhone(otp: any): Observable<any> {
    return this.http.post(this.mainData.verify_otp_phone, otp);
  }
  verifyottMobile(otp: any): Observable<any> {
    return this.http.post(this.mainData.user_verify_otp, otp);
  }
  forgotPassword(data: any) {
    return this.http.post(this.mainData.forgot, data);
  }
  deviceInfoGet(user_id: any) {
    return this.http.get(this.mainData.device_list + `/u_id/${user_id}`);
  }
  resetPassword(resetData: any) {
    return this.http.post(this.mainData.reset_password, resetData);
  }
  changePassword(resetData: any) {
    return this.http.post(this.mainData.change_password, resetData);
  }
  advancedSearch(search_tag: any) {
    return this.http.post(this.mainData.advance_search + "/device/web/current_offset/0/max_counter/10", search_tag);
  }
  activationCodeTV(data: any) {
    return this.http.post(this.mainData.activation_validate, data);
  }
}
