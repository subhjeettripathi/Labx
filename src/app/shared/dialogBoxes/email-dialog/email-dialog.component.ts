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
import { environment } from "src/environments/environment";
import { PackageStackingComponent } from "../package-stacking/package-stacking.component";
// import * as amplitude from '@amplitude/analytics-browser';

import { SwalMsgService } from "src/app/services/swal-msg.service";
import { FacebookLoggerService } from "src/app/services/facebook-logger.service";
import { FacebookPixelService } from "src/app/services/facebook-pixel.service";
// declare var FB: any
declare const posthog: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
@Component({
  selector: "app-email-dialog",
  templateUrl: "./email-dialog.component.html",
  styleUrls: ["./email-dialog.component.scss"],
})
export class EmailDialogComponent implements OnInit {
  @ViewChild("input")
  inputEl!: ElementRef;
  emailLoginForm!: FormGroup;
  emailSignupForm!: FormGroup;
  showpass = false;
  showpass1: boolean = false;
  baseSignin: any = [];
  baseSignup: any = [];
  incorrectPass = false;
  visitorId: any = localStorage.getItem('device_id')
  maxDob: any = Date;
  emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$";
  genderAndCountVisible: boolean = false;
  emailss: any;
  password: any;
  over18: any;
  termsandp: any;
  showError: boolean = false;
  genderForm!: FormGroup;
  stateDefault: any;
  showCountry = true;
  states: any = [];
  check: any;
  latest_date!: any;
  searchText: any;
  errorMsg: any;
  errorAlertData: any;
  timeZoneOffset: any;
  USER_ACCOUNT_id: any;
  otherCountryState: any;
  isCountryChange: any;
  packageData: any;
  jsonDatapack: any;
  packageDataSend: any;
  packageDataListCheck: any;
  app_version: any;
  alertMsg: any;
  userSessionData: any;
  session_gender: any;
  msgErrorADD: boolean = false;
  // useRes:any
  msgError: any;
  @Input() emailOption: string = "";
  countryAll: any = [];
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
    public dialog: MatDialog,
    private _SWAL: SwalMsgService,
    private fbLogger: FacebookLoggerService,
    private fbPixelService: FacebookPixelService
  ) {
    this.timeZoneOffset = new Date();
  }
  myModel = true;
  ngOnInit(): void {
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);

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
    });
    this.genderForm = this._fb.group({
      location: ["", Validators.required],
    });
    this.app_version = localStorage.getItem("appVersion");
  }
  ngAfterViewInit() {
    // this.inputEl.nativeElement.focus();
  }
  // submitfirstemailStep() {
  //   if (this.emailSignupForm.valid) {
  //     this.emailss = this.emailSignupForm.value.email;
  //     this.password = this.emailSignupForm.value.password;
  //     // this.over18 = this.emailSignupForm.value.isover18;
  //     // if (this.over18) {
  //     //   this.over18 = 1;
  //     // } else {
  //     //   this.over18 = 0;
  //     // }

  //     // this.termsandp = this.emailSignupForm.value.isCheckedAgree;
  //     this.getGeographicalState();
  //     this.onSubmitEmailLogin();
  //   } else {
  //     this.msgError = "All Fields Are Mandatory*";
  //     this.msgErrorADD = true;
  //   }
  // }
  submitfirstemailStep() {
    // always reset error state at the start
    this.msgError = "";
    this.msgErrorADD = false;

    if (this.emailSignupForm.valid) {
      this.emailss = this.emailSignupForm.value.email;
      this.password = this.emailSignupForm.value.password;

      this.getGeographicalState();
      this.onSubmitEmailLogin();
    } else {
      const hasEmpty = Object.values(this.emailSignupForm.controls)
        .some(control => control.hasError('required'));

      if (hasEmpty) {
        this.msgError = "All Fields Are Mandatory*";
        this.msgErrorADD = true;
      }

      // force Angular validation errors to show
      Object.values(this.emailSignupForm.controls).forEach(c => {
        c.markAsTouched();
        c.updateValueAndValidity();
      });
    }
  }

  inputEnable: boolean = true;
  back() {
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
    }, 200);
    // this.fcs.loginModal.next(true)\
    this.dialogRef.close();
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "420px",
      data: { email: this.emailSignupForm.value.email },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // this.ed.reload.next(true);
      if (localStorage.getItem("VideoAutoPlay") == "0") {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });
    // this.inputEnable = false;
  }
  back2() {
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
    }, 200);
    this.dialogRef.close();
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "420px",
      data: { email: this.emailLoginForm.value.email },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // this.ed.reload.next(true);
      if (localStorage.getItem("VideoAutoPlay") == "0") {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });
    // this.inputEnable = false;
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

  isSubmitting: boolean = false;
  onSubmitEmailLogin() {
    if (this.isSubmitting) {
      // If a submission is already in progress, do nothing
      return;
    }
    this.isSubmitting = true;

    if (
      this.emailSignupForm.value.password ==
      this.emailSignupForm.value.confirm_password
    ) {
      let ip: any = localStorage.getItem("ipSaveData") || {};
      this.userExist = localStorage.getItem("isUserExist");
      const fcm = localStorage.getItem("fcm_token") || '';

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
        // push_device_token: "others",
        device_type: "web",
        platform: this.deviceDetection.deviceType,
        device_unique_id: this.visitorId,
        onesignal_device_id: "fs95345jfddf",
        push_device_token: fcm
      };

      if (this.userExist == 1) {
        this.isSubmitting = true;
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
          this.auth.ottLogin(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.isSubmitting = false; // Re-enable on success
              this.DEC_SER.getDecryptedData(res.result);
              const data: any = JSON.parse(this.DEC_SER.decryptData);
              var uid = data.id;
              this.sendToSubscribeLogin.emit(3);
              this.DEC_SER.getDecryptedData(res.result);
              localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.userSessionData = decryptData;
              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.setItem("ott_subtitle_setup", "0");

              // this.getSwalmsg('Signed in successfully', 'success');
              if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
                window.firebaseAnalytics.logEvent('LOGIN', {
                  userId: JSON.parse(this.DEC_SER.decryptData).id
                });
              }

              if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
                window.firebaseAnalytics.logEvent('DEVICE_ID', {
                  DeviceId: this.visitorId
                });
              }
              const userData = JSON.parse(this.DEC_SER.decryptData).id;
              this.fbLogger.logRegistrationEvent(userData);
              this.fbPixelService.trackCompleteRegistration(userData)

              this.dialogRef.close();
              this.loginSuccess.emit("success");
              this.getGeographicalState();
              this.packageData = localStorage.getItem("faqData");
              this.jsonDatapack = JSON.parse(this.packageData);
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              // this._SWAL.getSwalmsg('Logged In Successfully', 'success');

              this._DS.getUserSubscriptionDetails(uid).subscribe((res: any) => {
                this.DEC_SER.getDecryptedData(res.result);
                const data: any = JSON.parse(this.DEC_SER.decryptData);

                if (
                  data.user_days >=
                  this.jsonDatapack.Others.package_stacking.register.days
                ) {
                } else {
                  if (data.is_subscriber != "1") {
                    window.location.reload();
                  }
                }
              });

              // window.location.reload()

              if (localStorage.getItem("taploginInfo") === null) {
              } else {
                const is_subscriber: any =
                  localStorage.getItem("is_subscriber");
                if (is_subscriber == "0") {
                } else {
                }
              }
              var appVersion = localStorage.getItem("appVersion");
            } else {
              this.isSubmitting = false;
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
          this.isSubmitting = false;
        }
      } else if (this.userExist == 0) {
        if (this.emailSignupForm.valid) {
          this.isSubmitting = true;
          const formData: any = new FormData();
          formData.append("email", this.emailSignupForm.value.email);
          formData.append("password", this.emailSignupForm.value.password)

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

          this.auth.ottSignup(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.isSubmitting = false; // Re-enable on success
              const ipDetail = JSON.parse(
                localStorage.getItem("ipSaveData") || "{}"
              );
              var stateUpdate = ipDetail;
              stateUpdate.regionName = this.genderForm.value.location;
              localStorage.setItem("ipSaveData", JSON.stringify(stateUpdate));
              this.dialogRef.close();
              this.DEC_SER.getDecryptedData(res.result);
              let UserInfo = JSON.parse(this.DEC_SER.decryptData);
              localStorage.setItem(
                "taploginInfo",
                JSON.stringify(UserInfo.info)
              );
              localStorage.setItem('isUserId', UserInfo.id)
              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.setItem("ott_subtitle_setup", "0");
              this.loginSuccess.emit("success");
              localStorage.setItem("ottParental", "0");
              this.auth.loginObservable.next(true);
              this.auth.loginObservable.complete();
              this.getGeographicalState();
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              this._SWAL.getSwalmsg("Registered Successfully", "success");
              posthog.capture('Registered Successfully', {
                user_id: String(JSON.parse(this.DEC_SER.decryptData).id),
                device_id: String(this.visitorId)
              });

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

              window.location.reload();

              // FB.AppEvents.logEvent('fb_web_complete_registration', {
              //   'userId': JSON.parse(this.DEC_SER.decryptData).id
              // });
            } else {
              this.isSubmitting = false; // Re-enable on success
              if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
                window.firebaseAnalytics.logEvent('LOGIN_FAIL', {
                  userId: JSON.parse(this.DEC_SER.decryptData).id
                });
              }
              this.incorrectPass = true;
              this.msgErrorADD = true;
              this.msgError = res.error;
             

            }
          });
        }
      }
    } else {
      this.isSubmitting = false; // Re-enable on success
      this.alertMsg = true;
    }
  }
  myFunc(user: any) {
    if (user.code != "") {
      this.showError = false;
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
          this.otherCountryState = res.regionName;
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
  getConfigData() {
    this._DS.faqData().subscribe((res: any) => {
      this.baseSignin = res.Form[0].signin;
      this.baseSignup = res.Form[0].signup;
    });
  }
  getSubscribeInfo(uid: number) {
    this.packageData = localStorage.getItem("faqData");
    this.jsonDatapack = JSON.parse(this.packageData);

    this._DS.getSubtitle(uid).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (
        sendTosett?.payload?.language_key != null ||
        sendTosett?.payload?.language_key != ""
      ) {
        localStorage.setItem("regional", sendTosett?.payload?.language_key);
      }
    });
    this._DS.getUserSubscriptionDetails(uid).subscribe((res) => {
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      this.packageDataListCheck = data.packages_list[0];

      if (data.is_subscriber == 1) {
        this.eds.isSubscribe.next(true);
        this.eds.alreadySubscriber.next(true);
        // this.eds.alreadySubscriber.next(true)
        // window.location.reload();
        // if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 0) {

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
        this._storage.setData("ott_expiry_date", exp_date);
        localStorage.setItem("is_subscriber", "1");
        this.eds.parentalLock.next(false);

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
        var d: any = new Date(this.packageDataListCheck.end_date);
        var x: any = new Date();
        var sd: any = new Date(x);
        var s = d - sd;
      } else if (data.is_subscriber == 0) {
        localStorage.setItem("is_subscriber", "0");
        this.eds.isSubscribe.next(false);
        this.eds.alreadySubscriber.next(false);
        this.eds.parentalLock.next(true);

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
          console.log(res);

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
        if (data.autorenew == 1 && data.is_cancelled == 0) {
          this.ed.reload.next(true);
        } else if (data.autorenew == 1 && data.is_cancelled == 1) {
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
  showPassword(input: any) {
    this.showpass = !this.showpass;
    input.type = this.showpass ? "text" : "password";
  }

  showPassword1(input: any) {
    this.showpass1 = !this.showpass1;
    input.type = this.showpass1 ? "text" : "password";
  }

  onKeydown(event: any) {
    this.alertMsg = false;
  }
  getInputKey(event: any) {
    if (event !== "") {
      this.showError = false;
      this.msgErrorADD = false;
    } else {
    }
  }
  editEmail() { }
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
  //   let ip: any = localStorage.getItem("ipSaveData");
  //   const formData = new FormData();
  //   formData.append("email", data);
  //   this.auth.OttcheckUserExisted(formData).subscribe((res) => {

  //     if(res.code==0){
  //       this.userExist=0
  //       localStorage.setItem('isUserExist', this.userExist)
  //       this.emailSignupForm.patchValue({
  //         email: data
  //       });
  //       this.sendtoLoginSocial.emit(false);
  //       //  this.fcs.socialHIde.next(true)
  //     }else if(res.code==1){
  //       this.userExist=1
  //       localStorage.setItem('isUserExist', '1')
  //       this.emailLoginForm.patchValue({
  //         email: data
  //       });
  //       this.sendtoLoginSocial.emit(true);
  //     }

  //   });
  // }
  triggerEvent() {
    this.searchText = "";
  }
  gotoForgotPassword() {
    setTimeout(() => {
      this.ed.pauseDetailVideo.next(true);
      localStorage.setItem("videoCarousel", "1");
    }, 200);

    localStorage.setItem("loginShow", "0");

    this.dialogRef.close();

    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: "forgotPassword",
      backdropClass: "popupBackdropClass",
      width: "450px",
      data: { name: this.emailOption },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("VideoAutoPlay") == "0") {
        this.ed.pauseDetailVideo.next(false);
      }
      localStorage.setItem("videoCarousel", "0");
    });
  }
  userInfo: any;

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
    } else {
      window.location.reload();
    }

    // dialogRef.afterClosed().subscribe((result) => { });
  }
}
@Pipe({
  name: "filter",
})
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
