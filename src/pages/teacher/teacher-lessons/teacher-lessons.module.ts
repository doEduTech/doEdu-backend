import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IPFSClientService } from 'src/ipfs/ipfs-client.service';
import { TeacherLessonEntity } from './teacher-lesson.entity';
import { TeacherLessonsController } from './teacher-lessons.controller';
import { TeacherLessonsService } from './teacher-lessons.service';

const entitiesComponents = [TeacherLessonEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [TeacherLessonsController],
  providers: [TeacherLessonsService, IPFSClientService]
})
export class TeacherLessonsModule {}
