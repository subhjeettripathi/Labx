import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDialogComponent } from 'src/app/shared/dialogBoxes/profile-dialog/profile-dialog.component';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatGridListModule} from '@angular/material/grid-list';
import { AlertDialogComponent } from 'src/app/shared/dialogBoxes/alert-dialog/alert-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import { ShowDetailRoutingModule } from './show-detail-routing.module';
import { ShowDetailComponent } from './show-detail.component';
import { VideojsDialogModule } from 'src/app/shared/videojs-dialog/videojs-dialog.module';
import { VideoLsPlayerComponent } from 'src/app/video-ls-player/video-ls-player.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ReadmoreDialogComponent } from 'src/app/shared/dialogBoxes/readmore-dialog/readmore-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TruncateWordPipe } from './truncate-word.pipe';
import { TimeDurationDetailPipe } from 'src/app/time-duration.pipe';

@NgModule({
  declarations: [
    ShowDetailComponent,
    VideoLsPlayerComponent,
    ReadmoreDialogComponent,
    TruncateWordPipe,
    TimeDurationDetailPipe
  ],
  imports: [
    CommonModule,
    ShowDetailRoutingModule,
    MatIconModule,
    MatGridListModule,
    SlickCarouselModule,
    VideojsDialogModule,
    ClipboardModule,
    MatSelectModule,
    NgSelectModule, 
    FormsModule,
    FlexLayoutModule,
  ]
})
export class ShowDetailModule { }
