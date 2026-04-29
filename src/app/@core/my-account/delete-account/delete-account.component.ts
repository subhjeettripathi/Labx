import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DataService } from 'src/app/services/data.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { ThirdPartyIntegrationService } from 'src/app/services/third-party-integration.service';
import { AcoountDeletionSuccesfullPopupComponent } from 'src/app/shared/dialogBoxes/acoount-deletion-succesfull-popup/acoount-deletion-succesfull-popup.component';
import { ConsentDeleteAccountComponent } from 'src/app/shared/dialogBoxes/consent-delete-account/consent-delete-account.component';
import { CountryLockPopupComponent } from 'src/app/shared/dialogBoxes/country-lock-popup/country-lock-popup.component';
import { DeleteAccountPopupComponent } from 'src/app/shared/dialogBoxes/delete-account-popup/delete-account-popup.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  deleteForm!: FormGroup;
  accountData: any;
  alreadySent: any;
  deletaAllData = []
  deleteContent: any;
  contentIsAllow: any;
  dropdownText: any;
  dropdownTextIsAllow: any;
  dropdownTextPlaceholder: any;

  inspectionTypes: any = []
  emailText: any;
  emailAllow: any;
  resultConfirmDelete: any;
  loginTypePhone: any;
  invalidCapchta: boolean | undefined;
b:any=0
  constructor(private tps: ThirdPartyIntegrationService,public es: ExchangeDataService, private fb: FormBuilder, private ds: DataService, private SWAL: SwalMsgService, private dialog: MatDialog) { 
   
  }
  selected = 0;

  @Input() updationMail: any
  basesignin: any = []
  ngOnInit(): void {

    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    if (data.info) {
      this.accountData = data_read.info
    } else {
      this.accountData = data_read
    }
    console.log(this.accountData);
    this.deleteForm = this.fb.group({
      mobile: ['',],
      email: ['',],
      desc: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
    this.delete_Form();
    this.getDataJson()
  }


  handleSuccess(e: any) {
    if (e != '') {
      this.invalidCapchta = false
    }

  }
  getDataJson() {
    var res:any=localStorage.getItem('faqData')
    res=JSON.parse(res)
    // this.ds.faqData().subscribe((res: any) => {
      console.log(res.App[0].delete_account);
      // this.deletaAllData=res.App[0].delete_account
      this.deleteContent = res.App[0].delete_account.content.text
      console.log(this.deleteContent);

      this.contentIsAllow = res.App[0].delete_account.content.is_allow
      // dropdown:-
      this.dropdownText = res.App[0].delete_account.delete_reason.text
      this.dropdownTextIsAllow = res.App[0].delete_account.delete_reason.is_allow
      this.dropdownTextPlaceholder = res.App[0].delete_account.delete_reason.placeholder
      console.log(this.dropdownTextPlaceholder)
      this.inspectionTypes = res.App[0].delete_account.delete_reason.dropdown.values
      console.log(this.inspectionTypes);

      // email:-
      this.emailText = res.App[0].delete_account.email.text
      this.emailAllow = res.App[0].delete_account.email.is_allow
    // })
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
    console.log(sel.value)
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
   if(data_read.contact_no !='' && data_read.email != ''){
    if(this.accountData.country_code != ''){
      this.deleteForm.patchValue({
        mobile: this.accountData.country_code.replace('-','') + ' - ' + this.accountData.contact_no,
      })
    }else{
      this.deleteForm.patchValue({
        mobile: this.accountData.country_code.replace('-','') + this.accountData.contact_no,
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

      if(this.accountData.country_code != ''){
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-','') + ' - ' + this.accountData.contact_no,
        })
      }else{
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-','') + this.accountData.contact_no,
        })
      }
     
    }
    else if (ch.is_phone_verify == "1" && ch.is_mail_verify == "0") {
     
      if(this.accountData.country_code != ''){
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-','') + ' - ' + this.accountData.contact_no,
        })
      }else{
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-','') + this.accountData.contact_no,
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
      
      if(this.accountData.country_code != ''){
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-','') + ' - ' + this.accountData.contact_no,
        })
      }else{
        this.deleteForm.patchValue({
          mobile: this.accountData.country_code.replace('-','') + this.accountData.contact_no,
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
  
  deleteAccount() {
    console.log(this.deleteForm.value.desc)
    console.log(this.deleteForm.value);
    var description = this.deleteForm.value.mobile;
    console.log(description);
    var id = this.accountData.id;
    console.log(id);
    // const formData: any = new FormData();

    // formData.append('desc', this.deleteForm.value.desc)
    const formData = new FormData();
    // formData.append('email', this.otherQueryForm.value.email);
    // formData.append('uid', id)
    // formData.append('desc', this.deleteForm.value.desc)
    formData.append('description', this.deleteForm.value.desc);
    formData.append('priority', '1');
    formData.append('status', '2');
    formData.append('contact_no', this.deleteForm.value.mobile)
    formData.append('subject', 'Account Delete Request');
    //   formData.append('device', "web");
    // formData.append('description', this.otherQueryForm.value.write_a_question);

    let emalid: any = localStorage.getItem('taploginInfo')
    let ch = JSON.parse(emalid)
    if (ch.email == "") {
      formData.append('email', this.updationMail);
    }
    else {
      formData.append('email', this.deleteForm.value.email)
    }
    // formData.append('contact_no', this.deleteForm.value.mobile)
    // formData.append('device', "web");
    let user: any = localStorage.getItem('taploginInfo')
    let user_read = JSON.parse(user)
    let isVerified = localStorage.getItem('emailVerified')
    if (user_read.login_type == "email" || user_read.login_type == "social") {
      // if ((user_read.is_mail_verify == '1' || isVerified == '1' || this.loginTypePhone == 'phone') && (this.deleteForm.value.desc == '')) {
      if (user_read.is_mail_verify == '1' && this.deleteForm.value.desc != '') {
        if (!this.deleteForm.invalid) {
     
              // this.tps.paymentQuery(formData).subscribe((res: any) => {
              //   if (res.code == 1) {
              //     const dialogRef = this.dialog.open(ConsentDeleteAccountComponent, {
              //       backdropClass: 'popupBackdropClass',
              //       panelClass: 'adultAgePopup',
              //       width: "390px",
              //       data: { message: 'fal' }
              //     });
              //     const sub = dialogRef.componentInstance.sendValueToDelete.subscribe((res: any) => {
              //       this.resultConfirmDelete = res
              //       if (this.resultConfirmDelete == true) {
                  
              //     const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
              //       backdropClass: 'popupBackdropClass',
              //       panelClass: 'deleteSuccessfull',
              //       width: "390px",
              //       data: { message: 'false' }
              //     });
              //   }
              // });
              //   }
              //   else {
              
              //     const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
              //       backdropClass: 'popupBackdropClass',
              //       panelClass: 'deleteSuccessfull',
              //       width: "390px",
              //       data: { message: 'true' }
              //     });
             
              //   }
              // })
              
              var c=localStorage.getItem("deleteAccount")
             
              
              if(this.b==0 && c!='1'){
             if(this.dialog.openDialogs.length==0){
              const dialogRef = this.dialog.open(ConsentDeleteAccountComponent, {
                backdropClass: 'popupBackdropClass',
                panelClass: 'adultAgePopup',
                width: "390px",
                data: { message: 'fal' }
              });
              const sub = dialogRef.componentInstance.sendValueToDelete.subscribe((res: any) => {
                this.resultConfirmDelete = res
                if (this.resultConfirmDelete == true) {
                  this.tps.paymentQuery(formData).subscribe((res: any) => {
                    if (res.code == 1) {
                      const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
                        backdropClass: 'popupBackdropClass',
                        panelClass: 'deleteSuccessfull',
                        width: "390px",
                        data: { message: 'false' }
                      });
                     localStorage.setItem("deleteAccount","1")
                    this.b=1
                    }
                    else {
                      const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
                        backdropClass: 'popupBackdropClass',
                        panelClass: 'deleteSuccessfull',
                        width: "390px",
                        data: { message: 'true' }
                      });               
                    }
                  })
           
            }
          });
             }
             
        }else{

          const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { message: 'true' }
          });
        }
         
       
        }
        else {
          this.invalidCapchta = true
        }
      }
      else if (this.deleteForm.value.desc != '' && user_read.is_mail_verify == '') {
    
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: false }

        })
      }
      else if (this.deleteForm.value.desc == '' && user_read.is_mail_verify == '1') {
      
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "hideEmail" }
        })

      }
      else if (this.deleteForm.value.desc != '' && user_read.is_mail_verify == '0') {
        
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "selectedOption" }
        })

      }
      else {
        
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          // data: { val: false }
        });
      }
    }
    else if (user_read.login_type == "phone") {
      if (user_read.is_mail_verify == '1' && this.deleteForm.value.desc != '') {

        if (!this.deleteForm.invalid) {
         
              // this.tps.paymentQuery(formData).subscribe((res: any) => {
              //   if (res.code == 1) {
                 
              //     const dialogRef = this.dialog.open(ConsentDeleteAccountComponent, {
              //       backdropClass: 'popupBackdropClass',
              //       panelClass: 'adultAgePopup',
              //       width: "390px",
              //     });
              //     const sub = dialogRef.componentInstance.sendValueToDelete.subscribe((res: any) => {
              //       this.resultConfirmDelete = res
              //       if (this.resultConfirmDelete == true) {
              //     const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
              //       backdropClass: 'popupBackdropClass',
              //       panelClass: 'deleteSuccessfull',
              //       width: "390px",
              //       data: { message: 'false' }

              //     });
              //   }
              // });
              //   }
              //   else {
               
              //     const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
              //       backdropClass: 'popupBackdropClass',
              //       panelClass: 'deleteSuccessfull',
              //       width: "390px",
              //       data: { message: 'true' }

              //     });
              //   }
              // })
              var c=localStorage.getItem("deleteAccount")
             
              
              if(this.b==0 && c!='1'){
              if(this.dialog.openDialogs.length==0){
                const dialogRef = this.dialog.open(ConsentDeleteAccountComponent, {
                  backdropClass: 'popupBackdropClass',
                  panelClass: 'adultAgePopup',
                  width: "390px",
                  data: { message: 'fal' }
                });
                const sub = dialogRef.componentInstance.sendValueToDelete.subscribe((res: any) => {
                  this.resultConfirmDelete = res
                  if (this.resultConfirmDelete == true) {
                    this.tps.paymentQuery(formData).subscribe((res: any) => {
                      if (res.code == 1) {
                        const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
                          backdropClass: 'popupBackdropClass',
                          panelClass: 'deleteSuccessfull',
                          width: "390px",
                          data: { message: 'false' }
                        });
                       localStorage.setItem("deleteAccount","1")
                      this.b=1
                      }
                      else {
                        const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
                          backdropClass: 'popupBackdropClass',
                          panelClass: 'deleteSuccessfull',
                          width: "390px",
                          data: { message: 'true' }
                        });               
                      }
                    })
             
              }
            });
              }
             
        }else{

          const dialogRef = this.dialog.open(AcoountDeletionSuccesfullPopupComponent, {
            backdropClass: 'popupBackdropClass',
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { message: 'true' }
          });
        }
       
        } else {
          this.invalidCapchta = true
        }
      }
      else if (this.deleteForm.value.desc != '' && user_read.is_mail_verify == '') {
       
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "phoneCaseShowLinkOnly" }
        })
      }
      else if (this.deleteForm.value.desc == '' && user_read.is_mail_verify == '0') {
       
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "linkAdd" }
        })

      }
      else if (this.deleteForm.value.desc != '' && user_read.is_mail_verify == '0') {
        
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "twolinkAdd" }
        })

      }
      else {
       
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "phonecase" }
        });
      }
    }
  }
  opendpunt() {
    const dialogRef = this.dialog.open(CountryLockPopupComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'adultAgePopup',
      width: "390px",
    });
  }
}
