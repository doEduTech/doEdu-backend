import { Module } from '@nestjs/common';

import { BlockchainController } from './blockchain.contoller';
import { BlockchainService } from './blockchain.service';

@Module({
  controllers: [BlockchainController],
  providers: [BlockchainService],
  exports: [BlockchainService]
})
export class BlockchainModule {}
