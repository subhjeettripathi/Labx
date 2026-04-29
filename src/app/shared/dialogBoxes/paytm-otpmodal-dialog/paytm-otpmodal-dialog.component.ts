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
import Swal from "sweetalert2";
declare var $: any;
import { CheckoutService } from "paytm-blink-checkout-angular";
import { Subscription } from "rxjs";
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
    isPasswordInput: true,
    disableAutoFocus: false,
    timer: 1,
    placeholder: "",
    inputStyles: {
      width: "46px",
      height: "46px",
    },
  };
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
  constructor(
    public dialogRef: MatDialogRef<PaytmOtpmodalDialogComponent>,
    private router: Router,
    private readonly checkoutService: CheckoutService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private checkout: PaymentCheckoutService,
    private DEC_SER: DecryptService,
    private _DS: DataService
  ) {}

  ngOnInit(): void {
    this.mid = this.data.paytmDetails;

    // this.paytmForm = this._fb.group({
    //   paytmInput: ["", Validators.required],
    // });
    // this.goToPaytmRecurringpage();
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
        if (res == "SUCCESS") {
          this.clicked =true;
          this.goToPaytmRecurringpage();
          // this.sendValueToPaytmRecurring.emit(4)
        } else {
          this.ngOtpInput.setValue('');
          this.hide = false;
        }
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
 
    this.subs = this.checkoutService.checkoutJsInstance$.subscribe((instance) =>
      console.log(instance)
      
    );
    
  }

  notifyMerchantHandler = (eventType: any, data: any): void => {
    this.dialogRef.close();
    console.log("MERCHANT NOTIFY LOG", eventType, data);
  };

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
      
    }
  }
}
