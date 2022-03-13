import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockchainService } from 'src/blockchain/blockchain.service';
import { TippingEntity } from 'src/blockchain/entities/tipping.entity';
import { TippingService } from 'src/blockchain/entities/tipping.service';
import { IPFSClientService } from 'src/ipfs/ipfs-client.service';
import { TeacherLessonEntity } from './teacher-lesson.entity';
import { TeacherLessonsController } from './teacher-lessons.controller';
import { TeacherLessonsService } from './teacher-lessons.service';

const entitiesComponents = [TippingEntity, TeacherLessonEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [TeacherLessonsController],
  providers: [TeacherLessonsService, TippingService, IPFSClientService, BlockchainService]
})
export class TeacherLessonsModule {}
