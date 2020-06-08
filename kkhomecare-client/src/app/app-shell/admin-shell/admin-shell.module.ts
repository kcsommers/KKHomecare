import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminShellRoutingModule } from './admin-shell-routing.module';
import { AdminShellComponent } from './admin-shell.component';


@NgModule({
  declarations: [AdminShellComponent],
  imports: [
    CommonModule,
    AdminShellRoutingModule
  ],
  exports: [AdminShellComponent]
})
export class AdminShellModule { }
