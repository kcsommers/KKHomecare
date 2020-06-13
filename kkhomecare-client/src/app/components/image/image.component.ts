import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ImageModel } from '@kk/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'kk-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('false', style({ opacity: 0 })),
      state('true', style({ opacity: 1 })),
      transition('false => true', animate('300ms ease'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {

  private _image: ImageModel;

  public loaded$ = new BehaviorSubject(false);

  @Input()
  public set image(img: ImageModel) {
    this.loaded$.next(false);
    this._image = img;
  };

  public get image(): ImageModel {
    return this._image;
  }

  @HostBinding('class.slide-in')
  public slideIn = true;

  constructor() { }

  public onLoad(): void {
    this.loaded$.next(true);
  }

}
