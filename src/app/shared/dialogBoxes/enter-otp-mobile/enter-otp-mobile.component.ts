import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { SwalMsgService } from 'src/app/services/swal-msg.service';
import Swal from 'sweetalert2';
import { EmailVerifiedComponent } from '../email-verified/email-verified.component';
@Component({
  selector: 'app-enter-otp-mobile',
  templateUrl: './enter-otp-mobile.component.html',
  styleUrls: ['./enter-otp-mobile.component.scss']
})
export class EnterOtpMobileComponent implements OnInit {
  @Output() tick = new EventEmitter<any>()
  ottId: any;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  incorrectMsg: string | undefined;
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  timerHide = true;
  clicked = true;
  errorMsg: any;
  errorAlertData: any;
  display: any;
  global: any;
  ipCountry: any;
  ipCountryName: any;
  countryData: any;
  totalOtpCount: any;
  otpValidation: any;
  country = []
  otpExceeded = false;
  otpTime:any
  otpSecret:string;
  constructor(private _SWAL: SwalMsgService, private DEC_SER: DecryptService, private _DS: DataService,
    public dialogRef: MatDialogRef<EnterOtpMobileComponent>, private dialog: MatDialog, public es: ExchangeDataService, private ds: DataService, @Inject(MAT_DIALOG_DATA) public data: any, private fcs: FunctionCallingService) { 
      this.errorAlertData = localStorage.getItem('errorMsg')
      this.errorMsg = JSON.parse(this.errorAlertData)
     
      this.otpTime=Number(this.errorMsg.otpExpiryTime)/60
     
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
  userInfo = localStorage.getItem("taploginInfo") || {};
  otpInput = new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)]));
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: '',

    inputStyles: {
      'width': '50px',
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
  ngOnInit(): void {
    this.timer(this.otpTime);
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
    this.basesignin = this.popupJson.PopupList[0]
    this.getCountryName()

    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
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

  close() {
    this.dialogRef.close()
  }
  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.clicked = false
        this.timerHide = false
     
        clearInterval(timer);
      }
    }, 1000);
  }
  onOtpChange(otp: any) {
   
  }
  onVerifyOtp() {
  

    if (this.otpInput.valid) {
      const formData = new FormData();
      var user_id :any = localStorage.getItem('taploginInfo');
      formData.append('user_id', JSON.parse(user_id).id);
      formData.append('otp', this.otpInput.value);
      formData.append('device', "web");
      formData.append('type', "phone");

      this.ds.verifyOtp(formData).subscribe((data: any) => {
     
        if (data.code == 1) {
        
          const formData1 = new FormData();
          formData1.append('id', this.loginId.id);
          formData1.append('contact_no', this.data.number);
          formData1.append('country_code', this.data.code);
          this.ds.profile_edit(formData1).subscribe((res: any) => {
            if (res.code == 1) {
              var decrypt_data = this.DEC_SER.getDecryptedData(res.result);
              let profile_info = JSON.parse(this.DEC_SER.decryptData);
           
              // this.es.mobileLinkCode.next(profile_info.country_code)
              
              var contact_num = this.loginId
              contact_num.contact_no = this.data.number
              localStorage.setItem('taploginInfo', JSON.stringify(contact_num))
             
              this.es.mobileLinkCode.next(profile_info.country_code)
              var code_num = this.loginId
              code_num.country_code = this.data.code
              localStorage.setItem('taploginInfo', JSON.stringify(code_num))
              this.es.showPins.next(true)
              var phone_verified = this.loginId
              phone_verified.is_phone_verify = "1"
              localStorage.setItem('taploginInfo', JSON.stringify(phone_verified))
              // this.tick.emit(tMalerue)
              this.fcs.mobileUpdateValue.next(this.data.number)
              this.getSwalmsg('Your mobile Number is Verified Successfully!', 'success');
              
            }
          })
          // const dialogRef = this.dialog.open(EmailVerifiedComponent, {
          //   panelClass: 'deleteSuccessfull',
          //   width: "390px",
          // });
          this.dialogRef.close()
        } else {

          this.incorrectMsg = data.error
        }
      })
    }
    else {
      this.incorrectMsg = "Please enter otp"
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
  getCountryName() {
    this._DS.getCountryStateList().subscribe((res: any) => {
      this.country = res.country
     
      this.global = res.global_setting;
    

      if (this.global.is_custom == 1) {
        
        this.otpValidation = this.global;
      } else {
        
        this.ipCountryName = localStorage.getItem('ipSaveData');
        this.ipCountry = JSON.parse(this.ipCountryName).countryName
     

        this.countryData = this.country.find((x: { name: any; }) => x.name === this.ipCountry);
      
        this.otpValidation = this.countryData;
        
      }
    })
  }
  resendOtp() {
    this._DS.otpCountData(this.data.number).subscribe((res: any) => {
    

      this.totalOtpCount = res.result
    
      if (this.otpValidation.sms_max_hour_limit >= this.totalOtpCount.countOtp1_hour && this.otpValidation.sms_max_day_limit >= this.totalOtpCount.countOtp24_hours) {
      
        this.timerHide = true;
        this.timer(this.otpTime);
        this.clicked = true;

        const formData: any = new FormData();
        
        formData.append('value', this.data.number);
        formData.append('type', 'phone');
        formData.append('device','web');
        formData.append('payload', this.otpSecret);
        var user_id :any = localStorage.getItem('taploginInfo');
        formData.append('user_id', JSON.parse(user_id).id);
        // formData.append('user_id', this.loginId.id);
        // type: mail
        // device: web
        // payload: gaCEMTIw
        // mailto: value:satyamkushwah48 @gmail.com
        this.ds.resendOtp(formData).subscribe((res: any) => {
     
          if (res.code == 1) {
            this.timerHide = true
            this.timer(this.otpTime);
            this.clicked = true;
          }

        })
        // this.resendOtpToLogin.emit("resend");
      } else {
      
        this.clicked = true;
        this.otpExceeded = true;
      }
    });
    // const formData: any = new FormData();
    // formData.append('value', this.data.number);
    //       formData.append('type', 'mobile');
    //       formData.append('user_id', this.loginId.id);
    //       this.ds.resendOtp(formData).subscribe((res: any) => {
  
    //   if (res.code == 1) {
    //     this.timerHide = true
    //     this.timer(2)
    //     this.clicked = true;
    //   }

    // })
  }
}
