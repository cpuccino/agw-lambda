import { APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda';
import { generatePolicyDocument } from '../services/policy-document';
import { createResponse } from '../utilities/response';

export async function handler(event: APIGatewayTokenAuthorizerEvent, context: Context): Promise<any> {
  const { authorizationToken, methodArn } = event;
  const [type = '', accessToken] = authorizationToken.split(/\s+/);

  if(type.toLowerCase() !== 'bearer') {
    return createResponse(400, await generatePolicyDocument({ methodArn, effect: 'Deny' }));
  }

  return createResponse(200, await generatePolicyDocument({ methodArn, effect: 'Allow' }));
}