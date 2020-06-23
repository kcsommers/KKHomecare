import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public open$ = new BehaviorSubject(false);

  public confirm$ = new BehaviorSubject(false);

  private confirmCb: () => any;

  public open(): void {
    this.open$.next(true);
  }

  public close(): void {
    this.open$.next(false);
  }

  public confirm(cb: () => any): void {
    this.confirmCb = cb;
    this.confirm$.next(true);
  }

  public closeConfirm(): void {
    this.confirmCb = undefined;
    this.confirm$.next(false);
  }

  public confirmed(): void {
    this.confirmCb();
    this.closeConfirm();
  }
}
