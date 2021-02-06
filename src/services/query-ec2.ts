import AWS from 'aws-sdk';
import { AWS_EC2_API_VERSION } from '../constants/api';
import { getAWSCredentials } from '../utilities/aws-credentials';

/**
 * "describeSecurityGroups" method only fetches from a single region
 * So we would need to loop through all regions to get all existing security groups
 */
export async function listEC2SecurityGroups(region: string): Promise<AWS.EC2.SecurityGroupList> {
  if(!region) return [];
  
  try {
    const ec2 = new AWS.EC2({ 
      apiVersion: AWS_EC2_API_VERSION,
      region,
      ...getAWSCredentials()
    });
    const { SecurityGroups: securityGroups } = await ec2.describeSecurityGroups().promise();
    return securityGroups || [];
  } catch(e) {
    console.error(e);
    return [];
  }
}