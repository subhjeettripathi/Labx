import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeCategoryUtilsService {
  home_category_subject = new BehaviorSubject<any>(null);
  home_category_data = this.home_category_subject.asObservable();

  private user = new BehaviorSubject<string>('0');
  castUser = this.user.asObservable();

  constructor(private route: ActivatedRoute) { }
  
  pushHomeCategoryData(data:any){
    this.home_category_subject.next(data);
  }
  getHomeCategoryData(){
    return this.home_category_data.subscribe();
  }

  
  sendDataToComponent(newUser:any){
    this.user.next(newUser); 
  }
}
