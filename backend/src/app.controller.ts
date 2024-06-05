import { Body, Controller, Get, Header, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { WebAppService } from './webapp/webapp.service';

import { JwtPayload, jwtDecode } from 'jwt-decode';
import { OID4VCImpierceService } from './oid4vc/oid4vc-impierce.service';

interface SIOPv2AuthorizationResponseVerified {
  SIOPv2AuthorizationResponseVerified: {
    state: string;
    id_token: string;
  };
}

interface OID4VPAuthorizationResponseVerified {
  OID4VPAuthorizationResponseVerified: {
    state: string;
    vp_token: string;
  };
}

interface CredentialRequestVerified {
  CredentialRequestVerified: {
    offer_id: string;
    subject_id: string;
  };
}

interface CredentialResponseCreated {
  CredentialResponseCreated: {
    offer_id: string;
    credential_response: {
      credential: string;
    };
  };
}

type Events =
  | SIOPv2AuthorizationResponseVerified
  | OID4VPAuthorizationResponseVerified
  | CredentialRequestVerified
  | CredentialResponseCreated;

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    private readonly webAppService: WebAppService,
    private readonly impierceService: OID4VCImpierceService,
  ) {}

  private readonly logger = new Logger(AppController.name);

  @Get('.well-known/did-configuration.json')
  @Header('content-type', 'application/json')
  didConfiguration(): string {
    return JSON.stringify({
      '@context':
        'https://identity.foundation/.well-known/did-configuration/v1',
      linked_dids: [
        'eyJraWQiOiJkaWQ6aW90YTpybXM6MHg0ODY4ZDYxNzczYTlmOGU1NDc0MTI2MWEwZTgyZmM4ODNlMjk5YzI2MTRjOTRiMjQwMGUyNDIzZDRjNWJiZTZhIzBBaWpZdXFQcmNnYVYwU05GMlFRSW9neUs3UVR0MWRNQjhjNDlBUXItZVkiLCJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.eyJleHAiOjE3MzQwMTM1NjAsImlzcyI6ImRpZDppb3RhOnJtczoweDQ4NjhkNjE3NzNhOWY4ZTU0NzQxMjYxYTBlODJmYzg4M2UyOTljMjYxNGM5NGIyNDAwZTI0MjNkNGM1YmJlNmEiLCJuYmYiOjE3MDI0Nzc1NjAsInN1YiI6ImRpZDppb3RhOnJtczoweDQ4NjhkNjE3NzNhOWY4ZTU0NzQxMjYxYTBlODJmYzg4M2UyOTljMjYxNGM5NGIyNDAwZTI0MjNkNGM1YmJlNmEiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vaWRlbnRpdHkuZm91bmRhdGlvbi8ud2VsbC1rbm93bi9kaWQtY29uZmlndXJhdGlvbi92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiRG9tYWluTGlua2FnZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsib3JpZ2luIjoiaHR0cHM6Ly9zZWx2LmlvdGEub3JnLyJ9fX0.OHdWQAa23-v56AEsSHB2EoaViRih8tO-C3DpkhO0h_GwlXcusfuZumYkXc2dPW1aHURAOZKFgbR2nQ-8lqowBg',
      ],
    });
  }

  @Post('event-listener')
  async eventListener(@Body() body: Events): Promise<void> {
    this.logger.debug('received event', body);

    const event = Object.keys(body)[0];

    // TODO: figure out type safety
    switch (event) {
      case 'SIOPv2AuthorizationResponseVerified': {
        const { id_token, state } = body[event];
        const parsedIDToken = jwtDecode(id_token);
        this.webAppService.connectUser({
          did: parsedIDToken.sub,
          code: state,
        });
        break;
      }

      case 'OID4VPAuthorizationResponseVerified': {
        const { vp_token, state } = body[event];
        const parsedVPToken = jwtDecode<JwtPayload & { vp: string }>(vp_token);
        this.webAppService.presentCredential(
          {
            did: parsedVPToken.sub,
            code: state,
          },
          vp_token,
        );
        break;
      }

      case 'CredentialRequestVerified': {
        const { offer_id, subject_id } = body[event];

        const credential = await this.webAppService.requestCredential(
          {
            did: subject_id,
            code: offer_id,
          },
          'TBD',
        );

        this.impierceService.submitSignedCredential(offer_id, credential[0]);

        break;
      }

      default:
        break;
    }

    return;
  }
}
