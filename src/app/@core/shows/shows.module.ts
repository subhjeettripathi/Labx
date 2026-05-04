import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowsRoutingModule } from './shows-routing.module';
import { ShowsComponent } from './shows.component';
import { ProfileDialogComponent } from 'src/app/shared/dialogBoxes/profile-dialog/profile-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';

import {MatGridListModule} from '@angular/material/grid-list';
import { AlertDialogComponent } from 'src/app/shared/dialogBoxes/alert-dialog/alert-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
// import { CarouselModule } from 'src/app/shared/carousel/carousel.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    ShowsComponent,
    ProfileDialogComponent,
    AlertDialogComponent
  ],
  imports: [
    CommonModule,
    ShowsRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    MatGridListModule,
    SlickCarouselModule,
    InfiniteScrollModule
  ]
})
export class ShowsModule { }
