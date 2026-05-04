import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ContactusModalDialogComponent } from 'src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component';
import { ExchangeDataService } from '../exchange-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isSubsInfo: any = localStorage.getItem("is_subscriber") || {};
  isSubscribed = false;
  constructor(private router: Router, public dialog: MatDialog, private ed: ExchangeDataService) {
    if (this.isSubsInfo == 1) {
      this.isSubscribed = true;
    } else {
      this.isSubscribed = false;
    }
    this.ed.isSubscribe.subscribe((value) => {
      this.isSubscribed = value;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (localStorage.getItem('ott_isLoggedIn') !== '1') {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
