import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AllDataRoutingModule } from './all-data-routing.module';
import { AllDataComponent } from './all-data.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollDirectiveModule } from 'src/app/shared/directives/scroll-directive/scroll-directive.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AllDataComponent,
  ],
  imports: [
    CommonModule,
    AllDataRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDialogModule,
    NgxPaginationModule,
    ScrollDirectiveModule,
    InfiniteScrollModule
   
  ]
})
export class AllDataModule { }
