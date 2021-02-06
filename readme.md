# Trend Micro - Cloud Conformity Technical Interview
API Gateway + Lambda


## TODO
- [x] tsconfig
- [x] base packages
- [x] service config
- [x] register list ec2 sg lambda route
- [x] response
- [x] set up iam with read access to ec2
- [ ] credentials
    - [x] aws credentials - dotenv for testing - db or iam for deployment
    - [ ] internal - access token validation
- [ ] list all ec2 security groups in an account
    - [x] list all regions
    - [x] list all security groups per region
    - [x] set up either a database / env that stores aws credentials, or use iam roles (cloudformation)
- [ ] generate a role using serverless yml cloudformation
- [ ] add tests to services lib
- [ ] authorizers
    - [x] policy documents
    - [ ] basic auth flow - token
- [ ] add tests for authorizers
- [ ] generate test coverage
- [ ] deploy
- [ ] set up prettier and eslint

## References
[AWS SDK for node!](https://docs.amazonaws.cn/en_us/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html)