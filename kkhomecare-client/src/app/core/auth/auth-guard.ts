import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentAdmin = this._authService.getAdmin();
    const redirect = (): boolean => {
      const requestedUrl = state.url.split('/');
      if (requestedUrl.length && requestedUrl[2] && requestedUrl[2].includes('login')) {
        return true;
      }
      this._router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } })
      return false;
    };
    if (currentAdmin) {
      if (!currentAdmin.expiresAt || Date.now() > currentAdmin.expiresAt) {
        this._authService.removeAdmin();
        return redirect();
      }
      return true;
    }
    return redirect();
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}
