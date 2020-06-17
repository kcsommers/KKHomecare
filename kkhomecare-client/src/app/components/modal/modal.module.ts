import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ContactFormModule } from '../contact-form/contact-form.module';



@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    ContactFormModule
  ],
  exports: [ModalComponent]
})
export class ModalModule { }
