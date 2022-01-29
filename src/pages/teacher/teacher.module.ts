import { Module } from '@nestjs/common';

import { TeacherLessonsModule } from './teacher-lessons/teacher-lessons.module';

@Module({
  imports: [TeacherLessonsModule]
})
export class TeacherModule {}
