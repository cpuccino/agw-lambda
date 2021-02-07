import dotenv from 'dotenv';
import path from 'path';
import { sign } from 'jsonwebtoken';
import { authenticateToken, validateTokenAuthorization } from './authenticate-token';
import { ROLES } from '../services/authenticate-token';
import { BEARER_TOKEN } from '../constants/auth';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.test') });

describe('This module performs authentication to the access token and decodes the user payload', function () {
  const userPayload = {
    sub: '0',
    role: ROLES.member,
    scopes: 'ec2:full_read'
  };

  it('should return null if the sub is empty', async function () {
    const token = BEARER_TOKEN + ' ' + sign(
      { ...userPayload, sub: '' },
      process.env.ACCESS_TOKEN_SECRET || ''
    );
    const decoded = authenticateToken(token);

    expect(decoded).toBeNull();
  });

  it('should return null, if bearer is not prefixed to the token', async function () {
    const token = sign({ ...userPayload }, process.env.ACCESS_TOKEN_SECRET || '');
    const decoded = authenticateToken(token);

    expect(decoded).toBeNull();
  });

  it('should contain the sub, role?, and scopes?', async function () {
    const token = BEARER_TOKEN + ' ' + sign({ ...userPayload }, process.env.ACCESS_TOKEN_SECRET || '');
    const decoded = authenticateToken(token);

    expect(decoded).toEqual(
      expect.objectContaining({
        sub: '0',
        role: ROLES.member,
        scopes: 'ec2:full_read'
      })
    );
  });

  it('should return null if the token is invalid', async function () {
    expect(authenticateToken(BEARER_TOKEN + ' ' + '-')).toBeNull();
    expect(authenticateToken(BEARER_TOKEN + ' ' + '')).toBeNull();
    expect(authenticateToken(BEARER_TOKEN + ' ' + '123456789')).toBeNull();

    const token = BEARER_TOKEN + ' ' + sign({ ...userPayload }, process.env.ACCESS_TOKEN_SECRET || '', {
      expiresIn: '0'
    });
    await new Promise(res => setTimeout(res, 10));
    expect(authenticateToken(token)).toBeNull();
  });
});

describe('This module performs authorization to the access token and decodes the user payload', function() {
  const baseUserPayload = {
    sub: '0',
    role: ROLES.anonymous,
    scopes: 'ec2:full_read'
  };

  it('should fail authorization if the token is invalid', function() {
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: '',
      scopesRequired: ''
    })).toBe(false);
  });

  it('should fail authorization if an account is required, but the token role is anonymous', function() {
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: ''
    })).toBe(false);
  });

  it('should fail authorization if the token doesn\'t have all the required scopes', function() {
    const authorizationToken = BEARER_TOKEN + ' ' + sign({ ...baseUserPayload }, process.env.ACCESS_TOKEN_SECRET || '');
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken,
      scopesRequired: 'ec2:full_read,ec2:full_write'
    })).toBe(false);
    expect(validateTokenAuthorization({
      requireAccount: false,
      authorizationToken,
      scopesRequired: 'ec2:full_read,ec2:full_write'
    })).toBe(false);
  });

  it('should authorize if there\'s no account and scope required', function() {
    expect(validateTokenAuthorization({
      requireAccount: false,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: ''
    })).toBe(true);

    expect(validateTokenAuthorization({
      requireAccount: false,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: '' }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: ''
    })).toBe(true);
  });

  it('should authorize if the token contains all the required roles & scopes', function() {
    expect(validateTokenAuthorization({
      requireAccount: false,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: 'ec2:full_read' }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: 'ec2:full_read,'
    })).toBe(true);
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: 'ec2:full_read', role: ROLES.member }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: 'ec2:full_read,'
    })).toBe(true);
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: 'ec2:full_read,ec2:full_write', role: ROLES.member }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: 'ec2:full_read'
    })).toBe(true);
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: 'ec2:full_read__,ec2:full_write' }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: 'ec2:full_read'
    })).toBe(false);
  });

  it('should fail authorization if the token contains all the required scopes but the role', function() {
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: 'ec2:full_read,ec2:full_write', role: '' }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: 'ec2:full_read,ec2:full_write'
    })).toBe(false);
  });

  it('should fail authorization if the token contains the correct role but not the required scopes', function() {
    expect(validateTokenAuthorization({
      requireAccount: true,
      authorizationToken: BEARER_TOKEN + ' ' + sign({ ...baseUserPayload, scopes: 'ec2:full_read' }, process.env.ACCESS_TOKEN_SECRET || ''),
      scopesRequired: 'ec2:full_read,ec2:full_write'
    })).toBe(false);
  });

});