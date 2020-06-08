import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kk-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
