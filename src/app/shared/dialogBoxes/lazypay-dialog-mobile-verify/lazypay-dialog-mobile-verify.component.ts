import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PaymentCheckoutService } from "src/app/services/payment-checkout.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";

@Component({
  selector: "app-lazypay-dialog-mobile-verify",
  templateUrl: "./lazypay-dialog-mobile-verify.component.html",
  styleUrls: ["./lazypay-dialog-mobile-verify.component.scss"],
})
export class LazypayDialogMobileVerifyComponent implements OnInit {
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  show: boolean = false;
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: "",
    inputStyles: {
      width: "46px",
      height: "46px",
    },
  };
  lazypayData: any;
  menuOn?: boolean;
  uid: any;
  Uid: any;
  clicked = true;
  visitorId: any;
  timerHide = true;
  display: any;
  hide:boolean=true;
  @Output() sendValueToLazypay = new EventEmitter<any>();
  otpInput = new FormControl(
    null,
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  otpErrorMessage = "";
  mid: any;
  constructor(
    public dialogRef: MatDialogRef<LazypayDialogMobileVerifyComponent>,
    private router: Router,
    private ed: ExchangeDataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private checkout: PaymentCheckoutService,
    private DEC_SER: DecryptService,
    private _DS: DataService
  ) {
    this.timer(2);
  }

  ngOnInit(): void {
    this.lazypayData = this.data.name;
  }
  onNoClick() {
    this.dialogRef.close();
  }
  onOtpChange(otp: any) {
   if(otp.length<4){
    this.hide =true;
    this.show=false
   }
  }
    ngAfterViewInit() {
   
  const otpInputs = document.querySelectorAll('.lazypay-dialog-mobile');
  otpInputs.forEach((input: any) => {
    input.setAttribute('type', 'text');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]*');
    input.setAttribute('autocomplete', 'one-time-code');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
  });
}
  onVerifyOtp() {
    if (this.otpInput.valid) {
      const formData = new FormData();
      formData.append("txnRefNo", this.lazypayData.initiate.txnRefNo);
      formData.append("otp", this.otpInput.value);
      formData.append("c_id", this.lazypayData.c_id);
      this.checkout.lazypayOtpValidation(formData).subscribe((res) => {
        if (res.code == 1) {
          this.sendValueToLazypay.emit(4);
          this.dialogRef.close();
          this.uid = localStorage.getItem("taploginInfo");
          // this.Uid=this.uid.id
          this.Uid = JSON.parse(this.uid).id;

          this._DS.getUserSubscriptionDetails(this.Uid).subscribe((res) => {
            this.DEC_SER.getDecryptedData(res.result);
            const data: any = JSON.parse(this.DEC_SER.decryptData);
           
            if (data.is_subscriber == 1) {
              localStorage.setItem("is_subscriber", "1");
              this.ed.isSubscribe.next(true);
              this.ed.parentalLock.next(false);
            
            }
          });
        } else {
          this.ngOtpInput.setValue('');
          this.hide =false;
         
        }
      });
    } else {
      this.show = true;
    }
  }
  resendOtp() {
    this.timerHide = true;
    this.timer(2);
    this.clicked = true;
   
      const formData = new FormData();
      formData.append("txnRefNo", this.lazypayData.initiate.txnRefNo);
   
      this.checkout.lazypayResendOtp(formData).subscribe((res) => {
        if (res.status == 1) {
         

         
        } else {
          this.otpErrorMessage = res.result;
        }
      });
     
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
        this.clicked = false;
        this.timerHide = false;
       clearInterval(timer);
      }
    }, 1000);
  }
}
