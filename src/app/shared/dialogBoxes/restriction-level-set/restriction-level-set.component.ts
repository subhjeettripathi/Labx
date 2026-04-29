import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { ParentalOtpPhonePinGenerateComponent } from '../parental-otp-phone-pin-generate/parental-otp-phone-pin-generate.component';
import Swal from 'sweetalert2';
import { RestrictionPinValidateComponent } from '../restriction-pin-validate/restriction-pin-validate.component';
import { RestrictionSetEmailVerifyComponent } from '../restriction-set-email-verify/restriction-set-email-verify.component';
import { VerifyParentalPinComponent } from '../verify-parental-pin/verify-parental-pin.component';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
declare var $:any
@Component({
  selector: 'app-restriction-level-set',
  templateUrl: './restriction-level-set.component.html',
  styleUrls: ['./restriction-level-set.component.scss']
})
export class RestrictionLevelSetComponent implements OnInit {
  parentalData: any;
  ageGrp: any;
  profileForm!: FormGroup;
  gendertitle: any;
  is_Info: any;
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  @Output() senIsInfotoShow = new EventEmitter<any>()
  visitorId: any;
  @Output() sendLevel=new EventEmitter<any>()
  user_id: any;
  restric:any;
  arrays:any=[];
  fValue = 'No Restriction';
  checked:any;
  default=16
  constructor(public dialogRef: MatDialogRef<RestrictionLevelSetComponent>,private ed:ExchangeDataService, private ds: DataService, private DEC_SER: DecryptService, private dialog: MatDialog,private _auth:AuthService, private fb: FormBuilder ,private deviceService: DeviceDetectorService ,private _FPS: FingerPrintService) {

   }

  ngOnInit(): void {
  
    
this.checked=true
  //  this.restric="No Restriction"
    this.basesignin = this.popupJson.PopupList[0]
    console.log(this.basesignin);
    this.getData()
    this.profileForm = this.fb.group({
      gender: ['', Validators.required]
    });
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    this.profileForm.patchValue({
      gender: String(USER_ACCOUNT.restriction_level) 
    });
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
   
  
  }

  close() {

    this.dialogRef.close();

  }
  getData() {
    this.ds.parentalGet().subscribe((res: any) => {
      this.DEC_SER.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.DEC_SER.decryptData);
      this.parentalData = decryptData;
      console.log(this.parentalData.agegp_list);
      this.ageGrp = this.parentalData.agegp_list;

    
    })
  }
  restrict(value: any) {
  
  
  }
  title(tit: any) {
    
    this.gendertitle = tit
  }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo()
  }
  updateRestrict() {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    if (this.profileForm.valid) {
      const dataObj = {
        level: this.profileForm.value.gender,
        title: this.gendertitle
      }
      // const dialogRef = this.dialog.open(RestrictionPinValidateComponent, {
      //   panelClass: 'contactfooter',
      //   width: "390px",
      //   data:{res:dataObj}
      // });
      // const sub = dialogRef.componentInstance.sendLevel.subscribe((dat: any) => {
      //   this.senIsInfotoShow.emit(dat)
      // });
      if(USER_ACCOUNT.login_type =="email" || USER_ACCOUNT.login_type =="social"){
        const dialogRef = this.dialog.open(RestrictionSetEmailVerifyComponent, {
          panelClass: 'contactfooter',
          backdropClass: 'popupBackdropClass',
          width: "390px",
          data: { res: dataObj }
        });
        const sub = dialogRef.componentInstance.sendLevel.subscribe((dat: any) => {
          this.senIsInfotoShow.emit(dat)
        });
        this.dialogRef.close()
      }
      else if(USER_ACCOUNT.login_type =="phone"){
        var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id
        var getPhoneNumber = this.loginId.contact_no
        const formData = new FormData();
    
        formData.append('phone', getPhoneNumber);
        formData.append('type', 'phone');
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
        formData.append('device', 'web');
        formData.append('dd', JSON.stringify(devicedetail));
        this._auth.ottOtpLogin(formData).subscribe((res: any) => {
          if (res.code == 1) {
            const dialogRef = this.dialog.open(ParentalOtpPhonePinGenerateComponent, {
              panelClass: 'contactfooter',
              width: "390px",
              disableClose: true
            });
            this.dialogRef.close()
            const sub = dialogRef.componentInstance.restrictionLevelSet.subscribe((verify: any) => {
              var isParentalSubmit = verify
              if (isParentalSubmit == true) {

                const formData2: any = new FormData();  
                formData2.append('u_id',this.user_id )
                formData2.append('level',this.profileForm.value.gender )
                formData2.append('title',this.gendertitle  )
                // formData2.append('pin', this.otpInputCurrent.value)
                this.ds.restrictionLevelSet(formData2).subscribe((pok:any)=>{
                  if(pok.code==1){
                  this.getSwalmsg('restrictionLevel Set Successfull', 'success');
                  // sessionStorage.setItem("isParentalRestriction", this.resp.res.level)
                  // sessionStorage.setItem("restrictionTitle",this.resp.res.title)
                  var level = this.loginId		
                  level.restriction_level = this.profileForm.value.gender
                  localStorage.setItem('taploginInfo', JSON.stringify(level))	
                  var title = this.loginId		
                  title.restriction_title =this.gendertitle		
                  localStorage.setItem('taploginInfo', JSON.stringify(title))	
                  //  this.sendLevel.emit(this.gendertitle)
                  this.senIsInfotoShow.emit(this.gendertitle)
                  this.dialogRef.close()
                  }
                })
               
              }
            })
            // const sub = dialogRef.componentInstance.phoneVerifiedParental.subscribe((verify: any) => {
            //   var isParentalSubmit = verify
            //   if (isParentalSubmit == true) {
            //     const dialogRef = this.dialog.open(ParentalControlComponent, {
            //       panelClass: 'contactfooter',
            //       width: "390px",
            //       data: { email: 'login' },
            //     });
            //   }
            // })
          }
        })
      }
     
    }
    else {

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
}
