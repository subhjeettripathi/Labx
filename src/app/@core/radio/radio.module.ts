import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadioRoutingModule } from './radio-routing.module';
import { RadioComponent } from './radio.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslatePipe6 } from 'src/app/services/pipes/translate.pipe';

@NgModule({
  declarations: [
    RadioComponent,
    TranslatePipe6
  ],
  imports: [
    CommonModule,
    RadioRoutingModule,
    FlexLayoutModule
  ]
})
export class RadioModule { }
