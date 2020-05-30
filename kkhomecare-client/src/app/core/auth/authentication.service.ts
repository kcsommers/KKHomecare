import { Injectable } from '@angular/core';
import { AuthorizedAdmin, LoginResult, LoginRequest } from './auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public static ADMIN_KEY = '__kk__admin__';

  public static LOGIN_ERROR_KEY = '__kk__login__error';

  constructor(private _http: HttpClient, private _router: Router) { }

  public getAdmin(): AuthorizedAdmin {
    const admin = localStorage.getItem(AuthenticationService.ADMIN_KEY);
    return admin && <AuthorizedAdmin>JSON.parse(admin);
  }

  public login(req: LoginRequest): Observable<LoginResult> {
    return this._http.post<LoginResult>(`${environment.apiUrl}/admin/login`, req);
  }

  public logout(): void {
    this.removeAdmin();
    this._router.navigateByUrl('/admin/login');
  }

  public setAdmin(admin: AuthorizedAdmin) {
    localStorage.setItem(AuthenticationService.ADMIN_KEY, JSON.stringify(admin));
  }

  public removeAdmin(): void {
    localStorage.removeItem(AuthenticationService.ADMIN_KEY);
  }

  public loginError(message: string): void {
    localStorage.setItem(AuthenticationService.LOGIN_ERROR_KEY, message);
  }

  public clearLoginError(): void {
    localStorage.removeItem(AuthenticationService.LOGIN_ERROR_KEY);
  }
}
