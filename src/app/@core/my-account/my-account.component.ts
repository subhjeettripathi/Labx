import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { Meta } from '@angular/platform-browser';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ConsentDeleteAccountComponent } from 'src/app/shared/dialogBoxes/consent-delete-account/consent-delete-account.component';
import { MatDialog } from '@angular/material/dialog';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { ParentalCreatePinCheckComponent } from 'src/app/shared/dialogBoxes/parental-create-pin-check/parental-create-pin-check.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  showMsg: boolean = false
  isOpenSetting = false
  update_Mail: any;
  val: any;
  panelOpenState: boolean = false
  sendTosettingSubtitle: any;
  hideDeactivetButton: boolean = false
  sendToSetting: any;
  accoutSection: any;
  displayedColumns = ['package_title', 'order_id', 'payment_mode', 'start_date', 'exp_date', "payment_status", "invoice_link"];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  public purchaseData = new MatTableDataSource<any>();
  totalData: any = []
  uid: any;
  loginId: any;
  private _ds: any;
  constructor(private location: Location, private ed: ExchangeDataService, private _SWAL: SwalMsgService, private metaService: Meta, private ds: DataService, private DEC_SER: DecryptService, private dialog: MatDialog, private analyticsService: AnalyticsService,public router: Router) {

    const loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
    this.ed.openSettingAccount.pipe(first()).subscribe(value => {
      if (value == true) {
        this.isOpenSetting = value;
      }
      this.ed.openSettingAccount.next(false);
    });
    // this.addTag();
  }
  ngOnInit(): void {
    // let ott_userid: any = localStorage.getItem("taploginInfo");
    // const userInfo: any = JSON.parse(ott_userid)
    // const formData: any = new FormData();
    // formData.append('user_id',userInfo.id );
    // if(data=='delete'){
    //   formData.append('flag', '-1');
    // }else{
    //   formData.append('flag', '1');
    // } 
    //   this.ds.deleteLookup(formData).subscribe((res:any)=>{
    // console.log(res)
    // if(res.code ==1){
    // this.hideDeactivetButton=true
    // }else if(res.code ==2){
    //   this.hideDeactivetButton=true
    // }
    //   })
    window.scroll(0, 0)
    this.getConfigData()
    // this.addTag();
    var emalid: any = localStorage.getItem('taploginInfo')
    var id = JSON.parse(emalid)
    if (id.email == "") {
      var emailValueGet = localStorage.getItem("emailSavedCaseMobile")
      this.update_Mail = emailValueGet
      this.val = true
      // this.mobileHide=true
      this.getViewTransactionHistory()

    }
  }
  getConfigData() {
    this.ds.popupJson().subscribe((res: any) => {
      console.log(res)
      localStorage.setItem("popupJson", JSON.stringify(res))
    })
    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
    this.accoutSection = dataPopup.App[0].account[0].main_section
    console.log(this.accoutSection)

  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
     this.router.navigate(['/'])
    }
  }

  delete(data: any) {
    if (data == 'delete') {
      const eventParams = {};
      this.analyticsService.logEvent('delete_interaction', eventParams);
    } else {
      const eventParams = {};
      this.analyticsService.logEvent('deactivate_interaction', eventParams);
    }
    let ott_userid: any = localStorage.getItem("taploginInfo");
    const userInfo: any = JSON.parse(ott_userid)
    if (userInfo.email != '') {
      const formData: any = new FormData();
      formData.append('user_id', userInfo.id);

      this.ds.deleteLookup(formData).subscribe((res: any) => {
        console.log(res)
        if (res.code == 0) {
          if(this.dialog.openDialogs.length==0){
            const dialogRef = this.dialog.open(ConsentDeleteAccountComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'adultAgePopup',
              width: "390px",
              data: { data: data }
            });
          }
      
        }
        else if (res.code == 1) {
          this._SWAL.getSwalmsg(res.result, 'error');

        }
        else if (res.code == 2) {
          if (data == 'delete') {
            if(this.dialog.openDialogs.length==0){
              const dialogRef = this.dialog.open(ConsentDeleteAccountComponent, {
                backdropClass: 'popupBackdropClass',
                panelClass: 'adultAgePopup',
                width: "390px",
                data: { data: data }
              });
            }
          
          } else {
            this._SWAL.getSwalmsg(res.result, 'error');
          }

        }
        else {
          this._SWAL.getSwalmsg(res.result, 'error');
        }
      })
    } else {
      const dialogRef = this.dialog.open(ParentalCreatePinCheckComponent, {
        backdropClass: 'popupBackdropClass',
        panelClass: 'adultAgePopup',
        width: "390px",
        data: { data: data }
      });
    }



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
    this.uid = this.loginId.id;
    console.log(this.uid);
    this._ds.getBillingHistory().subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      this.purchaseData = decryptData.billing_history;
      this.totalData = decryptData.billing_history
      console.log(decryptData);
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




