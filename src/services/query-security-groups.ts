import AWS from 'aws-sdk';
import { AWS_EC2_API_VERSION } from '../constants/api';
import { getAWSCredentials } from '../utilities/aws-credentials';
import { listEC2Instances } from './query-ec2';

/**
 * "describeSecurityGroups" method only fetches from a single region
 * So we would need to loop through all regions to get all existing security groups
 * 
 * @param region 
 */
export async function listSecurityGroups(region: string): Promise<AWS.EC2.SecurityGroupList> {
  if(!region) return [];
  
  try {
    const ec2 = new AWS.EC2({ 
      apiVersion: AWS_EC2_API_VERSION,
      region,
      ...getAWSCredentials()
    });
    const { SecurityGroups: securityGroups } = await ec2.describeSecurityGroups().promise();
    return (securityGroups || []).filter(sg => sg);
  } catch(e) {
    console.error(e);
    return [];
  }
}

/**
 * Lists all security groups that's attached to a ec2 instance in a region
 * Fetches all EC2 instances and security groups, the matches the instance security group identifier to
 * the security group
 * 
 * AWS CLI bash script
 * https://gist.github.com/richadams/384020d6e4e6d4f400d7
 * 
 * @param region 
 */
export async function listEC2SecurityGroups(region: string): Promise<AWS.EC2.SecurityGroupList> {
  if(!region) return [];

  const [ec2Instances, securityGroups] = await Promise.all([
    listEC2Instances(region), 
    listSecurityGroups(region)
  ]);
  if(!ec2Instances || !ec2Instances.length) return [];

  const ec2SecurityGroupsIds = ec2Instances.reduce(function(ids, instance) {
    if(!instance.SecurityGroups || !instance.SecurityGroups.length) return ids;
    instance.SecurityGroups.forEach(sg => ids.push((sg.GroupId || '').toLowerCase()));

    return ids;
  }, [] as string[]).filter(id => id);
  
  return securityGroups.filter(sg => sg && sg.GroupId && ec2SecurityGroupsIds.includes(sg.GroupId.toLowerCase()));
}