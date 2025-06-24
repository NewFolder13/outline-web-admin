import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {apiHttpClientCreator, ApiService} from "./core/services/api.service";
import {HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {NgbToast, NgbToastModule} from "@ng-bootstrap/ng-bootstrap";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {provide: ApiService, useFactory: apiHttpClientCreator, deps: [HttpClient]},
    provideRouter(routes),
  ],
};
