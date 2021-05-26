import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Components from './components/index';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    Components.AppComponent,
    Components.HeaderComponent,
    Components.PostCreateComponent,
    Components.PostListComponent,
    Components.LoginComponent,
    Components.SignupComponent,
    Components.FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'decreasing',
      preventDuplicates: true,
      closeButton: true
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [Components.AppComponent]
})
export class AppModule { }
