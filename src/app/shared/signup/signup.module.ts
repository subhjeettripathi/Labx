import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipes, SignupComponent } from './signup.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule, MatPseudoCheckboxModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    SignupComponent,
    FilterPipes,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatPseudoCheckboxModule,
    MatSelectModule,
    NgOtpInputModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    NgSelectModule
  ],
  exports:[SignupComponent]
})
export class SignupModule { }
