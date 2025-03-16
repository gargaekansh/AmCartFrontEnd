import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

/**
 * Determines if the application is running in a browser.
 * This check prevents Server-Side Rendering (SSR) issues.
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Securely configure redirect URIs for login and logout.
 * Ensures compatibility with SSR.
 */
const redirectUri = isBrowser ? window.location.origin + '/home' : '';
const postLogoutRedirectUri = isBrowser ? window.location.origin + '/home' : '';

/**
 * Enforce HTTPS usage except for development (SSR-safe).
 */
const requireHttps = isBrowser ? window.location.protocol === 'https:' : true;

/**
 * OAuth2/OpenID Connect configuration for IdentityServer4.
 */
export const authConfig: AuthConfig = {
  issuer: environment.identityServerURL, // Identity Server URL (e.g., "https://identity.example.com")
  clientId: 'angular-client', // Client ID registered in IdentityServer
  redirectUri, // Secure Redirect after login (browser safe)
  postLogoutRedirectUri, // Redirect after logout (browser safe)
  responseType: 'code', // Use Authorization Code Flow with PKCE
  scope: 'openid profile address offline_access roles shoppinggateway.fullaccess shoppingaggregator.fullaccess catalogapi.fullaccess',
  requireHttps: false, // Ensures HTTPS is required (except for local development)
  showDebugInformation: true, // Enable debug logs (disable in production)
  oidc: true, // Enable OpenID Connect
  useSilentRefresh: true, // Use silent refresh to maintain login session
  timeoutFactor: 0.75, // Adjusts session expiration timing for better user experience
  sessionChecksEnabled: true, // Enables periodic session validation
  skipIssuerCheck: true, // Allows self-signed certificates (use with caution)
  // storage: sessionStorage, // Uncomment to store tokens in session storage
};

/**
 * OAuth2 Password Grant Flow Configuration
 * Used for trusted clients where the app directly handles user credentials.
 */
export const passwordGrantConfig = {
  grantType: 'password',
  clientId: 'angular-client-password', // Separate Client ID for Password Grant Flow
  scope: 'openid profile offline_access email catalogapi.fullaccess',
  strictDiscoveryDocumentValidation: false, // Disables strict issuer validation
  requireHttps: false, // Allows HTTP for testing (set to true in production)
};

/**
 * OAuth2 Authorization Code Grant Configuration
 * Used for browser-based authentication with PKCE.
 */
export const authorizationCodeGrantConfig = {
  grantType: 'authorization_code',
  clientId: 'angular-client', // Client ID for standard Authorization Code Flow
  scope: 'openid profile address offline_access roles shoppinggateway.fullaccess shoppingaggregator.fullaccess catalogapi.fullaccess',
  redirectUri, // Secure redirect after login
  postLogoutRedirectUri, // Secure redirect after logout
  requirePkce: true, // Enforces Proof Key for Code Exchange (PKCE)
  allowAccessTokensViaBrowser: true, // Allows token storage in browser (use with caution)
  allowOfflineAccess: true, // Enables refresh tokens
  alwaysIncludeUserClaimsInIdToken: true, // Includes user claims in ID token
  requireClientSecret: false, // No client secret required for public clients
  accessTokenLifetime: 300, // Access token expiration time in seconds (adjust as needed)
};
