import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiConstants } from '../api.constants';
import { ConfigService } from '../config.service';
const TOKEN_KEY = 'auth_token';
// const REFRESHTOKEN_KEY = 'auth_token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  BASE_URL = environment.baseUrl;
  ACCESS_TOKEN = ApiConstants.ACCESS_TOKEN;
  tokenSubject = new Subject<any>();
  constructor(private http: HttpClient,private configService:ConfigService) {


  }
  getTokenInfo() {
    const auth = 'abd07061a3dd9851e3c9dd551e68e2689b1890d734f88a1e1b43e91e1dd529050606ed1ce0833455db1c2f9ec38243b56a66100fe22c7ac02658eeeb67345a6916ac6df57be52f8dae4316350db6c174';
    const headerDict = {
      'authorization': auth
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get(this.configService.getApiUrl('auth_access_token'), requestOptions);

  }
  sendMessage(token: any) {
    this.tokenSubject.next({ text: token });
  }
  getMessage(): Observable<any> {
    return this.tokenSubject.asObservable();
  }

  // refresh new 
  refreshToken() {
    const auth = 'abd07061a3dd9851e3c9dd551e68e2689b1890d734f88a1e1b43e91e1dd529050606ed1ce0833455db1c2f9ec38243b56a66100fe22c7ac02658eeeb67345a6916ac6df57be52f8dae4316350db6c174';
    const headerDict = {
      'authorization': auth
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get(this.configService.getApiUrl('auth_access_token'), requestOptions);
  }
  removeToken(): void {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  public saveToken(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  public saveRefreshToken(token: string): void {
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
}