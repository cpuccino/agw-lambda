import AWS from 'aws-sdk';
import awsMock from 'aws-sdk-mock';
import { generateMockRegions } from '../utilities/aws-mock-utilities';
import { listRegions } from './query-regions';

describe('this module lists all regions', function() {

  const ec2Service = 'EC2';
  const describeRegionMethodString = 'describeRegions';

  beforeEach(function() {
    awsMock.setSDKInstance(AWS);
  });

  it('should return an empty list when there\'s no "Regions" key', async function() {
    awsMock.mock(ec2Service, describeRegionMethodString, function(callback: Function) {
      callback(null, {});
    });
    expect(await listRegions()).toHaveLength(0);
  });

  it('should return an empty list if "Regions" array is empty', async function() {
    awsMock.mock(ec2Service, describeRegionMethodString, function(callback: Function) {
      callback(null, { Regions: [] });
    });
    expect(await listRegions()).toHaveLength(0);
  });

  it('should return 5 regions as per the config', async function() {
    awsMock.mock(ec2Service, describeRegionMethodString, function(callback: Function) {
      callback(null, { Regions: generateMockRegions().splice(0, 5) });
    });
    expect(await listRegions()).toHaveLength(5);
  });

  it('should return 4 regions out of 5 due to 1 having no "RegionName" field as per the config', async function() {
    const mockRegions = generateMockRegions().splice(0, 5);
    mockRegions[0].RegionName = '';
    awsMock.mock(ec2Service, describeRegionMethodString, function(callback: Function) {
      callback(null, { Regions: mockRegions });
    });
    expect(await listRegions()).toHaveLength(4);
  });

  it('should return an empty list when the api throws an error', async function() {
    awsMock.mock(ec2Service, describeRegionMethodString, function(callback: Function) {
      throw new Error('Not Authorized');
    });
    expect(await listRegions()).toHaveLength(0);
    expect(async() => await listRegions()).not.toThrow();
  });

  afterEach(function() {
    awsMock.restore();
  });

});