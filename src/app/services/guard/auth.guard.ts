import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginModalDialogComponent } from 'src/app/shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private ds: DataService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = localStorage.getItem('ott_isLoggedIn') === '1';
    const intendedUrl = state.url;

    if (isLoggedIn) return true;

    return new Observable<boolean>((observer) => {
      const observables: any = {};

      // Add API calls only for missing localStorage keys
      if (!localStorage.getItem('errorMsg')) {
        observables.errorAlert = this.ds.errorAlertConfig().pipe(catchError(() => of(null)));
      }
      if (!localStorage.getItem('popUpForm')) {
        observables.popup = this.ds.popupJson().pipe(catchError(() => of(null)));
      }
      if (!localStorage.getItem('faqData')) {
        observables.faq = this.ds.faqData().pipe(catchError(() => of(null)));
      }
      if (!localStorage.getItem('innerJson')) {
        observables.innerJson = this.ds.json2().pipe(catchError(() => of(null)));
      }

      if (!localStorage.getItem('ipSaveData')) {
        observables.ipSaveData = this.ds.apipip().pipe(catchError(() => of(null)));
      }

      // If all keys are present, open modal immediately
      if (Object.keys(observables).length === 0) {
        this.openLoginModal(intendedUrl, observer);
        return;
      }

      // Otherwise fetch missing ones
      forkJoin(observables).subscribe((results) => {
        const typedResults = results as {
          errorAlert?: any;
          popup?: any;
          faq?: any;
          innerJson?: any;
          ipSaveData?:any;
          
        };

        if (typedResults.errorAlert?.messages?.length) {
          localStorage.setItem('errorMsg', JSON.stringify(typedResults.errorAlert.messages[0]));
        }
        if (typedResults.popup?.PopupList?.length) {
          localStorage.setItem('popUpForm', JSON.stringify(typedResults.popup.PopupList[0]));
        }
        if (typedResults.faq) {
          localStorage.setItem('faqData', JSON.stringify(typedResults.faq));
        }
        if (typedResults.innerJson) {
          localStorage.setItem('innerJson', JSON.stringify(typedResults.innerJson));
        }
        if (typedResults.ipSaveData) {
          localStorage.setItem('ipSaveData', JSON.stringify(typedResults.ipSaveData));
        }

        this.openLoginModal(intendedUrl, observer);
      });
    });
  }

  private openLoginModal(intendedUrl: string, observer: any): void {
    const dialogRef = this.dialog.open(LoginModalDialogComponent, {
      backdropClass: 'popupBackdropClass',
      panelClass: 'logindialog',
      width: '420px',
      data: { name: 'login' },
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(() => {
      if (localStorage.getItem('ott_isLoggedIn') === '1') {
        this.router.navigateByUrl(intendedUrl);
      } else {
        this.router.navigate(['/']);
      }
    });

    observer.next(false); // block the route
    observer.complete();
  }
}
