import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kk-invoices-dashboard',
  templateUrl: './invoices-dashboard.component.html',
  styleUrls: ['./invoices-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
