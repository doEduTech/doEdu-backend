import { Controller, Request, Get, UseGuards, Query } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { ILearnerDashboardLesson } from './learner-dashboard-lesson.interface';
import { LearnerDashboardLessonsService } from './learner-dashboard-lessons.service';

@Controller('learner/dashboard-lessons')
export class LearnerDashboardLessonsController {
  constructor(private learnerDashboardLessonsService: LearnerDashboardLessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('liked')
  async getLiked(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Request() req
  ): Promise<ILearnerDashboardLesson[]> {
    return await this.learnerDashboardLessonsService.findAll(req.user.id, page, pageSize);
  }
}
