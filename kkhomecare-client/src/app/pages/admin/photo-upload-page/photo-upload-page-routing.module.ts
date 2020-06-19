import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhotoUploadPageComponent } from './photo-upload-page.component';


const routes: Routes = [
  {
    path: '',
    component: PhotoUploadPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoUploadPageRoutingModule { }
