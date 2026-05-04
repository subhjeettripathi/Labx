import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PremiumRoutingModule } from './premium-routing.module';
import { PremiumComponent } from './premium.component';
import { CarouselModule } from 'src/app/shared/carousel/carousel.module';


@NgModule({
  declarations: [
    PremiumComponent
  ],
  imports: [
    CommonModule,
    PremiumRoutingModule,
    CarouselModule
  ]
})
export class PremiumModule { }
