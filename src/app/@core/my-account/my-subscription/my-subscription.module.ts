import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MySubscriptionRoutingModule } from './my-subscription-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
// import { MySubscriptionComponent } from './my-subscription.component';
import {MatDividerModule} from '@angular/material/divider';
@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    MySubscriptionRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class MySubscriptionModule { }
