import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MyErrorStateMatcher } from '../utilities/error.statematcher';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import Swal from 'sweetalert2';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DecryptService } from 'src/app/services/decrypt.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { DataService } from 'src/app/services/data.service';
export interface ICountryAndCode {
  code: string;
  name: string;
  dial_code: string
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @ViewChild('input')
  inputEl!: ElementRef;
  showpass = false;
  showCountry = true
  signUpForm!: FormGroup;
  errorMatcher = new MyErrorStateMatcher();
  // emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  emailPattern = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*" + "@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
  // emailPattern ='^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'
  mobilePattern = '^((\\+91-?)|0)?[0-9]{10}$';
  passwordtext = 'password';
  minDate!: Date;
  maxDate!: Date;
  visitorId: any;
  emailOption: string = '';
  isInputKeyNumber = false;
  loginMsg: any;
  stateDefault: any;
  isUserExist: any;
  loginType: string = 'default';
  mobileNumberForResend: any;
  loginForm!: FormGroup;
  selected1: any;
  searchText: any
  country = []
  enabledInput = true
  genderAndCountVisible: boolean = false
  genderForMobile: boolean = false
  userExist: any;
  emailLoginForm!: FormGroup;
  emailSignupForm!: FormGroup;
  genderForm!: FormGroup;
  genderForm2!: FormGroup;
  otpForm!: FormGroup
  maxDob: any = Date;
  states: any = []
  countryAll: any = []
  emailss: any;
  password: any;
  over18: any;
  termsandp: any;
  msgg: any = 'Sign In'
  mob: any
  check: any
  latest_date!: any;
  baseSignin: any = [];
  baseSignup: any = []
  changeSelects = true;
  defaultVal: any
  counts: any = 10;
  display: any;
  timerHide = true;
  clicked = true;
  @Output() resendOtpToLogin = new EventEmitter<any>()
  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
  @ViewChild('signUpFormDir') signUpFormDir!: NgForm;
  @ViewChild('emailLoginFormDir') emailLoginFormDir!: NgForm;
  @ViewChild('genderFormDir') genderFormDir!: NgForm;
  @ViewChild('genderFormDir2') genderFormDir2!: NgForm;
  @ViewChild('otpFormDir') otpFormDir!: NgForm;
  @ViewChild('emailSignupFormDir') emailSignupFormDir!: NgForm;
  @Output() sendActiveButton = new EventEmitter<any>()
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: true,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '46px',
      'height': '46px'
    }
  };
  buttonArrow: any
  otpErrorMessage = '';
  errorMsg: any;
  errorAlertData: any;
  ROW_mobile_length: any;
  india_mobile_length: any;
  is_allow: any;
  is_custom: any;
  is_email_login: any;
  is_mobile_login: any;
  sms_max_day_limit: any;
  sms_max_hour_limit: any;
  global: any
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  constructor(public datepipe: DatePipe, private ed: ExchangeDataService, private DEC_SER: DecryptService, private _fb: FormBuilder, private _DS: DataService, private _storage: StorageService, private _SWAL: SwalMsgService, private _auth: AuthService, private dateAdapter: DateAdapter<Date>, private deviceService: DeviceDetectorService, private auth: AuthService, private _FPS: FingerPrintService, public dialog: MatDialog, private fcs: FunctionCallingService, private router: Router) {
    document.addEventListener('keydown', e => {
      if ((e.target as any).nodeName === 'MAT-SELECT') {
        e.stopImmediatePropagation();
      }
    }, true);
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);

    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.timer(1);
  }
  myModel = true
  myModel1 = true
  ngOnInit(): void {
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.getCountryStatesList()
    this.getConfigData()
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    // this.selected1 = '+91'
    this.selected1 = '+93'
    this.loginForm = this._fb.group({
      emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
      code: [null]
    });


    this.genderForm = this._fb.group({
      gender: ['', Validators.required],
      location: ['', Validators.required],
      isCheckedUpdate: [''],
    });
    this.genderForm2 = this._fb.group({
      gender: ['', Validators.required],
      location: ['', Validators.required],
      isCheckedUpdate: [''],
    });

    this.getCountryName()
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
    this.defaultVal = '+91'
  }
  ngAfterViewInit() {

  }
  changeSelect(code: any) {
    this.changeSelects = false;
    this.selected1 = code
  }
  change(event: any) {
    this.defaultVal = event
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
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }

  getCountryName() {
    // this._DS.countryNames().subscribe((res: any) => {

    //   this.country = res
    //   console.log(this.country);

    // })
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.country = res.country
      console.log(this.country);

      this.global = res.global_setting
      console.log(res.global_setting);
      this.ROW_mobile_length = res.global_setting.ROW_mobile_length
      this.india_mobile_length = res.global_setting.india_mobile_length
      this.is_allow = res.global_setting.is_allow
      this.is_custom = res.global_setting.is_custom
      this.is_email_login = res.global_setting.is_email_login
      this.is_mobile_login = res.global_setting.is_mobile_login
      this.sms_max_day_limit = res.global_setting.sms_max_day_limit
      this.sms_max_hour_limit = res.global_setting.sms_max_hour_limit

    })
  }
  getConfigData() {
    this._DS.faqData().subscribe((res: any) => {
      // console.log(res.Form[0].signin)
      this.baseSignin = res.Form[0].signin
      this.baseSignup = res.Form[0].signup
      console.log(this.baseSignin)
      console.log(this.baseSignup);
      if (this.baseSignup.term_condition.is_allow == 0) {
        this.myModel = false
      }
      if (this.baseSignup.sms_email_updates.is_allow == 0) {
        this.myModel1 = false
      }

    })
  }
  getInputKey() {
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

  // getInputKey() {
  //   const input: string = this.loginForm.value.emailphone;
  //   console.log(input)

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

  resendOtp() {
    this.onSubmitLogin()
    // this.resendOtpToLogin.emit('resend')

    this.timerHide = true
    this.timer(1)
    this.clicked = true;

    // const formData = new FormData();
    // let ott_userid: any = localStorage.getItem('ott_otp_userid');
    // formData.append('user_id', ott_userid);
    // formData.append('otp', this.otpInput.value);
    // this.auth.verifyottOtp(formData).subscribe(res => {
    // })
  }
  moveToPolicy(policy: any) {
    if (policy == 'policy') {
      this.router.navigate(["/privacy-policy"])
    }

  }
  moveToTerm(terms: any) {
    if (terms == 'terms') {
      this.router.navigate(["/termsofUse"])
    }
  }
  onSubmitLogin() {
    window.scroll(0, 0)
    if (this.changeSelects == true) {
      this.loginForm.value.code = '+91'
      this.selected1 = '+91'
    } else {
      this.loginForm.value.code
    }
    if (this.loginForm.valid) {
      if (this.loginForm.value.emailphone.includes('@')) {
        this.checkUserExisted(this.loginForm.value.emailphone);
      } else {
        this.checkUserMobileExisted(this.loginForm.value.emailphone);
      }
    }

  }

  submitOtplogin() {
    window.scroll(0, 0)
    if (this.genderForm2.value.isCheckedUpdate == true) {
      this.check = 1
    }
    else {
      this.check = 0
    }
    this.latest_date = this.datepipe.transform(this.over18, 'dd MMM, y');
    console.log(this.latest_date);
    const formData = new FormData();
    this.mobileNumberForResend = this.loginForm.value.emailphone;

    formData.append('phone', this.loginForm.value.emailphone);
    formData.append('dob', this.latest_date);
    formData.append('check_sms', this.check);
    formData.append('check_email', this.check);
    formData.append('check_push', this.check);
    formData.append('check_whatsapp', this.check);
    formData.append('terms', this.termsandp);
    formData.append('type', 'phone');
    formData.append('gender', this.genderForm2.value.gender);
    formData.append('state', this.genderForm2.value.location);
    formData.append('country_code', this.loginForm.value.code);
    formData.append('device', 'web');
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + '*' + window.innerHeight,
      push_device_token: "others",
      device_type: 'web',
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",
    }
    formData.append('dd', JSON.stringify(devicedetail));
    if (this.genderForm2.valid) {
      this._auth.ottOtpLogin(formData).subscribe(res => {
        this.DEC_SER.getDecryptedData(res.result);
        localStorage.setItem('ott_otp_userid', JSON.parse(this.DEC_SER.decryptData).id);
        this._SWAL.getSwalmsg('Otp has been Sent!!', 'success');
        if (res.code == 1) {
          const ipDetail = JSON.parse(localStorage.getItem('ipSaveData') || '{}');
          var stateUpdate = ipDetail
          stateUpdate.regionName = this.genderForm2.value.location
          localStorage.setItem('ipSaveData', JSON.stringify(stateUpdate))
          this.loginType = 'otpreceived'
        }
      });
    }

  }
  onVerifyOtp() {
    window.scroll(0, 0)
    if (this.otpInput.valid) {
      const formData = new FormData();
      let ott_userid: any = localStorage.getItem('ott_otp_userid');
      formData.append('user_id', ott_userid);
      formData.append('otp', this.otpInput.value);
      this.auth.verifyottOtp(formData).subscribe(res => {
        if (res.code === 1) {
          this.DEC_SER.getDecryptedData(res.result);
          localStorage.setItem('taploginInfo', this.DEC_SER.decryptData);
          localStorage.setItem('ott_isLoggedIn', '1');
          this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
          this.sendActiveButton.emit(3)
          this.ed.isUserLoggedIn.next(true);
          // this._SWAL.getSwalmsg('Signed in successfully', 'success');
          localStorage.removeItem('ott_otp_userid');
          this.getGeographicalState()

        } else {
          this.otpErrorMessage = res.result;
        }
      })
    }
  }
  showPassword(input: any) {
    this.showpass = !this.showpass;
    input.type = this.showpass ? 'text' : 'password';

  }
  submitfirstemailStep() {
    window.scroll(0, 0)
    if (this.emailSignupForm.valid) {
      this.genderAndCountVisible = true
      this.emailss = this.emailSignupForm.value.email;
      this.password = this.emailSignupForm.value.password;
      this.over18 = this.emailSignupForm.value.dob;
      this.termsandp = this.emailSignupForm.value.isCheckedAgree;
      this.getGeographicalState();

    }

  }
  submitFirstStepOtp() {
    window.scroll(0, 0)
    if (this.otpForm.valid) {


      this.genderForMobile = true
      this.getGeographicalState()
      this.mob = this.otpForm.value.code.slice(1) + this.otpForm.value.mobile
      this.over18 = this.otpForm.value.dob;
      this.termsandp = this.otpForm.value.isCheckedAgree;

    }
  }
  edit() {
    this.loginType = 'default';
  }
  onSubmitEmailLogin() {
    window.scroll(0, 0)
    let ip: any = localStorage.getItem("ipSaveData");
    this.userExist = localStorage.getItem('isUserExist')

    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "26.04.024",
      network_type: "others",
      network_provider: "others"
    }

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


    if (this.userExist == 1) {
      window.scroll(0, 0)
      if (this.emailLoginForm.valid) {
        const formData: any = new FormData();
        formData.append('email', this.emailLoginForm.value.email);
        formData.append('password', this.emailLoginForm.value.password);
        formData.append('device_other_detail', JSON.stringify(device_other_detail));
        formData.append('devicedetail', JSON.stringify(devicedetail));
        formData.append('device', "web");
        this.auth.ottLogin(formData).subscribe((res: any) => {
          console.log(res, 'login')
          if (res.code == 1) {

            this.DEC_SER.getDecryptedData(res.result);
            this.ed.isUserLoggedIn.next(true);
            localStorage.setItem('taploginInfo', this.DEC_SER.decryptData);
            localStorage.setItem('ott_isLoggedIn', '1');
            localStorage.setItem('ott_subtitle_setup', '0');
            this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
            this.sendActiveButton.emit(3)
            this.ed.isUserLoggedIn.next(true);
            this.getGeographicalState()
          }

          else {
            this.getSwalmsg('Oops! That`s not your email or password', 'error');
          }
        })
      }
    }
    else if (this.userExist == 0) {
      window.scroll(0, 0)
      if (this.genderForm.valid) {
        if (this.genderForm.value.isCheckedUpdate == true) {
          var check = 1
        }
        else {
          var check = 0
        }
        this.latest_date = this.datepipe.transform(this.over18, 'dd MMM, y');
        console.log(this.latest_date);
        const formData: any = new FormData();
        formData.append('email', this.emailss);
        formData.append('password', this.password);
        formData.append('dob', this.latest_date);
        formData.append('check_sms', check);
        formData.append('check_email', check);
        formData.append('check_push', check);
        formData.append('check_whatsapp', check);
        formData.append('terms', this.termsandp);
        formData.append('gender', this.genderForm.value.gender);
        formData.append('state', this.genderForm.value.location);
        formData.append('device_other_detail', JSON.stringify(device_other_detail));
        formData.append('devicedetail', JSON.stringify(devicedetail));
        formData.append('device', "web");
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
        this.auth.ottSignup(formData).subscribe((res: any) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          console.log(decryptData);
          if (res.code == 1) {

            const ipDetail = JSON.parse(localStorage.getItem('ipSaveData') || '{}');
            var stateUpdate = ipDetail
            stateUpdate.regionName = this.genderForm.value.location
            console.log(ipDetail);

            localStorage.setItem('ipSaveData', JSON.stringify(stateUpdate))
            this.DEC_SER.getDecryptedData(res.result);
            let UserInfo = JSON.parse(this.DEC_SER.decryptData);
            localStorage.setItem('taploginInfo', JSON.stringify(UserInfo.info));
            localStorage.setItem('ott_isLoggedIn', '1');
            localStorage.setItem('ott_subtitle_setup', '0');
            this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
            localStorage.setItem('ottParental', '0');
            this.auth.loginObservable.next(true);
            this.auth.loginObservable.complete();
            this.sendActiveButton.emit(3)
            this.ed.isUserLoggedIn.next(true);
            this.getGeographicalState()

          } else {
            this.getSwalmsg('oops Invalid error', 'error')
          }
        })
      }
    }


  }

  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
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


  getSubscribeInfo(uid: number) {
    this._DS.getSubtitle(uid).subscribe((res: any) => {

      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (sendTosett.payload.language_key != null || sendTosett.payload.language_key != '') {
        localStorage.setItem("regional", sendTosett.payload.language_key);
      }

    });
    this._DS.getUserSubscriptionDetails(uid).subscribe(res => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      console.log(data, 'subjassdffdsfsfd')

      if (data.is_subscriber == 1) {
        this.ed.isSubscribe.next(true);
        this.ed.alreadySubscriber.next(true)
        const exp_date = new Date(data['packages_list'][0]['subscription_end']).getTime();
        this._storage.setData('ott_expiry_date', exp_date);
        localStorage.setItem('is_subscriber', '1')
      } else if (data.is_subscriber == 0) {
        localStorage.setItem('is_subscriber', '0')
      }

      this._storage.setData('ott_subscriptionPlan', data);
      const devicerestc = data.packages_list[0].device_restriction
      console.log(devicerestc);
      if (devicerestc) {
        const formData: any = new FormData();
        formData.append('customer_id', uid);
        formData.append('device_unique_id', this.visitorId);
        formData.append('session_status', 1);
        formData.append('device', 'web');
        formData.append('device_count', devicerestc);
        formData.append('type', data.packages_list[0].restriction_type);
        this.auth.isAllowed(formData).subscribe(res => {
          if (res.code == 0 && res.error == 'Device limit exceeded') {
            const dialogRef = this.dialog.open(DeviceRestrictionPopupComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'adultAgePopup',
              width: "390px",
            });
            dialogRef.disableClose = true;
          }
        })
      }
    })
  }

  checkUserExisted(email: string) {
    window.scroll(0, 0)
    this.emailOption = email;

    this.emailLoginForm = this._fb.group({
      email: [this.emailOption, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}`)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
    this.emailSignupForm = this._fb.group({
      email: [this.emailOption, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}`)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      dob: ['', Validators.required],
      isCheckedAgree: ['', Validators.requiredTrue],
      // isover18: ['', Validators.requiredTrue],
    });
    const formData = new FormData();
    formData.append('email', email);

    this._auth.OttcheckUserExisted(formData).subscribe(res => {
      this.isUserExist = res.code;
      if (this.isUserExist == 1) {
        localStorage.setItem('user_id', res.user_id)
      }
      else if (this.isUserExist == 0) {

      }
      localStorage.setItem('isUserExist', this.isUserExist)
      this.loginType = 'emailLogin';

    })
  }

  getGeographicalState() {
    this._DS.apipip().subscribe((res: any) => {
      console.log(res);
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
    })
  }
  getCountryStatesList() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.states = res.state
      this.countryAll = res.country
    })
  }
  checkUserMobileExisted(email: string) {
    const formData = new FormData();
    formData.append('phone', email);
    window.scroll(0, 0)
    this._auth.OttcheckUserExisted(formData).subscribe(res => {
      if (res.code == 1) {
        localStorage.setItem('user_id', res.user_id)
        const formData = new FormData();
        this.mobileNumberForResend = this.loginForm.value.code + this.loginForm.value.emailphone;
        formData.append('phone', this.loginForm.value.emailphone);
        formData.append('type', 'phone');
        const devicedetail = {
          make_model: this.deviceService.browser,
          os: this.deviceDetection.os,
          screen_resolution: window.innerWidth + '*' + window.innerHeight,
          push_device_token: "others",
          device_type: 'web',
          platform: this.deviceDetection.deviceType,
          device_unique_id: this.visitorId,
          onesignal_device_id: "fs95345jfddf",
        }
        formData.append('device', 'web');
        formData.append('dd', JSON.stringify(devicedetail));
        this._auth.ottOtpLogin(formData).subscribe(res => {
          this.DEC_SER.getDecryptedData(res.result);
          localStorage.setItem('ott_otp_userid', JSON.parse(this.DEC_SER.decryptData).id);
          this._SWAL.getSwalmsg('Otp has been Sent!!', 'success');
          if (res.code == 1) {
            this.loginType = 'otpreceived'
          }
        });
      }
      else if (res.code == 0) {
        window.scroll(0, 0)
        this.otpForm = this._fb.group({
          mobile: [this.loginForm.value.emailphone, Validators.required],
          dob: ['', Validators.required],
          code: ['+91', Validators.required],
          // isover18: ['', Validators.required],
          // isCheckedUpdate: ['', Validators.required],
          isCheckedAgree: ['', Validators.required]
        });
        this.loginType = 'otpLogin'

        this.msgg = 'Sign Up'
      }

      this.isUserExist = res.code;
      localStorage.setItem('isUserExist', this.isUserExist)
    })
  }


  triggerEvent() {
    this.searchText = ''
  }


  testttf(eee: any) {
    // this.noCounter(eee)
    // console.log(code)
    // console.log(eee)
    // if(code == '+93'){
    //   console.log('if')
    // }else{
    //   console.log('else')
    // }

    this.changeSelects = false;

    if (eee.value == '+91') {

      this.loginForm = this._fb.group({
        emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${this.mobilePattern}`)])],
        code: '+91'
      });
    } else {
      var counte = 15
      var mobilePattern1 = `^((\\-?)|)?[0-9]{${counte}}$`;
      this.loginForm = this._fb.group({
        emailphone: [null, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}|${mobilePattern1}`)])],
        code: this.selected1
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
        this.clicked = false
        this.timerHide = false
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }



}
import { Pipe, PipeTransform } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { Any } from 'currency.js';
import { DeviceRestrictionPopupComponent } from '../dialogBoxes/device-restriction-popup/device-restriction-popup.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Pipe({
  name: 'filters',
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

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}