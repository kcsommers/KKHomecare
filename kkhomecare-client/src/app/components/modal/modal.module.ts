import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent, ModalTemplateDirective } from './modal.component';
import { ContactFormModule } from '../contact-form/contact-form.module';



@NgModule({
  declarations: [ModalComponent, ModalTemplateDirective],
  imports: [
    CommonModule,
    ContactFormModule
  ],
  exports: [ModalComponent, ModalTemplateDirective]
})
export class ModalModule { }
