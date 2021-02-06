import { AWS_POLICY_DOCUMENT_VERSION } from "../constants/api";
import { generatePolicyDocument } from "./policy-document";

describe('This module generates a policy document', function() {

  const allowedPolicyDocument = {
    principalId: 'user',
    policyDocument: {
      Version: AWS_POLICY_DOCUMENT_VERSION,
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: 'xxx'
      }]
    }
  };
  
  const deniedPolicyDocument = {
    principalId: 'user',
    policyDocument: {
      Version: AWS_POLICY_DOCUMENT_VERSION,
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'Deny',
        Resource: 'xxx'
      }]
    }
  };

  it('should return a policy document', function() {
    expect(generatePolicyDocument({ methodArn: 'xxx', principalId: 'user', effect: 'Allow' })).not.toBeNull();
  });

  it('should return a deny policy document if the permission is not specified or denied', function() {
    expect(generatePolicyDocument({ methodArn: 'xxx', principalId: 'user' })).toEqual(expect.objectContaining({
      ...deniedPolicyDocument
    }));
    expect(generatePolicyDocument({ methodArn: 'xxx', principalId: 'user', effect: 'Deny' })).toEqual(expect.objectContaining({
      ...deniedPolicyDocument
    }));
  });

  it('should return an allow policy document if specified as so', function() {
    expect(generatePolicyDocument({ methodArn: 'xxx', principalId: 'user', effect: 'Allow' })).toEqual(expect.objectContaining({
      ...allowedPolicyDocument
    }));
  });

  it('should still be able to return an allow policy document even without a proper principalId', function() {
    expect(generatePolicyDocument({ methodArn: 'xxx', principalId: null, effect: 'Allow' })).toEqual(expect.objectContaining({
      ...allowedPolicyDocument,
      principalId: null
    }));
  });

});