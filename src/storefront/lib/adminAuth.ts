import crypto from 'crypto';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return hash === key;
  } catch (err) {
    return false;
  }
}

export function createAdminSessionToken(adminNumber: string, email: string, role: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ 
    sub: adminNumber, 
    email,
    role,
    exp: Date.now() + 1000 * 60 * 60 * 24 // 24 hours
  })).toString('base64url');

  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_kindard_2026';
  const signature = crypto.createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string): any | null {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return null;

    const secret = process.env.ADMIN_SESSION_SECRET || 'fallback_secret_kindard_2026';
    const expectedSignature = crypto.createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    // Make lengths equal before using timingSafeEqual to avoid errors
    const sigBuf = Buffer.from(signature);
    const expSigBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expSigBuf.length) return null;

    if (crypto.timingSafeEqual(sigBuf, expSigBuf)) {
      const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
      if (decoded.exp < Date.now()) return null; // Expired
      return decoded;
    }
  } catch (err) {
    return null;
  }
  return null;
}
