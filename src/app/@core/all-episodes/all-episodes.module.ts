import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllEpisodesRoutingModule } from './all-episodes-routing.module';
import { AllEpisodesComponent } from './all-episodes.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AllEpisodesComponent
  ],
  imports: [
    CommonModule,
    AllEpisodesRoutingModule,
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
    NgSelectModule
  ]
})
export class AllEpisodesModule { }
