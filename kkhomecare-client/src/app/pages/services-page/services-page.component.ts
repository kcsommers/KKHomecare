import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { services } from '@kk/core';

@Component({
  selector: 'kk-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPageComponent implements OnInit {

  public services = services;

  constructor() { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

}
