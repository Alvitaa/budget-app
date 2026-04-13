import { TransactionType } from "@/constants/TransactionType";
import { Category } from "./category";
import { Account } from "./account";

export type Transaction = {
    id: string;
    title: string;
    description: string | null;
    amount: number;
    type: TransactionType;
    date: string;
    userId: string;

    category: {
        id: string;
        name: string;
    } | null;

    account: {
        id: string;
        name: string;
    } | null;
}