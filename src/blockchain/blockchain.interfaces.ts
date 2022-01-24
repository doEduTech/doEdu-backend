export interface IBlockchainAccountCredentials {
  publicKey: string;
  privateKey: string;
  address: string;
  humanReadableAddress: string;
}

export interface IBlockchainAccount {
  address: string;
  token: {
    balance: number;
  };
  nft: {
    ownNFTs: [];
    mintedNFTs: [];
  };
}
