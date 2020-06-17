import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormSubmission } from './contact';
import { ApiResponse } from '../http/api';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) { }

  public submitForm(data: FormSubmission): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${environment.apiUrl}/messages`, data);
  }

}
