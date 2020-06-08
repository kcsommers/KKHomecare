import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ImageModel, PhotosResponse, BeforeAfterResponse } from '../photos/photos';
// import { ImageComponent } from 'projects/components/src/lib/image/image.component';
import { HttpResponse } from '../auth/auth';
import { Services } from '../kk-services/kk-services';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  public photosContainer: ViewContainerRef;
  public lastId: string;

  constructor(private http: HttpClient, public cfr: ComponentFactoryResolver) { }

  public getPhotos(
    getTotal: boolean,
    fetchAll: boolean,
    beforeAfter: boolean,
    offset: number,
    limit: number
  ): Observable<PhotosResponse> {
    return this.http.post<PhotosResponse>(
      `${environment.apiUrl}/photos`,
      { beforeAfter, offset, getTotal, fetchAll, limit, lastId: this.lastId }
    );
  }

  public createImageComponents(imgModels: ImageModel[], clickCb?: (img: ImageModel) => void, viewContainer?: ViewContainerRef) {
    // const container = viewContainer || this.photosContainer;
    // if (container) {
    //   this.lastId = imgModels[imgModels.length - 1]._id;
    //   imgModels.forEach(imgModel => {
    //     const factory = this.cfr.resolveComponentFactory(ImageComponent);
    //     const imgComponent = container.createComponent(factory);
    //     imgComponent.instance.image = imgModel;
    //     imgComponent.instance.growOnHover = true;
    //     if (clickCb) {
    //       imgComponent.instance.imageSelected.subscribe(clickCb);
    //     }
    //   });
    // }
  }

  public upload(imageFiles: FileList, tag: Services): Observable<HttpResponse> {
    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('photos', imageFiles[i], imageFiles[i].name);
    }
    console.log('UPLOADING BEFOREAFTER')
    return this.http.post<HttpResponse>(`${environment.apiUrl}/photos/before-after/upload?tag=${tag}`, formData);
  }
}
