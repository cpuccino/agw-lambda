import AWS from 'aws-sdk';
import { AWS_EC2_API_VERSION } from '../constants/api';
import { getAWSCredentials } from '../utilities/aws-credentials';

/**
 * Lists all EC2 instances in a region
 * 
 * @param region 
 */
export async function listEC2Instances(region: string): Promise<AWS.EC2.InstanceList> {
  if(!region) return [];

  try {
    const ec2 = new AWS.EC2({
      apiVersion: AWS_EC2_API_VERSION,
      region,
      ...getAWSCredentials()
    });

    const { Reservations: reservations } = await ec2.describeInstances().promise();
    if(!reservations || !reservations.length) return [];

    const regionInstances = [] as AWS.EC2.InstanceList;
    for(const reservation of reservations) {
      if(!reservation) continue;
      const { Instances: instances } = reservation;
      (instances || []).forEach(instance => regionInstances.push(instance));
    }
    
    return regionInstances;
  } catch(e) {
    console.error(e);
    return [];
  }
}