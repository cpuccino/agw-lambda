import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env.dev') });

/**
 * Describe security group only fetches in a single region
 * So we would need to loop through all regions to get all existing security groups
 */
export async function listEC2SecurityGroups() {
  const ec2 = new AWS.EC2({ 
    apiVersion: '2016-11-15',
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!
    } 
  });

  try {
    const securityGroups = await ec2.describeSecurityGroups().promise();
    console.log(securityGroups);
  } catch(e) {
    console.error(e);
  }
}