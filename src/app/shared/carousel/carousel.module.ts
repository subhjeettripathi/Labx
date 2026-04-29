import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe11 } from 'src/app/services/pipes/translate.pipe';

@NgModule({
  declarations: [
    CarouselComponent,
    TranslatePipe11
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    MatProgressBarModule
  ],
  exports:[CarouselComponent]
})
export class CarouselModule { }
