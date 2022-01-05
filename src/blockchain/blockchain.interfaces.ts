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
  sequence: {
    nonce: number;
  };
  keys: {
    numberOfSignatures: number;
    mandatoryKeys: [];
    optionalKeys: [];
  };
  dpos: {
    delegate: {
      username: string;
      pomHeights: [];
      consecutiveMissedBlocks: number;
      lastForgedHeight: number;
      isBanned: boolean;
      totalVotesReceived: number;
    };
    sentVotes: [];
    unlocking: [];
  };
  nft: {
    ownNFTs: [];
    mintedNFTs: [];
  };
}