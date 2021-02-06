import AWS from 'aws-sdk';

export type DescribeSecurityGroupsCallback = (
  err?: AWS.AWSError | null,
  data?: AWS.EC2.Types.DescribeSecurityGroupsResult
) => void;
export type DescribeRegionsCallback = (
  err?: AWS.AWSError | null,
  data?: AWS.EC2.Types.DescribeRegionsResult
) => void;
export type DescribeInstanceCallback = (
  err?: AWS.AWSError | null,
  data?: AWS.EC2.Types.DescribeInstancesResult
) => void;

export function generateMockRegions(): AWS.EC2.RegionList {
  const regionNames = [
    'eu-north-1',
    'ap-south-1',
    'eu-west-3',
    'eu-west-2',
    'eu-west-1',
    'ap-northeast-2',
    'ap-northeast-1',
    'sa-east-1',
    'ca-central-1',
    'ap-southeast-1',
    'ap-southeast-2',
    'eu-central-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2'
  ];

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

export function generateMockSecurityGroupIdentifier(
  identifier: string
): AWS.EC2.SecurityGroupIdentifier {
  return {
    GroupName: identifier,
    GroupId: identifier
  };
}

export function generateMockEC2Instance(
  override: Partial<AWS.EC2.Instance> = {}
): AWS.EC2.Instance {
  return {
    AmiLaunchIndex: 0,
    ImageId: 'random-imageid',
    InstanceId: 'random-instanceid',
    InstanceType: 't2.micro',
    LaunchTime: new Date(),
    Monitoring: { State: 'disabled' },
    Placement: {
      AvailabilityZone: 'random-availability-zone',
      GroupName: '',
      Tenancy: 'default'
    },
    PrivateDnsName: 'random-ip.ap-southeast-2.compute.internal',
    PrivateIpAddress: 'random-ip',
    ProductCodes: [],
    PublicDnsName: 'ec2-random-ip.ap-southeast-2.compute.amazonaws.com',
    PublicIpAddress: 'random-ip',
    State: { Code: 16, Name: 'running' },
    StateTransitionReason: '',
    SubnetId: 'random-subnet',
    VpcId: 'random-vpc',
    Architecture: 'x86_64',
    ClientToken: '',
    EbsOptimized: false,
    EnaSupport: true,
    Hypervisor: 'xen',
    ElasticGpuAssociations: [],
    ElasticInferenceAcceleratorAssociations: [],
    RootDeviceName: '/dev/sda1',
    RootDeviceType: 'ebs',
    SourceDestCheck: true,
    Tags: [],
    VirtualizationType: 'hvm',
    CpuOptions: { CoreCount: 1, ThreadsPerCore: 1 },
    CapacityReservationSpecification: { CapacityReservationPreference: 'open' },
    HibernationOptions: { Configured: false },
    Licenses: [],
    MetadataOptions: {
      State: 'applied',
      HttpTokens: 'optional',
      HttpPutResponseHopLimit: 1,
      HttpEndpoint: 'enabled'
    },
    EnclaveOptions: { Enabled: false },
    ...override
  };
}
