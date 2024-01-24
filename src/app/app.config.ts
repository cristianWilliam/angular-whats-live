import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { UserService } from './users/user.service';

const appInitializerProvider = (userService: UserService) => {
  return () => {
    userService.trySyncLocalStorage();
  } 
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerProvider,
      deps: [ UserService ],
      multi: true
    }
  ]
};
