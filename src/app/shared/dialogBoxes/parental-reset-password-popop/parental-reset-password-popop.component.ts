import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { WrongOtpPopupComponent } from '../wrong-otp-popup/wrong-otp-popup.component';

@Component({
  selector: 'app-parental-reset-password-popop',
  templateUrl: './parental-reset-password-popop.component.html',
  styleUrls: ['./parental-reset-password-popop.component.scss']
})
export class ParentalResetPasswordPopopComponent implements OnInit {
  user_id: any;
  otpValue: any;
  confirmValue: any;
  final_pin: any;
  pinMatch = false
  emailId: any;
  constructor(public dialogRef: MatDialogRef<ParentalResetPasswordPopopComponent>, private ds: DataService, private dialog: MatDialog) { }
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  otpInput1 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  otpInputCurrent = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  ageGroupForm: any = FormGroup
  ageGrp: any;
  ngOnInit(): void {
    this.getData()
    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id

    this.emailId = data_read.email

    if (data_read.email == '') {
      
      this.emailId = data_read.contact_no
    }
  }
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: '',

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
  close() {

    this.dialogRef.close();

  }
  restrict(value: any) {
    // this.restriction = value;
  

  }
  getData() {
    this.ds.parentalGet().subscribe((res: any) => {
      // this.dep_ser.getDecryptedData(res?.result);
      // let decryptData = JSON.parse(this.dep_ser.decryptData);
      // this.parentalData = decryptData;
    
      // this.ageGrp = this.parentalData.agegp_list;

    })
  }

  pinCreate() {
    const formData = new FormData()
    formData.append("user_id", this.user_id)
    formData.append("otp", this.otpInputCurrent.value)
    formData.append("type", "web")
    this.ds.pinParentalVerify(formData).subscribe((res: any) => {
      if (res.code == 1) {

        this.otpValue = this.otpInput.value
        this.confirmValue = this.otpInput1.value
      

        if (this.otpValue == this.confirmValue) {
          this.final_pin = this.confirmValue;
        

        }
        else {
         
        }

        const formData1 = new FormData()

        formData1.append("u_id", this.user_id)
        formData1.append("pin", this.final_pin)
        formData1.append("device", "web")
        if (this.otpValue == this.confirmValue) {
          this.ds.pinParentalCreate(formData1).subscribe((resp: any) => {
            if (resp.code == 1) {
              this.dialogRef.close()

            }
          })
        }

        else { this.pinMatch = true }

      } else {
        const dialogRef = this.dialog.open(WrongOtpPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'logindialog',
          width: "390px",

        });
      }

    })

  }
}
