import AWS from 'aws-sdk';
import { AWS_EC2_API_VERSION } from '../constants/api';
import { getAWSCredentials } from '../utilities/aws-credentials';

/**
 * Lists all regions, this is useful if we want to fetch a resource per region
 * or if the resource can only be fetched per region
 */
export async function listRegions(): Promise<AWS.EC2.RegionList> {
  try {
    const ec2 = new AWS.EC2({
      apiVersion: AWS_EC2_API_VERSION,
      ...getAWSCredentials()
    });
    const { Regions: regions } = await ec2.describeRegions().promise();
    return (regions || []).filter(r => r && r.RegionName);
  } catch (e) {
    console.error(e);
    return [];
  }
}
