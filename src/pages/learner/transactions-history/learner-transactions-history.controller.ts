import { Controller, Request, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { LearnerTransactionsHistoryService } from './learner-transactions-history.service';
import { ITransactionHistory } from './transaction-history.interface';

@Controller('learner/transactions-history')
export class LearnerTransactionsHistoryController {
  constructor(private learnerTransactionsHistoryService: LearnerTransactionsHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getTransactionsHistory(@Request() req): Promise<ITransactionHistory[]> {
    return await this.learnerTransactionsHistoryService.findAll(req.user.id);
  }
}
