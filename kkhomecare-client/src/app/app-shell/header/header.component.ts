import { Component, ChangeDetectionStrategy, HostListener, HostBinding, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalService } from '@kk/components';


@Component({
  selector: 'kk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnDestroy {

  public scrolled = false;

  private _unsubscribe$ = new Subject();

  public currentUrl = '';

  constructor(private _router: Router, private _modalService: ModalService) {
    this.setCurrentUrl(this._router.url);
    this._router.events
      .pipe(
        takeUntil(this._unsubscribe$),
        filter(ev => ev instanceof NavigationStart)
      )
      .subscribe((navStart: NavigationStart) => {
        this.setCurrentUrl(navStart.url);
      });
  }

  private setCurrentUrl(url: string): void {
    const match = url.match(/\/[a-z]*/i);
    this.currentUrl = match ? match[0] : '';
  }

  @HostBinding('class.scrolled')
  get isScrolled(): boolean {
    return this.scrolled;
  }

  @HostListener('window:scroll')
  public onScroll(): void {
    if (window.scrollY > 0) {
      if (!this.scrolled) {
        this.scrolled = true;
      }
    } else {
      this.scrolled = false;
    }
  }

  public ngOnDestroy() {
    this._unsubscribe$.next(false);
    this._unsubscribe$.complete();
  }

  public openModal(): void {
    this._modalService.open();
  }

}
