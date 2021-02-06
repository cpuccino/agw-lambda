import { getAWSCredentials } from './aws-credentials';

const env = { ...process.env };

describe('this module returns aws credentials', function() {

  it('should return an empty object if not local', function() {
    process.env.LOCAL = '';
    expect(getAWSCredentials()).toEqual({});
  });

  it('should return aws credentials if local', function() {
    process.env.LOCAL = 'true';
    process.env.ACCESS_KEY_ID = 'access_key_id';
    process.env.SECRET_ACCESS_KEY = 'secret_access_key';

    expect(getAWSCredentials()).toEqual(expect.objectContaining({
      credentials: {
        accessKeyId: 'access_key_id',
        secretAccessKey: 'secret_access_key'
      }
    }));
  });

  afterAll(function() {
    process.env = env;
  })

});