# Trend Micro - Cloud Conformity Technical Interview
API Gateway + Lambda


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
    - [x] list all security groups per region
    - [x] set up either a database / env that stores aws credentials, or use iam roles (cloudformation)
    - [x] list all ec2 instances and match the security group identifier to the proper security group
- [x] generate a role using serverless yml cloudformation
- [ ] add tests to services lib
- [x] authorizers
    - [x] policy documents
    - [x] basic auth flow - token
- [ ] add tests for authorizers
- [ ] generate test coverage
- [ ] deploy
- [ ] set up prettier and eslint
- [ ] demo instructions

## References
[AWS SDK for node!](https://docs.amazonaws.cn/en_us/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)
[AWS SDK call limits!](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/throttling.html)
[IAM Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-lambda.html)
[Authorizer Policies!](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-resource-policies-examples.html )
[aws-sdk-js!](https://github.com/aws/aws-sdk-js)