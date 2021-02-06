import { verify } from 'jsonwebtoken';

/**
 * sub - subject, token issuer
 * role - basic role for the token - [Anonymous, Member, Owner]
 * scopes - comma separated scopes that contains the actions allowed for the issuer ex: "s3:read_only"
 */
export interface UserAccessTokenPayload {
  sub: string;
  role?: string;
  scopes?: string;
}

/**
 * For added security, we can also re-fetch the user (issuer) using using the sub,
 * and validating if the token payload's got the proper role & scopes
 *
 * If the user data in the db does not match the user data in the token payload,
 * there's a chance the token secret could've been compromised
 *
 * @param accessToken
 */
export function authenticateToken(accessToken: string): UserAccessTokenPayload | null {
  if (!accessToken || !process.env.ACCESS_TOKEN_SECRET) return null;

  try {
    const accessTokenPayload = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    ) as UserAccessTokenPayload;
    const { sub } = accessTokenPayload;
    if (!sub.length) return null;
    return accessTokenPayload;
  } catch (e) {
    return null;
  }
}
