import { PolicyDocument } from 'aws-lambda';
import { AWS_POLICY_DOCUMENT_VERSION } from '../constants/api';

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
export function generatePolicyDocument(params: IGenerateAuthResponseParams): IGeneratePolicyDocument {
  const { principalId, methodArn, effect = 'Deny' } = params;

  return {
    principalId,
    policyDocument: {
      Version: AWS_POLICY_DOCUMENT_VERSION,
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
      }]
    }
  };
}