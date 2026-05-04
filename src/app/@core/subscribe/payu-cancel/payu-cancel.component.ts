import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContactusModalDialogComponent } from "src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component";
@Component({
  selector: 'app-payu-cancel',
  templateUrl: './payu-cancel.component.html',
  styleUrls: ['./payu-cancel.component.scss']
})
export class PayuCancelComponent implements OnInit {
  // @Output() sendValueToTabThree = new EventEmitter<any>();
  constructor(private router:Router,public dialog: MatDialog,) { }
  USER_ACCOUNT_id:any
  ipAddress:any;
  currency:any;
  sessionId:any;
  paymentData:any;
  app_version:any;
  ngOnInit(): void {
    this.app_version= localStorage.getItem('appVersion')
  }
  gotoSubscribe(){
 
    // sessionStorage.setItem('tab3','3')
    this.router.navigateByUrl("/subscribe")
  }
  openContactUsDialog(): void {
    const dialogRef = this.dialog.open(ContactusModalDialogComponent, {
      panelClass: "contactfooter",
      backdropClass:'popupBackdropClass',     
      data: { name: "login" },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

}
