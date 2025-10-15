import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { StorageOption, withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { routes } from './app.routes';
import { CartState } from './cart/cart.state';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore([CartState]),
    withNgxsStoragePlugin({
      keys: ['cart'],       // which state to persist
      storage: StorageOption.SessionStorage // use sessionStorage instead of localStorage
    })
  ]
};
