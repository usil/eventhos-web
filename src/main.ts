import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

fetch('/settings.json')
  .then((response) => response.json())
  .then((config) => {
    environment.title = config.title;
    environment.api = config.api;
  })
  .catch((error) => {
    // console.log(error);
  })
  .finally(() => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
