import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalTemplates } from './modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public open$ = new BehaviorSubject(false);

  public open(): void {
    this.open$.next(true);
  }

  public close(): void {
    this.open$.next(false);
  }
}
