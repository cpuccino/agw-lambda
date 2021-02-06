import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups } from '../services/query-security-groups';
import { listRegions } from '../services/query-regions';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';
import { listEC2Instances } from '../services/query-ec2';

export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  const regions = await listRegions();

  const securityGroups = [];
  for(const region of regions) {
    // const regionSecurityGroups = await listEC2SecurityGroups(region.RegionName!);
    // securityGroups.push(...regionSecurityGroups);
    const regionEC2Instances = await listEC2Instances(region.RegionName!);
    securityGroups.push(...regionEC2Instances);
  }

  return createResponse(200, { data: securityGroups });
}