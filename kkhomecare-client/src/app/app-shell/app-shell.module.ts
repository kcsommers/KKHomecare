import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from '../components/modal/modal.module';
import { ContactFormModule } from '../components/contact-form/contact-form.module';



@NgModule({
  declarations: [
    AppShellComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    ModalModule,
    ContactFormModule
  ],
  exports: [
    AppShellComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class AppShellModule { }
