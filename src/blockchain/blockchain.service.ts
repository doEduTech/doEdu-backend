import { Injectable } from '@nestjs/common';

import { apiClient, passphrase, cryptography } from '@liskhq/lisk-client';
import { APIClient } from '@liskhq/lisk-api-client/dist-node/api_client';

import { UsersService } from './../core/users/users.service';
import { IBlockchainAccount, IBlockchainAccountCredentials } from './blockchain.interfaces';

@Injectable()
export class BlockchainService {
  private client: APIClient;

  constructor(private usersService: UsersService) {
    this.setClient();
  }

  public async getAccount(address: string): Promise<IBlockchainAccount> {
    const blockchainAccount = await this.client.account.get(address);
    return this.client.account.toJSON(blockchainAccount) as unknown as IBlockchainAccount;
  }

  public async generatePassphrases(): Promise<string> {
    return JSON.stringify(passphrase.Mnemonic.generateMnemonic());
  }

  public async initializeAccount(userId: string, passphrase: string): Promise<IBlockchainAccountCredentials> {
    const rawAddress = cryptography.getAddressFromPassphrase(passphrase);
    const address = cryptography.bufferToHex(rawAddress);
    const { privateKey, publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
    const humanReadableAddress = cryptography.getBase32AddressFromAddress(rawAddress);

    await this.updateUserBlockchainAddress(userId, address);

    return {
      publicKey: cryptography.bufferToHex(publicKey),
      privateKey: cryptography.bufferToHex(privateKey),
      address,
      humanReadableAddress
    };
  }

  private async setClient(): Promise<void> {
    const blockchainConfigPath = process.env.BLOCKCHAIN_CONFIG_PATH;
    if (!this.client) {
      this.client = await apiClient.createIPCClient(blockchainConfigPath);
    }
  }

  private async updateUserBlockchainAddress(userId: string, address: string): Promise<void> {
    this.usersService.setBlockchainAddress(userId, address);
  }
}
