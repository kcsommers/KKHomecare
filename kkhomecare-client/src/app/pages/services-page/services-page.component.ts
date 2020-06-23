import { Component, OnInit, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { services, ModalService } from '@kk/core';

@Component({
  selector: 'kk-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesPageComponent implements OnInit {

  public services = services;

  constructor(private _modalService: ModalService) { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
  }

  @HostBinding('class.header-padding')
  public paddingClass = true;

  public openModal(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this._modalService.open();
  }
}
