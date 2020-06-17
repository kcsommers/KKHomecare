import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
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
  public title = 'Send Us a Message!'

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
        phone: this.phone,
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

}
