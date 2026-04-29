import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { TranslatePipe9 } from 'src/app/services/pipes/translate.pipe';


@NgModule({
  declarations: [FaqComponent,
    TranslatePipe9
  ],
  imports: [
    CommonModule,
    FaqRoutingModule
  ]
})
export class FaqModule { }
