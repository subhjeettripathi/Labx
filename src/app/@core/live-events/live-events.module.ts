import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveEventsRoutingModule } from './live-events-routing.module';
import { LiveEventsComponent } from './live-events.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe3 } from 'src/app/services/pipes/translate.pipe';

@NgModule({
  declarations: [
    LiveEventsComponent,
    TranslatePipe3
  ],
  imports: [
    CommonModule,
    LiveEventsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    MatCardModule,
    MatIconModule,
  ]
})
export class LiveEventsModule { }
