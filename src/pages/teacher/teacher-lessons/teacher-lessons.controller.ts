import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Param,
  Query,
  Put
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { IPFSClientService } from 'src/ipfs/ipfs-client.service';
import { ELessonType } from './lesson-type.enum';
import { TeacherLessonEntity } from './teacher-lesson.entity';
import { ITeacherLesson } from './teacher-lesson.interface';
import { TeacherLessonsService } from './teacher-lessons.service';

@Controller('teacher/lessons')
export class TeacherLessonsController {
  constructor(private ipflClientService: IPFSClientService, private teacherLessonsService: TeacherLessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'preview', maxCount: 1 },
      { name: 'content', maxCount: 1 }
    ])
  )
  async createLesson(
    @UploadedFiles() files: { preview?: Express.Multer.File[]; content: Express.Multer.File[] },
    @Request() req,
    @Body() body
  ) {
    let fileType: string;
    const mimetype = files.content[0].mimetype;
    if (mimetype === 'application/pdf') {
      fileType = ELessonType.PDF;
    } else if (mimetype === 'audio/mpeg') {
      fileType = ELessonType.AUDIO;
    } else if (mimetype === 'video/mp4') {
      fileType = ELessonType.VIDEO;
    } else {
      throw new Error('Unsupported file type');
    }

    const contentFileCID = await this.ipflClientService.upload(files.content[0]);

    let previewFileCID = null;
    if (files.preview) {
      previewFileCID = await this.ipflClientService.upload(files.preview[0]);
    }
    const lesson = {
      cid: contentFileCID,
      previewCID: previewFileCID,
      title: body.title,
      description: body.description,
      author: req.user.id,
      type: fileType
    };
    return await this.teacherLessonsService.saveLesson(lesson);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':lessonId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'preview', maxCount: 1 },
      { name: 'content', maxCount: 1 }
    ])
  )
  async updateLesson(
    @Param('lessonId') lessonId: string,
    @UploadedFiles() files: { preview?: Express.Multer.File[] | '' },
    @Request() req,
    @Body() body
  ) {
    const originalLesson = await this.teacherLessonsService.findOneOfAuthor(req.user.id, lessonId);
    if (originalLesson) {
      const updatedLessonFileds: ITeacherLesson = Object.assign({}, originalLesson);

      const isNewPreviewDefined =
        Object.prototype.hasOwnProperty.call(Object.assign({}, files), 'preview') ||
        Object.prototype.hasOwnProperty.call(Object.assign({}, body), 'preview');
      if (isNewPreviewDefined) {
        if (originalLesson.previewCID && body.preview === '') {
          updatedLessonFileds['previewCID'] = null;
          this.ipflClientService.unpinFile(originalLesson.previewCID);
        } else if (files.preview) {
          updatedLessonFileds['previewCID'] = await this.ipflClientService.upload(files.preview[0]);
        }
      }
      if (body.title !== originalLesson.title) {
        updatedLessonFileds['title'] = body.title;
      }
      if (body.description !== originalLesson.description) {
        updatedLessonFileds['description'] = body.description;
      }

      return await this.teacherLessonsService.saveLesson(updatedLessonFileds);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAll(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Request() req
  ): Promise<TeacherLessonEntity[]> {
    return await this.teacherLessonsService.findAll(req.user.id, page, pageSize);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param() id: string, @Request() req): Promise<TeacherLessonEntity> {
    return await this.teacherLessonsService.findOneOfAuthor(req.user.id, id);
  }
}
