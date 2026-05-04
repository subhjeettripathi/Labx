import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContinueWatchingComponent } from './continue-watching.component';

const routes: Routes = [
  {path:'', component:ContinueWatchingComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContinueWatchingRoutingModule { }
