import { APIGatewayEvent, Context } from 'aws-lambda';
import { listEC2SecurityGroups } from '../services/list-ec2-sg';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  await listEC2SecurityGroups();
  return createResponse(200, { data: 'List ec2 security groups route has been created' });
}