import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { InvoicesResponse, InvoiceModel } from './admin';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) {
  }

  public getInvoiceById(id: string): Observable<InvoicesResponse> {
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices/${id}`);
  }

  public getInvoices(lastId: string, filter: string): Observable<InvoicesResponse> {
    let query = '';
    if (lastId) {
      query += `?lastId=${lastId}`;
    }
    if (filter) {
      query += `${query ? '&' : '?'}filter=${filter}`
    }
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices${query}`);
  }

  public getInvoicesByClient(name: string, filter: string): Observable<InvoicesResponse> {
    let query = `?q=${name}`;
    if (filter) {
      query += `&filter=${filter}`
    }
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices/search${query}`);
  }

  public getPastDueInvoices(): Observable<InvoicesResponse> {
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices/past-due`);
  }

  public getPaidInvoices(): Observable<InvoicesResponse> {
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices/paid`);
  }

  public createInvoice(invoice: InvoiceModel): Observable<InvoicesResponse> {
    return this._http.post<InvoicesResponse>(`${environment.apiUrl}/invoices/create`, { invoice });
  }

}
