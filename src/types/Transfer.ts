export type Transfer = {
    id: string;
    amount: number;
    date: string;

    fromAccount: {
        id: string;
        name: string;
    };

    toAccount: {
        id: string;
        name: string;
    };
};
