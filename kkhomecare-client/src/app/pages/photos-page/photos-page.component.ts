import { Component, OnInit, ChangeDetectionStrategy, ViewContainerRef, ViewChild, TemplateRef, ComponentFactoryResolver } from '@angular/core';
import { PhotosService, PhotosResponse, ImageModel } from '@kk/core';
import { take } from 'rxjs/operators';
import { ImageComponent } from '@kk/components';

@Component({
  selector: 'kk-photos-page',
  templateUrl: './photos-page.component.html',
  styleUrls: ['./photos-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosPageComponent implements OnInit {

  private _offset = 0;

  @ViewChild('PhotosContainer', { static: true, read: ViewContainerRef })
  private _photosContainer: ViewContainerRef;

  @ViewChild('ErrorTemplate', { static: false, read: TemplateRef })
  private _errorTemplate: TemplateRef<any>;

  constructor(private _photosService: PhotosService, private _cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    window.scrollTo({ top: 0 });
    this.loadImages();
  }

  private createImageComponent(img: ImageModel): void {
    const factory = this._cfr.resolveComponentFactory(ImageComponent);
    const imgCmp = this._photosContainer.createComponent(factory);
    imgCmp.instance.image = img;
  }

  public loadImages(): void {
    this._photosService.getPhotos(this._offset)
      .pipe(take(1))
      .subscribe(
        (res: PhotosResponse) => {
          if (res && res.images) {
            this._offset += res.images.length;
            res.images.forEach(img => this.createImageComponent(img));
          }
        },
        err => console.error(err)
      );
  }

}
