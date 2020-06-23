import { Component, OnInit, ChangeDetectionStrategy, ViewContainerRef, ViewChild, TemplateRef, ComponentFactoryResolver, ChangeDetectorRef, ViewRef, HostBinding } from '@angular/core';
import { PhotosService, PhotosResponse, ImageModel, BeforeAfterModel, BeforeAfterResponse } from '@kk/core';
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

  private _imgCmpMap = new Map<number, ViewRef>();

  private _beforeAfterMap = new Map<number, ViewRef>();

  public isLoading = true;

  public hasError = false;

  public showBeforeAfter = false;

  @ViewChild('PhotosContainer', { static: true, read: ViewContainerRef })
  private _photosContainer: ViewContainerRef;

  @HostBinding('class.header-padding')
  public paddingClass = true;

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

  private createImageComponent(img: ImageModel | BeforeAfterModel): void {
    const factory = this._cfr.resolveComponentFactory(ImageComponent);
    if (this.showBeforeAfter) {
      const typedImg = <BeforeAfterModel>img;
      const beforeImg = this._photosContainer.createComponent(factory);
      const beforeModel = { url: typedImg.beforeUrl, _id: typedImg._id };
      beforeImg.location.nativeElement.classList.add('kk-pointer');
      beforeImg.location.nativeElement.addEventListener('click', this.onBeforeAfterClick.bind(this, img._id));
      beforeImg.instance.image = beforeModel;
      const afterImg = this._photosContainer.createComponent(factory);
      const afterModel = { url: typedImg.afterUrl, _id: typedImg._id };
      afterImg.location.nativeElement.classList.add('kk-pointer');
      afterImg.location.nativeElement.addEventListener('click', this.onBeforeAfterClick.bind(this, img._id));
      afterImg.location.nativeElement.dataset.afterId = img._id;
      afterImg.instance.shouldBlur = true;
      afterImg.instance.image = afterModel;
    } else {
      const imgCmp = this._photosContainer.createComponent(factory);
      imgCmp.location.nativeElement.classList.add('kk-pointer');
      imgCmp.location.nativeElement.addEventListener('click', this.onImgClick.bind(this, img._id));
      imgCmp.instance.image = <ImageModel>img;
    }
  }

  public onImgClick(id: string): void {
  }

  public onBeforeAfterClick(id: string): void {
    const afterImg = document.querySelector(`[data-after-id='${id}']`);
    if (afterImg) {
      afterImg.classList.remove('blurred');
    }
  }

  public loadImages(): void {

    const handleResponse = (res: PhotosResponse | BeforeAfterResponse) => {
      this.isLoading = false;
      const size = this.showBeforeAfter ? this._beforeAfterMap.size : this._imgStore.length;
      if (!size && !res.images.length) {
        this.hasError = true;
        return;
      }
      if (!this.showBeforeAfter) {
        this._imgStore.push(...<ImageModel[]>res.images);
      }
      res.images.forEach(img => this.createImageComponent(img));
      this._cd.markForCheck();
    };

    const handleError = (err: Error) => {
      this.isLoading = false;
      const size = this.showBeforeAfter ? this._beforeAfterMap.size : this._imgStore.length;
      if (!size) {
        this.hasError = true;
        this._cd.markForCheck();
      }
      console.error(err);
    };

    if (this.showBeforeAfter) {
      this._photosService.getBeforeAfter()
        .pipe(take(1))
        .subscribe(
          (res: BeforeAfterResponse) => handleResponse(res),
          (err: Error) => handleError(err)
        );
    } else {
      const lastId = this._imgStore[this._imgStore.length - 1] && this._imgStore[this._imgStore.length - 1]._id;
      this._photosService.getPhotos(lastId)
        .pipe(take(1))
        .subscribe(
          (res: PhotosResponse) => handleResponse(res),
          (err: Error) => handleError(err)
        );
    }
  }

  public toggleBeforeAfter(isToggled: boolean): void {
    this.showBeforeAfter = isToggled;
    const detachMap = this.showBeforeAfter ? this._imgCmpMap : this._beforeAfterMap;
    const attachMap = this.showBeforeAfter ? this._beforeAfterMap : this._imgCmpMap;

    let index = 0;
    while (this._photosContainer.length) {
      detachMap.set(index, this._photosContainer.detach(0));
      index++;
    }

    if (attachMap.size) {
      attachMap.forEach(view => {
        this._photosContainer.insert(view);
      });
    } else {
      this.loadImages();
    }
  }

}
