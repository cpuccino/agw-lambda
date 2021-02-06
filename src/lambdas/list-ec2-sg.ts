import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups, listSecurityGroups } from '../services/query-security-groups';
import { listRegions } from '../services/query-regions';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  const regions = await listRegions();

  const securityGroups = [];
  for(const region of regions) {
    const regionSecurityGroups = await listEC2SecurityGroups(region.RegionName!);
    securityGroups.push(...regionSecurityGroups);
  }

  console.log(securityGroups);

  return createResponse(200, { data: securityGroups });
}