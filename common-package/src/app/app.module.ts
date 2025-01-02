import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './app-material.module';
import { BenrazNgxCommonModule } from '@josephbenraz/npm-common';
import { LayoutComponent } from './layout/layout.component';
import { NgxCommonDemoComponent } from './ngx-common-demo/ngx-common-demo.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AppRoutingModule,
    BenrazNgxCommonModule.forRoot({
      autoDetermineInternalUrls: false,
      apiBaseUrl: 'http://apibaseurl',
      authorizationUrl: 'http://authorizationurl',
      companySubdomain: 'benraz'
    })
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    NgxCommonDemoComponent
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
