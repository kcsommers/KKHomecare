import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesPageComponent } from './messages-page.component';


const routes: Routes = [
  {
    path: '',
    component: MessagesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesPageRoutingModule { }
