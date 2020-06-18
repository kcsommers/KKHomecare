import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicePageComponent } from './invoice-page.component';


const routes: Routes = [
  {
    path: '',
    component: InvoicePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicePageRoutingModule { }
