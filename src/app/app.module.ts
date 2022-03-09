import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MainInterceptor } from './main.interceptor';
import { environment } from 'src/environments/environment';
import { registerLocaleData } from '@angular/common';
import localePe from '@angular/common/locales/es-PE';
registerLocaleData(localePe);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: 'configuration', useFactory: AppModule.getEnv },
    { provide: LOCALE_ID, useValue: 'es-PE' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  static getEnv() {
    return { api: environment.api };
  }
}
