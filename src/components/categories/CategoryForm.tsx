import { TransactionType, TransactionTypeLabels } from "@/constants/TransactionType";
import { Category } from "@/types/category";
import { useEffect, useState } from "react";

interface Props {
    initialData?: Category | null;
    onSubmit: (data: any) => void;
}

type CategoryFormData = {
    name: string;
    type: TransactionType;
}

export default function CategoryForm({ initialData, onSubmit }: Props) {
    const [form, setForm] = useState<CategoryFormData>({
        name: "",
        type: "EXPENSE"
    })

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                type: initialData.type
            })
        }
    }, [])

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="flex flex-col gap-5">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nombre de categoría" className="w-full border p-2"/>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2">
                {Object.entries(TransactionTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            <button type="submit" className="mt-5 bg-blue-500 text-white p-2 rounded cursor-pointer">
                Guardar
            </button>
        </form>
    )
}