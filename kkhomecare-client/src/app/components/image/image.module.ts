import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image.component';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';



@NgModule({
  declarations: [ImageComponent],
  imports: [
    CommonModule,
    LoadingSpinnerModule
  ],
  exports: [ImageComponent],
  entryComponents: [ImageComponent]
})
export class ImageModule { }
