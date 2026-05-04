import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivationComponent } from '../activation/activation.component';
import { ActivationSuccessComponent } from '../@core/activation-success/activation-success.component';

@NgModule({
  declarations: [
    ActivationComponent,
    ActivationSuccessComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    ActivationComponent
  ]
})
export class ActivationModule {}
