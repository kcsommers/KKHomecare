import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService, InvoicesResponse, InvoiceModel, ClientModel, InvoiceItem, ModalService } from '@kk/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import * as _moment from 'moment';

const moment = _moment;

class Invoice {
  public client = {
    name: '',
    email: '',
    phone: ''
  };
  public items: InvoiceItem[] = [];
  public total = '';
  public paid: boolean;
  public dueDate = moment(Date.now()).add(7, 'd');
  public dateSent: string;
  public datePaid: string;
  public _id = '0';

  public setInvoice(invoice: InvoiceModel): void {
    this.client.name = invoice.client.name;
    this.client.email = invoice.client.email;
    const phoneStr = invoice.client.phone.toString();
    this.client.phone = `(${phoneStr.substr(0, 3)}) ${phoneStr.substr(3, 3)}-${phoneStr.substr(6, 4)}`;
    this.items = invoice.items;
    this.total = invoice.total ? (invoice.total / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
    this.paid = invoice.paid;
    this.datePaid = invoice.datePaid ? moment(invoice.datePaid).format('MMM DD, YYYY') : '';
    this.dueDate = moment(invoice.dueDate);
    this.dateSent = invoice.dateSent ? moment(invoice.dateSent).format('MMM DD, YYYY') : '';
    this._id = invoice._id;
  }

  public togglePaid(): void {
    this.paid = !this.paid;
    if (this.paid) {
      this.datePaid = moment(Date.now()).format('MMM DD, YYYY');
    }
  }

  public updateDateSent(): void {
    this.dateSent = moment(Date.now()).format('MMM DD, YYYY');
  }

  public addItem(item: InvoiceItem): void {
    this.items.push(item);
    const currentTotal = Number(this.total.replace(/[^0-9]+/g, ''));
    const newTotal = currentTotal + item.total;
    this.total = (newTotal / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  public createInvoice(): InvoiceModel {
    return {
      client: {
        name: this.client.name,
        email: this.client.email,
        phone: Number(this.client.phone.replace(/[^0-9]+/g, ''))
      },
      items: this.items,
      total: Number(this.total.replace(/[^0-9]+/g, '')),
      paid: this.paid,
      dueDate: moment(this.dueDate).unix() * 1000,
      dateSent: Date.now(),
      datePaid: 0,
      _id: this._id
    };
  }
}

class Item {
  public name: string;
  public total: string;
  public itemId = Math.floor(Math.random() * 1000000);
  public description: string;

  constructor(item?: InvoiceItem) {
    if (item) {
      this.name = item.name;
      this.total = item.total ? (item.total / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '';
      this.itemId = item.itemId;
      this.description = item.description;
    }
  }

  public createItem(): InvoiceItem {
    return {
      name: this.name,
      total: Number(this.total.replace(/[^0-9]+/g, '')),
      itemId: this.itemId,
      description: this.description
    };
  }
}

@Component({
  selector: 'kk-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePageComponent implements OnDestroy {

  private _unsubscribe$ = new Subject();

  public fetchError$ = new BehaviorSubject(false);

  public loading$ = new BehaviorSubject(false);

  public saving$ = new BehaviorSubject(false);

  public saveError$ = new BehaviorSubject(false);

  public saveSuccess$ = new BehaviorSubject(false);

  public invoiceModel = new Invoice();

  public invoiceItems: Item[] = [];

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

  @ViewChild('ItemTotalInput', { static: false })
  private _itemTotalInput: ElementRef<HTMLInputElement>;

  @ViewChild('ClientPhoneInput', { static: false })
  private _clientPhoneInput: ElementRef<HTMLInputElement>;

  constructor(
    private _router: Router,
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
          console.log('res:::: ', res.invoices[0]);
          this.loading$.next(false);
          if (res.error || !res.invoices || !res.invoices.length) {
            console.error(res.error);
            this.fetchError$.next(true);
            return;
          }
          this.fetchError$.next(false);
          this.invoiceModel.setInvoice(res.invoices[0]);
          this.invoiceItems = this.invoiceModel.items.map(i => new Item(i));
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
    this.currentItem = new Item(item);
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
      this.currentItem.total = `$${this.currentItem.total}`;
      this.invoiceItems.push(this.currentItem);
      this.invoiceModel.addItem(this.currentItem.createItem());
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

  private handleError(err: Error): void {
    this.saving$.next(false);
    this.saveError$.next(true);
    this.saveSuccess$.next(false);
    console.error(err);
  }

  public updateInvoice(newData: { [prop: string]: any }): void {
    if (this.validateInvoice()) {
      this.saving$.next(true);
      this._adminService.updateInvoice(this.invoiceModel._id, newData)
        .pipe(take(1))
        .subscribe(
          (res: InvoicesResponse) => {
            this.saving$.next(false);
            if (res.error) {
              console.error(res.error);
              this.fetchError$.next(true);
              return;
            }
            this.saveError$.next(false);
            this.saveSuccess$.next(true);
            this._cd.markForCheck();
          },
          this.handleError.bind(this)
        );
    }
  }

  public createAndSendInvoice(): void {
    if (this.validateInvoice()) {
      this.saving$.next(true);
      this._adminService.createInvoice(this.invoiceModel.createInvoice())
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
            if (res.invoices && res.invoices.length) {
              this.invoiceModel.setInvoice(res.invoices[0]);
            }
            this._cd.markForCheck();
          },
          this.handleError.bind(this)
        );
    }
  }

  public sendReminder(): void {
    this._adminService.sendReminder(this.invoiceModel._id)
      .pipe(take(1))
      .subscribe(
        (res: InvoicesResponse) => {
          this.invoiceModel.updateDateSent();
        },
        err => {
          console.error(err);
        }
      );
  }

  public deleteInvoice(): void {
    this._modalService.confirm(() => {
      this._adminService.deleteInvoice(this.invoiceModel.createInvoice())
        .pipe(take(1))
        .subscribe(
          (res: InvoicesResponse) => {
            this._router.navigate(['/admin/invoices']);
          },
          err => console.error(err)
        );
    });
  }

  public validateItemTotal(event: Event): void {
    const value = event.target['value'];
    if (value !== this.currentItem.total) {
      const noDecVal = value.replace('.', '');
      if (/^[0-9]+$/g.test(noDecVal)) {
        const valNum = +noDecVal;
        if (valNum === 0) {
          this.currentItem.total = this._itemTotalInput.nativeElement.value = '';
          return;
        }
        if (valNum < 10) {
          this.currentItem.total = this._itemTotalInput.nativeElement.value = `0.0${valNum}`;
          return;
        }
        if (valNum < 100) {
          this.currentItem.total = this._itemTotalInput.nativeElement.value = `0.${valNum}`;
          return;
        }
        if (valNum >= 100) {
          const numGroups = `${valNum}`.match(/^([0-9]*)([0-9]{2})$/);
          this.currentItem.total = this._itemTotalInput.nativeElement.value = `${numGroups[1]}.${numGroups[2]}`;
        }
      } else {
        this._itemTotalInput.nativeElement.value = this.currentItem.total;
      }
    }
  }

  public validateClientPhone(event: Event): void {
    let value = event.target['value'];
    if (value !== this.invoiceModel.client.phone) {
      value = value.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
      if (!value || (value.length <= 10 && /^[0-9]+$/g.test(value))) {
        const p1 = value.substr(0, 3);
        const p2 = value.substr(3, 3);
        const p3 = value.substr(6, 4);
        let p = '';
        if (p1) {
          p = p2 ? `(${p1})` : p1;
        }
        if (p2) {
          p += ` ${p2}`;
        }
        if (p3) {
          p += `-${p3}`;
        }
        this._clientPhoneInput.nativeElement.value = this.invoiceModel.client.phone = p;
      } else {
        this._clientPhoneInput.nativeElement.value = this.invoiceModel.client.phone;
      }
    }
  }

  public togglePaid(): void {
    this.invoiceModel.togglePaid();
    this.updateInvoice({ paid: this.invoiceModel.paid, datePaid: Date.now() });
  }

}
