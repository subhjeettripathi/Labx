import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  emailLoginForm!: FormGroup;
  showpassword = false;
  showpasswordSecond = false;
  confirm_password: any;
  token: any;
  invalidPassword: any;
  visitorId: any=localStorage.getItem('device_id')
  constructor(private _fb: FormBuilder, private auth: AuthService, private router: Router, private ds: DataService, private DEC_SER: DecryptService, private _FPS: FingerPrintService, private _ar: ActivatedRoute, private fcs: FunctionCallingService) { }

  loginData = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  ngOnInit(): void {
    this.emailLoginForm = this._fb.group({
      password: ["", Validators.compose([Validators.required, Validators.minLength(8)])],
      confirm_password: ["", Validators.compose([Validators.required, Validators.minLength(8)])],
    },
    );
    this._ar.queryParams.subscribe(params => {
      this.token = params['token']
      var uip = atob(this.token)
      var ddh = uip.split(";")[1]
      // var hey = this.loginData
      // hey.is_mail_verify = "1"
      // localStorage.setItem('taploginInfo', JSON.stringify(hey))

      // var emaUpdate = this.loginData
      // emaUpdate.email = ddh
      // localStorage.setItem('taploginInfo', JSON.stringify(emaUpdate))
    })

  }

  get f() {
    return this.emailLoginForm.controls;
  }
  getSwalmsg(msg: string, icon: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
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
  showPassword(input: any) {
    this.showpassword = !this.showpassword;
    input.type = this.showpassword ? 'text' : 'password';
  }

  showPasswordSecond(input2: any) {
    this.showpasswordSecond = !this.showpasswordSecond;
    input2.type = this.showpasswordSecond ? 'text' : 'password';
  }
  getdeviceInfo() {
    const formData: any = new FormData();
    formData.append('u_id',);
    this.auth.deviceInfoGet(formData).subscribe((res: any) => {
   
      this.DEC_SER.getDecryptedData(res.result);
   
    })
  }
  onSubmitEmailLogin() {
    // this.fcs.emailLinkLOginApi.next(true)
    if (this.emailLoginForm.value.password == this.emailLoginForm.value.confirm_password) {
      this.confirm_password = this.emailLoginForm.value.password

      if (this.emailLoginForm.valid) {
        const formData: any = new FormData();
        formData.append('newpassword', this.confirm_password);
        formData.append('token', this.token);
        formData.append('device_unique_id', this.visitorId);
        formData.append('device', 'web');
        this.ds.PasswordSetEmail(formData).subscribe((res: any) => {
        
          if (res.code == 1) {
            
            // var hey = this.loginData
            // hey.is_mail_verify = "1"
            // localStorage.setItem('taploginInfo', JSON.stringify(hey))
            this._ar.queryParams.subscribe(params => {
              this.token = params['token']
              var uip = atob(this.token)
              var ddh = uip.split(";")[1]
              var hey = this.loginData
              hey.is_mail_verify = "1"
              localStorage.setItem('taploginInfo', JSON.stringify(hey))
        
              var emaUpdate = this.loginData
              emaUpdate.email = ddh
              localStorage.setItem('taploginInfo', JSON.stringify(emaUpdate))
            })
            this.getSwalmsg('Email verified and password  created successfully', 'success');
            this.router.navigate(['/'])
          }
          else {
            this.getSwalmsg('Oops! password not created', 'error');
          }
        })
      }
    } else {
      this.invalidPassword = true
    }
  }
}
