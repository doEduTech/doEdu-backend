import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { UserEntity } from 'src/core/users/user.entity';
import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';

@Entity('lesson_likes')
@Unique(['lesson', 'author'])
export class LessonLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @ManyToOne(() => TeacherLessonEntity, (lesson) => lesson.id, { onDelete: 'CASCADE' })
  lesson: TeacherLessonEntity;

  @ManyToOne(() => UserEntity, (author) => author.id, { onDelete: 'CASCADE' })
  author: UserEntity;
}
