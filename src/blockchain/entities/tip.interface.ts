export interface ITip {
  id?: string;
  transactionId: string;
  created?: string;
  updated?: string;
  sender: string;
  recipient: string;
  amount: number;
  status?: 'pending' | 'confirmed' | 'failed';
}
