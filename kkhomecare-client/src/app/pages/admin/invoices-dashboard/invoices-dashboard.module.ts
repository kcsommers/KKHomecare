import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesDashboardRoutingModule } from './invoices-dashboard-routing.module';
import { InvoicesDashboardComponent } from './invoices-dashboard.component';
import { LoadingSpinnerModule } from '@kk/components';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [InvoicesDashboardComponent],
  imports: [
    CommonModule,
    InvoicesDashboardRoutingModule,
    LoadingSpinnerModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule,
    MatSelectModule
  ],
  exports: [InvoicesDashboardComponent]
})
export class InvoicesDashboardModule { }
