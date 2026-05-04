import { Component, EventEmitter, OnInit, Output } from "@angular/core";
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
import { DataService } from "src/app/services/data.service";
import { DecryptService } from "src/app/services/decrypt.service";
import { ExchangeDataService } from "src/app/services/exchange-data.service";
import Swal from "sweetalert2";
import { DeviceDetectorService } from "ngx-device-detector";
import { FingerPrintService } from "src/app/services/finger-print.service";
import { AuthService } from "src/app/services/auth.service";
import { ForgotPasswordDialogComponent } from "../forgot-password-dialog/forgot-password-dialog.component";
@Component({
  selector: "app-verify-parental-pin",
  templateUrl: "./verify-parental-pin.component.html",
  styleUrls: ["./verify-parental-pin.component.scss"],
})
export class VerifyParentalPinComponent implements OnInit {
  user_id: any;
  validatePin: any;
  incorrectPinMsg: string | undefined;
  parentalData: any;
  ageGrp: any;
  showpass = false;
  showpassword1 = false;
  parentalId:any
  visitorId: any=localStorage.getItem('device_id')
  @Output() checked1 = new EventEmitter<any>();
  @Output() socialCl = new EventEmitter<any>();
  @Output() ghjg = new EventEmitter<any>();
  restriction: any;
  loginId = JSON.parse(localStorage.getItem("taploginInfo") || "{}");
  msg: boolean | undefined;
  basesignin: any = [];
  popupJson = JSON.parse(localStorage.getItem("popupJson") || "{}");
  constructor(
    public dialogRef: MatDialogRef<VerifyParentalPinComponent>,
    private auth: AuthService,
    private _FPS: FingerPrintService,
    private deviceService: DeviceDetectorService,
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private ed: ExchangeDataService,
    private ds: DataService,
    private dep_ser: DecryptService,
  ) {}
  otpForm!: FormGroup;
  ngOnInit(): void {
    // this.basesignin=this.popupJson?.PopupList[0]
    // console.log(this.basesignin)

    this.getConfigData();

    this.otpForm = this._fb.group({
      email: [null],
    });

    var data: any = localStorage.getItem("taploginInfo");
    var data_read = JSON.parse(data);
    this.user_id = data_read.id;
    this.getData();

  }
  otpInputCurrent = new FormControl(
    "",
    Validators.compose([Validators.required, Validators.minLength(4)])
  );
  config = {
    allowNumbersOnly: true,
    length: 4,
    // isPasswordInput: true,
    // disableAutoFocus: false,
    timer: 1,
    // placeholder: "",

    inputStyles: {
      width: "55px",
      color: "white",
      "background-color": "transparent",
      "border-top": "none",
      "border-left": "none",
      "border-right": "none",
      "border-bottom": "2px solid #AAAAAA",
      outline: "none",
      "border-radius": "0px",
    },
    inputClass: "dfg",
  };
  onOtpChange(otp: any) {}
  close() {
    this.dialogRef.close();
    this.checked1.emit(true);
    this.socialCl.emit(true);
  }
  // submit() {
  //   const formData1: any = new FormData();
  //   formData1.append('u_id', this.user_id)
  //   formData1.append('pin', this.otpInputCurrent.value),
  //     this.ds.parentalAuth(formData1).subscribe((res: any) => {
  //       if (res.code == 1) {

  //         let restriction = localStorage.getItem("isParentalRestriction")
  //         const formData: any = new FormData();
  //         formData.append('u_id', this.user_id)
  //         // formData.append('pin', this.otpInputCurrent.value),
  //           formData.append('status', 2)
  //         formData.append('device', "web")
  //         formData.append('level', restriction);
  //         this.ds.parentalControl(formData).subscribe((res: any) => {
  //           if (res.code == 1) {
  //             this.getSwalmsg('Parental Lock Disabled', 'success');
  //             this.dialogRef.close()
  //             localStorage.setItem("isParentalSet", "0")
  //             localStorage.setItem("setCase2Parental", "0")
  //             localStorage.removeItem("isParentalRestriction")
  //             this.ed.changeParentalPinEnable.next(false)
  //           }
  //         })
  //       } else {

  //         this.incorrectPinMsg = res.error
  //       }
  //     })
  // }
  get deviceDetection(): any {
    return this.deviceService.getDeviceInfo();
  }
  submitOtplogin() {
    const device_other_detail = {
      os_version: this.deviceDetection.os_version,
      app_version: "v2_1",
      network_type: "others",
      network_provider: "others",
    };
    const devicedetail = {
      make_model: this.deviceService.browser,
      os: this.deviceDetection.os,
      screen_resolution: window.innerWidth + "*" + window.innerHeight,
      push_device_token: "others",
      device_type: "web",
      platform: this.deviceDetection.deviceType,
      device_unique_id: this.visitorId,
      onesignal_device_id: "fs95345jfddf",
    };

    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    this.parentalId = USER_ACCOUNT.parental_id
    if (this.otpForm.valid) {
      const formData: any = new FormData();
      formData.append("email", this.loginId.email);
      formData.append("password", this.otpForm.value.email);
      formData.append(
        "device_other_detail",
        JSON.stringify(device_other_detail)
      );
      formData.append("devicedetail", JSON.stringify(devicedetail));
      formData.append("device", "web");
      this.auth.ottLogin(formData).subscribe((res: any) => {
        if (res.code == 1) {
          let restriction = localStorage.getItem("isParentalRestriction");
          const formData: any = new FormData();
          formData.append("u_id", this.user_id);
          formData.append("pin", "0000");
          formData.append("status", 2);
          formData.append("device", "web");
          formData.append("level", "disable");
          formData.append('parental_id', this.parentalId);
          this.ds.parentalControl(formData).subscribe((res: any) => {
            if (res.code == 1) {
              this.getSwalmsg("Parental Lock Disabled", "success");
              var hey = this.loginId;
              hey.is_parental = 2
              localStorage.setItem("taploginInfo", JSON.stringify(hey));
              this.dialogRef.close();
              this.ed.changeParentalPinEnable.next(false);
              this.ed.disableToEnableFaste.next(true);
            }
          });

          this.dialogRef.close();
        } else {
          this.msg = true;
        }
      });
    }
  }
  showPassword1(input1: any) {
    this.showpassword1 = !this.showpassword1;
    input1.type = this.showpassword1 ? "text" : "password";
  }
  forgotPassword() {
    console.log("ssssss");
  
    localStorage.setItem("loginShow", "1");
      // this.dialogRef.close();
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      panelClass: "forgotPassword",
      width: "566px",
      height: "524px",
      data: { name: this.loginId.email },
    });
  }
  getData() {
    this.ds.parentalGet().subscribe((res: any) => {
      this.dep_ser.getDecryptedData(res?.result);
      let decryptData = JSON.parse(this.dep_ser.decryptData);
      this.parentalData = decryptData;

      this.ageGrp = this.parentalData.agegp_list;
    });
  }
  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: msg,
    });
  }

  getConfigData() {
    this.ds.popupJson().subscribe((res: any) => {
      localStorage.setItem("popupJson", JSON.stringify(res));
    });
    const popup: any = localStorage.getItem("faqData");
    const dataPopup: any = JSON.parse(popup);
    // this.accoutSection = dataPopup.App[0].account[0].main_section

    const popup1: any = localStorage.getItem("allJsonPopupData");
    const dataPopup1: any = JSON.parse(popup1);
    this.basesignin = dataPopup1.PopupList[0];
    //   this.ds.faqData().subscribe((res: any) => {

    // this.accoutSection=res.App[0].account[0].main_section
    //   })
  }
}
