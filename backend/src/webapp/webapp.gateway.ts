import { v4 as uuidv4 } from 'uuid';
import { Logger, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebAppService } from './webapp.service';
import { IdentityService } from 'src/identity/identity.service';

@Injectable()
@WebSocketGateway()
export class WebAppGateway {
  constructor(
    private readonly webAppService: WebAppService,
    private readonly identityService: IdentityService,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebAppGateway.name);
  private connectedClients = new Map<string, { client: Socket }>();

  async handleConnection(client: any) {
    this.logger.debug('new connection received');

    const session_id = uuidv4();
    this.logger.debug(`generated session_id:${session_id}`);

    this.connectedClients.set(session_id, {
      client,
    });

    // this.identityService
    //   .check({
    //     url: 'did:example:1234567890#my-revocation-service',
    //     id: 'did:iota:EvaQhPXXsJsGgxSXGhZGMCvTt63KuAFtaGThx6a5nSpw?index=5#revocation',
    //     type: 'RevocationBitmap2022',
    //     revocationBitmapIndex: '5',
    //   })
    //   .subscribe({
    //     next(x) {
    //       console.log('got value ' + x);
    //     },
    //     error(err) {
    //       console.error('something wrong occurred: ' + err);
    //     },
    //     complete() {
    //       console.log('done');
    //     },
    //   });
    // await client.emitWithAck('registration', {
    //   id: session_id,
    // });

    this.identityService.create().subscribe({
      next(x) {
        console.log('got value ' + x);
      },
      error(err) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        console.log('done');
      },
    });
    await client.emitWithAck('registration', {
      id: session_id,
    });

    this.logger.debug(`send registration for session_id:${session_id}`);

    this.logger.debug(`added session_id:${session_id} to connected clients`);
  }

  handleDisconnect(client: any) {
    this.logger.debug(client);

    const connectedClient = [...this.connectedClients].find(
      ([key, value]) => value.client === client,
    )[0];
    this.connectedClients.delete(connectedClient);
  }

  @SubscribeMessage('requestOffer')
  async handleMessage(
    //@MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    const session_id = [...this.connectedClients].find(
      ([key, value]) => value.client === client,
    )[0];

    this.logger.debug(`receiving offer request for session_id:${session_id}`);

    const token = await this.webAppService.requestOffer(session_id);

    await client.emitWithAck('offer', {
      token: token,
    });

    this.logger.debug(`send offer for session_id:${session_id}`);
  }

  async connectDid(session_id: string, did: string) {
    const connectedClient = this.connectedClients.get(session_id);
    connectedClient.client.emitWithAck('connectDid', {
      did,
    });
  }
}
