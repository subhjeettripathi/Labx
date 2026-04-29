import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';

import { ParentalPinCreatedSuccesComponent } from '../parental-pin-created-succes/parental-pin-created-succes.component';


@Component({
  selector: 'app-social-parental-create',
  templateUrl: './social-parental-create.component.html',
  styleUrls: ['./social-parental-create.component.scss']
})
export class SocialParentalCreateComponent implements OnInit {
  visitorId: any;
  dialog: any;
  showpass = false;
  msg: any
  showpassword = false;
  showpassword1 = false;
  basesignin: any = []
  @Output() checked3 = new EventEmitter<any>()
  @Output() socialVerifiedParental = new EventEmitter<any>()
  constructor(public dialogRef: MatDialogRef<SocialParentalCreateComponent>, private ds: DataService, private router: Router, private _fb: FormBuilder, private _FPS: FingerPrintService, private auth: AuthService) { }
  socialForm!: FormGroup
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  ngOnInit(): void {
    this.basesignin=this.popupJson.PopupList[0]
    console.log(this.basesignin);
    this.socialForm = this._fb.group({
      pass: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm: [null, Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    this._FPS.getFingerPrintDeviceId();
    this._FPS.visitorId.subscribe(r => this.visitorId = r);
  }

  //   getConfigData() {
  //     this.ds.popupJson().subscribe((res:any)=>{
  // console.log(res.PopupList[0]);
  // this.basesignin=res.PopupList[0]

  //     })}
  close() {
    this.dialogRef.close();
    this.checked3.emit(true)
  }
 
  }

