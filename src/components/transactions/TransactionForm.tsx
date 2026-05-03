import { TransactionType, TransactionTypeLabels } from "@/constants/TransactionType";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { title } from "process";
import { useEffect, useState } from "react";

interface Props {
    initialData?: Transaction | null;
    onSubmit: (data: any) => void;
    categories: Category[];
    accounts: Account[];
    lastDate?: string;
    setLastDate?(data: any): void;
    lastAccount?: string;
    setLastAccount?(data: any): void;
}

type TransactionFormData = {
    title: string;
    amount: number;
    description: string;
    type: TransactionType;
    date: string;
    categoryId: string;
    accountId: string;
};

export default function TransactionForm({
     initialData, onSubmit, categories, accounts,
     lastDate = new Date().toISOString().split("T")[0], setLastDate,
     lastAccount = "", setLastAccount,
    }: Props) {
    const [form, setForm] = useState<TransactionFormData>({
        title: "",
        amount: 0,
        description: "",
        type: "EXPENSE",
        date: lastDate,
        categoryId: "",
        accountId: lastAccount
    })

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title,
                amount: initialData.amount,
                description: initialData.description ?? "",
                type: initialData.type,
                date: new Date(initialData.date).toISOString().split("T")[0],
                categoryId: initialData.category?.id ?? "",
                accountId: initialData.account?.id ?? ""
            })
        }
    }, [initialData]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === "date" && setLastDate) setLastDate(value);
        if (name === "accountId" && setLastAccount) setLastAccount(value);
    }

    function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
            categoryId: ""
        }));
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-5">
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Detalle" className="w-full border p-2" />
            <select className="w-full border p-2" name="type" value={form.type} onChange={handleTypeChange}>
                {Object.entries(TransactionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            {categories.filter((category) => category.type == form.type).length <= 0 ?
                <select className="w-full border p-2 text-gray-400 bg-gray-200" disabled >
                    <option value="">No tienes categorías</option>
                </select>
                :
                <select className="w-full border p-2" name="categoryId" value={form.categoryId} onChange={handleChange} >
                    <option value="">Escoge una categoría</option>
                    {categories.filter((category) => category.type == form.type).map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            }
            <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="" className="w-full border p-2" />
            <input type="date" name="date" value={form.date} onChange={handleChange} placeholder="" className="w-full border p-2" />
            {accounts.length <= 0 ?
                <select className="w-full border p-2 text-gray-400 bg-gray-200" disabled >
                    <option value="">No tienes cuentas</option>
                </select>
                :
                <select className="w-full border p-2" name="accountId" value={form.accountId} onChange={handleChange} >
                    <option value="">Escoge una cuenta</option>
                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                </select>
            }
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción del gasto..." className="w-full border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Guardar
            </button>
        </form>
    );
}