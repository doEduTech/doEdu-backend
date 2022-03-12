import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LessonLikeEntity } from 'src/pages/market/market-lessons/lesson-like.entity';
import { LearnerDashboardLessonsController } from './learner-dashboard-lessons.controller';
import { LearnerDashboardLessonsService } from './learner-dashboard-lessons.service';

const entitiesComponents = [LessonLikeEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entitiesComponents)],
  controllers: [LearnerDashboardLessonsController],
  providers: [LearnerDashboardLessonsService]
})
export class LearnerDashboardLessonsModule {}
