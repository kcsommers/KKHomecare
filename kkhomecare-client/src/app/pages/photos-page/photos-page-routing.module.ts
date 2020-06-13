import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhotosPageComponent } from './photos-page.component';


const routes: Routes = [
  {
    path: '',
    component: PhotosPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosPageRoutingModule { }
