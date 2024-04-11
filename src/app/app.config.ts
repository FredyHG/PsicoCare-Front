import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi
} from "@angular/common/http";
import {HttpRequestInterceptor} from "./helpers/HttpRequestInterceptor";
import {provideNgxMask} from "ngx-mask";
import {BrowserAnimationsModule, provideAnimations} from "@angular/platform-browser/animations";
import {MessageService} from "primeng/api";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),MessageService, importProvidersFrom([BrowserModule, BrowserAnimationsModule]), provideClientHydration(), provideHttpClient(), provideNgxMask(), provideHttpClient(
    withInterceptorsFromDi(), withFetch()
  ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },]
};
