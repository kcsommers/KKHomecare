import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'kk-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

  @HostBinding('class.header-padding')
  public paddingClass = true;

}
