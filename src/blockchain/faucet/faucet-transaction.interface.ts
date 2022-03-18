export interface IFaucetTransaction {
  id?: string;
  transactionId: string;
  created?: string;
  updated?: string;
  recipient: string;
  amount: BigInt;
  status?: 'pending' | 'confirmed' | 'failed';
}
