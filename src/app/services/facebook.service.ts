import { Injectable } from '@angular/core';

declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  loginWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          FB.api('/me', { fields: 'id,first_name,last_name,name,email,picture' }, (userInfo: any) => {
            resolve({ ...response.authResponse, ...userInfo });
          });
        } else {
          reject('User cancelled login or did not authorize.');
        }
      }, { scope: 'email,public_profile' });
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve) => {
      FB.logout((res: any) => resolve(res));
    });
  }
}
