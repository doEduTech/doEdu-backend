import { Controller, Request, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { LearnerTransactionsHistoryService } from './learner-transactions-history.service';

@Controller('learner/transactions-history')
export class LearnerTransactionsHistoryController {
  constructor(private learnerTransactionsHistoryService: LearnerTransactionsHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getTransactionsHistory(@Request() req): Promise<any> {
    return await this.learnerTransactionsHistoryService.findAll(req.user.id);
  }
}
