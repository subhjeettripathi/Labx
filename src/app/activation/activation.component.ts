import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DecryptService } from "src/app/services/decrypt.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ExchangeDataService } from '../services/exchange-data.service';
import { FingerPrintService } from '../services/finger-print.service';
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { environment } from 'src/environments/environment';
//import * as amplitude from '@amplitude/analytics-browser';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { ContactusModalDialogComponent } from '../shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss'],

})
export class ActivationComponent implements OnInit {
  visitorId: any = localStorage.getItem('device_id')
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  @ViewChild('editCompanyModal')
  editCompanyModal!: TemplateRef<any>;
  private editCompanyDialogRef!: MatDialogRef<TemplateRef<any>>;
  @ViewChild('successModal')
  successModal!: TemplateRef<any>;
  private successDialogRef!: MatDialogRef<TemplateRef<any>>;
  mesg: any;
  user_id: any
  isSubmitting = false;
  showContactUs = false;
  submitted = false;
  childclass:boolean = false
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  @Input() customContext: 'accountPage' | 'default' = 'default';
  isSubscribed = false;
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: true,

    placeholder: '',

    inputStyles: {
      'width': '70px',
      'color': 'white',
      'background-color': 'transparent',
      'border-top': 'none',
      'border-left': 'none',
      'border-right': 'none',
      'border-bottom': '2px solid #AAAAAA',
      'outline': 'none',
      'border-radius': '0px'
    },

    inputClass: "dfg"
  };
  basesignin: any;
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  constructor(private _FPS: FingerPrintService, private _dd: DataService, private ds: DataService, private auth: AuthService, private router: Router, private ed: ExchangeDataService, public dialog: MatDialog, private DEC_SER: DecryptService) {
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }
  ngAfterViewInit() {

    // const otpInputs = document.querySelectorAll('input');
    // otpInputs.forEach((input: any) => {
    //   input.setAttribute('type', 'text');
    //   input.setAttribute('inputmode', 'numeric');
    //   input.setAttribute('pattern', '[0-9]*');
    //   input.setAttribute('autocomplete', 'one-time-code');
    //   input.setAttribute('autocorrect', 'off');
    //   input.setAttribute('autocapitalize', 'off');
    // });
  }
  ngOnInit(): void {
    if (this.customContext === 'accountPage') {
      this.childclass = true
      // change behavior
    }
    window.scroll(0, 0);
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    if (!this.isSubscribed) {
      // this.dialog.open(ContactusModalDialogComponent, {
      //   panelClass: "premium",
      //   backdropClass: 'popupBackdropClass',
      //   width: "450px",
      //   disableClose: true,
      // });
      this.showContactUs = true
    }
    this._dd.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }
      // localStorage.setItem("ipSaveData", JSON.stringify(res));
    });
    if (localStorage.getItem('taploginInfo')) {
      var data: any = localStorage.getItem('taploginInfo') || {}
      var data_read = JSON.parse(data)
      this.user_id = data_read.id
    } else {
      this.openLoginDialog()
    }

    this.getConfigData()
  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0]

    // this.ds.popupJson().subscribe((res: any) => {
    //   this.basesignin=res.PopupList[0]


    // })
  }
  onOtpChange(otp: any) {

  }
  userInfo: any;
  userDetails: any;


  close() {
    console.log("hhhhhh");
    this.isSubmitting = false
    this.editCompanyDialogRef.close();
  }
  successDialogClose() {
    this.isSubmitting = false

    this.successDialogRef.close();
  }
  openCompanyDetailsDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';
    dialogConfig.position = {
      // top: '13vh',

    },
      dialogConfig.panelClass = 'adultAgePopup';

    this.editCompanyDialogRef = this.dialog.open(this.editCompanyModal, dialogConfig);

  }
  subscribe() {
    this.router.navigate(["/subscribe"]);
    this.showContactUs = false;

    // this.dialogRef.close();
  }
  onVerifyOtp() {


    if (this.isSubmitting) return;
    this.submitted = true;
    if (this.otpInput.invalid) {
      this.otpInput.markAsTouched();  // ensures error shows up in UI
      return;
    }
    let data: any = localStorage.getItem('taploginInfo')
    if (this.otpInput.valid) {
      if (localStorage.getItem('taploginInfo')) {
        this.isSubmitting = true;
        const formData: any = new FormData();
        formData.append('activation_code', this.otpInput.value);
        formData.append('u_id', JSON.parse(data).id);
        formData.append('device_unique_id', this.visitorId);

        this.auth.activationCodeTV(formData).subscribe((res: any) => {

          if (res.code == 1) {
            this.router.navigate(['/activation-success'])
            // this.openSuccessDetailsDialog()
            // this.mesg='Activation Code is verified successfully!';
          }
          else {


            this.openCompanyDetailsDialog()
            this.mesg = 'Activation Code is not valid';
          }
        })
      } else {
        this.isSubmitting = false;
        this.openCompanyDetailsDialog()
        this.mesg = 'Please login first!';
      }

    }




  }
  navbarItems: any[] = [];

  // logout(){





  //   this.openLoginDialog()
  // }
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'logindialog',
      width: "390px",
      data: { name: "login" },
    });
    const sub = dialogRef.componentInstance.isLoggedIn.subscribe((data: any) => {

      // this.is_loginInfo = data;
      // this.isLoggedInforLayout.emit(data);
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }
}
