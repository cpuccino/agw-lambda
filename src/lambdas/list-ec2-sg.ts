import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups } from '../services/query-security-groups';
import { listRegions } from '../services/query-regions';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

const maxAge = 15000;

interface CachedEC2SecurityGroups {
  expiresIn: number;
  securityGroups: AWS.EC2.SecurityGroupList;
}

let cachedEC2SecurityGroups: CachedEC2SecurityGroups | null;

/**
 * Lists all security groups attached to an EC2 instance for all regions
 * 
 * For production, we can further improve the performance of our describe:* calls to the aws api
 * by caching the response in a database / data store / memory
 * 
 * @param event 
 * @param context 
 */
export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  if(cachedEC2SecurityGroups && cachedEC2SecurityGroups.expiresIn < new Date().getTime()) {
    return createResponse(200, { data: cachedEC2SecurityGroups }, { 
      'Expires-In': cachedEC2SecurityGroups.expiresIn.toString() 
    });
  }

  try {
    const regions = await listRegions();
  
    const ec2RegionsSecurityGroups = await Promise.all(
      regions.map(region => listEC2SecurityGroups(region.RegionName!))
    );
  
    const securityGroups = [] as AWS.EC2.SecurityGroupList;
    for(const ec2RegionSecurityGroup of ec2RegionsSecurityGroups) {
      securityGroups.push(...ec2RegionSecurityGroup)
    }

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