import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesDashboardComponent } from './invoices-dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: InvoicesDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesDashboardRoutingModule { }
