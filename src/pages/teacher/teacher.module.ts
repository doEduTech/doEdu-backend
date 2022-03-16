import { Module } from '@nestjs/common';

import { TeacherLessonsModule } from './teacher-lessons/teacher-lessons.module';
import { TeacherTransactionsHistoryModule } from './transactions-history/teacher-transactions-history.module';

@Module({
  imports: [TeacherLessonsModule, TeacherTransactionsHistoryModule]
})
export class TeacherModule {}
