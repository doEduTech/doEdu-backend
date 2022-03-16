import { Module } from '@nestjs/common';

import { LearnerDashboardLessonsModule } from './learner-dashboard-lessons/learner-dashboard-lessons.module';
import { LearnerTransactionsHistoryModule } from './transactions-history/learner-transactions-history.module';

@Module({
  imports: [LearnerDashboardLessonsModule, LearnerTransactionsHistoryModule]
})
export class LearnerModule {}
