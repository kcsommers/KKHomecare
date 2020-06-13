import { Injectable, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  public getPhotos(offset: number): Observable<PhotosResponse> {
    return of({
      images: [
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687923/2K%20Homecare/cleaning/r0zjswtcfpks6cmhokdo.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687276/2K%20Homecare/cleaning/yoozwccitkto4qfrzqxi.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687924/2K%20Homecare/cleaning/mlpgtrsesrne9adssgnb.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687275/2K%20Homecare/cleaning/emjtg4iajkforbwupzft.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687274/2K%20Homecare/cleaning/yycubrl5anjc2gnfutb0.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687273/2K%20Homecare/cleaning/wt2osfivhxel1cqf1cti.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1587687274/2K%20Homecare/cleaning/dgvipsvtwolgl8ev7tl8.jpg'
        },
        {
          _id: 'asdlfjaskljfh',
          url: 'https://res.cloudinary.com/kcsommers/image/upload/v1580953588/2K%20Homecare/cleaning/7f40ed46-845d-4262-bf60-b9ac161152ff.jpg'
        }
      ], error: null
    })
    // return this.http.post<PhotosResponse>(
    //   `${environment.apiUrl}/photos`,
    //   { offset, lastId: this.lastId }
    // );
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
