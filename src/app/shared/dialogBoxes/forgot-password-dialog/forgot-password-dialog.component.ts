import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import Swal from "sweetalert2";
import { OtpResetPasswordComponent } from "../otp-reset-password/otp-reset-password.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
@Component({
  selector: "app-forgot-password-dialog",
  templateUrl: "./forgot-password-dialog.component.html",
  styleUrls: ["./forgot-password-dialog.component.scss"],
})
export class ForgotPasswordDialogComponent implements OnInit {
  emailLoginForm!: FormGroup;
  @Input() emailOption: string = "";
  @Output() dialogClosed = new EventEmitter<void>();

  emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$";
  sendValueToForgotPassword: any;
  result: any;
  emailID: any;
  isSubmitting: boolean = false;
  global: any;
  otpValidation: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpExceeded: boolean = true;
  country: any = [];
  clicked = false;
  errorMsg: any;
  errorAlertData: any;
  otpSecret: any;
 isResetInProgress = false;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService,
    private _fb: FormBuilder,
    private DEC_SER: DecryptService,
    private auth: AuthService,
    public dialog: MatDialog,
    private ed: ExchangeDataService
  ) {}
  baseJson: any = [];
  ngOnInit(): void {
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);
    localStorage.setItem("videoCarousel", "1");

    function makeid(length: any) {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    }

    var gettoken = btoa(this.errorMsg.otpExpiryTime);

    this.otpSecret = makeid(4) + gettoken;

    this.emailID = this.data.name;

    this.emailLoginForm = this._fb.group({
      email: [
        this.data.name,
        Validators.compose([
          Validators.required,
          Validators.pattern(`${this.emailPattern}`),
        ]),
      ],
    });

    this.getJsonPopup();
    this.getCountryConfig();
    this.otpCount();
  }
  getJsonPopup() {
    const popup: any = localStorage.getItem("allJsonPopupData");
    const dataPopup: any = JSON.parse(popup);
    // this.data =dataPopup.PopupList[0].language.languages
    this.baseJson = dataPopup.PopupList[0];

    // this.ds.popupJson().subscribe((res: any) => {
    //   this.data =res.PopupList[0].language.languages
    //   this.baseJson=res.PopupList[0]

    //    })
  }

  getCountryConfig() {
    this.ds.getCountryStateList().subscribe((res: any) => {
      this.country = res.country;
      this.global = res.global_setting;

      if (this.global.is_custom == 1) {
        this.otpValidation = this.global;
      } else {
        this.ipCountryName = localStorage.getItem("ipSaveData");
        this.ipCountry = JSON.parse(this.ipCountryName).countryName;
        this.countryData = this.country.find(
          (x: { name: any }) => x.name === this.ipCountry
        );
        this.otpValidation = this.countryData;
      }
    });
  }
  otpCount() {
    this.ds.otpCountData(this.emailID).subscribe((res: any) => {
      this.totalOtpCount = res.result;
    });
  }

  onSubmitEmailLogin() {
    
    this.clicked = true;

    console.log("kiiii");
    if (
      this.otpValidation.sms_max_hour_limit >=
        this.totalOtpCount.countOtp1_hour &&
      this.otpValidation.sms_max_day_limit >=
        this.totalOtpCount.countOtp24_hours
    ) {
      if (this.emailLoginForm.valid) {
        const formData: any = new FormData();

        let user_id: any = localStorage.getItem("isUserId");
        formData.append("user_id", user_id);
        formData.append("type", "mail");
        formData.append("device", "web");
        // formData.append('type',"otp");
        formData.append("value", this.emailLoginForm.value.email);
        formData.append("payload", this.otpSecret);
        formData.append("mode", "vive");
        this.auth.forgotPassword(formData).subscribe((res: any) => {
          console.log(res, "lllll");
          if (res.code == 1) {
            this.result = res.result;
            // this.DEC_SER.getDecryptedData(res.result);
            // this.getSwalmsg('Your forgot password request is sent. Please check your email', 'success');
            this.dialogRef.close();
            this.clicked = false
            this.gotoResetPassword();
          } else {
            console.log("llllllllll");
          }
        });
      }
    } else {
      this.clicked = true;
      this.otpExceeded = false;
    }
  }
  onNoClick(): void {
    console.log("llllllllllll");
      this.dialogClosed.emit(); 
      console.log("aaaaaaaaaaaaaaaaaaaaaaa");
    this.dialogRef.close();
  }


gotoResetPassword() {

  console.log("ssssssssss");
  if (this.isResetInProgress) {
    console.log("Reset");
    return;
  }

  this.isResetInProgress = true;
  console.log("open");

  setTimeout(() => {
    this.ed.pauseDetailVideo.next(true);
    localStorage.setItem("videoCarousel", "1");
    this.dialogRef.close();
  }, 200);

  setTimeout(() => {
    if (this.dialog.openDialogs.length == 0 || 1) {
      console.log("Opening Reset Password Dialog...");
      
      const dialogRef = this.dialog.open(OtpResetPasswordComponent, {
        panelClass: 'otpResetPassword',
        width: "450px",
        data: { data: this.result, email: this.emailID },
      });

      dialogRef.afterClosed().subscribe(() => {
        if (localStorage.getItem('VideoAutoPlay') === '0') {
          this.ed.pauseDetailVideo.next(false);
        }
        localStorage.setItem('videoCarousel', '0');
        this.isResetInProgress = false; 
      });
    } else {
      this.isResetInProgress = false; 
    }
  }, 300); 
}

}
