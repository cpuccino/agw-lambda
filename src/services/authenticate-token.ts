import { verify } from 'jsonwebtoken';

/**
 * sub - subject, token issuer
 * role - basic role for the token - [Anonymous, Member, Owner]
 * scopes - comma separated scopes that contains the actions allowed for the issuer ex: "ec2:full_read"
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
export function authenticateToken(
  authorizationToken: string
): UserAccessTokenPayload | null {
  const [type = '', accessToken] = authorizationToken.split(/\s+/);
  if (type.toLowerCase() !== 'bearer' || !accessToken || !process.env.ACCESS_TOKEN_SECRET)
    return null;

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

export const ROLES = {
  anonymous: 'anonymous',
  member: 'member',
  owner: 'owner'
};

export interface AuthorizeTokenParams {
  authorizationToken: string;
  requireAccount?: boolean;
  scopesRequired: string;
}

/**
 * Validates that the provided authorization token contains
 * the proper role and scopes
 *
 * If an account is required, and the token role is anonymous
 * or if the token doesn't have "ALL" the scopes required
 * validation fails
 *
 * @param params
 */
export function validateTokenAuthorization(params: AuthorizeTokenParams): boolean {
  const { authorizationToken, requireAccount, scopesRequired } = params;

  const userAccessTokenPayload = authenticateToken(authorizationToken);
  if (!userAccessTokenPayload) return false;

  const { role = '', scopes = '' } = userAccessTokenPayload;

  const scopesRequiredArray = scopesRequired
    .split(',')
    .map(s => s.toLowerCase().trim())
    .filter(s => s);
  const userScopesArray = scopes.split(',').map(s => s.toLowerCase().trim());

  if (requireAccount && (!role || role.toLowerCase() === ROLES.anonymous)) return false;

  for (const scopeRequired of scopesRequiredArray) {
    if (!userScopesArray.includes(scopeRequired)) return false;
  }

  return true;
}
