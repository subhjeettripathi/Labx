import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideojsDialogComponent } from './videojs-dialog.component';

const routes: Routes = [
  {path:'', component:VideojsDialogComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideojsDialogRoutingModule { }
