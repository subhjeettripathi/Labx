import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
  Observable
} from 'rxjs';
import { TokenService } from './token.service';
import { AppVersionService } from '../app-version.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private appVersionService: AppVersionService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.tokenService.getToken();

    const shouldSkip = [
      'freshdesk/contactus',
      'bigboyget',
      'get/attendees',
      '/master_prod.json',
      'access/token',
      'multitv/configration',
      'checkoutjs/merchants',
      'api/check',
      'test.payu.in/_payment',
      '/lazypay/pay',
      '/payment',
      '/paytm/validate/otp',
      '.json'
    ].some(skipUrl => req.url.includes(skipUrl));

    // Add token if needed
    if (token && !shouldSkip) {
      authReq = this.addTokenHeader(authReq, token);
    }

    // Append version instead of timestamp to avoid caching
    if (req.url.startsWith('https')) {
      const version = this.appVersionService.getVersion();
      const url = authReq.url.includes('?')
        ? `${authReq.url}&v=${version}`
        : `${authReq.url}?v=${version}`;
      authReq = authReq.clone({ url });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes('api.db-ip.com') &&
          error.status === 401
        ) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.tokenService.removeToken();

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();

      if (!token) {
        return this.tokenService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token.result);
            this.refreshTokenSubject.next(token.result);
            return next.handle(this.addTokenHeader(request, token.result));
          }),
          catchError(err => {
            this.isRefreshing = false;
            this.tokenService.removeToken();
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token =>
        next.handle(this.addTokenHeader(request, token))
      )
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', token)
    });
  }
}
