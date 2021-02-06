import { APIGatewayEvent, Context } from 'aws-lambda';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

export async function handler(event: APIGatewayEvent, context: Context): Promise<AsyncLambdaResponse> {
  return createResponse(200, { data: 'List ec2 security groups route has been created' });
}