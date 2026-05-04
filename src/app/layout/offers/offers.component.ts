import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  offersData:any;
  offers:any;
  constructor( public router: Router, private ds: DataService, ) {
    this.getHeaderConfig()
    if( localStorage.getItem("packcheking") == "1" && this.router.url == "/offers"){
   
      
     }else{
      if (this.router.url == "/offers" && localStorage.getItem("is_subscriber") == "1") {
      
        this.router.navigate(["/my-subscription"]);
      }
     }
  }
  ngOnInit(): void {
    window.scroll(0,0)
  }

  getHeaderConfig() {
    this.ds.faqData().subscribe((res: any) => {
     this.offersData=res.App[0].menu
      this.offers = this.offersData.find((x:any)=>x.type == "offers");
      });
  }
  gotoSubscribe(offers:any){
  
    
   if(localStorage.getItem("ott_isLoggedIn") == "1"){
    localStorage.setItem('packcheking','1' )
    let pkgData = {
      'level':offers.offer_price||'',
      'pkdId': offers.offer_package_id||'',
      'discount':offers.offer_discount_amount||'',
      'coupon_code':offers.offer_coupon_code||'',
      'month':offers.offer_validity||'',
      'currency':offers.offer_currency||'',
     };
    localStorage.setItem('pkgData',JSON.stringify(pkgData))
    this.router.navigate(["/subscribe"]);
  }else{
    this.router.navigate(["/subscribe"]);
  }
   }
}
