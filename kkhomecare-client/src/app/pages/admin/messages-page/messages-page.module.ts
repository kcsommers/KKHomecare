import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesPageRoutingModule } from './messages-page-routing.module';
import { MessagesPageComponent } from './messages-page.component';
import { LoadingSpinnerModule } from '@kk/components';


@NgModule({
  declarations: [MessagesPageComponent],
  imports: [
    CommonModule,
    MessagesPageRoutingModule,
    LoadingSpinnerModule
  ],
  exports: [MessagesPageComponent]
})
export class MessagesPageModule { }
