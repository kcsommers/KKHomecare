import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaIconsComponent } from 'src/fa-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { jwtProvider, httpErrorProvider } from '@kk/core';
import { AppShellModule } from './app-shell/app-shell.module';
import { AdminShellModule } from './app-shell/admin-shell/admin-shell.module';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppShellModule,
    AdminShellModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    jwtProvider,
    httpErrorProvider
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    FaIconsComponent.init(library);
  }
}
