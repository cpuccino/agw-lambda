export type Environment = 'dev' | 'prod' | 'staging' | 'test';

export function getNodeEnv(): Environment {
  switch(process.env.NODE_ENV) {
    default:
    case 'dev':
    case 'development':
      return 'dev';
    case 'prod':
    case 'production':
      return 'prod';
    case 'stage':
    case 'staging':
      return 'staging';
    case 'test':
    case 'testing':
      return 'test';
  }
}

export function isProduction(): boolean {
  return getNodeEnv() === 'prod';
}

export function isLocal(): boolean {
  return process.env.LOCAL === 'true';
}