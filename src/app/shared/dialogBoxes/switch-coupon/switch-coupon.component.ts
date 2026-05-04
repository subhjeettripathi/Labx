import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { DecryptService } from 'src/app/services/decrypt.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';
import { ClearWatchingConsentComponent } from '../clear-watching-consent/clear-watching-consent.component';

@Component({
  selector: 'app-switch-coupon',
  templateUrl: './switch-coupon.component.html',
  styleUrls: ['./switch-coupon.component.scss']
})
export class SwitchCouponComponent implements OnInit {
@Output() sendToFirstTab=new EventEmitter<any>()
  userId:any;
  user: any;
  country_code: any;
  discountedCouponCode: any;
  couponValue:any;
  package_id:any;
  constructor(public dialogRef: MatDialogRef<ClearWatchingConsentComponent>, private _DS: DataService,@Inject(MAT_DIALOG_DATA) public data:any, private DEC_SER: DecryptService,private fcs:FunctionCallingService) { }

  ngOnInit(): void {
    let ip: any = localStorage.getItem("ipSaveData");
    // this.ipAddress = JSON.parse(ip).countryName;
    this.country_code=JSON.parse(ip).countryCode;
   this.couponValue=this.data.package_id.interval +' '+this.data.package_id.period;
   this.package_id=this.data.package_id.package_id
   }
  close() {
    this.dialogRef.close();
    // this.checked1.emit(true)
  }
  switchPack(){
   
    this.userId = localStorage.getItem("taploginInfo");
    this.user = JSON.parse(this.userId);
    const formData = new FormData();
    formData.append("c_id", this.user.id);
    formData.append("coupon_code", this.data.redeem);
    formData.append("device", "web");
    formData.append("package_id", this.package_id);
    formData.append("country_code", this.country_code);

      this._DS.redeemCoupon(formData).subscribe((res: any) => {
        if(res.code==1){
        this.DEC_SER.getDecryptedData(res?.result);
            let decryptData = JSON.parse(this.DEC_SER.decryptData);
            this.discountedCouponCode = decryptData;
          
            this.sendToFirstTab.emit(this.discountedCouponCode.value)
            this.dialogRef.close();
        }
      })
    }
    
  removeCoupon(){
   this.fcs.removeCoupon.next(true)
    this.dialogRef.close();
  }
}
