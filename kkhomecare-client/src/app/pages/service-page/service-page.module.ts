import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicePageRoutingModule } from './service-page-routing.module';
import { ServicePageComponent } from './service-page.component';
import { ServicesMenuModule, ModalModule } from '@kk/components';


@NgModule({
  declarations: [ServicePageComponent],
  imports: [
    CommonModule,
    ServicePageRoutingModule,
    ServicesMenuModule,
    ModalModule
  ],
  exports: [ServicePageComponent]
})
export class ServicePageModule { }
