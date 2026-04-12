import { TransactionType } from "@/constants/TransactionType";
import { Category } from "./category";
import { Account } from "./account";

export type Transaction = {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    type: TransactionType;
    date: Date;
    userId: string;

    category: {
        name: string
    } | null;

    account: {
        name: string
    } | null;
}