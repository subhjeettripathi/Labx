import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ThirdPartyIntegrationService {
  baseUrl='https://tp.multitvsolution.com';
  constructor(private http:HttpClient) { }
   
  paymentQuery(data:any):Observable<any>{
    const url =`${this.baseUrl}/freshdesk/contactus`;
    return this.http.post(url, data);
  }
}
