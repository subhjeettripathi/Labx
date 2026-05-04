import { Component, Inject, OnInit, QueryList, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecryptService } from "src/app/services/decrypt.service";
import Swal from 'sweetalert2';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { AcoountDeletionSuccesfullPopupComponent } from '../acoount-deletion-succesfull-popup/acoount-deletion-succesfull-popup.component';
import { ParentalCreatePinCheckComponent } from '../parental-create-pin-check/parental-create-pin-check.component';
import { ParentalOtpPhonePinGenerateComponent } from '../parental-otp-phone-pin-generate/parental-otp-phone-pin-generate.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { ParentalPinCreatedSuccesComponent } from '../parental-pin-created-succes/parental-pin-created-succes.component';
import { SocialParentalCreateComponent } from '../social-parental-create/social-parental-create.component';
declare var $: any
@Component({
  selector: 'app-parental-control',
  templateUrl: './parental-control.component.html',
  styleUrls: ['./parental-control.component.scss']
})
export class ParentalControlComponent implements OnInit {
  @ViewChildren('inputs')
  @Output() changeRestriction = new EventEmitter<any>()
  inputs!: QueryList<any>;
  parentalForm!: FormGroup;
  profileForm!: FormGroup;
  visitorId: any = localStorage.getItem('device_id')
  numOfDigits = 4;
  otp_pin: [] = [];
  otpPin: any;
  conf_Pin: any;
  final_pin: any;
  restriction: any;
  accountData: any;
  parentalData: any;
  ageGrp: any;
  otpValue: any;
  confirmValue: any;
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  otpInput1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  otpInputCurrent = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  showOtp1 = true;
  showOtp2 = true;
  msg: any;
  ageGroupForm: any = FormGroup
  currentPin = false
  updateBtn = false
  alreadySetMsg: any;
  heading = false
  user_id: any;
  validatePin: any;
  validCurrentPin = true
  notValidCurrentPin: any;
  VaidatePinMsg: any
  mandotoryRestrict = false
  titleRestriction: any;
  vaidationForm: any;
  isParentalSubmit: any;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  parentalId: any;
  private debounceTimer: any
  //  inputs:any;
  @Output() checked2 = new EventEmitter<any>()
  basesignin: any = [];
  errorAlertData: any;
  errorMsg: any
  constructor(public dialogRef: MatDialogRef<ParentalControlComponent>, private _auth: AuthService, private deviceService: DeviceDetectorService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private ds: DataService, private dep_ser: DecryptService, private eds: ExchangeDataService, private fcs: FunctionCallingService, private dialog: MatDialog, private fs: FunctionCallingService, private _FPS: FingerPrintService) {


  }
  ngOnInit(): void {
    this.getData();
    this.getConfigData()
    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id
    if (data.info) {
      this.accountData = data_read.info
    } else {
      this.accountData = data_read
    }

    var parental: any = localStorage.getItem('isParentalSet')
    if (data_read.is_parental == 2) {

      this.currentPin = true
      this.heading = true
    }
    else {
      if (data_read.is_parental == 1) {
        this.currentPin = true
        this.heading = true
        this.validCurrentPin = false
        if (data_read.is_parental == 0) {
          this.currentPin = false
          this.heading = false
        }

      }
    }
    this.profileForm = this._fb.group({
      gender: ['', Validators.required]
    });
    

    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    this.parentalId = USER_ACCOUNT.parental_id


    this.titleRestriction = USER_ACCOUNT.restriction_title
    if (USER_ACCOUNT.is_parental == 1) {
      this.profileForm.patchValue({
        gender: String(USER_ACCOUNT.restriction_level)
      });
    }

  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0]
    console.log(
      this.basesignin.create_parental.set_restrictions.text, "lllllllllllll"
    );
    this.errorAlertData = localStorage.getItem("errorMsg");
    this.errorMsg = JSON.parse(this.errorAlertData);
    console.log(this.errorMsg)
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

  config = {
    allowNumbersOnly: true,
    length: 4,
    autofocus: false,


    inputStyles: {
      'width': '45px',
      'color': 'white',
      'background-color': 'transparent',
      'border-top': 'none',
      'border-left': 'none',
      'border-right': 'none',
      'border-bottom': '2px solid #AAAAAA',
      'outline': 'none',
      'border-radius': '0px'
    },

    inputClass: "dfg"
  };

  restrict(value: any, title: any, v: any) {
    this.restriction = value;
    this.titleRestriction = title;
    this.parentalId = v.id;
    console.log('Restriction set:', this.restriction, this.titleRestriction, this.parentalId);
  }
  ngAfterViewInit() {

    const otpInputs = document.querySelectorAll('ng-otp-input input');
    otpInputs.forEach((input: any) => {
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('pattern', '[0-9]*');
      input.setAttribute('autocomplete', 'one-time-code');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
    });
  }
  mobileOnly(event: any) {
    const keyCode = event.keyCode;

    const excludedKeys = [8, 37, 39, 46];

    if (!((keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 96 && keyCode <= 105) ||
      (excludedKeys.includes(keyCode)))) {
      event.preventDefault();
    }
  }
  getData() {
    this.ds.parentalGet().subscribe((res: any) => {
      console.log(res)
      this.dep_ser.getDecryptedData(res?.result);
      console.log(res.result, "kkkkkkkkkkk");
      let decryptData = JSON.parse(this.dep_ser.decryptData);
      this.parentalData = decryptData;
      console.log(this.parentalData, "hkjj");

      this.ageGrp = this.parentalData.agegp_list;
      console.log(this.ageGrp, "parrr");


    })
  }
  socialCreatePin() {
    //  this.dialogRef.close()
    const dialogRef = this.dialog.open(SocialParentalCreateComponent, {
      panelClass: 'contactfooter',
      width: "550px",
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    const sub = dialogRef.componentInstance.socialVerifiedParental.subscribe((verify: any) => {
      var isParentalSubmit = verify
      if (isParentalSubmit == true) {
        this.otpValue = this.otpInput.value
        this.confirmValue = this.otpInput1.value


        if (this.otpValue == this.confirmValue) {
          this.final_pin = this.confirmValue;

        }
        var id = this.accountData.id;

        const formData: any = new FormData();
        formData.append('u_id', id)
        formData.append('pin', this.final_pin),
          formData.append('status', 1)
        formData.append('device', "web")
        formData.append('level', this.profileForm.value.gender);
        formData.append('title', this.titleRestriction);
        formData.append('parental_id', this.parentalId);
        if (this.final_pin != undefined) {
          this.ds.parentalControl(formData).subscribe((data: any) => {

            if (data.code == 1) {

              this.dialogRef.close()

              this.fcs.setParentalLockFast.next(true)
              this.eds.changeParentalPinEnable.next(true)

              var hey = this.loginId
              hey.is_parental = 1
              localStorage.setItem('taploginInfo', JSON.stringify(hey))
              var level = this.loginId
              level.restriction_level = this.profileForm.value.gender
              localStorage.setItem('taploginInfo', JSON.stringify(level))
              var title = this.loginId
              title.restriction_title = this.titleRestriction
              localStorage.setItem('taploginInfo', JSON.stringify(title))
              this.fcs.LevelSetToSetting.next(this.titleRestriction)

              const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
                panelClass: 'contactfooter',
                width: "390px",

              });
              const parental = {
                u_id: id,
                pin: this.final_pin,
                level: this.profileForm.value.gender
              }
              localStorage.setItem("parentalControl", JSON.stringify(parental))
            } else if (data.code == 0) {
              // localStorage.setItem("isParentalSet", "1")
              this.alreadySetMsg = data.error
            }
          })
        } else {
          this.msg = this.errorMsg.kidsModeIncorrectPin
        }
      }
    })
  }

  onOtpChange(event: string, type: 'otp1' | 'otp2') {
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      if (event.length === 0) {
        if (type === 'otp1') {
          this.otpInput.setValue(''); // Safe clear
        } else if (type === 'otp2') {
          this.otpInput1.setValue('');
        }
      }
    }, 150);
  }



  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  otpPhoneCreatePinCheck1() {
    var getPhoneNumber = this.loginId.contact_no
    const formData = new FormData();

    formData.append('phone', getPhoneNumber);
    formData.append('type', 'phone');
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + '*' + window.innerHeight,
      push_device_token: "others",
      device_type: this.deviceDetection.os,
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",
    }
    formData.append('dd', JSON.stringify(devicedetail));
    this._auth.ottOtpLogin(formData).subscribe((res: any) => {
      if (res.code == 1) {
        const dialogRef = this.dialog.open(ParentalOtpPhonePinGenerateComponent, {
          panelClass: 'contactfooter',
          width: "390px",
          disableClose: true
        });
        const sub = dialogRef.componentInstance.phoneVerifiedParental.subscribe((verify: any) => {
          var isParentalSubmit = verify
          if (isParentalSubmit == true) {
            this.otpValue = this.otpInput.value
            this.confirmValue = this.otpInput1.value


            if (this.otpValue == this.confirmValue) {
              this.final_pin = this.confirmValue;

            }
            var id = this.accountData.id;

            const formData: any = new FormData();
            // formData.append('id', this.validatePin)
            formData.append('u_id', id)
            formData.append('pin', this.final_pin),
              formData.append('device', "web")
            formData.append('status', 1)
            formData.append('level', this.profileForm.value.gender);
            formData.append('title', this.titleRestriction);
            formData.append('parental_id', this.parentalId);
            if (this.final_pin != undefined) {
              this.ds.parentalControl(formData).subscribe((data: any) => {

                if (data.code == 1) {

                  this.dialogRef.close()

                  this.fcs.setParentalLockFast.next(true)
                  this.eds.changeParentalPinEnable.next(true)

                  var hey = this.loginId
                  hey.is_parental = 1
                  localStorage.setItem('taploginInfo', JSON.stringify(hey))
                  var level = this.loginId
                  level.restriction_level = this.profileForm.value.gender
                  localStorage.setItem('taploginInfo', JSON.stringify(level))
                  var title = this.loginId
                  title.restriction_title = this.titleRestriction
                  localStorage.setItem('taploginInfo', JSON.stringify(title))
                  this.fcs.LevelSetToSetting.next(this.titleRestriction)

                  const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
                    panelClass: 'contactfooter',
                    width: "390px",

                  });
                  const parental = {
                    u_id: id,
                    pin: this.final_pin,
                    level: this.profileForm.value.gender
                  }
                  localStorage.setItem("parentalControl", JSON.stringify(parental))
                } else if (data.code == 0) {

                  this.alreadySetMsg = data.error
                }
              })
            } else {
              this.msg = this.errorMsg.kidsModeIncorrectPin
            }
          }
        })
      }
    })
  }
  otpPhoneCreatePinCheck() {
    this.otpValue = this.otpInput.value
    this.confirmValue = this.otpInput1.value


    if (this.otpValue == this.confirmValue) {
      this.final_pin = this.confirmValue;

    }
    var id = this.accountData.id;

    var id = this.accountData.id;

    const formData: any = new FormData();
    formData.append('id', this.validatePin)
    formData.append('u_id', id)
    formData.append('pin', this.final_pin),
      formData.append('device', "web")
    formData.append('level', this.profileForm.value.gender);
    formData.append('title', this.titleRestriction);
    formData.append('parental_id', this.parentalId);
    if (this.final_pin != undefined) {
      this.ds.changePin(formData).subscribe((data: any) => {

        if (data.code == 1) {

          this.dialogRef.close()

          this.fcs.setParentalLockFast.next(true)
          this.eds.changeParentalPinEnable.next(true)

          var hey = this.loginId
          hey.is_parental = 1
          localStorage.setItem('taploginInfo', JSON.stringify(hey))
          var level = this.loginId
          level.restriction_level = this.profileForm.value.gender
          localStorage.setItem('taploginInfo', JSON.stringify(level))
          var title = this.loginId
          title.restriction_title = this.titleRestriction
          localStorage.setItem('taploginInfo', JSON.stringify(title))
          this.fcs.LevelSetToSetting.next(this.titleRestriction)

          const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
            panelClass: 'contactfooter',
            width: "390px",
          });
          const parental = {
            u_id: id,
            pin: this.final_pin,
            level: this.profileForm.value.gender
          }
          localStorage.setItem("parentalControl", JSON.stringify(parental))
        } else if (data.code == 0) {

          this.alreadySetMsg = data.error
        }
      })
    } else {
      this.msg = this.errorMsg.kidsModeIncorrectPin
    }

  }
  setLock() {


    if (this.otpInput.valid && this.otpInput1.valid && this.profileForm.valid) {
      console.log("1111111");
      if (this.otpInput.value == this.otpInput1.value) {
        console.log("222222222222");
        if (this.loginId.login_type == 'email') {
          console.log("33333333");
          //  this.dialogRef.close()
          const dialogRef = this.dialog.open(ParentalCreatePinCheckComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            disableClose: true
          });

          const sub = dialogRef.componentInstance.emailVerifiedParental.subscribe((data: any) => {
            var isParentalSubmit = data

            if (isParentalSubmit == true) {

              this.otpValue = this.otpInput.value
              this.confirmValue = this.otpInput1.value

              if (this.otpValue == this.confirmValue) {
                this.final_pin = this.confirmValue;

              }
              var id = this.accountData.id;

              const formData: any = new FormData();
              formData.append('u_id', id)
              formData.append('pin', this.final_pin),
                formData.append('status', 1)
              formData.append('device', "web")
              formData.append('level', this.profileForm.value.gender);
              formData.append('title', this.titleRestriction);
              formData.append('parental_id', this.parentalId);

              if (this.final_pin != undefined) {
                this.ds.parentalControl(formData).subscribe((data: any) => {
                  if (data.code == 1) {
                    var hey = this.loginId
                    hey.is_parental = 1
                    localStorage.setItem('taploginInfo', JSON.stringify(hey))
                    var level = this.loginId
                    level.restriction_level = this.profileForm.value.gender
                    localStorage.setItem('taploginInfo', JSON.stringify(level))
                    var title = this.loginId
                    title.restriction_title = this.titleRestriction
                    localStorage.setItem('taploginInfo', JSON.stringify(title))
                    this.dialogRef.close()
                    this.fcs.setParentalLockFast.next(true)
                    this.eds.changeParentalPinEnable.next(true)

                    this.fcs.LevelSetToSetting.next(this.titleRestriction)

                    const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
                      panelClass: 'contactfooter',
                      width: "390px",

                    });
                    const parental = {
                      u_id: id,
                      pin: this.final_pin,
                      level: this.profileForm.value.gender
                    }
                    localStorage.setItem("parentalControl", JSON.stringify(parental))

                  } else if (data.code == 0) {
                    // localStorage.setItem("isParentalSet", "1")
                    this.alreadySetMsg = data.error
                  }
                })

              }
            }

          });

        }
        else if (this.loginId.login_type == 'phone') {

          this.otpPhoneCreatePinCheck1()

        } else if (this.loginId.login_type == 'social') {
          this.socialCreatePin()
        }
      } else { this.vaidationForm = this.errorMsg.kidsModeIncorrectPin }
    } else {
      this.vaidationForm = this.errorMsg.messageEnterAllFields
    }
  }

  updatePin() {

    if (this.otpInput.valid && this.otpInput1.valid && this.profileForm.valid) {
      if (this.otpInput.value == this.otpInput1.value) {
        if (this.loginId.login_type == 'email' || this.loginId.login_type == 'social') {
          this.dialogRef.close()
          this.otpValue = this.otpInput.value
          this.confirmValue = this.otpInput1.value

          if (this.otpValue == this.confirmValue) {
            this.final_pin = this.confirmValue;

          }
          var id = this.accountData.id;

          const formData: any = new FormData();
          formData.append('id', this.validatePin)
          formData.append('u_id', id)
          formData.append('pin', this.final_pin),
            formData.append('device', "web")
          formData.append('level', this.profileForm.value.gender);
          formData.append('title', this.titleRestriction);
          formData.append('parental_id', this.parentalId);

          if (this.final_pin != undefined) {

            this.ds.changePin(formData).subscribe((data: any) => {

              if (data.code == 1) {
                this.dialogRef.close()
                this.fcs.setParentalLockFast.next(true)
                this.eds.changeParentalPinEnable.next(true)
                var hey = this.loginId
                hey.is_parental = 1
                localStorage.setItem('taploginInfo', JSON.stringify(hey))
                var level = this.loginId
                level.restriction_level = this.profileForm.value.gender
                localStorage.setItem('taploginInfo', JSON.stringify(level))
                var title = this.loginId
                title.restriction_title = this.titleRestriction
                localStorage.setItem('taploginInfo', JSON.stringify(title))

                this.fcs.LevelSetToSetting.next(this.titleRestriction)

                const dialogRef = this.dialog.open(ParentalPinCreatedSuccesComponent, {
                  panelClass: 'contactfooter',
                  width: "390px",

                });
                const parental = {
                  u_id: id,
                  pin: this.final_pin,
                  level: this.profileForm.value.gender
                }
                localStorage.setItem("parentalControl", JSON.stringify(parental))

              } else if (data.code == 0) {

                this.alreadySetMsg = data.error
              }
            })

          }


        }
        else if (this.loginId.login_type == 'phone') {
          this.otpPhoneCreatePinCheck()
        }

      } else { this.vaidationForm = this.errorMsg.kidsModeIncorrectPin }
    } else {
      this.vaidationForm = this.errorMsg.messageEnterAllFields
    }

  }

  onSubmit() {

  }
  getvalue(e: any) {

  }
  close() {

    this.dialogRef.close();
    this.checked2.emit(true)
  }

}
