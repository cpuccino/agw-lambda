import { getNodeEnv, isProduction } from "./environment";

const env = { ...process.env };

describe('this module outputs a standardized env string', function() {

  it('should return "dev" as a default', function() {
    process.env.NODE_ENV = undefined;
    expect(getNodeEnv()).toBe('dev');
    process.env.NODE_ENV = '';
    expect(getNodeEnv()).toBe('dev');
  });

  it('should return "dev" if NODE_ENV is either "dev" or "development"', function() {
    process.env.NODE_ENV = 'dev';
    expect(getNodeEnv()).toBe('dev');
    process.env.NODE_ENV = 'development';
    expect(getNodeEnv()).toBe('dev');
  });

  it('should return "prod" if NODE_ENV is either "prod" or "production"', function() {
    process.env.NODE_ENV = 'prod';
    expect(getNodeEnv()).toBe('prod');
    process.env.NODE_ENV = 'production';
    expect(getNodeEnv()).toBe('prod');
  });

  it('should return "staging" if NODE_ENV is either "stage" or "staging"', function() {
    process.env.NODE_ENV = 'stage';
    expect(getNodeEnv()).toBe('staging');
    process.env.NODE_ENV = 'staging';
    expect(getNodeEnv()).toBe('staging');
  });

  it('should return "test" if NODE_ENV is either "prod" or "testing"', function() {
    process.env.NODE_ENV = 'test';
    expect(getNodeEnv()).toBe('test');
    process.env.NODE_ENV = 'testing';
    expect(getNodeEnv()).toBe('test');
  });

  it('should return true if on production', function() {
    process.env.NODE_ENV = 'prod';
    expect(isProduction()).toBe(true);
  });

  afterAll(function() {
    process.env = env;
  })

});