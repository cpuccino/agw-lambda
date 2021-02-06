import AWS from 'aws-sdk';
import awsMock from 'aws-sdk-mock';
import { generateMockSecurityGroup, generateMockEC2Instance, generateMockSecurityGroupIdentifier } from '../utilities/aws-mock-utilities';
import { listEC2SecurityGroups, listSecurityGroups } from './query-security-groups';

describe('this module lists all security groups in a region', function() {

  const region = 'ap-southeast-2';
  const ec2Service = 'EC2';
  const describeSecurityGroupMethodString = 'describeSecurityGroups';

  beforeEach(function() {
    awsMock.setSDKInstance(AWS);
  });

  it('should return an empty list when there\'s no "SecurityGroups" key', async function() {
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, {});
    });
    expect(await listSecurityGroups(region)).toHaveLength(0);
  });

  it('should return an empty list if "SecurityGroups" array is empty / only has null values', async function() {
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { SecurityGroups: [] });
    });
    expect(await listSecurityGroups(region)).toHaveLength(0);

    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { SecurityGroups: [null] });
    });
    expect(await listSecurityGroups(region)).toHaveLength(0);
  });

  it('should return 5 security groups as per the config', async function() {
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { SecurityGroups: Array(5).fill(0).map(_ => generateMockSecurityGroup) });
    });
    expect(await listSecurityGroups(region)).toHaveLength(5);
  });

  it('should return an empty list when the api throws an error', async function() {
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      throw new Error('Not Authorized');
    });
    expect(await listSecurityGroups(region)).toHaveLength(0);
    expect(async() => await listSecurityGroups('')).not.toThrow();
  });

  it('should return an empty list when the region is empty', async function() {
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { SecurityGroups: Array(5).fill(0).map(_ => generateMockSecurityGroup) });
    });
    expect(await listSecurityGroups('')).toHaveLength(0);
  });

  afterEach(function() {
    awsMock.restore();
  });

});

describe('this module lists all security groups in a region that\'s attached to an EC2 instance', () => {
  
  beforeEach(function() {
    awsMock.setSDKInstance(AWS);
  });

  const region = 'ap-southeast-2';
  const ec2Service = 'EC2';
  const describeSecurityGroupMethodString = 'describeSecurityGroups';
  const describeEC2MethodString = 'describeInstances';

  it('should return an empty list when there are no EC2 instances found', async function() {
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, {});
    });
    awsMock.mock(ec2Service, describeEC2MethodString, function(callback: Function) {
      callback(null, {});
    });
    expect(await listEC2SecurityGroups(region)).toHaveLength(0);
  });

  it('should return an empty list when there are no Security groups or no EC2 instances found', async function() {
    awsMock.mock(ec2Service, describeEC2MethodString, function(callback: Function) {
      callback(null, { 
        Reservations: [
          {
            OwnerId: 'random-ownerid',
            Instances: [
              generateMockEC2Instance({
                SecurityGroups: [
                  generateMockSecurityGroupIdentifier('Default SG')
                ]
              })
            ]
          }
        ] as AWS.EC2.ReservationList
      });
    });
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, {});
    });
    expect(await listEC2SecurityGroups(region)).toHaveLength(0);

    awsMock.remock(ec2Service, describeEC2MethodString, function(callback: Function) {
      callback(null, {});
    });
    awsMock.remock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { 
        SecurityGroups: [
          generateMockSecurityGroup('Default SG')
        ] 
      });
    });
    expect(await listEC2SecurityGroups(region)).toHaveLength(0);
  });

  it('should return an empty list when all EC2 instances have no attached security group', async function() {
    awsMock.mock(ec2Service, describeEC2MethodString, function(callback: Function) {
      callback(null, { 
        Reservations: [
          {
            OwnerId: 'random-ownerid',
            Instances: [
              generateMockEC2Instance({
                SecurityGroups: []
              })
            ]
          }
        ] as AWS.EC2.ReservationList
      });
    });
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { 
        SecurityGroups: [
          generateMockSecurityGroup('Default SG')
        ] 
      });
    });

    expect(await listEC2SecurityGroups(region)).toHaveLength(0);
  });

  it('should only return security groups attached to an EC2 instance (securityGroupIdentifiier should have a match)', async function() {
    awsMock.mock(ec2Service, describeEC2MethodString, function(callback: Function) {
      callback(null, { 
        Reservations: [
          {
            OwnerId: 'random-ownerid',
            Instances: [
              generateMockEC2Instance({
                SecurityGroups: [
                  generateMockSecurityGroupIdentifier('Default SG 1'),
                  generateMockSecurityGroupIdentifier('Default SG 2')
                ]
              })
            ]
          },
          {
            OwnerId: 'random-ownerid',
            Instances: [
              generateMockEC2Instance({
                SecurityGroups: [
                  generateMockSecurityGroupIdentifier('Default SG 2'),
                  generateMockSecurityGroupIdentifier('Default SG 3')
                ]
              }),
              generateMockEC2Instance({
                SecurityGroups: [
                  generateMockSecurityGroupIdentifier('Default SG 5'),
                ]
              }),
              generateMockEC2Instance({
                SecurityGroups: []
              })
            ]
          },
          {
            OwnerId: 'random-ownerid',
            Instances: []
          }
        ] as AWS.EC2.ReservationList
      });
    });
    awsMock.mock(ec2Service, describeSecurityGroupMethodString, function(callback: Function) {
      callback(null, { 
        SecurityGroups: [
          generateMockSecurityGroup('Default SG 1'),
          generateMockSecurityGroup('Default SG 2'),
          generateMockSecurityGroup('Default SG 3'),
          generateMockSecurityGroup('Default SG 4'),
          generateMockSecurityGroup('Default SG 5')
        ] 
      });
    });

    expect(await listEC2SecurityGroups(region)).toHaveLength(4);
  });

  afterEach(function() {
    awsMock.restore();
  });

});
