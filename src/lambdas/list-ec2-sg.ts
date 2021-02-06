import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups, listRegions } from '../services/list-ec2-sg';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  const regions = await listRegions();

  const securityGroups = [];
  for(const region of regions) {
    const regionSecurityGroups = await listEC2SecurityGroups(region.RegionName!);
    securityGroups.push(...regionSecurityGroups);
  }

  return createResponse(200, { data: securityGroups });
}