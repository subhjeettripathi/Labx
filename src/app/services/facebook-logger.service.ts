import { Injectable } from '@angular/core';
declare var FB: any;
@Injectable({
  providedIn: 'root'
})
export class FacebookLoggerService {

  constructor() {
        // Ensure FB SDK is loaded
        if (typeof FB !== 'undefined') {
          FB.XFBML.parse();
        }
   }

   logCheckoutEvent(sub: any) {
    if (typeof FB !== 'undefined') {
      FB.AppEvents.logEvent('fb_web_initiated_checkout', {
        'currency': sub.s_package.p_currency,
        'amount': sub.s_package.p_price,
        'package_id': sub.s_id
      });
      console.log('FB Event Logged:', sub);
    } else {
      console.error('Facebook SDK not loaded');
    }
  }

  logRegistrationEvent(userId: string) {
    if (typeof FB !== 'undefined') {
      FB.AppEvents.logEvent('fb_web_complete_registration', {
        'userId': userId
      });
      console.log('FB Event Logged: fb_web_complete_registration with userId', userId);
    } else {
      console.log('Facebook SDK not loaded');
    }
  }

  logPurchaseEvent(userInfo: string, dataFireGet: any, currencyValueFacebook: number) {
    if (typeof FB !== 'undefined') {
      const userId = JSON.parse(userInfo).id;

      FB.AppEvents.logEvent('fb_web_purchase', {
        'userId': userId,
        'currency': dataFireGet.currency,
        'value': currencyValueFacebook,
        'transaction_id': dataFireGet.trans_id
      });

      console.log('FB Event Logged: fb_mobile_purchase', {
        userId,
        currency: dataFireGet.currency,
        value: currencyValueFacebook,
        transaction_id: dataFireGet.trans_id
      });
    } else {
      console.error('Facebook SDK not loaded');
    }
  }
}
