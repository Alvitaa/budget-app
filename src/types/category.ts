import { TransactionType } from "@/constants/TransactionType";

export type Category = {
  id: string;
  name: string;
  type: TransactionType;
};