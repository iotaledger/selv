import { join } from 'path';

export default () => ({
  oid4vc_grpc_service_url: 'oid4vc-tanglelabs:50051',
  oid4vc_grpc_service_timeout: 10 * 1000,
  oid4vc_grpc_service_protopath: join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'proto',
    'oid4vc',
  ),
});
