import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  HostListener,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { MyErrorStateMatcher } from "../../utilities/error.statematcher";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from "angularx-social-login";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthService } from "src/app/services/auth.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { StorageService } from "src/app/services/storage.service";
import { SwalMsgService } from "src/app/services/swal-msg.service";
import Swal from "sweetalert2";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { environment } from "src/environments/environment";
import { PackageStackingComponent } from "../package-stacking/package-stacking.component";
// import * as amplitude from '@amplitude/analytics-browser';
declare var firebase: any;
// declare var FB:any
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
export interface ICountryAndCode {
  code: string;
  name: string;
  dial_code: string;
}

declare global {
  interface Window {
    firebaseAuth: any;
    GoogleAuthProvider: any;
    signInWithPopup: any;
  }
}
declare var $: any;
declare var AppleID: any;

@Component({
  selector: "app-login-modal-dialog",
  templateUrl: "./login-modal-dialog.component.html",
  styleUrls: ["./login-modal-dialog.component.scss"],
})
export class LoginModalDialogComponent implements OnInit {
  hideSocialLogin = true;
  showOtpBox: boolean = false;
  searchText: any;
  value: any;
  loginForm!: FormGroup;
  datasss: string = "";
  minDate!: Date;
  provider: any;
  maxDate!: Date;
  isUserExist: any;
  isUserId: any;
  SocialData: any;
  mobileNumberForResend: any;
  country: any = [];
  USER_ACCOUNT_id: any;
  showError = false;
  app_version: any;
  packageDataListCheck: any;
  session_gender: any;
  emailPattern =
    "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*" +
    "@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
  // emailPattern = '^[a-z0-9._%+-]+@[a-z0-9-]+\\.[a-z]{2,4}$';

  emailOption: string = "";
  phoneOption: string = "";
  loginType: string = "";
  errorMatcher = new MyErrorStateMatcher();
  isInputKeyNumber = false;
  @Output() isLoggedIn = new EventEmitter<boolean>();
  @Output() sendToSubscribe = new EventEmitter<any>();
  @ViewChild("loginTypeFormDir") loginFormDir!: NgForm;
  userMobileNumber: any;
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  // code: number = +91;
  otpForm!: FormGroup;
  socialForm!: FormGroup;
  visitorId: any = localStorage.getItem("device_id");
  countryCode!: any;
  @ViewChild("otpFormDir") otpFormDir!: NgForm;
  @ViewChild("socialFormDir") socialFormDir!: NgForm;
  @ViewChild("genderFormDir2") genderFormDir2!: NgForm;
  selectedCountry = {};
  menuOn: any;
  aplleEmail: any;
  // dynamic values:-
  signinTitle: string | undefined;
  baseSignin: any = [];
  baseSignup: any = [];
  social: any = [];
  stateDefault: any;
  showCountry = true;
  signinLogo = "";
  // country:any=[]

  selected: ICountryAndCode | undefined;
  bankCode: any;
  DataInput: any;
  selected1: any;
  socialIcons: any = [];
  // regexStr = '^[a-zA-Z0-9_]*$';
  latest_date!: any;
  maxDob: any = Date;
  genderForMobile: boolean = false;
  over18: any;
  mobileValue: any;
  termsandp: any;
  mob: any;
  states: any = [];
  countryAll: any = [];
  genderForm2!: FormGroup;
  check: any;
  timeZoneOffset: any;
  changeSelects = true;
  @Output() sendValueToForgotPassword = new EventEmitter<any>();
  endLetters: any;
  counts: any;
  defaultVal: any;
  errorMsg: any;
  errorAlertData: any;
  global: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpValidation: any;
  myMo = true;
  ROW_mobile_length: any;
  india_mobile_length: any;
  is_allow: any;
  is_custom: any;
  is_email_login: any;
  is_mobile_login: any;
  sms_max_day_limit: any;
  sms_max_hour_limit: any;
  userIdLogin: any;
  savePopupJson: any;
  mobilePattern: any;
  abc: any;
  isCountryChange: any;
  otpSecret: any;
  dataPopupCountry: any;
  country_dial_code: any;
  loginEnter: any;
  packageData: any;
  jsonDatapack: any;
  packageDataSend: any;
  userSessionData: any;
  is_custom_row: any;
  india_login: any;
  is_email_login_row: any;
  is_mobile_login_row: any;
  row_login: any;

  constructor(
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<LoginModalDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private fcs: FunctionCallingService,
    private socialAuthService: SocialAuthService,
    private _auth: AuthService,
    private DEC_SER: DecryptService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    private _DS: DataService,
    private _storage: StorageService,
    private _SWAL: SwalMsgService,
    private auth: AuthService,
    public ed: ExchangeDataService,
    private router: Router,
    private eds: ExchangeDataService,
    private fbLogger: FacebookLoggerService,
    private fbPixelService: FacebookPixelService,
    private fbService:FacebookService
  ) {
    this.timeZoneOffset = new Date();
    // this.fcs.socialHIde.subscribe((valu  e) => {
    //   if (value == true) {
    //     this.hideSocialLogin = false
    //   }
    // });
    this.getConfigData();
    document.addEventListener(
      "keydown",
      (e) => {
        if ((e.target as any).nodeName === "MAT-SELECT") {
          e.stopImmediatePropagation();
        }
      },
      true
    );

    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);

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
  myModel = true;
  myModel1 = true;
  ngOnInit(): void {
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }

      // localStorage.setItem("ipSaveData", JSON.stringify(res));
    });
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    this.country_dial_code = "+" + detail.phoneCode;
    this.getCountryName();
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);

    const popup: any = localStorage.getItem("countryStateList");
    this.dataPopupCountry = JSON.parse(popup);

    this.defaultVal = "+" + detail?.phoneCode;
    if (this.defaultVal === "+91") {
      this.counts = this.dataPopupCountry.global_setting.india_mobile_length;
      this.mobilePattern = `^((\\-?)|)?[0-9]{${this.counts}}$`;
      if (this.is_email_login == "1" && this.is_mobile_login == "0") {
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}`),
            ]),
          ],
          code: [null],
        });
      } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.mobilePattern}`),
            ]),
          ],
          code: [null],
        });
      } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`),
            ]),
          ],
          code: [null],
        });
      }
    } else {
      this.counts = this.dataPopupCountry.global_setting.ROW_mobile_length;
      this.mobilePattern = `^((\\-?)|)?[0-9]{${this.counts}}$`;
      if (this.is_email_login == "1" && this.is_mobile_login == "0") {
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}`),
            ]),
          ],
          code: [null],
        });
      } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.mobilePattern}`),
            ]),
          ],
          code: [null],
        });
      } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`),
            ]),
          ],
          code: [null],
        });
      }
      // var c: any = document.getElementById("myText")
      // var d = c.maxLength = 8
    }

    this.datasss = this.data.email;
    this.getCountryStatesList();
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    // this.selected1 = '+93'
    //  this.selected1 = '+91'

    this.genderForm2 = this._fb.group({
      // gender: ['', Validators.required],
      location: ["", Validators.required],
      // isCheckedUpdate: [''],
    });
    this.socialForm = this._fb.group({
      // dob: ['', Validators.required],
      // gender: ['', Validators.required],
      // location: ['', Validators.required],
      // isover18: ['', Validators.requiredTrue],
    });
    this.app_version = localStorage.getItem("appVersion");

    // this.getJsonPopup()
  }
  ngAfterViewInit() {
    this.getGeographicalState();
    // this.loginForm = this._fb.group({
    //   emailphone: [this.datasss, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
    //   code: [null]
    // });
  }
  // getJsonPopup() {
  //   this._DS.popupJson().subscribe((res: any) => {

  //     this.savePopupJson=res
  //   })

  // }
  noCounter(eVal: any) { }
  change(event: any) {
    this.defaultVal = event;
  }

  getSocial(data: any) {
    if (data == true) {
      this.hideSocialLogin = true;
    } else if (data == false) {
      this.hideSocialLogin = false;
    }
  }
  changeSelect(code: any) {
    this.changeSelects = false;
    this.selected1 = code;
  }
  changeAnotherSelect(newCode: any, counte: any) {
    // var e: any = document.getElementById("myText")
    // var f = e.length = 3

    if (this.global.is_allow == 1) {
      var others = counte;
      var india = 10;
      var mobilePattern1 = `^((\\-?)|)?[0-9]{${others}}$`;
      var mobilePattern3 = `^((\\-?)|)?[0-9]{${india}}$`;
      if (newCode == "+91") {
        this.counts = this.india_mobile_length;
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}|${mobilePattern3}`),
            ]),
          ],
          code: "+91",
        });
      } else {
        this.counts = this.ROW_mobile_length;
        this.loginForm = this._fb.group({
          emailphone: [
            null,
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}|${mobilePattern1}`),
            ]),
          ],
          code: this.selected1,
        });
      }
    } else {
      this.counts = counte;
      var mobilePattern1 = `^((\\-?)|)?[0-9]{${counte}}$`;
      if (newCode == "+91") {
        if (this.is_email_login == "1" && this.is_mobile_login == "0") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.emailPattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.mobilePattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(
                  `${this.emailPattern}|${this.mobilePattern}`
                ),
              ]),
            ],
            code: [null],
          });
        }
      } else {
        if (this.is_email_login == "1" && this.is_mobile_login == "0") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.emailPattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.mobilePattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(
                  `${this.emailPattern}|${this.mobilePattern}`
                ),
              ]),
            ],
            code: [null],
          });
        }
      }
    }
  }
  getInputKey() {
    this.showError = false;
    const input: string = this.loginForm.value.emailphone;
    if (input !== "") {
      if (this.is_email_login == "1" && this.is_mobile_login == "0") {
        if (/[a-z]/i.test(input)) {
          this.isInputKeyNumber = false;
          var a: any = document.getElementById("myText");
          var b = (a.maxLength = 50);
        } else {
          if (this.loginForm.value.emailphone.includes("@")) {
            var a: any = document.getElementById("myText");
            var b = (a.maxLength = 50);
          }
        }
      } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
        this.isInputKeyNumber = true;
        // var c: any = document.getElementById("myText")
        // var d = c.maxLength = this.counts
      } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
        if (/[a-z]/i.test(input)) {
          this.isInputKeyNumber = false;
          var a: any = document.getElementById("myText");
          var b = (a.maxLength = 50);
        } else {
          if (this.loginForm.value.emailphone.includes("@")) {
            var a: any = document.getElementById("myText");
            var b = (a.maxLength = 50);
          } else {
            this.isInputKeyNumber = true;
            var c: any = document.getElementById("myText");
            var d = (c.maxLength = this.counts);

            // var e: any = document.getElementById("myText")
            // var f = e.length = 3
          }
          this.isInputKeyNumber = true;
        }
      }
    } else {
      // this.defaultVal='+91'
      // this.counts = 10
      // this.defaultVal='+91'
      // this.counts = 10
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      const popup: any = localStorage.getItem("countryStateList");
      this.dataPopupCountry = JSON.parse(popup);
      this.defaultVal = "+" + detail.phoneCode;
      if (this.defaultVal === "+91") {
        this.counts = this.dataPopupCountry.global_setting.india_mobile_length;
        this.mobilePattern = `^((\\-?)|)?[0-9]{${this.counts}}$`;
        if (this.is_email_login == "1" && this.is_mobile_login == "0") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.emailPattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.mobilePattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(
                  `${this.emailPattern}|${this.mobilePattern}`
                ),
              ]),
            ],
            code: [null],
          });
        }
      } else {
        this.counts = this.dataPopupCountry.global_setting.ROW_mobile_length;
        this.mobilePattern = `^((\\-?)|)?[0-9]{${this.counts}}$`;
        if (this.is_email_login == "1" && this.is_mobile_login == "0") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.emailPattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "0" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.mobilePattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (this.is_email_login == "1" && this.is_mobile_login == "1") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(
                  `${this.emailPattern}|${this.mobilePattern}`
                ),
              ]),
            ],
            code: [null],
          });
        }
        // var c: any = document.getElementById("myText")
        // var d = c.maxLength = 8
      }
      this.isInputKeyNumber = false;
    }
  }

  getInputKey1() {
    this.showError = false;
    const input: string = this.loginForm.value.emailphone;
    if (input !== "") {
      if (this.is_email_login_row == "1" && this.is_mobile_login_row == "0") {
        if (/[a-z]/i.test(input)) {
          this.isInputKeyNumber = false;
          var a: any = document.getElementById("myText");
          var b = (a.maxLength = 50);
        } else {
          if (this.loginForm.value.emailphone.includes("@")) {
            var a: any = document.getElementById("myText");
            var b = (a.maxLength = 50);
          }
        }
      } else if (
        this.is_email_login_row == "0" &&
        this.is_mobile_login_row == "1"
      ) {
        this.isInputKeyNumber = true;
        // var c: any = document.getElementById("myText")
        // var d = c.maxLength = this.counts
      } else if (
        this.is_email_login_row == "1" &&
        this.is_mobile_login_row == "1"
      ) {
        if (/[a-z]/i.test(input)) {
          this.isInputKeyNumber = false;
          var a: any = document.getElementById("myText");
          var b = (a.maxLength = 50);
        } else {
          if (this.loginForm.value.emailphone.includes("@")) {
            var a: any = document.getElementById("myText");
            var b = (a.maxLength = 50);
          } else {
            this.isInputKeyNumber = true;
            var c: any = document.getElementById("myText");
            var d = (c.maxLength = this.counts);

            // var e: any = document.getElementById("myText")
            // var f = e.length = 3
          }
          this.isInputKeyNumber = true;
        }
      }
    } else {
      // this.defaultVal='+91'
      // this.counts = 10
      // this.defaultVal='+91'
      // this.counts = 10
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      const popup: any = localStorage.getItem("countryStateList");
      this.dataPopupCountry = JSON.parse(popup);
      this.defaultVal = "+" + detail.phoneCode;
      if (this.defaultVal === "+91") {
        this.counts = this.dataPopupCountry.global_setting.india_mobile_length;
        this.mobilePattern = `^((\\-?)|)?[0-9]{${this.counts}}$`;
        if (this.is_email_login_row == "1" && this.is_mobile_login_row == "0") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.emailPattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (
          this.is_email_login_row == "0" &&
          this.is_mobile_login_row == "1"
        ) {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.mobilePattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (
          this.is_email_login_row == "1" &&
          this.is_mobile_login_row == "1"
        ) {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(
                  `${this.emailPattern}|${this.mobilePattern}`
                ),
              ]),
            ],
            code: [null],
          });
        }
      } else {
        this.counts = this.dataPopupCountry.global_setting.ROW_mobile_length;
        this.mobilePattern = `^((\\-?)|)?[0-9]{${this.counts}}$`;
        if (this.is_email_login_row == "1" && this.is_mobile_login_row == "0") {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.emailPattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (
          this.is_email_login_row == "0" &&
          this.is_mobile_login_row == "1"
        ) {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(`${this.mobilePattern}`),
              ]),
            ],
            code: [null],
          });
        } else if (
          this.is_email_login_row == "1" &&
          this.is_mobile_login_row == "1"
        ) {
          this.loginForm = this._fb.group({
            emailphone: [
              null,
              Validators.compose([
                Validators.required,
                Validators.pattern(
                  `${this.emailPattern}|${this.mobilePattern}`
                ),
              ]),
            ],
            code: [null],
          });
        }
        // var c: any = document.getElementById("myText")
        // var d = c.maxLength = 8
      }
      this.isInputKeyNumber = false;
    }
  }

  validateNumber(event: any) {
    const keyCode = event.keyCode;

    const excludedKeys = [8, 37, 39, 46];

    if (
      !(
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105) ||
        excludedKeys.includes(keyCode)
      )
    ) {
      event.preventDefault();
    }
  }
  getCountryName() {
    const popup: any = localStorage.getItem("countryStateList");
    const dataPopup: any = JSON.parse(popup);

    this.country = dataPopup.country;

    this.states = dataPopup.state;
    this.countryAll = dataPopup.country;
    this.global = dataPopup.global_setting;
    let ip: any = localStorage.getItem("ipSaveData") || {};
    const count_code = JSON.parse(ip);

    this.ROW_mobile_length = dataPopup.global_setting.ROW_mobile_length;
    this.india_mobile_length = dataPopup.global_setting.india_mobile_length;
    this.is_allow = dataPopup.global_setting.is_allow;
    this.row_login = dataPopup.global_setting.row_login;
    this.india_login = dataPopup.global_setting.india_login;
    this.is_custom = dataPopup.global_setting.is_custom;
    this.is_custom_row = dataPopup.global_setting.is_custom_row;
    if (
      this.is_custom_row == "0" &&
      count_code.countryCode != "IN" &&
      this.row_login == "1"
    ) {
      this.is_email_login_row = dataPopup.global_setting.is_email_login_row;
      this.is_mobile_login_row = dataPopup.global_setting.is_mobile_login_row;
    } else {
      this.country.filter((res: any) => {
        if (res.dial_code == this.country_dial_code) {
          this.is_email_login = res.is_email_login;
          this.is_mobile_login = res.is_mobile_login;
        }
      });
    }
    if (
      this.is_custom == "0" &&
      count_code.countryCode == "IN" &&
      this.india_login == "1"
    ) {
      this.is_email_login = dataPopup.global_setting.is_email_login;
      this.is_mobile_login = dataPopup.global_setting.is_mobile_login;
    } else {
      this.country.filter((res: any) => {
        if (res.dial_code == this.country_dial_code) {
          this.is_email_login = res.is_email_login;
          this.is_mobile_login = res.is_mobile_login;
        }
      });
    }

    this.sms_max_day_limit = dataPopup.global_setting.sms_max_day_limit;
    this.sms_max_hour_limit = dataPopup.global_setting.sms_max_hour_limit;
    // this._DS.getCountryStateList().subscribe((res: any) => {
    //   this.country = res.country

    //   this.states = res.state
    //   this.countryAll = res.country
    //   this.global = res.global_setting

    //   this.ROW_mobile_length = res.global_setting.ROW_mobile_length
    //   this.india_mobile_length = res.global_setting.india_mobile_length
    //   this.is_allow = res.global_setting.is_allow
    //   this.is_custom = res.global_setting.is_custom
    //   this.is_email_login = res.global_setting.is_email_login
    //   this.is_mobile_login = res.global_setting.is_mobile_login
    //   this.sms_max_day_limit = res.global_setting.sms_max_day_limit
    //   this.sms_max_hour_limit = res.global_setting.sms_max_hour_limit

    // })
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  get loginControls() {
    return this.loginForm.controls;
  }
  onNoClick(): void {
    let loginData = {
      input: this.loginForm.value.emailphone,
      userExist: this.isUserExist,
    };
    this.dialogRef.close(loginData);
  }
  getCountryStatesList() {
    // this._DS.getCountryStateList().subscribe((res: any) => {
    //   this.states = res.state
    //   this.countryAll = res.country
    // })
  }
  getConfigData() {
    const popup: any = localStorage.getItem("faqData");
    const dataPopup: any = JSON.parse(popup);

    this.baseSignin = dataPopup.Form[0].signin;
    this.baseSignup = dataPopup.Form[0].signup;
    if (this.baseSignup.term_condition.is_allow == 0) {
      this.myModel = false;
    }
    if (this.baseSignup.sms_email_updates.is_allow == 0) {
      this.myModel1 = false;
    }

    this.socialIcons = this.baseSignin.social_login.social;
    // icons:-
    this.social = this.baseSignin.social_login.social;

    // this._DS.faqData().subscribe((res: any) => {

    //   this.baseSignin = res.Form[0]?.signin
    //   this.baseSignup = res.Form[0]?.signup
    //   if (this.baseSignup?.term_condition?.is_allow == 0) {
    //     this.myModel = false
    //   }
    //   if (this.baseSignup?.sms_email_updates?.is_allow == 0) {
    //     this.myModel1 = false
    //   }

    //   this.socialIcons = this.baseSignin?.social_login?.social
    //   // icons:-
    //   this.social = this.baseSignin?.social_login?.social

    // })
  }

  loginWithGoogle(): void {
    const provider = new window.GoogleAuthProvider();  // ✅ constructor works now

    window.signInWithPopup(window.firebaseAuth, provider)
      .then((result: any) => {
        const user = result.user;

        let social = {
          id: user.uid,
          first_name: user.displayName?.split(" ")[0] || "",
          last_name: user.displayName?.split(" ")[1] || "",
          gender: "",
          link: "",
          locale: "",
          name: user.displayName,
          email: user.email,
          location: "",
          dob: "",
        };



        this.checkSocialUserExisted("google", social);
      })
      .catch((error: any) => {
        console.error("Google Sign-In failed:", error.message);
      });
  }
  loginWithfb(): void {
    this.fbService.loginWithFacebook().then((x) => {
      let social = {
        id: x.id,
        first_name: x.first_name,
        last_name: x.last_name,
        gender: '', // not returned by default
        link: '',
        locale: '',
        name: x.name,
        email: x.email,
        location: '',
        dob: ''
      };

      this.checkSocialUserExisted('facebook', social);
    }).catch(err => console.error(err));
  }

  socialLogin(provider: string, social: any) {
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
    let ip: any = localStorage.getItem("ipSaveData");
    let fcm: any = localStorage.getItem("fcm_token") || '';
    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "v2_1",
      network_type: "others",
      network_provider: "others",
      push_device_token: fcm
    };
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + "*" + window.innerHeight,
      push_device_token: fcm,
      device_type: "web",
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",
    };
    const formData: any = new FormData();
    formData.append("type", "social");
    formData.append("provider", provider);
    formData.append("social", JSON.stringify(social));
    formData.append("dod", JSON.stringify(device_other_detail));
    formData.append("dd", JSON.stringify(devicedetail));
    formData.append("device", "web");
    formData.append("age_concent", this.over18);
    this._auth.ottSocialLogin(formData).subscribe((res: any) => {
      if (res.code === 1) {
        this.dialogRef.close();
        this.isLoggedIn.emit(true);
        this.ed.isUserLoggedIn.next(true);
        this.ed.isUserLoggedInModal.next(true);
        this.sendToSubscribe.emit(3);
        this.fcs.contentWatchlist.next(true);
        this.DEC_SER.getDecryptedData(res.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.userSessionData = decryptData;

        localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
        localStorage.setItem("ott_isLoggedIn", "1");
        localStorage.setItem("ott_subtitle_setup", "0");
        if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {

          // LOGIN event
          window.firebaseAnalytics.logEvent('LOGIN', {
            userId: JSON.parse(this.DEC_SER.decryptData).id
          });

          // DEVICE_ID event
          window.firebaseAnalytics.logEvent('DEVICE_ID', {
            DeviceId: this.visitorId
          });

        }

        const userData = JSON.parse(this.DEC_SER.decryptData).id;
        this.fbLogger.logRegistrationEvent(userData);
        this.fbPixelService.trackCompleteRegistration(userData)

        this.getGeographicalState();
        this.dialogRef.close();

        this._auth.loginObservable.next(true);
        this._auth.loginObservable.complete();

        this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
        // window.location.reload()

        // FB.AppEvents.logEvent('fb_mobile_complete_registration',{
        //   'userId': JSON.parse(this.DEC_SER.decryptData).id
        // });
      } else {
        if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
          window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
            userId: JSON.parse(this.DEC_SER.decryptData).id
          });
        }
      }
    });
  }

  socialSelect(social: any) {
    if (social.name == "Google") {
      this.loginWithGoogle();
    } else if (social.name == "Facebook") {
      this.loginWithfb();
    } else if (social.name == "Apple") {
      // this.apple()
    }
  }

  formatDate(inputDate: any) {
    var date = new Date(inputDate);

    var day: any = date.getDate();
    var month: any = date.getMonth() + 1;
    var year: any = date.getFullYear();
    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    var formattedDate =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;

    return formattedDate;
  }
  getGeographicalState() {
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);

        if (this.userSessionData.gender == "") {
          this.session_gender = "others";
        } else {
          this.session_gender = this.userSessionData.gender;
        }

        this.isCountryChange = res;
        if (res.countryName == "India") {
          if (res.regionName == "National Capital Territory of Delhi") {
            res.regionName = "Delhi";
          }
          this.stateDefault = res.regionName;

          this.showCountry = true;
        } else {
          this.stateDefault = res.countryName;
          this.showCountry = false;
        }
        this.fcs.fgh.next(res);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
        var inputDate = new Date();
        var formattedDate = this.formatDate(inputDate);
        const formData: any = new FormData();
        formData.append("customer_id", this.userSessionData.id);
        formData.append("type", "start");
        formData.append("time", formattedDate);
        formData.append("device_unique_id", this.visitorId);
        formData.append("device_type", this.deviceService.deviceType);
        formData.append("content_type", "vod");
        formData.append(
          "customer_name",
          this.userSessionData.first_name + "" + this.userSessionData.last_name
        );
        formData.append("country", ipSaveData.countryName);
        formData.append("country_code", ipSaveData.countryCode);
        formData.append("network_type", ipSaveData.security.network);
        formData.append("platform", this.deviceService.deviceType);
        formData.append("browser", this.deviceService.browser);
        formData.append(
          "screen_resolution",
          window.screen.availWidth + "*" + window.screen.availHeight
        );
        formData.append("os_version", ipSaveData.userAgent.browserVersion);
        formData.append("age_group", this.userSessionData.age_group);
        formData.append("gender", this.session_gender);
        formData.append("city", "others");
        this._DS.userSession(formData).subscribe((res: any) => {
          if (res.code == 1) {
          }
        });
      }
    });
  }

  onLoginSuccess(e: string) {
    if (e === "success") {
      this.isLoggedIn.emit(true);
      this.ed.isUserLoggedIn.next(true);
      this.ed.isUserLoggedInModal.next(true);
    } else {
      this.isLoggedIn.emit(false);
    }
  }

  parseJwt(token: any) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  // public async apple() {
  //   try {

  //     AppleID.auth.init({
  //       clientId: 'com.altt.co.in',
  //       scope: 'name email',
  //       redirectURI: 'https://altt.co.in',
  //       state: 'init',
  //       nonce: 'test',
  //       usePopup: true,
  //       response_mode: 'form_get'
  //     });
  //     const data = await AppleID.auth.signIn();
  //     const emailApple = this.parseJwt(data.authorization.id_token)

  //     let social = {
  //       id: emailApple.sub,
  //       first_name: '',
  //       last_name: '',
  //       gender: '',
  //       link: '',
  //       locale: '',
  //       name: '',
  //       email: emailApple.email,
  //       location: '',
  //       dob: ''
  //     };

  //     this.checkSocialUserExisted('apple', social);
  //   }
  //   catch (error) {

  //   }
  // }

  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icon,
      title: msg,
    });
  }

  // after social login user package
  getSubscribeInfo(uid: number) {
    this._DS.getSubtitle(uid).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (
        sendTosett.payload.language_key != null ||
        sendTosett.payload.language_key != ""
      ) {
        localStorage.setItem("regional", sendTosett.payload.language_key);
      }
    });
    this._DS.getUserSubscriptionDetails(uid).subscribe((res) => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      this.packageDataListCheck = data.packages_list[0];
      this.packageData = localStorage.getItem("faqData");
      this.jsonDatapack = JSON.parse(this.packageData);

      if (data.is_subscriber == 1) {
        this.eds.alreadySubscriber.next(true);
        this.eds.isSubscribe.next(true);
        // window.location.reload();

        // if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 0) {
        //   this.eds.alreadySubscriber.next(true)
        // } else if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 1) {
        //   if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
        //     this.eds.alreadySubscriber.next(false)
        //   } else {
        //     this.eds.alreadySubscriber.next(true)
        //   }

        // } else {
        //   if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
        //     this.eds.alreadySubscriber.next(false)
        //   } else {
        //     this.eds.alreadySubscriber.next(true)
        //   }

        // }
        const exp_date = new Date(
          data["packages_list"][0]["subscription_end"]
        ).getTime();
        localStorage.setItem("is_subscriber", "1");
        this.eds.parentalLock.next(false);

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
        var d: any = new Date(this.packageDataListCheck.end_date);
        var x: any = new Date();
        var sd: any = new Date(x);
        var s = d - sd;
      } else if (data.is_subscriber == 0) {
        // this.router.navigate(['/subscribe']);
        localStorage.setItem("is_subscriber", "0");
        this.eds.parentalLock.next(true);
        window.location.reload();

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
        if (
          data.user_days >=
          this.jsonDatapack.Others.package_stacking.register.days
        ) {
          this.openPackageStackingDialog(0);
        }
      }
      this._storage.setData("ott_subscriptionPlan", data);
      const devicerestc = data.packages_list[0].device_restriction;
      const visitorIds: any = localStorage.getItem("device_id");
      if (devicerestc) {
        const formData: any = new FormData();
        formData.append("customer_id", uid);
        formData.append("device_unique_id", visitorIds);
        formData.append("session_status", 1);
        formData.append("device", "web");
        formData.append("device_count", devicerestc);
        formData.append("type", data.packages_list[0].restriction_type);
        this.auth.isAllowed(formData).subscribe((res) => {
          if (res.code == 0 && res.error == "Device limit exceeded") {
            this.ed.pauseDetailVideo.next(true);
            localStorage.setItem("videoCarousel", "1");
            localStorage.setItem("deviceLimit", JSON.stringify(res));
            const dialogRef = this.dialog.open(
              DeviceRestrictionPopupComponent,
              {
                backdropClass: "popupBackdropClass",
                panelClass: "adultAgePopup",
                width: "390px",
                data: res,
              }
            );
            dialogRef.afterClosed().subscribe((result: any) => {
              if (
                data.user_days <=
                this.jsonDatapack.Others.package_stacking.subscribed.expire_days
              ) {
              } else {
                this.ed.reload.next(true);
              }
              if (localStorage.getItem("VideoAutoPlay") == "0") {
                this.ed.pauseDetailVideo.next(false);
              }
              localStorage.setItem("videoCarousel", "0");
            });
            dialogRef.disableClose = true;
          } else {
            if (
              this.packageDataListCheck.autorenew == 1 &&
              this.packageDataListCheck.is_cancelled == 0
            ) {
              this.ed.reload.next(true);
            } else if (
              this.packageDataListCheck.autorenew == 1 &&
              this.packageDataListCheck.is_cancelled == 1
            ) {
              if (
                data.expire_days <=
                this.jsonDatapack.Others.package_stacking.subscribed.days
              ) {
                this.openPackageStackingDialog(data.is_subscriber);
              } else {
                this.ed.reload.next(true);
              }
            } else {
              if (
                data.expire_days <=
                this.jsonDatapack.Others.package_stacking.subscribed.days
              ) {
                this.openPackageStackingDialog(data.is_subscriber);
              } else {
                this.ed.reload.next(true);
              }
            }
          }
        });
      } else {
        if (
          this.packageDataListCheck.autorenew == 1 &&
          this.packageDataListCheck.is_cancelled == 0
        ) {
          this.ed.reload.next(true);
        } else if (
          this.packageDataListCheck.autorenew == 1 &&
          this.packageDataListCheck.is_cancelled == 1
        ) {
          if (
            data.expire_days <=
            this.jsonDatapack.Others.package_stacking.subscribed.days
          ) {
            this.openPackageStackingDialog(data.is_subscriber);
          } else {
            this.ed.reload.next(true);
          }
        } else {
          if (
            data.expire_days <=
            this.jsonDatapack.Others.package_stacking.subscribed.days
          ) {
            this.openPackageStackingDialog(data.is_subscriber);
          } else {
            this.ed.reload.next(true);
          }
        }
      }
    });
  }
  back() {
    this.isSubmitting = false;
    this.loginType = "";
    this.hideSocialLogin = true;
  }

  onSubmitLogin() {
    // console.log("qqqqqqqqq")
    if (this.changeSelects == true) {
      this.loginForm.value.code = "+91";
      this.selected1 = "+91";
    } else {
      this.loginForm.value.code;
    }
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      if (this.loginForm.value.emailphone.includes("@")) {
        this.checkUserExisted(this.loginForm.value.emailphone);
      } else {
        this.checkUserMobileExisted(this.loginForm.value.emailphone);
        this.mobileValue = this.loginForm.value.emailphone;
      }
      // this._SWAL.getSwalmsg('Logged In Successfully', 'success');
    } else {
      this.showError = true;
    }
  }
  // this.loginForm.value.code.slice(1) +   :-mobile code
  checkUserExisted(email: string) {
    let ip: any = localStorage.getItem("ipSaveData");
    const formData = new FormData();
    formData.append("email", email);
    this._auth.OttcheckUserExisted(formData).subscribe((res) => {
      this.isUserExist = res.code;
      this.isUserId = res.user_id;
      if (res.code == 0) {
        this.hideSocialLogin = false;
      }
      localStorage.setItem("isUserExist", this.isUserExist);
      localStorage.setItem("isUserId", this.isUserId);
      this.emailOption = email;
      this.loginType = "emailLogin";
    });
  }
  checkSocialUserExisted(provider: any, x: any) {
    let ip: any = localStorage.getItem("ipSaveData");
    const formData = new FormData();
    formData.append("email", x.email);
    this._auth.OttcheckUserExisted(formData).subscribe((res) => {
      this.isUserExist = res.code;
      if (res.code == 0) {
        this.provider = provider;
        this.SocialData = x;
        this.getGeographicalState();
        this.hideSocialLogin = false;
        this.loginType = "socialLogin";
        // this.onSubmitLogin();
      } else if (res.code == 1) {
        this.socialLogin(provider, x);
      }
      localStorage.setItem("isUserExist", this.isUserExist);
    });
  }
  submitSocial() {
    let ip: any = localStorage.getItem("ipSaveData") || {};
    if (this.socialForm.valid) {
      if (this.socialForm.value.isCheckedUpdate == true) {
        this.check = 1;
      } else {
        this.check = 0;
      }
      let ip: any = localStorage.getItem("ipSaveData");
      let fcm: any = localStorage.getItem("fcm_token") || '';
      const device_other_detail = {
        os_version: this.deviceDetection.os_version,
        app_version: "v2_1",
        network_type: "others",
        network_provider: "others",
        push_device_token: fcm,
      };
      const devicedetail = {
        make_model: this.deviceService.browser,
        os: this.deviceDetection.os,
        screen_resolution: window.innerWidth + "*" + window.innerHeight,
        push_device_token: fcm,
        device_type: "web",
        platform: this.deviceDetection.deviceType,
        device_unique_id: this.visitorId,
        onesignal_device_id: "fs95345jfddf",
      };
      let location = {
        loc_country: JSON.parse(ip).countryName,
        city: JSON.parse(ip).city,
        loc_state: JSON.parse(ip).regionName,
        ip: JSON.parse(ip).ip,
        lat: JSON.parse(ip).latitude,
        long: JSON.parse(ip).longitude,
        pincode: JSON.parse(ip).postalCode,
        isp: JSON.parse(ip).connection.isp,
      };
      this.latest_date = this.datepipe.transform(
        this.socialForm.value.dob,
        "dd MMM, y"
      );
      const formData: any = new FormData();
      formData.append("type", "social");
      formData.append("provider", this.provider);
      formData.append("social", JSON.stringify(this.SocialData));
      formData.append("dod", JSON.stringify(device_other_detail));
      formData.append("dd", JSON.stringify(devicedetail));
      // formData.append('dob', this.latest_date);
      // if (this.isCountryChange.countryName == "India") {
      //   formData.append('state', this.socialForm.value.location);
      // }

      // formData.append('gender', this.socialForm.value.gender);
      // formData.append('check_sms', this.check);
      // formData.append('check_email', this.check);
      // formData.append('check_push', this.check);
      // formData.append('check_whatsapp', this.check);
      formData.append("device", "web");
      formData.append("location", JSON.stringify(location));
      formData.append("age_concent", this.over18);
      // formData.append('terms', this.socialForm.value.isCheckedAgree);
      this._auth.ottSocialLogin(formData).subscribe((res: any) => {
        if (res.code === 1) {
          const ipDetail = JSON.parse(
            localStorage.getItem("ipSaveData") || "{}"
          );
          var stateUpdate = ipDetail;
          stateUpdate.regionName = this.socialForm.value.location;
          localStorage.setItem("ipSaveData", JSON.stringify(stateUpdate));
          // localStorage.setItem('savJsonPopupLogin', JSON.stringify(this.savePopupJson))
          this.dialogRef.close();
          this.isLoggedIn.emit(true);
          this.ed.isUserLoggedIn.next(true);
          this.ed.isUserLoggedInModal.next(true);
          this.sendToSubscribe.emit(3);
          this.DEC_SER.getDecryptedData(res.result);
          localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
          localStorage.setItem("ott_isLoggedIn", "1");
          localStorage.setItem("ott_subtitle_setup", "0");
          this.dialogRef.close();
          this._auth.loginObservable.next(true);
          this._auth.loginObservable.complete();
          this.getGeographicalState();
          this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
          if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {

            // LOGIN event (GA4 compliant)
            window.firebaseAnalytics.logEvent('login', {
              user_id: JSON.parse(this.DEC_SER.decryptData).id,
              method: 'unknown'  // optional: specify login method if available
            });

            // DEVICE_ID event (custom, keep as is or rename)
            window.firebaseAnalytics.logEvent('device_id', {
              device_id: this.visitorId
            });

          }

          const userData = JSON.parse(this.DEC_SER.decryptData).id;
          this.fbLogger.logRegistrationEvent(userData);
          this.fbPixelService.trackCompleteRegistration(userData)

          // FB.AppEvents.logEvent('fb_mobile_complete_registration',{
          //   'userId': JSON.parse(this.DEC_SER.decryptData).id
          // });

          // window.location.reload()
        } else {
          if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
            window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
              userId: JSON.parse(this.DEC_SER.decryptData).id
            });
          }

        }
      });
    }
  }
  checkUserMobileExisted(email: string) {
    let ip: any = localStorage.getItem("ipSaveData");
    const formData = new FormData();
    formData.append("phone", email);
    this._auth.OttcheckUserExisted(formData).subscribe((res) => {
      if (res.code == 1) {
        const formData = new FormData();
        this.mobileNumberForResend = this.loginForm.value.emailphone;
        formData.append("phone", this.loginForm.value.emailphone);
        formData.append("type", "phone");
        formData.append("payload", this.otpSecret);
        const devicedetail = {
          make_model: this.deviceService.browser,
          os: this.deviceDetection.os,
          screen_resolution: window.innerWidth + "*" + window.innerHeight,
          push_device_token: "others",
          device_type: "web",
          platform: this.deviceDetection.deviceType,
          device_unique_id: this.visitorId,
          onesignal_device_id: "fs95345jfddf",
        };
        formData.append("dd", JSON.stringify(devicedetail));
        let location = {
          loc_country: JSON.parse(ip).countryName,
          city: JSON.parse(ip).city,
          loc_state: JSON.parse(ip).regionName,
          ip: JSON.parse(ip).ip,
          lat: JSON.parse(ip).latitude,
          long: JSON.parse(ip).longitude,
          pincode: JSON.parse(ip).postalCode,
          isp: JSON.parse(ip).connection.isp,
        };
        formData.append("location", JSON.stringify(location));
        this._auth.ottOtpLogin(formData).subscribe((res) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res.result);
            // this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);

            this.userIdLogin = decryptData;

            localStorage.setItem(
              "ott_otp_userid",
              JSON.parse(this.DEC_SER.decryptData).id
            );
            this._SWAL.getSwalmsg("Otp has been Sent!!", "success");

            this.countryCode = this.loginForm.value.code;

            this.hideSocialLogin = false;

            this.userMobileNumber = this.loginForm.value.emailphone;
            this.loginType = "phoneLogin";
            this.endLetters = this.userMobileNumber.substring(6, 10);

            // FB.AppEvents.logEvent('fb_mobile_complete_registration',{
            //   'userId': JSON.parse(this.DEC_SER.decryptData).id
            // });
          } else {
            this._SWAL.getSwalmsg(res.result, "error");
          }
        });
      } else {
        this.otpForm = this._fb.group({
          mobile: [this.loginForm.value.emailphone, Validators.required],
          // dob: ['', Validators.required],
          // code: ['', Validators.required],
          // isover18: ['', Validators.requiredTrue],
          // isCheckedUpdate: [''],
          // isCheckedAgree: ['', Validators.requiredTrue]
        });
        this.hideSocialLogin = false;
        this.loginType = "phoneLogin";
      }
      this.isUserExist = res.code;
      localStorage.setItem("isUserExist", this.isUserExist);
      this.phoneOption = email;
    });
  }
  submitFirstStepOtp() {
    if (this.otpForm.valid && !this.isSubmitted) {
      this.isSubmitted = true;
      this.getGeographicalState();
      this.submitOtplogin();
    }
  }
  submitOtplogin() {
    let ip: any = localStorage.getItem("ipSaveData") || {};
    if (this.genderForm2) {
      this.check = 1;
    } else {
      this.check = 0;
    }
    this.isSubmitting = true;

    const formData = new FormData();
    this.mobileNumberForResend =
      this.loginForm.value.code + this.loginForm.value.emailphone;
    formData.append("phone", this.otpForm.value.mobile);
    formData.append("type", "phone");
    formData.append("payload", this.otpSecret);
    // formData.append('dob', this.latest_date);
    formData.append("age_concent", this.over18);
    formData.append("check_sms", this.check);
    formData.append("check_email", this.check);
    formData.append("check_push", this.check);
    formData.append("check_whatsapp", this.check);
    // formData.append('terms', this.otpForm.value.isCheckedAgree);
    // formData.append('gender', this.genderForm2.value.gender);
    // if (this.isCountryChange.countryName == "India") {
    //   formData.append('state', this.genderForm2.value.location);
    // }
    formData.append("country_code", this.defaultVal);
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + "*" + window.innerHeight,
      push_device_token: "others",
      device_type: "web",
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",
    };
    formData.append("dd", JSON.stringify(devicedetail));
    let location = {
      loc_country: JSON.parse(ip).countryName,
      city: JSON.parse(ip).city,
      loc_state: JSON.parse(ip).regionName,
      ip: JSON.parse(ip).ip,
      lat: JSON.parse(ip).latitude,
      long: JSON.parse(ip).longitude,
      pincode: JSON.parse(ip).postalCode,
      isp: JSON.parse(ip).connection.isp,
    };
    formData.append("location", JSON.stringify(location));
    if (this.genderForm2) {
      const ipDetail = JSON.parse(localStorage.getItem("ipSaveData") || "{}");
      var stateUpdate = ipDetail;
      stateUpdate.regionName = this.genderForm2.value.location;
      localStorage.setItem("ipSaveData", JSON.stringify(stateUpdate));
      this._auth.ottOtpLogin(formData).subscribe((res) => {
        this.DEC_SER.getDecryptedData(res.result);
        localStorage.setItem(
          "ott_otp_userid",
          JSON.parse(this.DEC_SER.decryptData).id
        );
        this._SWAL.getSwalmsg("Otp has been Sent!!", "success");
        if (res.code == 1) {
          if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {

            // LOGIN event (GA4 compliant)
            window.firebaseAnalytics.logEvent('login', {
              user_id: JSON.parse(this.DEC_SER.decryptData).id,
              method: 'unknown'  // optional: specify login method if available
            });

            // DEVICE_ID event (custom, keep as is or rename)
            window.firebaseAnalytics.logEvent('device_id', {
              device_id: this.visitorId
            });

          }

          const userData = JSON.parse(this.DEC_SER.decryptData).id;
          this.fbLogger.logRegistrationEvent(userData);
          this.fbPixelService.trackCompleteRegistration(userData)


          this.isSubmitted = false;

          this.showOtpBox = true;
          this.hideSocialLogin = false;
          this.countryCode = this.loginForm.value.code;
          this.userMobileNumber = this.loginForm.value.emailphone;
          this.endLetters = this.userMobileNumber.substring(6, 10);
          // this._SWAL.getSwalmsg('Logged In Successfully', 'success');

          // FB.AppEvents.logEvent('fb_mobile_complete_registration',{
          //   'userId': JSON.parse(this.DEC_SER.decryptData).id
          // });
        } else {
          if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
            window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
              userId: JSON.parse(this.DEC_SER.decryptData).id
            });
          }

        }
      });
    }
  }

  openHelp() {
    // Swal.fire({
    //   html: `
    //     <div style="text-align: center;">
    //       <img src="https://static.creatorott.com/configration/5006/5006_68c8fc7215f66.png" 
    //            alt="vive" style="width: 100px; margin-bottom: 10px;" />
    //       <h2 class="heyy">looking for help?</h2>
    //       <div class="refresh">
    //         Please install our app from the store. You can email us through the sign-up section within the app.
    //       </div>
    //       <div style="margin-top: 15px;">
    //         <button id="okBtn" style="
    //           padding: 8px 2em;
    //           background-color: var(--theme-secondary-color);
    //           border: none;
    //           color: white;
    //           font-size: 14px;
    //           border-radius: 4px;
    //           cursor: pointer;
    //         ">
    //           OK
    //         </button>
    //         <button id="okBtn1" class="close-btn"><img src="assets/arrows_icons/VectorClose.svg" alt=""></button>
    //       </div>
    //     </div>
    //   `,
    //   customClass: {
    //     popup: 'my-custom-popup'
    //   },
    //   showConfirmButton: false,
    //   allowOutsideClick: true,
    //   didOpen: () => {
    //     document.getElementById('okBtn')?.addEventListener('click', () => Swal.close()); // closes modal
    //     document.getElementById('okBtn1')?.addEventListener('click', () => Swal.close()); // closes modal
    //   }
    // });
     // Try opening Gmail
     const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=support@vive.movie";

     // Open Gmail in new tab
     const win = window.open(gmailUrl, "_blank");

     // If blocked or failed → fallback to mailto
     setTimeout(() => {
       if (!win || win.closed || typeof win.closed == "undefined") {
         window.location.href = "mailto:support@vive.movie";
       }
     }, 500);
  }

  userInfo: any;

  getSubcribeStep(e: any) {
    this.sendToSubscribe.emit(3);
  }
  resendOtp(e: any) {
    this.submitOtplogin();
  }
  moveToPolicy(policy: any) {
    if (policy == "policy") {
      this.eds.humburgerhide.next(true);
      this.router.navigate(["/privacy-policy"]);
    }
    this.dialogRef.close();
  }
  moveToTerm(terms: any) {
    if (terms == "terms") {
      this.eds.humburgerhide.next(true);
      this.router.navigate(["/termsofUse"]);
    }
    this.dialogRef.close();
  }
  triggerEvent() {
    // this.searchText = ''
  }
  openPackageStackingDialog(data: any): void {
    if (
      data == 1 &&
      this.jsonDatapack.Others.package_stacking.subscribed.is_allow == 1 &&
      this.jsonDatapack.Others.package_stacking.row == 0
    ) {
      this.packageDataSend =
        this.jsonDatapack.Others.package_stacking.subscribed;
    } else if (
      data == 0 &&
      this.jsonDatapack.Others.package_stacking.register.is_allow == 1 &&
      this.jsonDatapack.Others.package_stacking.row == 0
    ) {
      this.packageDataSend = this.jsonDatapack.Others.package_stacking.register;
    }
    if (
      this.jsonDatapack.Others.package_stacking.is_allow == 1 &&
      this.jsonDatapack.Others.package_stacking.row == 0
    ) {
      const dialogRef = this.dialog.open(PackageStackingComponent, {
        panelClass: "package-stacking-popup",
        width: "430px",
        data: { name: this.packageDataSend },
      });
    }

    // dialogRef.afterClosed().subscribe((result) => { });
  }
}

import { Pipe, PipeTransform } from "@angular/core";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { CountryLockPopupComponent } from "../country-lock-popup/country-lock-popup.component";
import { DeviceRestrictionPopupComponent } from "../device-restriction-popup/device-restriction-popup.component";
import { MatOptionSelectionChange } from "@angular/material/core";
import { FacebookLoggerService } from "src/app/services/facebook-logger.service";
import { FacebookPixelService } from "src/app/services/facebook-pixel.service";
import { FacebookService } from "src/app/services/facebook.service";

@Pipe({
  name: "filter",
})
// export class FilterPipe implements PipeTransform {
//   transform(items: ICountryAndCode[], searchText: string): ICountryAndCode[] {
//     if (!items) return [];
//     if (!searchText) return items;
//     searchText = searchText.toUpperCase();
//     return items.filter((code) => {
//       return (
//         code.name.toUpperCase().includes(searchText) ||
//         code.dial_code.includes(searchText)
//       );
//     });
//   }
// }
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    return items.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    });
  }
}



