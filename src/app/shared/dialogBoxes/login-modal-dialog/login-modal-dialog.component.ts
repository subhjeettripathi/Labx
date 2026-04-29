import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../utilities/error.statematcher';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import Swal from 'sweetalert2';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
declare var AF: any;
export interface ICountryAndCode {
  code: string;
  name: string;
  dial_code: string;
}
declare var $: any;
declare var AppleID: any;

@Component({
  selector: 'app-login-modal-dialog',
  templateUrl: './login-modal-dialog.component.html',
  styleUrls: ['./login-modal-dialog.component.scss']
})
export class LoginModalDialogComponent implements OnInit {
  email: any;
  countryName:any;
  mobile: any;
  openOtpModal = false
  showOtpBox: boolean = false
  packageData: any;
  jsonDatapack: any;
  searchText: any
  value: any;
  loginForm!: FormGroup;
  visitorId: any;
  datasss: string = ''
  minDate!: Date;
  provider: any;
  maxDate!: Date;
  OTTPlans: any = []
  isUserExist: any;
  SocialData: any
  mobileNumberForResend: any;
  country: any = []
  socials: any
  typesLogin: any
  hideSocialLoginPhone = true
  userSessionData: any;
  emailPattern = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*" + "@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
  // emailPattern = '^[a-z0-9._%+-]+@[a-z0-9-]+\\.[a-z]{2,4}$';
  mobilePattern = '^((\\-?)|)?[0-9]{10}$';
  showpass = false;
  showpass1 = false;
  emailOption: string = '';
  phoneOption: string = '';

  loginType: string = '';
  errorMatcher = new MyErrorStateMatcher();
  isInputKeyNumber = false;
  @Output() isLoggedIn = new EventEmitter<boolean>();
  @Output() sendToSubscribe = new EventEmitter<any>();
  @ViewChild('loginTypeFormDir') loginFormDir!: NgForm;
  @ViewChild('input') inputEl!: ElementRef;
  @ViewChild('myInput') myInput!: ElementRef;
  userMobileNumber: any;
  hideSocialLogin = true
  // code: number = +91;
  otpForm!: FormGroup
  socialForm!: FormGroup
  countryCode!: any;
  @ViewChild('otpFormDir') otpFormDir!: NgForm;
  @ViewChild('socialFormDir') socialFormDir!: NgForm;
  @ViewChild('genderFormDir2') genderFormDir2!: NgForm;
  selectedCountry = {};
  menuOn: any;
  aplleEmail: any;
  // dynamic values:-
  signinTitle: string | undefined;
  baseSignin: any = []
  baseSignup: any = []
  social: any = []
  stateDefault: any;
  showCountry = true
  signinLogo = '';
  // country:any=[]

  selected: ICountryAndCode | undefined
  bankCode: any;
  DataInput: any;
  selected1: any;
  socialIcons: any = []
  // regexStr = '^[a-zA-Z0-9_]*$';
  latest_date!: any
  maxDob: any = Date;
  genderForMobile: boolean = false
  over18: any;
  mobileValue: any;
  termsandp: any;
  mob: any
  states: any = []
  countryAll: any = []
  genderForm2!: FormGroup;
  check: any;
  timeZoneOffset: any
  changeSelects = true;
  @Output() sendValueToForgotPassword = new EventEmitter<any>()
  endLetters: any;
  counts: any = 10;
  defaultVal: any;
  errorMsg: any;
  errorAlertData: any;
  global: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpValidation: any;
  myMo = true
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
  otpSecret: any
  detail: any
  ForgetError: boolean = false;
  ForgetErrorFirst: boolean = false;
  ForgetErrorSecond: boolean = false;
  inactive: boolean = false;
  constructor(public datepipe: DatePipe,
    public dialogRef: MatDialogRef<LoginModalDialogComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private fcs: FunctionCallingService, private socialAuthService: SocialAuthService, private _auth: AuthService, private DEC_SER: DecryptService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private _DS: DataService, private _storage: StorageService, private _SWAL: SwalMsgService, private auth: AuthService, public ed: ExchangeDataService, private router: Router, private eds: ExchangeDataService) {
    this.timeZoneOffset = new Date();
    // this.fcs.socialHIde.subscribe((valu e) => {
    // if (value == true) {
    // this.hideSocialLogin = false
    // }
    // });
    document.addEventListener('keydown', e => {
      if ((e.target as any).nodeName === 'MAT-SELECT') {
        e.stopImmediatePropagation();
      }
    }, true);
  }
  myModel = true
  myModel1 = true
  ngOnInit(): void {

   

    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)

    this.defaultVal = '+91'
    function makeid(length: any) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }
    var gettoken = btoa(this.errorMsg.otpExpiryTime);
    this.otpSecret = makeid(4) + gettoken
    this.datasss = this.data.email
    this.getCountryStatesList()
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    // this.selected1 = '+93'
    // this.selected1 = '+91'

    this.loginForm = this._fb.group({
      emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
      code: [null]
    });
    this.genderForm2 = this._fb.group({
      gender: ['', Validators.required],
      location: ['', Validators.required],
      isCheckedUpdate: [''],
    });
    this.socialForm = this._fb.group({
      phone: ['', Validators.compose([Validators.required, Validators.pattern(`${this.mobilePattern}`)])],
    });
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.getConfigData()
    this.getCountryName()
    // this.getJsonPopup()
    const ipDetail: any = localStorage.getItem("ipSaveData")
    this.detail = JSON.parse(ipDetail)
    
    console.log(this.detail);



  }
  ngAfterViewInit() {
    this.getGeographicalState()
    this.loginForm = this._fb.group({
      emailphone: [this.datasss, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
      code: [null]
    });


    var resgisterFocus = document.getElementById('registerFocus')
    resgisterFocus?.addEventListener('click', () => {
      setTimeout(() => {
        this.myInput.nativeElement.focus()
      }, 500);
    })

    // console.log(this.myInput)
    // this.inputEl.nativeElement.focus();
    // let signtBtn = document.getElementById('registerSignup');
    // console.log(signtBtn,"mm")
    // signtBtn?.addEventListener('click' , () => {
    // this.myInput.nativeElement.focus();
    // })
  }
  // getJsonPopup() {
  // this._DS.popupJson().subscribe((res: any) => {
  // console.log(res)
  // this.savePopupJson=res
  // })

  // }

  noCounter(eVal: any) {


  }
  change(event: any) {

    this.defaultVal = event
  }


  getSocial(data: any) {
    if (data == true) {
      this.hideSocialLogin = true
    } else if (data == false) {
      this.hideSocialLogin = false
    }

  }
  changeSelect(code: any) {
    this.changeSelects = false;
    this.selected1 = code
  }
  changeAnotherSelect(newCode: any, counte: any) {

    // var e: any = document.getElementById("myText")
    // var f = e.length = 3

    if (this.global.is_allow == 1) {

      var others = counte
      var india = 10
      var mobilePattern1 = `^((\\-?)|)?[0-9]{${others}}$`;
      var mobilePattern3 = `^((\\-?)|)?[0-9]{${india}}$`;
      if (newCode == '+91') {

        this.counts = this.india_mobile_length
        this.loginForm = this._fb.group({
          emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${mobilePattern3}`)])],
          code: '+91'
        });
      } else {
        this.counts = this.ROW_mobile_length
        this.loginForm = this._fb.group({
          emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${mobilePattern1}`)])],
          code: this.selected1
        });
      }
    }
    else {

      this.counts = counte
      var mobilePattern1 = `^((\\-?)|)?[0-9]{${counte}}$`;
      if (newCode == '+91') {
        this.loginForm = this._fb.group({
          emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
          code: '+91'
        });
      } else {
        this.loginForm = this._fb.group({
          emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${mobilePattern1}`)])],
          code: this.selected1
        });
      }
    }


  }
  getInputKey() {
    if (this.detail?.phoneCode != '91') {
      const input: string = this.loginForm.value.emailphone;
      if (input !== '') {
        if (/[a-z]/i.test(input)) {

          this.isInputKeyNumber = false;
          var a: any = document.getElementById("myText")
          var b = a.maxLength = 50
        } else {
          this.isInputKeyNumber = false;
        }
      }

    } else {
      const input: string = this.loginForm.value.emailphone;
      if (input !== '') {
        if (/[a-z]/i.test(input)) {

          this.isInputKeyNumber = false;
          var a: any = document.getElementById("myText")
          var b = a.maxLength = 50
        }
        else {
          if (this.loginForm.value.emailphone.includes('@')) {
            var a: any = document.getElementById("myText")
            var b = a.maxLength = 50

          } else {
            this.isInputKeyNumber = true;
            var c: any = document.getElementById("myText")
            var d = c.maxLength = this.counts

            // var e: any = document.getElementById("myText")
            // var f = e.length = 3
          }
          this.isInputKeyNumber = true;
        }
      } else {
        this.defaultVal = '+91'
        this.counts = 10
        var mobilePattern1 = `^((\\-?)|)?[0-9]{${this.counts}}$`;
        this.loginForm = this._fb.group({
          emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${mobilePattern1}`)])],
          code: [null]
        });
        this.isInputKeyNumber = false;
      }
    }
  }

  keyuperror(event: any) {
    this.ForgetError = false
    this.ForgetErrorFirst = false
    this.ForgetErrorSecond = false
    this.inactive = false

  }
  getCountryName() {

    const popup: any = localStorage.getItem('countryStateList');
    const dataPopup: any = JSON.parse(popup);
    console.log(dataPopup);
    this.country = dataPopup.country
    console.log(dataPopup.global_setting, 'dddddd');
    this.states = dataPopup.state
    this.countryAll = dataPopup.country
    this.global = dataPopup.global_setting
    console.log(dataPopup.global_setting);
    this.ROW_mobile_length = dataPopup.global_setting.ROW_mobile_length
    this.india_mobile_length = dataPopup.global_setting.india_mobile_length
    this.is_allow = dataPopup.global_setting.is_allow
    this.is_custom = dataPopup.global_setting.is_custom
    this.is_email_login = dataPopup.global_setting.is_email_login
    this.is_mobile_login = dataPopup.global_setting.is_mobile_login
    this.sms_max_day_limit = dataPopup.global_setting.sms_max_day_limit
    this.sms_max_hour_limit = dataPopup.global_setting.sms_max_hour_limit
    // this._DS.getCountryStateList().subscribe((res: any) => {
    // this.country = res.country
    // console.log(res.global_setting, 'dddddd');
    // this.states = res.state
    // this.countryAll = res.country
    // this.global = res.global_setting
    // console.log(res.global_setting);
    // this.ROW_mobile_length = res.global_setting.ROW_mobile_length
    // this.india_mobile_length = res.global_setting.india_mobile_length
    // this.is_allow = res.global_setting.is_allow
    // this.is_custom = res.global_setting.is_custom
    // this.is_email_login = res.global_setting.is_email_login
    // this.is_mobile_login = res.global_setting.is_mobile_login
    // this.sms_max_day_limit = res.global_setting.sms_max_day_limit
    // this.sms_max_hour_limit = res.global_setting.sms_max_hour_limit

    // console.log(this.country);
    // })
  }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  get loginControls() {
    return this.loginForm.controls;
  }
  onNoClick(): void {
    let loginData = { input: this.loginForm.value.emailphone, userExist: this.isUserExist }
    this.dialogRef.close(loginData);
  }
  getCountryStatesList() {
    // this._DS.getCountryStateList().subscribe((res: any) => {
    // this.states = res.state
    // this.countryAll = res.country
    // })
  }
  getConfigData() {
    const popup: any = localStorage.getItem('faqData');
    const dataPopup: any = JSON.parse(popup);
    this.baseSignin = dataPopup.Form[0].signin
    if (this.detail?.phoneCode != '91') {
      this.baseSignin.email_login.placeholder = 'Please Enter Email Address';
    }
    this.baseSignup = dataPopup.Form[0].signup
    if (this.baseSignup.term_condition.is_allow == 0) {
      this.myModel = false
    }
    if (this.baseSignup.sms_email_updates.is_allow == 0) {
      this.myModel1 = false
    }
    console.log(this.baseSignin.social_login.social);
    this.socialIcons = this.baseSignin.social_login.social
    // icons:-
    this.social = this.baseSignin.social_login.social
    console.log(this.baseSignin.term_conditon);
  }
  emailIdSocial: any

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {

      console.log(x);
      this.emailIdSocial = x.email
      let social = {
        id: x.id,
        first_name: x.firstName,
        last_name: x.lastName,
        gender: '',
        link: '',
        locale: '',
        name: x.name,
        email: x.email,
        location: '',
        dob: ''
      };
      this.checkSocialUserExisted('google', social);
    });
  }
  loginWithfb(): void {

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      console.log(x);
      this.emailIdSocial = x.email
      let social = {
        id: x.id,
        first_name: x.firstName,
        last_name: x.lastName,
        gender: '',
        link: '',
        locale: '',
        name: x.name,
        email: x.email,
        location: '',
        dob: ''
      };

      this.checkSocialUserExisted('facebook', social);
    })
  }

  socialLogin(provider: string, social: any) {
    let ip: any = localStorage.getItem("ipSaveData")
    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "24.10.028",
      network_type: "others",
      network_provider: "others"
    };
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + '*' + window.innerHeight,
      push_device_token: "others",
      device_type: 'web',
      platform: 'web',
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
    const formData: any = new FormData();
    formData.append('type', 'social');
    formData.append('provider', provider);
    formData.append('social', JSON.stringify(this.SocialData));
    formData.append('dod', JSON.stringify(device_other_detail));
    formData.append('dd', JSON.stringify(devicedetail));
    formData.append('device', 'web');
    formData.append("location", JSON.stringify(location));
    formData.append("country_code", JSON.parse(ip).countryCode);
    this._auth.ottSocialLogin(formData).subscribe((res: any) => {
      if (res.code === 1) {


        this.dialogRef.close()
        this.isLoggedIn.emit(true);
        this.ed.isUserLoggedIn.next(true);
        this.ed.isUserLoggedInModal.next(true);
        this.sendToSubscribe.emit(3)
        this.fcs.contentWatchlist.next(true)
        this.DEC_SER.getDecryptedData(res.result);
        // console.log(this.DEC_SER.getDecryptedData(res.result));
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        this.userSessionData = decryptData;
        console.log(this.userSessionData)
        localStorage.setItem('taploginInfo', this.DEC_SER.decryptData);
        localStorage.setItem('device_id', this.visitorId)
        localStorage.setItem('ott_isLoggedIn', '1');
        localStorage.setItem('ott_subtitle_setup', '0');
        console.log(res.result);
        this.dialogRef.close()

        this._auth.loginObservable.next(true);
        this._auth.loginObservable.complete();
        this.getGeographicalState()

        this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
        this._SWAL.getSwalmsg('Logged In Successfully', 'success');
      }
    })
  }

  socialSelect(social: any) {
    if (social.name == "Google") {
      this.loginWithGoogle()
    } else if (social.name == "Facebook") {
      this.loginWithfb()
    } else if (social.name == "Apple") {
      this.apple()
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

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    return formattedDate;
  }

  getGeographicalState() {
    this._DS.apipip().subscribe((res: any) => {
      console.log(res);
      this.countryName = res.countryName
      if (res.countryName == "India") {
        if (res.regionName == "National Capital Territory of Delhi") {
          res.regionName = "Delhi"
        }
        this.stateDefault = res.regionName
        this.showCountry = true
      } else {
        this.stateDefault = res.countryName
        this.showCountry = false
      }
      this.fcs.fgh.next(res)
      localStorage.setItem("ipSaveData", JSON.stringify(res))

      // userSessionApi Start
      var inputDate = new Date();
      var formattedDate = this.formatDate(inputDate);

      const formData: any = new FormData();
      formData.append("customer_id", this.userSessionData?.id);
      formData.append("type", "start");
      formData.append("time", formattedDate);
      formData.append("device_unique_id", this.visitorId);
      formData.append("device_type", "web");
      formData.append("content_type", "vod");
      formData.append("customer_name", this.userSessionData?.first_name + '' + this.userSessionData?.last_name);
      formData.append("country", res.countryName);
      formData.append("country_code", res.countryCode);
      formData.append("network_type", res.security.network);
      formData.append("network_provider", res.connection.isp);
      formData.append("platform", res.userAgent.platform);
      formData.append("browser", res.userAgent.browser);
      formData.append("screen_resolution", window.screen.availWidth + '*' + window.screen.availHeight);
      formData.append("os_version", res.userAgent.operatingSystem);
      formData.append("age_group", this.userSessionData?.age_group);
      formData.append("gender", this.userSessionData?.gender);
      formData.append("city", res.city);
      this._DS.userSession(formData).subscribe((res: any) => {
        if (res.code == 1) {
          console.log(res);

        }
      });

      // userSessionApi End
    })
  }

  onLoginSuccess(e: string) {
    if (e === 'success') {
      this.isLoggedIn.emit(true);
      this.ed.isUserLoggedIn.next(true);
      this.ed.isUserLoggedInModal.next(true);
    } else {
      this.isLoggedIn.emit(false);
    }
  }

  parseJwt(token: any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  public async apple() {
    try {
      console.log(AppleID)
      AppleID.auth.init({
        clientId: 'com.altbalaji.bundle.backend',
        scope: 'name email',
        redirectURI: 'https://altp.faste.tv',
        state: 'init',
        nonce: 'test',
        usePopup: true,
        response_mode: 'form_get'
      });
      const data = await AppleID.auth.signIn();
      const emailApple = this.parseJwt(data.authorization.id_token)

      let social = {
        id: emailApple.sub,
        first_name: '',
        last_name: '',
        gender: '',
        link: '',
        locale: '',
        name: '',
        email: emailApple.email,
        location: '',
        dob: ''
      };
      console.log(social);


      console.log(this.parseJwt(data.authorization.id_token))
      this.checkSocialUserExisted('apple', social);
    }
    catch (error) {
      console.log(error)
    }
  }

  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: msg
    })
  }

  // after social login user package
  getSubscribeInfo(uid: number) {
    this._DS.getSubtitle(uid).subscribe((res: any) => {

      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (sendTosett.payload.language_key != null || sendTosett.payload.language_key != '') {
        localStorage.setItem("regional", sendTosett.payload.language_key);
      }
      localStorage.setItem("app_lang", sendTosett.payload.app_language);
      const languageMap: { [key: string]: string } = {
        'as': 'Assamese',
        'bn': 'Bengali',
        'bg': 'Bulgarian',
        'zh-CN': 'Chinese (Simplified)',
        'en': 'English',
        'fr': 'French',
        'de': 'German',
        'gu': 'Gujarati',
        'he': 'Hebrew',
        'hi': 'Hindi',
        'ja': 'Japanese',
        'kn': 'Kannada',
        'ko': 'Korean',
        'ml': 'Malayalam',
        'mr': 'Marathi',
        'mn': 'Mongolian',
        'or': 'Odia',
        'pa': 'Punjabi',
        'ru': 'Russian',
        'es': 'Spanish',
        'ta': 'Tamil',
        'te': 'Telugu'
      };

      // Create a reverse map
      const reverseLanguageMap: { [key: string]: string } = Object.keys(languageMap).reduce((acc, key) => {
        acc[languageMap[key].toLowerCase()] = key;
        return acc;
      }, {} as { [key: string]: string });
      setTimeout(() => {

        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          if (sendTosett.payload.app_language != '' || sendTosett.payload.app_language != null) {
            const appLanguage = sendTosett.payload.app_language.toLowerCase();
            const languageCode = reverseLanguageMap[appLanguage];
            selectElement.value = languageCode;
            selectElement.dispatchEvent(new Event('change'));
            setTimeout(() => {
              selectElement.value = languageCode;
              selectElement.dispatchEvent(new Event('change'));
            }, 1000);

          }
        }
      }, 2000);
    });
    this._DS.getUserSubscriptionDetails(uid).subscribe((res) => {
      this.packageData = localStorage.getItem('faqData');
      this.jsonDatapack = JSON.parse(this.packageData)
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      if (data.is_subscriber == 1) {
        this.eds.isSubscribe.next(true);
        this.eds.alreadySubscriber.next(true)
        localStorage.setItem("is_subscriber", "1");
        this.eds.parentalLock.next(false);
        if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
          this.eds.showButton.next(true);
          localStorage.setItem("showButton", "1");
        }

      } else if (data.is_subscriber == 0) {
        localStorage.setItem("is_subscriber", "0");
        this.eds.isSubscribe.next(false);
        this.eds.alreadySubscriber.next(false)
        this.eds.parentalLock.next(true);
        // this.router.navigate(['/'])
      }

      this._storage.setData("ott_subscriptionPlan", data);
      data.packages_list.filter((res: any) => {
        if (res.package_mode == 'OTT') {
          this.OTTPlans.push(res)
        }
      })
      const devicerestc = this.OTTPlans[0].device_restriction;
      if (devicerestc) {
        const formData: any = new FormData();
        formData.append("customer_id", uid);
        formData.append("device_unique_id", this.visitorId);
        formData.append("session_status", 1);
        formData.append("device", "web");
        formData.append("device_count", devicerestc);
        formData.append("type", this.OTTPlans[0].restriction_type);
        this.auth.isAllowed(formData).subscribe((res) => {
          if (res.code == 0 && res.error == "Device limit exceeded") {
            console.log(res);
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
            dialogRef.afterClosed().subscribe((result: any) => {
              this.ed.reload.next(true);
            });
            dialogRef.disableClose = true;
          }
          else {
            this.ed.reload.next(true);
            // this.router.navigate(['/'])
          }

        });
      } else {
        this.ed.reload.next(true);
        // this.router.navigate(['/'])
      }
    });
  }

  back() {
    this.loginType = '';
    this.hideSocialLogin = true
  }
  openReg() {
    if(this.dialog.openDialogs.length==1){
      const dialogRef = this.dialog.open(RegisterDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "registerDialog",
        width: "360px",
      });
    }
  
  }
  onSubmitLogin() {
    setTimeout(() => {
      let signtBtn = document.getElementById('registerSignup');
      signtBtn?.addEventListener('click', () => {
        this.myInput.nativeElement.focus();
      })
    }, 1000);

    if (this.changeSelects == true) {
      this.loginForm.value.code = '+91'
      this.selected1 = '+91'
    } else {
      this.loginForm.value.code
    }
    if (this.loginForm.valid) {
      if (this.loginForm.value.emailphone.includes('@')) {
        this.checkUserExisted(this.loginForm.value.emailphone);
        this.typesLogin = 'email'
      } else {
        this.typesLogin = 'phone'
        this.checkUserMobileExisted(this.loginForm.value.emailphone)
        this.mobileValue = this.loginForm.value.emailphone;
      }
    }
  }

  checkUserExisted(email: string) {
    let ip: any = localStorage.getItem("ipSaveData")
    const formData = new FormData();
    formData.append('email', email);
    this._auth.OttcheckUserExisted(formData).subscribe(res => {
      console.log(res, "lookup");
      localStorage.setItem('user_id', res.user_id)
      if(res.code == 3){
        res.code=0
      }
      this.isUserExist = res.code;
      if (res.code == 0) {
        this.loginType = 'emailLogin';
        this.openReg()
        this.hideSocialLogin = false
      } else if (res.code == 2) {
        this.inactive = true
      }
      else if (res.code == 1) {
        this.loginType = 'emailLogin';
      }
      localStorage.setItem('isUserExist', this.isUserExist)
      this.emailOption = email;

    })
  }

  checkUserExistedForgot(email: string) {
    let ip: any = localStorage.getItem("ipSaveData")
    const formData = new FormData();
    formData.append('email', email);
    this._auth.OttcheckUserExisted(formData).subscribe(res => {
      console.log(res, "lookup");
      localStorage.setItem('user_id', res.user_id)
        if(res.code == 3){
        res.code=0
      }
      this.isUserExist = res.code;
      if (res.code == 0) {
        this.ForgetError = true
        this.ForgetErrorFirst = false
        this.ForgetErrorSecond = false
        // this.openReg()
        // this.hideSocialLogin = false
      }
      else if (res.code == 2) {

      } else {
        this.ForgetError = false
        this.ForgetErrorFirst = false
        localStorage.setItem('isUserExist', this.isUserExist)
        this.emailOption = email;
        localStorage.setItem("loginShow", "0")
        this.dialogRef.close();
        const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
          panelClass: "forgotPassword",
          backdropClass: "popupBackdropClass",
          width: "450px",
          data: { name: this.emailOption },
        });

        dialogRef.afterClosed().subscribe((result) => { });
      }

    })
  }
  checkSocialUserExisted(provider: any, x: any) {

    let ip: any = localStorage.getItem("ipSaveData")
    const formData = new FormData();
    formData.append('email', x.email);

    this._auth.OttcheckUserExisted(formData).subscribe(res => {
      console.log(res, "lookup");
      localStorage.setItem('user_id', res.user_id)
          if(res.code == 3){
        res.code=0
      }
      this.isUserExist = res.code;
      if (JSON.parse(ip).phoneCode == 91) {
        if (res.code == 0) {
          this.provider = provider
          this.SocialData = x
          this.getGeographicalState()
          this.hideSocialLogin = false
          this.loginType = 'socialLogin';
        }
        else if (res.code == 2) {

        }
        else if (res.code == 1) {
          this.SocialData = x
          this.socialLogin(provider, x);
        }
      } else {
        this.SocialData = x
        this.socialLogin(provider, x);
      }

      localStorage.setItem('isUserExist', this.isUserExist)
    })


  }
  socialLofinUserId: any
  taploginfo: any
  msgError: any
  msgErrorADD: boolean = false
  alertMsg: any
  submitSocial() {
    let ip: any = localStorage.getItem("ipSaveData") || {}

    // this.openOtpModal=true

    // AF('pba', 'event', { eventType: 'EVENT', eventValue: { 'device_make': this.deviceDetection.os, 'device_timestamp': this.timeZoneOffset, 'page_title': 'lookup', 'geo_country': JSON.parse(ip).countryName, 'geo_city': JSON.parse(ip).city, 'platform': 'web' }, eventName: 'Sign-In Page' });
    if (this.socialForm.valid) {
      if (this.socialForm.value.isCheckedUpdate == true) {
        this.check = 1
      }
      else {
        this.check = 0
      }
      let ip: any = localStorage.getItem("ipSaveData")
      const device_other_detail = {
        os_version: this.deviceDetection.os_version,
        app_version: "24.10.028",
        network_type: "others",
        network_provider: "others"
      };
      const devicedetail = {
        make_model: this.deviceService.browser,
        os: this.deviceDetection.os,
        screen_resolution: window.innerWidth + '*' + window.innerHeight,
        push_device_token: "others",
        device_type: 'web',
        platform: 'web',
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
      this.latest_date = this.datepipe.transform(this.socialForm.value.dob, 'dd MMM, y');
      const formData: any = new FormData();
      formData.append('type', 'social');
      formData.append('provider', this.provider);
      formData.append('social', JSON.stringify(this.SocialData));
      formData.append('dod', JSON.stringify(device_other_detail));
      formData.append('dd', JSON.stringify(devicedetail));
      formData.append('phone', this.socialForm.value.phone);
      formData.append('device', 'web');
      formData.append("location", 'IN');
      formData.append('payload', this.otpSecret);
      formData.append("country_code", JSON.parse(ip).countryCode);
      // formData.append("location", JSON.stringify(location));
      this._auth.ottSocialLogin(formData).subscribe((res: any) => {
        if (res.code === 1) {
          this.DEC_SER.getDecryptedData(res.result);
          const data: any = JSON.parse(this.DEC_SER.decryptData);
          console.log();

          console.log(data.id);
          this.taploginfo = data
          this.socialLofinUserId = data.id
          localStorage.setItem('ott_otp_userid', this.socialLofinUserId);
          // localStorage.setItem('taploginInfo',JSON.stringify(this.taploginfo));
          this.hideSocialLoginPhone = false
          this.openOtpModal = true
          this.typesLogin = 'social'
          this.socials = this.socialForm.value.phone

          // formData.append1('user_id', 'web');
          // formData.append1('otp', 'web');
          // formData.append1('device', 'web');
          // formData.append1('type', 'phone');
          // this.auth.verifyottOtp(formData).subscribe(res => {

          // })
          // const ipDetail = JSON.parse(localStorage.getItem('ipSaveData') || '{}');
          // var stateUpdate = ipDetail
          // stateUpdate.regionName = this.socialForm.value.location
          // localStorage.setItem('ipSaveData', JSON.stringify(stateUpdate))

          // this.dialogRef.close()
          // this.isLoggedIn.emit(true);
          // this.ed.isUserLoggedIn.next(true);
          // this.ed.isUserLoggedInModal.next(true);
          // this.sendToSubscribe.emit(3)
          // this.DEC_SER.getDecryptedData(res.result);
          // console.log(this.DEC_SER.decryptData);

          // localStorage.setItem('taploginInfo', this.DEC_SER.decryptData);
          // localStorage.setItem('device_id', this.visitorId)
          // localStorage.setItem('ott_isLoggedIn', '1');
          // localStorage.setItem('ott_subtitle_setup', '0');
          // this.dialogRef.close()
          // this._auth.loginObservable.next(true);
          // this._auth.loginObservable.complete();
          // this.getGeographicalState()
          // this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
        } else {
          this.msgErrorADD = true
          this.msgError = res.result
        }
      })
    }
  }
  back2() {
    this.loginType = ''
    this.hideSocialLogin = true
  }
  checkUserMobileExisted(email: string) {
    let ip: any = localStorage.getItem("ipSaveData")
    const formData = new FormData();
    formData.append('phone', email);
    this.emailOption = email;
    this._auth.OttcheckUserExisted(formData).subscribe(res => {
      console.log(res, "lookup");
          if(res.code == 3){
        res.code=0
      }
      this.isUserExist = res.code;
      localStorage.setItem('isUserExist', this.isUserExist)
      this.phoneOption = email

      this.hideSocialLogin = false
      if (res.code == 1) {
        this.loginType = 'phoneLogin';
        localStorage.setItem('user_id', res.user_id)
        const formData = new FormData();
        this.mobileNumberForResend = this.loginForm.value.emailphone;
        formData.append('phone', this.loginForm.value.emailphone);
        formData.append('type', 'phone');
        const devicedetail = {
          make_model: this.deviceService.browser,
          os: this.deviceDetection.os,
          screen_resolution: window.innerWidth + '*' + window.innerHeight,
          push_device_token: "others",
          device_type: 'web',
          platform: 'web',
          device_unique_id: this.visitorId,
          onesignal_device_id: "fs95345jfddf",
        }
        const device_other_detail = {
          os_version: this.deviceDetection.os_version,
          app_version: "24.10.028",
          network_type: "others",
          network_provider: "others"
        };
        formData.append('dod', JSON.stringify(device_other_detail));
        formData.append('dd', JSON.stringify(devicedetail));
        formData.append('payload', this.otpSecret);
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
        formData.append('device', 'web');
        this._auth.ottOtpLogin(formData).subscribe(res => {
          this.DEC_SER.getDecryptedData(res.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          this.userIdLogin = decryptData;
          console.log(this.userIdLogin.id);
          localStorage.setItem('ott_otp_userid', JSON.parse(this.DEC_SER.decryptData).id);
          this._SWAL.getSwalmsg('Otp has been Sent!!', 'success');
          if (res.code == 1) {
            this.countryCode = this.loginForm.value.code
            this.hideSocialLogin = false
            this.userMobileNumber = this.loginForm.value.emailphone
            this.endLetters = this.userMobileNumber.substring(6, 10);
          }
        });
      }
      else if (res.code == 0) {
        this.loginType = 'phoneLogin';
        this.openReg()
        this.otpForm = this._fb.group({
          email: [
            "",
            Validators.compose([
              Validators.required,
              Validators.pattern(`${this.emailPattern}`),
            ]),
          ],
          password: [
            "",
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
          confirm_password: ['', [Validators.required]],
          mobile: [
            this.emailOption,
            Validators.compose([Validators.required, Validators.pattern(`${this.mobilePattern}`)]),
          ],
        });

      }
      else if (res.code == 2) {
        this.inactive = true
      }

    })
  }
  getInputKey1(event: any) {
    if (event !== '') {
      this.msgErrorADD = false
    }

  }
  submitFirstStepOtp() {
    if (this.otpForm.valid) {
      this.getGeographicalState()
      this.submitOtplogin()

    } else {
      this.msgError = "all_fields_are_mandatory"
      this.msgErrorADD = true
    }
  }
  submitOtplogin() {
    let ip: any = localStorage.getItem("ipSaveData") || {}
    if (this.otpForm.value.password == this.otpForm.value.confirm_password) {
      const device_other_detail = {
        os_version: this.deviceDetection.os_version,
        app_version: "24.10.028",
        network_type: "others",
        network_provider: "others",
      };
      const devicedetail = {
        make_model: this.deviceService.browser,
        os: this.deviceDetection.os,
        screen_resolution: window.innerWidth + "*" + window.innerHeight,
        push_device_token: "others",
        device_type: 'web',
        platform: 'web',
        device_unique_id: this.visitorId,
        onesignal_device_id: "fs95345jfddf",
      };
      this.email = this.otpForm.value.email
      this.mobile = this.otpForm.value.mobile
      const formData: any = new FormData();
      formData.append("email", this.otpForm.value.email);
      formData.append("password", this.otpForm.value.password);
      formData.append("phone", this.otpForm.value.mobile);
      formData.append('payload', this.otpSecret);
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
        "dod",
        JSON.stringify(device_other_detail)
      );
      formData.append("dd", JSON.stringify(devicedetail));
      formData.append("device", "web");

      this.auth.ottSignup(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData1 = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData1);
          const formData1: any = new FormData();
          formData1.append("type", 'phone');
          formData1.append("value", this.otpForm.value.mobile);
          formData1.append("device", 'web');
          formData.append('payload', this.otpSecret);
          formData1.append("c_id", decryptData1.id);
          this.auth.generateOtp(formData1).subscribe((res: any) => {
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            console.log(decryptData, 'otpppppppppp');


          });

          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData);
          localStorage.setItem('ott_otp_userid', decryptData.id);
          this.openOtpModal = true
        }
      });
    } else {
      this.msgErrorADD = true
      this.msgError = 'Password does not match'
    }
  }
  showPassword(input: any) {
    this.showpass = !this.showpass;
    input.type = this.showpass ? "text" : "password";
  }
  showPassword1(input: any) {
    this.showpass1 = !this.showpass1;
    input.type = this.showpass1 ? "text" : "password";
  }
  getSubcribeStep(e: any) {
    this.sendToSubscribe.emit(3)
  }
  resendOtp(e: any) {
    this.submitOtplogin()
  }
  moveToPolicy(policy: any) {
    if (policy == 'policy') {
      this.eds.humburgerhide.next(true)
      this.router.navigate(["/privacy-policy"])
    }
    this.dialogRef.close()
  }
  moveToTerm(terms: any) {
    if (terms == 'terms') {
      this.eds.humburgerhide.next(true)
      this.router.navigate(["/termsofUse"])
    }
    this.dialogRef.close()
  }


  gotoForgotPassword() {


    if (this.loginForm.valid) {
      if (this.loginForm.value.emailphone.includes('@')) {
        this.checkUserExistedForgot(this.loginForm.value.emailphone);
      }
    } else {
      const input: string = this.loginForm.value.emailphone;
      if (input == null) {
        this.ForgetErrorFirst = true;
        this.ForgetErrorSecond = false;
        this.ForgetError = false
      } else {
        this.ForgetErrorSecond = true;
        this.ForgetError = false;
        this.ForgetErrorFirst = false;
      }

    }

  }


}

import { Pipe, PipeTransform } from '@angular/core';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { DeviceRestrictionPopupComponent } from '../device-restriction-popup/device-restriction-popup.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Pipe({
  name: 'filter',
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {

    if (!items) return [];
    if (!searchText) return items;
    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}