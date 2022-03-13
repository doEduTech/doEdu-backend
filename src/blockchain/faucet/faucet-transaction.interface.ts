export interface IFaucetTransaction {
  id?: string;
  transactionId: string;
  created?: string;
  updated?: string;
  recipient: string;
  amount: number;
  status?: 'pending' | 'confirmed' | 'failed';
}
