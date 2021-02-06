import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups } from '../services/query-security-groups';
import { listRegions } from '../services/query-regions';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

/**
 * Lists all security groups attached to an EC2 instance for all regions
 * 
 * For production, we can further improve the performance of our describe:* calls to the aws api
 * by caching the response in a database / data store
 * 
 * @param event 
 * @param context 
 */
export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  try {
    const regions = await listRegions();
  
    const ec2RegionsSecurityGroups = await Promise.all(
      regions.map(region => listEC2SecurityGroups(region.RegionName!))
    );
  
    const securityGroups = [];
    for(const ec2RegionSecurityGroup of ec2RegionsSecurityGroups) {
      securityGroups.push(...ec2RegionSecurityGroup)
    }
  
    return createResponse(200, { data: securityGroups });
  } catch(e) {
    console.error(e);
    return createResponse(500, { error: e.message || 'Something went wrong' } );
  }
}