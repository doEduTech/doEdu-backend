import { IFaucetTransaction } from './../../dist/blockchain/faucet/tip.interface.d';
import { Injectable } from '@nestjs/common';

import { apiClient, passphrase, cryptography, transactions } from '@liskhq/lisk-client';
import { APIClient } from '@liskhq/lisk-api-client/dist-node/api_client';

import { IUser } from './../core/users/user.interface';
import { AuthService } from './../core/auth/auth.service';
import { UsersService } from './../core/users/users.service';
import { IBlockchainAccount, IBlockchainAccountCredentials } from './blockchain.interfaces';
import { DEDU_TOKEN_PREFIX } from '../constants';
import { EventEmitter } from 'events';
import { ITip } from './tipping/tip.interface';
import { TippingService } from './tipping/tipping.service';
import { TippingEntity } from './tipping/tipping.entity';
import { TeacherLessonsService } from 'src/pages/teacher/teacher-lessons/teacher-lessons.service';
import { EnftMintingStatus } from 'src/pages/teacher/teacher-lessons/nft-minting-status.enum';
import { FaucetTransactionService } from './faucet/faucet-transaction.service';

@Injectable()
export class BlockchainService {
  public newBlockForged = new EventEmitter();
  public client: APIClient;
  private pendingNFTminting: { lessonId: string; transactionId: string }[] = [];

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private tippingService: TippingService,
    private faucetTransactionService: FaucetTransactionService,
    private teacherLessonsService: TeacherLessonsService
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
  public async getFaucetTokens(address: string, recipientUserId: string): Promise<void> {
    if (!process.env.DEDU_FAUCET_PASSPHRASE) {
      throw new Error('DEDU Faucet service is not enabled.');
    }

    const amount = BigInt(1000);
    const rawTx = {
      moduleID: 2,
      assetID: 0,
      asset: {
        amount,
        recipientAddress: Buffer.from(address, 'hex'),
        data: 'transfer 1000000000 tokens from faucet account'
      }
    };

    const transaction = await this.client.transaction.create(
      { ...rawTx, fee: BigInt(0) },
      process.env.DEDU_FAUCET_PASSPHRASE
    );
    const pendingTransaction = await this.client.transaction.send(transaction);
    this.createPendingFaucetTransaction({
      recipient: recipientUserId,
      transactionId: pendingTransaction.transactionId,
      amount
    });
  }

  private createPendingFaucetTransaction(faucetTransactionData: IFaucetTransaction): void {
    this.faucetTransactionService.savePendingTransaction(faucetTransactionData as unknown as TippingEntity);
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

  public async mintNFT(title: string, ownerId: string, cid: string, lessonId: string): Promise<void> {
    const ownerUser = await this.usersService.findOneById(ownerId);
    if (!ownerUser) {
      throw new Error('No owner user account found');
    }

    const asset = {
      name: title,
      ownerAddress: Buffer.from(ownerUser.blockchainAddress, 'hex'),
      transferable: true,
      meta: Buffer.from(''),
      avatarHash: Buffer.from(''),
      contentHash: Buffer.from(cid, 'hex')
    };

    const rawTx = {
      moduleID: 1024,
      assetID: 0,
      asset
    };

    const transaction = await this.client.transaction.create(
      { ...rawTx, fee: BigInt(0) },
      process.env.MINTER_PASSPHRASE
    );

    const sentTransaction = await this.client.transaction.send(transaction);
    this.pendingNFTminting = [...this.pendingNFTminting, { lessonId, transactionId: sentTransaction.transactionId }];
  }

  private async setClient(): Promise<void> {
    if (!this.client) {
      const blockchainConfigPath = process.env.BLOCKCHAIN_CONFIG_PATH;
      this.client = await apiClient.createIPCClient(blockchainConfigPath);
      this.client.subscribe('app:block:new', async (block) => {
        this.updateTransactions();
        this.newBlockForged.emit('app:block:new', block);
      });
    }
  }

  private updateTransactions(): void {
    this.updateTippingTransactions();
    this.updateNFTtransactions();
    this.updateFaucetTransactions();
  }

  private updateNFTtransactions(): void {
    this.pendingNFTminting.forEach(async (tx) => {
      const nft = await this.client.invoke('nft:getNFTByTxId', { id: tx.transactionId });
      this.removeQueuedNFTtransaction(tx.transactionId);
      if (nft) {
        this.teacherLessonsService.updateNFTStatus(tx.lessonId, EnftMintingStatus.CONFIRMED, nft.id as string);
      } else {
        this.teacherLessonsService.updateNFTStatus(tx.lessonId, EnftMintingStatus.FAILED, null);
      }
    });
  }

  private removeQueuedNFTtransaction(transactionId: string): void {
    this.pendingNFTminting = this.pendingNFTminting.filter((tx) => tx.transactionId !== transactionId);
  }

  private async updateFaucetTransactions(): Promise<void> {
    const pendigFaucetTransactionsIds = await this.faucetTransactionService.getIdsOfAllPendingTransactions();
    pendigFaucetTransactionsIds.forEach(async (pendigFaucetTransactionId) => {
      const transactionStatus = await this.client.invoke('app:getTransactionByID', { id: pendigFaucetTransactionId });
      if (transactionStatus) {
        this.faucetTransactionService.confirmTransaction(pendigFaucetTransactionId);
      }
    });
  }

  private async updateTippingTransactions(): Promise<void> {
    const pendigTipTransactionsIds = await this.tippingService.getIdsOfAllPendingTransactions();
    pendigTipTransactionsIds.forEach(async (pendigTipTransactionId) => {
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
