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

  constructor(private http: HttpClient, public cfr: ComponentFactoryResolver) { }

  public getPhotos(lastId: string): Observable<PhotosResponse> {
    const query = lastId ? `?lastId=${lastId}` : '';
    return this.http.get<PhotosResponse>(`${environment.apiUrl}/photos${query}`);
  }

  public upload(imageFiles: FileList, tag: Services): Observable<HttpResponse> {
    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('photos', imageFiles[i], imageFiles[i].name);
    }
    return this.http.post<HttpResponse>(`${environment.apiUrl}/photos/before-after/upload?tag=${tag}`, formData);
  }
}
