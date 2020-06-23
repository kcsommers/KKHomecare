import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'kk-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

  @HostBinding('class.header-padding')
  public paddingClass = true;

}
