import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WatchlistRoutingModule } from './watchlist-routing.module';
import { WatchlistComponent } from './watchlist.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SlickCarouselModule } from 'ngx-slick-carousel';
@NgModule({
  declarations: [
    WatchlistComponent
  ],
  imports: [
    CommonModule,
    WatchlistRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    SlickCarouselModule,
  ],
   exports: [    
    WatchlistComponent
  ]
})
export class WatchlistModule { }
