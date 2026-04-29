import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingersComponent } from './singers.component';

const routes: Routes = [{path: '' , component: SingersComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingersRoutingModule { }
