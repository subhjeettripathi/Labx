import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomepageComponent } from './homepage.component';
import { CarouselModule } from 'src/app/shared/carousel/carousel.module';
import { ShowsModule } from '../shows/shows.module';
import { ScrollDirectiveModule } from 'src/app/shared/directives/scroll-directive/scroll-directive.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    CarouselModule,
    InfiniteScrollModule,
    ScrollDirectiveModule
  ]
})
export class HomepageModule { }
