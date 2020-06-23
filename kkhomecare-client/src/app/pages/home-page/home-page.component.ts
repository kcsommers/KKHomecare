import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'kk-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

  @HostBinding('class.header-padding')
  public paddingClass = true;

}
