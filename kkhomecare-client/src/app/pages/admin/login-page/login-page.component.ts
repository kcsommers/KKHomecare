import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { AuthenticationService, LoginResult } from '@kk/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kk-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  public username = '';

  public password = '';

  public loginError = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthenticationService,
    private _cd: ChangeDetectorRef,
  ) { }

  public getErrorMessage(): string {
    return localStorage.getItem(AuthenticationService.LOGIN_ERROR_KEY);
  }

  public login(): void {
    if (this.username && this.password) {
      this._authService.login({
        username: this.username,
        password: this.password
      })
        .pipe(take(1))
        .subscribe(
          (res: LoginResult) => {
            if (res.error) {
              this._authService.loginError('Incorrect username or password');
              return;
            }
            if (res.success && res.data) {
              this._authService.setAdmin(res.data.admin);
              this._authService.clearLoginError();
              const returnUrl = this._route.snapshot.queryParams['returnUrl'];
              this._router.navigateByUrl(returnUrl || '/admin');
            }
          },
          err => {
            this._authService.loginError('Incorrect username or password');
            this._cd.markForCheck();
          }
        )
    }
  }

}
