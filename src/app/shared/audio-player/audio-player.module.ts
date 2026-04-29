import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AudioPlayerRoutingModule } from './audio-player-routing.module';
import { AudioPlayerComponent } from './audio-player.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe10 } from 'src/app/services/pipes/translate.pipe';


@NgModule({
  declarations: [
    AudioPlayerComponent,
    TranslatePipe10
  ],
  imports: [
    CommonModule,
    AudioPlayerRoutingModule,
    FormsModule
  ]
})
export class AudioPlayerModule { }
