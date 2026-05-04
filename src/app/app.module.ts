import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, APP_INITIALIZER } from '@angular/core';
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
import { GatewayloaderComponent } from './shared/gatewayservice/gatewayloader/gatewayloader.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CountryRestrictionComponent } from './shared/dialogBoxes/country-restriction/country-restriction.component';
import { ConfigService } from './services/config.service';

export function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}
@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    GatewayloaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    SocialLoginModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatDialogModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Title,
    Meta,
    DatePipe,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ReqInterceptor,
      multi: true
    },
    { provide: ErrorHandler, useClass: ErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [

          {
            id: GoogleLoginProvider.PROVIDER_ID,
            // provider: new GoogleLoginProvider('447522731426-r44vop3asks8kg5ohkoff4vg10aknmt2.apps.googleusercontent.com'),
            provider: new GoogleLoginProvider('200062459341-v1hkpqq40q3ie1g3k7g6qir8sdc79tfm.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            scope: 'public_profile,email,ads_read',
            // provider: new FacebookLoginProvider('2407604909394715')
            provider: new FacebookLoginProvider('761925523141047')

          },
        ],
        onError: (err) => {
          console.log(err);

        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    HttpCacheService
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
