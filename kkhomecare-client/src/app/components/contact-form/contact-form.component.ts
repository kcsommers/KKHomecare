import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { ContactService } from '@kk/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'kk-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent {

  @Input()
  public title = 'Send Us a Message!';

  public guid = Math.floor(Math.random() * 1000000);

  public name = '';

  public email = '';

  public phone = '';

  public message = '';

  public nameError = false;

  public emailError = false;

  public phoneError = false;

  public messageError = false;

  public submitted = false;

  public submitError = false;

  @ViewChild('PhoneInput', { static: false })
  private _phoneInput: ElementRef<HTMLInputElement>;

  constructor(private _contactService: ContactService, private _cd: ChangeDetectorRef) { }

  private validate(): boolean {
    this.nameError = !this.name;
    this.emailError = !this.email;
    this.phoneError = !this.phone;
    this.messageError = !this.message;
    this._cd.markForCheck();
    return (
      !this.nameError &&
      !this.emailError &&
      !this.phoneError &&
      !this.messageError
    );
  }

  public submit(): void {
    if (this.validate()) {
      this._contactService.submitForm({
        name: this.name,
        email: this.email,
        phone: Number(this.phone.replace(/[^0-9]+/g, '')),
        message: this.message
      })
        .pipe(take(1))
        .subscribe(
          res => {
            this.submitted = true;
            this._cd.markForCheck();
          },
          err => {
            console.error(err);
            this.submitError = true;
            this._cd.markForCheck();
          }
        );
      this.name = '';
      this.email = '';
      this.phone = '';
      this.message = '';
    }
  }

  public validatePhone(event: Event): void {
    let value = event.target['value'];
    if (value !== this.phone) {
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
        this._phoneInput.nativeElement.value = this.phone = p;
      } else {
        this._phoneInput.nativeElement.value = this.phone;
      }
    }
  }

}
