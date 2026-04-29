import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  Pipe,
  PipeTransform,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AuthService } from "src/app/services/auth.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { StorageService } from "src/app/services/storage.service";
import { DeviceDetectorService } from "ngx-device-detector";
import Swal from "sweetalert2";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { LoginModalDialogComponent } from "../login-modal-dialog/login-modal-dialog.component";
import { ForgotPasswordDialogComponent } from "../forgot-password-dialog/forgot-password-dialog.component";
import { Router } from "@angular/router";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { DeviceRestrictionPopupComponent } from "../device-restriction-popup/device-restriction-popup.component";
import { DatePipe } from "@angular/common";
import * as firebase from "firebase/app";
declare var AF: any;
@Component({
  selector: "app-email-dialog",
  templateUrl: "./email-dialog.component.html",
  styleUrls: ["./email-dialog.component.scss"],
})
export class EmailDialogComponent implements OnInit {

  @ViewChild('input') inputEl!: ElementRef;
  email: any;
  mobile: any;
  @ViewChild('myInput') myInput!: ElementRef;
  openOtpModal = false
  emailLoginForm!: FormGroup;
  emailSignupForm!: FormGroup;
  visitorId: any;
  userSessionData: any;
  showpass = false;
  mobLength: any;
  showpass1 = false;
  packageData: any;
  jsonDatapack: any;
  baseSignin: any = [];
  baseSignup: any = [];
  incorrectPass = false;
  maxDob: any = Date;
  emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$";
  genderAndCountVisible: boolean = false;
  emailss: any;
  password: any;
  over18: any;
  termsandp: any;
  genderForm!: FormGroup;
  stateDefault: any;
  showCountry = true;
  states: any = [];
  check: any;
  latest_date!: any;
  searchText: any
  errorMsg: any;
  errorAlertData: any;
  timeZoneOffset: any
  confirmMessage = false
  typesLogin: any
  detail: any;
  alertMsg: any;
  mobilePattern = '^((\\-?)|)?[0-9]{10}$';
  intermobilePattern = '^((\\-?)|)?[0-9]{10,15}$';
  otpSecret: any
  showError: boolean = false
  @Input() emailOption: string = "";
  countryAll: any = [];
  OTTPlans: any = [];
  @Output() public sendModal = new EventEmitter<string>();
  @ViewChild("emailLoginFormDir") emailLoginFormDir!: NgForm;
  @ViewChild("emailSignupFormDir") emailSignupFormDir!: NgForm;
  @Output() loginSuccess = new EventEmitter<string>();
  @Output() sendToSubscribeLogin = new EventEmitter<any>();
  @Output() sendtoLoginSocial = new EventEmitter<any>();
  enabledInput = true;
  userExist: any = localStorage.getItem("isUserExist");
  constructor(
    public dialogRef: MatDialogRef<EmailDialogComponent>,
    public datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private fcs: FunctionCallingService,
    private router: Router,
    private eds: ExchangeDataService,
    private auth: AuthService,
    private DEC_SER: DecryptService,
    private _DS: DataService,
    private _storage: StorageService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    public ed: ExchangeDataService,
    public dialog: MatDialog
  ) {
    this.timeZoneOffset = new Date();

  }
  myModel = true;
  ngOnInit(): void {
    const ipDetail: any = localStorage.getItem("ipSaveData")
    this.detail = JSON.parse(ipDetail)
    if (this.detail.phoneCode == 91) {
      this.mobLength = 10
    } else {
      this.mobLength = 15
    }
    console.log(this.detail);
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData);
    console.log(this.errorMsg,"aaaaa");

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
    this.getCountryStatesList();
    this.getConfigData();
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
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
        Validators.compose([Validators.required, Validators.minLength(3)]),
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
      confirm_password: ['', Validators.compose([Validators.required, Validators.minLength(8)]),],
      mobile: [
        "", this.getMobileValidators()
      ],
    })
    this.genderForm = this._fb.group({
      gender: ["", Validators.required],
      location: ["", Validators.required],
      isCheckedUpdate: [""],
    });
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));

  }
  ngAfterViewInit() {
    this.getGeographicalState()
    this.inputEl.nativeElement.focus();

    let signtBtn = document.getElementById('registerSignup');
    signtBtn?.addEventListener('click', () => {
      this.myInput.nativeElement.focus();
    })

  }
  getMobileValidators() {
    if (this.detail.phoneCode == '91') {
      return Validators.compose([Validators.required, Validators.pattern(`${this.mobilePattern}`)])
    }
    else {
      return null
    }
  }
  submitfirstemailStep() {

    if (this.emailSignupForm.valid) {
      this.onSubmitEmailLogin()
    } else {
      this.msgError = "all_fields_are_mandatory"
      //  key added to translation service
      this.msgErrorADD = true
    }
  }
  inputEnable: boolean = true;
  getCountryStatesList() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      console.log(res.country);
      this.states = res.state;
      this.countryAll = res.country;
    });
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
    Toast.fire({
      icon: icon,
      title: msg,
    });
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  clearVal() {
    this.incorrectPass = false;
  }
  msgError: any
  msgErrorADD: boolean = false
  onSubmitEmailLogin() {
    if (this.emailSignupForm.value.password == this.emailSignupForm.value.confirm_password) {
      this.userExist = localStorage.getItem("isUserExist");
      let ip: any = localStorage.getItem("ipSaveData") || {}
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
      this.email = this.emailLoginForm.value.email
      this.mobile = this.emailSignupForm.value.mobile

      if (this.userExist == 1) {

        if (this.emailLoginForm.valid) {

          const formData: any = new FormData();
          formData.append("email", this.emailLoginForm.value.email);
          formData.append("password", this.emailLoginForm.value.password);
          formData.append(
            "dod",
            JSON.stringify(device_other_detail)
          );
          formData.append("dd", JSON.stringify(devicedetail));
          formData.append("device", "web");
          formData.append('payload', this.otpSecret);
          this.auth.ottLogin(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.userSessionData = decryptData
              console.log(this.userSessionData);

              this.sendToSubscribeLogin.emit(3);
              this.DEC_SER.getDecryptedData(res.result);
              localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
              localStorage.setItem('device_id', this.visitorId)
              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.setItem("ott_subtitle_setup", "0");
              this.getSwalmsg('Logged In Successfully', 'success');
              // this.getSwalmsg('Signed in successfully', 'success');
              this.dialogRef.close();
              this.loginSuccess.emit("success");
              this.getGeographicalState();
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
  
              firebase.analytics().logEvent('LOGIN', {
                'userId': JSON.parse(this.DEC_SER.decryptData).id,
              })
              firebase.analytics().logEvent('DEVICE_ID', {
                'deviceId': this.visitorId,
              })
            } else {
              firebase.analytics().logEvent('LOGIN_FAIL', {

              })
              this.incorrectPass = true;
              this.showError = true
            }
          });
        } else {
          // this.showError=true;
        }
      } else if (this.userExist == 0) {

        if (this.emailSignupForm.valid) {
          const formData: any = new FormData();
          formData.append("email", this.emailSignupForm.value.email);
          formData.append("password", this.emailSignupForm.value.password);
          formData.append("phone", this.emailSignupForm.value.mobile);
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
          formData.append("country_code", JSON.parse(ip).countryCode);
          this.auth.ottSignup(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.openOtpModal = true
              if (JSON.parse(ip).countryCode == 'IN') {
                this.typesLogin = 'email'
              } else {
                this.typesLogin = 'international-email'
              }

              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              console.log(decryptData);

              localStorage.setItem('ott_otp_userid', decryptData.id);
              const formData: any = new FormData();
              formData.append("mode", 'verification');
              formData.append("type", 'mail');
              formData.append("value", this.emailSignupForm.value.email);
              formData.append("device", 'web');
              formData.append('payload', this.otpSecret);
              formData.append("c_id", decryptData.id);
              this.auth.generateOtp(formData).subscribe((res: any) => {
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);
                console.log(decryptData, 'otpppppppppp');
            
              });
            } else {
              this.msgErrorADD = true
              // this.msgError = res.error
              this.msgError = "mobile_number_already_exists"
                // console.log(res.error,"error")

            }
          });
        }
      }
    } else {
      this.alertMsg = true
    }
  }
  getInputKey(event: any) {

    if (event !== '') {
      this.showError = false
      this.msgErrorADD = false

    } else {

    }

  }
  onKeydown(event: any) {
    this.alertMsg = false;
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
      localStorage.setItem("ipSaveData", JSON.stringify(res));

      // userSessionApi Start

      var inputDate = new Date();
      var formattedDate = this.formatDate(inputDate);

      const formData: any = new FormData();
      formData.append("customer_id", this.userSessionData.id);
      formData.append("type", "start");
      formData.append("time", formattedDate);
      formData.append("device_unique_id", this.visitorId);
      formData.append("device_type", "web");
      formData.append("content_type", "vod");
      formData.append("customer_name", this.userSessionData.first_name + '' + this.userSessionData.last_name);
      formData.append("country", res.countryName);
      formData.append("country_code", res.countryCode);
      formData.append("network_type", res.security.network);
      formData.append("network_provider", res.connection.isp);
      formData.append("platform", res.userAgent.platform);
      formData.append("browser", res.userAgent.browser);
      formData.append("screen_resolution", window.screen.availWidth + '*' + window.screen.availHeight);
      formData.append("os_version", res.userAgent.operatingSystem);
      formData.append("age_group", this.userSessionData.age_group);
      formData.append("gender", this.userSessionData.gender);
      formData.append("city", res.city);
      this._DS.userSession(formData).subscribe((res: any) => {
        if (res.code == 1) {
          console.log(res);

        }
      });
    });
  }
  getConfigData() {
    this._DS.faqData().subscribe((res: any) => {
      console.log(res)
      this.baseSignin = res.Form[0].signin;
      this.baseSignup = res.Form[0].signup;
      console.log(res.Form[0].signup);
    });
  }
  getSubscribeInfo(uid: number) {
    this._DS.getSubtitle(uid).subscribe((res: any) => {

      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (sendTosett.payload.language_key != null || sendTosett.payload.language_key != '') {
        localStorage.setItem("regional", sendTosett.payload.language_key);
      }
      // localStorage.setItem("app_lang", sendTosett.payload.app_language);
      // const languageMap: { [key: string]: string } = {
      //   'as': 'Assamese',
      //   'bn': 'Bengali',
      //   'bg': 'Bulgarian',
      //   'zh-CN': 'Chinese (Simplified)',
      //   'en': 'English',
      //   'fr': 'French',
      //   'de': 'German',
      //   'gu': 'Gujarati',
      //   'he': 'Hebrew',
      //   'hi': 'Hindi',
      //   'ja': 'Japanese',
      //   'kn': 'Kannada',
      //   'ko': 'Korean',
      //   'ml': 'Malayalam',
      //   'mr': 'Marathi',
      //   'mn': 'Mongolian',
      //   'or': 'Odia',
      //   'pa': 'Punjabi',
      //   'ru': 'Russian',
      //   'es': 'Spanish',
      //   'ta': 'Tamil',
      //   'te': 'Telugu'
      // };

     
      // const reverseLanguageMap: { [key: string]: string } = Object.keys(languageMap).reduce((acc, key) => {
      //   acc[languageMap[key].toLowerCase()] = key;
      //   return acc;
      // }, {} as { [key: string]: string });
      // setTimeout(() => {

      //   const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      //   if (selectElement) {
      //     if (sendTosett.payload.app_language != '' || sendTosett.payload.app_language != null) {
      //       const appLanguage = sendTosett.payload.app_language.toLowerCase();
      //       const languageCode = reverseLanguageMap[appLanguage];
      //       selectElement.value = languageCode;
      //       selectElement.dispatchEvent(new Event('change'));
      //       setTimeout(() => {
      //         selectElement.value = languageCode;
      //         selectElement.dispatchEvent(new Event('change'));
      //       }, 1000);

      //     }
      //   }
      // }, 2000);
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
          }

        });
      } else {
        this.ed.reload.next(true);
      }
    });

  }
  showPassword(input: any) {
    this.showpass = !this.showpass;
    input.type = this.showpass ? "text" : "password";
  }
  showPassword1(input: any) {
    this.showpass1 = !this.showpass1;
    input.type = this.showpass1 ? "text" : "password";
  }
  editEmail() {
    console.log("Editable");
  }
  moveToPolicy(policy: any) {
    if (policy == "policy") {
      this.router.navigate(["/privacy-policy"]);
    }
    this.dialogRef.close();
  }
  moveToTerm(terms: any) {
    if (terms == "terms") {
      this.router.navigate(["/termsofUse"]);
    }
    this.dialogRef.close();
  }
  // checkLookup(data: any) {
  // let ip: any = localStorage.getItem("ipSaveData");
  // const formData = new FormData();
  // formData.append("email", data);
  // this.auth.OttcheckUserExisted(formData).subscribe((res) => {
  // console.log(res);
  // if(res.code==0){
  // this.userExist=0
  // localStorage.setItem('isUserExist', this.userExist)
  // this.emailSignupForm.patchValue({
  // email: data
  // });
  // this.sendtoLoginSocial.emit(false);
  // // this.fcs.socialHIde.next(true)
  // }else if(res.code==1){
  // this.userExist=1
  // localStorage.setItem('isUserExist', '1')
  // this.emailLoginForm.patchValue({
  // email: data
  // });
  // this.sendtoLoginSocial.emit(true);
  // }

  // });
  // }
  triggerEvent() {
    this.searchText = ''
  }
  gotoForgotPassword() {
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


  back2() {
    // this.fcs.loginModal.next(true)
    this.dialogRef.close()
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "420px",
      data: { email: this.emailLoginForm.value.email },
    });
    dialogRef.disableClose = true;
    // this.inputEnable = false;
  }

}
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