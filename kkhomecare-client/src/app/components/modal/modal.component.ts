import { Component, ChangeDetectionStrategy, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalService } from './modal.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  @HostBinding('class.visible')
  get visibleClass(): boolean {
    console.log('IS:::: ', this.isVisible)
    return this.isVisible;
  }

  constructor(private _modalService: ModalService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._modalService.open$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(isOpen => {
        if (isOpen) {
          this.open();
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
    this.isVisible = true;
    this.isOpen = true;
    this._cd.markForCheck();
  }

  public close(): void {
    this.isVisible = false;
    setTimeout(() => {
      this.isOpen = true;
    }, 500);
  }

}
