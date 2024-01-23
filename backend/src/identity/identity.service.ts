import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

enum RevocationStatus {
  REVOKED,
  SUSPENDED,
  VALID,
}

type RevocationCheckRequest = {
  type: string;
  url: string;
  [key: string]: any;
};

interface IdentityGRPCService {
  check: (
    param: RevocationCheckRequest,
  ) => Observable<{ status: RevocationStatus }>;
}

@Injectable()
export class IdentityService implements OnModuleInit {
  private identityService: IdentityGRPCService;

  constructor(@Inject('IDENTITY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.identityService = this.client.getService<IdentityGRPCService>(
      'CredentialRevocation',
    );
  }

  check(
    param: RevocationCheckRequest,
  ): Observable<{ status: RevocationStatus }> {
    return this.identityService.check(param);
  }
}
