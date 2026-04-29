import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe, PaymentpackComponent } from './paymentpack.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutModule } from 'paytm-blink-checkout-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from "ngx-spinner";
import { TranslatePipe13 } from 'src/app/services/pipes/translate.pipe';
declare global {
  interface Window {
    Paytm?: any;
  }
}

@NgModule({
  declarations: [
    PaymentpackComponent,
    FilterPipe,
    TranslatePipe13
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CheckoutModule,
    NgSelectModule, 
    NgxSpinnerModule
   
  

  ],
  exports:[PaymentpackComponent]
})
export class PaymentpackModule { }
