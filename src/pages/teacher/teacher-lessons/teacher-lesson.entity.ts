import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { UserEntity } from 'src/core/users/user.entity';

@Entity('teacher-lesson')
export class TeacherLessonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  cid: string;

  @Column({ nullable: true })
  previewCID: string;

  @ManyToOne(() => UserEntity, (author) => author.id, { onDelete: 'CASCADE' })
  author: UserEntity;
}
