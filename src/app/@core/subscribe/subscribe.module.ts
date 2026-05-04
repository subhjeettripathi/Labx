import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscribeRoutingModule } from './subscribe-routing.module';
import { SubscribeComponent } from './subscribe.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconRegisterModule } from 'src/app/shared/mat-icon-register/mat-icon-register.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SignupModule } from 'src/app/shared/signup/signup.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PaymentpackModule } from 'src/app/shared/paymentpack/paymentpack.module';
import { StartWatchingComponent } from 'src/app/shared/start-watching/start-watching.component';
import { PayuSuccessComponent } from './payu-success/payu-success.component';
import { PayuFailureComponent } from './payu-failure/payu-failure.component';
import { PayuCancelComponent } from './payu-cancel/payu-cancel.component';


@NgModule({
  declarations: [
    SubscribeComponent,StartWatchingComponent, PayuSuccessComponent, PayuFailureComponent, PayuCancelComponent
  ],
  imports: [
    CommonModule,
    SubscribeRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconRegisterModule,
    FlexLayoutModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    SignupModule,
    PaymentpackModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
 
  ]
})
export class SubscribeModule { }
