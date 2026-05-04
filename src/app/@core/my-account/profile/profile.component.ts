import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { DeviceDetectorService } from "ngx-device-detector";
import { AuthService } from "src/app/services/auth.service";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { LoginModalDialogComponent } from "src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component";
import { DecryptService } from "src/app/services/decrypt.service";
import Swal from "sweetalert2";
import { SwalMsgService } from "src/app/services/swal-msg.service";
import { environment } from "src/environments/environment";
//import * as amplitude from '@amplitude/analytics-browser';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DataService } from "src/app/services/data.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import { Router } from "@angular/router";
import { ChechPinParentalComponent } from "src/app/shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component";
import { EnterOtpComponent } from "src/app/shared/enter-otp/enter-otp.component";
import { FunctionCallingService } from "src/app/services/function-calling.service";
import { UserExistComponent } from "src/app/shared/dialogBoxes/user-exist/user-exist.component";
import { EnterOtpMobileComponent } from "src/app/shared/dialogBoxes/enter-otp-mobile/enter-otp-mobile.component";
import { MobileLinkComponent } from "src/app/shared/dialogBoxes/mobile-link/mobile-link.component";
import { EmailLinkComponent } from "src/app/shared/dialogBoxes/email-link/email-link.component";
import { first } from "rxjs";
import { Location } from "@angular/common";

import { CreateNewPasswordDialogComponent } from "src/app/shared/dialogBoxes/create-new-password-dialog/create-new-password-dialog.component";
export const passwordMatchingValidatior: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get("password");
  const confirmPassword = control.get("confirmPassword");

  return password?.value === confirmPassword?.value
    ? null
    : { notmatched: true };
};
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  genders: any;
  accountdata: any;
  show: boolean = true;
  hideUpdatedSection = true;
  profileForm!: FormGroup;
  profileFormTwo!: FormGroup;
  nameLength: number = 0;
  maxLength: number = 50;
  edit_gender: any;
  gender_value: any;
  first_name: any;
  last_name: any;
  showMobileTick = false;
  showMobile = false;
  @ViewChild("profileForm") profileFormDir!: NgForm;
  checked = false;
  sms_var: any;
  mail_var: any;
  push_var: any;
  watsapp_var: any;
  numb = 0;
  showLoginType = false;
  state: string | undefined;
  countryName: string | undefined;
  idForgot: any;
  tick = false;
  // mobileTick:any
  mobileCase = false;
  emailCasePhone = false;
  emailTick = false;
  dismatchPass:
    | string
    // mailUpdate: any;
    | undefined;
  // mailUpdate: any;
  mobileVerify = false;
  hideInPhone: any;
  alertMsg: any;
  hcl = false;
  GenderChecked: any;
  MaleChecked: any;
  FemaleChecked: any;
  maxDob: any = Date;
  NeutralChecked: any;
  hideEdit = true;
  loginId = JSON.parse(localStorage.getItem("taploginInfo") || "{}");
  @ViewChild("signoutConfirmationModal")
  signoutConfirmationModal!: TemplateRef<any>;
  private signoutConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  baseSignin: any;
  profileData: any = [];
  arrays: any = [];
  otpSecret: any;
  hideOtherCountry = true;
  mobilePattern1: any;
  ROW_case: boolean = false;
  IND_case: boolean = false;
  country_code: any;
  country_name: any;
  yourForm!: FormGroup;
  genderss = ['Male', 'Female', 'Others'];
  selectedGender: string = '';
  dropdownOpen = false;

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    public es: ExchangeDataService,
    public dialog: MatDialog,
    private fcs: FunctionCallingService,
    private _DS: DataService,
    private ds: DataService,
    private DEC_SER: DecryptService,
    private deviceService: DeviceDetectorService,
    private _FPS: FingerPrintService,
    private ed: ExchangeDataService,
    public router: Router,
    private fc: FunctionCallingService,
    private _auth: AuthService,
    private _SWAL: SwalMsgService
  ) {
    this.fcs.mobileUpdateValue.subscribe((value) => {
      this.accountdata.contact_no = value;
      this.showMobileTick = true;
    });
    this.es.mobileLinkCode.subscribe((er) => {
      if (er != "") {
        this.accountdata.country_code = er;

        // var contact_num = this.loginId
        // contact_num.country_code = er
        // localStorage.setItem('taploginInfo', JSON.stringify(contact_num))
      }
    });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    // this.es.mobileLinkCode.subscribe(value => {
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

    // });
    const ipDetail: any = localStorage.getItem("ipSaveData");
    const detail = JSON.parse(ipDetail);

    if (this.loginId.state == "") {
      this.hideOtherCountry = false;
    }

    this.yourForm = this._fb.group({
      gender: ['']
    });

    
  }
  //  itemChecked = false
  // mailChecked = false
  // pushChecked = false
  // watsappChecked = false
  Email = false;
  Push = false;
  SMS: any;
  Whatsapp = false;
  errorMsg: any;
  errorAlertData: any;
  @Output() isLoggedInforLayout = new EventEmitter<boolean>();
  //incase of mobile :-
  @Input() updationMail: any;
  @Input() isTrue: any;
  // @Input() hideMobileInput: any;
  phoneVerified = false;
  baseJson: any = [];

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectGender(gender: string) {
    this.selectedGender = gender;
    this.yourForm.get('gender')?.setValue(gender);
    this.dropdownOpen = false;
  }
  ngOnInit(): void {
 
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);
    const today = new Date();
    this.maxDob = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    this.getJsonPopup();
    this.getRowCountry();
    this.getConfigData1();

    var ottLoged: any = localStorage.getItem("ott_isLoggedIn");
    var emalid: any = localStorage.getItem("taploginInfo");
    var id = JSON.parse(emalid);

    if (id.login_type == "phone") {
      this.mobileCase = true;
      this.hideInPhone = false;
      this.showMobileTick = true;
      if (ottLoged == "1") {
        this.phoneVerified = true;
      }
      if (this.isTrue == true) {
        this.emailCasePhone = true;
        //  this.hideMobileInput=true
      }
    } else if (id.login_type == "email") {
      this.hideInPhone = true;
    } else if (id.login_type == "social") {
      this.hideInPhone = true;
    }
    if (id.info) {
      this.accountdata = id.info;
    } else this.accountdata = id;
    this.profileForm = this._fb.group(
      {
        // name: [''],
        // password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        // confirm_password: ['', [Validators.required]],
        // email: [''],
        // gender: [''],
        // date: [''],
        // phone: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
        // state: [''],
        // country: [''],

        name: ["", [Validators.required, Validators.maxLength(this.maxLength)]],
        gender: [""],
        phone: [""],
        email: [""],
      },
      this.pwdMatchValidator
    );
    this.profileForm.get("name")?.valueChanges.subscribe((value) => {
      this.nameLength = value ? value.length : 0;
    });
    this.SMS = true;

    if (this.accountdata.check_email == "1") {
      this.Email = true;
    }
    if (this.accountdata.check_push == "1") {
      this.Push = true;
    }
    if (this.accountdata.check_sms == "1") {
    }
    if (this.accountdata.check_whatsapp == "1") {
      this.Whatsapp = true;
    }

    this.getConfigData();
    // this.getGeographicalState()
    this.countryName = this.loginId.country;
    this.state = this.loginId.state;
    // this.otpVerify()
    let isEmailVerified = localStorage.getItem("emailVerified");
    let phoneVerified = localStorage.getItem("phoneVerified");
    if (isEmailVerified == "1" || id.is_mail_verify == "1") {
      this.emailTick = true;
    }
    if (this.loginId.is_phone_verify == "1") {
      this.showMobileTick = true;
    }
    var bb: any = localStorage.getItem("profileUpdates");
    var profile = JSON.parse(bb);
    // this.accountdata.first_name = profile.first_name
    // this.accountdata.gender = profile.gender
    // this.accountdata.contact_no = profile.contact_no
    // this.accountdata.dob = profile.dob

    var cc: any = localStorage.getItem("mobileVerifyProfile");

    if (cc == 1) {
      this.mobileVerify = true;
    }
  }
  getJsonPopup() {
    const popup: any = localStorage.getItem("popUpForm");
    const dataPopup: any = JSON.parse(popup);
    this.baseJson = dataPopup;

    // this._DS.popupJson().subscribe((res: any) => {
    //   this.baseJson = res.PopupList[0]

    // })
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

  getConfigData() {
    this._DS.faqData().subscribe((res: any) => {
      this.baseSignin = res.App[0].account[0];
      this.profileData = res.App[0].account[0].notification.options;
      this.arrays.push(
        this.accountdata.check_sms,
        this.accountdata.check_email,
        this.accountdata.check_push,
        this.accountdata.check_whatsapp
      );

      for (let i in this.arrays) {
        if (this.arrays[i] == 0) {
          this.arrays[i] = false;
        } else {
          this.arrays[i] = true;
        }
      }

      for (let i in this.profileData) {
        this.profileData[i].checked = this.arrays[i];
      }
    });
  }
  clearEvent(e: any) {
    if (e.target.value == "") {
      this.alertMsg = false;
    }
  }

  input_value(value: any) {}
  onSubmit() {}
  get f() {
    return this.profileForm.controls;
  }
  pwdMatchValidator(frm: FormGroup) {
    return this.profileForm.value.password ===
      this.profileForm.value.confirm_password
      ? null
      : { mismatch: true };
  }
  editProfile() {
    // this.hideEdit = false

    // this.hideUpdatedSection=false
    // this.loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
    // if (this.loginId.gender == 'Male') {
    //   this.MaleChecked = true
    //   this.FemaleChecked = false
    //   this.NeutralChecked = false
    // } else if (this.loginId.gender == 'Female') {
    //   this.MaleChecked = false
    //   this.FemaleChecked = true
    //   this.NeutralChecked = false

    // } else if (this.loginId.gender == 'Neutral') {
    //   this.MaleChecked = false
    //   this.FemaleChecked = false
    //   this.NeutralChecked = true
    // }
    // this.show = false;
    // this.profileForm.patchValue({
    //   name: this.accountdata.first_name,
    //   email: this.accountdata.email,
    //   phone: this.accountdata.contact_no,
    //   state: this.accountdata.state,
    //   gender: this.accountdata.gender
    // });

    // this.showMsg = true
    this.checked = true;
    this.profileForm.patchValue({
      name: this.accountdata.first_name,
      email: this.accountdata.email,
      phone: this.accountdata.contact_no,
      gender: this.accountdata.gender,
      country: this.accountdata.country,
      date: this.accountdata.dob,
    });
  }
  gender(data: any) {
    if (data == "Male") {
      this.genders = "Male";
    } else if (data == "Female") {
      this.genders = "Female";
    } else if (data == "Neutral") {
      this.genders = "Neutral";
    }

    this.edit_gender = data;
  }

  getRowCountry() {
    let ip: any = localStorage.getItem("ipSaveData") || {};
    const row_country = JSON.parse(ip);
    this.country_code = row_country.countryCode;

    this.country_name = row_country.countryName;

    // if(this.country_code != 'IN' && this.country_name != 'India'){
    //   this.ROW_case == true
    // }else{
    //   this.IND_case == false
    // }
  }

  close_edit() {
    this.hideEdit = true;
    this.show = true;

    this.hideUpdatedSection = true;
  }
  // update_value() {
  //   this.hideEdit = true

  //   var name = this.profileForm.value.name;
  //   var split = name.split(' ',)

  //   if (split[0] != null) {
  //     this.first_name = split[0];
  //   } else {
  //     this.first_name = ''
  //   }
  //   if (split[1] != null) {
  //     this.last_name = split[1];
  //   } else {
  //     this.last_name = ''
  //   }
  //   var decrypt_data: any;
  //   if (this.edit_gender != null) {
  //     this.gender_value = this.edit_gender;
  //   }
  //   else {
  //     this.gender_value = '';
  //   }
  //   var userId: any = localStorage.getItem('taploginInfo')
  //   var u_id = JSON.parse(userId)
  //   const formData: any = new FormData();
  //   formData.append('id', u_id.id);
  //   formData.append('first_name', this.profileForm.value.name);
  //   formData.append('last_name', '');
  //   formData.append('email', this.profileForm.value.email);
  //   formData.append('contact_no', this.profileForm.value.phone);
  //   formData.append('state', this.profileForm.value.state);
  //   formData.append('country', this.profileForm.value.country);
  //   formData.append('password', this.profileForm.value.password);
  //   formData.append('gender', this.profileForm.value.gender);
  //   formData.append('dob', this.profileForm.value.date);
  //   formData.append('login_type', u_id.login_type);

  //   var loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  //   loginId.first_name = this.profileForm.value.name
  //   loginId.last_name = ''
  //   loginId.gender = this.profileForm.value.country
  //   localStorage.setItem('taploginInfo', JSON.stringify(loginId))
  //   // formData.append('first_name', );
  //   // // formData.append('last_name', 'sharma');
  //   // formData.append('email',  this.profileForm.value.email);
  //   // formData.append('contact_no', 8077411804);
  //   // formData.append('state', 'haryna');
  //   // formData.append('country', 'indiay');
  //   // formData.append('gender', 'male');
  //   // if (this.profileForm.value.phone != '') {
  //   //   // this.mobileVerify = true

  //   //   const formdata2 = new FormData()
  //   //   formdata2.append('phone', this.profileForm.value.phone);
  //   //   this._auth.OttcheckUserExisted(formdata2).subscribe((resp: any) => {
  //   //     if (resp.code == 1) {
  //   //       const dialogRef = this.dialog.open(UserExistComponent, {
  //   //         panelClass: 'adultAgePopup',
  //   //         width: "390px",

  //   //       });
  //   //     }
  //   //     else{
  //   //     this.mobileVerify=true
  //   //     localStorage.setItem("mobileVerifyProfile",'1')
  //   //     }
  //   //   })

  //   // }

  //   if (this.profileForm.value.password == this.profileForm.value.confirm_password) {
  //     this.alertMsg = false
  //     this.ds.profile_edit(formData).subscribe((res: any) => {
  //       if (res.code == 1) {

  //         decrypt_data = this.DEC_SER.getDecryptedData(res.result);
  //         let profile_info = JSON.parse(this.DEC_SER.decryptData);

  //         localStorage.setItem("emailSavedCaseMobile", this.profileForm.value.email)
  //         // var hey = this.loginId
  //         // hey.contact_no = this.profileForm.value.phone
  //         // localStorage.setItem('taploginInfo', JSON.stringify(hey))

  //         this.updationMail = this.profileForm.value.email
  //         this.emailCasePhone = true
  //         //  localStorage.setItem('taploginInfo', JSON.stringify(profile_info));
  //         //  localStorage.setItem('taploginInfo1', JSON.stringify(profile_info));
  //         this.accountdata = profile_info;
  //         localStorage.setItem("profileUpdates", JSON.stringify(profile_info))

  //         this.show = true;
  //         this.hideUpdatedSection = true
  //       } else {
  //         const dialogRef = this.dialog.open(UserExistComponent, {
  //           panelClass: 'adultAgePopup',
  //           width: "390px",
  //           data: { msg: res.error },
  //         });
  //       }
  //     })
  //   }
  //   else {
  //     this.alertMsg = true
  //     // this.dismatchPass="Please Enter Correct Pin"
  //   }

  // }

  update_value() {
    var decrypt_data: any;
    var userId: any = localStorage.getItem("taploginInfo");
    var u_id = JSON.parse(userId);
    if (this.profileForm.valid) {
      this.checked = false;
      const formData: any = new FormData();
      formData.append("id", u_id.id);
      formData.append("first_name", this.profileForm.value.name);
      formData.append("last_name", "");
      formData.append("email", this.profileForm.value.email);
      formData.append("gender", this.yourForm.value.gender);
      formData.append("dob", this.profileForm.value.date);
      formData.append("state", this.profileForm.value.state);
      formData.append("country", this.profileForm.value.country);
      formData.append("city", this.profileForm.value.city);
      formData.append("contact_no", this.profileForm.value.phone);
      formData.append("country_code", "IN");
      formData.append("login_type", u_id.login_type);
      var loginId = JSON.parse(localStorage.getItem("taploginInfo") || "{}");
      loginId.first_name = this.profileForm.value.name;
      loginId.last_name = "";
      loginId.gender = this.yourForm.value.gender;
      loginId.country = this.profileForm.value.country;
      loginId.city = this.profileForm.value.city;
      loginId.state = this.profileForm.value.state;
      loginId.dob = this.profileForm.value.dob;
      loginId.email = this.profileForm.value.email;
      localStorage.setItem("taploginInfo", JSON.stringify(loginId));
      this.alertMsg = false;
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          decrypt_data = this.DEC_SER.getDecryptedData(res.result);
          console.log(JSON.parse(this.DEC_SER.decryptData))
          let profile_info = JSON.parse(this.DEC_SER.decryptData);

          localStorage.setItem(
            "emailSavedCaseMobile",
            this.profileForm.value.email
          );
          this.updationMail = this.profileForm.value.email;
          this.emailCasePhone = true;
          this.accountdata = profile_info;
          console.log(profile_info,"preditProfile")
          localStorage.setItem("profileUpdates", JSON.stringify(profile_info));

          this._SWAL.getSwalmsg("Profile Updated Sucessfully!!", "success");
          this.show = true;
        }
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 0);
      });
    }
  }

  // sms(e: any) {
  //   if (e.target.checked == true) {
  //     this.sms_var = 1
  //   } else if (e.target.checked == false) {
  //     this.sms_var = 0
  //   }
  //   var userId: any = localStorage.getItem('taploginInfo')
  //   var u_id = JSON.parse(userId)

  //   const formData: any = new FormData();
  //   formData.append('id', u_id.id);
  //   formData.append('check_sms', this.sms_var);
  //   this.ds.profile_edit(formData).subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.DEC_SER.getDecryptedData(res.result);
  //       let cc = JSON.parse(this.DEC_SER.decryptData);

  //       // if (cc.check_sms == "1") {
  //       //   localStorage.setItem('check_sms', '1')
  //       // }
  //       // else if (cc.check_sms == "0") {
  //       //   localStorage.setItem('check_sms', '0')
  //       // }
  //       var sms = this.loginId
  //       sms.check_sms = cc.check_sms
  //       localStorage.setItem('taploginInfo', JSON.stringify(sms))

  //     }
  //   })
  // }
  // mail(e: any) {
  //   if (e.target.checked == true) {
  //     this.mail_var = 1
  //   } else if (e.target.checked == false) {
  //     this.mail_var = 0
  //   }
  //   var userId: any = localStorage.getItem('taploginInfo')
  //   var u_id = JSON.parse(userId)

  //   const formData: any = new FormData();
  //   formData.append('id', u_id.id);
  //   formData.append('check_email', this.mail_var);
  //   this.ds.profile_edit(formData).subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.DEC_SER.getDecryptedData(res.result);
  //       let cc = JSON.parse(this.DEC_SER.decryptData);

  //       // if (cc.check_email == "1") {
  //       //   localStorage.setItem('check_email', '1')
  //       // }
  //       // else if (cc.check_email == "0") {
  //       //   localStorage.setItem('check_email', '0')
  //       // }
  //       var email = this.loginId
  //       email.check_email = cc.check_email
  //       localStorage.setItem('taploginInfo', JSON.stringify(email))
  //     }
  //   })
  // }
  // push(e: any) {
  //   if (e.target.checked == true) {
  //     this.push_var = 1
  //   } else if (e.target.checked == false) {
  //     this.push_var = 0
  //   }
  //   var userId: any = localStorage.getItem('taploginInfo')
  //   var u_id = JSON.parse(userId)

  //   const formData: any = new FormData();
  //   formData.append('id', u_id.id);
  //   formData.append('check_push', this.push_var);
  //   this.ds.profile_edit(formData).subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.DEC_SER.getDecryptedData(res.result);
  //       let cc = JSON.parse(this.DEC_SER.decryptData);

  //       // if (cc.check_push == "1") {
  //       //   localStorage.setItem('check_push', '1')
  //       // }
  //       // else if (cc.check_push == "0") {
  //       //   localStorage.setItem('check_push', '0')
  //       // }
  //       var push = this.loginId
  //       push.check_push = cc.check_push
  //       localStorage.setItem('taploginInfo', JSON.stringify(push))
  //     }
  //   })
  // }
  // watsapp(e: any) {
  //   if (e.target.checked == true) {
  //     this.watsapp_var = 1
  //   } else if (e.target.checked == false) {
  //     this.watsapp_var = 0
  //   }
  //   var userId: any = localStorage.getItem('taploginInfo')
  //   var u_id = JSON.parse(userId)

  //   const formData: any = new FormData();
  //   formData.append('id', u_id.id);
  //   formData.append('check_whatsapp', this.watsapp_var);
  //   this.ds.profile_edit(formData).subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.DEC_SER.getDecryptedData(res.result);
  //       let cc = JSON.parse(this.DEC_SER.decryptData);

  //       // if (cc.check_whatsapp == "1") {
  //       //   localStorage.setItem('check_whatsapp', '1')
  //       // }
  //       // else if (cc.check_whatsapp == "0") {
  //       //   localStorage.setItem('check_whatsapp', '0')
  //       // }
  //       var watsapp = this.loginId
  //       watsapp.check_whatsapp = cc.check_whatsapp
  //       localStorage.setItem('taploginInfo', JSON.stringify(watsapp))
  //     }
  //   })
  // }
  pop(main: any, e: any) {
    if (main == "SMS") {
      if (e.target.checked == true) {
        this.sms_var = 1;
      } else if (e.target.checked == false) {
        this.sms_var = 0;
      }
      var userId: any = localStorage.getItem("taploginInfo");
      var u_id = JSON.parse(userId);

      const formData: any = new FormData();
      formData.append("id", u_id.id);
      formData.append("check_sms", this.sms_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);

          // if (cc.check_sms == "1") {
          //   localStorage.setItem('check_sms', '1')
          // }
          // else if (cc.check_sms == "0") {
          //   localStorage.setItem('check_sms', '0')
          // }
          var sms = this.loginId;
          sms.check_sms = cc.check_sms;
          localStorage.setItem("taploginInfo", JSON.stringify(sms));
        }
      });
    } else if (main == "Email") {
      if (e.target.checked == true) {
        this.mail_var = 1;
      } else if (e.target.checked == false) {
        this.mail_var = 0;
      }
      var userId: any = localStorage.getItem("taploginInfo");
      var u_id = JSON.parse(userId);

      const formData: any = new FormData();
      formData.append("id", u_id.id);
      formData.append("check_email", this.mail_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);

          // if (cc.check_email == "1") {
          //   localStorage.setItem('check_email', '1')
          // }
          // else if (cc.check_email == "0") {
          //   localStorage.setItem('check_email', '0')
          // }
          var email = this.loginId;
          email.check_email = cc.check_email;
          localStorage.setItem("taploginInfo", JSON.stringify(email));
        }
      });
    } else if (main == "Push") {
      if (e.target.checked == true) {
        this.push_var = 1;
      } else if (e.target.checked == false) {
        this.push_var = 0;
      }
      var userId: any = localStorage.getItem("taploginInfo");
      var u_id = JSON.parse(userId);

      const formData: any = new FormData();
      formData.append("id", u_id.id);
      formData.append("check_push", this.push_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);

          // if (cc.check_push == "1") {
          //   localStorage.setItem('check_push', '1')
          // }
          // else if (cc.check_push == "0") {
          //   localStorage.setItem('check_push', '0')
          // }
          var push = this.loginId;
          push.check_push = cc.check_push;
          localStorage.setItem("taploginInfo", JSON.stringify(push));
        }
      });
    } else if (main == "Whatsapp") {
      if (e.target.checked == true) {
        this.watsapp_var = 1;
      } else if (e.target.checked == false) {
        this.watsapp_var = 0;
      }
      var userId: any = localStorage.getItem("taploginInfo");
      var u_id = JSON.parse(userId);

      const formData: any = new FormData();
      formData.append("id", u_id.id);
      formData.append("check_whatsapp", this.watsapp_var);
      this.ds.profile_edit(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.DEC_SER.getDecryptedData(res.result);
          let cc = JSON.parse(this.DEC_SER.decryptData);

          // if (cc.check_whatsapp == "1") {
          //   localStorage.setItem('check_whatsapp', '1')
          // }
          // else if (cc.check_whatsapp == "0") {
          //   localStorage.setItem('check_whatsapp', '0')
          // }
          var watsapp = this.loginId;
          watsapp.check_whatsapp = cc.check_whatsapp;
          localStorage.setItem("taploginInfo", JSON.stringify(watsapp));
        }
      });
    }
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
  logout() {
    this.fc.logoutProfile.next(true);
  }

  userInfo: any;
  userDetails: any;

  getGeographicalState() {
    // const ipDetail: any = localStorage.getItem("ipSaveData")
    // const detail = JSON.parse(ipDetail)
    // if (this.accountdata.state != '') {
    //   this.state = this.accountdata.state
    //   this.countryName = detail.countryName
    // }
    // else {
    //   if (detail.countryName == "India") {
    //     if (detail.regionName == "National Capital Territory of Delhi") {
    //       detail.regionName = "Delhi"
    //     }
    //     this.state = detail.regionName
    //     this.countryName = detail.countryName
    //   }
    //   else {
    //     this.state = detail.regionName
    //      this.countryName = this.loginId.country
    //   }
    // }
  }

  otpForgot() {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    if (this.numb == 0) {
      console.log("0");
      this.numb = 1;
      const formData: any = new FormData();
      let emalid: any = localStorage.getItem("taploginInfo");
      // let user_id: any = localStorage.getItem('isUserId')
      let id = JSON.parse(emalid);
      if (id.email == "") {
        formData.append("value", this.updationMail);
      } else {
        console.log("aaaaccccccccccccccccaaaaaaaaaaaaaa");
        formData.append("value", this.accountdata.email);
        console.log(this.accountdata.email);
      }
      var user_id: any = localStorage.getItem("taploginInfo");
      formData.append("user_id", JSON.parse(user_id).id);
      formData.append("device", "web");
      formData.append("type", "mail");
      formData.append("payload", this.otpSecret);
      formData.append("mode", "vive");
      formData.append("mode_type", "verify");

      this.ds.forgotOtp(formData).subscribe((res: any) => {
        console.log("wwwwwwwwwwwwwwwww", res);
        if (res.code == 1) {
          console.log(res);
          this.idForgot = res.result;

          localStorage.setItem("otpForgotId", this.idForgot);
          const dialogRef = this.dialog.open(EnterOtpComponent, {
            panelClass: "deleteSuccessfull",
            width: "390px",
            data: { email: this.accountdata.email },
            disableClose: true,
          });
          dialogRef.componentInstance.openTap.subscribe((da: any) => {
            this.numb = 0;
          });
          const sub = dialogRef.componentInstance.tick.subscribe((e: any) => {
            this.emailTick = e;
          });
        }
        console.log("////////////////");
      });
    }
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  // otpForgotMobile() {
  //   var getPhoneNumber = this.accountdata.contact_no
  //   const formData = new FormData();

  //   formData.append('phone', this.accountdata.contact_no);
  //   formData.append('type', 'phone');
  //   formData.append('device', 'web');
  //   this.ds.forgotOtp(formData).subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.idForgot = res.result

  //       localStorage.setItem("otpForgotId", this.idForgot)
  //       const dialogRef = this.dialog.open(EnterOtpMobileComponent, {
  //         panelClass: 'deleteSuccessfull',
  //         width: "390px",
  //         data: { email: this.accountdata.email },
  //       });
  //       const sub = dialogRef.componentInstance.tick.subscribe((e: any) => {
  //         this.showMobileTick = e
  //         // this.showMobile=false
  //         // this.accountdata.contact_no.length=2
  //       });
  //     }
  //   })
  // }
  // otpVerify(){
  //   var emal: any = localStorage.getItem('taploginInfo')
  //   var id = JSON.parse(emal)
  //   const formData: any = new FormData();
  //   formData.append('user_id',id.id );
  //   formData.append('otp', this.idForgot);
  //   formData.append('type', 'web');
  //   this.ds.verifyOtp(formData).subscribe((res:any)=>{

  //   })
  // }
  linkMobile() {
    const dialogRef = this.dialog.open(MobileLinkComponent, {
      panelClass: "deleteSuccessfull",
      width: "390px",
      data: { email: this.accountdata.email },
    });
  }
  linkEmail() {
    // console.log("aaaaaaaaaaaaaaaaa");
    const dialogRef = this.dialog.open(EmailLinkComponent, {
      panelClass: "deleteSuccessfull",
      width: "390px",
      data: { email: this.accountdata.email },
    });
  }

  back() {
    this.checked = false;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }
  // modal
  openSignoutConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";
    dialogConfig.panelClass = "signoutConfirmation";
    dialogConfig.backdropClass = "popupBackdropClass";
    dialogConfig.width = "390px";
    this.signoutConfirmationDialogRef = this.dialog.open(
      this.signoutConfirmationModal,
      dialogConfig
    );
    this.router.events.subscribe(() => {
      this.signoutConfirmationDialogRef.close();
    });
  }
  signoutConfirmationclose() {
    this.signoutConfirmationDialogRef.close();
  }

  changePassword() {
    var u_id: any = localStorage.getItem("taploginInfo");
    var ids = JSON.parse(u_id);

    const dialogRef = this.dialog.open(CreateNewPasswordDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "logindialog",
      width: "450px",
      // height:"524px",
      data: { data: ids.id, name: "changePassword" },
    });
  }

  getConfigData1() {
    this.ds.popupJson().subscribe((res: any) => {
      localStorage.setItem("popupJson", JSON.stringify(res));
    });
    const popup: any = localStorage.getItem("faqData");
    const dataPopup: any = JSON.parse(popup);
    // this.accoutSection = dataPopup.App[0].account[0].main_section

    const popup1: any = localStorage.getItem("allJsonPopupData");
    const dataPopup1: any = JSON.parse(popup1);
    // this.basesignin1 = dataPopup1.PopupList[0]
    //   this.ds.faqData().subscribe((res: any) => {

    // this.accoutSection=res.App[0].account[0].main_section
    //   })
  }
}
