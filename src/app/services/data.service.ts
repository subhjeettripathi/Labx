import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY_PROVIDER } from '@angular/cdk/overlay/overlay-directives';
import { switchMap } from 'rxjs/operators';
var baseUrl2 = environment.baseUrl2;
@Injectable({
  providedIn: 'root'
})
export class DataService {
  device = this.detectBrowserName()
  mainData: any = {};
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
    //   "add_watchlist2": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/season/addwatchlist",
    //   "add_watchlist": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/addwatchlist",
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
    //   "continue_watching": "https://preprodsubs.artofliving.app/aol_mservice/v10/content/continue_watching",
    //   "lang_content": "https://preprodsubs.artofliving.app/aol_mservice/v10/content/LangContent",
    //   "ifallowed": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/ifallowed",
    //   "device_ifallowed": "https://preprodapi.artofliving.app/artoflivingapi/v10/device/content/ifallowed",
    //   "isplaybackallowed": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/isPlayAllowed",
    //   "like": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/like",
    //   "list": "https://preprodapi.artofliving.app/artoflivingapi/v10/content/list",
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
    //   "verify_otp_email": "https://preprodapi.artofliving.app/artoflivingapi/v10/user/verify/email",
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
    //   "watchlist_type": "https:///static.altt.studio/configration/717/watchlist_type.json",
    //   // "home_menu": "https:///static.altt.studio/configration/717/home_menu.json",
    //   "home_menu":"https://static.artofliving.app/configration/717/home_menu.json",
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
    //   "app_languages": "https://static.altt.studio/configration/717/app_languages.json"
    // }
  }

  getMenus() {
    return this.http.get(this.mainData.home_menu);
  }
  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'web';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'web';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'web';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'web';
      case agent.indexOf('safari') > -1:
        return 'ios';
      default:
        return 'other';
    }
  }

  tokendata(type: any, authorization: any, payload: any): Observable<any> {
    return this.http.get(`http://altb-api-2131614686.ap-south-1.elb.amazonaws.com/automatorapi/v10/content/drm/validate/device/web?type=${type}&authorization=${authorization}&payload=${payload}`)
  }

  payloadData(formData: any): Observable<any> {
    return this.http.post("https://api.altt.studio/automatorapi/v10/content/drm/payload/device/web", formData)
  }
  delete_verify(formData: any): Observable<any> {
    return this.http.post(this.mainData.delete_account, formData)
  }

  jsonDevData() {
    return this.http.get(`${baseUrl2}`);
  }
  getWatchlistType() {
    return this.http.get(this.mainData.watchlist_type);
  }
  getCategoryList(id: any) {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.catlist + `/device/web/cat_id/${id}/loc/${loc}`)
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.catlist + `/device/web/cat_id/${id}/loc/${loc}`)
    }

  }
  getWatchlistData(c_type: any) {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.mainData.watchlist + `/device/web/current_offset/0/max_counter/10/user_id/${USER_ACCOUNT.id}/type/watchlist/c_type/${c_type}`);
  }

  getHomeData(offset: any, display_limit: number, cat_id: any): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const region: any = localStorage.getItem('regional');

    const ipSaveData = localStorage.getItem("ipSaveData");

    if (ipSaveData == null) {
      // Fetch IP data and proceed with the API call
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const detail = res.countryCode;
          return this.makeApiCall(offset, display_limit, cat_id, USER_ACCOUNT, region, detail);
        })
      );
    } else {
      // Use the existing IP data
      const detail = JSON.parse(ipSaveData).countryCode;
      return this.makeApiCall(offset, display_limit, cat_id, USER_ACCOUNT, region, detail);
    }
  }

  private makeApiCall(offset: any, display_limit: number, cat_id: any, USER_ACCOUNT: any, region: any, location: string): Observable<any> {
    let url: string;

    if (USER_ACCOUNT && (!region || region === 'None')) {
      url = `${this.mainData.home4}/device/web/display_offset/${offset}/display_limit/${display_limit}/content_count/20/cat_id/${cat_id}/session/1/loc/${location}`;
    } else if (region) {
      url = `${this.mainData.home4}/device/web/display_offset/${offset}/display_limit/${display_limit}/content_count/20/cat_id/${cat_id}/lang/${region}/session/1/loc/${location}`;
    } else {
      url = `${this.mainData.home4}/device/web/display_offset/${offset}/display_limit/${display_limit}/content_count/20/cat_id/${cat_id}/session/0/loc/${location}`;
    }

    return this.http.get(url);
  }
  getUserData(ids: any) {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    if (USER_ACCOUNT) {
      return this.http.get(this.mainData.content_data + `/device/web/userid/${USER_ACCOUNT.id}/content_id/${ids}`)
    } else {
      return this.http.get(this.mainData.content_data + `/device/web/content_id/${ids}`)
    }


  }

  // getUserDataSeason(ids: any) {
  // const taplogininfo: any = localStorage.getItem('taploginInfo');
  // const USER_ACCOUNT: any = JSON.parse(taplogininfo);
  // if (USER_ACCOUNT) {
  // return this.http.get(this.mainData.season_data+`/device/web/userid/${USER_ACCOUNT.id}/season_id/${ids}`)
  // } else {
  // return this.http.get(this.mainData.season_data+`/device/web/season_id/${ids}`)
  // }


  // }

  versionAPi() {
    return this.http.get(this.mainData.version);
  }
  getDescriptionData(content_id: any) {
    return this.http.get(this.mainData.detail + `/device/web/content_id/${content_id}`);
  }
  getDescriptionDataList(offset: any, cat_ids: any) {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/12/cat_id/${cat_ids}/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/12/cat_id/${cat_ids}/loc/${loc}`);
    }
  }

  getSimilarContent(offset: any, cat_ids: any, c_id: any) {

    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${cat_ids}/cid/${c_id}/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${cat_ids}/cid/${c_id}/loc/${loc}`);
    }

  }
  getSimilarContentMovie(offset: any, cat_ids: any, c_id: any) {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${cat_ids}/season_id/${c_id}/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${cat_ids}/season_id/${c_id}/loc/${loc}`);
    }

  }
  getExtras(offset: any, cat_ids: any, type: any) {
    return this.http.get(this.mainData.extra_list + `/device/web/current_offset/${offset}/max_counter/10/cid/${cat_ids}/tp/${type}`);
  }
  getSeasonData(offset: any, season_id: any) {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/10/season_id/${season_id}/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/10/season_id/${season_id}/loc/${loc}`);
    }

  }
  getAlbumData(season_id: any, offset: any, maxcounter: any) {
    return this.http.get(this.mainData.get_album + `/${season_id}/max_counter/${offset}/current_offset/${maxcounter}/device/web`)
  }

  getEpisodeData(offset: any, maxcounter: any, season_id: any) {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/${maxcounter}/season_id/${season_id}/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.list + `/device/web/current_offset/${offset}/max_counter/${maxcounter}/season_id/${season_id}/loc/${loc}`);
    }


  }
  logout(formData: any): Observable<any> {
    return this.http.post(this.mainData.logout, formData)
  }
  getSubscribeInfo(loc: any): Observable<any> {
    return this.http.get(this.mainData.subs_package_list + `/device/web/loc/${loc}`);
  }
  getUserSubscriptionDetails(uid: number): Observable<any> {
    return this.http.get(this.mainData.user_package + `/device/web/uid/${uid}`);
  }
  getUserSubscription(uid: number): Observable<any> {
    // return this.http.get(`https://preprodsubs.artofliving.app/aol_subs/v10/spackage/user/current/purchased/device/web/uid/${uid}`);
    return this.http.get(`https://subs.artofliving.app/aol_subs/v10/spackage/user/current/purchased/device/web/uid/${uid}`);
  }
  getContinueWatching(offset: number, count: number, type:any): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.mainData.watchlist + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watching/c_type/${type}`);
  }
  getContinueWatchingbyId(offset: number, count: number, id: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.mainData.watchlist + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watching/cat_id/${id}`);
  }

  getWatchList(offset: number, count: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.mainData.watchlist + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watchlist`);
  }
  getWatchListById(offset: number, count: number, id: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.mainData.watchlist + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watchlist/cat_id/${id}`);
  }



  clearWatchlist(params: any) {
    return this.http.post(this.mainData.clear_watchlist, params);
  }
  getRecommendedList(offset: number, count: number, userID: any): Observable<any> {
    return this.http.get(this.mainData.recomended + `/device/web/current_offset/${offset}/max_counter/${count} `);
  }
  getContentUserBehaviour(content_id: any): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.mainData.user_behavior + `/user_id/${USER_ACCOUNT.id}/content_id/${content_id}`);
  }

  otpCountData(email: any) {
    return this.http.get(this.mainData.count_otp_contact + `${email}`);
  }
  webcast(loc: any) {
    return this.http.get(this.mainData.zoom_webcast + `/type/webcast/loc/${loc}/device/web`);
  }
  radio() {
    return this.http.get(this.mainData.get_radio + `/device/web`);
  }
  getLiveData() {
    return this.http.get(`https://api-altb.multitvsolution.com:9012/ottapi/v1/content/home4/content_count/0/device/web/display_offset/0/display_limit/10/live_limit/10/session/0`);


  }

  addRemoveToWatchList(watchlist: any): Observable<any> {
    return this.http.post(this.mainData.add_watchlist2, watchlist);
  }
  getBillingHistory() {
    let loginInfo: any = localStorage.getItem('taploginInfo');
    const user_id: number = JSON.parse(loginInfo).id;

    return this.http.get(this.mainData.billing_history + `/u_id/${user_id}`)
  }
  autoSuggestData(formData: any): Observable<any> {
    return this.http.get(this.mainData.autosuggest + `/title/${formData}`)
  }

  countrylist() {
    return this.http.get(this.mainData.country_list);
  }
  statelist(id: any) {
    return this.http.get(this.mainData.state_list + id);
  }
  citylist(id: any) {
    return this.http.get(this.mainData.city_list + id);
  }

  faqData(): Observable<any> {
    // return this.http.get(`https://aoldev.multitvsolution.com/assets/upload/configration/570-config-main-developer.json`);
    return this.http.get(`https://static.artofliving.app/configration/717/570-config-main-developer.json`);
  }
  json2() {
    // return this.http.get(`https://aoldev.multitvsolution.com/assets/upload/configration/570-config-inner-developer.json`);
    return this.http.get(`https://static.artofliving.app/configration/717/570-config-inner-developer.json`);
  }
  errorAlertConfig() {
    return this.http.get(`https://static.artofliving.app/configration/717/570-config-error-messages-developer.json`);
  }
  popupJson() {
    return this.http.get(`https://static.artofliving.app/configration/717/570-config-popup-developer.json`);
  }
  getCountryStateList() {
    return this.http.get(`https://static.artofliving.app/configration/717/570-config-country-developer.json`);
  }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'access-control-allow-origin': '*',
      'Authorization': ('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhkWFJvYjNKcGVtVmtJanAwY25WbExDSmxlSEFpT2pFMk5qYzVNRE16Tnprc0luUnZhMlZ1SWpvaWRFWlBXR1F3ZUhJeWJWbEtSblEwSWl3aWRYTmxjbTVoYldVaU9pSmtaV1poZFd4MFgyRmtiV2x1SW4wLlQxU3FkVkNFTHEtaUxadnZKVUNCS1dVLWFrOTdyUF9SRkJ6OXN5U1l6VGc'),
    })
  };
  getSearchApi(search: any): Observable<any> {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.search + `/device/web/current_offset/0/max_counter/50/search_tag/${search}/loc/${loc}`)
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.search + `/device/web/current_offset/0/max_counter/50/search_tag/${search}/loc/${loc}`)
    }

  }

  popularRes() {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.popular_search + `/device/web/current_offset/0/max_counter/10/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.popular_search + `/device/web/current_offset/0/max_counter/10/loc/${loc}`);
    }

  }
  recentRes(uid: any): Observable<any> {
    const ipSaveData = localStorage.getItem("ipSaveData");
    if (ipSaveData == null) {
      return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.recent_search + `/device/web/current_offset/0/max_counter/10/uid/${uid}/loc/${loc}`);
        })
      );
    } else {
      const loc = JSON.parse(ipSaveData).countryCode;
      return this.http.get(this.mainData.recent_search + `/device/web/current_offset/0/max_counter/10/uid/${uid}/loc/${loc}`);
    }

  }
  profile_edit(formData: any): Observable<any> {
    return this.http.post(this.mainData.edit, formData)
  }


  delete_account(formData: any): Observable<any> {
    return this.http.post(this.mainData.delete_account, formData)
  }
  parentalControl(formData: any): Observable<any> {
    return this.http.post(this.mainData.parental_add, formData);

  }
  parentalGet() {
    return this.http.get(this.mainData.age_group + '/device/web')
  }

  analyticsSubmit(analytics: any) {
    return this.http.post(this.mainData.analytics_mservice + '/device/web', analytics);
  }
  redeemCoupon(formData: any): Observable<any> {
    return this.http.post(this.mainData.coupon_validate + '/device/web', formData)
  }
  apipip() {
    // return this.http.get(`https://apiip.net/api/check?&accessKey=339be8f8-1e75-4eba-b2e2-301675977938`)
    return this.http.get(`https://ip-location.videostech.cloud/api/v1/get/location/app/aol`)
  }

  getSingerList(type: any) {
    return this.http.get(this.mainData.singer_list_content + `/device/web/current_offset/0/max_counter/150/type/${type}`)
  }
  getAlbumContent(content_id: any) {
    return this.http.get(this.mainData.get_album + `/${content_id}/max_counter/10/current_offset/0/device/web`)

  }
  getSingerContetnList(id: any, type: any) {
    return this.http.get(this.mainData.singer_list_content + `/current_offset/0/max_counter/100/device/web/type/${type}/id/${id}`)

  }
  parentalAuth(formData: any): Observable<any> {
    return this.http.post(this.mainData.parental_validate, formData)
  }
  changePin(formData: any): Observable<any> {
    return this.http.post(this.mainData.parental_change, formData)
  }
  forgotOtp(formData: any): Observable<any> {
    return this.http.post(this.mainData.forgot, formData)
  }
  verifyOtp(formData: any): Observable<any> {
    return this.http.post(this.mainData.verify_otp, formData)
  }
  clearContinueWatching(formData: any): Observable<any> {
    return this.http.post(this.mainData.clear_continue_watching + '/device/web', formData)
  }
  consentData(formData: any): Observable<any> {
    return this.http.post(this.mainData.consent, formData)
  }

  likeVeiwsCountPost(formData: any): Observable<any> {
    return this.http.post(this.mainData.like, formData)
  }

  likeVeiwsCountPostSeason(formData: any): Observable<any> {
    return this.http.post(this.mainData.season_like, formData)
  }



  likeVeiwsCount(content_id: any) {
    return this.http.get(this.mainData.get_views + `/content_id/${content_id}/device/web`)
  }

  userSession(formData: any): Observable<any> {
    return this.http.post(this.mainData.customer_session, formData)
  }
  pinForgotParental(formData: any): Observable<any> {
    return this.http.post(this.mainData.parental_forgot, formData)
  }
  pinParentalVerify(formData: any): Observable<any> {
    return this.http.post(this.mainData.user_verify_otp, formData)
  }
  pinParentalCreate(formData: any): Observable<any> {
    return this.http.post(this.mainData.parental_reset_pin, formData)
  }
  addPopularContent(formData: any): Observable<any> {
    return this.http.post(this.mainData.popular_add, formData)
  }
  subtitleSet(formData: any): Observable<any> {
    return this.http.post(this.mainData.setting, formData)
  }
  getSubtitle(u_id: any) {
    return this.http.get(this.mainData.get_setting + `/device/web/u_id/${u_id}`)
  }
  restrictionLevelSet(formData: any): Observable<any> {
    return this.http.post(this.mainData.parental_level, formData)
  }
  resendOtp(formData: any): Observable<any> {
    return this.http.post(this.mainData.resend_otp, formData)
  }
  emailLinkProfile(formData: any): Observable<any> {
    return this.http.post(this.mainData.forgot_link, formData)
  }
  PasswordSetEmail(formData: any): Observable<any> {
    return this.http.post(this.mainData.reset_password_link, formData)
  }

  subscriptionPackCheck(uid: any) {
    return this.http.get(this.mainData.user_package + `/device/web/uid/${uid}`)
  }
  profileSmsPolicy(value: any) {
    return this.http.get(this.mainData.count_otp_email + `${value}`)

  }
  continueWatch(userId: any, type:any) {
    return this.http.get(this.mainData.continue_watching + `/type/${type}/user_id/${userId}`)
  }
  regionalLang(userId: any) {
    const region: any = localStorage.getItem('regional')
    return this.http.get(this.mainData.lang_content + `/device/web/content_count/10/user_id/${userId}/lang/${region}`)
  }
  getMainUrl(id: any, userId: any): Observable<any> {
    return this.http.get(this.mainData.stream_url + `/id/${id}/user_id/${userId}/device/${this.device}`)
  }
  paymentQuery(data: any): Observable<any> {
    return this.http.post(this.mainData.contact_us, data);
  }
  createPlaylist(data: any): Observable<any> {
    return this.http.post(this.mainData.add_playlist_content, data);
  }
  getPlaylistNameUser(userId: any) {
    return this.http.get(this.mainData.get_playlist_uid_pid + `/u_id/${userId}/limit/100/offset/0/device/web`)
  }

  timeZoneApiWebcast(countryCode: any, contentID: any) {
    // return this.http.get(`https://preprodapi.artofliving.app/artoflivingapi/v10/get/zoom/list/content_id/${contentID}/loc/${countryCode}`)
    return this.http.get(`https://api.artofliving.app/artoflivingapi/v10/get/zoom/list/content_id/${contentID}/loc/${countryCode}`)
  }

  playlistSearch(current_offset: any, max_counter: any, p_id: any, search_tag: any) {
    return this.http.get(`https://api.artofliving.app/artoflivingapi/v10/content/list/device/web/current_offset/${current_offset}/max_counter/${max_counter}/type/audio/p_id/${p_id}/search_tag/${search_tag}`)
  }

  getPlaylist(userId: any) {
    return this.http.get(this.mainData.get_playlist_uid_pid + `/u_id/${userId}/limit/100/offset/0/device/web`)
  }
  addPlaylistContent(data: any): Observable<any> {
    return this.http.post(this.mainData.playlist_add, data);
  }
  getPlaylistContent(playlist_id: any) {
    return this.http.get(this.mainData.get_playlist_uid_pid + `/p_id/${playlist_id}/limit/100/offset/0/device/web`);
  }
  editPlaylistContent(data: any): Observable<any> {
    return this.http.post(this.mainData.edit_content_playlist, data);
  }
  deletePlaylist(data: any): Observable<any> {
    return this.http.post(this.mainData.edit_playlist, data);
  }
  otherContentListPlaylist(playlist_id: any) {
    return this.http.get(this.mainData.other_than_playlist + `/p_id/${playlist_id}/limit/20/offset/0/device/web`);
  }
  zoom() {
     return this.apipip().pipe(
        switchMap((res: any) => {
          localStorage.setItem("ipSaveData", JSON.stringify(res));
          const loc = res.countryCode;
          return this.http.get(this.mainData.zoom_webcast + `/type/zoom/loc/${loc}/device/web`);
        })
      );
  }

  leadSquare(data: any): Observable<any> {
    const url = 'https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture?accessKey=u%24r41e9cf79fbe9e8fb1379734e8f44322a&secretKey=ae137b8814e8fe740b0ac0158898e7f5b1051110'
    // const url = "https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.CreateOrUpdate?accessKey=u$r41e9cf79fbe9e8fb1379734e8f44322a&secretKey=ae137b8814e8fe740b0ac0158898e7f5b1051110"
    const httpHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json"
    });
    const options = {
      headers: httpHeaders,
    }

    const data1: any = JSON.stringify(data);
    return this.http.post(url, data1, options);
  }
  sendChatMessage(data: any): Observable<any> {
    return this.http.post(`https://subs.artofliving.app/aol_mservice/v10/groupchat/post`, data);
  }
  getChatMessage(room_name: any) {
    return this.http.get(`https://subs.artofliving.app/aol_mservice/v10/get/group/chat/users/filter/${room_name}`);

  }
  deleteLookup(data: any): Observable<any> {
    return this.http.post(this.mainData.delete_account_lookup, data);
  }
  submitFeedback(data: any): Observable<any> {
    return this.http.post(this.mainData.user_feedback, data);
  }
}