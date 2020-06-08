import { Component, ChangeDetectionStrategy, HostListener, HostBinding } from '@angular/core';

@Component({
  selector: 'kk-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

  public scrolled = false;

  constructor() { }

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

}
