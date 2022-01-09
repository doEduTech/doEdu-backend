import { ConnectedSocket, MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Socket } from 'socket.io';

@WebSocketGateway()
export class BlockchainTransactionsGateway implements OnGatewayInit {
  constructor() {}

  @SubscribeMessage('transaction')
  handleEvent(@MessageBody('transaction') transaction: any, @ConnectedSocket() client: Socket): any {
    console.log('transaction', transaction);
  }

  afterInit(): void {
    console.log(' ws init');
  }
}
