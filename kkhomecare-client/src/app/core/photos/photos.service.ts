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

  public getBeforeAfter(): Observable<BeforeAfterResponse> {
    return this.http.get<BeforeAfterResponse>(`${environment.apiUrl}/photos/before-after`);
  }

  public upload(imageFiles: FileList): Observable<PhotosResponse> {
    const formData = new FormData();
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('photos', imageFiles[i], imageFiles[i].name);
    }
    return this.http.post<PhotosResponse>(`${environment.apiUrl}/photos/upload`, formData);
  }

  public uploadBeforeAfter(beforeImg: File, afterImg: File): Observable<BeforeAfterResponse> {
    const formData = new FormData();
    formData.append('photos', beforeImg);
    formData.append('photos', afterImg);
    return this.http.post<BeforeAfterResponse>(`${environment.apiUrl}/photos/before-after/upload`, formData);
  }
}
