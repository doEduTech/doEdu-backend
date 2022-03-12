import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TippingEntity } from './entities/tipping.entity';
import { BlockchainController } from './blockchain.contoller';
import { BlockchainService } from './blockchain.service';
import { TippingService } from './entities/tipping.service';
import { BlockchainTransactionsGateway } from './gateway/blockchain-transactions.gateway';

const entitiesComponents = [TippingEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [BlockchainController],
  providers: [BlockchainService, TippingService, BlockchainTransactionsGateway],
  exports: [BlockchainService, TippingService, BlockchainTransactionsGateway]
})
export class BlockchainModule {}
