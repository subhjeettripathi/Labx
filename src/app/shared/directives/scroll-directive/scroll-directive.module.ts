import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollTrackerDirective } from './scroll-tracker.directive';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ScrollTrackerDirective],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[ScrollTrackerDirective]
})
export class ScrollDirectiveModule { }
