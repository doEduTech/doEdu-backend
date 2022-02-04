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
  Query
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { IPFSClientService } from 'src/ipfs/ipfs-client.service';
import { TeacherLessonEntity } from './teacher-lesson.entity';
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
      author: req.user.id
    };
    return await this.teacherLessonsService.saveLesson(lesson);
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
  async getOne(@Request() req, @Param() id: string): Promise<TeacherLessonEntity> {
    return await this.teacherLessonsService.findOne(req.user.id, id);
  }
}
