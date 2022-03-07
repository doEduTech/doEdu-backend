import { Controller, Request, Get, UseGuards, Query } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { LearnerDashboardLessonsService } from './learner-dashboard-lessons.service';

@Controller('learner/dashboard-lessons')
export class LearnerDashboardLessonsController {
  constructor(private learnerDashboardLessonsService: LearnerDashboardLessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('liked')
  async getLiked(@Query('page') page: string, @Query('pageSize') pageSize: string, @Request() req): Promise<any[]> {
    return await this.learnerDashboardLessonsService.findAll(req.user.id, page, pageSize);
  }
}
