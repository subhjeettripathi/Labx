import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebcastComponent } from './webcast.component';

const routes: Routes = [
  {path:'', component:WebcastComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebcastRoutingModule { }
