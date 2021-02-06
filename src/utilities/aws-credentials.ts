import AWS from 'aws-sdk';
import { isLocal } from './environment';

/**
 * To allow access to resources from our app,
 * we could either store aws credentials in either a database
 * or some config store
 * 
 * For now, we'll go ahead with using .env for dev & int testing
 * and IAM for deployment
 */
export function getAWSCredentials(): AWS.EC2.ClientConfiguration {
  if(!isLocal()) return {};
  return {
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
  }
}