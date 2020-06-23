import { Component, ChangeDetectionStrategy, HostBinding, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ViewContainerRef, TemplateRef, AfterViewInit, Directive, ContentChild } from '@angular/core';
import { ModalService } from '@kk/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';

@Directive({
  selector: '[kkModalTemplate]'
})
export class ModalTemplateDirective {
  constructor(public template: TemplateRef<any>) {
  }
}

@Component({
  selector: 'kk-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, OnDestroy {

  public isOpen = false;

  public isVisible = false;

  private _unsubscribe$ = new Subject();

  private _close$ = new Subject();

  @ViewChild('ViewContainer', { static: false, read: ViewContainerRef })
  private _viewContainer: ViewContainerRef;

  @ViewChild('ConfirmTemplate', { static: false, read: TemplateRef })
  private _confirmTemplate: TemplateRef<any>;

  @ContentChild(ModalTemplateDirective, { static: false })
  private _modalTemplate: ModalTemplateDirective;

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
      .subscribe((isOpen: boolean) => {
        if (isOpen) {
          this.open();
        } else {
          this.close();
        }
      });

    this._modalService.confirm$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((isOpen: boolean) => {
        if (isOpen) {
          this.openConfirm();
        } else {
          this.close();
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next(false);
    this._unsubscribe$.complete();
  }

  public open(): void {
    if (this._modalTemplate) {
      document.querySelector('body').style.overflow = 'hidden';
      this._viewContainer.createEmbeddedView(this._modalTemplate.template);
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

  public cancel(): void {
    this._modalService.closeConfirm();
  }

  public openConfirm(): void {
    this._viewContainer.createEmbeddedView(this._confirmTemplate);
    this.isVisible = true;
    this.isOpen = true;
    this._cd.markForCheck();
  }

  public confirm(): void {
    this._modalService.confirmed();
  }
}
