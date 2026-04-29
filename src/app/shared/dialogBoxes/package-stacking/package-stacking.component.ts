import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-package-stacking',
  templateUrl: './package-stacking.component.html',
  styleUrls: ['./package-stacking.component.scss']
})
export class PackageStackingComponent implements OnInit {
  targetData: any;
  npawType: any
  constructor(private router: Router, public dialogRef: MatDialogRef<PackageStackingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem('pkgData') == null) {
        window.location.reload()
      }
    });
  }

  ngOnInit(): void {
    this.targetData = this.data.name;
  }

  gotoPaymentPage(level: any, pkdId: any, discount: any, coupon_code: any, month: any, currency: any) {
    this.dialogRef.close();
    if (this.router.url == "/subscribe") {
      window.location.reload()
    }
    localStorage.setItem('packcheking', '1')
    this.router.navigate(['/subscribe']);
    let pkgData = {
      'level': level || '',
      'pkdId': pkdId || '',
      'discount': discount || '',
      'coupon_code': coupon_code || '',
      'month': month || '',
      'currency': currency || '',
    };
    localStorage.setItem('pkgData', JSON.stringify(pkgData))
  }

}
