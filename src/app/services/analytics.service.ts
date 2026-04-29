import { Injectable } from '@angular/core';
import * as firebase from "firebase/app";
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private userProperties: { [key: string]: any } = {};

  constructor() { }

  // Initialize user properties dynamically from localStorage
  private initializeUserProperties(): void {
    const taploginInfo = localStorage.getItem('taploginInfo');
    const userId = taploginInfo ? JSON.parse(taploginInfo).id : '';


    const isSubscriberRaw = localStorage.getItem('is_subscriber');
    const isSubscriber = isSubscriberRaw !== null ? Number(isSubscriberRaw) : null;
    let userStatus = 'guest';
    if (userId) {
      if (isSubscriber == 1) {
        userStatus = 'subscriber';
      } else {
        userStatus = 'free';
      }
    }
    const subs: any = localStorage.getItem('ott_subscriptionPlan');
    const firstOTTPackage = subs
      ? JSON.parse(subs).packages_list.find((res: any) => res.package_mode === 'OTT')
      : null;
    const userPlan = firstOTTPackage ? firstOTTPackage.title : '';

    this.userProperties = {
      user_id: userId,
      user_plan: userPlan,
      user_status: userStatus,
    };
  }

  // Set user properties in Firebase Analytics
  private setUserProperties(): void {
    firebase.analytics().setUserProperties(this.userProperties);
    // console.log(this.userProperties);

  }

  // Log an event and include user properties
  logEvent(eventName: string, eventParams: { [key: string]: any } = {}): void {
    this.initializeUserProperties();
    this.setUserProperties();
    firebase.analytics().logEvent(eventName, { ...eventParams, ...this.userProperties });
  }
}
