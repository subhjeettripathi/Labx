import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowDetailComponent } from './show-detail.component';

const routes: Routes = [
  {path:'', component:ShowDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowDetailRoutingModule { }
