import { AfterViewInit, Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { ExchangeDataService } from 'src/app/services/exchange-data.service';
import { EnterOtpMobileComponent } from '../enter-otp-mobile/enter-otp-mobile.component';
import { UserExistComponent } from '../user-exist/user-exist.component';
declare var $: any
@Component({
  selector: 'app-mobile-link',
  templateUrl: './mobile-link.component.html',
  styleUrls: ['./mobile-link.component.scss']
})
export class MobileLinkComponent implements OnInit, AfterViewInit {
  searchText: any
  constructor(public dialogRef: MatDialogRef<MobileLinkComponent>,private auth:AuthService, private es: ExchangeDataService, private _fb: FormBuilder, private _auth: AuthService, private ds: DataService, public dialog: MatDialog,) {

  }
  loginForm!: FormGroup;
  loginId = JSON.parse(localStorage.getItem('taploginInfo') || '{}');
  msg = false;
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');
  country: any = []
  showSelect: any
  transferFeeTblCombBxRow: number = 2;
  selected1: any;
  changeSelects = true;
  dropdownTextPlaceholder: any;
  defaultVal: any;
  mobilePattern = '^((\\-?)|)?[0-9]{10}$';
  counts: any = 10;
  valMobile: any
  errorAlertData:any
  errorMsg:any
  otpSecret:any
  @ViewChild('menuContacts') menuContacts: any;
  ngOnInit(): void {

    this.defaultVal = '+91'
    this.getCountryName()
    this.basesignin = this.popupJson.PopupList[0]
    console.log(this.basesignin);
    this.loginForm = this._fb.group({
      mobile: [null, Validators.compose([Validators.required])],
      code: [null]
    });
    this.selected1 = '+91'
    this.errorAlertData = localStorage.getItem('errorMsg')
    this.errorMsg = JSON.parse(this.errorAlertData)
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
  selectNext() {
    console.log();

  }
  closeMe(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }

  triggerEvent() {
    this.searchText = ''
  }
  changeSelect(code: any) {
   
    this.changeSelects = false;
    this.selected1 = code

  }
  open(e: any) {
    console.log(e.target.value)
    let valSelect = e.target.value
    let mainVal = valSelect.split('+')
    console.log(mainVal[1])
    this.showSelect = '+' + mainVal[1]
  }

  change(newCode: any, counte: any) {
    this.counts = counte
    // this.changeSelects = false;

  }
  changeAnotherSelect(newCode: any, counte: any) {
    
    var a: any = document.getElementById("myText")
    a.value = "";
    this.counts = counte
    this.valMobile = counte
    var mobilePattern1 = `^((\\-?)|)?[0-9]{${counte}}$`;


  }
  change1(event: any) {
    this.defaultVal = event
  }
  ngAfterViewInit(): void {

  }
  onNoClick(): void {

    this.dialogRef.close();

  }
  getCountryName() {
    // this._DS.countryNames().subscribe((res: any) => {
    //   this.country = res
    //   console.log(this.country);
    // })
    this.ds.getCountryStateList().subscribe((res: any) => {
      this.country = res.country
      console.log(this.country);

    })
  }
  onSubmit() {
    
    // this.es.mobileLinkCode.next("+91")

    // if (this.changeSelects == true) {
    // // 
    //   this.loginForm.value.code = '+91'
    //   this.selected1 = '+91'
    // } else {
    //   
    //   this.loginForm.value.code
    // }
    // 
    if (this.loginForm.valid) {
      this.dialogRef.close()

      const formData = new FormData();
      formData.append('phone', this.loginForm.value.mobile);

      this._auth.OttcheckUserExisted(formData).subscribe((res: any) => {
        if (res.code == 1) {
         
          const dialogRef = this.dialog.open(UserExistComponent, {
            panelClass: 'adultAgePopup',
            width: "390px",
            // data: { msg: res.error },
          });
          this.dialogRef.close()
        } else {
         
          const formData = new FormData();
          // formData.append('value', this.loginForm.value.mobile);
          // formData.append('type', 'mobile');
          // formData.append('user_id', this.loginId.id);
          // formData.append('payload', '1');
          // formData.append('device', 'web');
          // formData.append('country_code', this.selected1);
          // console.log(this.selected1)
          // this.ds.resendOtp(formData).subscribe((res: any) => {
            formData.append('value', this.loginForm.value.mobile);;
            formData.append('type',"phone");
            formData.append('device',"web");
            formData.append('payload', this.otpSecret);
             formData.append("c_id", this.loginId.id);
            // this.auth.forgotPassword(formData).subscribe((res: any) => {
              this.auth.generateOtp(formData).subscribe((res: any) => {
                if(this.dialog.openDialogs.length==1){
                  const dialogRef = this.dialog.open(EnterOtpMobileComponent, {
                    panelClass: 'deleteSuccessfull',
                    width: "390px",
                    data: { number: this.loginForm.value.mobile, code: this.selected1 }
                  });
                }
          
            this.dialogRef.close()
            if (res.code == 1) {
              // this.idForgot = res.result
              // console.log(this.idForgot);
          
              // localStorage.setItem("otpForgotId", this.idForgot)
              // const dialogRef = this.dialog.open(EnterOtpMobileComponent, {
              //   panelClass: 'deleteSuccessfull',
              //   width: "390px",
              //   data:{number:this.loginForm.value.mobile}
              // });
              // this.dialogRef.close()
              // const sub = dialogRef.componentInstance.tick.subscribe((e: any) => {
              //   this.showMobileTick = e
              //   // this.showMobile=false
              //   // this.accountdata.contact_no.length=2
              // });
            }

          })
        }
      })
    } else {
      this.msg = true
    }
  }
}

@Pipe({
  name: 'filter',
})

export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
  }
}