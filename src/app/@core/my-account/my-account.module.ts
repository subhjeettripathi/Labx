import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaymentOptionComponent } from './payment-option/payment-option.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { SettingsComponent } from './settings/settings.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { MySubscriptionComponent } from './my-subscription/my-subscription.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { ActivationComponent } from 'src/app/activation/activation.component';
import { ActivationModule } from 'src/app/activation/activation.module';

@NgModule({
  declarations: [
    MyAccountComponent,
    ProfileComponent,
    PaymentOptionComponent,
    PurchaseComponent,
    SettingsComponent,
    DeleteAccountComponent,
    MySubscriptionComponent,
    CancelSubscriptionComponent
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    MatExpansionModule,
    ActivationModule,
    MatCardModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    WatchlistModule
    
  ]
})
export class MyAccountModule { }
