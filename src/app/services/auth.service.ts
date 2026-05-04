import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiConstants } from "./api.constants";
import { Login } from "./model/login";
import { SocialLogin } from "./model/social-login";
import { ConfigService } from "./config.service";
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
  constructor(private http: HttpClient, private configService: ConfigService) { }


  ottLogin(login: Login): Observable<Login> {
    return this.http.post<Login>(this.configService.getApiUrl('login') + "/device/web", login);
  }
  ottLogin1(login: any): Observable<Login> {
    return this.http.post<Login>(this.configService.getApiUrl('check_email'), login);
  }
  ottSignup(signup: any): Observable<any> {
    return this.http.post<any>(this.configService.getApiUrl('add'), signup);
  }
  ottSocialLogin(socialLogin: SocialLogin): Observable<SocialLogin> {
    return this.http.post<SocialLogin>(this.configService.getApiUrl('social'), socialLogin);
  }
  isAllowed(data: any): Observable<any> {
    return this.http.post<any>(this.configService.getApiUrl('device_ifallowed'), data);
  }

  OttcheckUserExisted(status: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('lookup'), status);
  }
  ottOtpLogin(otp: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('login_phone') + "/device/web", otp);
  }

  ottotpresend(otp: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('generate_otp'), otp);
  }
  verifyottOtp(otp: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('user_verify_otp'), otp);
  }
  forgotPassword(data: any) {
    return this.http.post(this.configService.getApiUrl('generate_otp'), data);
  }
  verifyForgetOtp(otp: any): Observable<any> {
    return this.http.post(this.configService.getApiUrl('forgot_verify_otp'), otp);
  }
  deviceInfoGet(user_id: any) {
    return this.http.get(this.configService.getApiUrl('device_list') + `/u_id/${user_id}`);
  }
  resetPassword(resetData: any) {
    return this.http.post(this.configService.getApiUrl('reset_password'), resetData);
  }
  advancedSearch(search_tag: any) {
    return this.http.post(this.configService.getApiUrl('advance_search') + "/device/web/current_offset/0/max_counter/10", search_tag);
  }
  activationCodeTV(data: any) {
    return this.http.post(this.configService.getApiUrl('activation_validate'), data);
  }
}
