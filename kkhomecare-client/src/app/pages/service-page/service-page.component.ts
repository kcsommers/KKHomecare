import { Component, OnInit, ChangeDetectionStrategy, ViewContainerRef, ViewChild, TemplateRef, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { services, Service, ModalService } from '@kk/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kk-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicePageComponent implements OnInit, OnDestroy {

  public service: Service;

  private _params$: Subscription;

  @ViewChild('ViewContainer', { static: true, read: ViewContainerRef })
  private _viewContainer: ViewContainerRef;

  @ViewChild('Template', { static: true, read: TemplateRef })
  private _template: TemplateRef<any>;

  @HostBinding('class.header-padding')
  public paddingClass = true;

  constructor(private _route: ActivatedRoute, private _modalService: ModalService) { }

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this._params$ = this._route.params.subscribe(params => {
      const service = services.find(s => s.name === params.id);
      if (service) {
        this._viewContainer.clear();
        this.service = service;
        this.attachView();
      }
    });
  }

  ngOnDestroy() {
    this._params$.unsubscribe();
  }

  private attachView() {
    this._viewContainer.createEmbeddedView(this._template, { service: this.service });
  }

  public openModal(): void {
    this._modalService.open();
  }

}
