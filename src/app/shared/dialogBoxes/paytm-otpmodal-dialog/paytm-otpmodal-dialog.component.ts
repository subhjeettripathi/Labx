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

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PaymentCheckoutService } from "src/app/services/payment-checkout.service";
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import Swal from "sweetalert2";
import { PaymentErrorDialogComponent } from "../payment-error-dialog/payment-error-dialog.component";
declare var $: any;
import { CheckoutService } from "paytm-blink-checkout-angular";
import { Subscription } from "rxjs";
import { LoaderService } from "src/app/shared/gatewayservice/loader.service";
@Component({
  selector: "app-paytm-otpmodal-dialog",
  templateUrl: "./paytm-otpmodal-dialog.component.html",
  styleUrls: ["./paytm-otpmodal-dialog.component.scss"],
})
export class PaytmOtpmodalDialogComponent implements OnInit {
  @ViewChild("ngOtpInput", { static: false }) ngOtpInput: any;
  @Output() sendToSubscribeLogin = new EventEmitter<any>();
  isCheckoutVisible: boolean = false;
  config = {
    allowNumbersOnly: true,
    length: 6,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: "",
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
  };
  paymentErrorMessage:any;
  menuOn?: boolean;
  show: boolean = false;
  hide: boolean = true;
  otpInput = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  otpErrorMessage = "";
  mid: any;
  @Output() sendValueToPayment = new EventEmitter<any>();
  @Output() sendValueToPaytmRecurring = new EventEmitter<any>();
  subs: any = Subscription;
  clicked = false;
  USER_ACCOUNT_id:any
  constructor(
    public dialogRef: MatDialogRef<PaytmOtpmodalDialogComponent>,
    public dialog: MatDialog,
    private router: Router,
    private readonly checkoutService: CheckoutService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private checkout: PaymentCheckoutService,
    private DEC_SER: DecryptService,
    private _DS: DataService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.mid = this.data.paytmDetails;

    // this.paytmForm = this._fb.group({
    //   paytmInput: ["", Validators.required],
    // });
    // this.goToPaytmRecurringpage();
  }
    ngAfterViewInit() {
   
  const otpInputs = document.querySelectorAll('.paytm-otp');
  otpInputs.forEach((input: any) => {
    input.setAttribute('type', 'text');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('pattern', '[0-9]*');
    input.setAttribute('autocomplete', 'one-time-code');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
  });
}
  onNoClick() {
    this.dialogRef.close();
  }
  onOtpChange(otp: any) {
    if (otp.length < 6) {
      this.hide = true;
      this.show = false;
    }
  }

  onVerifyOtp() {
    if (this.otpInput.valid) {
      const formData = new FormData();
      formData.append("txn_token", this.mid.txnToken);
      formData.append("otp", this.otpInput.value);
      formData.append("order_id", this.mid.order_id);
      this.checkout.paytmOtpValidation(formData).subscribe((res) => {
        if (res.code == 1) {
          this.clicked =true;
          this.goToPaytmRecurringpage();
          // this.sendValueToPaytmRecurring.emit(4)
        } else {
          this.loaderService.hide();
          this.ngOtpInput.setValue('');
          this.hide = false;
        }
      },(err) => {
        this.loaderService.hide()
        this.ngOtpInput.setValue('');
          this.hide = false;
        
      });
    } else {
      this.show = true;
    }
  }

  goToPaytmRecurringpage() {
  
    
    this.isCheckoutVisible = true;
    this.checkoutService.init(
      //config
      {
        data: {
          orderId: this.mid.order_id,
          amount: this.mid.amount,
          token: this.mid.txnToken,
          tokenType: "TXN_TOKEN",
        },
        merchant: {
          mid: this.mid.credencial.PAYTM_MERCHANT_MID,
          name: "ALT",
          redirect: true,
          logo: "assets/svgs/altt_logo.svg",
        },
        flow: "DEFAULT",
        handler: {
          notifyMerchant: this.notifyMerchantHandler,
        },
      },
      {
        env: "PROD", // optional, possible values : STAGE, PROD; default : PROD
        openInPopup: true, // optional; default : true
      }
    );
 
    this.subs = this.checkoutService.checkoutJsInstance$.subscribe((instance) => {

    }
     
      
    );
    
  }

  notifyMerchantHandler = (eventType: any, data: any): void => {
    this.loaderService.hide()
    this.dialogRef.close();
 
    if (eventType == 'FETCH_PAYMENT_OPTIONS_ERROR') {
      this.paymentErrorMessage='Paytm is not responding... Internal server error!'
      this.paymentErrorMsg();
     
    }else{
      this.paymentErrorMessage='Your payment has been cancelled. Try again or complete the payment later.'
      this.paymentErrorMsg(); 
    }
  };
  paymentErrorMsg() {
    
    this.dialogRef.close();
    document.body.style.overflow = "hidden";
    const dialogRef = this.dialog.open(PaymentErrorDialogComponent, {
      backdropClass: "popupBackdropClass",
      panelClass: "adultAgePopup",
      width: "390px",
      data: {paytmDetails: this.paymentErrorMessage },
    });
 
    dialogRef.afterClosed().subscribe((result:any) => {
      document.body.style.overflow = "auto";
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
      
    }
  }
}
