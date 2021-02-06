import AWS from 'aws-sdk';

export async function listEC2SecurityGroups() {
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
  try {
    const securityGroups = await ec2.describeSecurityGroups().promise();
    console.log(securityGroups);
  } catch(e) {
    console.error(e);
  }
}