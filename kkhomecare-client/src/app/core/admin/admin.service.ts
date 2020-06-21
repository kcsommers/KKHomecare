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

  public getInvoices(lastId: string): Observable<InvoicesResponse> {
    const query = lastId ? `?lastId=${lastId}` : '';
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices${query}`);
  }

  public getInvoicesByClient(name: string): Observable<InvoicesResponse> {
    return this._http.get<InvoicesResponse>(`${environment.apiUrl}/invoices/search?q=${name}`);
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
