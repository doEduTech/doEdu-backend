import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TippingEntity } from './entities/tipping.entity';
import { BlockchainController } from './blockchain.contoller';
import { BlockchainService } from './blockchain.service';
import { TippingService } from './entities/tipping.service';
import { BlockchainTransactionsGateway } from './gateway/blockchain-transactions.gateway';
import { TeacherLessonsService } from 'src/pages/teacher/teacher-lessons/teacher-lessons.service';
import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';

const entitiesComponents = [TippingEntity, TeacherLessonEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [BlockchainController],
  providers: [BlockchainService, TippingService, TeacherLessonsService, BlockchainTransactionsGateway],
  exports: [BlockchainService, TippingService, TeacherLessonsService, BlockchainTransactionsGateway]
})
export class BlockchainModule {}
