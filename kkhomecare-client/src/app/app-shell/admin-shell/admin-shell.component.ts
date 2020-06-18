import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService, AuthorizedAdmin } from '@kk/core';

@Component({
  selector: 'kk-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminShellComponent implements OnInit {

  public admin: AuthorizedAdmin;

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
    this.admin = this._authService.getAdmin();
  }

  public logout(): void {
    this._authService.logout();
  }

}
