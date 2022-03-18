import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockchainService } from 'src/blockchain/blockchain.service';
import { FaucetTransactionEntity } from 'src/blockchain/faucet/faucet-transaction.entity';
import { FaucetTransactionService } from 'src/blockchain/faucet/faucet-transaction.service';
import { TippingEntity } from 'src/blockchain/tipping/tipping.entity';
import { TippingService } from 'src/blockchain/tipping/tipping.service';
import { IPFSClientService } from 'src/ipfs/ipfs-client.service';
import { TeacherLessonEntity } from './teacher-lesson.entity';
import { TeacherLessonsController } from './teacher-lessons.controller';
import { TeacherLessonsService } from './teacher-lessons.service';

const entitiesComponents = [TippingEntity, TeacherLessonEntity, FaucetTransactionEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [TeacherLessonsController],
  providers: [TeacherLessonsService, TippingService, FaucetTransactionService, IPFSClientService, BlockchainService]
})
export class TeacherLessonsModule {}
