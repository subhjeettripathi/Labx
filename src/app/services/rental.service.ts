import { Injectable } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RentalService {

  constructor() { }



  rental = new BehaviorSubject<any>(null);
  rental1 = this.rental.asObservable();

  private user = new BehaviorSubject<string>('0');
  castUser = this.user.asObservable();


  
  pushHomeCategoryData(data:any){
    this.rental.next(data);
  }
  getHomeCategoryData(){
    return this.rental1.subscribe();
  }

  
  sendDataToComponent(newUser:any){
    this.user.next(newUser); 
  }
}
