import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { InvoiceModel, AdminService, InvoicesResponse, InvoiceFilters } from '@kk/core';
import { take, takeUntil, distinctUntilChanged, debounceTime, filter, switchMap, skip } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router, Params, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'kk-invoices-dashboard',
  templateUrl: './invoices-dashboard.component.html',
  styleUrls: ['./invoices-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicesDashboardComponent implements OnInit, OnDestroy {

  public displayedInvoices: InvoiceModel[] = [];

  private _lastId: string;

  public fetchError$ = new BehaviorSubject('');

  public loading$ = new BehaviorSubject(true);

  public currentFilter = 'none';

  public filters = [
    { value: InvoiceFilters.NONE, viewValue: 'None' },
    { value: InvoiceFilters.PAST_DUE, viewValue: 'Past Due' },
    { value: InvoiceFilters.PAID, viewValue: 'Paid' },
    { value: InvoiceFilters.UNPAID, viewValue: 'Unpaid' }
  ];

  private _debounce$ = new Subject<string>();

  private _unsubscribe$ = new Subject();

  @ViewChild('Searchbar', { static: true, read: ElementRef })
  private _searchBar: ElementRef<HTMLInputElement>;

  constructor(
    private _adminService: AdminService,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this._debounce$
      .pipe(
        takeUntil(this._unsubscribe$),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((name: string) => {
        this.updateParams({ q: name });
      });

    this._route.queryParams
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        (queryParams: Params) => {
          if (queryParams) {
            console.log('QP:::: ', queryParams)
            if (queryParams.filter) {
              this.currentFilter = queryParams.filter;
            }
            if (queryParams.q) {
              this._searchBar.nativeElement.value = queryParams.q;
              this.searchInvoices(queryParams.q);
            } else {
              this.loadInvoices();
            }
            this._cd.markForCheck();
          } else {
            this.loadInvoices();
          }
        }
      );
  }

  ngOnDestroy() {
    this._unsubscribe$.next(false);
    this._unsubscribe$.complete();
  }

  public filterChanged(filter: string): void {
    this.reset();
    this.currentFilter = filter;
    this.updateParams({ filter: this.currentFilter });
  }

  private updateParams(params: Params) {
    this._router.navigate(
      [],
      {
        relativeTo: this._route,
        queryParams: params,
        queryParamsHandling: 'merge'
      }
    );
  }

  public loadInvoices(): void {
    this.fetchError$.next('');
    this.loading$.next(true);
    this._adminService.getInvoices(this._lastId, this.currentFilter)
      .pipe(take(1))
      .subscribe(
        (res: InvoicesResponse) => {
          this.loading$.next(false);
          if (res.error) {
            console.error(res.error);
            this.fetchError$.next('Error fetching invoices');
            return;
          }
          if (!this.displayedInvoices.length && (!res.invoices || !res.invoices.length)) {
            this.fetchError$.next('No invoices to display');
            return;
          }
          this.displayedInvoices.push(...res.invoices);
          this._lastId = this.displayedInvoices[this.displayedInvoices.length - 1]._id;
          // this._cd.markForCheck();
        },
        err => {
          this.fetchError$.next('Error fetching invoices');
          this.loading$.next(false);
          console.error(err);
        }
      );
  }

  public searchInputChanged(event: Event): void {
    this._debounce$.next(event.target['value']);
  }

  public searchInvoices(name: string): void {
    console.log('Serarch invoices')
    this.reset();
    this._adminService.getInvoicesByClient(name, this.currentFilter)
      .pipe(take(1))
      .subscribe(this.handleResponse.bind(this), this.handleError.bind(this));
  }

  public getPastDueInvoices(): void {
    this.reset();
    this._adminService.getPastDueInvoices()
      .pipe(take(1))
      .subscribe(this.handleResponse.bind(this), this.handleError.bind(this));
  }

  public getPaidInvoices(): void {
    this.reset();
    this._adminService.getPaidInvoices()
      .pipe(take(1))
      .subscribe(this.handleResponse.bind(this), this.handleError.bind(this));
  }

  private handleError(err: Error): void {
    this.fetchError$.next('Error fetching invoices');
    this.loading$.next(false)
    console.error(err);
  }

  private handleResponse(res: InvoicesResponse): void {
    this.loading$.next(false);
    if (res.error) {
      console.error(res.error);
      this.fetchError$.next('Error fetching invoices');
      return;
    }
    if (!res.invoices || !res.invoices.length) {
      this.fetchError$.next('No invoices to display');
      return;
    }
    this.fetchError$.next('');
    this.displayedInvoices = res.invoices;
    this._cd.markForCheck();
  }

  private reset(): void {
    this.fetchError$.next('');
    this.loading$.next(true);
    this._lastId = '';
    this.displayedInvoices = [];
  }

  public isPastDue(dueDate: number): boolean {
    return dueDate < Date.now();
  }

}
