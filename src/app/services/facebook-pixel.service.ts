import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FacebookPixelService {

  constructor() { }


  private waitForFbq(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkFbq = () => {
        if ((window as any).fbq) {
          resolve();
        } else {
          setTimeout(checkFbq, 100);
        }
      };
      checkFbq();
    });
  }

  async trackPurchase(value: number, currency: string): Promise<void> {
    try {
      await this.waitForFbq();
      (window as any).fbq('track', 'Purchase', {
        value: value,
        currency: currency
      });
      console.log('Purchase tracked successfully');
    } catch (error) {
      console.error('Error tracking purchase:', error);
    }
  }

  async trackCompleteRegistration(userId: string): Promise<void> {
    try {
      await this.waitForFbq();
  
      (window as any).fbq('track', 'CompleteRegistration', {
        user_id: userId,
        registration_method: 'Website'
      });
  
      console.log('CompleteRegistration event tracked successfully');
    } catch (error) {
      console.error('Error tracking CompleteRegistration event:', error);
    }
  }

  async trackCheckoutEvent(sub: any): Promise<void> {
    try {
      await this.waitForFbq();
  
      (window as any).fbq('track', 'InitiateCheckout', {
        currency: sub.s_package.p_currency,
        value: sub.s_package.p_price,
        package_id: sub.s_id
      });
  
      console.log('Checkout event tracked successfully:', sub);
    } catch (error) {
      console.error('Error tracking checkout event:', error);
    }
  }
  


}
