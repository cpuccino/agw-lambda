import AWS from 'aws-sdk';
import { AWS_EC2_API_VERSION } from '../constants/api';
import { getAWSCredentials } from '../utilities/aws-credentials';

export async function listRegions() {
  try {
    const ec2 = new AWS.EC2({ 
      apiVersion: AWS_EC2_API_VERSION,
      ...getAWSCredentials()
    });
    const { Regions: regions } = await ec2.describeRegions().promise();
    return (regions || []).filter(r => r.RegionName);
  } catch(e) {
    console.error(e);
    return [];
  }
}

/**
 * "describeSecurityGroups" method only fetches from a single region
 * So we would need to loop through all regions to get all existing security groups
 */
export async function listEC2SecurityGroups() {
  try {    
    const ec2 = new AWS.EC2({ 
      apiVersion: AWS_EC2_API_VERSION,
      ...getAWSCredentials()
    });
    const regions = await listRegions();
    console.log(regions);
    const securityGroups = await ec2.describeSecurityGroups().promise();
    console.log(securityGroups);
  } catch(e) {
    console.error(e);
  }
}