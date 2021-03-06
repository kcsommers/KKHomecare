import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePageRoutingModule } from './home-page-routing.module';
import { HomePageComponent } from './home-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServicesMenuModule, TestimonialSliderModule, ContactFormModule, ModalModule } from '@kk/components';


@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    FontAwesomeModule,
    ServicesMenuModule,
    TestimonialSliderModule,
    ContactFormModule,
    ModalModule
  ],
  exports: [HomePageComponent]
})
export class HomePageModule { }
