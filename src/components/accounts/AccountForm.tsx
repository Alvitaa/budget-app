import { Account } from "@/types/account";
import { useEffect, useState } from "react";

interface Props {
    initialData?: Account | null;
    onSubmit: (data: any) => void;
}

type AccountFormData = {
    name: string;
    balance: number;
}

export default function AccountForm({ initialData, onSubmit }: Props) {
    const [form, setForm] = useState<AccountFormData>({
        name: "",
        balance: 0
    })

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                balance: initialData.balance
            })
        }
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-5">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre de la cuenta" className="w-full border p-2" />
            <input type="number" name="balance" value={form.balance} onChange={handleChange} placeholder="Balance de la cuenta" className="w-full border p-2" />
            <button type="submit" className="mt-5 bg-blue-500 text-white p-2 rounded cursor-pointer">
                Guardar
            </button>
        </form>
    )
}