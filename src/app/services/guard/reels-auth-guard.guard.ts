import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ReelsAuthGuard implements CanActivate {
  constructor(private router: Router, private dialog: MatDialog) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('ott_isLoggedIn') !== '1') {
      const dialogRef = this.dialog.open(LoginModalDialogComponent, {
        backdropClass: "popupBackdropClass",
        panelClass: "logindialog",
        width: "390px",
        data: { name: "login" },
      });

      dialogRef.afterClosed().subscribe(result => {
  
        if (localStorage.getItem('ott_isLoggedIn') === '1') {
          this.router.navigateByUrl(state.url);
        } else {
          this.router.navigate(['/']);
        }
      });

      return false; // stop navigation until login is resolved
    }
    return true;
  }
}
