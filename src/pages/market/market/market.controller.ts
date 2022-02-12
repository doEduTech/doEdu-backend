import { Controller, Get, Param, Query } from '@nestjs/common';

import { IMarketLesson, IMarketLessonsQueryParams } from './market-lesson.interface';
import { MarketService } from './market.service';

@Controller('market')
export class MarketController {
  constructor(private marketService: MarketService) {}

  @Get('lessons')
  async getAll(@Query() queryParams: IMarketLessonsQueryParams): Promise<IMarketLesson[]> {
    return await this.marketService.findAll(queryParams);
  }

  @Get('lessons/:id')
  async getOne(@Param('id') id: string): Promise<IMarketLesson> {
    return await this.marketService.findOne(id);
  }
}
