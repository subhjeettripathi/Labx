import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";

import { DeviceDetectorService } from "ngx-device-detector";
import { PaymentQueryModalDialogComponent } from "../payment-query-modal-dialog/payment-query-modal-dialog.component";
import { OtherQueryModalDialogComponent } from "../other-query-modal-dialog/other-query-modal-dialog.component";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DataService } from "src/app/services/data.service";
@Component({
  selector: "app-contactus-modal-dialog",
  templateUrl: "./contactus-modal-dialog.component.html",
  styleUrls: ["./contactus-modal-dialog.component.scss"],
})
export class ContactusModalDialogComponent implements OnInit {
  loggedIn = localStorage.getItem("ott_isLoggedIn");
  queryForm: any = [];
  constructor(
    private _DS: DataService,
    public dialogRef: MatDialogRef<ContactusModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceDetectorService,
    public dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getConfigData();
  }
  onNoClick() {
    this.dialogRef.close();

  }
  openDialog() {
    window.scroll(0, 0);
    this.dialogRef.close();
    this.openPaymentDialog();

  }
  openPaymentDialog(): void {
    document.body.style.overflow = 'hidden'


    if (this.loggedIn == "1") {
      const dialogRef = this.dialog.open(PaymentQueryModalDialogComponent, {
        panelClass: "query-mdl",
        backdropClass: "popupBackdropClass",
        width: "450px",
        data: { name: "paymentQuery" },
      });
      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow = 'auto'
      });
    } else {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        panelClass: "logindialog",
        backdropClass: "popupBackdropClass",
        width: "390px",
        data: { name: "login" },
      });
      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow = 'auto'
      });
    }
  }
  getConfigData() {
    this._DS.faqData().subscribe((res: any) => {

      this.queryForm = res.Form[0].contactus;
      console.log(this.queryForm, "ggggggg");

    });
  }

  openDialogOtherQuery() {
    this.openOtherQueryDialog();
    this.dialogRef.close();
  }
  openOtherQueryDialog(): void {
    document.body.style.overflow = 'hidden'
    const dialogRef = this.dialog.open(OtherQueryModalDialogComponent, {
      autoFocus: true,
      restoreFocus: true,
      backdropClass: "popupBackdropClass",
      panelClass: "otherQueryModal",
      width: "450px",
      data: { name: "otherQuery" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      document.body.style.overflow = 'auto'
    });
  }
  subscribe() {
    this.router.navigate(["/subscribe"]);
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
     this.router.navigate(["/"]);
  }
}
