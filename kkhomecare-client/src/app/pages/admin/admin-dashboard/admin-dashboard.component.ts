import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '@kk/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'kk-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent implements OnInit {

  public unpaidTotal = '';

  constructor(private _adminService: AdminService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._adminService.getUnpaidInvoiceTotal()
      .pipe(take(1))
      .subscribe(
        res => {
          this.unpaidTotal = res.total.toString();
          this._cd.markForCheck();
        },
        error => console.error(error)
      )
  }

}
