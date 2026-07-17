import { Role } from '@prisma/client';

// What we encode inside the access token. Kept minimal on purpose —
// anything else (profile completion %, subscription tier, etc.) should be
// fetched fresh from the DB, not trusted from an old token payload.
export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  role: Role;
}

// Refresh tokens only need enough to look the user up and rotate the token.
export interface RefreshTokenPayload {
  sub: string;
  tokenVersion?: string; // reserved for future "log out everywhere" support
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Attached to Request by the JWT strategies.
export interface RequestUser {
  id: string;
  email: string;
  role: Role;
}
