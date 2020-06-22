import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicePageRoutingModule } from './invoice-page-routing.module';
import { InvoicePageComponent } from './invoice-page.component';
import { LoadingSpinnerModule, ModalModule } from '@kk/components';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [InvoicePageComponent],
  imports: [
    CommonModule,
    InvoicePageRoutingModule,
    LoadingSpinnerModule,
    FormsModule,
    FontAwesomeModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ModalModule
  ],
  exports: [InvoicePageComponent]
})
export class InvoicePageModule { }
