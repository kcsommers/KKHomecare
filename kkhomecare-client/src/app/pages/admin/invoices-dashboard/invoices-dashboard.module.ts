import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesDashboardRoutingModule } from './invoices-dashboard-routing.module';
import { InvoicesDashboardComponent } from './invoices-dashboard.component';


@NgModule({
  declarations: [InvoicesDashboardComponent],
  imports: [
    CommonModule,
    InvoicesDashboardRoutingModule
  ],
  exports: [InvoicesDashboardComponent]
})
export class InvoicesDashboardModule { }
