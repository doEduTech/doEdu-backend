import { Module } from '@nestjs/common';

import { BlockchainController } from './blockchain.contoller';
import { BlockchainService } from './blockchain.service';
import { BlockchainTransactionsGateway } from './gateway/blockchain-transactions.gateway';

@Module({
  controllers: [BlockchainController],
  providers: [BlockchainService, BlockchainTransactionsGateway],
  exports: [BlockchainService]
})
export class BlockchainModule {}
