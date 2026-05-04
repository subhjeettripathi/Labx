import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllEpisodesComponent } from './all-episodes.component';

const routes: Routes = [
  {path:'', component:AllEpisodesComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllEpisodesRoutingModule { }
