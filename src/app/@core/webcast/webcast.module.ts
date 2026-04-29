import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebcastRoutingModule } from './webcast-routing.module';
import { WebcastComponent } from './webcast.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe16 } from 'src/app/services/pipes/translate.pipe';

@NgModule({
  declarations: [
    WebcastComponent,
    TranslatePipe16
  ],
  imports: [
    CommonModule,
    WebcastRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    MatCardModule,
    MatIconModule,
  ]
})
export class WebcastModule { }
