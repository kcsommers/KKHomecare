import { Component, OnInit, ChangeDetectionStrategy, ViewContainerRef, ViewChild, TemplateRef, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
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

  private _imgStore: ImageModel[] = [];

  public isLoading = true;

  public hasError = false;

  @ViewChild('PhotosContainer', { static: true, read: ViewContainerRef })
  private _photosContainer: ViewContainerRef;

  constructor(
    private _photosService: PhotosService,
    private _cfr: ComponentFactoryResolver,
    private _cd: ChangeDetectorRef
  ) {
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
    const lastId = this._imgStore[this._imgStore.length - 1] && this._imgStore[this._imgStore.length - 1]._id;
    this._photosService.getPhotos(lastId)
      .pipe(take(1))
      .subscribe(
        (res: PhotosResponse) => {
          this.isLoading = false;
          if (res && res.images) {
            if (!this._imgStore.length && !res.images.length) {
              this.hasError = true;
              return;
            }
            this._imgStore.push(...res.images);
            res.images.forEach(img => this.createImageComponent(img));
            this._cd.markForCheck();
          }
        },
        err => {
          this.isLoading = false;
          if (!this._imgStore.length) {
            this.hasError = true;
            this._cd.markForCheck();
          }
          console.error(err);
        }
      );
  }

}
