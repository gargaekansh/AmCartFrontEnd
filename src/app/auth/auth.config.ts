import { AuthConfig } from 'angular-oauth2-oidc';

/**
 * OAuth2/OpenID Connect configuration for IdentityServer4.
 */
export const authConfig: AuthConfig = {
  issuer: 'https://your-identity-server-url', // Identity Server URL
  clientId: 'angular-client', // Registered Client ID
  redirectUri: window.location.origin + '/home', // Redirect after login
  postLogoutRedirectUri: window.location.origin + '/home', // Redirect after logout
  responseType: 'code', // Authorization Code Flow (PKCE enabled)
  scope:
    'openid profile address offline_access roles shoppinggateway.fullaccess shoppingaggregator.fullaccess catalogapi.fullaccess',
    requireHttps: window.location.protocol === 'https:', // ✅ Use HTTPS only in production
  showDebugInformation: true, // Enable debug logs for development
  oidc: true, // Enable OpenID Connect
  useSilentRefresh: true, // Enable silent token refresh
  timeoutFactor: 0.75, // Adjust session timeout handling
  sessionChecksEnabled: true, // Enable session validation
  storage: sessionStorage, // Store tokens securely in sessionStorage
};
