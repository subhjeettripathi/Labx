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
import { delay } from 'rxjs/operators';

@Injectable()
export class ReqInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private isHome4LoaderShown = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private loaderService: LoaderService,
    private tokenService: TokenService
    
  ) {
    // const token = this.tokenService.getToken();
    // if ((token === null) || (token === undefined)) {
    //   this.tokenService.refreshToken().pipe(
    //     map((token: any) => {
    
    //       this.tokenService.saveToken(token.result);
    //       this.refreshTokenSubject.next(token.result);
    //     }),
    //   );
    // }
  }

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
   
  //   if (
      
  //     request.url.includes("home4") || request.url.includes("catlist") 
      
  //   ) {
  //     this.loaderService.show();
  //   }

  //   return next.handle(request).pipe(finalize(() => this.loaderService.hide()));
  //   // if (
  //   //   !request.url.includes("access/token") &&
  //   //   !request.url.includes("api.db-ip.com") &&
  //   //   !request.url.includes("freshdesk/contactus") &&
  //   //   !request.url.includes("multitv/configration") &&
  //   //   !request.url.includes("checkoutjs/merchants") &&
  //   //   !request.url.includes("tp.multitvsolution.com/") &&
  //   //   !request.url.includes("test.payu.in/_payment") &&
  //   //   !request.url.includes("tp-staging.multitvsolution.com/") &&
  //   //   !request.url.includes("master.json") &&
  //   //   !request.url.includes("master_dev.json") &&
  //   //   !request.url.includes("master.json") &&
  //   //   !request.url.includes("api/check")
  //   // ) {
  //   //   const token = localStorage.getItem("auth_token");

  //   //   let authorize = "Authorization";
  //   //   request = request.clone({
  //   //     setHeaders: {
  //   //       [authorize]: `${token}`,
  //   //     },
  //   //   });
  //   // }
  //   // return next
  //   //   .handle(request)
  //   //   .pipe(
  //   //     catchError((err) => {
  //   //       // this._ls.setLoading(false, request.url);
  //   /var(--metalFont) !important       return err;
  //   //     })
  //   //   )
  //   //   .pipe(
  //   //     tap((evt: any) => {
  //   //       if (evt instanceof HttpResponse) {
  //   //         // this._ls.setLoading(false, request.url);
  //   //       }
  //   //       return evt;
  //   //     })
  //   //   );
  // } 
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {


    if (
      
      // request.url.includes("home4") || request.url.includes("catlist") 
      // request.url.includes("payment") ||
      request.url.includes("serial_number") ||
      request.url.includes("subscription/create_order/device/web") ||
      request.url.includes("subscription/onetime_create_order/device/web") ||
      request.url.includes("ott_subscription/v1/spackage/user_packages") ||
      request.url.includes("ott_subscription/v1/eclutch/subscription/recurring_cancel_order") || 
      request.url.includes("paytm/validate/otp")||request.url.includes("freshdesk/contactus") 
      
    ) {
      this.loaderService.show();
    }

    
    return next.handle(request).pipe(
      finalize(() => {
        setTimeout(() => {
          this.loaderService.hide();
        }, 1000);
      })
    );

    // if (request.url.includes("home4") && !this.isHome4LoaderShown) {
    //   console.log("Showing loader for:", request.url);
    //   this.loaderService.show();
    //   this.isHome4LoaderShown = true;
    // }

    // return next.handle(request).pipe(
    //   finalize(() => {
    //     if (request.url.includes("home4") && this.isHome4LoaderShown) {
    //       console.log("Hiding loader for:", request.url);
    //       this.loaderService.hide();
    //     }
    //   })
    // );
  }
  
}
