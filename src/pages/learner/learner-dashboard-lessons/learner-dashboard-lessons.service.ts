import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { LessonLikeEntity } from 'src/pages/market/market-lessons/lesson-like.entity';

@Injectable()
export class LearnerDashboardLessonsService {
  constructor(
    @InjectRepository(LessonLikeEntity)
    private lessonLikeRepository: Repository<LessonLikeEntity>
  ) {}

  public async findAll(authorId: string, page = '0', pageSize = '10'): Promise<any[]> {
    const skip = Number(page || 0) * Number(pageSize || 0);
    const query = `
      SELECT
        (SELECT COUNT(*) 
        	FROM "lesson_like"
        	WHERE "authorId" = '${authorId}'
        ) as count, 
        (SELECT json_agg(t.*) FROM (
      SELECT 
        lesson_like.created,
        lesson_like."authorId" as like_author, 
        teacher_lesson.title, 
        teacher_lesson.type as type, 
        teacher_lesson."previewCID", 
        teacher_lesson.id as "lessonId"
      FROM "lesson_like"
			LEFT JOIN teacher_lesson ON teacher_lesson.id = lesson_like."lessonId"
      WHERE lesson_like."authorId" = '${authorId}'
      ORDER BY lesson_like.created DESC
      OFFSET ${skip}
      LIMIT ${pageSize}
        ) AS t) AS rows 
    `;
    const result = await this.lessonLikeRepository.query(query);
    return result[0];
  }
}
