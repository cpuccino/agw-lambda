import AWS from 'aws-sdk';

export type DescribeInstanceCallback = (
  err?: AWS.AWSError | null,
  data?: AWS.EC2.Types.DescribeInstancesResult
) => void;

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
