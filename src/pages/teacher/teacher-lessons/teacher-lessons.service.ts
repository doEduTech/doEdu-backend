import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import multer from 'multer';
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

  async findAll(authorId: string): Promise<TeacherLessonEntity[]> {
    return await this.teacherLessonRepository.find({
      where: {
        author: authorId
      }
    });
  }

  async findOne(authorId: string, lessonId: string): Promise<TeacherLessonEntity> {
    return await this.teacherLessonRepository.findOne(lessonId, {
      where: {
        author: authorId
      }
    });
  }
}
