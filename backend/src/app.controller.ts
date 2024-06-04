import { Body, Controller, Get, Header, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { WebAppService } from './webapp/webapp.service';

import { jwtDecode } from 'jwt-decode';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    private readonly webAppService: WebAppService,
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
  eventListener(@Body() body: string): void {
    this.logger.debug('received event', body);
    const parsedEvent = JSON.parse(body);

    switch (parsedEvent[0]) {
      case 'SIOPv2AuthorizationResponseVerified':
        const { id_token, state } = parsedEvent[0];
        const parsedIDToken = jwtDecode(id_token);
        this.webAppService.connectUser({
          did: parsedIDToken.sub,
          code: state,
        });
        break;

      default:
        break;
    }

    return;
  }
}
