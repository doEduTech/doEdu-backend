export interface ITransactionHistory {
  id: string;
  amount: number;
  timestamp: Date;
  type: ITransactionHistoryType;
}

export type ITransactionHistoryType = 'faucet' | 'tip';
