// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );

//////////////////////////////// My Code /////////////////////////////////////////////////////

// import { ApplicationConfig } from '@angular/core';
// import { provideHttpClient } from '@angular/common/http';
// import { provideRouter } from '@angular/router';
// // import { provideNGXLogger, NgxLoggerLevel } from 'ngx-logger';
// //import { provideNGXLogger, NgxLoggerLevel } from 'ngx-logger'; // ✅ Correct Import
// import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
// import { routes } from './app/app.routes';  // ✅ Correct path

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideHttpClient(),
//     provideRouter(routes),
//     // provideNGXLogger({
//     //   level: NgxLoggerLevel .DEBUG, // Debug level
//     //   serverLoggingUrl: '/api/logs', // Optional: Remote logging server
//     //   serverLogLevel: NgxLoggerLevel .ERROR, // Log errors to remote server
//     //   disableConsoleLogging: false, // Set to true in production
//     // }),
//     LoggerModule.forRoot({
//       level: NgxLoggerLevel.DEBUG,
//       serverLogLevel: NgxLoggerLevel.ERROR,
//       disableConsoleLogging: false
//     }),
//   ],
// };


import { ApplicationConfig, importProvidersFrom } from '@angular/core';
//import { provideHttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { routes } from './app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),  // ✅ Fetch API enabled
    provideRouter(routes),
    importProvidersFrom(
      LoggerModule.forRoot({
        level: NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.INFO, //For PRod - NgxLoggerLevel.ERROR,  
        disableConsoleLogging: false
      })
    )
  ],
};