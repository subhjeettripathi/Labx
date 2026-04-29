
import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DecryptService } from 'src/app/services/decrypt.service';
import Swal from 'sweetalert2';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataService } from 'src/app/services/data.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { Router } from '@angular/router';
import { ChechPinParentalComponent } from 'src/app/shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component';
import { EnterOtpComponent } from 'src/app/shared/enter-otp/enter-otp.component';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { UserExistComponent } from 'src/app/shared/dialogBoxes/user-exist/user-exist.component';
import { EnterOtpMobileComponent } from 'src/app/shared/dialogBoxes/enter-otp-mobile/enter-otp-mobile.component';
import { MobileLinkComponent } from 'src/app/shared/dialogBoxes/mobile-link/mobile-link.component';
import { EmailLinkComponent } from 'src/app/shared/dialogBoxes/email-link/email-link.component';
import { first, identity } from 'rxjs';
import { RegionalComponent } from 'src/app/shared/dialogBoxes/regional/regional.component';
import { CreateNewPasswordDialogComponent } from 'src/app/shared/dialogBoxes/create-new-password-dialog/create-new-password-dialog.component';
export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};

import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // showMsg: boolean = false
  genders: any;
  accountdata: any = []
  detail: any
  show: boolean = true;
  hideUpdatedSection = true
  mains: any = []
  profileForm!: FormGroup;
  subtitle: any;
  selected: string = ""
  checked = false
  profileFormTwo!: FormGroup
  edit_gender: any;
  gender_value: any;
  first_name: any;
  phoneCode: any
  data: any;
  last_name: any;
  showMobileTick = false
  regionals: any;
  showMobile = false
  @ViewChild('profileForm') profileFormDir!: NgForm;
  sms_var: any;
  mail_var: any;
  push_var: any;
  watsapp_var: any;
  numb = 0
  showLoginType = false
  state: string | undefined;
  countryName: string | undefined;
  idForgot: any;
  tick = false
  // mobileTick:any
  mobileCase = false
  emailCasePhone = false
  emailTick = false
  dismatchPass: string
    // mailUpdate: any;
    | undefined
  // mailUpdate: any;
  mobileVerify = false
  hideInPhone: any
  alertMsg: any;
  visitorId: any;
  hcl = false
  GenderChecked: any
  MaleChecked: any
  FemaleChecked: any
  maxDob: any = Date;
  NeutralChecked: any
  hideEdit = true
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  @ViewChild('profileConfirmationModal')
  signoutConfirmationModal!: TemplateRef<any>;
  private signoutConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  baseSignin: any;
  profileData: any = []
  arrays: any = []
  countryList: any = []
  stateList: any = []
  cityList: any = []
  regional: any;
  constructor(private _fb: FormBuilder, public es: ExchangeDataService, public dialog: MatDialog, private fcs: FunctionCallingService, private _DS: DataService, private ds: DataService, private DEC_SER: DecryptService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private ed: ExchangeDataService, public router: Router, private fc: FunctionCallingService, private _auth: AuthService, private analyticsService: AnalyticsService) {
    this.fcs.mobileUpdateValue.subscribe(value => {
      this.accountdata.contact_no = value
      this.showMobileTick = true
    });
    this.es.mobileLinkCode.subscribe(er => {
      if (er != '') {
        this.accountdata.country_code = er
      }
    });
  }
  Email = false
  Push = false
  SMS: any
  Whatsapp = false;
  errorMsg: any;
  errorAlertData: any;
  @Output() isLoggedInforLayout = new EventEmitter<boolean>();
  @Input() updationMail: any;
  @Input() isTrue: any;
  phoneVerified = false
  baseJson: any = []
  ngOnInit(): void {
    // localStorage.setItem('googleLang', '0')
    // const script = document.createElement('script');
    // script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&key=AIzaSyC2Yaupd3NMeg-UoC9fX4z6hHFRIZa9LKs';
    // script.async = true;
    // document.head.appendChild(script);
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    console.log(this.maxDob);
    this.getJsonPopup()
    var profile = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
    this.accountdata = profile

    this.profileForm = this._fb.group({
      name: ['', [Validators.required]],
      gender: [''],
      phone: [''],
      age: [''],
      email: ['']
    }
    );
    setTimeout(() => {
      this.addLanguageChangeListener();
    }, 1000);
    // this.profileForm.controls['name'].disable()
    console.log(this.accountdata)
    this.getConfigData()
    this.getConfig()
    this.getGeographicalState()


    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);



  }
  getJsonPopup() {
    const popup: any = localStorage.getItem('popUpForm');
    const dataPopup: any = JSON.parse(popup);
    this.baseJson = dataPopup
    console.log(dataPopup)
    // this._DS.popupJson().subscribe((res: any) => {
    //   this.baseJson = res.PopupList[0]
    //   console.log()
    // })
  }
  getConfigData() {
    var res: any = localStorage.getItem('faqData')
    res = JSON.parse(res)
    console.log(res)
    // this._DS.faqData().subscribe((res: any) => {
    // console.log(res);
    console.log(res.App[0].account[0])
    this.baseSignin = res.App[0].account[0]
    this.profileData = res.App[0].account[0].notification.options
    this.arrays.push(this.accountdata.check_sms, this.accountdata.check_email, this.accountdata.check_push, this.accountdata.check_whatsapp)
    console.log(this.arrays);

    for (let i in this.arrays) {
      if (this.arrays[i] == 0) {
        this.arrays[i] = false
      } else {
        this.arrays[i] = true
      }
    }
    console.log(this.arrays);
    for (let i in this.profileData) {
      this.profileData[i].checked = this.arrays[i]
    }
    console.log(this.profileData, 'fff');
    // })
  }


  addLanguageChangeListener(): void {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.addEventListener('change', () => {
        const selectedLanguage = (selectElement as HTMLSelectElement).value;
        console.log(selectedLanguage);
        var u_id: any = localStorage.getItem("taploginInfo");
        var ids = JSON.parse(u_id);
        this.ds.getSubtitle(ids.id).subscribe((res: any) => {
          this.DEC_SER.getDecryptedData(res?.result);
          let decryptData = JSON.parse(this.DEC_SER.decryptData);
          const sendTosett = decryptData;
          if (sendTosett.payload != null && sendTosett.payload.subtitle != null) {
            this.subtitle = sendTosett.payload.subtitle;
          } else {
            this.subtitle = "None";
          }
          if (sendTosett.payload != null && sendTosett.payload.language_key != null) {
            this.regionals = sendTosett.payload.language_key;
          } else {
            this.regionals = "None";
          }
          const payload: any = {
            quality_key: 0,
            notification_key: 0,
            download_key: 0,
            autoplay_key: 0,
            language_key: this.regionals,
            subtitle: this.subtitle,
            app_language: selectedLanguage
          };
          var uid: any = localStorage.getItem("taploginInfo");
          var Uid = JSON.parse(uid);
          const formData = new FormData();
          formData.append("uid", Uid.id);
          formData.append("payload", JSON.stringify(payload));

          this.ds.subtitleSet(formData).subscribe((res: any) => {

          });
        });

      });
    }
  }






  clearEvent(e: any) {
    if (e.target.value == '') {
      // console.log(e.target.value)
      this.alertMsg = false
    }
  }

  input_value(value: any) {
    console.log(value);

  }

  get f() {
    return this.profileForm.controls;
  }
  pwdMatchValidator(frm: FormGroup) {
    return this.profileForm.value.password === this.profileForm.value.confirm_password
      ? null : { 'mismatch': true };
  }
  updateProfile() {

    this.update_value()
  }


  editProfile() {
    // this.showMsg = true
    this.checked = true
    this.profileForm.patchValue({
      name: this.accountdata.full_name,
      email: this.accountdata.email,
      phone: this.accountdata.contact_no,
      gender: this.accountdata.gender,
      country: this.accountdata.country,
      age: this.accountdata.age_group
    });
  }
  gender(data: any) {
    if (data == 'Male') {
      this.genders = "Male"
    } else if (data == 'Female') {
      this.genders = "Female"
    } else if (data == 'Neutral') {
      this.genders = "Neutral"
    }
    console.log(data);
    this.edit_gender = data;
  }
  close_edit() {
    this.hideEdit = true
    this.show = true;

    this.hideUpdatedSection = true
  }
  update_value() {
    var decrypt_data: any;
    var userId: any = localStorage.getItem('taploginInfo')
    var u_id = JSON.parse(userId)
    if (this.profileForm.valid) {

      this.checked = false
      const formData: any = new FormData();
      formData.append('id', u_id.id);
      formData.append('full_name', this.profileForm.value.name);
      formData.append('gender', this.profileForm.value.gender);
      formData.append('age_range', this.profileForm.value.age);
      formData.append('state', this.profileForm.value.state);
      formData.append('country', this.profileForm.value.country);
      formData.append('city', this.profileForm.value.city);
      formData.append('contact_no', this.profileForm.value.phone);
      formData.append('login_type', u_id.login_type);
      formData.append('sudarshan_kriya', 'no');
      formData.append('sahaj_samadhi', 'yes');

      var loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
      loginId.full_name = this.profileForm.value.name
      loginId.last_name = ''
      loginId.gender = this.profileForm.value.gender
      loginId.country = this.profileForm.value.country
      loginId.city = this.profileForm.value.city
      loginId.state = this.profileForm.value.state
      loginId.age_group = this.profileForm.value.age
      localStorage.setItem('taploginInfo', JSON.stringify(loginId))
      console.log(this.profileForm);

      this.alertMsg = false
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          decrypt_data = this.DEC_SER.getDecryptedData(res.result);
          let profile_info = JSON.parse(this.DEC_SER.decryptData);
          console.log("editted data", profile_info);
          localStorage.setItem("emailSavedCaseMobile", this.profileForm.value.email)
          this.updationMail = this.profileForm.value.email
          this.emailCasePhone = true
          this.accountdata = profile_info;
          localStorage.setItem("profileUpdates", JSON.stringify(profile_info))
          console.log(this.accountdata);
          this.show = true;
          // this.leadSquare()
        }
      })
    }
    localStorage.setItem('googleLang', '0')
    // const script = document.createElement('script');
    // script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&key=AIzaSyC2Yaupd3NMeg-UoC9fX4z6hHFRIZa9LKs';
    // script.async = true;
    // document.head.appendChild(script);


  }

  leadSquare() {
    let dateObj = new Date();
    let month = ('0' + (dateObj.getUTCMonth() + 1)).slice(-2); // Add leading zero if needed
    let day = ('0' + dateObj.getUTCDate()).slice(-2); // Add leading zero if needed
    let year = dateObj.getUTCFullYear();

    const newdate = year + "-" + month + "-" + day;
    const date = new Date();

    date.setHours(date.getHours() - 5);
    date.setMinutes(date.getMinutes() - 30);

    const time = date.toLocaleTimeString([], {
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const taplogininfo: any = localStorage.getItem("taploginInfo");
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const requestData = [
      {
        'Attribute': 'EmailAddress',
        'Value': USER_ACCOUNT.email
      },
      {
        'Attribute': 'mx_App_Last_Login_Date_Time',
        'Value': newdate + ' ' + time
      },
      {
        'Attribute': 'mx_App_User_Source',
        'Value': 'Web'
      },
      {
        'Attribute': 'FirstName',
        'Value': this.profileForm.value.name
      },
      {
        'Attribute': 'Phone',
        'Value': this.profileForm.value.phone
      },
      {
        'Attribute': 'mx_Gender',
        'Value': this.profileForm.value.gender
      },
      {
        'Attribute': 'mx_Age',
        'Value': this.profileForm.value.age
      },



    ];
    this.ds.leadSquare(requestData).subscribe((res: any) => {

    })
  }

  pop(main: any, e: any) {
    if (main == 'SMS') {
      if (e.target.checked == true) {
        this.sms_var = 1
      } else if (e.target.checked == false) {
        this.sms_var = 0
      }
      var userId: any = localStorage.getItem('taploginInfo')
      var u_id = JSON.parse(userId)

      const formData: any = new FormData();
      formData.append('id', u_id.id);
      formData.append('check_sms', this.sms_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);
          console.log(cc.check_sms);
          // if (cc.check_sms == "1") {
          //   localStorage.setItem('check_sms', '1')
          // }
          // else if (cc.check_sms == "0") {
          //   localStorage.setItem('check_sms', '0')
          // }
          var sms = this.loginId
          sms.check_sms = cc.check_sms
          localStorage.setItem('taploginInfo', JSON.stringify(sms))

        }
      })
    }
    else if (main == 'Email') {
      if (e.target.checked == true) {
        this.mail_var = 1
      } else if (e.target.checked == false) {
        this.mail_var = 0
      }
      var userId: any = localStorage.getItem('taploginInfo')
      var u_id = JSON.parse(userId)

      const formData: any = new FormData();
      formData.append('id', u_id.id);
      formData.append('check_email', this.mail_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);
          console.log(cc.check_email);
          // if (cc.check_email == "1") {
          //   localStorage.setItem('check_email', '1')
          // }
          // else if (cc.check_email == "0") {
          //   localStorage.setItem('check_email', '0')
          // }
          var email = this.loginId
          email.check_email = cc.check_email
          localStorage.setItem('taploginInfo', JSON.stringify(email))
        }
      })
    }
    else if (main == 'Push') {
      if (e.target.checked == true) {
        this.push_var = 1
      } else if (e.target.checked == false) {
        this.push_var = 0
      }
      var userId: any = localStorage.getItem('taploginInfo')
      var u_id = JSON.parse(userId)

      const formData: any = new FormData();
      formData.append('id', u_id.id);
      formData.append('check_push', this.push_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);
          console.log(cc.check_push);
          // if (cc.check_push == "1") {
          //   localStorage.setItem('check_push', '1')
          // }
          // else if (cc.check_push == "0") {
          //   localStorage.setItem('check_push', '0')
          // }
          var push = this.loginId
          push.check_push = cc.check_push
          localStorage.setItem('taploginInfo', JSON.stringify(push))
        }
      })
    }
    else if (main == 'Whatsapp') {
      if (e.target.checked == true) {
        this.watsapp_var = 1
      } else if (e.target.checked == false) {
        this.watsapp_var = 0
      }
      var userId: any = localStorage.getItem('taploginInfo')
      var u_id = JSON.parse(userId)

      const formData: any = new FormData();
      formData.append('id', u_id.id);
      formData.append('check_whatsapp', this.watsapp_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);
          console.log(cc.check_whatsapp);
          // if (cc.check_whatsapp == "1") {
          //   localStorage.setItem('check_whatsapp', '1')
          // }
          // else if (cc.check_whatsapp == "0") {
          //   localStorage.setItem('check_whatsapp', '0')
          // }
          var watsapp = this.loginId
          watsapp.check_whatsapp = cc.check_whatsapp
          localStorage.setItem('taploginInfo', JSON.stringify(watsapp))
        }
      })
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
  logout() {
    this.fc.logoutProfile.next(true)
  }
  getGeographicalState() {

    const ipDetail: any = localStorage.getItem("ipSaveData")
    const detail = JSON.parse(ipDetail)
    this.detail = detail
    if (this.accountdata.state != '') {

      this.state = this.accountdata.state
      this.countryName = detail.countryName
    }
    else {

      if (detail.countryName == "India") {

        if (detail.regionName == "National Capital Territory of Delhi") {
          detail.regionName = "Delhi"
        }
        console.log(detail);

        this.state = detail.regionName
        this.countryName = detail.countryName


      }
      else {

        this.state = detail.countryName
      }
    }
    if (detail.phoneCode == 91) {
      this.phoneCode = 91
    } else {
      this.phoneCode = detail.phoneCode
    }

  }

  otpForgot() {


    if (this.numb == 0) {
      this.numb = 1
      const formData: any = new FormData();
      let emalid: any = localStorage.getItem('taploginInfo')
      let id = JSON.parse(emalid)
      if (id.email == "") {
        formData.append('email', this.updationMail);
      }
      else {
        formData.append('email', this.accountdata.email);
      }
      formData.append('type', 'mail');
      formData.append('device', 'web');
      formData.append('type', "mail");
      this.ds.forgotOtp(formData).subscribe((res: any) => {
        console.log(res);
        if (res.code == 1) {

          this.idForgot = res.result
          console.log(this.idForgot);
          localStorage.setItem("otpForgotId", this.idForgot)
          const dialogRef = this.dialog.open(EnterOtpComponent, {
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { email: this.accountdata.email },
            disableClose: true
          });
          dialogRef.componentInstance.openTap.subscribe((da: any) => {
            this.numb = 0
          });
          const sub = dialogRef.componentInstance.tick.subscribe((e: any) => {
            this.emailTick = e
          });
        }
      })
    }

  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  subtitleSet(selecte: any) {
    this.selected = selecte;
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);

    const eventParams = {
      language_name: selecte,
    };
    this.analyticsService.logEvent('content_language_set', eventParams);
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      if (sendTosett.payload != null && sendTosett.payload.subtitle != null) {
        this.subtitle = sendTosett.payload.subtitle;
      } else {
        this.subtitle = "None";
      }
      const payload: any = {
        quality_key: 0,
        notification_key: 0,
        download_key: 0,
        autoplay_key: 0,
        language_key: selecte,
        subtitle: this.subtitle,

        // app_language:'english',
      };
      var uid: any = localStorage.getItem("taploginInfo");
      var Uid = JSON.parse(uid);
      const formData = new FormData();
      formData.append("uid", Uid.id);
      formData.append("payload", JSON.stringify(payload));
      formData.append("device", 'web');

      this.ds.subtitleSet(formData).subscribe((res: any) => {
        if (res.code == 1) {
          if (payload.language_key == "None") {
            localStorage.removeItem("regional");
          } else {
            localStorage.setItem("regional", payload.language_key);
          }
        }
      });
    });
  }
  linkMobile() {
    const dialogRef = this.dialog.open(MobileLinkComponent, {
      panelClass: 'deleteSuccessfull',
      width: "390px",
      data: { email: this.accountdata.email },
    });
  }
  linkEmail() {
    const dialogRef = this.dialog.open(EmailLinkComponent, {
      panelClass: 'deleteSuccessfull',
      width: "390px",
      data: { email: this.accountdata.email },
    });
  }


  // modal 
  openSignoutConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';
    dialogConfig.panelClass = 'signoutConfirmation';
    dialogConfig.backdropClass = 'popupBackdropClass';
    dialogConfig.width = '390px'
    this.signoutConfirmationDialogRef = this.dialog.open(this.signoutConfirmationModal, dialogConfig);
    this.router.events
      .subscribe(() => {
        this.signoutConfirmationDialogRef.close();
      });

  }

  signoutConfirmationclose() {
    this.signoutConfirmationDialogRef.close();

  }
  getConfig() {
    this.ds.popupJson().subscribe((res: any) => {
      this.data = res.PopupList[0].language.languages
      this.baseJson = res.PopupList[0]
      for (let i in this.data) {
        if (this.data[i].name == "None") {
          this.data[i].is_allow = 1;
          this.data[i].page_title = "None";

        }
        if (this.data[i].is_allow == 1) {
          this.mains.push(this.data[i])
          console.log(this.mains);
        }
      }
    })
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;
      console.log(sendTosett);

      if (sendTosett.payload != null && sendTosett.payload.language_key != null) {
        this.selected = sendTosett.payload.language_key;
      }
    });
  }
  regionalOpen() {

    const dialogRef = this.dialog.open(RegionalComponent, {
      panelClass: 'contactfooter',
      width: "390px",
      // data: { title: this.sendTosettingSubtitle }
    });
    const sub = dialogRef.componentInstance.regionalSet.subscribe((title: any) => {
      this.regional = title
    });
  }
  changePassword() {
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);
    console.log(ids.id)
    const dialogRef = this.dialog.open(CreateNewPasswordDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'logindialog',
      width: "450px",
      disableClose: true,
      // height:"524px",
      data: { data: ids.id, name: 'changePassword' },
    });
  }

}

