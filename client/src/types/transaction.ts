
export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
  description: string;
};
