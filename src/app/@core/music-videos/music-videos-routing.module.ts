import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicVideosComponent } from './music-videos.component';

const routes: Routes = [
  {path:'', component:MusicVideosComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicVideosRoutingModule { }
