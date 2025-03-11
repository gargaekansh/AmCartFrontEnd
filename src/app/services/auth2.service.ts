import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig, OAuthEvent } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators'; // ✅ Fix: Import `filter` separately
import { NGXLogger } from 'ngx-logger';
import { authConfig } from '../auth/auth.config'; // ✅ Import Auth Configuration

/**
 * Authentication service that integrates with IdentityServer4 using OAuth2/OIDC.
 * Provides login, logout, token management, and user profile retrieval.
 * Uses NGX Logger for debugging authentication flow.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userProfile: any = null; // Holds user profile data

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,
    private logger: NGXLogger
  ) {
    this.configureAuth(); // Configure OAuth on service initialization
    this.handleAuthEvents(); // Listen for authentication-related events
  }

  /**
   * Configures OAuth2 authentication settings.
   */
  private configureAuth() {
    this.logger.debug('Initializing OAuth2 authentication...');

    // Apply authentication configuration from auth.config.ts
    this.oauthService.configure(authConfig);

    // Automatically try login if a valid session exists
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
   * Handles authentication-related events such as token updates and session termination.
   */
  private handleAuthEvents() {
    // Listen for token received event and update user profile
    this.oauthService.events
      .pipe(filter((event: OAuthEvent) => event.type === 'token_received'))
      .subscribe(() => {
        this.logger.info('🔄 Token received. Updating user profile...');
        this.loadUserProfile();
      });

    // Listen for session termination (logout from another tab or expired session)
    this.oauthService.events
      .pipe(filter((event: OAuthEvent) => event.type === 'session_terminated'))
      .subscribe(() => {
        this.logger.warn('⚠️ Session terminated. Logging out...');
        this.logout();
      });
  }

  /**
   * Initiates the login process by redirecting to the Identity Server login page.
   */
  login() {
    this.logger.info('🔐 Starting login process...');
    try {
      this.oauthService.initLoginFlow();
    } catch (error) {
      this.logger.error('❌ Login error:', error);
    }
  }

  /**
   * Logs out the user and clears session data.
   */
  logout() {
    this.logger.info('🚪 User logging out...');
    try {
      this.oauthService.logOut();
    } catch (error) {
      this.logger.error('❌ Logout error:', error);
    }
  }

  /**
   * Checks if the user is currently authenticated.
   * @returns {boolean} True if the user has a valid access token.
   */
  isLoggedIn(): boolean {
    const status = this.oauthService.hasValidAccessToken();
    this.logger.debug(`🔎 Login status: ${status}`);
    return status;
  }

  /**
   * Retrieves the stored access token.
   * @returns {string | null} The access token if available, otherwise null.
   */
  getAccessToken(): string | null {
    const token = this.oauthService.getAccessToken();
    if (token) {
      this.logger.debug('✅ Access token retrieved successfully.');
    } else {
      this.logger.warn('⚠️ Access token is missing or invalid.');
    }
    return token;
  }

  /**
   * Loads the user's profile from the Identity Server.
   */
  loadUserProfile() {
    this.oauthService
      .loadUserProfile()
      .then((profile) => {
        this.userProfile = profile;
        this.logger.info('✅ User profile loaded:', profile);
      })
      .catch((error) => {
        this.logger.error('❌ Failed to load user profile:', error);
      });
  }

  /**
   * Returns an observable for the user profile.
   * If the profile is already loaded, returns it directly.
   */
  getUserProfile(): Observable<any> {
    // If user profile is already cached, return it as an observable
    if (this.userProfile) {
      return of(this.userProfile);
    }

    // Otherwise, fetch it from the OAuth service and convert the promise to an observable
    return from(
      this.oauthService.loadUserProfile().then(
        (profile) => {
          this.userProfile = profile;
          this.logger.debug('✅ User profile updated.');
          return profile;
        },
        (error) => {
          this.logger.error('❌ Error loading user profile:', error);
          return null;
        }
      )
    );
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  refreshToken() {
    this.logger.info('🔄 Refreshing access token...');
    this.oauthService
      .refreshToken()
      .then(() => {
        this.logger.info('✅ Access token refreshed successfully.');
      })
      .catch((error) => {
        this.logger.error('❌ Token refresh failed:', error);
      });
  }
}
