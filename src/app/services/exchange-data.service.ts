import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeDataService {
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isUserLoggedInModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isSubscribe: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public reload: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public parentalLock: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public openSettingAccount: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hideNav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public changeParentalPinEnable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showFooter: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showRestrict: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public pauseDetailVideo: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public playDetailVideo: BehaviorSubject<string> = new BehaviorSubject<string>('0');
  public continueCleared: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public active: BehaviorSubject<String> = new BehaviorSubject<String>('');
  public totalCount: BehaviorSubject<Number> = new BehaviorSubject<Number>(0);

  public disableToEnableFaste: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public alreadySubscriber: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public directpayment: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public hideMemberAlert: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public humburgerhide: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public openSettingChangePin: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public mobileLinkCode: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public openChangePin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public showrestrict: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public cancelKey :BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showPins: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public playauto: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hider: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {

  }




}
