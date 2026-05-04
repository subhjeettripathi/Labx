import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { json } from 'express';
import { DataService } from 'src/app/services/data.service';
import { CancelSubscriptionAlertComponent } from 'src/app/shared/dialogBoxes/cancel-subscription-alert/cancel-subscription-alert.component';
import { CancelSubscriptionSuccessComponent } from 'src/app/shared/dialogBoxes/cancel-subscription-success/cancel-subscription-success.component';
import { DeleteAccountPopupComponent } from 'src/app/shared/dialogBoxes/delete-account-popup/delete-account-popup.component';
@Component({
  selector: 'app-cancel-subscription',
  templateUrl: './cancel-subscription.component.html',
  styleUrls: ['./cancel-subscription.component.scss']
})
export class CancelSubscriptionComponent implements OnInit {
  baseLine: any;



  constructor(public dialogRef: MatDialogRef<CancelSubscriptionComponent>, private ds: DataService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getConfigData()
  }

  getConfigData() {
    const popup: any = localStorage.getItem('allJsonPopupData');
    const dataPopup: any = JSON.parse(popup);
    this.baseLine = dataPopup.PopupList[0].subscription_cancel_alert


    // this.ds.popupJson().subscribe((res: any) => {

    //  this.baseLine=res.PopupList[0]
    // })
  }


  close() {
    this.dialogRef.close();
  }

  cancelSubscription() {
    const userInfo: any = localStorage.getItem('taploginInfo') || {};
    const packages: any = localStorage.getItem("ott_subscriptionPlan");
    // const packages_list :any = JSON.parse(packages)

    // this.loaderService.hide()
    const formData = new FormData();
    formData.append('subscriber_id', JSON.parse(userInfo).id)
    // formData.append('email', JSON.parse(userInfo).email);
    formData.append('package_id',  JSON.parse(packages).packages_list[0].package_id);
    formData.append('order_id',JSON.parse(packages).packages_list[0].order_id);
      formData.append('subscription_id',JSON.parse(packages).packages_list[0].subscription_id);
    var data: any = localStorage.getItem('taploginInfo')
    var data_read = JSON.parse(data)
    // formData.append('uid', data_read.id);
    let user: any = localStorage.getItem('taploginInfo')
    let user_read = JSON.parse(user)
    let isVerified = localStorage.getItem('emailVerified')
    
    if (user_read.login_type == "email" || user_read.login_type == "social") {

      // if ((user_read.is_mail_verify == '1' || isVerified == '1' || this.loginTypePhone == 'phone') && (this.deleteForm.value.desc == '')) {
      if (user_read.is_mail_verify == '1') {
        this.ds.cancelSubscription(formData).subscribe((res: any) => {
          const cancel =  localStorage.setItem('cancelKey', res.code);
          if (res.code == 1) {
            // this.loaderService.hide()
            const dialogRef = this.dialog.open(CancelSubscriptionSuccessComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'deleteSuccessfull',
              width: "390px",
              disableClose:true,
              // data: { message: 'false' }
            });

         

            this.dialogRef.close();
            dialogRef.afterClosed().subscribe((result: any) => {
              const cancel =  localStorage.setItem('cancelKey', '1')
       
             });

          } else {
       
            const dialogRef = this.dialog.open(CancelSubscriptionAlertComponent, {
              backdropClass: 'popupBackdropClass',
              panelClass: 'deleteSuccessfull',
              width: "390px",
              disableClose:true,
              // data: { message: 'false' }
            });

            this.dialogRef.close();
          
            // dialogRef.afterClosed().subscribe((result: any) => {
            //   const cancel =  localStorage.setItem('cancelKey',res.code)
            //  });
          }
        })
      } else if(user_read.is_mail_verify == 0 ){
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "selectedOption" }
        })
      }else{
        const dialogRef = this.dialog.open(DeleteAccountPopupComponent, {
          backdropClass: 'popupBackdropClass',
          panelClass: 'adultAgePopup',
          width: "390px",
          data: { val: "selectedOption" }
        })
      }
    }
  }

}


