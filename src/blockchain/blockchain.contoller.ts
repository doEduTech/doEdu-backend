import { Request, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { IBlockchainAccount, IBlockchainAccountCredentials } from './blockchain.interfaces';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private blockchainService: BlockchainService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get-account/:id')
  async getAccount(@Param('id') id: string): Promise<IBlockchainAccount> {
    return this.blockchainService.getAccount(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-generated-passphrases')
  async generatePassphrases(): Promise<string> {
    return this.blockchainService.generatePassphrases();
  }

  @UseGuards(JwtAuthGuard)
  @Post('initialize-account')
  async initializeAccount(@Request() req, @Body() body): Promise<IBlockchainAccountCredentials> {
    return this.blockchainService.initializeAccount(req.user, body.passphrase);
  }
}
