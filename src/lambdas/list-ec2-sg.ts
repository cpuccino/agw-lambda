import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups } from '../services/query-security-groups';
import { listRegions } from '../services/query-regions';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  const regions = await listRegions();

  const ec2RegionsSecurityGroups = await Promise.all(
    regions.map(region => listEC2SecurityGroups(region.RegionName!))
  );

  const securityGroups = [];
  for(const ec2RegionSecurityGroup of ec2RegionsSecurityGroups) {
    securityGroups.push(...ec2RegionSecurityGroup)
  }

  return createResponse(200, { data: securityGroups });
}