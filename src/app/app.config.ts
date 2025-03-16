import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';
import { 
  NGXLogger, 
  NgxLoggerLevel, 
  TOKEN_LOGGER_CONFIG, 
  TOKEN_LOGGER_CONFIG_ENGINE_FACTORY, 
  TOKEN_LOGGER_METADATA_SERVICE, 
  TOKEN_LOGGER_RULES_SERVICE,
  TOKEN_LOGGER_MAPPER_SERVICE,
  TOKEN_LOGGER_WRITER_SERVICE,
  TOKEN_LOGGER_SERVER_SERVICE,
  NGXLoggerConfigEngineFactory,
  NGXLoggerRulesService,   // ✅ Add the missing rule service
  NGXLoggerMetadataService,
  NGXLoggerMapperService,
  NGXLoggerWriterService,
  NGXLoggerServerService
} from 'ngx-logger';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideOAuthClient(),
    NGXLogger,
    {  
      provide: TOKEN_LOGGER_CONFIG,
      useValue: {
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR,
        disableConsoleLogging: false,
      },
    },
    { provide: TOKEN_LOGGER_CONFIG_ENGINE_FACTORY, useClass: NGXLoggerConfigEngineFactory },
    { provide: TOKEN_LOGGER_METADATA_SERVICE, useClass: NGXLoggerMetadataService }, // ✅ Proper service
    { provide: TOKEN_LOGGER_RULES_SERVICE, useClass: NGXLoggerRulesService },       // ✅ Proper service
    { provide: TOKEN_LOGGER_MAPPER_SERVICE, useClass: NGXLoggerMapperService },     // ✅ Proper service
    { provide: TOKEN_LOGGER_WRITER_SERVICE, useClass: NGXLoggerWriterService },     // ✅ Proper service
    { provide: TOKEN_LOGGER_SERVER_SERVICE, useClass: NGXLoggerServerService }      // ✅ Proper service
  ],
};
