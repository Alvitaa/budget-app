"use client"

import TransactionForm from "@/components/transactions/TransactionForm";
import Modal from "@/components/ui/modal/Modal";
import Table, { Column } from "@/components/ui/table/Table";
import { TransactionTypeLabels } from "@/constants/TransactionType";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { IoAddCircle, IoPencil, IoTrash } from "react-icons/io5";

export default function MovementsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [transactionPage, setTransactionPage] = useState(0);
    const [transactionsPerPage, setTransactionPerPage] = useState(20);
    const [lastDate, setLastDate] = useState(new Date().toISOString().split("T")[0]);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const columns: Column<Transaction>[] = [
        {
            header: "Fecha",
            render: (t) => t.date.split("T")[0]
        },
        {
            header: "Tipo",
            render: (t) => TransactionTypeLabels[t.type]
        },
        {
            header: "Categoría",
            render: (t) => t.category?.name ?? "No especificada"
        },
        {
            header: "Título",
            render: (t) => t.title
        },
        {
            header: "Monto",
            render: (t) => (
                <div className="flex place-content-between">
                    <p>S/.</p>
                    <p>{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            )
        },
        {
            header: "Description",
            className: "w-2/9!",
            render: (t) => t.description ? t.description : "-"
        },
        {
            header: "Cuenta",
            render: (t) => t.account?.name ?? "No especificada"
        },
        {
            header: "",
            className: "w-1/13",
            render: (t) => (
                <div className="flex justify-end gap-5">
                    <button onClick={() => handleEdit(t)} className="rounded-full hover:bg-neutral-300 p-2">
                        <IoPencil />
                    </button>
                    <button onClick={() => confirmDelete(t)} className="rounded-full hover:bg-neutral-300 p-2">
                        <IoTrash />
                    </button>
                </div>
            )
        },
    ]

    function handleCreate() {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    }

    function handleEdit(transaction: Transaction) {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    }

    function confirmDelete(transaction: Transaction) {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
    }

    async function handleDelete(id: string) {
        try {
            await apiFetch(`transactions/${id}`, {
                method: "DELETE",
            });

            setIsDeleteModalOpen(false);
            fetchTransactions();
        } catch (error) {
            console.error("Error eliminando el movimiento:", error)
        }
    }

    async function handleSubmit(data: any) {
        if (selectedTransaction) {
            await apiFetch(`transactions/${selectedTransaction.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    ...data,
                }),
            });
        } else {
            console.log("Creando transacción...")
            await apiFetch("transactions", {
                method: "POST",
                body: JSON.stringify(data),
            });
        }

        setIsModalOpen(false);
        fetchTransactions();
    }

    useEffect(() => {
        fetchAccounts();
        fetchCategories();
        fetchTransactions();
    }, [])

    async function fetchTransactions() {
        try {
            const data = await apiFetch(`transactions?skip=${transactionPage}&take=${transactionsPerPage}`, {
                method: "GET",
            })
            setTransactions(data);
            if (data.length > 0) setIsLoaded(true);
        } catch (e) {
            console.error("Error cargando movimientos:", e);
        }
    }

    async function fetchAccounts() {
        try {
            const data = await apiFetch("accounts", {
                method: "GET",
            })
            setAccounts(data);
        } catch (e) {
            console.error("Error cargando cuentas:", e);
        }
    }

    async function fetchCategories() {
        try {
            const data = await apiFetch("categories", {
                method: "GET",
            })
            setCategories(data);
        } catch (e) {
            console.error("Error cargando categorías:", e);
        }
    }

    return (
        <>
            <h1>Movimientos</h1>
            <button onClick={handleCreate} className="px-4 py-2 bg-main font-medium text-white rounded-2xl shadow-m flex justify-center items-center">
                <span className="mr-2 text-2xl">
                    <IoAddCircle />
                </span>
                Nuevo movimiento
            </button>

            {isLoaded ?
                <Table className="card-border rounded-xl overflow-hidden" columnClassName="" columns={columns} rows={transactions} />
                :
                <h2>You have no transactions registered. Add one!</h2>
            }

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTransaction ? "Editar" : "Crear"}
            >
                <TransactionForm initialData={selectedTransaction} onSubmit={handleSubmit} categories={categories} accounts={accounts} lastDate={lastDate} setLastDate={setLastDate} />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="¿Estás seguro?"
            >
                <p>Esta acción es irreversible.</p>
                <div className="flex place-content-around gap-5 mt-5">
                    <button onClick={() => handleDelete(selectedTransaction!.id)} className="px-2 py-2 w-full bg-red-500 rounded text-white font-bold cursor-pointer">
                        Sí, borrar
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(false)} className="px-2 py-2 w-full bg-gray-200 rounded cursor-pointer">
                        No, cancelar
                    </button>
                </div>
            </Modal>
        </>
    );
}