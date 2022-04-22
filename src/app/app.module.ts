import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import * as fr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { CalculAbatementHeaderComponent } from './calcul-abatement-header/calcul-abatement-header.component';
import { CalculAbatementHomeComponent } from './calcul-abatement-home/calcul-abatement-home.component';
import { AppRoutingModule } from './app-routing.module';
import { CalculAbatementMonthlyComponent } from './calcul-abatement-monthly/calcul-abatement-monthly.component';
import { ErrorIntercept } from './error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CalculAbatementHeaderComponent,
    CalculAbatementHomeComponent,
    CalculAbatementMonthlyComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    { provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
 }
