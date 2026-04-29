import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ClearWatchingConsentComponent } from '../clear-watching-consent/clear-watching-consent.component';
import { AuthService } from 'src/app/services/auth.service';
import { EnterOtpMobileComponent } from '../enter-otp-mobile/enter-otp-mobile.component';

@Component({
  selector: 'app-consent-delete-account',
  templateUrl: './consent-delete-account.component.html',
  styleUrls: ['./consent-delete-account.component.scss']
})
export class ConsentDeleteAccountComponent implements OnInit {
  @Output() sendValueToDelete = new EventEmitter<any>()
  abc: any
  otpTime: any
  otpSecret: any
  errorAlertData: any;
  errorMsg: any;
  type: any
  constructor(public dialogRef: MatDialogRef<ConsentDeleteAccountComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private auth: AuthService ,  private dialog: MatDialog,) { }
  basesignin: any = []
  popupJson = JSON.parse(localStorage.getItem('popupJson') || '{}');

  ngOnInit(): void {

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
    this.otpTime = Number(this.errorMsg.otpExpiryTime) / 60
    this.basesignin = this.popupJson.PopupList[0]
      console.log(this.basesignin,"aaaaaaaa");
    
  }

  close() {
    this.dialogRef.close();
  }
  yes() {
    let ott_userid: any = localStorage.getItem("ott_otp_userid");
    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    const formData: any = new FormData();
      formData.append('value', JSON.parse(userInfo).email);
    formData.append('mode', this.data.data);
      formData.append('type', 'mail');
    formData.append('device', "web");
    formData.append('payload', this.otpSecret);
    formData.append("c_id", JSON.parse(userInfo).id);
    this.auth.generateOtp(formData).subscribe((res: any) => {
      console.log(res);
      if (res.code == 1) {
        this.dialogRef.close()
        setTimeout(() => {
          if(this.dialog.openDialogs.length==0){
            const dialogRef = this.dialog.open(EnterOtpMobileComponent, {
              panelClass: 'deleteSuccessfull',
              width: "390px",
              data: { data: this.data.data}
            });
          }
        }, 100);
      
     
      }
    })
    
  }
}
