import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { MessagesResponse } from './admin';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) {
  }

  public getTotalMessages(): Observable<MessagesResponse> {
    return this._http.get<MessagesResponse>(`${environment.apiUrl}/messages/total`);
  }

  public getMessages(lastId: string): Observable<MessagesResponse> {
    const query = lastId ? `?lastId=${lastId}` : '';
    return this._http.get<MessagesResponse>(`${environment.apiUrl}/messages${query}`);
  }

}
