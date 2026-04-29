import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MyListRoutingModule } from './my-list-routing.module';
import { MyListComponent } from './my-list.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe12 } from 'src/app/services/pipes/translate.pipe';

@NgModule({
  declarations: [
    MyListComponent,
    TranslatePipe12
  ],
  imports: [
    CommonModule,
    MyListRoutingModule,
    FlexLayoutModule,
    FormsModule
  ]
})
export class MyListModule { }
