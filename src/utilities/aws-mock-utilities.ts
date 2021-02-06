import AWS from 'aws-sdk';

export function generateMockRegions() : AWS.EC2.RegionList {
  const regionNames = [
    'eu-north-1', 'ap-south-1', 'eu-west-3', 'eu-west-2', 'eu-west-1', 
    'ap-northeast-2', 'ap-northeast-1', 'sa-east-1', 'ca-central-1', 
    'ap-southeast-1', 'ap-southeast-2', 'eu-central-1', 'us-east-1', 
    'us-east-2', 'us-west-1', 'us-west-2'
  ]

  return regionNames.map(rn => ({
    Endpoint: `ec2.${rn}.amazonaws.com`,
    RegionName: rn,
    OptInStatus: 'opt-in-not-required'
  }));
}

export function generateMockSecurityGroup(groupId = 'Default SG'): AWS.EC2.SecurityGroup {
  return {
    GroupId: groupId,
    GroupName: groupId,
    Description: groupId,
    IpPermissions: [],
    OwnerId: 'random-ownerid',
    IpPermissionsEgress: [
      {
        IpProtocol: '-1',
        IpRanges: [
            {
              CidrIp: '0.0.0.0/0'
            }
        ],
        Ipv6Ranges: [],
        PrefixListIds: [],
        UserIdGroupPairs: []
      }
    ],
    Tags: [],
    VpcId: 'random-vpc'
  };
}