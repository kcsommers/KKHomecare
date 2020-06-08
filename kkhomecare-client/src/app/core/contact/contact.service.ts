import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormSubmission } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) { }

  public submitForm(data: FormSubmission): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/messages`, data);
  }

}
