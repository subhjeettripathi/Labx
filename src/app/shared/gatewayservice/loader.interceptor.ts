import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap } from "rxjs";
import { LoaderService } from '../loader.service';
import { finalize, map } from "rxjs/operators";
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private loaderService: LoaderService,
 
  ) {
    
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
   
    if (
      request.url.includes("payment") ||
      request.url.includes("subscription/create_order/device/web") ||
      request.url.includes("subscription/onetime_create_order/device/web") ||
      request.url.includes("paytm/validate/otp")||request.url.includes("freshdesk/contactus") 
    
    ) {
      this.loaderService.show();
    }

    return next.handle(request).pipe(finalize(() => 'hi'));
   
  }
}







