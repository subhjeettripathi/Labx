import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComedyRoutingModule } from './comedy-routing.module';
import { ComedyComponent } from './comedy.component';
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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    ComedyComponent
  ],
  imports: [
    CommonModule,
    ComedyRoutingModule,
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
    InfiniteScrollModule
    
  ]
})
export class ComedyModule { }
