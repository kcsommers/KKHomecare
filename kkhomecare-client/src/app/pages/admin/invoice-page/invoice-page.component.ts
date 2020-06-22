import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AdminService, InvoicesResponse, InvoiceModel, ClientModel, InvoiceItem, ModalService } from '@kk/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

class Invoice implements InvoiceModel {
  public client: ClientModel = {
    name: '',
    email: '',
    phone: ''
  };
  public items: InvoiceItem[] = [];
  public total: number;
  public paid: boolean;
  public dueDate: number;
  public dateSent: number;
  public datePaid: number;
  public _id = '0';

  public setInvoice(invoice: InvoiceModel): void {
    this.client = invoice.client;
    this.items = invoice.items;
    this.total = invoice.total;
    this.paid = invoice.paid;
    this.datePaid = invoice.datePaid;
    this.dueDate = invoice.dueDate;
    this.dateSent = invoice.dateSent;
    this._id = invoice._id;
  }
}

class Item implements InvoiceItem {
  public name: string;
  public total: number;
  public itemId = Math.floor(Math.random() * 1000000);
  public description: string;

  public setItem(item: InvoiceItem): void {
    this.name = item.name;
    this.total = item.total;
    this.itemId = item.itemId;
    this.description = item.description;
  }
}

@Component({
  selector: 'kk-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePageComponent implements OnInit, OnDestroy {

  private _unsubscribe$ = new Subject();

  public fetchError$ = new BehaviorSubject(false);

  public loading$ = new BehaviorSubject(false);

  public saving$ = new BehaviorSubject(false);

  public saveError$ = new BehaviorSubject(false);

  public saveSuccess$ = new BehaviorSubject(false);

  public invoiceModel = new Invoice();

  public invoiceTotal = 2000;

  public currentItem: Item;

  public itemErrors = {
    itemName$: new BehaviorSubject(false),
    itemTotal$: new BehaviorSubject(false),
  };

  public invoiceErrors = {
    clientName$: new BehaviorSubject(false),
    clientEmail$: new BehaviorSubject(false),
    clientPhone$: new BehaviorSubject(false),
  };

  constructor(
    private _route: ActivatedRoute,
    private _adminService: AdminService,
    private _cd: ChangeDetectorRef,
    private _modalService: ModalService
  ) {
    this._route.params
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        (params: Params) => {
          if (params && params.id && params.id !== '0') {
            this.fetchInvoice(params.id);
          }
        }
      );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._unsubscribe$.next(false);
    this._unsubscribe$.complete();
  }

  private fetchInvoice(id: string): void {
    this.loading$.next(true);
    this._adminService.getInvoiceById(id)
      .pipe(take(1))
      .subscribe(
        (res: InvoicesResponse) => {
          this.loading$.next(false);
          if (res.error || !res.invoices || !res.invoices.length) {
            console.error(res.error);
            this.fetchError$.next(true);
            return;
          }
          this.fetchError$.next(false);
          this.invoiceModel.setInvoice(res.invoices[0]);
          this._cd.markForCheck();
        },
        err => {
          console.error(err);
          this.loading$.next(false);
          this.fetchError$.next(true);
        }
      );
  }

  public openItemModal(item?: InvoiceItem): void {
    this.currentItem = new Item();
    if (item) {
      this.currentItem.setItem(item);
    }
    this._modalService.open();
  }

  public deleteItem(item: InvoiceItem): void {
    this.invoiceModel.items = this.invoiceModel.items.filter(i => i !== item);
  }

  private validateItem(): boolean {
    this.itemErrors.itemName$.next(!this.currentItem.name);
    this.itemErrors.itemTotal$.next(!this.currentItem.total);
    return (!this.itemErrors.itemName$.value && !this.itemErrors.itemTotal$.value);
  }

  public addItem(): void {
    if (this.validateItem()) {
      this.invoiceModel.items.push(this.currentItem);
      this._modalService.close();
    }
  }

  private validateInvoice(): boolean {
    this.invoiceErrors.clientName$.next(!this.invoiceModel.client.name);
    this.invoiceErrors.clientEmail$.next(!this.invoiceModel.client.email);
    this.invoiceErrors.clientPhone$.next(!this.invoiceModel.client.phone);
    return (
      !this.invoiceErrors.clientName$.value &&
      !this.invoiceErrors.clientEmail$.value &&
      !this.invoiceErrors.clientPhone$.value
    );
  }

  public createAndSendInvoice(): void {
    console.log('CV', this.validateInvoice());
    if (this.validateInvoice()) {
      this.saving$.next(true);
      this._adminService.createInvoice(this.invoiceModel)
        .pipe(take(1))
        .subscribe(
          (res: InvoicesResponse) => {
            this.saving$.next(false);
            if (res.error || !res.invoices || !res.invoices.length) {
              console.error(res.error);
              this.fetchError$.next(true);
              return;
            }
            this.saveError$.next(false);
            this.saveSuccess$.next(true);
            this.invoiceModel.setInvoice(res.invoices[0]);
            this._cd.markForCheck();
          },
          err => {
            this.saving$.next(false);
            this.saveError$.next(true);
            this.saveSuccess$.next(false);
            console.error(err);
          }
        );
    }
  }

}
