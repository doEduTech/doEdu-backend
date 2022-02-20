import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MarketLessonsService } from './market-lessons.service';
import { MarketLessonsController } from './market-lessons.controller';
import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';
import { LessonLikeEntity } from './lesson-like.entity';

const entitiesComponents = [TeacherLessonEntity, LessonLikeEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  providers: [MarketLessonsService],
  controllers: [MarketLessonsController]
})
export class MarketLessonsModule {}
