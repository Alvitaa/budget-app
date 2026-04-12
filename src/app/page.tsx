"use client";

import { apiFetch } from "@/lib/api";
import { removeToken } from "@/lib/auth";
import { Transaction } from "@/types/transaction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
	const router = useRouter();
	const [transactions, setTransactions] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [date, setDate] = useState(new Date());

	function Logout() {
		removeToken();
		router.push("/login");
		router.refresh();
	}

	async function fetchTransactions() {
		const month = date.getMonth();
		const year = date.getFullYear();

		try {
			const data = await apiFetch("transactions", {
				method: "GET",
			})
			setTransactions(data);
			if (data.length > 0) setIsLoaded(true);
		} catch (e) {
			console.error("Error cargando transacciones:", e);
		}
	}

	useEffect(() => {
		fetchTransactions();
	}, [])

	return (
		<div className="w-full p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-xl font-semibold">Dashboard</h1>

				<button onClick={() => Logout()} className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition">
					Logout
				</button>
			</div>

			<div className="flex gap-4">
				<button
					onClick={() => router.push("/categories")}
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Ver Categorías
				</button>

				<button
					onClick={() => router.push("/accounts")}
					className="px-4 py-2 bg-green-500 text-white rounded"
				>
					Ver Cuentas
				</button>
			</div>

			<div className="mt-5">
				{isLoaded &&
					<table className="w-full border">
						<thead>
							<tr className="bg-gray-200">
								<th className="p-2 border">Fecha</th>
								<th className="p-2 border">Tipo</th>
								<th className="p-2 border">Categoría</th>
								<th className="p-2 border">Título</th>
								<th className="p-2 border">Monto</th>
								<th className="p-2 border">Descripción</th>
								<th className="p-2 border">Cuenta</th>
								<th className="p-2 border">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction: Transaction) => (
								<tr key={transaction.id}>
									<td className="p-2 border">{transaction.date.toDateString()}</td>
									<td className="p-2 border">{transaction.type}</td>
									<td className="p-2 border">{transaction.category ? transaction.category.name : "No especificada"}</td>
									<td className="p-2 border">{transaction.title}</td>
									<td className="p-2 border">{transaction.amount}</td>
									<td className="p-2 border">{transaction.description}</td>
									<td className="p-2 border">{transaction.account ? transaction.account.name : "No especificada"}</td>
									<td className="p-2 border flex gap-2">
										<button className="px-2 py-1 bg-yellow-400 rounded">
											Editar
										</button>
										<button className="px-2 py-1 bg-red-500 text-white rounded">
											Eliminar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				}
				{!isLoaded &&
					<h2>You have no transactions registered. Register one!</h2>
				}
			</div>
		</div>
	);
}