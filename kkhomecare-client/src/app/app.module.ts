import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaIconsComponent } from 'src/fa-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { jwtProvider, httpErrorProvider } from '@kk/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    jwtProvider,
    httpErrorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    FaIconsComponent.init(library);
  }
}
