"use client"

import Button from "@/components/inputs/Button";
import TransferForm from "@/components/transfers/TransferForm";
import DeleteModal from "@/components/ui/modal/DeleteModal";
import Modal from "@/components/ui/modal/Modal";
import Table, { Column } from "@/components/ui/table/Table";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";
import { Transfer } from "@/types/Transfer";
import { useEffect, useState } from "react";
import { IoAddCircle, IoPencil, IoTrash } from "react-icons/io5";

export default function TransfersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [transfersPage, setTransfersPage] = useState(0);
    const [transfersPerPage, setTransfersPerPage] = useState(20);

    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [selectedTransfer, SetSelectedTransfer] = useState<Transfer | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const columns: Column<Transfer>[] = [
        {
            header: "Fecha",
            render: (c) => c.date.split("T")[0]
        },
        {
            header: "Monto",
            render: (c) => c.amount
        },
        {
            header: "Cuenta Origen",
            render: (c) => c.fromAccount?.name
        },
        {
            header: "Cuenta Destino",
            render: (c) => c.toAccount?.name
        },
        {
            header: "Acciones",
            className: "w-1/9 text-center!",
            render: (t) => (
                <div className="flex justify-between">
                    <button onClick={() => handleEdit(t)} className="rounded-full hover:bg-neutral-300 p-2">
                        <IoPencil />
                    </button>
                    <button onClick={() => confirmDelete(t)} className="rounded-full hover:bg-neutral-300 p-2">
                        <IoTrash />
                    </button>
                </div>
            )
        }
    ]

    async function fetchTransfers() {
        try {
            const data = await apiFetch(`transfers?skip=${transfersPage}&take=${transfersPerPage}`, {
                method: "GET",
            })

            setTransfers(data);
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

    useEffect(() => {
        fetchTransfers();
        fetchAccounts();
    }, [])

    function handleCreate() {
        SetSelectedTransfer(null);
        setIsModalOpen(true);
    }

    function handleEdit(transfer: Transfer) {
        SetSelectedTransfer(transfer);
        setIsModalOpen(true);
    }

    async function handleSubmit(data: any) {
        if (selectedTransfer) {
            await apiFetch(`transfers/${selectedTransfer.id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            });
        } else {
            await apiFetch(`transfers`, {
                method: "POST",
                body: JSON.stringify(data),
            });
        }

        fetchTransfers();
        setIsModalOpen(false);
    }

    function confirmDelete(transfer: Transfer) {
        SetSelectedTransfer(transfer);
        setIsDeleteModalOpen(true);
    }

    async function handleDelete(id: string) {
        try {
            await apiFetch(`transfers/${id}`, {
                method: "DELETE",
            });

            setIsDeleteModalOpen(false);
            fetchTransfers();
        } catch (e) {
            console.error("Error eliminando transferencia", e);
        }
    }

    return (
        <>
            <h1>Transferencias</h1>

            <Button onClick={handleCreate} className="main flex justify-center items-center">
                <span className="mr-2 text-2xl">
                    <IoAddCircle />
                </span>
                Nueva Transferencia
            </Button>

            {isLoaded ?
                <Table className="card-border rounded-xl overflow-hidden" columnClassName="text-left" columns={columns} rows={transfers} />
                :
                <h2>You have no transfers made. Add one!</h2>
            }

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedTransfer ? "Editar" : "Crear"}
            >
                <TransferForm initialData={selectedTransfer} onSubmit={handleSubmit} accounts={accounts} />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={() => handleDelete(selectedTransfer!.id)}
            />
        </>
    );
}