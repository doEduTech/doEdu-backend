import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';

const entitiesComponents = [TeacherLessonEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  providers: [MarketService],
  controllers: [MarketController]
})
export class MarketModule {}
