
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, combineLatestWith } from 'rxjs';
import { ConfigService } from './config.service';
var baseUrl2 = environment.baseUrl2;
@Injectable({
  providedIn: 'root'
})
export class DataService {
  mainData: any = {};
  device = this.detectBrowserName();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.detectBrowserName()
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

  lBand(packageId: any): Observable<any> {
    return this.http.get(``)
  }


  getMainUrl(id: any, userId: any): Observable<any> {
    const url = `${this.configService.getApiUrl('stream_url')}/vive/id/${id}/user_id/${userId}/device/${this.device}`;
    return this.http.get(url);
  }

  getUnknownUrl(id: any): Observable<any> {
    return this.http.get(this.configService.getApiUrl('stream_url') + `/vive/id/${id}/device/${this.device}`)
  }

  getCategoryList() {

    return this.http.get(this.configService.getApiUrl('catlist') + '/device/web')
  }

  getHomeData(offset: any, display_limit: number, cat_id: any) {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const region: any = localStorage.getItem('regional')
    if (USER_ACCOUNT && (!region || region == 'None')) {
      return this.http.get(this.configService.getApiUrl('home5') + `/device/web/display_offset/${offset}/display_limit/${display_limit}/content_count/12/cat_id/${cat_id}/session/1`);
    } else if (region) {
      return this.http.get(this.configService.getApiUrl('home5') + `/device/web/display_offset/${offset}/display_limit/${display_limit}/content_count/12/cat_id/${cat_id}/lang/${region}/session/1`);
    }
    else {
      return this.http.get(this.configService.getApiUrl('home5') + `/device/web/display_offset/${offset}/display_limit/${display_limit}/content_count/12/cat_id/${cat_id}/session/0`);
    }
  }

  getHomeFavorites(userId: any) {
    return this.http.get(this.configService.getApiUrl('user_favorite_content') + `/device/web/userid/${userId}`)
  }

  versionAPi() {
    return this.http.get(this.configService.getApiUrl('version') + `/web`);
  }

  getDescriptionData(content_id: any) {
    return this.http.get(this.configService.getApiUrl('detail') + `/device/web/content_id/${content_id}`);
  }
  getDescriptionDataList(offset: any, cat_ids: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/12/cat_id/${cat_ids}`);
  }
  getDescriptionDataListHome(offset: any, cat_ids: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/view/all/device/web/current_offset/${offset}/max_counter/12/cat_id/${cat_ids}`);
  }
  getDescriptionDataList1(offset: any, cat_ids: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/view/all/device/web/current_offset/${offset}/max_counter/12/cat_id/${cat_ids}`);
  }
  getSimilarContent(offset: any, cat_ids: any, c_id: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${cat_ids}/cid/${c_id}`);
  }

  getSimilarContentMovie(offset: any, cat_ids: any, c_id: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${cat_ids}/season_id/${c_id}`);
  }
  getGenreContentList(offset: any, genre_ids: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/12/genre_id/${genre_ids}`);
  }
  getExtras(offset: any, cat_ids: any, type: any) {
    return this.http.get(this.configService.getApiUrl('extra_list') + `/device/web/current_offset/${offset}/max_counter/10/cid/${cat_ids}/tp/${type}`);
  }
  getSeasonData(offset: any, season_id: any) {
    return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/10/season_id/${season_id}`);
  }
  getEpisodeData(offset: any, maxcounter: any, season_id: any) {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    if (USER_ACCOUNT) {
      return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/${maxcounter}/season_id/${season_id}/user_id/${USER_ACCOUNT.id}`);
    } else {
      return this.http.get(this.configService.getApiUrl('list') + `/device/web/current_offset/${offset}/max_counter/${maxcounter}/season_id/${season_id}`);
    }
  }
  logout(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('logout'), formData)
  }
  getSubscribeInfo(loc: any): Observable<any> {
    return this.http.get(this.configService.getApiUrl('subs_package_list') + `/web/loc/${loc}`);
  }
  getUserSubscriptionDetails(uid: number): Observable<any> {
    return this.http.get(this.configService.getApiUrl('subs_user_subscriptions') + `/device/web/uid/${uid}`);
  }

  getContinueWatching(offset: number, count: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.configService.getApiUrl('watchlist') + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watching`);
  }
  getContinueWatchingbyId(offset: number, count: number, id: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.configService.getApiUrl('watchlist') + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watching/cat_id/${id}`);
  }

  getWatchList(offset: number, count: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.configService.getApiUrl('watchlist') + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watchlist`);
  }
  getWatchListById(offset: number, count: number, id: number): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.configService.getApiUrl('watchlist') + `/device/web/current_offset/${offset}/max_counter/${count}/user_id/${USER_ACCOUNT.id}/type/watchlist/cat_id/${id}`);
  }



  clearWatchlist(params: any) {
    return this.http.post(this.configService.getApiUrl('clear_watchlist'), params);
  }
  getRecommendedList(offset: number, count: number, userID: any): Observable<any> {
    return this.http.get(this.configService.getApiUrl('recomended') + `/device/web/current_offset/${offset}/max_counter/${count} `);
  }
  getContentUserBehaviour(content_id: any): Observable<any> {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    return this.http.get(this.configService.getApiUrl('user_behavior') + `/user_id/${USER_ACCOUNT.id}/content_id/${content_id}`);
  }

  otpCountData(email: any) {
    return this.http.get(this.configService.getApiUrl('count_otp_contact') + `${email}`);
  }

  addRemoveToWatchList(watchlist: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('add_watchlist'), watchlist);
  }
  getBillingHistory() {
    let loginInfo: any = localStorage.getItem('taploginInfo');
    const user_id: number = JSON.parse(loginInfo).id;
    return this.http.get(this.configService.getApiUrl('billing_history') + `/u_id/${user_id}`)
  }
  autoSuggestData(formData: any): Observable<any> {
    return this.http.get(this.configService.getApiUrl('autosuggest') + `/title/${formData}`)
  }

  faqData() {
    return this.http.get(this.configService.getApiUrl('config_main_developer'));
  }
  json2() {
    return this.http.get(this.configService.getApiUrl('config_inner_developer'));
  }
  errorAlertConfig() {
    return this.http.get(this.configService.getApiUrl('config_error_messages'));
  }
  popupJson() {
    return this.http.get(this.configService.getApiUrl('config_popup_developer'));
  }
  getCountryStateList() {
    return this.http.get(this.configService.getApiUrl('config_country_developer'));
  }

  getSearchApi(search: any): Observable<any> {
    return this.http.get(this.configService.getApiUrl('search') + `/device/web/current_offset/0/max_counter/15/search_tag/${search}`);
  }

  popularRes() {
    return this.http.get(this.configService.getApiUrl('popular_search') + `/device/web/current_offset/0/max_counter/10`);
  }
  recentRes(uid: any): Observable<any> {
    return this.http.get(this.configService.getApiUrl('recent_search') + `/device/web/current_offset/0/max_counter/10/uid/${uid}`);
  }

  profile_edit(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('edit'), formData)
  }


  delete_account(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('delete_account'), formData)
  }
  parentalControl(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('parental_add'), formData);

  }
  parentalGet() {
    return this.http.get(this.configService.getApiUrl('age_group') + '/device/web')
  }

  analyticsSubmit(analytics: any) {
    return this.http.post(this.configService.getApiUrl('analytics_mservice') + '/device/web', analytics);
  }
  redeemCoupon(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('coupon_validate') + '/device/web', formData)
  }
  apipip() {
    return this.http.get(this.configService.getApiUrl('ip_location') + '/device/web')
  }

  parentalAuth(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('parental_validate'), formData)
  }
  changePin(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('parental_change'), formData)
  }
  forgotOtp(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('generate_otp'), formData)
  }
  verifyOtp(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('user_verify_otp'), formData)
  }
  clearContinueWatching(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('clear_continue_watching'), formData)
  }
  consentData(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('consent'), formData)
  }
  pinForgotParental(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('parental_forgot'), formData)
  }
  pinParentalVerify(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('user_verify_otp'), formData)
  }
  pinParentalCreate(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('parental_reset_pin'), formData)
  }
  addPopularContent(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('popular_add'), formData)
  }
  subtitleSet(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('setting'), formData)
  }
  getSubtitle(u_id: any) {
    return this.http.get(this.configService.getApiUrl('get_setting') + `/device/web/u_id/${u_id}`)
  }
  restrictionLevelSet(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('parental_level'), formData)
  }
  resendOtp(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('generate_otp'), formData)
  }
  emailLinkProfile(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('forgot_link'), formData)
  }
  PasswordSetEmail(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('reset_password_link'), formData)
  }

  subscriptionPackCheck(uid: any) {
    return this.http.get(this.configService.getApiUrl('user_package') + `${uid}`)
  }
  profileSmsPolicy(value: any) {
    return this.http.get(this.configService.getApiUrl('count_otp_email') + `${value}`)

  }
  continueWatch(userId: any) {
    return this.http.get(this.configService.getApiUrl('continue_watching') + `/user_id/${userId}`)
  }
  userContentData(userId: any) {
    return this.http.get(this.configService.getApiUrl('user_content_data') + `/device/web/userid/${userId}`)
  }
  regionalLang(offset: any) {
    const region: any = localStorage.getItem('regional')
    return this.http.get(this.configService.getApiUrl('lang_content') + `/device/web/content_count/12/current_offset/${offset}/lang/${region}`)
  }
  regionalLangAllData(offset: any) {
    const region: any = localStorage.getItem('regional')
    return this.http.get(this.configService.getApiUrl('lang_content') + `/layout/verticle/device/web/content_count/12/current_offset/${offset}/lang/${region}`)
  }
  paymentQuery(data: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('contact_us'), data);
  }


  cancelSubscription(formdata: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('cancel_subscription') + `/device/web`, formdata);
  }

  userSession(formData: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('customer_session'), formData)
  }
  feels(offset: any, count: any) {
    return this.http.get(this.configService.getApiUrl('get_shorts') + `/web/current_offset/${offset}/max_counter/${count}`)
  }

  createOrder(formData: any): Observable<any> {
    const url = this.configService.getApiUrl('subs_create_order_onetime') + `/device/web`;
    return this.http.post(url, formData);
  }

  getListCast(id: any) {
    return this.http.get(this.configService.getApiUrl('cast_list') + `/device/web/content_id/${id}`);
  }

  getCastData(id: any) {
    return this.http.get(this.configService.getApiUrl('Cast_data') + `/device/web/offset/0/limit/10/cast_id/${id}`)
  }

  getAdsApi() {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const SubInfo: any = localStorage.getItem('is_subscriber');
    const packageId: any = localStorage.getItem('ott_subscriptionPlan');
    const packageGet: any = JSON.parse(packageId)
    if (USER_ACCOUNT) {
      if (SubInfo == '1') {
        return this.http.get(this.configService.getApiUrl('get_ad') + `/device/web/user_id/${USER_ACCOUNT.id}/package_id/${packageGet.packages_list[0].package_id}`)
      } else {
        return this.http.get(this.configService.getApiUrl('get_ad') + `/device/web/user_id/${USER_ACCOUNT.id}`)
      }
    } else {
      return this.http.get(this.configService.getApiUrl('get_ad') + `/device/web`)
    }
  }





}