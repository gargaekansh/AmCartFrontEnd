import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  try {
    let authToken: string | null = null;

    // ✅ Only access localStorage in the browser
    if (isBrowser) {
      authToken = localStorage.getItem('authToken');
    }

    if (authToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }

    return next(req);
  } catch (error) {
    console.error('❌ Auth Interceptor Error:', error);
    return next(req);
  }
};
