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
import { ActivatedRoute, Router } from "@angular/router";
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
import { SucessDialogComponent } from "../sucess-dialog/sucess-dialog.component";
import { receiveMessageOnPort } from "worker_threads";
import * as firebase from "firebase/app";
declare var $: any;
@Component({
  selector: "app-otp-dialog",
  templateUrl: "./otp-dialog.component.html",
  styleUrls: ["./otp-dialog.component.scss"],
})
export class OtpDialogComponent implements OnInit {
  @ViewChild("ngOtpInput") ngOtpInput: any;
  @Output() sendToSubscribeLogin = new EventEmitter<any>();
  @Output() resendOtpToLogin = new EventEmitter<any>();
  @Output() loginSuccess = new EventEmitter<string>();
  @Input() userMobile: any;
  @Input() country: any;
  @Input() valueMobile: any;
  @Input() valueIdUserExist: any;
  @Input() email: string = "";
  @Input() mobile: string = "";
  @Input() social: string = "";
  @Input() dataSocialTaploginfo: any;
  @Input() userids: any;
  @Input() typeLogin: any;
  @Input() type: string = "";
  showMobileBox: boolean = false;
  userEmail: any;
  usermobile: any;
  otpExceeded: boolean = false;
  clicked = true;
  visitorId: any;
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
  userSessionData: any;
  errorAlertData: any;
  show: boolean = false;
  packageData: any;
  jsonDatapack: any;
  hide: boolean = true;
  otpTime: any;
  otpSecret: any;
  userInfo: any = localStorage.getItem("taploginInfo") || {};
  OTTPlans: any = [];

  
  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    timer: 1,
    disableAutoFocus: false,

    placeholder: "",

    inputStyles: {
      width: "40px",
      // 'margin-right': '16px',
      color: "white",
      "background-color": "transparent",
      "border-bottom": "2px solid #939393",
      "border-left": "none",
      "border-right": "none",
      "border-top": "none",
      // 'border': 'none',
      outline: "none",
      "border-radius": "0px",
    },
  };
  menuOn?: boolean;
  otpInput = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  otpInput2 = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  result: any;
  mesg: any;
  endLetters: any;
  otpErrorMessage = "";
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
    private router: Router
  ) {
    // this.timer(1);
  }
  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.type, "aaaaaaaaa");
    }, 1000);
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);
    this.getConfigData();
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
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe((r) => (this.visitorId = r));
    // var mobileNumer = "+91987654321"

    this.getCountryName();

    this.userEmail = this.email;
    if (this.typeLogin == "social") {
      this.usermobile = this.social;
    } else {
      this.usermobile = this.mobile;
    }
  }
  onOtpChange(otp: any) {
    if (otp.length < 4) {
      this.hide = true;
      this.show = false;
    }
  }
  getConfigData() {
    const popup: any = localStorage.getItem("allJsonPopupData");
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0];
    console.log(this.baseLine);

    console.log(dataPopup.PopupList[0]);
    // this._DS.popupJson().subscribe((res: any) => {
    // console.log(res.PopupList[0]);
    // this.baseLine = res.PopupList[0]
    // //
    // })
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }

  onVerifyOtp() {
    if (this.userExist == 0) {
      if (this.otpInput2.valid) {
        if (this.typeLogin == "social") {
          const formData = new FormData();
          let ott_userid: any = localStorage.getItem("ott_otp_userid");
          formData.append("user_id", ott_userid);
          formData.append("otp", this.otpInput2.value);
          formData.append("device", "web");
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
          this.auth.verifOtpPhone(formData).subscribe((res) => {
            if (res.code == 1) {
              this.sendToSubscribeLogin.emit(3);
              this.loginSuccess.emit("success");
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              console.log(decryptData);

              localStorage.setItem("taploginInfo", JSON.stringify(decryptData));
              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.setItem("device_id", this.visitorId);
              localStorage.removeItem("ott_otp_userid");
              this.getGeographicalState();
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              this.dialogRef.close();
              this._SWAL.getSwalmsg("Registered Successfully", "success");
              this.es.isUserLoggedIn.next(true);
              this.es.isUserLoggedInModal.next(true);
              // this.leadSquare()
              firebase.analytics().logEvent('SIGN_UP', {
                'userId': JSON.parse(this.DEC_SER.decryptData).id,
              })
              firebase.analytics().logEvent('DEVICE_ID', {
                'deviceId': this.visitorId,
              })
              // location.reload();
            } else {
              let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
              const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
                panelClass: "adultAgePopup",
                width: "420px",
                backdropClass: "backdropBackground",
                data: { message: "true", mess: errorKey },
              });

              firebase.analytics().logEvent("SIGN_UP_FAILED", {
                userId: JSON.parse(this.DEC_SER.decryptData).id,
              });
            }
          });
        } else {
          const formData = new FormData();
          let ott_userid: any = localStorage.getItem("ott_otp_userid");
          // formData.append("user_id", ott_userid);
          // formData.append("otp_mail", this.otpInput.value);
          // formData.append("otp_phone", this.otpInput2.value);
          formData.append("user_id", ott_userid);
          formData.append("otp", this.otpInput2.value);
          formData.append("device", "web");
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
          // this.auth.verifyottOtp(formData).subscribe((res) => {
          this.auth.verifOtpPhone(formData).subscribe((res) => {
            if (res.code === 1) {
              if (this.typeLogin == "phone") {
                const formData: any = new FormData();
                formData.append("type", "mail");
                formData.append("value", this.userEmail);
                formData.append("device", "web");
                formData.append("payload", this.otpSecret);
                formData.append("c_id", ott_userid);
                this.auth.generateOtp(formData).subscribe((res: any) => {
                  this.type = "email";
                  this.DEC_SER.getDecryptedData(res?.result);
                  let decryptData = JSON.parse(this.DEC_SER.decryptData);
                  console.log(decryptData, "otpppppppppp");
                });
              } else {
                // email otp ends

                this.sendToSubscribeLogin.emit(3);
                this.es.isUserLoggedIn.next(true);
                this.es.isUserLoggedInModal.next(true);
                this.dialogRef.close();
                this.DEC_SER.getDecryptedData(res?.result);
                let decryptData = JSON.parse(this.DEC_SER.decryptData);
                console.log(decryptData, "otpppppppppp");
                this.userSessionData = decryptData;

                this.loginSuccess.emit("success");
                localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
                localStorage.setItem("ott_isLoggedIn", "1");
                localStorage.setItem("device_id", this.visitorId);
                localStorage.removeItem("ott_otp_userid");
                this.getGeographicalState();
                this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
                this._SWAL.getSwalmsg('Registered Successfully', 'success');
                // this.leadSquare()
                firebase.analytics().logEvent('SIGN_UP', {
                  'userId': JSON.parse(this.DEC_SER.decryptData).id,
                })
                firebase.analytics().logEvent('DEVICE_ID', {
                  'deviceId': this.visitorId,
                })
                // location.reload();
              }
            } else {
              this.ngOtpInput.setValue("");
              let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
              const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
                panelClass: "adultAgePopup",
                width: "420px",
                backdropClass: "backdropBackground",
                data: { message: "true", mess: errorKey },
              });
              firebase.analytics().logEvent("SIGN_UP_FAILED", {
                userId: JSON.parse(this.DEC_SER.decryptData).id,
              });
            }
          });
        }
      } else {
        this.show = true;
      }
    } else if (this.userExist == 1) {
      if (this.otpInput2.valid) {
        if (this.type == "verify") {
          const formData = new FormData();
          // let ott_userid: any = localStorage.getItem("ott_otp_userid");
          var loginInfo = JSON.parse(
            localStorage.getItem("taploginInfo") || "{}"
          );
          formData.append("user_id", loginInfo.id);
          formData.append("otp", this.otpInput2.value);
          formData.append("device", "web");
          this.auth.verifyEmail(formData).subscribe((res) => {
            if (res.code === 1) {
              this.sendToSubscribeLogin.emit(3);
              this.es.isUserLoggedIn.next(true);
              this.es.isUserLoggedInModal.next(true);
              this.dialogRef.close();
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.userSessionData = decryptData;

              console.log(decryptData, "otpppppppppp");
              this.loginSuccess.emit("success");
              localStorage.setItem("device_id", this.visitorId);
              localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.removeItem("ott_otp_userid");
              this.getGeographicalState();
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              this._SWAL.getSwalmsg('Registered Successfully', 'success');
              // this.leadSquare()
              firebase.analytics().logEvent('SIGN_UP', {
                'userId': JSON.parse(this.DEC_SER.decryptData).id,
              })
              // location.reload();
            } else {
              this.ngOtpInput.setValue("");
              let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
              const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
                panelClass: "adultAgePopup",
                width: "420px",
                backdropClass: "backdropBackground",
                data: { message: "true", mess: errorKey },
              });
              firebase.analytics().logEvent("SIGN_UP_FAILED", {
                userId: JSON.parse(this.DEC_SER.decryptData).id,
              });
            }
          });
        } else {
          const formData = new FormData();
          let ott_userid: any = localStorage.getItem("ott_otp_userid");
          formData.append("user_id", ott_userid);
          formData.append("otp", this.otpInput2.value);
          formData.append("device", "web");
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
          this.auth.verifyottMobile(formData).subscribe((res) => {
            if (res.code === 1) {
              this.sendToSubscribeLogin.emit(3);
              this.es.isUserLoggedIn.next(true);
              this.es.isUserLoggedInModal.next(true);
              this.dialogRef.close();
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              this.userSessionData = decryptData;
              console.log(decryptData, "otpppppppppp");
              this.loginSuccess.emit("success");
              console.log(this.DEC_SER.decryptData), "gurugrammmm";
              localStorage.setItem("device_id", this.visitorId);
              localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
              localStorage.setItem("ott_isLoggedIn", "1");
              localStorage.removeItem("ott_otp_userid");
              this.getGeographicalState();
              this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
              this._SWAL.getSwalmsg("Logged In Successfully", "success");
              firebase.analytics().logEvent("LOGIN", {
                userId: JSON.parse(this.DEC_SER.decryptData).id,
              });
              firebase.analytics().logEvent("DEVICE_ID", {
                deviceId: this.visitorId,
              });
            } else {
              this.ngOtpInput.setValue("");
              let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
              const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
                panelClass: "adultAgePopup",
                width: "420px",
                backdropClass: "backdropBackground",
                data: { message: "true", mess: errorKey },
              });
              firebase.analytics().logEvent("LOGIN_FAIL", {});
            }
          });
        }
      } else {
        this.show = true;
      }
    }
  }

  onKeydown_email(event: any) {
    if (event.key === "Enter") {
      this.onVerifyEmailOtp();
    }
  }

  onKeydown_Phone(event: any) {
    if (event.key === "Enter") {
      this.onVerifyOtp();
    }
  }

  leadSquare() {
    let dateObj = new Date();
    let month = ("0" + (dateObj.getUTCMonth() + 1)).slice(-2); // Add leading zero if needed
    let day = ("0" + dateObj.getUTCDate()).slice(-2); // Add leading zero if needed
    let year = dateObj.getUTCFullYear();

    const newdate = year + "-" + month + "-" + day;
    const date = new Date();

    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);

    const time = date.toLocaleTimeString([], {
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const requestData = [
      {
        Attribute: "EmailAddress",
        Value: USER_ACCOUNT.email,
      },
      {
        Attribute: "mx_App_Last_Login_Date_Time",
        Value: newdate + " " + time,
      },
      {
        Attribute: "mx_App_User_Source",
        Value: "Web",
      },
      {
        Attribute: "Phone",
        Value: USER_ACCOUNT.contact_no,
      },
    ];
    this._DS.leadSquare(requestData).subscribe((res: any) => {});
  }
  onVerifyEmailOtp() {
    if (this.otpInput.valid) {
      if (this.typeLogin == "email") {
        console.log(this.userMobile);

        const formData = new FormData();
        let ott_userid: any = localStorage.getItem("ott_otp_userid");
        formData.append("user_id", ott_userid);
        formData.append("otp", this.otpInput.value);
        formData.append("device", "web");
        this.auth.verifyEmail(formData).subscribe((res) => {
          if (res.code === 1) {
            this.showMobileBox = true;
            this.type = "phone";
            const formData1: any = new FormData();
            formData1.append("type", "phone");
            formData1.append("value", this.usermobile);
            formData1.append("device", "web");
            formData1.append("payload", this.otpSecret);
            formData1.append("c_id", ott_userid);
            this.auth.generateOtp(formData1).subscribe((res: any) => {
              console.log(res.result);
              this.DEC_SER.getDecryptedData(res?.result);
              let decryptData = JSON.parse(this.DEC_SER.decryptData);
              console.log(decryptData, "otpppppppppp");
            });
          } else {
            this.ngOtpInput.setValue("");
            let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
            const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
              panelClass: "adultAgePopup",
              width: "420px",
              backdropClass: "backdropBackground",
              data: { message: "true", mess: errorKey },
            });
          }
        });
      } else {
        // phone otpends
        const formData = new FormData();
        let ott_userid: any = localStorage.getItem("ott_otp_userid");
        formData.append("user_id", ott_userid);
        formData.append("otp", this.otpInput.value);
        formData.append("device", "web");
        this.auth.verifyEmail(formData).subscribe((res) => {
          if (res.code === 1) {
            this.sendToSubscribeLogin.emit(3);
            this.es.isUserLoggedIn.next(true);
            this.es.isUserLoggedInModal.next(true);
            this.dialogRef.close();
            this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.userSessionData = decryptData;

            console.log(decryptData, "otpppppppppp");
            this.loginSuccess.emit("success");
            localStorage.setItem("device_id", this.visitorId);
            localStorage.setItem("taploginInfo", this.DEC_SER.decryptData);
            localStorage.setItem("ott_isLoggedIn", "1");
            localStorage.removeItem("ott_otp_userid");
            this.getGeographicalState();
            this.getSubscribeInfo(JSON.parse(this.DEC_SER.decryptData).id);
            this._SWAL.getSwalmsg('Registered Successfully', 'success');
            // this.leadSquare()
            firebase.analytics().logEvent('SIGN_UP', {
              'userId': JSON.parse(this.DEC_SER.decryptData).id,
            })
            // location.reload();
          } else {
            this.ngOtpInput.setValue("");
            let errorKey = '';
              if (
                res.error === "You have entered a wrong OTP, please try again."
              ) {
                errorKey = "otp_error_wrong";
              } else if (res.error === "otp expired") {
                errorKey = "otp_error_expired";
              } else {
                errorKey = "otp_error_generic"; // optional fallback
              }
            const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
              panelClass: "adultAgePopup",
              width: "420px",
              backdropClass: "backdropBackground",
              data: { message: "true", mess: errorKey },
            });
            firebase.analytics().logEvent("SIGN_UP_FAILED", {
              userId: JSON.parse(this.DEC_SER.decryptData).id,
            });
          }
        });
      }
    } else {
      this.show = true;
    }
  }

  openSucessReg() {
    const dialogRef = this.dialog.open(SucessDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "registerDialog",
      width: "360px",
    });
  }
  // otpCount(){
  //
  // var phoneNumber=this.valueMobile
  // this._DS.otpCountData(this.valueMobile).subscribe((res: any) => {
  // console.log(res);

  // this.totalOtpCount=res.result
  // console.log(this.totalOtpCount.countOtp1_hour);
  // console.log(this.totalOtpCount.countOtp24_hours);

  // });
  // }
  getCountryName() {
    // this._DS.countryNames().subscribe((res: any) => {
    // this.country = res
    // console.log(this.country);

    // })
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.country = res.country;
      // console.log(this.country);
      this.global = res.global_setting;
      console.log(this.global);

      if (this.global.is_custom == 1) {
        this.otpValidation = this.global;
      } else {
        this.ipCountryName = localStorage.getItem("ipSaveData");
        this.ipCountry = JSON.parse(this.ipCountryName).countryName;
        console.log(this.ipCountry);

        this.countryData = this.country.find(
          (x: { name: any }) => x.name === this.ipCountry
        );
        console.log(this.countryData);
        this.otpValidation = this.countryData;
        console.log(this.otpValidation);
      }
    });
  }
  resendOtp() {
    // console.log(this.valueIdUserExist)

    // var phoneNumber = this.valueMobile
    // this._DS.otpCountData(this.valueMobile).subscribe((res: any) => {
    // console.log(res);

    // this.totalOtpCount = res.result
    // console.log(this.totalOtpCount.countOtp1_hour);
    // console.log(this.totalOtpCount.countOtp24_hours);

    // console.log(this.otpValidation.sms_max_hour_limit);
    // console.log(this.totalOtpCount.countOtp1_hour);

    // console.log(this.otpValidation.sms_max_day_limit);
    // console.log(this.totalOtpCount.countOtp24_hours);
    // if (this.otpValidation.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour && this.otpValidation.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours) {
    //

    // if(this.valueIdUserExist != undefined){
    //

    let ott_userid: any = localStorage.getItem("ott_otp_userid");
    const formData: any = new FormData();
    if (this.type == "email") {
      formData.append("value", this.userEmail);
    } else if (this.typeLogin == "social") {
      formData.append("value", this.social);
    } else {
      formData.append("value", this.usermobile);
    }
    if (this.type == "email") {
      formData.append("type", "mail");
      formData.append("type", "verification");
    } else {
      formData.append("type", "phone");
    }
    formData.append("device", "web");
    formData.append("payload", this.otpSecret);
    formData.append("c_id", ott_userid);
    // this.auth.forgotPassword(formData).subscribe((res: any) => {
    this.auth.generateOtp(formData).subscribe((res: any) => {
      // formData.append('payload', this.otpSecret);
      // formData.append('device', 'web');
      // formData.append('user_id', ott_userid);
      // this._DS.resendOtp(formData).subscribe((res: any) => {
      console.log(res);
      if (res.code == 1) {
        this.timerHide = true;
        this.timer(this.otpTime);
        this.clicked = true;
        this._SWAL.getSwalmsg("Otp has been Sent!!", "success");
      }
    });
    // }else{

    // this.resendOtpToLogin.emit("resend");
    // this.timerHide = true;
    // this.timer(1);
    // this.clicked = true;
    // }
    // //

    // } else {

    // this.clicked = true;
    // this.otpExceeded = true;
    // }
    // });
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
      console.log(res);
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
      formData.append(
        "customer_name",
        this.userSessionData.first_name + "" + this.userSessionData.last_name
      );
      formData.append("country", res.countryName);
      formData.append("country_code", res.countryCode);
      formData.append("network_type", res.security.network);
      formData.append("network_provider", res.connection.isp);
      formData.append("platform", res.userAgent.platform);
      formData.append("browser", res.userAgent.browser);
      formData.append(
        "screen_resolution",
        window.screen.availWidth + "*" + window.screen.availHeight
      );
      formData.append("os_version", res.userAgent.operatingSystem);
      formData.append("age_group", this.userSessionData.age_group);
      formData.append("gender", this.userSessionData.gender);
      formData.append("city", res.city);
      this._DS.userSession(formData).subscribe((res: any) => {
        if (res.code == 1) {
          console.log(res);
        }
      });

      // userSessionApi End
    });
  }
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
      localStorage.setItem("app_lang", sendTosett.payload.app_language);
      const languageMap: { [key: string]: string } = {
        as: "Assamese",
        bn: "Bengali",
        bg: "Bulgarian",
        "zh-CN": "Chinese (Simplified)",
        en: "English",
        fr: "French",
        de: "German",
        gu: "Gujarati",
        he: "Hebrew",
        hi: "Hindi",
        ja: "Japanese",
        kn: "Kannada",
        ko: "Korean",
        ml: "Malayalam",
        mr: "Marathi",
        mn: "Mongolian",
        or: "Odia",
        pa: "Punjabi",
        ru: "Russian",
        es: "Spanish",
        ta: "Tamil",
        te: "Telugu",
      };

      // Create a reverse map
      const reverseLanguageMap: { [key: string]: string } = Object.keys(
        languageMap
      ).reduce((acc, key) => {
        acc[languageMap[key].toLowerCase()] = key;
        return acc;
      }, {} as { [key: string]: string });
      setTimeout(() => {
        const selectElement = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement;
        if (selectElement) {
          if (
            sendTosett.payload.app_language != "" ||
            sendTosett.payload.app_language != null
          ) {
            const appLanguage = sendTosett.payload.app_language.toLowerCase();
            const languageCode = reverseLanguageMap[appLanguage];
            selectElement.value = languageCode;
            selectElement.dispatchEvent(new Event("change"));
            setTimeout(() => {
              selectElement.value = languageCode;
              selectElement.dispatchEvent(new Event("change"));
            }, 1000);
          }
        }
      }, 2000);
    });
    this._DS.getUserSubscriptionDetails(uid).subscribe((res) => {
      this.packageData = localStorage.getItem("faqData");
      this.jsonDatapack = JSON.parse(this.packageData);
      this.DEC_SER.getDecryptedData(res.result);
      const data: any = JSON.parse(this.DEC_SER.decryptData);
      if (data.is_subscriber == 1) {
        this.es.isSubscribe.next(true);
        this.es.alreadySubscriber.next(true);
        localStorage.setItem("is_subscriber", "1");
        this.es.parentalLock.next(false);
        if (
          data.expire_days <=
          this.jsonDatapack.Others.package_stacking.subscribed.days
        ) {
          this.es.showButton.next(true);
          localStorage.setItem("showButton", "1");
        }
      } else if (data.is_subscriber == 0) {
        localStorage.setItem("is_subscriber", "0");
        this.es.isSubscribe.next(false);
        this.es.alreadySubscriber.next(false);
        this.es.parentalLock.next(true);
        // this.router.navigate(['/'])
      }

      this._storage.setData("ott_subscriptionPlan", data);
      data.packages_list.filter((res: any) => {
        if (res.package_mode == "OTT") {
          this.OTTPlans.push(res);
        }
      });

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
              this.es.reload.next(true);
            });
            dialogRef.disableClose = true;
          } else {
            this.es.reload.next(true);
            // this.router.navigate(['/'])
          }
        });
      } else {
        this.es.reload.next(true);
        // this.router.navigate(['/'])
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
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }
}
