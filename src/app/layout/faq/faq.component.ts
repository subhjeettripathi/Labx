import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ContactusModalDialogComponent } from "src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  common_data: any;
  key: any;
  keys: any = [];
  tab_id: any;
  res1: any;
  default: any;
  res0: any;
  toggler: any = true;
  common: any = false;
  supportData: any;
  footerFaq:any
  constructor(private ds: DataService,  public dialog: MatDialog,private location:Location,private router:Router) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.faq();

    const popup: any = localStorage.getItem('faqData');
    const faq: any = JSON.parse(popup);
 
    this.supportData=faq.Others.faq_footer


    
  }
  faq() {
    this.ds.json2().subscribe((data: any) => {
      this.key = data.Form[0].faq;
     
      // for(let i of this.key){
      //   this.footerFaq = this.key[i].is_allow

      // }
  
    
      
      this.default = this.key[0]['type'];
      this.key.filter((res: any) => {
        if (this.default == res.type) {
          this.res0 = res.data;
        }
      })
      this.common_data = data.Form[0].faq.type;
      this.res0 = this.key.type[this.default];
    })
  }
  toggler_sign() {
    this.toggler = false;

  }
  open(value: any) {
    this.common = true;
  
    this.tab_id = value;
    this.key.filter((res: any) => {
      if (value == res.type) {
      
        this.res1 = res.data;
      }
    })
  }
openLoginDialog(): void {
  this.router.navigate(["/support"]);
    // const dialogRef = this.dialog.open(ContactusModalDialogComponent, {
    //   panelClass: "contactfooter",
    //   backdropClass:'popupBackdropClass',
    //   width: "450px", 
    //   data: { name: "login" },
    // });

    // dialogRef.afterClosed().subscribe((result) => {});
  }

    
  back(){
    this.location.back();
  }


}
