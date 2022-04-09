import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import * as fr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { CalculAbatementHeaderComponent } from './calcul-abatement-header/calcul-abatement-header.component';
import { CalculAbatementHomeComponent } from './calcul-abatement-home/calcul-abatement-home.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculAbatementHeaderComponent,
    CalculAbatementHomeComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
 }
