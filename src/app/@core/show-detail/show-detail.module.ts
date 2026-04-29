import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { ShowDetailRoutingModule } from './show-detail-routing.module';
import { ShowDetailComponent } from './show-detail.component';
import { VideojsDialogModule } from 'src/app/shared/videojs-dialog/videojs-dialog.module';
import { VideoLsPlayerComponent } from 'src/app/video-ls-player/video-ls-player.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslatePipe7 } from 'src/app/services/pipes/translate.pipe';
@NgModule({
  declarations: [
    ShowDetailComponent,
    VideoLsPlayerComponent,
    TranslatePipe7
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
    FlexLayoutModule
  ]
})
export class ShowDetailModule { }
