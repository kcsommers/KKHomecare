import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kk-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
