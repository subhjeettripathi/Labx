import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegisterModule } from '../shared/mat-icon-register/mat-icon-register.module';
import { FooterComponent } from './footer/footer.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe, LoginModalDialogComponent } from '../shared/dialogBoxes/login-modal-dialog/login-modal-dialog.component';
import { ContactusModalDialogComponent } from 'src/app/shared/dialogBoxes/contactus-modal-dialog/contactus-modal-dialog.component';
import { PaymentQueryModalDialogComponent } from 'src/app/shared/dialogBoxes/payment-query-modal-dialog/payment-query-modal-dialog.component';
import { OtherQueryModalDialogComponent } from 'src/app/shared/dialogBoxes/other-query-modal-dialog/other-query-modal-dialog.component';
import { EmailDialogComponent } from '../shared/dialogBoxes/email-dialog/email-dialog.component';
import { OtpDialogComponent } from '../shared/dialogBoxes/otp-dialog/otp-dialog.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { ParentalControlComponent } from '../shared/dialogBoxes/parental-control/parental-control.component';
import { UpiModalDialogComponent } from '../shared/dialogBoxes/upi-modal-dialog/upi-modal-dialog.component';
import { PaytmModelComponent } from '../shared/dialogBoxes/paytm-model/paytm-model.component';
import { PaytmOtpmodalDialogComponent } from '../shared/dialogBoxes/paytm-otpmodal-dialog/paytm-otpmodal-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyParentalPinComponent } from '../shared/dialogBoxes/verify-parental-pin/verify-parental-pin.component';
import { CheckoutModule } from 'paytm-blink-checkout-angular';
import { ChechPinParentalComponent } from '../shared/dialogBoxes/chech-pin-parental/chech-pin-parental.component';
import { EnterOtpComponent } from '../shared/enter-otp/enter-otp.component';
import { ForgotPasswordDialogComponent } from '../shared/dialogBoxes/forgot-password-dialog/forgot-password-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OtpResetPasswordComponent } from '../shared/dialogBoxes/otp-reset-password/otp-reset-password.component';
import { GeographicalInformationComponent } from '../shared/dialogBoxes/geographical-information/geographical-information.component';
import { AdultAgePopupComponent } from '../shared/dialogBoxes/adult-age-popup/adult-age-popup.component';
import { ClearWatchingConsentComponent } from '../shared/dialogBoxes/clear-watching-consent/clear-watching-consent.component';
import { WrongOtpPopupComponent } from '../shared/dialogBoxes/wrong-otp-popup/wrong-otp-popup.component';
import { ParentalResetPasswordPopopComponent } from '../shared/dialogBoxes/parental-reset-password-popop/parental-reset-password-popop.component';
import { DeleteAccountPopupComponent } from '../shared/dialogBoxes/delete-account-popup/delete-account-popup.component';
import { AcoountDeletionSuccesfullPopupComponent } from '../shared/dialogBoxes/acoount-deletion-succesfull-popup/acoount-deletion-succesfull-popup.component';
import { UserExistComponent } from '../shared/dialogBoxes/user-exist/user-exist.component';
import { CreateNewPasswordDialogComponent } from '../shared/dialogBoxes/create-new-password-dialog/create-new-password-dialog.component';
import { EmailVerifiedDialogComponent } from '../shared/dialogBoxes/email-verified-dialog/email-verified-dialog.component';
import { PasswordCreateSuccessDialogComponent } from '../shared/dialogBoxes/password-create-success-dialog/password-create-success-dialog.component';
import { PasswordStrengthComponent } from '../shared/dialogBoxes/create-new-password-dialog/password-strength/password-strength.component';
import { QueryMsgComponent } from '../shared/dialogBoxes/query-msg/query-msg.component';
import { EmailVerifiedComponent } from '../shared/dialogBoxes/email-verified/email-verified.component';
import { SubtitleSettingComponent } from '../shared/dialogBoxes/subtitle-setting/subtitle-setting.component';
import { RestrictionLevelSetComponent } from '../shared/dialogBoxes/restriction-level-set/restriction-level-set.component';
import { RestrictionPinValidateComponent } from '../shared/dialogBoxes/restriction-pin-validate/restriction-pin-validate.component';
import { VerifyParentalAlreadyRegisterComponent } from '../shared/dialogBoxes/verify-parental-already-register/verify-parental-already-register.component';
import { ConsentDeleteAccountComponent } from '../shared/dialogBoxes/consent-delete-account/consent-delete-account.component';
import { ActivationComponent } from '../activation/activation.component';
import { ParentalCreatePinCheckComponent } from '../shared/dialogBoxes/parental-create-pin-check/parental-create-pin-check.component';
import { ParentalOtpCreateComponent } from '../shared/dialogBoxes/parental-otp-create/parental-otp-create.component';
import { ParentalOtpEnableComponent } from '../shared/dialogBoxes/parental-otp-enable/parental-otp-enable.component';
import { ParentalOtpPhonePinGenerateComponent } from '../shared/dialogBoxes/parental-otp-phone-pin-generate/parental-otp-phone-pin-generate.component';
import { SocialParentalCreateComponent } from '../shared/dialogBoxes/social-parental-create/social-parental-create.component';
import { EnterOtpMobileComponent } from '../shared/dialogBoxes/enter-otp-mobile/enter-otp-mobile.component';
// import { ActivationSuccessComponent } from '../@core/activation-success/activation-success.component';
import { NotificationComponent } from '../shared/notification/notification.component';
import { MobileLinkComponent } from '../shared/dialogBoxes/mobile-link/mobile-link.component';
import { LazypayDialogMobileOtpComponent } from '../shared/dialogBoxes/lazypay-dialog-mobile-otp/lazypay-dialog-mobile-otp.component';
import { LazypayDialogMobileVerifyComponent } from '../shared/dialogBoxes/lazypay-dialog-mobile-verify/lazypay-dialog-mobile-verify.component';
import { Page404Component } from '../page404/page404.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentErrorDialogComponent } from '../shared/dialogBoxes/payment-error-dialog/payment-error-dialog.component';
import { SwitchCouponComponent } from '../shared/dialogBoxes/switch-coupon/switch-coupon.component';
import { LandingConsentAgePopupComponent } from '../shared/dialogBoxes/landing-consent-age-popup/landing-consent-age-popup.component';
import { RegionalComponent } from '../shared/dialogBoxes/regional/regional.component';
import { CountryLockPopupComponent } from '../shared/dialogBoxes/country-lock-popup/country-lock-popup.component';
import { ParentalPinCreatedSuccesComponent } from '../shared/dialogBoxes/parental-pin-created-succes/parental-pin-created-succes.component';
import { DeviceRestrictionPopupComponent } from '../shared/dialogBoxes/device-restriction-popup/device-restriction-popup.component';
import { EmailLinkComponent } from '../shared/dialogBoxes/email-link/email-link.component';
import { EmailLinkSendVerificationComponent } from '../shared/dialogBoxes/email-link-send-verification/email-link-send-verification.component';
import { RestrictionSetEmailVerifyComponent } from '../shared/dialogBoxes/restriction-set-email-verify/restriction-set-email-verify.component';
import { StatePopupComponent } from '../shared/dialogBoxes/state-popup/state-popup.component';
import { PackageStackingComponent } from '../shared/dialogBoxes/package-stacking/package-stacking.component';
// import { CancelSubscriptionComponent } from '../shared/dialogBoxes/cancel-subscription/cancel-subscription.component';
import { OffersComponent } from './offers/offers.component';
import { CancelSubscriptionSuccessComponent } from '../shared/dialogBoxes/cancel-subscription-success/cancel-subscription-success.component';
import { CancelSubscriptionAlertComponent } from '../shared/dialogBoxes/cancel-subscription-alert/cancel-subscription-alert.component';
import { LogoutPopupComponent } from '../shared/dialogBoxes/logout-popup/logout-popup.component';
import { ActivationModule } from '../activation/activation.module';


@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    FooterComponent,
    FilterPipe,
    LoginModalDialogComponent,
    EmailDialogComponent,
    OtpDialogComponent,
    ContactusModalDialogComponent,
    PaymentQueryModalDialogComponent,
    OtherQueryModalDialogComponent,
    ParentalControlComponent,
    UpiModalDialogComponent,
    PaytmModelComponent,
    PaytmOtpmodalDialogComponent,
    VerifyParentalPinComponent,
    ChechPinParentalComponent,
    EnterOtpComponent,
    ForgotPasswordDialogComponent,
    ResetPasswordComponent,
    OtpResetPasswordComponent,
    GeographicalInformationComponent,
    AdultAgePopupComponent,
    ClearWatchingConsentComponent,
    WrongOtpPopupComponent,
    ParentalResetPasswordPopopComponent,
    DeleteAccountPopupComponent,
    AcoountDeletionSuccesfullPopupComponent,
    UserExistComponent,
    CreateNewPasswordDialogComponent,
    EmailVerifiedDialogComponent,
    PasswordCreateSuccessDialogComponent,
    PasswordStrengthComponent,
    QueryMsgComponent,
    EmailVerifiedComponent,
    SubtitleSettingComponent,
    RestrictionLevelSetComponent,
    RestrictionPinValidateComponent,
    VerifyParentalAlreadyRegisterComponent,
    ConsentDeleteAccountComponent,
    // ActivationComponent,
    ParentalCreatePinCheckComponent,
    ParentalOtpCreateComponent,
    ParentalOtpEnableComponent,
    ParentalOtpPhonePinGenerateComponent,
    SocialParentalCreateComponent,
    EnterOtpMobileComponent,
    // ActivationSuccessComponent,
    NotificationComponent,
    MobileLinkComponent,
    LazypayDialogMobileOtpComponent,
    LazypayDialogMobileVerifyComponent,
    PaymentErrorDialogComponent,
    Page404Component,
    LandingConsentAgePopupComponent,
    RegionalComponent,
    CountryLockPopupComponent,
    ParentalPinCreatedSuccesComponent,
    DeviceRestrictionPopupComponent,
    EmailLinkComponent,
    EmailLinkSendVerificationComponent,
    RestrictionSetEmailVerifyComponent,
    SwitchCouponComponent,
    StatePopupComponent,
    PackageStackingComponent,
    OffersComponent,
    CancelSubscriptionSuccessComponent,
    CancelSubscriptionAlertComponent,
    LogoutPopupComponent
    // CancelSubscriptionComponent
  ],
  imports: [

    CommonModule,
    LayoutRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconRegisterModule,
    FlexLayoutModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatPseudoCheckboxModule,
    CheckoutModule,
    NgSelectModule,
    ActivationModule,

  ]
})
export class LayoutModule { }
