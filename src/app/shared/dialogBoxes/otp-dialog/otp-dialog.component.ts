import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthService } from "src/app/services/auth.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { StorageService } from "src/app/services/storage.service";
import { SwalMsgService } from "src/app/services/swal-msg.service";
import { DeviceRestrictionPopupComponent } from "../device-restriction-popup/device-restriction-popup.component";
import { LoginModalDialogComponent } from "../login-modal-dialog/login-modal-dialog.component";
import { WrongOtpPopupComponent } from "../wrong-otp-popup/wrong-otp-popup.component";
declare var $: any;
declare global {
  interface Window {
    firebaseAnalytics?: {
      logEvent: (eventName: string, params?: any) => void;
    };
  }
}
import { environment } from "src/environments/environment";
import { PackageStackingComponent } from "../package-stacking/package-stacking.component";
import { FacebookLoggerService } from "src/app/services/facebook-logger.service";
import { FacebookPixelService } from "src/app/services/facebook-pixel.service";
// import * as amplitude from '@amplitude/analytics-browser';
@Component({
  selector: "app-otp-dialog",
  templateUrl: "./otp-dialog.component.html",
  styleUrls: ["./otp-dialog.component.scss"],
})
export class OtpDialogComponent implements OnInit {
  @ViewChild("ngOtpInput") ngOtpInput: any;

  visitorId: any = localStorage.getItem('device_id')
  @Output() sendToSubscribeLogin = new EventEmitter<any>();
  @Output() resendOtpToLogin = new EventEmitter<any>();
  @Output() loginSuccess = new EventEmitter<string>();
  @Input() userMobile: any;
  @Input() country: any;
  @Input() valueMobile: any;
  @Input() valueIdUserExist: any;
  showOtp = true;
  otpExceeded: boolean = false;
  clicked = true;
  timerHide = true;
  display: any;
  userExist: any = localStorage.getItem("isUserExist");
  baseLine: any = [];
  global: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpValidation: any;
  errorMsg: any;
  errorAlertData: any;
  show: boolean = false;
  hide: boolean = true;
  USER_ACCOUNT_id: any;
  packageData: any;
  jsonDatapack: any;
  packageDataSend: any;
  packageDataListCheck: any;
  otpSecret: any;
  userInfo: any = localStorage.getItem("taploginInfo") || {};
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: false,         // Set to false for visibility while typing
    // disableAutoFocus: false,
    inputType: "text", // Use 'text' (not 'tel') for best compatibility
    inputmode: "numeric",
    pattern: "[0-9]*",
    autocomplete: "one-time-code",
    autocorrect: "off",
    autocapitalize: "off",
    // placeholder: '',
    inputStyles: {
      width: "70px",
      color: "white",
      backgroundColor: "transparent",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: "2px solid #AAAAAA",
      outline: "none",
      borderRadius: "0px",
    },
  };

  menuOn?: boolean;
  otpInput = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  result: any;
  mesg: any;
  endLetters: any;
  otpErrorMessage = "";
  otpTime: any;
  constructor(
    public dialog: MatDialog,
    private auth: AuthService,
    private _DS: DataService,
    private DEC_SER: DecryptService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    private _AR: ActivatedRoute,
    private _storage: StorageService,
    private _SWAL: SwalMsgService,
    public dialogRef: MatDialogRef<LoginModalDialogComponent>,
    public es: ExchangeDataService,
    private fbLogger:FacebookLoggerService,
    private fbPixelService:FacebookPixelService
  ) {
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);

    this.otpTime = Number(this.errorMsg.otpExpiryTime) / 60;
  }

  ngAfterViewInit() {
    const otpInputs = document.querySelectorAll("ng-otp-input input");
    otpInputs.forEach((input: any) => {
      // input.setAttribute('type', 'text');
      input.setAttribute("inputmode", "numeric");
      input.setAttribute("pattern", "[0-9]*");
      input.setAttribute("autocomplete", "one-time-code");
      input.setAttribute("autocorrect", "off");
      input.setAttribute("autocapitalize", "off");
    });
  }

  ngOnInit(): void {
    this.timer(this.otpTime);
    this.getConfigData();


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
  }
  onOtpChange(event: string, type: "otp") {
    if (event.length === 0) {
      if (type === "otp") {
        this.showOtp = false;
        setTimeout(() => (this.showOtp = true), 10);
      }
    }
  }

  getConfigData() {
    const popup: any = localStorage.getItem("allJsonPopupData");
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0];

    // this._DS.popupJson().subscribe((res: any) => {

    //   this.baseLine = res.PopupList[0]

    // })
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  onVerifyOtp() {
    if (this.otpInput.valid) {
      const formData = new FormData();
      let ott_userid: any = localStorage.getItem("ott_otp_userid");
      formData.append("user_id", ott_userid);
      formData.append("otp", this.otpInput.value);
      formData.append("type", "phone");
      formData.append("device", "web");
      this.auth.verifyottOtp(formData).subscribe((res) => {
        if (res.code === 1) {
          this.sendToSubscribeLogin.emit(3);
          this.es.isUserLoggedIn.next(true);
          this.es.isUserLoggedInModal.next(true);
          this.dialogRef.close();
          this.DEC_SER.getDecryptedData(res.result);
          this.loginSuccess.emit("success");

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
          this.fbPixelService.trackCompleteRegistration(userData);

          localStorage.setItem('isUserId', ott_userid)
          localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
          localStorage.setItem("ott_isLoggedIn", "1");
          localStorage.removeItem("ott_otp_userid");
          this.getGeographicalState();
          this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);

        } else {
          this.ngOtpInput.setValue("");
          const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
            panelClass: "adultAgePopup",
            width: "420px",
            backdropClass: "backdropBackground",
            data: { message: "true", mess: res.error },
          });
          if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
            window.firebaseAnalytics.logEvent('SIGN_UP_FAILED', {
              userId: JSON.parse(this.DEC_SER.decryptData).id
            });
          }
        }
      });
    } else {
      this.show = true;
      if (window.firebaseAnalytics && typeof window.firebaseAnalytics.logEvent === 'function') {
        window.firebaseAnalytics.logEvent('SIGN_UP_FAILED', {
          userId: JSON.parse(this.DEC_SER.decryptData).id
        });
      }
      // // this.mesg = "Please Enter a OTP"
      // this.mesg = "OTP is required";
    }
  }

  getCountryName() {
    // this._DS.countryNames().subscribe((res: any) => {
    //   this.country = res

    // })
    this._DS.getCountryStateList().subscribe((res: any) => {
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
  resendOtp() {
    // this.timerHide = true;
    // this.timer(1);
    // this.clicked = true;
    // this.resendOtpToLogin.emit("resend");

    var phoneNumber = this.valueMobile;
    this._DS.otpCountData(this.valueMobile).subscribe((res: any) => {
      this.totalOtpCount = res.result;

      if (
        this.otpValidation.sms_max_hour_limit >=
        this.totalOtpCount.countOtp1_hour &&
        this.otpValidation.sms_max_day_limit >=
        this.totalOtpCount.countOtp24_hours
      ) {
        // this.timerHide = true;
        // this.timer(1);
        // this.clicked = true;

        if (this.valueIdUserExist != undefined) {
          const formData: any = new FormData();
          formData.append("value", this.valueMobile);
          formData.append("type", "phone");
          formData.append("device", "web");
          formData.append("user_id", this.valueIdUserExist.id);
          formData.append("payload", this.otpSecret);

          this._DS.resendOtp(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.timerHide = true;
              this.timer(this.otpTime);
              this.clicked = true;
              this._SWAL.getSwalmsg("Otp has been Sent!!", "success");
            }
          });
        } else {
          this.resendOtpToLogin.emit("resend");
          this.timerHide = true;
          this.timer(this.otpTime);
          this.clicked = true;
        }
        //
      } else {
        // this._SWAL.getSwalmsg('Logged In Successfully', 'success');
        this.clicked = true;
        this.otpExceeded = true;
      }
    });
  }
  getGeographicalState() {
    this._DS.apipip().subscribe((res: any) => {
      if (res.code == 1) {
        this.DEC_SER.getDecryptedData(res?.result);
        let ipSaveData = JSON.parse(this.DEC_SER.decryptData);
        localStorage.setItem("ipSaveData", JSON.stringify(ipSaveData));
      }
    });
  }
  getSubscribeInfo(uid: number) {
    console.log("qqqqqq");
    this._DS.getSubtitle(uid).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      console.log(decryptData);
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
      console.log(data, "zzzzzzz");
      this.packageDataListCheck = data.packages_list[0];
      this.packageData = localStorage.getItem("faqData");
      this.jsonDatapack = JSON.parse(this.packageData);

      console.log(this.packageDataListCheck, "ssssssssss");
      if (data.is_subscriber == 1) {
        this.es.isSubscribe.next(true);

        // if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 0) {
        //   this.es.alreadySubscriber.next(true)
        // } else if (this.packageDataListCheck.autorenew == 1 && this.packageDataListCheck.is_cancelled == 1) {
        //   if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
        //     this.es.alreadySubscriber.next(false)
        //   } else {
        //     this.es.alreadySubscriber.next(true)
        //   }

        // } else {
        //   if (data.expire_days <= this.jsonDatapack.Others.package_stacking.subscribed.days) {
        //     this.es.alreadySubscriber.next(false)
        //   } else {
        //     this.es.alreadySubscriber.next(true)
        //   }

        // }
        const exp_date = new Date(
          data["packages_list"][0]["subscription_end"]
        ).getTime();
        // this._storage.setData('ott_expiry_date', exp_date);
        localStorage.setItem("is_subscriber", "1");
        this.es.parentalLock.next(false);

        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);
        var d: any = new Date(this.packageDataListCheck.end_date);
        var x: any = new Date();
        var sd: any = new Date(x);
        var s = d - sd;
        var userage: any = new Date(this.USER_ACCOUNT_id.dob);
        var currentage: any = new Date();
        var newage: any = new Date(currentage);
        var age: any = newage - userage;
      } else if (data.is_subscriber == 0) {
        localStorage.setItem("is_subscriber", "0");
        this.es.isSubscribe.next(false);
        this.es.alreadySubscriber.next(false);
        this.es.parentalLock.next(true);
        const taplogininfo: any = localStorage.getItem("taploginInfo");
        this.USER_ACCOUNT_id = JSON.parse(taplogininfo);

        var userage: any = new Date(this.USER_ACCOUNT_id.dob);
        var currentage: any = new Date();
        var newage: any = new Date(currentage);
        var age: any = newage - userage;
        if (
          data.user_days >=
          this.jsonDatapack.Others.package_stacking.register.days
        ) {
          this.openPackageStackingDialog(0);
        }
      }
      this._storage.setData("ott_subscriptionPlan", data);
      const devicerestc = data.packages_list[0].device_restriction;
      console.log(devicerestc, "aaaaaaa");
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
            this.es.pauseDetailVideo.next(true);
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
              if (localStorage.getItem("VideoAutoPlay") == "0") {
                this.es.pauseDetailVideo.next(false);
              }
              localStorage.setItem("videoCarousel", "0");
            });
            dialogRef.disableClose = true;
          } else if (
            this.packageDataListCheck.autorenew == 1 &&
            this.packageDataListCheck.is_cancelled == 0
          ) {
            this.es.reload.next(true);
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
              this.es.reload.next(true);
            }
          } else {
            if (
              data.expire_days <=
              this.jsonDatapack.Others.package_stacking.subscribed.days
            ) {
              this.openPackageStackingDialog(data.is_subscriber);
            } else {
              this.es.reload.next(true);
            }
          }
        });
      } else {
        if (
          data.expire_days <=
          this.jsonDatapack.Others.package_stacking.subscribed.days
        ) {
          this.openPackageStackingDialog(data.is_subscriber);
        } else {
          this.es.reload.next(true);
        }
      }
    });
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

  openPackageStackingDialog(data: any): void {
    if (
      data == 1 &&
      this.jsonDatapack.Others.package_stacking.subscribed.is_allow == 1
    ) {
      this.packageDataSend =
        this.jsonDatapack.Others.package_stacking.subscribed;
    } else if (
      data == 0 &&
      this.jsonDatapack.Others.package_stacking.register.is_allow == 1
    ) {
      this.packageDataSend = this.jsonDatapack.Others.package_stacking.register;
    }
    if (this.jsonDatapack.Others.package_stacking.is_allow == 1) {
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
