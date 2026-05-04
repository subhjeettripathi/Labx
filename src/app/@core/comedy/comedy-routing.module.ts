import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComedyComponent } from './comedy.component';

const routes: Routes = [
  {path:'', component:ComedyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComedyRoutingModule { }
