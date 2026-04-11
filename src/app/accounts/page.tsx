"use client";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";
import { useEffect, useState } from "react";

export default function AccountsPage() {
	const [accounts, setAccounts] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	const [form, setForm] = useState<{
		name: string;
		balance: number;
	}>({
		name: "",
		balance: 0
	});

	const [editingId, setEditingId] = useState<string | null>(null);

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

	async function handleSubmit() {
		if (!form.name.trim()) return;

		try {
			if (editingId) {
				await apiFetch(`accounts/${editingId}`, {
					method: "PATCH",
					body: JSON.stringify(form),
				});
			} else {
				await apiFetch("accounts", {
					method: "POST",
					body: JSON.stringify(form),
				});
			}

			setForm({ name: "", balance: 0 });
			setEditingId(null);

			fetchAccounts()
		} catch (e) {
			console.error("Error guardando cuenta", e);
		}
	}

	async function handleDelete(id: string) {
		try {
			await apiFetch(`accounts/${id}`, {
				method: "DELETE",
			});

			fetchAccounts();
		} catch (e) {
			console.error("Error eliminando cuenta.", e)
		}
	}

	async function handleEdit(account: Account) {
		setForm({
			name: account.name,
			balance: account.balance,
		});
		setEditingId(account.id);
	}

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold mb-4">Cuentas</h1>

			<button className="mb-4 px-4 py-2 bg-green-500 text-white rounded">
				+ Nueva Cuenta
			</button>

			<div className="mb-6 flex gap-2">
				<input
					type="text"
					placeholder="Nombre"
					value={form.name}
					onChange={(e) =>
						setForm({ ...form, name: e.target.value })
					}
					className="border p-2"
				/>

				<input
					type="number"
					placeholder="Balance"
					value={form.balance}
					onChange={(e) =>
						setForm({ ...form, balance: Number(e.target.value) })
					}
					className="border p-2"
				/>

				<button
					onClick={handleSubmit}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					{editingId ? "Actualizar" : "Crear"}
				</button>

				{editingId && (
					<button
						onClick={() => {
							setEditingId(null);
							setForm({ name: "", balance: 0 });
						}}
						className="bg-gray-400 text-white px-4 py-2 rounded"
					>
						Cancelar
					</button>
				)}
			</div>

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
									<button onClick={() => handleDelete(account.id)} className="px-2 py-1 bg-red-500 text-white rounded">
										Eliminar
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				:
				<h2>There are no accounts. Create one!</h2>}
		</div>
	)
}