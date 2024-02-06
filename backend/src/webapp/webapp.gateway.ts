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

    try {
      await this.identityService.create({
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
    } catch (error) {
      this.logger.error(error);
    }

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
