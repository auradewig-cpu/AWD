// Admin login identity. The password is NOT stored here (or anywhere in the
// client bundle) anymore — it lives only in the server env (ADMIN_PASSWORD) and
// is verified by POST /api/auth, which returns a short-lived session token.
// This email is a non-secret UX default for the login form only.
export const ADMIN_CREDENTIALS = {
  email: 'admin@awd.com',
};
