import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesPageRoutingModule } from './messages-page-routing.module';
import { MessagesPageComponent } from './messages-page.component';


@NgModule({
  declarations: [MessagesPageComponent],
  imports: [
    CommonModule,
    MessagesPageRoutingModule
  ],
  exports: [MessagesPageComponent]
})
export class MessagesPageModule { }
