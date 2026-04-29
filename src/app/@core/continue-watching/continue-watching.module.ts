import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContinueWatchingRoutingModule } from './continue-watching-routing.module';
import { ContinueWatchingComponent } from './continue-watching.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe2 } from 'src/app/services/pipes/translate.pipe';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    ContinueWatchingComponent,
    TranslatePipe2
  ],
  imports: [
    CommonModule,
    ContinueWatchingRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    NgxPaginationModule,


  ]
})
export class ContinueWatchingModule { }
