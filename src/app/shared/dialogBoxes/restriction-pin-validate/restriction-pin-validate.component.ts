import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-restriction-pin-validate',
  templateUrl: './restriction-pin-validate.component.html',
  styleUrls: ['./restriction-pin-validate.component.scss']
})
export class RestrictionPinValidateComponent implements OnInit {
  user_id: any;
  showInvalid=false
  @Output() sendLevel=new EventEmitter<any>()
  constructor(public dialogRef: MatDialogRef<RestrictionPinValidateComponent>,private ds:DataService,@Inject(MAT_DIALOG_DATA) public resp:any) { }
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  ngOnInit(): void {
    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id=data_read.id
  }
  otpInputCurrent = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: '',

    inputStyles: {
   
      'width': '55px',
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
  onOtpChange(otp: any) {
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
  close(){
   
    this.dialogRef.close();
    
  }
  submit(){
    const formData1: any = new FormData();
    formData1.append('u_id',this.user_id )
    formData1.append('pin', this.otpInputCurrent.value), 
    this.ds.parentalAuth(formData1).subscribe((res:any)=>{
      if(res.code==1){
        const formData2: any = new FormData();
        formData2.append('u_id',this.user_id )
        formData2.append('level',this.resp.res.level )
        formData2.append('title',this.resp.res.title  )
        formData2.append('pin', this.otpInputCurrent.value)
        this.ds.restrictionLevelSet(formData2).subscribe((pok:any)=>{
          if(pok.code==1){
           
            this.getSwalmsg('restrictionLevel Set Successfull', 'success');
            // localStorage.setItem("isParentalRestriction", this.resp.res.level)
            // localStorage.setItem("restrictionTitle",this.resp.res.title)
            var level = this.loginId		
            level.restriction_level = this.resp.res.level	
            localStorage.setItem('taploginInfo', JSON.stringify(level))	
            var title = this.loginId		
            title.restriction_title =this.resp.res.title		
            localStorage.setItem('taploginInfo', JSON.stringify(title))	
            this.sendLevel.emit(this.resp.res.title)
            this.dialogRef.close()

          }
          
        })
     
      }else{
       this.showInvalid=true
    
      }
    })
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
