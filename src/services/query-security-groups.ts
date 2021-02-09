import AWS from 'aws-sdk';
import { AWS_EC2_API_VERSION } from '../constants/api';
import { getAWSCredentials } from '../utilities/aws-credentials';
import { listEC2Instances } from './query-ec2';
import { listRegions } from './query-regions';

/**
 * "describeSecurityGroups" method only fetches from a single region
 * So we would need to loop through all regions to get all existing security groups
 *
 * @param region
 */
export async function listSecurityGroups(
  region: string
): Promise<AWS.EC2.SecurityGroupList> {
  if (!region) return [];

  try {
    const ec2 = new AWS.EC2({
      apiVersion: AWS_EC2_API_VERSION,
      region,
      ...getAWSCredentials()
    });
    const {
      SecurityGroups: securityGroups
    } = await ec2.describeSecurityGroups().promise();
    return (securityGroups || []).filter(sg => sg);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export interface EC2SecurityGroup {
  region?: string;
  groupId?: string;
  groupName?: string;
  description?: string;
  ownerId?: string;
  tags?: {
    key?: string;
    value?: string;
  }[];
  vpcId?: string;
  instances?: string[];
}

export interface CreateEC2SecurityGroupParams {
  region: string;
  instances: string[];
  securityGroup: AWS.EC2.SecurityGroup;
}

/**
 * TODO: Create definitions for ipPermissions & ipPermissionsEgress
 *
 * Formats the security group to also include information about the region
 * and it's instances
 *
 * @param params
 */
function createEC2SecurityGroup(params: CreateEC2SecurityGroupParams): EC2SecurityGroup {
  const { region, instances, securityGroup } = params;
  return {
    region,
    groupId: securityGroup.GroupId,
    groupName: securityGroup.GroupName,
    description: securityGroup.Description,
    ownerId: securityGroup.OwnerId,
    tags: (securityGroup.Tags || []).map(t => ({ key: t.Key, value: t.Value })),
    instances,
    vpcId: securityGroup.VpcId
  };
}

/**
 * Lists all security groups that's attached to an ec2 instance in a region
 * Fetches all EC2 instances and security groups, that matches the instance security group identifier to
 * the security group
 *
 * @param region
 */
export async function listEC2SecurityGroups(region: string): Promise<EC2SecurityGroup[]> {
  if (!region) return [];

  const [ec2Instances, securityGroups] = await Promise.all([
    listEC2Instances(region),
    listSecurityGroups(region)
  ]);
  if (!ec2Instances || !ec2Instances.length) return [];

  const ec2SecurityGroups: EC2SecurityGroup[] = [];

  for (const securityGroup of securityGroups) {
    const securityGroupInstances = ec2Instances.filter(
      instance =>
        instance.SecurityGroups &&
        instance.SecurityGroups.length &&
        instance.SecurityGroups.find(sg => sg.GroupId === securityGroup.GroupId)
    );

    ec2SecurityGroups.push(
      createEC2SecurityGroup({
        region,
        instances: securityGroupInstances
          .map(sgi => sgi.InstanceId || '')
          .filter(sgid => sgid),
        securityGroup
      })
    );
  }

  return ec2SecurityGroups.filter(sg => (sg.instances || []).length);
}

/**
 * Lists all security groups that's attached to an ec2 instance for all regions
 *
 * AWS CLI bash script
 * https://gist.github.com/richadams/384020d6e4e6d4f400d7
 */
export async function listGlobalEC2SecurityGroups(): Promise<EC2SecurityGroup[]> {
  const regions = await listRegions();

  const ec2RegionsSecurityGroups = await Promise.all(
    regions.map(region => listEC2SecurityGroups(region.RegionName || ''))
  );

  const securityGroups = [] as EC2SecurityGroup[];
  for (const ec2RegionSecurityGroup of ec2RegionsSecurityGroups) {
    securityGroups.push(...ec2RegionSecurityGroup);
  }

  return securityGroups;
}
