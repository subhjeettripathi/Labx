import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DataService } from 'src/app/services/data.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { ThirdPartyIntegrationService } from 'src/app/services/third-party-integration.service';
import { AcoountDeletionSuccesfullPopupComponent } from 'src/app/shared/dialogBoxes/acoount-deletion-succesfull-popup/acoount-deletion-succesfull-popup.component';
import { ConsentDeleteAccountComponent } from 'src/app/shared/dialogBoxes/consent-delete-account/consent-delete-account.component';
import { CountryLockPopupComponent } from 'src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component';
import { DeleteAccountPopupComponent } from 'src/app/shared/dialogBoxes/delete-account-popup/delete-account-popup.component';
import { environment } from 'src/environments/environment';
//import * as amplitude from '@amplitude/analytics-browser';
import Swal from 'sweetalert2';
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
import { CancelSubscriptionComponent } from '../cancel-subscription/cancel-subscription.component';
import { CancelSubscriptionAlertComponent } from 'src/app/shared/dialogBoxes/cancel-subscription-alert/cancel-subscription-alert.component';
import { LandingConsentAgePopupComponent } from 'src/app/shared/dialogBoxes/landing-consent-age-popup/landing-consent-age-popup.component';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  @Output() backToProfile = new EventEmitter<void>();
  @ViewChild("deleteConfirmationModal")
  deleteConfirmationModal!: TemplateRef<any>;
  private deleteConfirmationModalRef!: MatDialogRef<TemplateRef<any>>;
  deleteForm!: FormGroup;
  accountData: any;
  alreadySent: any;
  deletaAllData = []
  deleteContent: any;
  contentIsAllow: any;
  deleteHead: any
  dropdownText: any;
  dropdownTextIsAllow: any;
  dropdownTextPlaceholder: any;

  inspectionTypes: any = []
  emailText: any;
  emailAllow: any;
  resultConfirmDelete: any;
  loginTypePhone: any;
  timeZoneOffset: any;
  subscribe: any;
  invalidCapchta: boolean | undefined;
  b: any = 0
  mobilePin: any
  showPin: Boolean = false;
  build_version: any;
  recaptchaKey: any
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed: boolean = false;
  subscription_plan: any;
  autoplan: any;
  cancelledkey: boolean = false;
  cancel_subs: any
  constructor(private tps: ThirdPartyIntegrationService, private loaderService: LoaderService, private _FPS: FingerPrintService, public es: ExchangeDataService, private deviceService: DeviceDetectorService, private fb: FormBuilder, private ds: DataService, private SWAL: SwalMsgService, private dialog: MatDialog, private fc: FunctionCallingService) {
    this.es.showPins.subscribe(val => {
      if (val == true) {


        this.showPin = true
        var data: any = localStorage.getItem('taploginInfo')
        var data_read = JSON.parse(data)

        // this.mobilePin=data.country_code+''+data_read.contact_no
        this.deleteForm.patchValue({
          mobile: data_read.country_code + "-" + "" + data_read.contact_no,
        })
        // this.deleteForm.patchValue({
        //   mobile:   '91-'+'' + data_read.contact_no,
        // })
        // if(data_read.contact_no !='' && data_read.email != ''){
        //   if(this.accountData.country_code != ''){
        //     this.deleteForm.patchValue({
        //       mobile: this.accountData.country_code.replace('-','') + ' - ' + this.accountData.contact_no,
        //     })
        //   }else{
        //     this.deleteForm.patchValue({
        //       mobile: this.accountData.country_code.replace('-','') + this.accountData.contact_no,
        //     })
        //   }

        //   this.deleteForm.patchValue({
        //     email: this.accountData.email,
        //   })
        //  }



      }

    });


    this.es.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
    this.es.cancelKey.subscribe((value) => {
      this.cancelledkey = value;
    })
    this.timeZoneOffset = new Date();
  }
  selected = 0;

  @Input() updationMail: any
  basesignin: any = []
  ngOnInit(): void {
    this.cancel_subs = localStorage.getItem('cancelKey') || {};
    if (this.cancel_subs == 1) {
      this.cancelledkey = true
    } else {
      this.cancelledkey = false
    }


    if (localStorage.getItem('ott_subscriptionPlan')) {
      this.subscription_plan = localStorage.getItem('ott_subscriptionPlan') || {};
      if (JSON.parse(this.subscription_plan).packages_list.length != 0) {
        this.autoplan = JSON.parse(this.subscription_plan).packages_list[0].autorenew
      } else {
        this.autoplan = '0'
      }
    }


    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }

    this.subscribe = localStorage.getItem('is_subscriber')


    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    if (data.info) {
      this.accountData = data_read.info
    } else {
      this.accountData = data_read
    }


    this.deleteForm = this.fb.group({
      mobile: ['',],
      email: ['',],
      desc: ['', Validators.required],
      // recaptcha: ['', Validators.required]
    });

    this.delete_Form();
    this.getDataJson();
  }


  handleSuccess(e: any) {
    if (e != '') {
      this.invalidCapchta = false
    }

  }

  userInfo: any;
  userDetails: any;

  //         thirdPartyJson(){
  //           this.ds.getThirdParty().subscribe((res:any)=>{
  // this.recaptchaKey=res.ThirdParty[0].GOOGLE_CAPTCHA.SITE_KEY
  //           })


  //         }
  getDataJson() {
    this.ds.faqData().subscribe((res: any) => {

      // this.deletaAllData=res.App[0].delete_account
      this.deleteContent = res.App[0].delete_account.content.text
      this.deleteHead = res.App[0].delete_account.heading


      this.contentIsAllow = res.App[0].delete_account.content.is_allow
      // dropdown:-
      this.dropdownText = res.App[0].delete_account.delete_reason.text
      this.dropdownTextIsAllow = res.App[0].delete_account.delete_reason.is_allow
      this.dropdownTextPlaceholder = res.App[0].delete_account.delete_reason.placeholder

      this.inspectionTypes = res.App[0].delete_account.delete_reason.dropdown.values

      this.build_version = res.Website[0].footer_menu.footer_version.version;

      // email:-
      this.emailText = res.App[0].delete_account.email.text
      this.emailAllow = res.App[0].delete_account.email.is_allow
    })
  }
  // inspectionTypes: any[] = [
  //   { inspection_type_id: 1, description: 'Type A' },
  //   { inspection_type_id: 2, description: 'Type B' },
  //   { inspection_type_id: 3, description: 'Type C' },

  // ];
  s1(sel: MatSelect) {
    sel.placeholder = '';
  }
  s2(sel: MatSelect) {

    if (sel.value === '') {
      sel.placeholder = this.dropdownTextPlaceholder;
    }
  }
  delete_Form() {
    let emalid: any = localStorage.getItem('taploginInfo')
    let ch = JSON.parse(emalid)
    this.loginTypePhone = ch.login_type
    // if (ch.email == "") {
    //   this.deleteForm.patchValue({
    //     mobile: this.accountData.contact_no,

    //     email: this.updationMail,

    //   })

    // } else {
    //   this.deleteForm.patchValue({
    //     mobile: this.accountData.contact_no,

    //     email: this.accountData.email,

    //   })
    // }

    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    if (data_read.contact_no != '' && data_read.email != '') {
      if (this.accountData.country_code != '') {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + ' - ' + this.accountData.contact_no,
        })
      } else {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + this.accountData.contact_no,
        })
      }

      this.deleteForm.patchValue({
        email: this.accountData.email,
      })
    }
    else if (ch.is_phone_verify == "1" && ch.is_mail_verify == "1") {

      this.deleteForm.patchValue({
        email: this.accountData.email,
      })

      if (this.accountData.country_code != '') {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + ' - ' + this.accountData.contact_no,
        })
      } else {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + this.accountData.contact_no,
        })
      }

    }
    else if (ch.is_phone_verify == "1" && ch.is_mail_verify == "0") {

      if (this.accountData.country_code != '') {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + ' - ' + this.accountData.contact_no,
        })
      } else {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + this.accountData.contact_no,
        })
      }
      this.deleteForm.patchValue({
        email: this.accountData.email,
      })
    }
    else if (ch.login_type == "email" || ch.login_type == "social") {

      this.deleteForm.patchValue({
        email: this.accountData.email,
      })
    } else if (ch.login_type == "phone") {

      if (this.accountData.country_code != '') {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + ' - ' + this.accountData.contact_no,
        })
      } else {
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-', '') + this.accountData.contact_no,
        })
      }
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
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  isDeletingg = false;

  deleteAccount() {
    if (this.isDeletingg) {
      return; // prevent double click
    }
    this.isDeletingg = true; // lock
  
    this.loaderService.hide();
  
    const formData = new FormData();
    formData.append('reason', this.deleteForm.value.desc);
    formData.append('email', this.deleteForm.value.email);
    formData.append('device', "web");
    formData.append('subject', 'Delete My Account');
  
    const data: any = localStorage.getItem('taploginInfo');
    const data_read = JSON.parse(data);
    formData.append('uid', data_read.id);
  
    let user: any = localStorage.getItem('taploginInfo');
    let user_read = JSON.parse(user);
  
    // ... keep all your existing conditions here ...
  
    // Example for API call part:
    this.ds.delete_account(formData).subscribe({
      next: (res: any) => {
        if (res.code == 1) {
          this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { message: 'false' }
          });
          localStorage.setItem("deleteAccount", "1");
        } else {
          this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { message: 'true' }
          });
        }
      },
      error: () => {
        // handle error gracefully
      },
      complete: () => {
        this.isDeletingg = false; // unlock after everything
        this.loaderService.hide();
      }
    });
  }
  
  opendpunt() {
    const dialogRef = this.dialog.open(CountryLockPopupComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'adultAgePopup',
      width: "390px",
    });
  }
  // deleAccount() {
  //   const formData = new FormData();

  //   formData.append('reason', this.deleteForm.value.desc);
  //   formData.append('email', this.deleteForm.value.email);
  //   formData.append('device', "web");
  //   formData.append('subject', 'Delete My Account')
  //   var data: any = localStorage.getItem('taploginInfo')
  //   var data_read = JSON.parse(data)
  //   formData.append('uid', data_read.id);
  //   this.ds.delete_account(formData).subscribe((res: any) => {
  //     if (res.code == 1) {
  //       this.deleteConfirmationModalRef.close();
  //       this.loaderService.hide()
  //       const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
  //         backdropClass: 'popupBackdropClass',
  //         panelClass: 'deleteSuccessfull',
  //         width: "390px",
  //         data: { message: 'false' }
  //       });
  //     }
  //     else {
  //       this.deleteConfirmationModalRef.close();
  //       this.loaderService.hide()
  //       const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
  //         backdropClass: 'popupBackdropClass',
  //         panelClass: 'deleteSuccessfull',
  //         width: "390px",
  //         data: { message: 'true' }
  //       });
  //     }
  //   })
  // }


  isDeleting = false; // flag

  deleAccount() {
    if (this.isDeleting) return;   // block multiple clicks
    this.isDeleting = true;        // lock after first click

    const formData = new FormData();
    formData.append('reason', this.deleteForm.value.desc);
    formData.append('email', this.deleteForm.value.email);
    formData.append('device', "web");
    formData.append('subject', 'Delete My Account');

    const data: any = localStorage.getItem('taploginInfo');
    const data_read = JSON.parse(data);
    formData.append('uid', data_read.id);

    this.ds.delete_account(formData).subscribe({
      next: (res: any) => {
        // ✅ your popup logic stays unchanged
        if (res.code == 1) {
          this.deleteConfirmationModalRef.close();
          this.loaderService.hide();
          this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { message: 'false' }
          });
        } else {
          this.deleteConfirmationModalRef.close();
          this.loaderService.hide();
          this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { message: 'true' }
          });
        }

        this.isDeleting = false; // unlock after done
      },
      error: () => {
        this.loaderService.hide();
        this.isDeleting = false; // unlock if API fails
      }
    });
  }

  opencancelsubscription() {
    //  const cancelKey = localStorage.getItem('cancelKey')
    if (this.cancelledkey == true) {
      const dialogRef = this.dialog.open(CancelSubscriptionAlertComponent, {
        backdropClass: 'popupBackdropClass',
        panelClass: 'deleteSuccessfull',
        width: "390px",
        // data: { message: 'false' }
      });
    } else {
      // localStorage.removeItem('cancelKey')
      const dialogRef = this.dialog.open(CancelSubscriptionComponent, {
        panelClass: 'contactfooter',
        width: "390px",
        disableClose: true
      });
    }
  }
  close() {
    this.deleteConfirmationModalRef.close();
  }
  back() {
    this.backToProfile.emit();
  }

}

