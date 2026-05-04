import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllDataComponent } from './all-data.component';

const routes: Routes = [
  {path:'', component:AllDataComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllDataRoutingModule { }
