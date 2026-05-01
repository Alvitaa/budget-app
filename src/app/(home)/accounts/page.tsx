"use client";
import AccountForm from "@/components/accounts/AccountForm";
import Modal from "@/components/ui/modal/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Table, { Column } from "@/components/ui/table/Table";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";
import { useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";

export default function AccountsPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const [accounts, setAccounts] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

	const columns: Column<Account>[] = [
		{
			header: "Balance",
			className: "w-1/6",
			render: (a) => (
				<div className="flex place-content-between">
					<p>S/.</p>
					<p>{a.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
				</div>
			)
		},
		{
			header: "Nombre",
			className: "w-4/6",
			render: (a) => a.name
		},
		{
			header: "Acciones",
			className: "w-1/6 text-center!",
			render: (a) => (
				<div className="flex justify-between">
					<button onClick={() => handleEdit(a)} className="px-2 py-1 w-20 bg-yellow-400 rounded">
						Editar
					</button>
					<button onClick={() => confirmDelete(a)} className="px-2 py-1 w-20 bg-red-500 text-white rounded">
						Eliminar
					</button>
				</div>
			)
		},
	];

	async function fetchAccounts() {
		try {
			const data = await apiFetch("accounts", {
				method: "GET",
			})
			setAccounts(data);
			if (data.length > 0) setIsLoaded(true);
		} catch (e) {
			console.error("Error cargando cuentas", e);
		}
	}

	useEffect(() => {
		fetchAccounts();
	}, []);

	async function handleCreate() {
		setSelectedAccount(null);
		setIsModalOpen(true);
	}

	async function handleEdit(account: Account) {
		setSelectedAccount(account)
		setIsModalOpen(true);
	}

	function confirmDelete(account: Account) {
		setSelectedAccount(account)
		setIsDeleteModalOpen(true);
	}

	async function handleSubmit(data: any) {
		if (selectedAccount) {
			await apiFetch(`accounts/${selectedAccount.id}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			});
		} else {
			await apiFetch("accounts", {
				method: "POST",
				body: JSON.stringify(data),
			});
		}

		setIsModalOpen(false);
		fetchAccounts()
	}

	async function handleDelete(id: string) {
		try {
			await apiFetch(`accounts/${id}`, {
				method: "DELETE",
			});

			setIsDeleteModalOpen(false);
			fetchAccounts();
		} catch (e) {
			console.error("Error eliminando cuenta.", e)
		}
	}

	return (
		<>
			<h1>Cuentas</h1>

			<button onClick={handleCreate} className="px-4 py-2 bg-main font-medium text-white rounded-2xl shadow-m flex justify-center items-center">
				<span className="mr-2 text-2xl">
					<IoAddCircle/>
				</span>
				Nueva Cuenta
			</button>

			{isLoaded ?
				<Table className="card-border rounded-xl overflow-hidden" columnClassName="text-left" columns={columns} rows={accounts} />
				:
				<h2>You have no accounts created. Add one!</h2>}

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={selectedAccount ? "Editar" : "Crear"}
			>
				<AccountForm initialData={selectedAccount} onSubmit={handleSubmit} />
			</Modal>

			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="¿Estás seguro?"
			>
				<p>Esta acción es irreversible.</p>
				<div className="flex place-content-around gap-5 mt-5">
					<button onClick={() => handleDelete(selectedAccount!.id)} className="px-2 py-2 w-full bg-red-500 rounded text-white font-bold cursor-pointer">
						Sí, borrar
					</button>
					<button onClick={() => setIsDeleteModalOpen(false)} className="px-2 py-2 w-full bg-gray-200 rounded cursor-pointer">
						No, cancelar
					</button>
				</div>
			</Modal>
		</>
	)
}