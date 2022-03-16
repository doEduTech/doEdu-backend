import { Controller, Request, Get, UseGuards, Query } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { ITransactionHistory } from 'src/pages/learner/transactions-history/transaction-history.interface';
import { TeacherTransactionsHistoryService } from './transactions-history.service';

@Controller('teacher/transactions-history')
export class TeacherTransactionsHistoryController {
  constructor(private teacherTransactionsHistoryService: TeacherTransactionsHistoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getTransactionsHistory(@Request() req): Promise<ITransactionHistory[]> {
    return await this.teacherTransactionsHistoryService.findAll(req.user.id);
  }
}
