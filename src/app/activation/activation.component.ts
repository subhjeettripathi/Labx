import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { ExchangeDataService } from "../services/exchange-data.service";
import { FingerPrintService } from "../services/finger-print.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { Location } from "@angular/common";

import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataService } from "../services/data.service";
import { AdultAgePopupComponent } from "../shared/dialogBoxes/adult-age-popup/adult-age-popup.component";
@Component({
  selector: "app-activation",
  templateUrl: "./activation.component.html",
  styleUrls: ["./activation.component.scss"],
})
export class ActivationComponent implements OnInit, AfterViewInit {
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  @ViewChild("editCompanyModal")
  editCompanyModal!: TemplateRef<any>;
  private editCompanyDialogRef!: MatDialogRef<TemplateRef<any>>;
  @ViewChild("successModal")
  successModal!: TemplateRef<any>;
  private successDialogRef!: MatDialogRef<TemplateRef<any>>;
  mesg: any;
  visitorId: any;
  user_id: any;

  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: false,

    placeholder: "",

    inputStyles: {
      width: "50px",
      "margin-right": "16px",
      color: "white",
      "background-color": "transparent",
      "border-bottom": "2px solid #939393",
      "border-left": "none",
      "border-right": "none",
      "border-top": "none",
      // 'border': 'none',
      outline: "none",
      "border-radius": "0px",
    },
    inputClass: "dfg",
  };
  basesignin: any;
  otpInput = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  constructor(
    private _FPS: FingerPrintService,
    private ds: DataService,
    private auth: AuthService,
    private router: Router,
    private ed: ExchangeDataService,
    public dialog: MatDialog,
    private location: Location
  ) {
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));
  }

  ngOnInit(): void {
    if (localStorage.getItem("taploginInfo")) {
      var data: any = localStorage.getItem("taploginInfo") || {};
      var data_read = JSON.parse(data);
      this.user_id = data_read.id;
    } else {
      this.openLoginDialog();
    }

    this.getConfigData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  }

  getConfigData() {
    const popup: any = localStorage.getItem("allJsonPopupData");
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0];
    console.log(dataPopup.PopupList[0]);
    // this.ds.popupJson().subscribe((res: any) => {
    //   this.basesignin=res.PopupList[0]
    //   console.log( this.basesignin);

    // })
  }
  onOtpChange(otp: any) {
    console.log(otp);
  }
  close() {
    this.editCompanyDialogRef.close();
  }
  successDialogClose() {
    this.successDialogRef.close();
  }
  openCompanyDetailsDialog(): void {
    // if(this.dialog.openDialogs.length==0){
    //   const dialogRef = this.dialog.open(AdultAgePopupComponent, {
    //     panelClass: "adultAgePopup",
    //     width: "500px",
    //     data: { dat: event },
    //   });
    // }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";
    (dialogConfig.position = {
      // top: '13vh',
    }),
      (dialogConfig.panelClass = "adultAgePopup");

    if (this.dialog.openDialogs.length == 0) {
      this.editCompanyDialogRef = this.dialog.open(
        this.editCompanyModal,
        dialogConfig
      );
    }
  }
  onVerifyOtp() {
    let data: any = localStorage.getItem("taploginInfo");
    if (this.otpInput.value.length < 4) {
      this.openCompanyDetailsDialog();
      // this.mesg = 'Activation Code is not valid';

      this.mesg = "invalid_Activation_Code";
    }
    if (this.otpInput.valid) {
      if (localStorage.getItem("taploginInfo")) {
        const formData: any = new FormData();
        formData.append("activation_code", this.otpInput.value);
        formData.append("u_id", JSON.parse(data).id);
        formData.append("device_unique_id", this.visitorId);

        this.auth.activationCodeTV(formData).subscribe((res: any) => {
          if (res.code == 1) {
            this.router.navigate(["/activation-success"]);
            // this.openSuccessDetailsDialog()
            // this.mesg='Activation Code is verified successfully!';
          } else {
            this.openCompanyDetailsDialog();
            // this.mesg = 'Activation Code is not valid';
            this.mesg = "invalid_Activation_Code";
          }
        });
      } else {
        this.openCompanyDetailsDialog();
        // this.mesg = "Please login first!";
        this.mesg ='Please_login_first';
      }
    }
  }
  navbarItems: any[] = [];

  // logout(){

  //   this.openLoginDialog()
  // }
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "390px",
      data: { name: "login" },
    });
    const sub = dialogRef.componentInstance.isLoggedIn.subscribe(
      (data: any) => {
        // this.is_loginInfo = data;
        // this.isLoggedInforLayout.emit(data);
      }
    );
    dialogRef.afterClosed().subscribe((result) => {});
    dialogRef.disableClose = true;
  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(["/"]);
    }
  }
}
