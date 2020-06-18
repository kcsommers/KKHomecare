import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AdminService, MessagesResponse, MessageModel } from '@kk/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'kk-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesPageComponent implements OnInit {

  private _lastId: string;

  public fetchError = false;

  public messages: MessageModel[] = [];

  public loading = true;

  constructor(private _adminService: AdminService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getMessages();
  }

  public getMessages(): void {
    this._adminService.getMessages(this._lastId)
      .pipe(take(1))
      .subscribe(
        (res: MessagesResponse) => {
          this.loading = false;
          if (res && res.messages && res.messages.length) {
            this.messages.push(...res.messages);
            this._lastId = this.messages[this.messages.length - 1]._id;
          }
          this._cd.markForCheck();
        },
        err => {
          this.loading = false;
          console.error(err);
          if (!this.messages.length) {
            this.fetchError = true;
          }
          this._cd.markForCheck();
        }
      )
  }

}
