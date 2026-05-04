import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FunctionCallingService {

  constructor() { }
  public setParentalLockFast: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public logoutProfile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public socialHIde: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public fgh: BehaviorSubject<any> = new BehaviorSubject<any>("");

  public watchlist: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public restrictionLevel: BehaviorSubject<any> = new BehaviorSubject<any>("");

  public LevelSetToSetting: BehaviorSubject<any> = new BehaviorSubject<any>("");

  public parentalCase2: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loginModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public parentalCreateSubmit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public submitButtonHideForgot: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public mobileUpdateValue: BehaviorSubject<any> = new BehaviorSubject<any>("");

  public emailLinkLOginApi: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //  public openChangePin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
   
  
   public sendToVideols: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

   public contentWatchlist: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

   public removeCoupon: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

   public statePopup: BehaviorSubject<any> = new BehaviorSubject<any>("");
}
