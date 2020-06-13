import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotosPageRoutingModule } from './photos-page-routing.module';
import { PhotosPageComponent } from './photos-page.component';
import { ToggleModule, ImageModule } from '@kk/components';


@NgModule({
  declarations: [PhotosPageComponent],
  imports: [
    CommonModule,
    PhotosPageRoutingModule,
    ToggleModule,
    ImageModule
  ],
  exports: [PhotosPageComponent]
})
export class PhotosPageModule { }
