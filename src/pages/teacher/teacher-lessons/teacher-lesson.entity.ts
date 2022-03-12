import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { UserEntity } from 'src/core/users/user.entity';
import { ELessonType } from './lesson-type.enum';

@Entity('teacher_lesson')
export class TeacherLessonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({
    length: 50
  })
  title: string;

  @Column({
    nullable: true,
    length: 500
  })
  description: string;

  @Column()
  cid: string;

  @Column({ nullable: true })
  nft: string;

  @Column({ nullable: true })
  previewCID: string;

  @Column({ type: 'enum', enum: ELessonType })
  type: ELessonType;

  @ManyToOne(() => UserEntity, (author) => author.id, { onDelete: 'CASCADE' })
  author: UserEntity;
}
