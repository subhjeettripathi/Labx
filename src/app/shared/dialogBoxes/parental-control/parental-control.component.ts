import { Component, Inject, OnInit, QueryList, ViewChildren, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecryptService } from "src/app/services/decrypt.service";
import Swal from 'sweetalert2';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { AcoountDeletionSuccesfullPopupComponent } from '../acoount-deletion-succesfull-popup/acoount-deletion-succesfull-popup.component';
import { ParentalCreatePinCheckComponent } from '../parental-create-pin-check/parental-create-pin-check.component';
import { ParentalOtpPhonePinGenerateComponent } from '../parental-otp-phone-pin-generate/parental-otp-phone-pin-generate.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { ParentalPinCreatedSuccesComponent } from '../parental-pin-created-succes/parental-pin-created-succes.component';
import { SocialParentalCreateComponent } from '../social-parental-create/social-parental-create.component';
declare var $: any
@Component({
  selector: 'app-parental-control',
  templateUrl: './parental-control.component.html',
  styleUrls: ['./parental-control.component.scss']
})
export class ParentalControlComponent implements OnInit {
  inputs!: QueryList<any>;
  parentalForm!: FormGroup;
  profileForm!: FormGroup;
  user_id: any;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  visitorId: any;
  basesignin: any = [];
  @ViewChild("feedbackFormDir") feedbackFormDir!: NgForm;
  constructor(public dialogRef: MatDialogRef<ParentalControlComponent>, private _auth: AuthService, private deviceService: DeviceDetectorService,
    private _fb: FormBuilder, private ds: DataService, private dep_ser: DecryptService, private eds: ExchangeDataService, private fcs: FunctionCallingService, private dialog: MatDialog, private fs: FunctionCallingService, private _FPS: FingerPrintService) {
  }

  ngOnInit(): void {
    this.getConfigData()
    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    this.user_id = data_read.id
    console.log(data_read);
    this.profileForm = this._fb.group({
      name: [''],
      email: [''],
      phone: [''],
      description: ['', Validators.required],
    });


    this.profileForm.patchValue({
      name: data_read.full_name,
      email: data_read.email,
      phone: data_read.contact_no,
    })
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
  }
  onSubmitfeedback() {
    const formData: any = new FormData();
    formData.append("name", this.profileForm.value.name);
    formData.append("email", this.profileForm.value.email);
    formData.append("phone", this.profileForm.value.phone);
    formData.append("message", this.profileForm.value.description);
    if (this.profileForm.valid) {
      this.ds.submitFeedback(formData).subscribe((res: any) => {
        if (res.code == 1) {
          this.getSwalmsg('Feedback submitted successfully', 'success');
          this.dialogRef.close();
        }
      });

    }
   
  }
  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.basesignin = dataPopup.PopupList[0]
    console.log(dataPopup.PopupList[0])
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













  close() {
    this.dialogRef.close();
  }

}
