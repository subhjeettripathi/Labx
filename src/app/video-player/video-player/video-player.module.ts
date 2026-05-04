import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { VideoPlayerComponent } from '../video-player.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    VideoPlayerComponent
  ],
  imports: [
    CommonModule,
    SlickCarouselModule,
    MatIconModule,
  ],

  exports: [ 
    VideoPlayerComponent
   ]
})
export class VideoPlayerModule { }
