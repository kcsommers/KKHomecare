import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PhotosService, PhotosResponse, BeforeAfterResponse } from '@kk/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'kk-photo-upload-page',
  templateUrl: './photo-upload-page.component.html',
  styleUrls: ['./photo-upload-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotoUploadPageComponent implements OnInit {

  private _imageFiles: FileList;

  private _beforeFile: File;

  private _afterFile: File;

  public imageFileNames: string[] = [];

  public beforeFileName: string;

  public afterFileName: string;

  public imgUploading$ = new BehaviorSubject(false);

  public imgUploadError$ = new BehaviorSubject(false);

  public imgUploadSuccess$ = new BehaviorSubject(false);

  public beforeAfterUploading$ = new BehaviorSubject(false);

  public beforeAfterUploadError$ = new BehaviorSubject(false);

  public beforeAfterUploadSuccess$ = new BehaviorSubject(false);

  constructor(private _cd: ChangeDetectorRef, private _photosService: PhotosService) { }

  ngOnInit() {
  }

  public dragEnter(event: DragEvent): void {
    event.target['parentNode'].classList.add('dragged-over');
  }

  public dragLeave(event: DragEvent): void {
    event.target['parentNode'].classList.remove('dragged-over');
  }

  public imageFilesSelected(event: Event): void {
    this.imgUploadError$.next(false);
    this.imgUploadSuccess$.next(false);
    event.target['parentNode'].classList.remove('dragged-over');
    const files = <FileList>event.target['files'];
    if (files && files.length) {
      this._imageFiles = files;
      console.log('im', this._imageFiles)
      this.imageFileNames = Array.from(files).map(f => f.name);
      this._cd.markForCheck();
    }
  }

  public beforeFileSelected(event: Event): void {
    this.beforeAfterUploadError$.next(false);
    this.beforeAfterUploadSuccess$.next(false);
    event.target['parentNode'].classList.remove('dragged-over');
    const files = <FileList>event.target['files'];
    if (files && files.length) {
      this._beforeFile = files[0];
      this.beforeFileName = this._beforeFile.name;
      this._cd.markForCheck();
    }
  }

  public afterFileSelected(event: Event): void {
    this.beforeAfterUploadError$.next(false);
    this.beforeAfterUploadSuccess$.next(false);
    event.target['parentNode'].classList.remove('dragged-over');
    const files = <FileList>event.target['files'];
    if (files && files.length) {
      this._afterFile = files[0];
      this.afterFileName = this._afterFile.name;
      this._cd.markForCheck();
    }
  }

  public uploadImages(): void {
    this.imgUploading$.next(true);
    this._photosService.upload(this._imageFiles)
      .pipe(take(1))
      .subscribe(
        (res: PhotosResponse) => {
          this.imgUploading$.next(false);
          if (!res.error) {
            this.imgUploadSuccess$.next(true);
            this.imgUploadError$.next(false);
          } else {
            this.imgUploadSuccess$.next(false);
            this.imgUploadError$.next(true);
            console.error(res.error);
          }
        },
        err => {
          this.imgUploading$.next(false);
          this.imgUploadSuccess$.next(false);
          this.imgUploadError$.next(true);
          console.error(err);
        }
      )
  }

  public uploadBeforeAfter(): void {
    this.beforeAfterUploading$.next(true);
    this._photosService.uploadBeforeAfter(this._beforeFile, this._afterFile)
      .pipe(take(1))
      .subscribe(
        (res: BeforeAfterResponse) => {
          this.beforeAfterUploading$.next(false);
          if (!res.error) {
            this.beforeAfterUploadError$.next(false);
            this.beforeAfterUploadSuccess$.next(true);
          } else {
            this.beforeAfterUploadError$.next(true);
            this.beforeAfterUploadSuccess$.next(false);
            console.error(res.error);
          }
        },
        err => {
          this.beforeAfterUploading$.next(false);
          this.beforeAfterUploadError$.next(true);
          this.beforeAfterUploadSuccess$.next(false);
          console.error(err);
        }
      )
  }

}
