
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withHashLocation(), withComponentInputBinding()),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
