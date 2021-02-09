import AWS from 'aws-sdk';
import awsMock from 'aws-sdk-mock';
import { listEC2Instances } from './query-ec2';
import { NOT_AUTHORIZED_ERROR } from '../constants/error';
import { DescribeInstanceCallback, generateMockEC2Instance } from './__mocks__/mock-ec2';

describe('this module lists all EC2 instances in a region', function () {
  const region = 'ap-southeast-2';
  const ec2Service = 'EC2';
  const describeEC2MethodString = 'describeInstances';

  beforeEach(function () {
    awsMock.setSDKInstance(AWS);
  });

  it('should return an empty list when there\'s no "Reservations" key', async function () {
    awsMock.mock(
      ec2Service,
      describeEC2MethodString,
      function (callback: DescribeInstanceCallback) {
        callback(null, {});
      }
    );
    expect(await listEC2Instances(region)).toHaveLength(0);
  });

  it('should return an empty list if "Reservations" array is empty / only has null values', async function () {
    awsMock.mock(
      ec2Service,
      describeEC2MethodString,
      function (callback: DescribeInstanceCallback) {
        callback(null, { Reservations: [] });
      }
    );
    expect(await listEC2Instances(region)).toHaveLength(0);
  });

  it('should return an empty list when all instances of all reservations is either empty or null', async function () {
    awsMock.mock(
      ec2Service,
      describeEC2MethodString,
      function (callback: DescribeInstanceCallback) {
        callback(null, {
          Reservations: [
            {
              OwnerId: 'random-id',
              Instances: []
            },
            {
              OwnerId: 'random-id',
              Instances: null
            }
          ] as AWS.EC2.ReservationList
        });
      }
    );
    expect(await listEC2Instances(region)).toHaveLength(0);
  });

  it('should return 3 instances from 2 different reservations as per the config', async function () {
    awsMock.mock(
      ec2Service,
      describeEC2MethodString,
      function (callback: DescribeInstanceCallback) {
        callback(null, {
          Reservations: [
            {
              OwnerId: 'random-id',
              Instances: [generateMockEC2Instance(), generateMockEC2Instance()]
            },
            {
              OwnerId: 'random-id',
              Instances: [generateMockEC2Instance()]
            },
            {
              OwnerId: 'random-id',
              Instances: null
            }
          ] as AWS.EC2.ReservationList
        });
      }
    );
    expect(await listEC2Instances(region)).toHaveLength(3);
  });

  it('should return an empty list when the api throws an error', async function () {
    awsMock.mock(
      ec2Service,
      describeEC2MethodString,
      function (callback: DescribeInstanceCallback) {
        throw new Error(NOT_AUTHORIZED_ERROR);
      }
    );
    expect(await listEC2Instances(region)).toHaveLength(0);
    expect(async () => await listEC2Instances(region)).not.toThrow();
  });

  it('should return an empty list when the region is empty', async function () {
    awsMock.mock(
      ec2Service,
      describeEC2MethodString,
      function (callback: DescribeInstanceCallback) {
        callback(null, {
          Reservations: [
            {
              OwnerId: 'random-id',
              Instances: [generateMockEC2Instance(), generateMockEC2Instance()]
            },
            {
              OwnerId: 'random-id',
              Instances: [generateMockEC2Instance()]
            },
            {
              OwnerId: 'random-id',
              Instances: null
            }
          ] as AWS.EC2.ReservationList
        });
      }
    );
    expect(await listEC2Instances('')).toHaveLength(0);
  });

  afterEach(function () {
    awsMock.restore();
  });
});
