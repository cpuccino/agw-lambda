import AWS from 'aws-sdk';

export type DescribeSecurityGroupsCallback = (
  err?: AWS.AWSError | null,
  data?: AWS.EC2.Types.DescribeSecurityGroupsResult
) => void;

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
