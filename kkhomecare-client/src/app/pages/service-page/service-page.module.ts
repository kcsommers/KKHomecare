import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicePageRoutingModule } from './service-page-routing.module';
import { ServicePageComponent } from './service-page.component';


@NgModule({
  declarations: [ServicePageComponent],
  imports: [
    CommonModule,
    ServicePageRoutingModule
  ],
  exports: [ServicePageComponent]
})
export class ServicePageModule { }
