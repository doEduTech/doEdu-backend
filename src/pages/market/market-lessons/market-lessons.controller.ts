import { Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';

import { ApplyUser } from 'src/core/auth/guards/apply-user.guard';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { IMarketLesson, IMarketLessonsQueryParams } from './market-lesson.interface';
import { MarketLessonsService } from './market-lessons.service';

@Controller('market/lessons')
export class MarketLessonsController {
  constructor(private marketService: MarketLessonsService) {}

  @Get('')
  async getAll(@Query() queryParams: IMarketLessonsQueryParams): Promise<IMarketLesson[]> {
    return await this.marketService.findAll(queryParams);
  }

  @UseGuards(ApplyUser)
  @Get(':id')
  async getOne(@Request() req, @Param('id') id: string): Promise<IMarketLesson> {
    const userId = req.user && req.user.id;
    return await this.marketService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@Request() req, @Param('id') id: string): Promise<void> {
    await this.marketService.likeLesson(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlike(@Request() req, @Param('id') id: string): Promise<void> {
    await this.marketService.unlikeLesson(id, req.user.id);
  }
}
