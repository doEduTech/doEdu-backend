import { Module } from '@nestjs/common';

import { TeacherLessonsModule } from './teacher-lessons/teacher-lessons.module';
import { TransactionsHistoryModule } from './transactions-history/transactions-history.module';

@Module({
  imports: [TeacherLessonsModule, TransactionsHistoryModule]
})
export class TeacherModule {}
