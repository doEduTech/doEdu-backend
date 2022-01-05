import { Request, Body, Controller, Get, Param, Post } from '@nestjs/common';

import { IBlockchainAccount, IBlockchainAccountCredentials } from './blockchain.interfaces';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private blockchainService: BlockchainService) {}

  @Get('get-account/:id')
  async getAccount(@Param('id') id: string): Promise<IBlockchainAccount> {
    return this.blockchainService.getAccount(id);
  }

  @Get('get-generated-passphrases')
  async generatePassphrases(): Promise<string> {
    return this.blockchainService.generatePassphrases();
  }

  @Post('initialize-account')
  async initializeAccount(@Request() req, @Body() body): Promise<IBlockchainAccountCredentials> {
    return this.blockchainService.initializeAccount(req.user.id, body.passphrase);
  }
}
