import { APIGatewayEvent, Context } from 'aws-lambda';
import { AUTH_INVALID_SCOPES_ERROR, GENERIC_ERROR } from '../constants/error';
import { validateTokenAuthorization } from '../services/authenticate-token';
import { listGlobalEC2SecurityGroups } from '../services/query-security-groups';
import { AsyncLambdaResponse, createResponse, JsonApiResource } from '../utilities/response';
import { EC2SecurityGroup } from '../services/query-security-groups';
import { AWS_EC2, AWS_SECURITY_GROUP, AWS_VPC } from '../constants/resource-types';

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
  securityGroups: JsonApiResource<EC2SecurityGroup>[];
}

let cachedEC2SecurityGroups: CachedEC2SecurityGroups | null;

/**
 * Formats a security group array to JSON:API v1.0 format
 * https://jsonapi.org/format/
 * 
 * @param securityGroups 
 */
function createEC2SecurityGroupsResponse(securityGroups: EC2SecurityGroup[]): JsonApiResource<EC2SecurityGroup>[] {
  return securityGroups.map(function(securityGroup) {
    const { vpcId, instances = [], ...securityGroupAttributes } = securityGroup;

    return {
      id: securityGroup.groupId,
      type: AWS_SECURITY_GROUP,
      region: securityGroup.region,
      relationships: {
        vpc: { 
          data: { 
            id: vpcId, 
            type: AWS_VPC
          } 
        },
        instance: { 
          data: instances
            .map(ec2 => ({ 
              id: ec2, 
              type: AWS_EC2 
            }))
        }
      },
      attributes: securityGroupAttributes
    };
  });
}

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
    const ec2SecurityGroupsResponse = createEC2SecurityGroupsResponse(securityGroups);

    cachedEC2SecurityGroups = {
      securityGroups: ec2SecurityGroupsResponse,
      expiresIn: new Date().getTime() + maxAge
    };

    return createResponse(200, { data: ec2SecurityGroupsResponse });
  } catch (e) {
    console.error(e);
    return createResponse(500, { error: e.message || GENERIC_ERROR });
  }
}
