import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesPageRoutingModule } from './services-page-routing.module';
import { ServicesPageComponent } from './services-page.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [ServicesPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    ServicesPageRoutingModule
  ],
  exports: [ServicesPageComponent]
})
export class ServicesPageModule { }
