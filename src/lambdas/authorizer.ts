import { APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda';
import { ANONYMOUS_SUB } from '../constants/auth';
import { authenticateToken } from '../services/authenticate-token';
import { generatePolicyDocument, IGeneratePolicyDocument } from '../services/policy-document';

/**
 * Returns a policy document / authorized response if there's an Authorization Header with a valid bearer token
 * Currently only handles authentication
 * 
 * We could implement authorization a couple ways, either by using an internal database, or a managed service like OAuth, Cognito, etc
 * 
 * USER user
 * ------------------------------------------------------------------------------------------------------
 * | entity_id | role | scopes | username | email | password | created_at | updated_at | archived | ... |
 * ------------------------------------------------------------------------------------------------------
 * entity_id - (PK)
 * role - (general access permissions) - (ANONYMOUS, MEMBER - requires scopes, OWNER - root)
 * scopes - (action scopes) (role:read,role:write,scopes:read,scopes:write,orders:read,orders:write) 
 *   with certain actions (controllers / resolvers) requiring certain scopes
 * username - unique identifier
 * email - unique identifier
 * password - hashed with bcrypt or something similar
 * 
 * AUTH_TOKEN auth_token - (If implementing your own OAuth flow)
 * --------------------------------------------------------------------------
 * | entity_id | creator_id | refresh_token | created_at | updated_at | ... |
 * --------------------------------------------------------------------------
 * entity_id - (PK)
 * creator_id - user that's generated an access token via username & password
 * refresh_token - used to generate an access token which contains user data (role, scopes, email, ...etc)
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
 * @param event 
 * @param context 
 */
export async function handler(event: APIGatewayTokenAuthorizerEvent, context: Context): Promise<IGeneratePolicyDocument> {
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
   * We could then query the role & scopes required for the functions using the methodArn (check table above)
   * and validate that against the user's or we could offload authorization to the lambda function
   * 
   */
  return await generatePolicyDocument({ 
    principalId: userAccessTokenPayload.sub, methodArn, effect: 'Allow' 
  });
}