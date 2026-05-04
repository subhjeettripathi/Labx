import { Component, Inject, Input, OnInit, ViewChild, VERSION, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import PaymentModes from '../payment-query-modal-dialog/paymnet-query';
import { ThirdPartyIntegrationService } from 'src/app/services/third-party-integration.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { QueryMsgComponent } from '../query-msg/query-msg.component';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
import { EnterOtpComponent } from '../../enter-otp/enter-otp.component';
import { EmailLinkComponent } from '../email-link/email-link.component';
@Component({
  selector: 'app-payment-query-modal-dialog',
  templateUrl: './payment-query-modal-dialog.component.html',
  styleUrls: ['./payment-query-modal-dialog.component.scss']
})
export class PaymentQueryModalDialogComponent implements OnInit {
  name = "Angular " + VERSION.major;
  emailLoginForm!: FormGroup;
  emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
  @Input() emailOption: string = '';
  @ViewChild('emailLoginFormDir') emailLoginFormDir!: NgForm;
  queries = [
    'Amount Debited-Not Subscribed',
    'Amount Debited Multiple Times',
    'Cancel Subscription',
    'Other'
  ]
  queryForm: any = [];
  deviceInfo: any;
  isDesktopDevice: any;
  isTablet: any;
  isMobile: any;
  timeZoneOffset: any;
  selectedFiles: any;
  fileAttributes: any;
  fileAttributesName: any = '';
  paymentMode = PaymentModes;
  userInfo: any;
  attachment: any;
  erroMsgHIdeINcode: boolean = false;
  attachmentButton: boolean = true;
  remainingText = 0;
  value: any;
  priority: any;
  status: any;
  fileData: any = [];
  errorMsg: any;
  errorAlertData: any;
  emailData: any;
  contactNumber: any;
  subscribe: any;
  build_version: any;
  queryEmail: any;
  numb = 0
  idForgot: any;
  otpSecret:any
  emailTick = false
  @Input() updationMail: any;
  @Input() isTrue: any;
  @ViewChild('imageSizeALert')
  
  imageSizeALert!: TemplateRef<any>;
  private imageSieConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  constructor(public dialogRef: MatDialogRef<PaymentQueryModalDialogComponent>, private _DS: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder, private loaderService: LoaderService, private tps: ThirdPartyIntegrationService, private deviceService: DeviceDetectorService, private router: Router, public dialog: MatDialog,) {
    // this.epicFunction();
    this.timeZoneOffset = new Date();
    this.errorAlertData = localStorage.getItem('errorMsg')
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


    var gettoken = btoa(this.errorAlertData.otpExpiryTime);

    this.otpSecret = makeid(4) + gettoken
  }

  ngOnInit(): void {
    this.userInfo = localStorage.getItem('taploginInfo')
    this.subscribe = localStorage.getItem('is_subscriber')
    this.queryEmail = JSON.parse(this.userInfo)?.email;
    this.getJson()
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.emailLoginForm = this._fb.group({
      // description:['',[Validators.required]],
      query_type: [null, Validators.required],
      // payment_type: [null, Validators.required],
      // attached_screen_short: [''],
      write_a_question: ['', Validators.required],
      email: [this.emailOption, Validators.compose([Validators.required, Validators.pattern(`${this.emailPattern}`)])],

    });
    var emalid: any = localStorage.getItem('taploginInfo')
    var id = JSON.parse(emalid)
    let isEmailVerified = localStorage.getItem("emailVerified")
    let phoneVerified = localStorage.getItem("phoneVerified")
    if (isEmailVerified == '1' || id.is_mail_verify == '1') {
      this.emailTick = true
    }
  }
  getJson() {
    this._DS.faqData().subscribe((data: any) => {
      this.queryForm = data.Form[0].contactus

      this.attachment = data.Form[0].contactus.payment_subscription.attach_screenshot.no_of_attachment;
      this.build_version = data.Website[0].footer_menu.footer_version.version;

    })
  }
  onNoClick() {
    this.dialogRef.close();
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }


  deleteFile(i: any) {
    this.fileData.splice(i, 1)

    if (this.fileData.length == this.attachment) {
      this.attachmentButton = false
    } else {
      this.attachmentButton = true
    }
    var a: any = document.getElementById("file")
    a.value = "";

  }
  sumofarray: number = 0
  selectFile(event: any) {
    this.selectedFiles = event.target.files
    this.fileAttributes = this.selectedFiles.item(0);
    const fileSIze = this.selectedFiles.item(0).size
    if (fileSIze < this.queryForm.other.attach_screenshot.file_size * 1000000) {
      this.fileData.push(this.fileAttributes)
    } else {
      this.openWatchListConfirmationDialog()
    }

    if (this.fileData.length == this.attachment) {
      this.attachmentButton = false
    } else {
      this.attachmentButton = true
    }
    //   this.selectedFiles = event.target.files
    //   this.fileAttributes=this.selectedFiles.item(0);
    //   const fileSIze=this.selectedFiles.item(0).size
    //  if(fileSIze<this.queryForm.payment_subscription.attach_screenshot.file_size*1000000){
    //    this.fileData.push(this.fileAttributes)
    //   //  for (var i = 0; i < this.fileData.length - 1; i++) {

    //   //   this.sumofarray += this.fileData[i].size


    //   // }
    //   }else{
    //     this.openWatchListConfirmationDialog()
    //   }
    //  if(this.fileData.length==this.attachment){
    //     this.attachmentButton=false
    //   }else{
    //     this.attachmentButton=true
    //   }
    // for (var i = 0; i < event.target.files.length; i++) {
    //   this.fileAttributes.push(event.target.files[i]);
    //   }
    // this.fileAttributesName=this.fileAttributes.length+' '+ 'Files Selected';
    // this.onSelect() 

  }




  valueChange(value: any) {
    this.remainingText = value.length;
  }
  onSubmit() {
    this.loaderService.hide()
    if (JSON.parse(this.userInfo).email) {
      this.contactNumber = ''
      this.emailData = JSON.parse(this.userInfo).email
    } else {
      this.emailData = 'test@gmail.com'
      this.contactNumber = JSON.parse(this.userInfo).contact_no

    }
    // this.priority = 1;
    // this.status = 2;
    if (this.emailLoginForm.valid) {
      const formData = new FormData();
      formData.append('uid', JSON.parse(this.userInfo).id);
      formData.append('email', this.emailLoginForm.value.email);
      formData.append('subject', this.emailLoginForm.value.query_type);
      // formData.append('priority', this.priority);
      // formData.append('status', this.status);
      // formData.append('custom_fields[contact_no]', this.contactNumber);
      if (this.emailLoginForm.value.write_a_question == undefined) {
        formData.append('message', '');
      } else {
        formData.append('message', this.emailLoginForm.value.write_a_question);
      }
      // for (var i = 0; i < this.fileData.length; i++) {
      //   formData.append('attached_screen_shot[]',this.fileData[i], this.fileData[i]['name']);
      // }
      // formData.append("custom_fields[app_name]", "ALTT");
      // formData.append("custom_fields[app_version]",this.build_version.slice(11, 33));
      // if(this.subscribe==1){
      //   formData.append("custom_fields[account_type]", "Subscribed");
      // }else{
      //   formData.append("custom_fields[account_type]", "Free");
      // }
      // formData.append("custom_fields[user_platform]", "Web");
      // formData.append("custom_fields[user_timezone]", this.timeZoneOffset);
      // formData.append("custom_fields[web_browser_name]", this.deviceService.browser,);
      // formData.append("custom_fields[web_browser_version]", this.deviceService.browser_version);
      // formData.append("custom_fields[web_browser_render_engine]", this.deviceDetection.os);
      // formData.append("custom_fields[web_browser_feature_silverlight]", "false");
      // formData.append("custom_fields[web_browser_language]", navigator.language);
      // formData.append("custom_fields[web_browser_cookies]", "true");
      // formData.append("custom_fields[input]", "1");
      // formData.append("custom_fields[query_type]", "Payment or Subscription Query");
      // formData.append("custom_fields[query_sub_type]", this.emailLoginForm.value.query_type);
      // formData.append("custom_fields[payment_gateway]", this.emailLoginForm.value.payment_type);
      // formData.append("custom_fields[other_payment_gateway]", "1");
      this._DS.paymentQuery(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.dialogRef.close();
          this.gotoSuccessMsgSent();
        } else {
          this.erroMsgSHow()
          this.loaderService.hide();
        }
      }, (err) => {
        this.loaderService.hide();
        this.erroMsgSHow()
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops...",
        //   text: "Something went wrong!",
        // });
      }
      )
    }
  }

  gotoSuccessMsgSent() {
    this.dialogRef.close();
    this.loaderService.hide()
    const dialogRef123 = this.dialog.open(QueryMsgComponent, {
      panelClass: 'contactUsMsgSentDialog',
      width: "390px",


    });

    dialogRef123.afterClosed().subscribe((result) => {

    });
  }

  openWatchListConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';
    dialogConfig.panelClass = 'signoutConfirmation';
    dialogConfig.backdropClass = 'popupBackdropClass';
    dialogConfig.width = '420px'
    this.imageSieConfirmationDialogRef = this.dialog.open(this.imageSizeALert, dialogConfig);
    this.router.events.subscribe(() => {
      this.imageSieConfirmationDialogRef.close();
    });

  }
  erroMsgSHow(): void {
    this.erroMsgHIdeINcode = true
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';
    dialogConfig.panelClass = 'signoutConfirmation';
    dialogConfig.backdropClass = 'popupBackdropClass';
    dialogConfig.width = '420px'
    // this.imageSieConfirmationDialogRef = this.dialog.open(this.imageSizeALert, dialogConfig);
    // this.router.events.subscribe(() => {
    //   this.imageSieConfirmationDialogRef.close();
    // });

  }
  imageSizeConfirmationclose() {
    this.imageSieConfirmationDialogRef.close();

  }

  selectCodeChange(event: any) {

  }

  otpForgot() {


    if (this.numb == 0) {
      this.numb = 1
      const formData: any = new FormData();
      let emalid: any = localStorage.getItem('taploginInfo')
      // let user_id: any = localStorage.getItem('isUserId')
      let id = JSON.parse(emalid)
      if (id.email == "") {
        formData.append('value', this.updationMail);
      }
      else {
        formData.append('value', this.queryEmail);
      }
      var user_id :any = localStorage.getItem('taploginInfo');
      formData.append('user_id', JSON.parse(user_id).id);
      formData.append('device', 'web');
      formData.append('type', "mail");
      formData.append('payload', this.otpSecret);
      formData.append('mode_type','verify');
      formData.append('mode','vive');
      this._DS.forgotOtp(formData).subscribe((res: any) => {

        if (res.code == 1) {

          this.idForgot = res.result

          localStorage.setItem("otpForgotId", this.idForgot)
          const dialogRef = this.dialog.open(EnterOtpComponent, {
            panelClass: 'deleteSuccessfull',
            width: "390px",
            data: { email: this.queryEmail.email },
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

  linkEmail() {
    const dialogRef = this.dialog.open(EmailLinkComponent, {
      panelClass: 'deleteSuccessfull',
      width: "390px",
      data: { email: this.queryEmail},
    });
  }

}
