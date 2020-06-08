import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesMenuComponent } from './services-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ServicesMenuComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [ServicesMenuComponent]
})
export class ServicesMenuModule { }
