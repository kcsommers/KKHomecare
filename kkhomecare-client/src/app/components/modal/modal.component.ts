import { Component, ChangeDetectionStrategy, HostBinding, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ViewContainerRef, TemplateRef, AfterViewInit } from '@angular/core';
import { ModalService, ModalTemplates } from '@kk/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';

@Component({
  selector: 'kk-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, AfterViewInit, OnDestroy {

  public isOpen = false;

  public isVisible = false;

  private _unsubscribe$ = new Subject();

  private _close$ = new Subject();

  private _templateMap = new Map<ModalTemplates, TemplateRef<any>>();

  @ViewChild('ViewContainer', { static: false, read: ViewContainerRef })
  private _viewContainer: ViewContainerRef;

  @ViewChild('ContactTemplate', { static: false, read: TemplateRef })
  private _contactTemplate: TemplateRef<any>;

  @HostBinding('class.visible')
  get visibleClass(): boolean {
    return this.isVisible;
  }

  @HostBinding('attr.data-clickout')
  public clickout = true;

  constructor(private _modalService: ModalService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._modalService.open$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((event: { isOpen: boolean, template: ModalTemplates }) => {
        if (event.isOpen) {
          this.open(event.template);
        } else {
          this.close();
        }
      });
  }

  ngAfterViewInit() {
    this._templateMap.set(ModalTemplates.CONTACT, this._contactTemplate);
  }

  ngOnDestroy() {
    this._unsubscribe$.next(false);
    this._unsubscribe$.complete();
  }

  public open(template: ModalTemplates): void {
    const templateRef = this._templateMap.get(template);
    if (templateRef) {
      document.querySelector('body').style.overflow = 'hidden';
      this._viewContainer.createEmbeddedView(templateRef);
      this.isVisible = true;
      this.isOpen = true;
      this._cd.markForCheck();
      fromEvent(document, 'click')
        .pipe(
          takeUntil(this._close$),
          filter((ev: MouseEvent) => {
            const dataset = ev.target['dataset'];
            return dataset && dataset.clickout === 'true';
          })
        )
        .subscribe(e => {
          this.close();
        });
    }
  }

  public close(): void {
    document.querySelector('body').style.overflow = 'auto';
    this._close$.next();
    this._close$.complete();
    this.isVisible = false;
    this._cd.markForCheck();
    setTimeout(() => {
      this.isOpen = true;
      this._viewContainer.clear();
    }, 500);
  }

}
