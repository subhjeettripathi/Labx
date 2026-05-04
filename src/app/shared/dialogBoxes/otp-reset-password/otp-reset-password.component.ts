import { DataSource } from "@angular/cdk/collections";
import { Component, Inject, Input, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import Swal from "sweetalert2";

import { EmailVerifiedDialogComponent } from "../email-verified-dialog/email-verified-dialog.component";
import { ExchangeDataService } from "src/app/services/exchange-data.service";

declare var $: any;
@Component({
  selector: "app-otp-reset-password",
  templateUrl: "./otp-reset-password.component.html",
  styleUrls: ["./otp-reset-password.component.scss"],
})
export class OtpResetPasswordComponent implements OnInit {
  showpassword = false;
  showOtpInput = true;
  showpassword1 = false;
  verifyOtp: boolean = true;
  emailLoginForm!: FormGroup;
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: false,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: "",

    inputStyles: {
      width: "70px",
      color: "white",
      "background-color": "transparent",
      "border-top": "none",
      "border-left": "none",
      "border-right": "none",
      "border-bottom": "2px solid #AAAAAA",
      outline: "none",
      "border-radius": "0px",
    },
    inputClass: "dfg",
  };
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  otpInput = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  otpErrorMessage = "";
  clicked = true;
  timerHide = true;
  display: any;
  userId: any;

  succesShow: boolean = true;
  result: any;
  userEmail: any;
  show: boolean = false;
  country: any = [];
  errorMsg: any;
  errorAlertData: any;
  global: any;
  otpValidation: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpExceeded: boolean = true;
  otpTime: any;
  otpSecret: any;
  @Input() valueIdUserExist: any;
  constructor(
    public dialogRef: MatDialogRef<OtpResetPasswordComponent>,
    private ds: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private auth: AuthService,
    private DEC_SER: DecryptService,
    private _FPS: FingerPrintService,
    public dialog: MatDialog,
    private ed: ExchangeDataService
  ) {
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);

    this.otpTime = Number(this.errorMsg.otpExpiryTime) / 60;
  }
  baseLine: any = [];
  ngOnInit(): void {
    this.timer(this.otpTime);
    this.getConfigData();
    this.getCountryConfig();
    this.userId = this.data.data;
    this.userEmail = this.data.email;
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);

    this.emailLoginForm = this._fb.group({
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      confirm_password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
    this.otpCount();

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
  }
  getConfigData() {
    const popup: any = localStorage.getItem("allJsonPopupData");
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0];

    // this.ds.popupJson().subscribe((res: any) => {

    //  this.baseLine=res.PopupList[0]
    // })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  refreshOtpInput() {
    this.showOtpInput = false;
    setTimeout(() => {
      this.showOtpInput = true;
    }, 10); // allow Angular to destroy and recreate the view
  }
  ngAfterViewInit() {

    const otpInputs = document.querySelectorAll('ng-otp-input input');
    otpInputs.forEach((input: any) => {
      // input.setAttribute('type', 'text');
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('pattern', '[0-9]*');
      input.setAttribute('autocomplete', 'one-time-code');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
    });
  }
  onOtpChange(otp: any) {
    if (otp.length === 0) {
      this.refreshOtpInput();
    }
    if (otp.length != 4) {

      // $("input").css("border", "1px solid #B9B9B9");
      this.verifyOtp = true;
      this.otpErrorMessage = "";
      this.otpInput.reset();
      this.ngOtpInput = "";
      this.show = false;
    }
  }

  resendOtp() {
    console.log("aaaa");
    this.otpCount();
    if (
      this.otpValidation.sms_max_hour_limit >=
      this.totalOtpCount.countOtp1_hour &&
      this.otpValidation.sms_max_day_limit >=
      this.totalOtpCount.countOtp24_hours
    ) {
      this.otpErrorMessage = "";
      this.timerHide = true;
      this.timer(this.otpTime);
      this.clicked = true;
      var user_id: any = localStorage.getItem("isUserId");
      if (this.userEmail != "") {
        console.log("z");
        const formData: any = new FormData();
        formData.append("value", this.userEmail);
        formData.append("type", "mail");
        formData.append("mode", "vive");
        formData.append('user_id', user_id);
        var user_id: any = localStorage.getItem("taploginInfo");
        // formData.append("user_id", JSON.parse(user_id).id);
        // formData.append("payload", this.otpSecret);
        formData.append("device", "web");
        this.auth.forgotPassword(formData).subscribe((res: any) => {
          if (res.code == 1) {
            this.result = res.result;
          } else {
            this.otpErrorMessage = res.result;
          }
        });
      }
    } else {
      this.clicked = true;
      this.otpExceeded = false;
    }
  }
  otpCount() {
    this.ds.otpCountData(this.userEmail).subscribe((res: any) => {
      this.totalOtpCount = res.result;
    });
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

  onSubmitEmailLogin() {
    if (this.otpInput.valid) {
      console.log("aaaaaaaaaaaaa");
      const formData = new FormData();
      var user_id: any = localStorage.getItem("isUserId");
      formData.append("user_id", user_id);
      formData.append("otp", this.otpInput.value);
      formData.append("type", "mail");
      formData.append("mode", "vive");
      this.auth.verifyForgetOtp(formData).subscribe((res) => {
        console.log(res);
        if (res.code === 1) {
          console.log("llllll");
          this.succesShow = false;
          this.DEC_SER.getDecryptedData(res.result);
          this.gotoCreatePassword();
        } else {
          console.log("kkkk");
          this.verifyOtp = false;
          $("input").css("border", "2px solid #FB0000");

          this.otpErrorMessage = "Incorrect Code! Please try again";
        }
      });
    } else {
      console.log("fffffffffffff");
      this.show = true;
      $("input").css("border", "2px solid #FB0000");
    }
  }

  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.clicked = false;
        this.timerHide = false;
        clearInterval(timer);
      }
    }, 1000);
  }
  gotoCreatePassword() {
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
    }, 200);
    this.dialogRef.close();
    const dialogRef = this.dialog.open(EmailVerifiedDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "emailVarifyDialog",
      width: "390px",

      data: { data: this.userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("VideoAutoPlay") == "0") {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });
  }
}
