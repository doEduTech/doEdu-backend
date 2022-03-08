import { Injectable } from '@nestjs/common';

import { apiClient, passphrase, cryptography, transactions } from '@liskhq/lisk-client';
import { APIClient } from '@liskhq/lisk-api-client/dist-node/api_client';

import { IUser } from './../core/users/user.interface';
import { AuthService } from './../core/auth/auth.service';
import { UsersService } from './../core/users/users.service';
import { IBlockchainAccount, IBlockchainAccountCredentials } from './blockchain.interfaces';
import { DEDU_TOKEN_PREFIX } from '../constants';
import { EventEmitter } from 'events';
import { ITip } from './entities/tip.interface';
import { TippingService } from './entities/tipping.service';
import { TippingEntity } from './entities/tipping.entity';

@Injectable()
export class BlockchainService {
  public newBlockForged = new EventEmitter();
  public client: APIClient;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private tippingService: TippingService
  ) {
    this.setClient();
  }

  public async getAccount(address: string): Promise<IBlockchainAccount> {
    try {
      const account = await this.client.account.get(address);
      if (account) {
        const { token, nft } = account;
        return this.client.account.toJSON({ address, token, nft }) as unknown as IBlockchainAccount;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  public async generatePassphrases(): Promise<string> {
    return JSON.stringify(passphrase.Mnemonic.generateMnemonic());
  }

  public async transferTokens(
    recipientUserId: string,
    amount: number,
    passphrase: string,
    userId: string
  ): Promise<void> {
    const recipientUser = await this.usersService.findOneById(recipientUserId);
    if (!recipientUser) {
      throw new Error('No recipient user account found');
    }

    const rawTx = {
      moduleID: 1024,
      assetID: 2,
      asset: {
        amount: BigInt(amount),
        recipientAddress: Buffer.from(recipientUser.blockchainAddress, 'hex'),
        data: 'tip'
      }
    };

    const transaction = await this.client.transaction.create({ ...rawTx, fee: BigInt(0) }, passphrase);

    const pendingTransaction = await this.client.transaction.send(transaction);

    this.createPendingTipTransaction({
      recipient: recipientUserId,
      transactionId: pendingTransaction.transactionId,
      sender: userId,
      amount
    });
  }

  private createPendingTipTransaction(tip: ITip): void {
    this.tippingService.savePendingTransaction(tip as unknown as TippingEntity);
  }

  // TODO: this function is for development and tests only - remove it on prod
  public async getFaucetTokens(address: string): Promise<void> {
    if (!process.env.DEDU_FAUCET_PASSPHRASE) {
      throw new Error('DEDU Faucet service is not enabled.');
    }

    const amount = BigInt(transactions.convertLSKToBeddows('10'));
    const rawTx = {
      moduleID: 2,
      assetID: 0,
      asset: {
        amount,
        recipientAddress: Buffer.from(address, 'hex'),
        data: 'transfer 1000000000 tokens from faucet account'
      }
    };

    await this.client.transaction.send(
      await this.client.transaction.create({ ...rawTx, fee: BigInt(0) }, process.env.DEDU_FAUCET_PASSPHRASE)
    );
  }

  public async initializeAccount(
    user: IUser,
    passphrase: string
  ): Promise<IBlockchainAccountCredentials & { access_token: string }> {
    const rawAddress = cryptography.getAddressFromPassphrase(passphrase);
    const address = cryptography.bufferToHex(rawAddress);
    const { privateKey, publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
    const humanReadableAddress = cryptography.getBase32AddressFromAddress(rawAddress, DEDU_TOKEN_PREFIX);

    await this.updateUserBlockchainAddress(user.id, address);

    return {
      publicKey: cryptography.bufferToHex(publicKey),
      privateKey: cryptography.bufferToHex(privateKey),
      address,
      humanReadableAddress,
      access_token: this.authService.generateAccessToken({ ...user, blockchainAddress: address })
    };
  }

  private async setClient(): Promise<void> {
    if (!this.client) {
      const blockchainConfigPath = process.env.BLOCKCHAIN_CONFIG_PATH;
      this.client = await apiClient.createIPCClient(blockchainConfigPath);
      this.client.subscribe('app:block:new', async (block) => {
        const pendigTipTransactionsIds = await this.tippingService.getIdsOfAllPendingTransactions();
        this.updateTippingTransactions(pendigTipTransactionsIds);
        this.newBlockForged.emit('app:block:new', block);
      });
    }
  }

  private updateTippingTransactions(pendigTipTransactions) {
    pendigTipTransactions.forEach(async (pendigTipTransactionId) => {
      const transactionStatus = await this.client.invoke('app:getTransactionByID', { id: pendigTipTransactionId });
      if (transactionStatus) {
        this.tippingService.confirmTransaction(pendigTipTransactionId);
      }
    });
  }

  private async updateUserBlockchainAddress(userId: string, address: string): Promise<void> {
    this.usersService.setBlockchainAddress(userId, address);
  }
}
