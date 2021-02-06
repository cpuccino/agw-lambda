import { APIGatewayEvent, Context } from 'aws-lambda';
import { listAllEC2SecurityGroups as listGlobalEC2SecurityGroups } from '../services/query-security-groups';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

/**
 * Cache security groups for 15 secs
 * or till lambda instance shuts down
 */
const maxAge = 15000;

interface CachedEC2SecurityGroups {
  expiresIn: number;
  securityGroups: AWS.EC2.SecurityGroupList;
}

let cachedEC2SecurityGroups: CachedEC2SecurityGroups | null;

/**
 * Lists all security groups attached to an EC2 instance for all regions
 * and caches it for {{maxAge}}ms
 * 
 * For production, we can further improve the performance of our describe:* calls to the aws api
 * by caching the response in a database / data store / memory
 * 
 * @param event 
 * @param context 
 */
export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  if(cachedEC2SecurityGroups && cachedEC2SecurityGroups.expiresIn > new Date().getTime()) {
    return createResponse(200, { data: cachedEC2SecurityGroups }, { 
      'Expires-In': cachedEC2SecurityGroups.expiresIn.toString() 
    });
  }

  try {
    const securityGroups = await listGlobalEC2SecurityGroups();
    cachedEC2SecurityGroups = { 
      securityGroups, 
      expiresIn: (new Date).getTime() + maxAge
    };
  
    return createResponse(200, { data: securityGroups });
  } catch(e) {
    console.error(e);
    return createResponse(500, { error: e.message || 'Something went wrong' } );
  }
}