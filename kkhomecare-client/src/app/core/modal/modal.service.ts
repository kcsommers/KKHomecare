import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalTemplates } from './modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public open$ = new BehaviorSubject({ isOpen: false, template: null });

  public open(template: ModalTemplates): void {
    this.open$.next({ isOpen: true, template });
  }

  public close(): void {
    this.open$.next({ isOpen: false, template: false });
  }
}
