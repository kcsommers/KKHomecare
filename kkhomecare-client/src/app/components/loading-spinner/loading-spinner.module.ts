import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [LoadingSpinnerComponent],
  imports: [
    FontAwesomeModule,
    CommonModule
  ],
  exports: [LoadingSpinnerComponent]
})
export class LoadingSpinnerModule { }
