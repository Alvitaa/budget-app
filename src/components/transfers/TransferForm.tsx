import { Account } from "@/types/account";
import { Transfer } from "@/types/Transfer";
import React, { useEffect, useState } from "react";
import Button from "../inputs/Button";

interface Props {
    initialData?: Transfer | null;
    onSubmit(data: any): void;
    accounts: Account[];
}

type TransferFormData = {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
}

export default function TransferForm({ initialData, onSubmit, accounts }: Props) {
    const [form, setForm] = useState<TransferFormData>({
        fromAccountId: "",
        toAccountId: "",
        amount: 0
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                fromAccountId: initialData.fromAccount.id,
                toAccountId: initialData.toAccount.id,
                amount: initialData.amount,
            })
        }
    }, [initialData]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form onSubmit={(e) => { e.preventDefault; onSubmit(form); }} className="flex flex-col gap-5">
            {accounts.length <= 0 ?
                <>
                    <select className="w-full border p-2 rounded-lg text-gray-400 bg-gray-200" disabled >
                        <option value="">No tienes cuentas</option>
                    </select>
                    <select className="w-full border p-2 rounded-lg text-gray-400 bg-gray-200" disabled >
                        <option value="">No tienes cuentas</option>
                    </select>
                </>
                :
                <>
                    <select className="w-full border p-2 rounded-lg" name="fromAccountId" value={form.fromAccountId} onChange={handleChange} >
                        <option value="">Escoge una cuenta de origen</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                    </select>
                    <select className="w-full border p-2 rounded-lg" name="toAccountId" value={form.toAccountId} onChange={handleChange} >
                        <option value="">Escoge una cuenta destino</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                    </select>
                </>
            }
            <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Monto" className="w-full border p-2 rounded-xl" />
            <Button type="submit" className="primary" disabled={accounts.length <= 0} onClick={() => {}}>
                Guardar
            </Button>
        </form>
    );
}