import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveEventsComponent } from './live-events.component';

const routes: Routes = [
  {path:'', component:LiveEventsComponent}

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveEventsRoutingModule { }
