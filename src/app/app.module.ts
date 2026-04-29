import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReqInterceptor } from './services/interceptor/req.interceptor';
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from "ngx-spinner";
import { DatePipe } from '@angular/common';
import { HttpCacheService } from './services/cache.service';
import { CacheInterceptor } from './services/interceptor/cache.interceptor';
import { NgCacheRouteReuseModule } from 'ng-cache-route-reuse';
import { AudioPlayerModule } from './shared/audio-player/audio-player.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ContentLoaderComponent } from './content-loader/content-loader.component';
import * as firebase from 'firebase';
import { PackageStackingComponent } from './shared/dialogBoxes/package-stacking/package-stacking.component';
import { EventStatusDialogComponent } from './shared/dialogBoxes/event-status-dialog/event-status-dialog.component'
import { MatDialogModule } from '@angular/material/dialog';
import { NgOtpInputModule } from 'ng-otp-input';
import { TranslatePipe14 } from './services/pipes/translate.pipe';

// import { TranslatePipe } from './services/pipes/translate.pipe';
import { AppVersionService } from './services/app-version.service';
import { TeachersComponent } from './shared/teachers/teachers.component';

const config: SocketIoConfig = { url: 'https://aolsocket.multitvsolution.com/', options: {} };
firebase.initializeApp(environment.firebaseConfig)
export function initApp(appVersionService: AppVersionService) {
  return () => appVersionService.loadVersion();
}
@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    ContentLoaderComponent,
    PackageStackingComponent,
    EventStatusDialogComponent,
    // TranslatePipe,
    TranslatePipe14,
    TeachersComponent
  
 


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    NgOtpInputModule,
    NgCacheRouteReuseModule,
    AudioPlayerModule,

    SocketIoModule.forRoot(config)

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Title,
    Meta,
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppVersionService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ReqInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CacheInterceptor,
    //   multi: true
    // },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [

          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('1020772963820-fg7d6d5ec3424bjk52slae8l20n2r68c.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            // provider: new FacebookLoginProvider('2407604909394715')
            provider: new FacebookLoginProvider('722755254863033')

          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    // HttpCacheService
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
