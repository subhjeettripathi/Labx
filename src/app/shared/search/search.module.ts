import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { PopularSearchComponent } from './popular-search/popular-search.component';
import { RecentSearchComponent } from './recent-search/recent-search.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { SearchFilterComponent } from '../dialogBoxes/search-filter/search-filter.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { NgSelectModule } from "@ng-select/ng-select";
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    SearchComponent,
    PopularSearchComponent,
    RecentSearchComponent,
    SearchFilterComponent
  ],
  imports: [
   CommonModule,
    SearchRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatInputModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgSelectModule,
    MatExpansionModule

    
    
  ]
})
export class SearchModule { }
