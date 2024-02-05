import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  CREDENTIALS_PACKAGE_NAME,
  JWT_SERVICE_NAME,
  JwtClient,
  JwtCreationResponse,
} from './credentials';

@Injectable()
export class IdentityService implements OnModuleInit {
  private identityService: JwtClient;

  constructor(@Inject(CREDENTIALS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.identityService = this.client.getService<JwtClient>(JWT_SERVICE_NAME);
  }

  create(): Observable<JwtCreationResponse> {
    return this.identityService.create({
      credentialJson: JSON.stringify({
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
        ],
        type: ['VerifiableCredential', 'UniversityDegreeCredential'],
        issuanceDate: '2017-10-22T12:23:48Z',
        issuer:
          'did:iota:snd:0x7ef854cf8ad0b48cd76832221035c9d287a986434cee037f9a5e7ef4ebec2958',
        credentialSubject: {
          id: 'did:iota:snd:0xce05da2c7e3fd32e89b4fcaf77bb3101d89be60ba6276cba80bd3ec2bd0603f6',
          degree: {
            type: 'BachelorDegree',
            name: 'Bachelor of Science and Arts',
          },
        },
      }),
      issuerFragment: 'vMEts67gmY8kam21CGwdRQsfkhB6qgZl4xBO8bgCi8Y',
    });
  }
}
