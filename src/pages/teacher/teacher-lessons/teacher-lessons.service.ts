import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TeacherLessonEntity } from './teacher-lesson.entity';
import { ITeacherLesson } from './teacher-lesson.interface';

@Injectable()
export class TeacherLessonsService {
  constructor(
    @InjectRepository(TeacherLessonEntity)
    private teacherLessonRepository: Repository<TeacherLessonEntity>
  ) {}

  async saveLesson(lesson: ITeacherLesson): Promise<TeacherLessonEntity> {
    return await this.teacherLessonRepository.save(lesson);
  }

  async findAll(authorId: string, page = '0', pageSize = '10'): Promise<TeacherLessonEntity[]> {
    const skip = Number(page || 0) * Number(pageSize || 0);
    const query = `
      SELECT
        (SELECT COUNT(*) 
        FROM "teacher-lesson"
        WHERE "authorId" = '${authorId}'
        ) as count, 
        (SELECT json_agg(t.*) FROM (
            SELECT * FROM "teacher-lesson"
            WHERE "authorId" = '${authorId}'
            ORDER BY created DESC
            OFFSET ${skip}
            LIMIT ${pageSize}
        ) AS t) AS rows 
    `;
    const result = await this.teacherLessonRepository.query(query);
    return result[0];
  }

  async findOne(authorId: string, lessonId: string): Promise<TeacherLessonEntity> {
    return await this.teacherLessonRepository.findOne(lessonId, {
      where: {
        author: authorId
      }
    });
  }
}
