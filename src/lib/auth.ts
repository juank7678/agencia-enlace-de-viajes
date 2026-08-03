const ADMIN_TOKEN_KEY = 'enlace_admin_token';
const ADMIN_TOKEN_EXPIRY_KEY = 'enlace_admin_token_expiry';
const TOKEN_EXPIRY_HOURS = 8;

export function setAdminToken(token: string): void {
  try {
    const expiryTime = new Date().getTime() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (err) {
    console.error('Error saving admin token:', err);
  }
}

export function getAdminToken(): string | null {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);

    if (!token || !expiry) return null;

    const expiryTime = parseInt(expiry, 10);
    const now = new Date().getTime();

    if (now > expiryTime) {
      clearAdminToken();
      return null;
    }

    return token;
  } catch (err) {
    console.error('Error reading admin token:', err);
    return null;
  }
}

export function clearAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_EXPIRY_KEY);
  } catch (err) {
    console.error('Error clearing admin token:', err);
  }
}

export function isAdminTokenValid(): boolean {
  return getAdminToken() !== null;
}

export function getTokenExpiryTime(): number {
  try {
    const expiry = localStorage.getItem(ADMIN_TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    const expiryTime = parseInt(expiry, 10);
    const now = new Date().getTime();
    return Math.max(0, expiryTime - now);
  } catch (err) {
    console.error('Error getting token expiry:', err);
    return 0;
  }
}
