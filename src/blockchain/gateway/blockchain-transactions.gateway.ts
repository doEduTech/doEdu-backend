import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { Socket } from 'socket.io';

import { AuthService } from 'src/core/auth/auth.service';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { BlockchainService } from '../blockchain.service';

@WebSocketGateway({ cors: true })
export class BlockchainTransactionsGateway {
  constructor(private blockchainService: BlockchainService, private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers.authorization || null;
    const decodedJWT = this.authService.decodeToken(jwt.replace('Bearer ', ''));

    this.blockchainService.client.subscribe('app:block:new', async () => {
      const account = await this.blockchainService.getAccount(decodedJWT.blockchainAddress);
      socket.emit('account', account);
    });
  }
}
