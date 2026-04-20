"use client";
import AccountForm from "@/components/accounts/AccountForm";
import Modal from "@/components/ui/modal/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";
import { useEffect, useState } from "react";

export default function AccountsPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const [accounts, setAccounts] = useState([]);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

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
			<PageHeader title="Cuentas" />

			<button onClick={handleCreate} className="mb-4 px-4 py-2 bg-green-500 text-white rounded">
				+ Nueva Cuenta
			</button>

			{isLoaded ?
				<table className="w-full border">
					<thead>
						<tr className="bg-gray-200">
							<th className="p-2 border">Nombre</th>
							<th className="p-2 border">Balance</th>
							<th className="p-2 border">Acciones</th>
						</tr>
					</thead>

					<tbody>
						{accounts.map((account: any) => (
							<tr key={account.id}>
								<td className="p-2 border">{account.name}</td>
								<td className="p-2 border">S/ {account.balance}</td>
								<td className="p-2 border flex gap-2">
									<button onClick={() => handleEdit(account)} className="px-2 py-1 bg-yellow-400 rounded">
										Editar
									</button>
									<button onClick={() => confirmDelete(account)} className="px-2 py-1 bg-red-500 text-white rounded">
										Eliminar
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				:
				<h2>You have no accounts registered. Create one!</h2>}

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