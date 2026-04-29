import { Injectable } from "@angular/core";
import { finalize, map } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { LoaderService } from "src/app/shared/loader.service";
import { TokenService } from "./token.service";

@Injectable()
export class ReqInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private loaderService: LoaderService,
    private tokenService: TokenService
  ) {

  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // console.log(request, 'pooku')
    if (
      request.url.includes("payment") ||
      request.url.includes("subscription/create_order/device/web") ||
      request.url.includes("subscription/onetime_create_order/device/web") ||
      request.url.includes("paytm/validate/otp")||request.url.includes("freshdesk/contactus")   
    ) {
      this.loaderService.show();
    }

    return next.handle(request).pipe(finalize(() => this.loaderService.hide()));
    if (
      !request.url.includes("access/token") &&
      !request.url.includes("api.db-ip.com") &&
      !request.url.includes("freshdesk/contactus") &&
      !request.url.includes("multitv/configration") &&
      !request.url.includes("checkoutjs/merchants") &&
      !request.url.includes("tp.multitvsolution.com/") &&
      !request.url.includes("test.payu.in/_payment") &&
      !request.url.includes("tp-staging.multitvsolution.com/") &&
      !request.url.includes("master.json") &&
      !request.url.includes("master_dev.json") &&
      !request.url.includes("master.json") &&
      !request.url.includes("api/check")
    ) {
      const token = localStorage.getItem("auth_token");

      let authorize = "Authorization";
      request = request.clone({
        setHeaders: {
          [authorize]: `${token}`,
        },
      });
    }
    return next
      .handle(request)
      .pipe(
        catchError((err) => {
          // this._ls.setLoading(false, request.url);
          return err;
        })
      )
      .pipe(
        tap((evt: any) => {
          if (evt instanceof HttpResponse) {
            // this._ls.setLoading(false, request.url);
          }
          return evt;
        })
      );
  }
}
