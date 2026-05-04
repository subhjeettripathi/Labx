import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FingerPrintService } from 'src/app/services/finger-print.service';
import { FunctionCallingService } from 'src/app/services/function-calling.service';

@Component({
  selector: 'app-device-restriction-popup',
  templateUrl: './device-restriction-popup.component.html',
  styleUrls: ['./device-restriction-popup.component.scss']
})
export class DeviceRestrictionPopupComponent implements OnInit {
  
  visitorId: any;
  devices: any = []
  constructor(public dialogRef: MatDialogRef<DeviceRestrictionPopupComponent>, private ds: DataService, private fcs: FunctionCallingService, private _FPS: FingerPrintService, @Inject(MAT_DIALOG_DATA) public data: any, private router:Router) { }
  baseJson: any = []
  limit: any
  ngOnInit(): void {
   this.devices = this.data.result
   console.log(this.devices,"mlkjklkn")
    this.getConfigData()
    const subs: any = localStorage.getItem("ott_subscriptionPlan");
    if (subs != null && JSON.parse(subs).packages_list.length) {
      JSON.parse(subs).packages_list.filter((res: any) => {
        if (res.package_mode == 'OTT') {
          this.limit = res.device_restriction
        }
      })

    }
  }
  close() {
        localStorage.removeItem("deviceLimit");

    this.dialogRef.close();
    this.fcs.logoutProfile.next(true)
  }
  getConfigData() {
    const popup: any = localStorage.getItem('popUpForm');
    const dataPopup: any = JSON.parse(popup);
    this.baseJson=dataPopup
  
  //   this.ds.popupJson().subscribe((res: any) => {
  //  this.baseJson=res.PopupList[0]
  //   })
  }
   clearDevices(x: any) {
    const taplogininfo: any = localStorage.getItem('taploginInfo');
    const USER_ACCOUNT: any = JSON.parse(taplogininfo);
    const formData: any = new FormData();
    formData.append('user_id', USER_ACCOUNT.id);
    if (x == 'all') {
      const visitorIds: any = localStorage.getItem('device_id')
      formData.append('type', 'all');
      formData.append('device_unique_id', visitorIds)
    } else {

      formData.append('type', '1');
      formData.append('device_unique_id', x.device_unique_id)
    }


    this.ds.logout(formData).subscribe(res => {
      if (res.code == 1) {
        localStorage.removeItem("deviceLimit");
        this.dialogRef.close()
      }
    })
  }
}
