import { Component, ChangeDetectionStrategy, Output, Input, HostBinding, HostListener } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'kk-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent {

  @Input()
  public isToggled = false;

  @Output()
  public isToggledChange = new EventEmitter<boolean>();

  @HostBinding('class.toggled')
  get toggledClass(): boolean {
    return this.isToggled;
  }

  @HostListener('click')
  public onClick(): void {
    this.toggle();
  }

  constructor() {
  }

  public toggle() {
    this.isToggled = !this.isToggled;
    this.isToggledChange.emit(this.isToggled);
  }
}
