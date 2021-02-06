import { PolicyDocument } from 'aws-lambda';

export interface IGenerateAuthResponseParams {
  principalId: string | null;
  methodArn: string;
  effect?: 'Allow' | 'Deny';
}

export interface IGeneratePolicyDocument {
  principalId: string | null;
  policyDocument: PolicyDocument;
}

/**
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html 
 * 
 * @param params
 */
export async function generatePolicyDocument(params: IGenerateAuthResponseParams): Promise<IGeneratePolicyDocument> {
  const { principalId, methodArn, effect = 'Deny' } = params;

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
      }]
    }
  };
}