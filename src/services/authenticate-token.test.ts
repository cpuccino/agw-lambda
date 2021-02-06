import dotenv from 'dotenv';
import path from 'path';
import { sign } from 'jsonwebtoken';
import { authenticateToken } from './authenticate-token';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.test' ) });
  
describe('This module performs authentication to the access token and decodes the user payload', function() {

  const userPayload = {
    sub: '0',
    role: 'MEMBER',
    scopes: 's3:read_only',
  };

  it('should return null if the sub is empty', async function() {
    const token = sign({ ...userPayload, sub: '' }, process.env.ACCESS_TOKEN_SECRET || '');
    const decoded = authenticateToken(token);

    expect(decoded).toBeNull();
  });

  it('should contain the sub, role?, and scopes?', async function() {
    const token = sign({ ...userPayload }, process.env.ACCESS_TOKEN_SECRET || '');
    const decoded = authenticateToken(token);

    expect(decoded).toEqual(expect.objectContaining({
      sub: '0',
      role: 'MEMBER',
      scopes: 's3:read_only'
    }));
  });

  it('should return null if the token is invalid', async function() {
    expect(authenticateToken('-')).toBeNull();
    expect(authenticateToken('')).toBeNull();
    expect(authenticateToken('123456789')).toBeNull();

    const token = sign({ ...userPayload }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: '0' });
    await new Promise(res => setTimeout(res, 10));
    expect(authenticateToken(token)).toBeNull();
  });

});