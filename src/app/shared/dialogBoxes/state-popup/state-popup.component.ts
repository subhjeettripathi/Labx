import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';

@Component({
  selector: 'app-state-popup',
  templateUrl: './state-popup.component.html',
  styleUrls: ['./state-popup.component.scss']
})
export class StatePopupComponent implements OnInit {
  states: any = [];
  baseSignup: any = []
  // countryAll=country
  searchText: any
  countryAll: any = [];
  baseSignin: any = []
  constructor(public dialogRef: MatDialogRef<StatePopupComponent>,private _DS:DataService,private fcs:FunctionCallingService) { }

  ngOnInit(): void {
    this.getConfigData()
    this. getCountryStatesList()
  }
  close(){
    this.dialogRef.close();
  }
  getConfigData() {
    var res:any=localStorage.getItem('faqData')
    res=JSON.parse(res)
    // this._DS.faqData().subscribe((res: any) => {
      this.baseSignin = res.Form[0].signin
      this.baseSignup = res.Form[0].signup
      console.log(this.baseSignin)
      console.log(this.baseSignup);
      console.log(this.baseSignup.term_condition); 
    // })
  }
  getCountryStatesList() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      console.log(res)
      this.states = res.state;
      this.countryAll = res.country;

    });
  }
  stateSelected(state: any) {
    console.log(state);
    if (state != '') {
      this.dialogRef.close();
      this.fcs.statePopup.next(state)
      // this.stateNamesend = state;
      // this.stateDefault = state
    }



  }
}
@Pipe({
  name: 'filter',
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}