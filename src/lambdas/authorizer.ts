import { APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda';
import { ANONYMOUS_SUB } from '../constants/auth';
import { authenticateToken } from '../services/authenticate-token';
import { generatePolicyDocument } from '../services/policy-document';

export async function handler(event: APIGatewayTokenAuthorizerEvent, context: Context): Promise<any> {
  console.log(event, context);
  const { authorizationToken = '', methodArn } = event;
  const [type = '', accessToken] = authorizationToken.split(/\s+/);

  const userAccessTokenPayload = authenticateToken(accessToken);
  const principalId = userAccessTokenPayload ? userAccessTokenPayload.sub : ANONYMOUS_SUB;

  if(type.toLowerCase() !== 'bearer' || !userAccessTokenPayload) {
    return await generatePolicyDocument({ 
      principalId, methodArn, effect: 'Deny' 
    });
  }

  /**
   * If the token is valid, hasn't expired and contains the user data payload
   * 
   * We could then query the role & scopes required for the functions using the methodArn
   * and validate that against the user's or we could offload authorization to the lambda function
   * 
   * SCOPES scopes - key pair of services and their required scopes
   * -------------------------------------------------------------------------
   * | entity_id | creator_id | key | scopes | created_at | updated_at | ... |
   * -------------------------------------------------------------------------
   * entity_id - (PK)
   * creator_id - (User | Action that's created the scope)
   * key - could be a tag or some identifier, in this case, it could be the methodArn service/function name
   * scopes - comma separated scopes [{action}:{access_type}] - ex: s3_info:read
   * 
   */
  return await generatePolicyDocument({ 
    principalId: userAccessTokenPayload.sub, methodArn, effect: 'Allow' 
  });
}