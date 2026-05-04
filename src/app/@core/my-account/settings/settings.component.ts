import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ParentalControlComponent } from "src/app/shared/dialogBoxes/parental-control/parental-control.component";
import {
  MatDialog,
} from "@angular/material/dialog";
import { VerifyParentalPinComponent } from 'src/app/shared/dialogBoxes/verify-parental-pin/verify-parental-pin.component';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { DataService } from 'src/app/services/data.service';
import Swal from 'sweetalert2';
import { ClearWatchingConsentComponent } from 'src/app/shared/dialogBoxes/clear-watching-consent/clear-watching-consent.component';
import { SubtitleSettingComponent } from 'src/app/shared/dialogBoxes/subtitle-setting/subtitle-setting.component';
import { DecryptService } from 'src/app/services/decrypt.service';
import { RestrictionLevelSetComponent } from 'src/app/shared/dialogBoxes/restriction-level-set/restriction-level-set.component';
import { VerifyParentalAlreadyRegisterComponent } from 'src/app/shared/dialogBoxes/verify-parental-already-register/verify-parental-already-register.component';
import { ParentalOtpCreateComponent } from 'src/app/shared/dialogBoxes/parental-otp-create/parental-otp-create.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { AuthService } from 'src/app/services/auth.service';
import { ParentalOtpEnableComponent } from 'src/app/shared/dialogBoxes/parental-otp-enable/parental-otp-enable.component';
import { RegionalComponent } from 'src/app/shared/dialogBoxes/regional/regional.component';
import { ParentalCreatePinCheckComponent } from 'src/app/shared/dialogBoxes/parental-create-pin-check/parental-create-pin-check.component';
import { ParentalOtpPhonePinGenerateComponent } from 'src/app/shared/dialogBoxes/parental-otp-phone-pin-generate/parental-otp-phone-pin-generate.component';
import { first } from 'rxjs';
import { PasswordCreateSuccessDialogComponent } from 'src/app/shared/dialogBoxes/password-create-success-dialog/password-create-success-dialog.component';
import { ParentalResetPasswordPopopComponent } from 'src/app/shared/dialogBoxes/parental-reset-password-popop/parental-reset-password-popop.component';
import { SocialParentalCreateComponent } from 'src/app/shared/dialogBoxes/social-parental-create/social-parental-create.component';
import { environment } from 'src/environments/environment';
// import * as amplitude from '@amplitude/analytics-browser';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  changePinParental = false
  showParental = false
  parentalEnable: any
  visitorId: any = localStorage.getItem('device_id')
  parentalSet: boolean | undefined
  @ViewChild("parentchecking") ref: ElementRef | undefined;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  abc: any;

  clearWatching: any;
  changeRestrictionLevel: any;
  titleSubtitle: any;
  regional: any
  sendTosettingSubtitle: any;
  enableFast: boolean | undefined;
  bpl = 0
  isApiProcessing = false;
  // @Input() openChang:any
  constructor(public dialog: MatDialog, private ed: ExchangeDataService, private fcs: FunctionCallingService, private ds: DataService, private DEC_SER: DecryptService, private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private _auth: AuthService) {
    this.userParentalSelected()
    this.ed.changeParentalPinEnable.subscribe(value => {

      this.changePinParental = value;

    });
    this.ed.disableToEnableFaste.subscribe(value => {
      this.enableFast = value;

    });
    this.fcs.setParentalLockFast.subscribe(value => {

      this.parentalSet = value;
    });

    this.fcs.restrictionLevel.subscribe(res => {
      this.changeRestrictionLevel = res
    });
    this.fcs.LevelSetToSetting.subscribe(val => {

      this.changeRestrictionLevel = val;
    });
    this.ed.openChangePin.pipe(first()).subscribe((message) => {
      if (message == true) {
        this.changePin()
      }


    });


  }
  toggle_value: any
  checked: any;

  isParental = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  isParentalSet = localStorage.getItem("isParentalSet")
  errorAlertData: any
  errorMsg: any
  otpSecret: any
  ngOnInit(): void {

    if (this.abc) {
      this.checked = true
    }

    let is_subscribe = localStorage.getItem("is_subscriber")
    if (is_subscribe == '1') {
      this.parentalEnable = true
      this.showParental = true
    } else {
      this.showParental = false
    }

    this.getSub()
    // restriction condition:-
    let titlerestrict = localStorage.getItem("restrictionTitle")
    if (titlerestrict != null) {
      this.changeRestrictionLevel = titlerestrict
    } else {
      if (this.isParental.restriction_title != '') {
        this.changeRestrictionLevel = this.isParental.restriction_title
      }
    }
    var sub: any = localStorage.getItem('subtitle')




    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)


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

  }
  userParentalSelected() {
    var user_id = this.isParental.id
    if (user_id) {
      this.ds.userContentData(user_id).subscribe((res: any) => {
        this.DEC_SER.getDecryptedData(res?.result);
        let decryptData = JSON.parse(this.DEC_SER.decryptData);
        const sendTosett = decryptData.parental;

        var hey = this.loginId
        hey.is_parental = sendTosett.is_parental
        console.log(hey.is_parental,"kkkkk")
        hey.restriction_level = sendTosett.restriction_level
        hey.restriction_title = sendTosett.restriction_title
        localStorage.setItem('taploginInfo', JSON.stringify(hey))

        if (hey.is_parental == 1) {

          this.checked = true
          this.changePinParental = true
        }
        if (hey.is_parental == 2) {

          this.checked = false
          this.changePinParental = false
        }
        if (hey.is_parental == 0) {
  
          this.changePinParental = false
        }

      
        this.changeRestrictionLevel = hey.restriction_title


      })
    }

  }
  getSub() {
    var u_id: any = localStorage.getItem('taploginInfo')
    var ids = JSON.parse(u_id)
    this.ds.getSubtitle(ids.id).subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      const sendTosett = decryptData;

      if (sendTosett.payload == null) {

        this.titleSubtitle = 'None'
        this.regional = 'None'
      }
      else if (!(sendTosett.payload.hasOwnProperty('language_key'))) {

        this.regional = 'None'
        this.titleSubtitle = this.sendTosettingSubtitle
      }
      else if (!(sendTosett.payload.hasOwnProperty('language_key')) && !(sendTosett.payload.hasOwnProperty('subtitle'))) {

        this.regional = 'None'
        this.titleSubtitle = 'None'
      }
      else if (!(sendTosett.payload.hasOwnProperty('subtitle')) && sendTosett.payload.language_key == "") {


        this.regional = 'None'
        this.titleSubtitle = 'None'
      }
      else if (!(sendTosett.payload.hasOwnProperty('subtitle'))) {
        this.titleSubtitle = 'None'
        this.regional = sendTosett.payload.language_key
      } else if (sendTosett.payload.language_key == '' && sendTosett.payload.subtitle != '') {

        this.titleSubtitle = sendTosett.payload.subtitle
        this.regional = 'None'
      }
      else {

        this.sendTosettingSubtitle = sendTosett.payload.subtitle
        this.titleSubtitle = this.sendTosettingSubtitle
        this.regional = sendTosett.payload.language_key

      }

    })
  }

  userInfo: any;
  userDetails: any;

  isParentalChecked(e: any) {
    if (e.checked == true) {
      if (this.isParental.is_parental == 2 || this.enableFast == true) {
        if (this.isParental.login_type == 'email') {
          const dialogRef = this.dialog.open(VerifyParentalAlreadyRegisterComponent, {
            panelClass: 'contactfooter',
            width: "390px",
            disableClose: true,
            backdropClass: 'backdropBackground'
          });
          const sub = dialogRef.componentInstance.case2Parental.subscribe((da: any) => {
            this.changePinParental = da
            e.source.checked = da
          });
          dialogRef.componentInstance.case2.subscribe((da: any) => {
            e.source.checked = false
          });
          dialogRef.afterClosed().subscribe((result) => {
   
          });
        } else if (this.isParental.login_type == 'phone') {
          this.sendOtpPhoneEnable(e)
        } else if (this.isParental.login_type == 'social') {
          const dialogRef = this.dialog.open(VerifyParentalAlreadyRegisterComponent, {
            panelClass: 'contactfooter',
            width: "390px",
            disableClose: true
          });
          const sub = dialogRef.componentInstance.case2Parental.subscribe((da: any) => {
            this.changePinParental = da
            e.source.checked = da
          });
          dialogRef.componentInstance.socialClose.subscribe((da: any) => {

            e.source.checked = false
          });
          dialogRef.afterClosed().subscribe((result) => {

          });
        }
      }
      else {

        const dialogRef = this.dialog.open(ParentalControlComponent, {
          panelClass: 'contactfooter',
          width: "390px",
          data: { email: e },
          disableClose: true,
          backdropClass: 'backdropBackground'
        });
        dialogRef.componentInstance.checked2.subscribe((da: any) => {
          e.source.checked = false
        });

        dialogRef.afterClosed().subscribe((result) => {
          //  e.source.checked = false;
          if (this.isParental.is_parental == 1) {
            e.source.checked = true;
          }
        });
        this.toggle_value = 1;
      }
    }
    else if (e.checked == false) {
      console.log(this.isParental);
      
      this.toggle_value = 0;
      if (this.isParental.is_parental == 1 || this.parentalSet == true || this.isParental.is_parental == 2) {
        if (this.isParental.login_type == 'email') {
          const dialogRef = this.dialog.open(VerifyParentalPinComponent, {
            panelClass: 'contactfooter',
            width: "390px",
            disableClose: true
          });
          dialogRef.componentInstance.checked1.subscribe((da: any) => {
            e.source.checked = true
          });
          dialogRef.afterClosed().subscribe((result) => {

          });
        }
        else if (this.isParental.login_type == 'phone') {
          this.ed.showRestrict.next(false)
          this.sendOtpPhone(e)
        }
        else if (this.isParental.login_type == 'social') {
          this.ed.showRestrict.next(false)
          const dialogRef = this.dialog.open(VerifyParentalPinComponent, {
            panelClass: 'contactfooter',
            width: "390px",
            disableClose: true
          });
          dialogRef.componentInstance.socialCl.subscribe((da: any) => {

            e.source.checked = true
          });
          dialogRef.afterClosed().subscribe((result) => {
   
          });
        }
      }

    }
    localStorage.setItem('toggle_status', this.toggle_value);
  }
  openParentalControlDialog(): void {
    const dialogRef = this.dialog.open(ParentalControlComponent, {
      panelClass: 'contactfooter',
      width: "390px",
      data: { email: 'login' },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  dismissParental() {
    const dialogRef = this.dialog.open(VerifyParentalPinComponent, {
      panelClass: 'contactfooter',
      width: "390px",
    });

    dialogRef.afterClosed().subscribe((result) => {

    });
  }

  changePin() {
    if (this.isApiProcessing) return;
    this.isApiProcessing = true;
    this.bpl = 1
    this.ed.openChangePin.next(false)
    if (this.loginId.login_type == 'email' || this.loginId.login_type == 'social') {
      const dialogRef = this.dialog.open(ParentalCreatePinCheckComponent, {
        backdropClass: 'popupBackdropClass',
        panelClass: 'deleteSuccessfull',
        width: "390px",
        // disableClose: true
      });
      dialogRef.afterClosed().subscribe((result) => {
        document.body.style.overflow = 'auto'

        this.isApiProcessing = false;
      });
      const sub = dialogRef.componentInstance.emailVerifiedParental.subscribe((data: any) => {
        var isParentalSubmit = data
        if (isParentalSubmit == true) {
          const dialogRef = this.dialog.open(ParentalControlComponent, {
            panelClass: 'contactfooter',
            width: "390px",
            data: { email: 'login' },
          });
          dialogRef.afterClosed().subscribe((result) => {
            // document.body.style.overflow = 'auto'

            this.isApiProcessing = false;
          });
        }
      })
    }
    else if (this.loginId.login_type == 'phone') {
      var getPhoneNumber = this.loginId.contact_no
      const formData = new FormData();

      formData.append('phone', getPhoneNumber);
      formData.append('type', 'phone');
      formData.append('payload', this.otpSecret);
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
      this._auth.ottOtpLogin(formData).subscribe((res: any) => {
        if (res.code == 1) {

          const dialogRef = this.dialog.open(ParentalOtpPhonePinGenerateComponent, {
            panelClass: 'contactfooter',
            width: "390px",
            disableClose: true
          });
          dialogRef.afterClosed().subscribe((result) => {
            document.body.style.overflow = 'auto'

            this.isApiProcessing = false;
          });
          const sub = dialogRef.componentInstance.phoneVerifiedParental.subscribe((verify: any) => {
            var isParentalSubmit = verify
            if (isParentalSubmit == true) {
              const dialogRef = this.dialog.open(ParentalControlComponent, {
                panelClass: 'contactfooter',
                width: "390px",
                data: { email: 'login' },
              });
            }
          })
        }
      })
    }
  }

  changeRestriction() {
    if (this.isApiProcessing) return;
    this.isApiProcessing = true;

    this.ed.showrestrict.next(true);
    const dialogRef = this.dialog.open(RestrictionLevelSetComponent, {
      panelClass: 'contactfooter',
      width: "420px",
      backdropClass: 'backdropBackground'
    });

    const sub = dialogRef.componentInstance.senIsInfotoShow.subscribe((dat: any) => {
      this.changeRestrictionLevel = dat;
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isApiProcessing = false;
    });
  }




  clearContinueWatching() {
    const dialogRef = this.dialog.open(ClearWatchingConsentComponent, {
      panelClass: 'contactfooter',
      width: "390px",
    });
    const sub = dialogRef.componentInstance.sendValueToSetting.subscribe((resp: any) => {
      this.clearWatching = resp

      if (this.clearWatching) {

        const formData = new FormData();
        formData.append('c_id', '-1')
        formData.append('u_id', this.isParental.id)
        this.ds.clearContinueWatching(formData).subscribe((res: any) => {
          if (res.code == 1) {
            this.getSwalmsg('Continue Watching Cleared', 'success');
          }
        })
      }

    });
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

  subtitleOpen() {
    // const dialogRef = this.dialog.open(SocialParentalCreateComponent, {
    //   panelClass: 'contactfooter',
    //   width: "590px",
    //   disableClose: true,
    //   backdropClass: 'backdropBackground'
    // });

    const dialogRef = this.dialog.open(SubtitleSettingComponent, {
      panelClass: 'contactfooter',
      width: "390px",
      data: { title: this.sendTosettingSubtitle }
    });
    const sub = dialogRef.componentInstance.subtitleSett.subscribe((title: any) => {

      this.titleSubtitle = title
    });
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  sendOtpPhone(e: any) {
    var getPhoneNumber = this.isParental.contact_no
    const formData = new FormData();
    // this.mobileNumberForResend = this.loginForm.value.code + this.loginForm.value.emailphone;
    formData.append('phone', getPhoneNumber);
    formData.append('type', 'phone');
    formData.append('payload', this.otpSecret);
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
    this._auth.ottOtpLogin(formData).subscribe(res => {
      if (res.code == 1) {
        const dialogRef = this.dialog.open(ParentalOtpCreateComponent, {
          panelClass: 'contactfooter',
          width: "390px",
          disableClose: true
        });
        dialogRef.componentInstance.checked1.subscribe((da: any) => {
          e.source.checked = true
        });
        dialogRef.afterClosed().subscribe((result) => {
          //  e.source.checked = true;

          if (this.isParental.is_parental == 2) {
            e.source.checked = true
          }
        });
      }
      else {
        this.getSwalmsg(res.result, 'error');
        e.source.checked = true
      }
      // this.DEC_SER.getDecryptedData(res.result);

    });
  }
  sendOtpPhoneEnable(e: any) {
    var getPhoneNumber = this.isParental.contact_no
    const formData = new FormData();
    // this.mobileNumberForResend = this.loginForm.value.code + this.loginForm.value.emailphone;
    formData.append('phone', getPhoneNumber);
    formData.append('type', 'phone');
    formData.append('payload', this.otpSecret);

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
    this._auth.ottOtpLogin(formData).subscribe(res => {
      if (res.code == 1) {
        const dialogRef = this.dialog.open(ParentalOtpEnableComponent, {
          panelClass: 'contactfooter',
          width: "390px",
          disableClose: true
        });
        const sub = dialogRef.componentInstance.case2Parental.subscribe((da: any) => {
          this.changePinParental = da
          e.source.checked = da
        });
        dialogRef.componentInstance.case2.subscribe((da: any) => {
          e.source.checked = false
        });
        dialogRef.afterClosed().subscribe((result) => {
          // e.source.checked = false

          let Fo = localStorage.getItem("isParentalSet")
          if (this.isParental.is_parental == 1) {
            e.source.checked = true
          }
        });
      }
      else {
        this.getSwalmsg(res.result, 'error');
        e.source.checked = true
      }

    })
  }
  SocialEnable(e: any) {

  }

  regionalOpen() {

    const dialogRef = this.dialog.open(RegionalComponent, {
      panelClass: 'contactfooter',
      width: "390px",
      data: { title: this.sendTosettingSubtitle }
    });
    const sub = dialogRef.componentInstance.regionalSet.subscribe((title: any) => {
      this.regional = title
    });


  }

}
