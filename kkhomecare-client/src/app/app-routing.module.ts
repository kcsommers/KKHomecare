import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import { AdminShellComponent } from './app-shell/admin-shell/admin-shell.component';
import { AuthGuard } from '@kk/core';


const routes: Routes = [
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/admin/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule)
      },
    ]
  },
  {
    path: 'admin/login',
    loadChildren: () => import('./pages/admin/login-page/login-page.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home-page/home-page.module').then(m => m.HomePageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./pages/about-page/about-page.module').then(m => m.AboutPageModule)
      },
      {
        path: 'services',
        loadChildren: () => import('./pages/services-page/services-page.module').then(m => m.ServicesPageModule)
      },
      {
        path: 'services/:id',
        loadChildren: () => import('./pages/service-page/service-page.module').then(m => m.ServicePageModule)
      },
      {
        path: 'photos',
        loadChildren: () => import('./pages/photos-page/photos-page.module').then(m => m.PhotosPageModule)
      },
      {
        path: 'contact',
        loadChildren: () => import('./pages/contact-page/contact-page.module').then(m => m.ContactPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
