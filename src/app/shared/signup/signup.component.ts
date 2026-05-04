import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MyErrorStateMatcher } from "../utilities/error.statematcher";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthService } from "src/app/services/auth.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import Swal from "sweetalert2";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from "angularx-social-login";
import { environment } from "src/environments/environment";
// import * as amplitude from '@amplitude/analytics-browser';
declare var $: any;
// declare var FB: any
declare var firebase: any;
declare global {
  interface Window {
    firebaseAuth: any;
    GoogleAuthProvider: any;
    signInWithPopup: any;
  }
}
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DecryptService } from "src/app/services/decrypt.service";
import { SwalMsgService } from "src/app/services/swal-msg.service";
import { DataService } from "src/app/services/data.service";
export interface ICountryAndCode {
  code: string;
  name: string;
  dial_code: string;
}
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  @ViewChild("input")
  inputEl!: ElementRef;
  totalOtpCount: any;
  showpass = false;
  showCountry = true;
  signUpForm!: FormGroup;
  socialIcons: any = []
  hideSocialLogin = true

  visitorId: any = localStorage.getItem('device_id')
  errorMatcher = new MyErrorStateMatcher();
  emailPattern =
    "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*" +
    "@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
  mobilePattern = "^((\\+91-?)|0)?[0-9]{10}$";
  passwordtext = "password";
  minDate!: Date;
  maxDate!: Date;
  emailOption: string = "";
  isInputKeyNumber = false;
  loginMsg: any;
  stateDefault: any;
  showpass1: boolean = false;
  userSessionData: any;
  isUserExist: any;
  loginType: string = "default";
  mobileNumberForResend: any;
  loginForm!: FormGroup;
  selected1: any;
  searchText: any;
  country = [];
  verifyOtp: boolean = true;
  enabledInput = true;
  newMobileUser: any;
  genderAndCountVisible: boolean = false;
  genderForMobile: boolean = false;
  userExist: any;
  emailLoginForm!: FormGroup;
  emailSignupForm!: FormGroup;
  genderForm!: FormGroup;
  genderForm2!: FormGroup;
  otpForm!: FormGroup;
  maxDob: any = Date;
  states: any = [];
  countryAll: any = [];
  emailss: any;
  password: any;
  over18: any;
  termsandp: any;
  msgg: any = "Sign In";
  mob: any;
  check: any;
  otpExceeded: boolean = false;
  latest_date!: any;
  baseSignin: any = [];
  baseSignup: any = [];
  changeSelects = true;
  defaultVal: any;
  counts: any;
  display: any;
  timerHide = true;
  alertMsg: any;
  valueIdUserExist: any;
  clicked = true;
  valueMobile: any;
  USER_ACCOUNT_id: any;
  isCountryChange: any;
  packageDataListCheck: any;
  timezone: any;
  incorrectPass: boolean = false;
  session_gender: any;
  @Output() resendOtpToLogin = new EventEmitter<any>();
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  @ViewChild("signUpFormDir") signUpFormDir!: NgForm;
  @ViewChild("emailLoginFormDir") emailLoginFormDir!: NgForm;
  @ViewChild("genderFormDir") genderFormDir!: NgForm;
  @ViewChild("genderFormDir2") genderFormDir2!: NgForm;
  @ViewChild("otpFormDir") otpFormDir!: NgForm;
  @ViewChild("emailSignupFormDir") emailSignupFormDir!: NgForm;
  @Output() sendActiveButton = new EventEmitter<any>();
  @Output() isLoggedIn = new EventEmitter<boolean>();
  @Output() sendToSubscribe = new EventEmitter<any>();
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    // placeholder: "",

    inputStyles: {
      width: "60px",
      color: "white",
      "background-color": "transparent",
      "border-top": "none",
      "border-left": "none",
      "border-right": "none",
      "border-bottom": "2px solid #AAAAAA",
      outline: "none",
      "border-radius": "0px",
    },
  };

  buttonArrow: any;
  otpErrorMessage = "";
  errorMsg: any;
  errorAlertData: any;
  ROW_mobile_length: any;
  india_mobile_length: any;
  is_allow: any;
  is_custom: any;
  is_custom_row: any;
  india_login: any;
  is_email_login_row: any;
  is_mobile_login_row: any;
  row_login: any;
  is_email_login: any;
  is_mobile_login: any;
  sms_max_day_limit: any;
  sms_max_hour_limit: any;
  global: any;
  otpSecret: any;
  dataPopupCountry: any;
  showError = false;
  show: boolean = false;
  country_dial_code: any;
  loginEnter: any;
  app_version: any;
  otpInput = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  constructor(
    public datepipe: DatePipe,
    private ed: ExchangeDataService,
    private DEC_SER: DecryptService,
    private _fb: FormBuilder,
    private _DS: DataService,
    private _storage: StorageService,
    private _SWAL: SwalMsgService,
    private _auth: AuthService,
    private dateAdapter: DateAdapter<Date>,
    private deviceService: DeviceDetectorService,
    private auth: AuthService,
    private _FPS: FingerPrintService,
    public dialog: MatDialog,
    private fcs: FunctionCallingService,
    private router: Router,
    private fbLogger:FacebookLoggerService, 
    private fbPixelService:FacebookPixelService
  ) {
    document.addEventListener(
      "keydown",
      (e) => {
        if ((e.target as any).nodeName === "MAT-SELECT") {
          e.stopImmediatePropagation();
        }
      },
      true
    );
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.dateAdapter.setLocale("en-GB"); //dd/MM/yyyy
  }
  myModel = true;
  myModel1 = true;
  otpTime: any;
  packageData: any;
  jsonDatapack: any;
  packageDataSend: any;
  socialForm!: FormGroup;
  provider: any;
  SocialData: any;

  ngOnInit(): void {
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);
    this.country_dial_code = "+" + detail.phoneCode;
    this.getCountryName();
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

    this.otpTime = Number(this.errorMsg.otpExpiryTime) / 60;

    this.timer(this.otpTime);
    this.getCountryStatesList();
    this.getConfigData();
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // this.selected1 = '+91'
    // this.selected1 = '+93'
    // this.loginForm = this._fb.group({
    //   emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
    //   code: [null]
    // });

    this.socialForm = this._fb.group({
      // dob: ['', Validators.required],
      // gender: ['', Validators.required],
      // location: ['', Validators.required],
      isover18: ["", Validators.requiredTrue],
    });

    this.genderForm = this._fb.group({
      // gender: ['', Validators.required],
      // location: ['', Validators.required],
      isCheckedUpdate: [""],
    });
    this.genderForm2 = this._fb.group({
      // gender: ['', Validators.required],
      // location: ['', Validators.required],
      isCheckedUpdate: [""],
    });


    const popup: any = localStorage.getItem("countryStateList");
    this.dataPopupCountry = JSON.parse(popup);

    this.defaultVal = "+" + detail.phoneCode;
    if (this.defaultVal === "+91") {
      this.counts = this.dataPopupCountry?.global_setting?.india_mobile_length;
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
      this.counts = this.dataPopupCountry?.global_setting?.ROW_mobile_length;
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
    this.app_version = localStorage.getItem("appVersion");
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
  // loginWithfb(): void {
  //   this.socialAuthService
  //     .signIn(FacebookLoginProvider.PROVIDER_ID)
  //     .then((x: any) => {
  //       let social = {
  //         id: x.id,
  //         first_name: x.firstName,
  //         last_name: x.lastName,
  //         gender: "",
  //         link: "",
  //         locale: "",
  //         name: x.name,
  //         email: x.email,
  //         location: "",
  //         dob: "",
  //       };

  //       this.checkSocialUserExisted("facebook", social);
  //     });
  // }

  socialLogin(provider: string, social: any) {
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
    let ip: any = localStorage.getItem("ipSaveData");
    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "v2_1",
      network_type: "others",
      network_provider: "others",
    };
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
        this.isLoggedIn.emit(true);
        this.ed.isUserLoggedIn.next(true);
        this.ed.isUserLoggedInModal.next(true);
        this.sendToSubscribe.emit(3);
        this.fcs.contentWatchlist.next(true);
        this.DEC_SER.getDecryptedData(res.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.userSessionData = decryptData;

        const userData = JSON.parse(this.DEC_SER.decryptData).id;

        localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);

        localStorage.setItem("ott_isLoggedIn", "1");
        localStorage.setItem("ott_subtitle_setup", "0");
        this.getGeographicalState();
        this._auth.loginObservable.next(true);
        this._auth.loginObservable.complete();
        this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
      } else {
      }
    });
  }

  socialSelect(social: any) {
    if (social.name == "Google") {
      this.loginWithGoogle();
    } else if (social.name == "Facebook") {
      // this.loginWithfb();
    } else if (social.name == "Apple") {
      // this.apple()
    }
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
      this.over18 = this.socialForm.value.isover18;

      if (this.over18) {
        this.over18 = 1;
      } else {
        this.over18 = 0;
      }
      if (this.socialForm.value.isCheckedUpdate == true) {
        this.check = 1;
      } else {
        this.check = 0;
      }
      let ip: any = localStorage.getItem("ipSaveData");
      const device_other_detail = {
        os_version: this.deviceDetection.os_version,
        app_version: "v2_1",
        network_type: "others",
        network_provider: "others",
      };
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
      let location = {
        loc_country: JSON.parse(ip).countryName,
        city: JSON.parse(ip).city,
        loc_state: JSON.parse(ip).regionName,
        ip: JSON.parse(ip).ip,
        lat: JSON.parse(ip).latitude,
        long: JSON.parse(ip).longitude,
        pincode: JSON.parse(ip).postalCode,
        isp: JSON.parse(ip)?.connection?.isp,
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
          // this.dialogRef.close()
          this.isLoggedIn.emit(true);
          this.ed.isUserLoggedIn.next(true);
          this.ed.isUserLoggedInModal.next(true);
          this.sendToSubscribe.emit(3);
          this.DEC_SER.getDecryptedData(res.result);




          const userData = JSON.parse(this.DEC_SER.decryptData).id;

          localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);

          localStorage.setItem("ott_isLoggedIn", "1");
          localStorage.setItem("ott_subtitle_setup", "0");
          // this.dialogRef.close()
          this._auth.loginObservable.next(true);
          this._auth.loginObservable.complete();
          this.getGeographicalState();
          this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);

          // window.location.reload()
        } else {

        }
      });
    }
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
  changeSelect(code: any) {
    this.changeSelects = false;
    this.selected1 = code;
  }
  change(event: any) {
    this.defaultVal = event;
  }

  // changeAnotherSelect(newCode: any, counte: any) {
  //   this.counts = counte
  //   var mobilePattern1 = `^((\\-?)|)?[0-9]{${counte}}$`;
  //   if (newCode == '+91') {
  //     this.loginForm = this._fb.group({
  //       emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
  //       code: '+91'
  //     });
  //   } else {
  //     this.loginForm = this._fb.group({
  //       emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${mobilePattern1}`)])],
  //       code: this.selected1
  //     });
  //   }
  // }
  changeAnotherSelect(newCode: any, counte: any) {
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
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  getCountryName() {
    const popup: any = localStorage.getItem("countryStateList");
    const dataPopup: any = JSON.parse(popup);

    this.country = dataPopup?.country;

    this.states = dataPopup?.state;
    this.countryAll = dataPopup?.country;
    this.global = dataPopup?.global_setting;
    let ip: any = localStorage.getItem("ipSaveData") || {};
    const count_code = JSON.parse(ip);
    this.ROW_mobile_length = dataPopup?.global_setting?.ROW_mobile_length;
    this.india_mobile_length = dataPopup?.global_setting?.india_mobile_length;
    this.is_allow = dataPopup?.global_setting?.is_allow;
    this.row_login = dataPopup?.global_setting?.row_login;
    this.india_login = dataPopup?.global_setting?.india_login;
    this.is_custom = dataPopup?.global_setting?.is_custom;
    this.is_custom_row = dataPopup?.global_setting?.is_custom_row;
    if (
      this.is_custom_row == "0" &&
      count_code.countryCode != "IN" &&
      this.row_login == "1"
    ) {
      this.is_email_login_row = dataPopup?.global_setting?.is_email_login_row;
      this.is_mobile_login_row = dataPopup?.global_setting?.is_mobile_login_row;
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
      this.is_email_login = dataPopup?.global_setting?.is_email_login;
      this.is_mobile_login = dataPopup?.global_setting?.is_mobile_login;
    } else {
      this.country.filter((res: any) => {
        if (res.dial_code == this.country_dial_code) {
          this.is_email_login = res.is_email_login;
          this.is_mobile_login = res.is_mobile_login;
        }
      });
    }

    this.sms_max_day_limit = dataPopup?.global_setting?.sms_max_day_limit;
    this.sms_max_hour_limit = dataPopup?.global_setting?.sms_max_hour_limit;
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
  getConfigData() {
    this._DS.faqData().subscribe((res: any) => {
      this.baseSignin = res.Form[0].signin;
      this.baseSignup = res.Form[0].signup;
      console.log(this.baseSignin)

      if (this.baseSignup?.term_condition.is_allow == 0) {
        this.myModel = false;
      }
      if (this.baseSignup?.sms_email_updates.is_allow == 0) {
        this.myModel1 = false;
      }
      this.socialIcons = this.baseSignin.social_login.social

    });
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
      const ipDetail: any = localStorage.getItem("ipSaveData");
      const detail = JSON.parse(ipDetail);
      const popup: any = localStorage.getItem("countryStateList");
      this.dataPopupCountry = JSON.parse(popup);
      this.defaultVal = "+" + detail.phoneCode;
      if (this.defaultVal === "+91") {
        this.counts =
          this.dataPopupCountry?.global_setting?.india_mobile_length;
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
        this.counts = this.dataPopupCountry?.global_setting?.ROW_mobile_length;
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
        this.counts =
          this.dataPopupCountry?.global_setting?.india_mobile_length;
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
        this.counts = this.dataPopupCountry?.global_setting?.ROW_mobile_length;
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



  gotoForgotPassword() {
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem('videoCarousel', '1');

    }, 200);

    localStorage.setItem("loginShow", "0")

    // this.dialog.close();

    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: "forgotPassword",
      backdropClass: "popupBackdropClass",
      width: "450px",
      data: { name: this.emailOption },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem('VideoAutoPlay') == '0') {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem('videoCarousel', '0');

    });
  }
  // getInputKey() {
  //   const input: string = this.loginForm.value.emailphone;

  //   if (input !== '') {
  //     if (/[a-z]/i.test(input)) {
  //       this.isInputKeyNumber = false;
  //       var a:any= document.getElementById("inputLength")
  //         var b=a.maxLength=50
  //     }
  //     else {
  //       if (this.loginForm.value.emailphone.includes('@')) {
  //         var a:any= document.getElementById("inputLength")
  //         var b=a.maxLength=50
  //       } else {
  //         this.isInputKeyNumber = true;
  //         var c:any= document.getElementById("inputLength")
  //         var d=c.maxLength=this.counts
  //       }
  //       this.isInputKeyNumber = true;
  //     }
  //   } else {
  //     this.isInputKeyNumber = false;
  //   }
  // }
  changeValue(value: any) {
    // this.selected1 = value
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

  resendOtp() {
    this.valueMobile = this.loginForm.value.emailphone;
    this._DS.otpCountData(this.valueMobile).subscribe((res: any) => {
      this.totalOtpCount = res.result;
      if (
        this.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour &&
        this.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours
      ) {
        if (this.valueIdUserExist) {
          const formData: any = new FormData();
          formData.append("value", this.valueMobile);
          formData.append("type", "phone");
          formData.append("user_id", this.valueIdUserExist);
          formData.append("payload", this.otpSecret);
          this._DS.resendOtp(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.timerHide = true;
              this.timer(this.otpTime);
              this.clicked = true;
              this._SWAL.getSwalmsg("Otp has been Sent!!", "success");
            } else {
              this.otpExceeded = false;
              // this.resendOtpToLogin.emit("resend");
              this.timerHide = true;
              this.timer(this.otpTime);
              this.clicked = true;
            }
          });
        } else {
          this.otpExceeded = false;
          this.timerHide = true;
          this.timer(this.otpTime);
          this.clicked = true;
        }
      } else {
        this.verifyOtp = true;
        this.clicked = true;
        this.otpExceeded = true;
      }
    });
  }
  moveToPolicy(policy: any) {
    if (policy == "policy") {
      this.router.navigate(["/privacy-policy"]);
    }
  }
  moveToTerm(terms: any) {
    if (terms == "terms") {
      this.router.navigate(["/termsofUse"]);
    }
  }
  onSubmitLogin() {
    window.scroll(0, 0);
    if (this.changeSelects == true) {
      this.loginForm.value.code = "+91";
      this.selected1 = "+91";
    } else {
      this.loginForm.value.code;
    }
    if (this.loginForm.valid) {
      if (this.loginForm.value.emailphone.includes("@")) {
        this.checkUserExisted(this.loginForm.value.emailphone);
      } else {
        this.checkUserMobileExisted(this.loginForm.value.emailphone);
      }
    } else {
      this.showError = true;
    }
  }

  submitOtplogin() {
    window.scroll(0, 0);

    // this.latest_date = this.datepipe.transform(this.over18, 'dd MMM, y');

    const formData = new FormData();
    this.mobileNumberForResend = this.loginForm.value.emailphone;

    formData.append("phone", this.loginForm.value.emailphone);
    // formData.append('dob', this.latest_date);
    // formData.append('check_sms', this.check);
    // formData.append('check_email', this.check);
    // formData.append('check_push', this.check);
    // formData.append('check_whatsapp', this.check);
    // formData.append('terms', this.termsandp);
    formData.append("type", "phone");
    // if (this.otpForm.value.isover18) {
    //   this.over18 = 1;
    // } else {
    //   this.over18 = 0;
    // }
    formData.append("payload", this.otpSecret);
    // formData.append('dob', this.latest_date);
    formData.append("age_concent", this.over18);
    // formData.append('gender', this.genderForm2.value.gender);
    // if (this.isCountryChange.countryName == "India") {
    //   formData.append('state', this.genderForm2.value.location);
    // }

    formData;
    formData.append("country_code", this.defaultVal);
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
    if (this.genderForm2.valid) {
      this.timezone = new Date();
      this._auth.ottOtpLogin(formData).subscribe((res) => {
        this.DEC_SER.getDecryptedData(res.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.userSessionData = decryptData;

        this.valueIdUserExist = JSON.parse(this.DEC_SER.decryptData).id;
        localStorage.setItem(
          "ott_otp_userid",
          JSON.parse(this.DEC_SER.decryptData).id
        );
        this._SWAL.getSwalmsg("Otp has been Sent!!", "success");
        if (res.code == 1) {
          const ipDetail = JSON.parse(
            localStorage.getItem("ipSaveData") || "{}"
          );
          var stateUpdate = ipDetail;
          stateUpdate.regionName = this.genderForm2.value.location;
          localStorage.setItem("ipSaveData", JSON.stringify(stateUpdate));
          (this.loginType = "otpreceived"), (this.newMobileUser = 1);
          var loadtime = Date.now() - this.timezone;
        }
      });
    }
  }
  onOtpChange(otp: any) {
    if (otp.length != 4) {
      this.verifyOtp = true;
      this.otpErrorMessage = "";
      this.otpInput.reset();
      this.ngOtpInput = "";
      this.show = false;
    }
  }
  onVerifyOtp() {
    window.scroll(0, 0);
    if (this.otpInput.valid) {
      const formData = new FormData();
      let ott_userid: any = localStorage.getItem("ott_otp_userid");
      formData.append("user_id", ott_userid);
      formData.append("otp", this.otpInput.value);
      formData.append("device", "web");
      formData.append("type", "phone");
      this.auth.verifyottOtp(formData).subscribe((res) => {
        if (res.code === 1) {
          this.DEC_SER.getDecryptedData(res.result);
          localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);

          localStorage.setItem("ott_isLoggedIn", "1");
          this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
          // this.sendActiveButton.emit(3)
          this.ed.isUserLoggedIn.next(true);
          this._SWAL.getSwalmsg("Login successfully", "success");

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
          

          localStorage.removeItem("ott_otp_userid");
          this.getGeographicalState();
          if (this.newMobileUser == 1) {
            localStorage.setItem("newuser", "0");
            this.newMobileUser = 0;
          }
        } else {
          this.verifyOtp = false;
          this.otpErrorMessage = res.error;
          if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
            window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
              userId: JSON.parse(this.DEC_SER.decryptData).id
            });
          }
        }
      });
    } else {
      this.otpExceeded = false;
      this.show = true;
      if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
        window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
          userId: JSON.parse(this.DEC_SER.decryptData).id
        });
      }
    }
  }
  showPassword(input: any) {
    this.showpass = !this.showpass;
    input.type = this.showpass ? "text" : "password";
  }
  submitfirstemailStep() {
    window.scroll(0, 0);
    if (this.emailSignupForm.valid) {
      // this.genderAndCountVisible = true
      this.emailss = this.emailSignupForm.value.email;
      this.password = this.emailSignupForm.value.password;
      // this.over18 = this.emailSignupForm.value.dob;
      // this.termsandp = this.emailSignupForm.value.isover18;
      this.getGeographicalState();
      this.onSubmitEmailLogin();
    }
  }
  submitFirstStepOtp() {
    window.scroll(0, 0);
    if (this.otpForm.valid) {
      // this.genderForMobile = true
      this.getGeographicalState();
      // this.mob = this.otpForm.value.code.slice(1) + this.otpForm.value.mobile
      // this.over18 = this.otpForm.value.dob;
      // this.termsandp = this.otpForm.value.isover18;
      this.submitOtplogin();
    }
  }
  edit() {
    this.loginType = "default";
  }

  myFunc(user: any) {
    if (user.code != "") {
      this.showError = false;
    }
  }

  clearVal() {
    this.incorrectPass = false;
  }

  onSubmitEmailLogin() {
    if (
      this.emailSignupForm.value.password ==
      this.emailSignupForm.value.confirm_password
    ) {
      window.scroll(0, 0);
      let ip: any = localStorage.getItem("ipSaveData");
      this.userExist = localStorage.getItem("isUserExist");

      const device_other_detail = {
        os_version: this.deviceDetection.os_version,
        app_version: "v2_1",
        network_type: "others",
        network_provider: "others",
      };

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

      if (this.userExist == 1) {
        window.scroll(0, 0);
        if (this.emailLoginForm.valid) {
          const formData: any = new FormData();
          formData.append("email", this.emailLoginForm.value.email);
          formData.append("password", this.emailLoginForm.value.password);
          formData.append(
            "device_other_detail",
            JSON.stringify(device_other_detail)
          );
          formData.append("devicedetail", JSON.stringify(devicedetail));
          formData.append("device", "web");
          this.timezone = new Date();
          this.auth.ottLogin(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.DEC_SER.getDecryptedData(res.result);
              this.ed.isUserLoggedIn.next(true);
              localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);

              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.setItem("ott_subtitle_setup", "0");
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              this.getSwalmsg("Signed in successfully", "success");
              if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {

                // LOGIN event
                window.firebaseAnalytics.logEvent('login', {
                  user_id: JSON.parse(this.DEC_SER.decryptData).id,
                  method: 'unknown' // optional: specify login method
                });

                // DEVICE_ID event
                window.firebaseAnalytics.logEvent('device_id', {
                  device_id: this.visitorId
                });

              }

              const userData = JSON.parse(this.DEC_SER.decryptData).id;
              this.fbLogger.logRegistrationEvent(userData);
              this.fbPixelService.trackCompleteRegistration(userData)

              // this.sendActiveButton.emit(3)
              this.ed.isUserLoggedIn.next(true);
              this.getGeographicalState();
              var loadtime = Date.now() - this.timezone;
            } else {
              this.getSwalmsg(
                "Oops! That`s not your email or password",
                "error"
              );
              if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
                window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
                  userId: JSON.parse(this.DEC_SER.decryptData).id
                });
              }


              this.incorrectPass = true;
              this.showError = false;
            }
          });
        } else {
          this.incorrectPass = false;
          this.showError = true;

        }
      } else if (this.userExist == 0) {
        window.scroll(0, 0);
        if (this.genderForm.valid) {
          const formData: any = new FormData();
          formData.append("email", this.emailSignupForm.value.email);
          // formData.append("dob", "");
          formData.append("password", this.emailSignupForm.value.password);
          // if (this.emailSignupForm.value.isover18) {
          //   this.over18 = 1;
          // } else {
          //   this.over18 = 0;
          // }
          // formData.append("age_concent", this.over18)
          // this.over18 = this.emailSignupForm.value.isover18;
          // formData.append("check_sms", " ");
          // formData.append("check_email", this.check);
          // formData.append("check_push", this.check);
          // formData.append("check_whatsapp", this.check);
          // formData.append("terms", this.emailSignupForm.value.terms);
          // formData.append("gender", this.genderForm.value.gender);
          //  if(this.isCountryChange.countryName == "India"){
          //   formData.append("state", this.genderForm.value.location);
          //  }

          // if(this.isCountryChange){
          //   formData.append("state", '');
          // }
          // else{
          //   formData.append("state", this.genderForm.value.location);
          // }

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
          formData.append(
            "device_other_detail",
            JSON.stringify(device_other_detail)
          );
          formData.append("devicedetail", JSON.stringify(devicedetail));
          formData.append("device", "web");
          // if (this.genderForm.value.isCheckedUpdate == true) {
          //   var check = 1
          // }
          // else {
          //   var check = 0
          // }
          // this.latest_date = this.datepipe.transform(this.over18, 'dd MMM, y');

          // const formData: any = new FormData();
          // formData.append('email', this.emailss);
          // formData.append('password', this.password);
          // formData.append('dob', this.latest_date);
          // formData.append('check_sms', check);
          // formData.append('check_email', check);
          // formData.append('check_push', check);
          // formData.append('check_whatsapp', check);
          // // formData.append('newsletter', this.genderForm.value.isCheckedUpdate);
          // formData.append('terms', this.termsandp);
          // formData.append('gender', this.genderForm.value.gender);
          // if (this.isCountryChange.countryName == "India") {
          //   formData.append('state', this.genderForm.value.location);
          // }

          // formData.append('device_other_detail', JSON.stringify(device_other_detail));
          // formData.append('devicedetail', JSON.stringify(devicedetail));
          // formData.append('device', "web");
          // let location = {
          //   loc_country: JSON.parse(ip).countryName,
          //   city: JSON.parse(ip).city,
          //   loc_state: JSON.parse(ip).regionName,
          //   ip: JSON.parse(ip).ip,
          //   lat: JSON.parse(ip).latitude,
          //   long: JSON.parse(ip).longitude,
          //   pincode: JSON.parse(ip).postalCode,
          //   isp: JSON.parse(ip).connection.isp,
          // };
          // formData.append("location", JSON.stringify(location));
          this.timezone = new Date();
          this.auth.ottSignup(formData).subscribe((res: any) => {
            if (res.code == 1) {
              const ipDetail = JSON.parse(
                localStorage.getItem("ipSaveData") || "{}"
              );
              var stateUpdate = ipDetail;
              stateUpdate.regionName = this.genderForm.value.location;

              localStorage.setItem("ipSaveData", JSON.stringify(stateUpdate));
              this.DEC_SER.getDecryptedData(res.result);
              let UserInfo = JSON.parse(this.DEC_SER.decryptData);
              localStorage.setItem(
                "taploginInfo",
                JSON.stringify(UserInfo.info)
              );

              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.setItem("ott_subtitle_setup", "0");
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              this.getSwalmsg("Registered successfully", "success");
              localStorage.setItem("ottParental", "0");
              localStorage.setItem("newuser", "0");
              this.auth.loginObservable.next(true);
              this.auth.loginObservable.complete();
              // this.sendActiveButton.emit(3)
              this.ed.isUserLoggedIn.next(true);
              this.getGeographicalState();
              var loadtime = Date.now() - this.timezone;

              if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {

                // LOGIN event
                window.firebaseAnalytics.logEvent('login', {
                  user_id: JSON.parse(this.DEC_SER.decryptData).id,
                  method: 'unknown' // optional: specify login method
                });

                // DEVICE_ID event
                window.firebaseAnalytics.logEvent('device_id', {
                  device_id: this.visitorId
                });

              }

              const userData = JSON.parse(this.DEC_SER.decryptData).id;
              this.fbLogger.logRegistrationEvent(userData);
              this.fbPixelService.trackCompleteRegistration(userData)

            } else {
              this.getSwalmsg("oops Invalid error", "error");
            }
          });
        }
      } else {
        this.alertMsg = true;
      }
    } else {
      this.alertMsg = true;
    }
  }

  onKeydown(event: any) {
    this.alertMsg = false;
  }

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

    // this.incorrectPass = true

    // Toast.fire({
    //   icon: icon,
    //   title: msg
    // })
  }

  getSubscribeInfo(uid: number) {
    this._DS.getSubtitle(uid).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (
        sendTosett?.payload?.language_key != null ||
        sendTosett?.payload?.language_key != ""
      ) {
        localStorage.setItem("regional", sendTosett.payload.language_key);
      }
    });
    this._DS.getUserSubscriptionDetails(uid).subscribe((res) => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      this.packageDataListCheck = data?.packages_list[0];
      this.packageData = localStorage.getItem("faqData");
      this.jsonDatapack = JSON.parse(this.packageData);

      if (data.is_subscriber == 1) {
        // this.router.navigate(["/my-subscription"]);
        this.ed.isSubscribe.next(true);
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
              localStorage.setItem('deviceLimit', JSON.stringify(res))
              const dialogRef = this.dialog.open(
                DeviceRestrictionPopupComponent,
                {
                  backdropClass: "popupBackdropClass",
                  panelClass: "adultAgePopup",
                  width: "390px",
                  data: res
                }
              );
              dialogRef.disableClose = true;
              dialogRef.afterClosed().subscribe((result) => {
                this.router.navigate(["/my-subscription"]);
                if (localStorage.getItem("VideoAutoPlay") == "0") {
                  this.ed.pauseDetailVideo.next(false);
                }
                localStorage.setItem("videoCarousel", "0");
              });
            } else {
              this.router.navigate(["/my-subscription"]);
              this.ed.alreadySubscriber.next(true);

              // if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 0) {
              //   this.router.navigate(["/my-subscription"]);
              //   this.ed.alreadySubscriber.next(true)

              // } else if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 1) {
              //   if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
              //     this.sendActiveButton.emit(1);
              //     this.openPackageStackingDialog(data.is_subscriber)
              //   } else {
              //     this.router.navigate(["/my-subscription"]);
              //     this.ed.alreadySubscriber.next(true)

              //   }

              // } else {
              //   if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
              //     this.ed.alreadySubscriber.next(false)
              //     this.sendActiveButton.emit(1);
              //     this.openPackageStackingDialog(data.is_subscriber)

              //   } else {
              //     this.router.navigate(["/my-subscription"]);
              //     this.ed.alreadySubscriber.next(true)

              //   }

              // }
            }
          });
        }
        // if(this.packageDataListCheck.autorenew==1 && this.packageDataListCheck.is_cancelled==0){
        //   this.router.navigate(["/my-subscription"]);
        //   this.ed.alreadySubscriber.next(true)

        //  }else if(this.packageDataListCheck.autorenew==1 && this.packageDataListCheck.is_cancelled==1){
        //   if(data.expire_days<=this.jsonDatapack.Others.package_stacking.subscribed.days){
        //     this.ed.alreadySubscriber.next(false)

        //   }else{
        //     this.router.navigate(["/my-subscription"]);
        //     this.ed.alreadySubscriber.next(true)

        //   }

        //  }else{
        //   if(data.expire_days<=this.jsonDatapack.Others.package_stacking.subscribed.days){
        //     this.ed.alreadySubscriber.next(false)

        //   }else{
        //     this.router.navigate(["/my-subscription"]);
        //     this.ed.alreadySubscriber.next(true)

        //   }

        //  }
        const exp_date = new Date(
          data["packages_list"][0]["subscription_end"]
        ).getTime();
        this._storage.setData("ott_expiry_date", exp_date);
        localStorage.setItem("is_subscriber", "1");

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
        var d: any = new Date(this.packageDataListCheck.end_date);
        var x: any = new Date();
        var sd: any = new Date(x);
        var s = d - sd;
      } else if (data.is_subscriber == 0) {
        localStorage.setItem("is_subscriber", "0");

        this.sendActiveButton.emit(3);
        this.ed.hider.next(true);

        // if (data.user_days >= this.jsonDatapack.Others.package_stacking.register.days) {
        //   this.openPackageStackingDialog(0)
        //   this.sendActiveButton.emit(1);

        // } else {

        //   this.sendActiveButton.emit(3);
        //   // window.location.reload()
        // }

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
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
            localStorage.setItem('deviceLimit', JSON.stringify(res))
            const dialogRef = this.dialog.open(
              DeviceRestrictionPopupComponent,
              {
                backdropClass: "popupBackdropClass",
                panelClass: "adultAgePopup",
                width: "390px",
                data: res
              }
            );
            dialogRef.afterClosed().subscribe((result) => {
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
            } else if (
              this.packageDataListCheck.autorenew == 1 &&
              this.packageDataListCheck.is_cancelled == 1
            ) {
              if (
                data.expire_days <=
                this.jsonDatapack.Others.package_stacking.subscribed.days
              ) {
                this.sendActiveButton.emit(1);
                this.openPackageStackingDialog(data.is_subscriber);
              }
            } else {
              if (
                data.expire_days <=
                this.jsonDatapack.Others.package_stacking.subscribed.days
              ) {
                this.sendActiveButton.emit(1);
                this.openPackageStackingDialog(data.is_subscriber);
              }
            }
          }
        });
      }
      //  if(data.expire_days<=this.jsonDatapack.Others.package_stacking.subscribed.days){
      //    this.openPackageStackingDialog(data.is_subscriber)
      // }
    });
  }

  checkUserExisted(email: string) {
    window.scroll(0, 0);
    this.emailOption = email;

    this.emailLoginForm = this._fb.group({
      email: [
        this.emailOption,
        Validators.compose([
          Validators.required,
          Validators.pattern(`${this.emailPattern}`),
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
    });
    this.emailSignupForm = this._fb.group({
      email: [
        this.emailOption,
        Validators.compose([
          Validators.required,
          Validators.pattern(`${this.emailPattern}`),
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      confirm_password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      // dob: ['', Validators.required],
      // isCheckedAgree: ['', Validators.requiredTrue],
      // isover18: ['', Validators.requiredTrue],
    });
    const formData = new FormData();
    formData.append("email", email);

    this._auth.OttcheckUserExisted(formData).subscribe((res) => {
      this.isUserExist = res.code;
      if (this.isUserExist == 1) {
      } else if (this.isUserExist == 0) {
      }

      localStorage.setItem("isUserExist", this.isUserExist);
      this.loginType = "emailLogin";
    });
  }

  showPassword1(input: any) {
    this.showpass1 = !this.showpass1;
    input.type = this.showpass1 ? "text" : "password";
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
        // localStorage.setItem("ipSaveData", JSON.stringify(res))
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
        formData.append("network_provider", ipSaveData.connection.isp);
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
  getCountryStatesList() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.states = res.state;
      this.countryAll = res.country;
      // let hh;
      // hh = res
      // for (let key of Object.keys(hh)) {
      // this.countryAll.push(key)
      //  }
    });
  }
  checkUserMobileExisted(email: string) {
    const formData = new FormData();
    formData.append("phone", email);
    window.scroll(0, 0);
    this._auth.OttcheckUserExisted(formData).subscribe((res) => {
      if (res.code == 1) {
        const formData = new FormData();
        this.mobileNumberForResend =
          this.loginForm.value.code + this.loginForm.value.emailphone;
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
        this.timezone = new Date();
        this._auth.ottOtpLogin(formData).subscribe((res) => {
          if (res.code == 1) {
            this.DEC_SER.getDecryptedData(res.result);
            this.valueIdUserExist = JSON.parse(this.DEC_SER.decryptData).id;
            localStorage.setItem(
              "ott_otp_userid",
              JSON.parse(this.DEC_SER.decryptData).id
            );
            this._SWAL.getSwalmsg("Otp has been Sent!!", "success");

            this.loginType = "otpreceived";
            var loadtime = Date.now() - this.timezone;
          } else {
            this._SWAL.getSwalmsg(res.result, "error");
          }
        });
      } else if (res.code == 0) {
        window.scroll(0, 0);
        this.otpForm = this._fb.group({
          mobile: [this.loginForm.value.emailphone, Validators.required],
          // dob: ['', Validators.required],
          // code: ['+91', Validators.required],
          // isover18: ['', Validators.required],
          // isCheckedUpdate: ['', Validators.required],
          // isover18: ['', Validators.required]
        });
        this.loginType = "otpLogin";

        this.msgg = "Sign Up";
      }

      this.isUserExist = res.code;
      localStorage.setItem("isUserExist", this.isUserExist);
    });
  }

  triggerEvent() {
    this.searchText = "";
  }

  testttf(eee: any) {
    // this.noCounter(eee)

    // if(code == '+93'){

    // }else{

    // }

    this.changeSelects = false;

    if (eee.value == "+91") {
      this.loginForm = this._fb.group({
        emailphone: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`),
          ]),
        ],
        code: "+91",
      });
    } else {
      var counte = 15;
      var mobilePattern1 = `^((\\-?)|)?[0-9]{${counte}}$`;
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

  userInfo: any;

  openPackageStackingDialog(data: any): void {
    setTimeout(() => {
      $(".subscontainer").hide();
    }, 20);

    if (
      data == 1 &&
      this.jsonDatapack?.Others?.package_stacking?.subscribed.is_allow == 1 &&
      this.jsonDatapack?.Others?.package_stacking?.row == 0
    ) {
      this.packageDataSend =
        this.jsonDatapack?.Others?.package_stacking?.subscribed;
    } else if (
      data == 0 &&
      this.jsonDatapack?.Others?.package_stacking?.register?.is_allow == 1 &&
      this.jsonDatapack?.Others?.package_stacking?.row == 0
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
    //dialogRef.afterClosed().subscribe((result) => { });
  }
}
import { Pipe, PipeTransform } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { Any } from "currency.js";
import { DeviceRestrictionPopupComponent } from "../dialogBoxes/device-restriction-popup/device-restriction-popup.component";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { NodeWithI18n } from "@angular/compiler";
import { PackageStackingComponent } from "../dialogBoxes/package-stacking/package-stacking.component";
import { ForgotPasswordDialogComponent } from "../dialogBoxes/forgot-password-dialog/forgot-password-dialog.component";
import { FacebookPixelService } from "src/app/services/facebook-pixel.service";
import { FacebookLoggerService } from "src/app/services/facebook-logger.service";

@Pipe({
  name: "filters",
})
export class FilterPipes implements PipeTransform {
  // transform(items: ICountryAndCode[], searchText: string): ICountryAndCode[] {
  //   if (!items) return [];
  //   if (!searchText) return items;
  //   searchText = searchText.toLowerCase();
  //   return items.filter((code) => {
  //     return (
  //       code.name.toLowerCase().includes(searchText) ||
  //       code.dial_code.toLowerCase().includes(searchText)
  //     );
  //   });
  // }
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
