import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllStarComponent } from './all-star.component';

const routes: Routes = [
  {path:'', component:AllStarComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllStarRoutingModule { }
