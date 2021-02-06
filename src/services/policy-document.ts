import { PolicyDocument } from 'aws-lambda';

interface IGenerateAuthResponseParams {
  methodArn: string;
  effect?: 'Allow' | 'Deny';
}

interface IGeneratePolicyDocument {
  policyDocument: PolicyDocument;
}

/**
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html 
 */
export async function generatePolicyDocument(params: IGenerateAuthResponseParams): Promise<IGeneratePolicyDocument> {
  const { methodArn, effect = 'Deny' } = params;

  return {
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