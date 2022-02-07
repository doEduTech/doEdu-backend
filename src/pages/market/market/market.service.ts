import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';
import { IMarketLesson } from './market-lesson.interface';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(TeacherLessonEntity)
    private teacherLessonRepository: Repository<TeacherLessonEntity>
  ) {}

  async findAll(page = '0', pageSize = '10'): Promise<IMarketLesson[]> {
    const skip = Number(page || 0) * Number(pageSize || 0);
    const query = `SELECT
        (SELECT COUNT(*) 
        FROM "teacher-lesson"
        ) as count, 
        (SELECT json_agg(t.*) FROM (
            SELECT 
				lesson.id, 
				lesson.title, 
				lesson.description, 
				lesson.created, 
				lesson.cid, 
				lesson."previewCID", 
				json_build_object('id', usr.id, 'email', usr.email) AS author 
      FROM "teacher-lesson" lesson
			LEFT JOIN public.user usr ON lesson."authorId" = usr.id
			ORDER BY lesson.created DESC
      OFFSET ${skip}
      LIMIT ${pageSize}
    ) AS t) AS rows`;

    const result = await this.teacherLessonRepository.query(query);
    return result[0];
  }

  async findOne(lessonId: string): Promise<IMarketLesson> {
    const query = `
        SELECT 				
        lesson.id, 
        lesson.title, 
        lesson.description, 
        lesson.created, 
        lesson.cid, 
        lesson."previewCID",
        json_build_object('id', usr.id, 'email', usr.email) AS author 
    FROM
        "teacher-lesson" lesson
    LEFT JOIN public.user usr ON lesson."authorId" = usr.id
    WHERE
      lesson.id = '${lessonId}'`;
    const result = await this.teacherLessonRepository.query(query);
    return result[0];
  }
}
