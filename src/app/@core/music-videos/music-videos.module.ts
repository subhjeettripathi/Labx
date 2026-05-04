import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CarouselModule } from 'src/app/shared/carousel/carousel.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { MusicVideosRoutingModule } from './music-videos-routing.module';
import { MusicVideosComponent } from './music-videos.component';
import { ScrollDirectiveModule } from 'src/app/shared/directives/scroll-directive/scroll-directive.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  declarations: [
    MusicVideosComponent
  ],
  imports: [
    CommonModule,
    MusicVideosRoutingModule,
    MatIconModule,
    MatGridListModule,
    SlickCarouselModule,
    CarouselModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    ScrollDirectiveModule,
    InfiniteScrollModule
  ]
})
export class MusicVideosModule { }
