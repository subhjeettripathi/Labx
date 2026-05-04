import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient,
} from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { DecryptService } from "../decrypt.service";
import { TokenService } from "./token.service";
import { CountryRestrictionComponent } from "src/app/shared/dialogBoxes/country-restriction/country-restriction.component";
import { MatDialog } from "@angular/material/dialog";
import { Injector } from '@angular/core';
import { ConfigService } from "../config.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isFetchingLocation = false;
  private ipFetchSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private dep_ser: DecryptService,
    public dialog: MatDialog,
    private injector: Injector,
    private configService: ConfigService,
  private http: HttpClient,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const ipApiUrl = this.configService.getIpLocationUrl();
    if (req.url === ipApiUrl) {
      return next.handle(req);
    }
    const token = this.tokenService.getToken();

    if (!this.isFetchingLocation) {
      this.isFetchingLocation = true;
      return this.http.get(this.configService.getIpLocationUrl()).pipe(
        switchMap((res: any) => {
          this.isFetchingLocation = false;

          if (res.code === 1) {
            this.dep_ser.getDecryptedData(res.result);
            const decrypted = JSON.parse(this.dep_ser.decryptData);
            localStorage.setItem("ipSaveData", JSON.stringify(decrypted));
            this.ipFetchSubject.next(decrypted);

            if (decrypted.countryCode !== "IN") {
              this.dialog.open(CountryRestrictionComponent, {
                backdropClass: "countryBackdropClass",
                panelClass: "adultAgePopup",
                width: "390px",
                disableClose: true,
              });
              return throwError(() =>
                new HttpErrorResponse({
                  status: 403,
                  statusText: "Access Forbidden: Not allowed from your country",
                  url: req.url,
                })
              );
            }
          }

          return this.handleRequestWithToken(req, token, next);
        }),
        catchError(() => {
          this.isFetchingLocation = false;
          return this.handleRequestWithToken(req, token, next);
        })
      );
    } else {
      return this.ipFetchSubject.pipe(
        filter((data) => data !== null),
        take(1),
        switchMap((decrypted) => {
          if (decrypted.countryCode !== "IN") {
            this.dialog.open(CountryRestrictionComponent, {
              backdropClass: "countryBackdropClass",
              panelClass: "adultAgePopup",
              width: "390px",
              disableClose: true,
            });
            return throwError(() =>
              new HttpErrorResponse({
                status: 403,
                statusText: "Access Forbidden: Not allowed from your country",
                url: req.url,
              })
            );
          }
          return this.handleRequestWithToken(req, token, next);
        })
      );
    }

  }

  private handleRequestWithToken(
    req: HttpRequest<any>,
    token: string | null,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;

    const excludedUrls = [
      "freshdesk/contactus",
      "get/attendees",
      "/master_prod.json",
      "access/token",
      "multitv/configration",
      "checkoutjs/merchants",
      "api/check",
      "test.payu.in/_payment",
      "/lazypay/pay",
      "/payment",
      "/paytm/validate/otp",
      ".json",
    ];

    const isExcluded = excludedUrls.some((urlPart) =>
      authReq.url.includes(urlPart)
    );

    if (token && !isExcluded) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.tokenService.removeToken();

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();
      if ((refreshToken === null) || (refreshToken === undefined)) {

        return this.tokenService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token.result);
            this.refreshTokenSubject.next(token.result);
            return next.handle(this.addTokenHeader(request, token.result));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.tokenService.removeToken();
            return throwError(() => err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set("Authorization", token),
    });
  }
}
