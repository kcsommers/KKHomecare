import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoUploadPageRoutingModule } from './photo-upload-page-routing.module';
import { PhotoUploadPageComponent } from './photo-upload-page.component';


@NgModule({
  declarations: [PhotoUploadPageComponent],
  imports: [
    CommonModule,
    PhotoUploadPageRoutingModule
  ],
  exports: [PhotoUploadPageComponent]
})
export class PhotoUploadPageModule { }
