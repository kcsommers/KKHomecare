import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { InvoiceModel, AdminService, InvoicesResponse } from '@kk/core';
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
    { value: 'none', viewValue: 'None' },
    { value: 'past-due', viewValue: 'Past Due' },
    { value: 'paid', viewValue: 'Paid' },
    { value: 'not-sent', viewValue: 'Not Sent' }
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
    this._router.events
      .pipe(
        filter(ev => ev instanceof NavigationEnd),
        switchMap(_ => this._route.queryParams),
        takeUntil(this._unsubscribe$)
      )
      .subscribe(
        queryParams => {
          console.log('why is this happenning twice')
          if (queryParams) {
            console.log('Params:::: ', queryParams)
            if (queryParams.filter) {
              this.currentFilter = queryParams.filter;
            }
            if (queryParams.q) {
              this._searchBar.nativeElement.value = queryParams.q;
              this.searchInvoices(queryParams.q);
            } else {
              console.log('Query q else')
              this.loadInvoices();
            }
            this._cd.markForCheck();
          } else {
            console.log('Query else')
            this.loadInvoices();
          }
        }
      )
  }

  ngOnInit() {
    this._debounce$
      .pipe(
        takeUntil(this._unsubscribe$),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((name: string) => {
        console.log('calling it')
        this.updateParams({ q: name });
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next(false);
    this._unsubscribe$.complete();
  }

  public filterChanged(filter: string): void {
    this._lastId = '';
    this.currentFilter = filter;
    // this.updateParams({ filter: this.currentFilter });
  }

  private updateParams(params: Params) {
    console.log('update params')
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
    console.log('Load in:::: ', name)
    this.fetchError$.next('');
    this.loading$.next(true);
    this._adminService.getInvoices(this._lastId)
      .pipe(take(1))
      .subscribe(
        (res: InvoicesResponse) => {
          console.log('Ressss:::: ', res)
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

  public searchInputChanged(event: InputEvent): void {
    console.log('SEARCHH:::: ', event.target['value'])
    this._debounce$.next(event.target['value']);
  }

  public searchInvoices(name: string): void {
    console.log('Search in:::: ', name)
    this.reset();
    this._adminService.getInvoicesByClient(name)
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
    console.log('Handle Ressss:::: ', res)
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
    return dueDate > Date.now();
  }

}
