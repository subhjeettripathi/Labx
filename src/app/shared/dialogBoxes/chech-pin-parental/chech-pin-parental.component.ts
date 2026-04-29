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
  popupAlertData: any;
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



    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id
    this.popupAlertData = localStorage.getItem('popUpForm')
    this.baseJson = JSON.parse(this.popupAlertData)
  }

  // otpInputCurrent = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  // config = {
  //   allowNumbersOnly: true,
  //   length: 4,
  //   isPasswordInput: true,
  //   disableAutoFocus: false,
  //   timer: 1,
  //   inputStyles: {
  //     'width': '65px',
  //     'height': '85px',
  //     'color': 'white',
  //     'border': 'none',
  //     'outline': 'none',
  //     'font-size': '40px ',
  //     'background-color': '#3D3D3D'

  //   },
  //   inputClass: "dfg"
  // };
  // onOtpChange(otp: any) {
  //   console.log(otp);
  //   // 
  //   if (this.submitParetal == 0) {
  //     if (otp.length == 4) {
  //       //  
  //       console.log("1");

  //       // if(this.submitParetal==0){
  //       this.submitParetal = 1
  //       const formData1: any = new FormData();
  //       formData1.append('u_id', this.user_id)
  //       formData1.append('pin', this.otpInputCurrent.value),
  //         this.ds.parentalAuth(formData1).subscribe((res: any) => {
  //           if (res.code == 1) {

  //             this.isSuccess.emit(true)
  //             this.dialogRef.close()

  //           } else {
  //             this.submitParetal = 0
  //             this.show = true
  //             this.incorrectPinMsg = res.error
  //           }
  //         })
  //       // }

  //     } else {
  //       this.show = false
  //     }
  //   }

  // }
  close() {
    this.dialogRef.close();
    this.fcs.sendToVideols.next(true)

  }
  // forgotPassword() {
  
  //   const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
  //     panelClass: 'forgotPassword',
  //     width: "566px",
  //     height: "524px",
  //     data: { name: this.loginId.email }
  //   });
  // }
  // submit() {

  // }

  
  // getSwalmsg(msg: string, icon: any) {
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: 'top-end',
  //     showConfirmButton: false,
  //     timer: 1000,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.addEventListener('mouseenter', Swal.stopTimer)
  //       toast.addEventListener('mouseleave', Swal.resumeTimer)
  //     }
  //   })

  //   // Toast.fire({
  //   //   icon: icon,
  //   //   title: msg
  //   // })
  // }

  // resetPin() {

  //   this.router.navigate(["/" + "account"]);
  //   this.dialogRef.close()
  //   this.ed.openSettingAccount.next(true);
  //   this.ed.openChangePin.next(true)


  // }
}
