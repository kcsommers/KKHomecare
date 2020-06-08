import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosPageRoutingModule } from './photos-page-routing.module';
import { PhotosPageComponent } from './photos-page.component';


@NgModule({
  declarations: [PhotosPageComponent],
  imports: [
    CommonModule,
    PhotosPageRoutingModule
  ],
  exports: [PhotosPageComponent]
})
export class PhotosPageModule { }
