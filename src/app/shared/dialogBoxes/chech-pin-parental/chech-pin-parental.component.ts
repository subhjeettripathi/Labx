import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import Swal from 'sweetalert2';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { ParentalResetPasswordPopopComponent } from '../parental-reset-password-popop/parental-reset-password-popop.component';

declare var $: any
@Component({
  selector: 'app-chech-pin-parental',
  templateUrl: './chech-pin-parental.component.html',
  styleUrls: ['./chech-pin-parental.component.scss']
})
export class ChechPinParentalComponent implements OnInit {
  user_id: any;
  validatePin: any;
  incorrectPinMsg: string | undefined;
  parentalData: any;
  popupAlertData:any;
  // ageGrp:any;
  // showRestriction:boolean | undefined
  @Output() isSuccess = new EventEmitter<any>()
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  USER_ID: any;
  show: boolean = false;
  constructor(public dialogRef: MatDialogRef<ChechPinParentalComponent>, private fcs: FunctionCallingService, private dialog: MatDialog, private ed: ExchangeDataService, private ds: DataService, private dep_ser: DecryptService, private router: Router) { }
  @ViewChildren('searchInput') searchInput: QueryList<ElementRef> | undefined;
  baseJson: any = []
  submitParetal = 0
  ngOnInit(): void {
    localStorage.setItem('videoPlay' , '1');
    // setTimeout(() => {
    //   $('#LogintypeModal').on('shown.bs.ashish',  ()=> {
    //     $('input[name="myInput"]').focus();
    //   });
    // }, 1000);


    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id
    // this.getConfigData();
    this.popupAlertData=localStorage.getItem('popUpForm')
    this.baseJson=JSON.parse(this.popupAlertData)
  }
  ngAfterViewInit() {
   
  const otpInputs = document.querySelectorAll('ng-otp-input input');
  otpInputs.forEach((input: any) => {
    // input.setAttribute('type', 'text');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]*');
    input.setAttribute('autocomplete', 'one-time-code');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
  });
}
  otpInputCurrent = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  config = {
    allowNumbersOnly: true,
    length: 4,
    //  isPasswordInput: false,
    // disableAutoFocus: false,
    timer: 1,
    inputStyles: {
      'width': '60px',
      'color': 'white',
      'background-color': 'transparent',
      'border-top': 'none',
      'border-left': 'none',
      'border-right': 'none',
      'border-bottom': '2px solid #AAAAAA',
      'outline': 'none',
      'border-radius': '0px'

    },
    
  };
  onOtpChange(otp: any) {
  
  
    if (this.submitParetal == 0) {
      if (otp.length == 4) {
      
      

        // if(this.submitParetal==0){
        this.submitParetal = 1
        const formData1: any = new FormData();
        formData1.append('u_id', this.user_id)
        formData1.append('pin', this.otpInputCurrent.value),
          this.ds.parentalAuth(formData1).subscribe((res: any) => {
            if (res.code == 1) {

              this.isSuccess.emit(true)
              this.dialogRef.close()
              localStorage.setItem('videoPlay' , '1');

            } else {
              this.submitParetal = 0
              this.show = true
              this.incorrectPinMsg = res.error

            }
          })
        // }

      } else {
        this.show = false
      }
    }

  }
  close() {
    this.dialogRef.close();
    this.fcs.sendToVideols.next(true)
    // this.checked1.emit(true)
  }
  forgotPassword() {
    //  this.dialogRef.close();

    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: 'forgotPassword',
      width: "566px",
      height: "524px",
      data: { name: this.loginId.email }
    });
  }
  submit() {
   

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
  // getData(){
  //   this.ds.parentalGet().subscribe((res:any)=>{
  //     this.dep_ser.getDecryptedData(res?.result);
  //     let decryptData = JSON.parse(this.dep_ser.decryptData);
  //     this.parentalData=decryptData;

  //     this.ageGrp = this.parentalData.agegp_list;

  //   })
  // }
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

  resetPin() {
    this.router.navigate(["/" + "account"]);
    this.dialogRef.close()
    this.ed.openSettingAccount.next(true);
     this.ed.openChangePin.next(true)
  }
}
