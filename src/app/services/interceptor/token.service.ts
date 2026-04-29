import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiConstants } from '../api.constants';
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
  constructor(private http: HttpClient) {


  }
  getTokenInfo() {
    const auth = 'abd07061a3dd9851e3c9dd551e68e26838b29e87b2baa479c0eb53c95cac2e6bd701b5588ca7a85de55c6504e0c84c44edc468ae6fdb7a48cf170ee055cd7b3a5960795cf0c3d2989f1aedec0d93fd9d';
    const headerDict = {
      'authorization': auth
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get(`https://api.artofliving.app/artoflivingapi/v10/auth/access/token`, requestOptions);

    // return this.http.get(`https://preprodapi.artofliving.app/artoflivingapi/v10/auth/access/token`, requestOptions);


  }
  sendMessage(token: any) {
    this.tokenSubject.next({ text: token });
  }
  getMessage(): Observable<any> {
    return this.tokenSubject.asObservable();
  }

  // refresh new 
  refreshToken() {
    const auth = 'abd07061a3dd9851e3c9dd551e68e26838b29e87b2baa479c0eb53c95cac2e6bd701b5588ca7a85de55c6504e0c84c44edc468ae6fdb7a48cf170ee055cd7b3a5960795cf0c3d2989f1aedec0d93fd9d';
    const headerDict = {
      'authorization': auth
    }
    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    return this.http.get(`https://api.artofliving.app/artoflivingapi/v10/auth/access/token`, requestOptions);

    // return this.http.get(`https://preprodapi.artofliving.app/artoflivingapi/v10/auth/access/token`, requestOptions);
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
    // window.localStorage.removeItem(REFRESHTOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
}