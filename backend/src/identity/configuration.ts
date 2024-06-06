import { join } from 'path';

export default () => ({
  grpc_service_url: 'identity:50051',
  grpc_service_timeout: 10 * 1000,
  grpc_service_protopath: join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'shared',
    'proto',
    'identity',
  ),
});
