import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kk-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
