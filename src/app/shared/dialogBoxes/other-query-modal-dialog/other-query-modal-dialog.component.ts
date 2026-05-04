import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../utilities/error.statematcher';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import { ThirdPartyIntegrationService } from 'src/app/services/third-party-integration.service';
import { QueryMsgComponent } from '../query-msg/query-msg.component';
import { Router } from '@angular/router';
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
declare var $: any;
@Component({
  selector: 'app-other-query-modal-dialog',
  templateUrl: './other-query-modal-dialog.component.html',
  styleUrls: ['./other-query-modal-dialog.component.scss'],
})
export class OtherQueryModalDialogComponent implements OnInit {
  otherQueryForm!: FormGroup;
  queryForm: any = []
  queries = [
    'Unable to view videos',
    'Buffer issues',
    'Unable to download',
    'Unable to hear audio',
    'New season Lunch',
    'Delete my Account',
    'Partnership Query',
    'Other'
  ]
  timeZoneOffset: any;
  selectedFiles: any;
  fileAttributes:any={};
  fileAttributesName: any = '';
  userInfo: any;
  queryEmail: any;
  attachment:any;
  remainingText=0;
   value:any;
   fileData:any=[];
   priority: any;
   status: any;
   errorMsg:any;
   errorAlertData:any;
  attachmentButton:boolean=true;
  fileUpload:any;
  contactNumber:any;
  subscribe:any;
  build_version:any;
  erroMsgHIdeINcode:boolean=false;
  @ViewChild('emailLoginFormDir') emailLoginFormDir!: NgForm;
  @ViewChild('imageSizeALert')
  imageSizeALert!: TemplateRef<any>;
  private imageSieConfirmationDialogRef!: MatDialogRef<TemplateRef<any>>;
  constructor(
    public dialogRef: MatDialogRef<OtherQueryModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _fb: FormBuilder,   private loaderService: LoaderService, private socialAuthService: SocialAuthService, private _auth: AuthService, private DEC_SER: DecryptService, private router: Router,private deviceService: DeviceDetectorService, private _FPS: FingerPrintService, private _DS: DataService, private _storage: StorageService, private _SWAL: SwalMsgService, private auth: AuthService, private tps: ThirdPartyIntegrationService, public dialog: MatDialog,) {
    this.timeZoneOffset = new Date();
  }

  ngOnInit(): void {
    this.getJson();
    this.otherQueryForm = this._fb.group({
      email: [null, [Validators.required, Validators.email]],
      query_type: [null, Validators.required],
      // attachment_file:['',Validators.required],
      write_a_question: [''],

    });
    this.userInfo = localStorage.getItem('taploginInfo')
    this.subscribe = localStorage.getItem('is_subscriber')
    this.queryEmail = JSON.parse(this.userInfo)?.email;
    this.errorAlertData=localStorage.getItem('errorMsg')
    this.errorMsg=JSON.parse(this.errorAlertData)

  }
  onNoClick(): void {
    // let loginData = { input: this.otherQueryForm.value.emailphone }
    this.dialogRef.close();
  }
  getJson() {
    this._DS.faqData().subscribe((data: any) => {
      this.queryForm = data.Form[0].contactus
   
      this.attachment=data.Form[0].contactus.other.attach_screenshot.no_of_attachment
      this.queryForm.payment_subscription.attach_screenshot.file_size
      this.build_version = data.Website[0].footer_menu.footer_version.version;
     
     
    })
  }


  deleteFile(i:any,) {
 
  
 this.fileData.splice(i,1)

 if(this.fileData.length==this.attachment){
  this.attachmentButton=false
}else{
  this.attachmentButton=true
}
 var a: any = document.getElementById("file")
 a.value = "";
 
//  this.selectedFiles = '';
//  this.fileAttributes ='';

  }
 
  
 
  selectFile(event: any) {
    this.selectedFiles = event.target.files
    this.fileAttributes=this.selectedFiles.item(0);
    const fileSIze=this.selectedFiles.item(0).size
    if(fileSIze<this.queryForm.other.attach_screenshot.file_size*1000000){
     this.fileData.push(this.fileAttributes)
    }else{
      this.openWatchListConfirmationDialog()
    }
   
    if(this.fileData.length==this.attachment){
      this.attachmentButton=false
    }else{
      this.attachmentButton=true
    }
    
    // for (var i = 0; i < event.target.files.length; i++) {
      
    //   this.fileUpload.push(event.target.files[i]);
    // }
  

    // this.fileAttributesName = event.target.files[0].name
  
   
    
  
    // this.fileAttributesName = this.fileAttributes.length + ' ' + 'Files Selected';
    // this.onSelect()

  }
  
  valueChange(value:any) {
    this.remainingText =value.length;
   }
  // onSelect() {
  //   if (this.selectedFiles.length > this.attachment) {
  //     // this.deleteFile()

  //     this.selectedFiles.preventDefault();
  //     this.fileAttributesName.preventDefault();

  //   }
  // }

  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  submitted:boolean=false;
  onSubmit() {
  
   
    this.submitted=true;
     this.priority = 1;
    this.status = 2;
    this.loaderService.hide()
    if (this.otherQueryForm.valid) {
    
      const formData = new FormData();
      formData.append('email', this.otherQueryForm.value.email);
      formData.append('subject', this.otherQueryForm.value.query_type);
      formData.append('priority', this.priority);
      formData.append('status', this.status);
      if(this.userInfo){
        formData.append('custom_fields[contact_no]',JSON.parse(this.userInfo).contact_no);
        
      }else{
        formData.append('custom_fields[contact_no]','');
      }
      
      if(this.otherQueryForm.value.write_a_question==undefined){
        formData.append('description','');
      }else{
        formData.append('description',this.otherQueryForm.value.write_a_question);
      }
     
      
      for (var i = 0; i < this.fileData.length; i++) {
        formData.append('attached_screen_shot[]',this.fileData[i], this.fileData[i]['name']);
      }

      formData.append("custom_fields[app_name]", "ALTT");
      formData.append("custom_fields[app_version]",this.build_version.slice(11, 33));
      if(this.userInfo && this.subscribe!=1){
        formData.append("custom_fields[account_type]", "Free");
      }else if(this.subscribe==1){
        formData.append("custom_fields[account_type]", "Subscribed");
      }else{
        formData.append("custom_fields[account_type]", "Anonymous");
      }
      formData.append("custom_fields[user_platform]", "Web");
      formData.append("custom_fields[user_timezone]", this.timeZoneOffset);
      formData.append("custom_fields[web_browser_name]", this.deviceService.browser,);
      formData.append("custom_fields[web_browser_version]", this.deviceService.browser_version);
      formData.append("custom_fields[web_browser_render_engine]", this.deviceDetection.os);
      formData.append("custom_fields[web_browser_feature_silverlight]", "false");
      formData.append("custom_fields[web_browser_language]", navigator.language);
      formData.append("custom_fields[web_browser_cookies]", "true");
      formData.append("custom_fields[input]", "1");
      formData.append("custom_fields[query_type]", "Other Query");
      formData.append("custom_fields[query_sub_type]", this.otherQueryForm.value.query_type);
      // formData.append("custom_fields[payment_gateway]",this.otherQueryForm.value.payment_type);
      // formData.append("custom_fields[other_payment_gateway]","1");
      this._DS.paymentQuery(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.dialogRef.close();
          this.gotoSuccessMsgSent();
        }else{
          this.erroMsgSHow()
          this.loaderService.hide();
        }
      },
      (err) => {
        this.loaderService.hide();
        this.erroMsgSHow()
      
      })
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
    this.erroMsgHIdeINcode=true
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
  imageSizeConfirmationclose() {
    this.imageSieConfirmationDialogRef.close();

  }

  selectCodeChange(event:any) {

   
  }
 
}