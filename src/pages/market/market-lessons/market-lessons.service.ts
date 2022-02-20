import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TeacherLessonEntity } from 'src/pages/teacher/teacher-lessons/teacher-lesson.entity';
import { IMarketLesson, IMarketLessonsQueryParams } from './market-lesson.interface';
import { LessonLikeEntity } from './lesson-like.entity';

@Injectable()
export class MarketLessonsService {
  constructor(
    @InjectRepository(TeacherLessonEntity)
    private teacherLessonRepository: Repository<TeacherLessonEntity>,
    @InjectRepository(LessonLikeEntity)
    private lessonLikeRepository: Repository<LessonLikeEntity>
  ) {}

  async findAll(queryParams: IMarketLessonsQueryParams): Promise<IMarketLesson[]> {
    const page = queryParams.page ? Number(queryParams.page) : 0;
    const pageSize = queryParams.pageSize ? Number(queryParams.pageSize) : 10;
    const skip = page * pageSize;

    const whereClause = this.getWhereClause(queryParams);

    const query = `SELECT
        (SELECT COUNT(*) 
          FROM "teacher-lesson" lesson
          ${whereClause ? 'WHERE ' + whereClause : ''} 
        ) as count, 
        (SELECT json_agg(t.*) FROM (
            SELECT 
				lesson.id, 
				lesson.title, 
				lesson.description, 
				lesson.created, 
				lesson.cid, 
        lesson."previewCID", 
        lesson.type,
				json_build_object('id', usr.id, 'email', usr.email) AS author 
      FROM "teacher-lesson" lesson
      LEFT JOIN public.user usr ON lesson."authorId" = usr.id
      ${whereClause ? 'WHERE ' + whereClause : ''} 
			ORDER BY lesson.created DESC
      OFFSET ${skip}
      LIMIT ${pageSize}
    ) AS t) AS rows`;

    const result = await this.teacherLessonRepository.query(query);
    return result[0];
  }

  async findOne(lessonId: string, userId = ''): Promise<IMarketLesson> {
    const query = `
        SELECT 				
        lesson.id, 
        lesson.title, 
        lesson.description, 
        lesson.created, 
        lesson.cid, 
        lesson."previewCID",
        lesson.type,
        json_build_object('id', usr.id, 'email', usr.email) AS author 
    FROM
        "teacher-lesson" lesson
    LEFT JOIN public.user usr ON lesson."authorId" = usr.id
    WHERE
      lesson.id = '${lessonId}'`;

    const result = await this.teacherLessonRepository.query(query);
    if (userId) {
      const liked = await this.getLike(lessonId, userId);
      return {
        ...result[0],
        liked
      };
    } else {
      return result[0];
    }
  }

  async likeLesson(lessonId: string, userId: string): Promise<LessonLikeEntity> {
    const like = {
      author: userId,
      lesson: lessonId
    } as unknown as LessonLikeEntity;

    return await this.lessonLikeRepository.save(like);
  }

  async unlikeLesson(lessonId: string, userId: string): Promise<void> {
    const query = `
      DELETE FROM lesson_likes
      WHERE "lessonId" = '${lessonId}' AND "authorId" = '${userId}';
    `;
    return await this.lessonLikeRepository.query(query);
  }

  private getWhereClause(queryParams: IMarketLessonsQueryParams): string {
    const selectVideoClause = queryParams.video === 'true' ? `lesson.type = 'video'` : '';
    const selectAudioClause = queryParams.audio === 'true' ? `lesson.type = 'audio'` : '';
    const selectPdfClause = queryParams.pdf === 'true' ? `lesson.type = 'pdf'` : '';
    const typesClauses = [selectVideoClause, selectAudioClause, selectPdfClause].filter((val) => !!val);
    if (typesClauses.length > 1) {
      return typesClauses.join(' OR ');
    }
    if (typesClauses.length === 1) {
      return typesClauses[0];
    }
    return '';
  }

  private async getLike(lessonId: string, userId: string): Promise<boolean> {
    const query = `
      SELECT exists(
        SELECT 1 
        FROM lesson_likes 
        WHERE "lessonId" = '${lessonId}' 
          AND "authorId" = '${userId}'
      )`;
    const result = await this.lessonLikeRepository.query(query);
    return result[0].exists;
  }
}
