import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TimeDurationPipe } from 'src/app/time-duration.pipe';
import {TruncateWordPipe} from 'src/app/time-duration.pipe'
@NgModule({
  declarations: [
    CarouselComponent,
    TimeDurationPipe,
    TruncateWordPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    SlickCarouselModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    MatProgressBarModule,
  ],
  exports:[CarouselComponent]
})
export class CarouselModule { }
