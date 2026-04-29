import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})

export class PurchaseComponent implements OnInit {
  displayedColumns = ['package_title', 'order_id', 'payment_mode','start_date','end_date',"status","invoice_link"];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  public purchaseData = new MatTableDataSource<any>();
  totalData: any = []
  PrimeData:any=[]
  currentDateGet:any
  OttData:any=[]
  constructor(private _ds: DataService, private DEC_SER: DecryptService) { }
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  uid: any;
  ngOnInit(): void {
    this.getViewTransactionHistory()

  }
 
  // download(data:any){
  //   const link = document.createElement('a');
  //   link.setAttribute('target', '_blank');
  //   link.setAttribute('href', data);
  //   link.setAttribute('download', data);
  //   document.body.appendChild(link);
  //   link.click();
  //   link.remove();
  // }
  getViewTransactionHistory() {

    const currentDate = new Date();

 this.currentDateGet = currentDate.getFullYear() + "-" +
                      ("0" + (currentDate.getMonth() + 1)).slice(-2) + "-" +
                      ("0" + currentDate.getDate()).slice(-2) + " " +
                      ("0" + currentDate.getHours()).slice(-2) + ":" +
                      ("0" + currentDate.getMinutes()).slice(-2) + ":" +
                      ("0" + currentDate.getSeconds()).slice(-2);


    this.uid = this.loginId.id;
    console.log(this.uid);
    this._ds.getBillingHistory().subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      
      
      console.log(decryptData);
      
      this.purchaseData = decryptData.billing_history;
      this.totalData = decryptData.billing_history
      console.log(decryptData.billing_history);
      this.totalData.filter((res:any)=>{
        if(res.package_mode == 'Prime' || res.package_mode == 'PRIME'){
          this.PrimeData.push(res)
        }
      })
      this.totalData.filter((res:any)=>{
        if(res.package_mode == 'OTT'){
          this.OttData.push(res)
        }
      })
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