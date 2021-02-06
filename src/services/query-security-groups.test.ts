import AWS from 'aws-sdk';
import awsMock from 'aws-sdk-mock';
import { generateMockSecurityGroup } from '../utilities/aws-mock-utilities';
import { listSecurityGroups } from './query-security-groups';

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