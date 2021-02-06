# Trend Micro - Cloud Conformity Technical Interview

API Gateway + Lambda

## Demo

https://kp85unh7m0.execute-api.ap-southeast-2.amazonaws.com/prod/list-ec2-sg

- Generate a jwt access token with the following payload and using the secret `secret`

```
{
  "sub": "1234567890",
  "roles": "",
  "scopes": ""
}
```

- Make a request to the endpoint and add the following headers

```
Authorization: Bearer {{ACCESS_TOKEN}}
```

- The data will be cached for 15s

## Coverage

```
---------------------------|---------|----------|---------|---------|-------------------
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------------|---------|----------|---------|---------|-------------------
All files                  |   93.81 |      100 |      92 |   92.71 |
 constants                 |     100 |      100 |     100 |     100 |
  api.ts                   |     100 |      100 |     100 |     100 |
 services                  |   91.86 |      100 |    87.5 |   90.14 |
  authenticate-token.ts    |     100 |      100 |     100 |     100 |
  policy-document.ts       |     100 |      100 |     100 |     100 |
  query-ec2.ts             |     100 |      100 |     100 |     100 |
  query-regions.ts         |     100 |      100 |     100 |     100 |
  query-security-groups.ts |   81.58 |      100 |   77.78 |   77.42 | 63-74
 utilities                 |     100 |      100 |     100 |     100 |
  aws-credentials.ts       |     100 |      100 |     100 |     100 |
  aws-mock-utilities.ts    |     100 |      100 |     100 |     100 |
  environment.ts           |     100 |      100 |     100 |     100 |
---------------------------|---------|----------|---------|---------|-------------------
```

## TODO

- [x] tsconfig
- [x] base packages
- [x] service config
- [x] register list ec2 sg lambda route
- [x] response
- [x] set up iam with read access to ec2
- [x] credentials
  - [x] aws credentials - dotenv for testing - db or iam for deployment
  - [x] internal - access token validation, secret dotenv
- [x] list all ec2 security groups in an account
  - [x] list all regions
  - [x] add tests - list all regions
  - [x] list all security groups per region
  - [x] add tests - list all security groups per region
  - [x] list all ec2 instances and match the security group identifier to the proper security group
  - [x] add tests - list all ec2 instances
  - [x] add tests - match ec2 security group identifier to the proper security group
  - [x] set up either a database / env that stores aws credentials, or use iam roles (cloudformation)
- [x] generate a role using serverless yml cloudformation
- [x] authorizers
  - [x] policy documents
  - [x] add tests to policy documents
  - [x] basic auth flow - token
  - [x] add tests to token authentication
- [x] cache expensive handler call - list-ec2-sg
- [x] generate test coverage
- [x] deploy
- [x] set up prettier and eslint
- [x] demo instructions

## References

- [Getting started with the AWS SDK](https://docs.amazonaws.cn/en_us/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)
- [AWS SDK for node](https://github.com/aws/aws-sdk-js)
- [AWS SDK call limits](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/throttling.html)
- [IAM Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-lambda.html)
- [Authorizer Policies](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html)
- [Mocking AWS SDK](https://github.com/dwyl/aws-sdk-mock)
