import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialSliderComponent } from './testimonial-slider.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [TestimonialSliderComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [TestimonialSliderComponent]
})
export class TestimonialSliderModule { }
