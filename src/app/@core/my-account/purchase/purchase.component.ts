import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { environment } from 'src/environments/environment';
//import * as amplitude from '@amplitude/analytics-browser';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})

export class PurchaseComponent implements OnInit {
  isOttLoggedIn: boolean = false
  isMsg: boolean = false
  isTransactionHistory: boolean = false
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed:boolean = false;
  displayedColumns = ['package_title', 'order_id','start_date','exp_date',"payment_status","invoice_link"];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  public purchaseData = new MatTableDataSource<any>();
  totalData: any = []
  constructor(private _ds: DataService, private DEC_SER: DecryptService, public router: Router,private ed:ExchangeDataService) {
    this.ed.isUserLoggedIn.subscribe((value) => {
      if (value == true) {
        this.isOttLoggedIn = value;
      }
    });
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
   }
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  
  uid: any;;

  ngOnInit(): void {
    
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }

    this.getViewTransactionHistory()
  }

  openTransactionHistory(){
    if(this.totalData.length){
      this.isTransactionHistory = true
    }else{
      this.isMsg = true
    }
    }
    
 
     userInfo:any;
     userDetails:any;
    
  // download(data:any){
  //   const link = document.createElement('a');
  //   link.setAttribute('target', '_blank');
  //   link.setAttribute('href', data);
  //   link.setAttribute('download', data);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // }

  gotoSubscribed(){
    localStorage.removeItem("packcheking")
    localStorage.removeItem('newuser')
    this.router.navigate(["/subscribe"]);
  }
  getViewTransactionHistory() {
    this.uid = this.loginId.id;
    
    this._ds.getBillingHistory().subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);

      let decryptData = JSON.parse(this.DEC_SER.decryptData);

      this.purchaseData = decryptData.billing_history;
      this.totalData = decryptData.billing_history
      // console.log(decryptData,"hhhhhhhhh");

    })
  }
}
export interface Element {
  order: number;
  position: string;
  payment: string;
  expiry: string;
  purchase: string;
  status: string;
  invoice: string;
}


const ELEMENT_DATA: Element[] =
  [
    { position: 'ALTBalaji Yearly (IN) ₹300', order: 1235365465, payment: 'Wallet', purchase: '12-02-2023 15:13', expiry: '12-02-2023 15:13', status: 'Active', invoice: 'Download' },
    { position: 'ALTBalaji Yearly (IN) ₹300', order: 2238763464, payment: 'Credit Card', purchase: '12-02-2023 15:13', expiry: '12-02-2023 15:13', status: 'Expired', invoice: 'Download' },

  ];