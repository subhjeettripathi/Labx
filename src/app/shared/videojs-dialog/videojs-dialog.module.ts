import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideojsDialogRoutingModule } from './videojs-dialog-routing.module';
import { VideojsDialogComponent } from './videojs-dialog.component';
import { VideoPlayerModule } from 'src/app/video-player/video-player/video-player.module';


@NgModule({
  declarations: [
    VideojsDialogComponent,
  ],
  imports: [
    CommonModule,
    VideojsDialogRoutingModule,
    VideoPlayerModule

  ]
})
export class VideojsDialogModule { }
