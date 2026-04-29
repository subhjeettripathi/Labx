import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingersRoutingModule } from './singers-routing.module';
import { SingersComponent } from './singers.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    SingersComponent
  ],
  imports: [
    CommonModule,
    SingersRoutingModule,
    FlexLayoutModule
  ]
})
export class SingersModule { }
