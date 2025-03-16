import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OAuthService, AuthConfig, OAuthEvent } from 'angular-oauth2-oidc';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable, of, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import { authConfig, passwordGrantConfig } from '../auth/auth.config';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

/**
 * Authentication service that integrates with IdentityServer4 using OAuth2/OIDC.
 * Provides login, logout, token management, and user profile retrieval.
 * Uses NGX Logger for debugging authentication flow.
 */
@Injectable({
  providedIn: 'root',
})
export class IdentityServer4AuthService {
  private userProfile: any = null;
  private userInfoSubject = new BehaviorSubject<any>(null);
  public userInfo$ = this.userInfoSubject.asObservable();
  private isBrowser: boolean; // ✅ Flag for browser environment

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,
    private logger: NGXLogger,
    @Inject(PLATFORM_ID) private platformId: object // ✅ Detects platform type
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // ✅ Detects if running in the browser

    if (this.isBrowser) {
      this.configureAuth(); // ✅ Only configure OAuth in the browser
      this.handleAuthEvents();
    } else {
      this.logger.warn('⚠️ Skipping OAuth2 initialization (not in browser)');
    }
  }

  /**
   * Configures OAuth2 authentication settings.
   */
  private configureAuth() {
    this.logger.debug('Initializing OAuth2 authentication...');
    this.oauthService.configure(authConfig);

    if (this.isBrowser) {
      this.oauthService.setStorage(localStorage);
    }

    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          this.logger.info('✅ User is authenticated. Fetching profile...');
          this.loadUserProfile();
        } else {
          this.logger.warn('⚠️ User is NOT authenticated.');
        }
      })
      .catch((error) => {
        this.logger.error('❌ OAuth2 initialization failed:', error);
      });
  }

  /**
   * Handles authentication-related events.
   */
  private handleAuthEvents() {
    if (!this.isBrowser) return; // ✅ Skip event handling in SSR

    this.oauthService.events
      .pipe(filter((event: OAuthEvent) => event.type === 'token_received'))
      .subscribe(() => {
        this.logger.info('🔄 Token received. Updating user profile...');
        this.loadUserProfile();
      });

    this.oauthService.events
      .pipe(filter((event: OAuthEvent) => event.type === 'session_terminated'))
      .subscribe(() => {
        this.logger.warn('⚠️ Session terminated. Logging out...');
        this.logout();
      });
  }

  /**
   * Initiates login process using password grant flow.
   */
  login(username: string, password: string): Observable<any> {
    if (!this.isBrowser) return of(null); // ✅ Prevent login in SSR

    this.logger.info('🔐 Starting login process...');
    const params = new HttpParams()
      .set('grant_type', passwordGrantConfig.grantType)
      .set('client_id', passwordGrantConfig.clientId)
      .set('username', username)
      .set('password', password)
      .set('scope', passwordGrantConfig.scope);

    return this.http.post(`${environment.identityServerURL}/connect/token`, params);
  }

  /**
   * Handles login response and stores tokens.
   */
  handleLoginResponse(response: any) {
    if (!this.isBrowser) return; // ✅ Prevent token storage in SSR

    this.oauthService.tryLogin({
      customHashFragment: response.access_token,
      disableOAuth2StateCheck: true,
    });

    localStorage.setItem('authToken', response.access_token);
    this.logger.info('✅ Login successful. Tokens stored.');
    this.loadUserProfile();
  }

  /**
   * Logs out the user.
   */
  logout() {
    if (!this.isBrowser) return; // ✅ Prevent logout in SSR

    this.logger.info('🚪 User logging out...');
    try {
      this.oauthService.logOut();
      localStorage.removeItem('authToken');
      this.userInfoSubject.next(null);
    } catch (error) {
      this.logger.error('❌ Logout error:', error);
    }
  }

  /**
   * Checks if user is authenticated.
   */
  isAuthenticated(): boolean {
    return this.isBrowser ? !!localStorage.getItem('authToken') : false;
  }

  /**
   * Retrieves access token.
   */
  getAccessToken(): string | null {
    return this.isBrowser ? this.oauthService.getAccessToken() : null;
  }

  /**
   * Loads user profile from IdentityServer.
   */
  loadUserProfile(): Promise<any> {
    if (!this.isBrowser) return Promise.resolve(null); // ✅ Skip in SSR

    return this.oauthService
      .loadUserProfile()
      .then((profile) => {
        this.userProfile = profile;
        this.userInfoSubject.next(profile);
        this.logger.info('✅ User profile loaded:', profile);
        return profile;
      })
      .catch((error) => {
        this.logger.error('❌ Failed to load user profile:', error);
        throw error;
      });
  }

  /**
   * Decodes JWT token and saves it.
   */
  decodeToken(token: string): any {
    if (!this.isBrowser) return null; // ✅ Prevent token processing in SSR

    localStorage.setItem('authToken', token);
    return jwtDecode(token);
  }
}
