import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoUploadPageRoutingModule } from './photo-upload-page-routing.module';
import { PhotoUploadPageComponent } from './photo-upload-page.component';
import { LoadingSpinnerModule } from '@kk/components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [PhotoUploadPageComponent],
  imports: [
    CommonModule,
    PhotoUploadPageRoutingModule,
    LoadingSpinnerModule,
    FontAwesomeModule
  ],
  exports: [PhotoUploadPageComponent]
})
export class PhotoUploadPageModule { }
