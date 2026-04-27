import { Account } from "@/types/account";
import Card from "./Card";
import { useEffect, useState } from "react";

type BalanceCardProps = {
    title: string;
    banks?: Account[];
    currency: string;
}

export default function BalanceCard({ title, banks, currency = "S/." }: BalanceCardProps) {
    const [selectedBankId, setSelectedBankId] = useState<string>("ALL");

    function HandleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setSelectedBankId(e.target.value);
    }

    function calculateAmount() {
        if (!banks || banks.length === 0) return 0;

        if (selectedBankId === "ALL") {
            return banks.reduce((acc, bank) => acc + bank.balance, 0)
        }

        const bank = banks.find(bank => bank.id === selectedBankId);
        return bank?.balance ?? 0;
    }

    const amount = calculateAmount();

    return (
        <Card className="justify-between">
            <h2 className="font-bold text-xl text-gray-950 flex justify-between items-center gap-5">
                {title}
                {banks && banks.length > 0 &&
                    <select name="account" value={selectedBankId} onChange={HandleChange} className="text-base font-medium text-neutral-400 text-right w-full max-w-full p-1">
                        <option className="" value={"ALL"}>Todas</option>
                        {banks.map(bank => (
                            <option className="" key={bank.id} value={bank.id}>{bank.name}</option>
                        ))}
                    </select>
                }
            </h2>
            {banks && banks.length > 0 ?
                <div className={`flex justify-between text-2xl font-bold`}>
                    <p>{currency}</p>
                    <p>{amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
                : <p className="text-lg text-neutral-400">No existen cuentas</p>
            }
        </Card>
    );
}