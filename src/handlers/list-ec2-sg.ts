import { APIGatewayEvent, Context } from 'aws-lambda';
import { AUTH_INVALID_SCOPES_ERROR, GENERIC_ERROR } from '../constants/error';
import { validateTokenAuthorization } from '../services/authenticate-token';
import { listGlobalEC2SecurityGroups } from '../services/query-security-groups';
import { AsyncLambdaResponse, createResponse } from '../utilities/response';

/**
 * A better way of handling this is by creating a table
 * that has information about a function / service (methodArn)
 * and it's config - (cache time, role & scopes required)
 *
 * Cache security groups for 15 secs
 * or till lambda instance shuts down
 */
const maxAge = 15000;
const requireAccount = true;
const scopesRequired = 'ec2:full_read';

interface CachedEC2SecurityGroups {
  expiresIn: number;
  securityGroups: AWS.EC2.SecurityGroupList;
}

let cachedEC2SecurityGroups: CachedEC2SecurityGroups | null;

/**
 * Lists all security groups attached to an EC2 instance for all regions
 * and caches it for {{maxAge}}ms
 *
 * This route is protected and requires a valid user account
 * with the following permission / scopes
 *
 * For production, we can further improve the performance of our describe:* calls to the aws api
 * by caching the response in a database / data store / memory
 * 
 * We should also implement pagination especially
 * when working with larger sets of data - page & limit
 *
 * @param event
 * @param context
 */
export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<AsyncLambdaResponse> {
  const authorizationToken =
    event.headers.Authorization || event.headers.authorization || '';
  if (
    !validateTokenAuthorization({
      authorizationToken,
      scopesRequired,
      requireAccount
    })
  ) {
    return createResponse(403, {
      message: AUTH_INVALID_SCOPES_ERROR
    });
  }

  if (
    cachedEC2SecurityGroups &&
    cachedEC2SecurityGroups.expiresIn > new Date().getTime()
  ) {
    return createResponse(
      200,
      { data: cachedEC2SecurityGroups },
      {
        'Expires-In': cachedEC2SecurityGroups.expiresIn.toString()
      }
    );
  }

  try {
    const securityGroups = await listGlobalEC2SecurityGroups();
    cachedEC2SecurityGroups = {
      securityGroups,
      expiresIn: new Date().getTime() + maxAge
    };

    return createResponse(200, { data: securityGroups });
  } catch (e) {
    console.error(e);
    return createResponse(500, { error: e.message || GENERIC_ERROR });
  }
}