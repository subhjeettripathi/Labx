import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ContactusModalDialogComponent } from "src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
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
  constructor(private ds: DataService,  public dialog: MatDialog,) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.faq();
  }
  faq() {
    var data:any=localStorage.getItem('innerJson')
    data=JSON.parse(data)
    // this.ds.json2().subscribe((data: any) => {
      this.key = data.Form[0].faq;
      this.default = this.key[0]['type'];
      this.key.filter((res: any) => {
        if (this.default == res.type) {
          this.res0 = res.data;
        }
      })
      this.common_data = data.Form[0].faq.type;
      this.res0 = this.key.type[this.default];
    // })
  }
  toggler_sign() {
    this.toggler = false;

  }
  open(value: any) {
    this.common = true;
    console.log(value);
    this.tab_id = value;
    this.key.filter((res: any) => {
      if (value == res.type) {
        console.log(res.data);
        this.res1 = res.data;
      }
    })
  }
openLoginDialog(): void {

    const dialogRef = this.dialog.open(ContactusModalDialogComponent, {
      panelClass: "contactfooter",
      backdropClass:'popupBackdropClass',
      width: "450px", 
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }


}
