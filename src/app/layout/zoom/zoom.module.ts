import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoomRoutingModule } from './zoom-routing.module';
import { ZoomComponent } from './zoom.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe17 } from 'src/app/services/pipes/translate.pipe';


@NgModule({
  declarations: [
    ZoomComponent,
    TranslatePipe17
  ],
  imports: [
    CommonModule,
    ZoomRoutingModule,
    SlickCarouselModule,
    MatCardModule,
    MatIconModule,
  ]
})
export class ZoomModule { }
