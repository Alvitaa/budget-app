"use client";

import TransactionForm from "@/components/transactions/TransactionForm";
import Modal from "@/components/ui/modal/Modal";
import PageHeader from "@/components/ui/PageHeader";
import { TransactionTypeLabels } from "@/constants/TransactionType";
import { apiFetch } from "@/lib/api";
import { removeToken } from "@/lib/auth";
import { Transaction } from "@/types/transaction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa6";

export default function DashboardPage() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [transactionPage, setTransactionPage] = useState(0);
	const [transactionsPerPage, setTransactionPerPage] = useState(20);

	const [transactions, setTransactions] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
	const [categories, setCategories] = useState([]);
	const [accounts, setAccounts] = useState([]);
	const [date, setDate] = useState(new Date());

	function Logout() {
		removeToken();
		router.push("/login");
		router.refresh();
	}

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

	async function fetchTransactions() {
		const month = date.getMonth();
		const year = date.getFullYear();

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

	useEffect(() => {
		//fetchAccounts();
		//fetchCategories();
		//fetchTransactions();
	}, [])

	return (
		<>
			<div className="w-full h-full flex flex-col gap-5">
				<div className="w-full flex flex-row gap-5">
					<div className="w-full h-full card">
						<h2 className="font-bold text-xl text-gray-950 flex justify-between items-center">
							Balance
							<p className="text-base text-neutral-400 font-semibold">BCP</p>
						</h2>
						<div className="flex justify-between text-2xl font-bold">
							<p>S/.</p>
							<p>1234.98</p>
						</div>
					</div>
					<div className="w-full h-full card">
						<h2 className="font-bold text-xl text-gray-950">Ingresos</h2>
						<div className="flex justify-between text-2xl font-bold text-green-500">
							<p>S/.</p>
							<p>1234.98</p>
						</div>
					</div>
					<div className="w-full h-full card">
						<h2 className="font-bold text-xl text-gray-950">Gastos</h2>
						<div className="flex justify-between text-2xl font-bold text-red-500">
							<p>S/.</p>
							<p>1234.98</p>
						</div>
					</div>
					<div className="w-full h-full card">
						<h2 className="font-bold text-xl text-gray-950">
							Ahorros
						</h2>
						<div className="flex justify-between text-2xl font-bold">
							<p>S/.</p>
							<p>1234.98</p>
						</div>
					</div>
				</div>
				<div className="flex-1 flex flex-row gap-5 min-h-0">
					<div className="w-6/25 flex flex-col gap-5"> {/* //TODO: GET BETTER WIDTH VALUE */}
						<div className="w-full h-fit card">
							<h2 className="text-center font-semibold">Distribución de gastos</h2>
							<img className="h-52 w-auto mx-auto" src={"https://images.edrawsoft.com/articles/donut-chart/donut-chart-1.png"} />
							<div className="w-full">
								<h3 className="mb-2">Categorías</h3>
								<div className="flex w-full items-center gap-2 justify-between">
									<div className="flex items-center gap-2">
										<div className="text-rose-500">
											<FaCircle />
										</div>
										<p>Comida</p>
									</div>
									<p className="flex">33.3%</p>
								</div>
								<div className="flex w-full items-center gap-2 justify-between">
									<div className="flex items-center gap-2">
										<div className="text-orange-300">
											<FaCircle />
										</div>
										<p>Transporte</p>
									</div>
									<p className="flex">25.0%</p>
								</div>
								<div className="flex w-full items-center gap-2 justify-between">
									<div className="flex items-center gap-2">
										<div className="text-cyan-600">
											<FaCircle />
										</div>
										<p>Ropa</p>
									</div>
									<p className="flex">25.0%</p>
								</div>
								<div className="flex w-full items-center gap-2 justify-between">
									<div className="flex items-center gap-2">
										<div className="text-emerald-200">
											<FaCircle />
										</div>
										<p>Comida</p>
									</div>
									<p className="flex">16.6%</p>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full flex-1 card">
						<div className="border border-neutral-300 rounded-2xl overflow-hidden">
							<table className="w-full border-collapse table-fixed">
								<thead className="[&>tr>th:first-child]:pl-4 [&>tr>th:last-child]:pr-4">
									<tr className="border-b bg-neutral-100">
										<th className="p-2 w-1/9">Fecha</th>
										<th className="p-2 w-1/9">Tipo</th>
										<th className="p-2 w-1/9">Categoría</th>
										<th className="p-2 w-1/9">Título</th>
										<th className="p-2 w-1/9">Monto</th>
										<th className="p-2 w-2/9">Descripción</th>
										<th className="p-2 w-1/9">Cuenta</th>
										<th className="p-2 w-1/9">Acciones</th>
									</tr>
								</thead>
								<tbody className="[&>tr]:border-b [&>tr]:text-center [&>tr:last-child]:border-b-0 [&>tr>td:first-child]:pl-4 [&>tr>td:last-child]:pr-4">
									<tr>
										<td>24/04/2026</td>
										<td>Gasto</td>
										<td>Comida</td>
										<td>Tanta</td>
										<td>S/. 129.80</td>
										<td>Comida</td>
										<td>BBVA</td>
										<td className="flex justify-between"><p>Edit</p><p> Delete</p></td>
									</tr>
									<tr>
										<td>24/04/2026</td>
										<td>Gasto</td>
										<td>Comida</td>
										<td>Tanta</td>
										<td>S/. 129.80</td>
										<td>Comida</td>
										<td>BBVA</td>
										<td className="flex justify-between"><p>Edit</p><p> Delete</p></td>
									</tr>
									<tr>
										<td>24/04/2026</td>
										<td>Gasto</td>
										<td>Comida</td>
										<td>Tanta</td>
										<td>S/. 129.80</td>
										<td>Comida</td>
										<td>BBVA</td>
										<td className="flex justify-between"><p>Edit</p><p> Delete</p></td>
									</tr>
								</tbody>
							</table>
						</div>
						<p className="mt-20 text-blue-500 text-center underline">Ver todos los movimientos</p>
					</div>
				</div>
			</div>
		</>
	)

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<PageHeader title="Dashboard" />

				<button onClick={() => Logout()} className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition cursor-pointer">
					Logout
				</button>
			</div>

			<div className="flex gap-4">
				<button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
					+ Nuevo Movimiento
				</button>

				<button
					onClick={() => router.push("/categories")}
					className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
				>
					Ver Categorías
				</button>

				<button
					onClick={() => router.push("/accounts")}
					className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
				>
					Ver Cuentas
				</button>
			</div>

			<div className="mt-5">
				{isLoaded &&
					<table className="w-full border border-collapse table-fixed">
						<thead>
							<tr className="bg-gray-200">
								<th className="p-2 border w-1/9">Fecha</th>
								<th className="p-2 border w-1/9">Tipo</th>
								<th className="p-2 border w-1/9">Categoría</th>
								<th className="p-2 border w-1/9">Título</th>
								<th className="p-2 border w-1/9">Monto</th>
								<th className="p-2 border w-2/9">Descripción</th>
								<th className="p-2 border w-1/9">Cuenta</th>
								<th className="p-2 border w-1/9">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction: Transaction) => (
								<tr key={transaction.id}>
									<td className="p-2 border truncate">{transaction.date.split("T")[0]}</td>
									<td className="p-2 border truncate">{TransactionTypeLabels[transaction.type]}</td>
									<td className="p-2 border truncate">{transaction.category ? transaction.category.name : "No especificada"}</td>
									<td className="p-2 border truncate">{transaction.title}</td>
									<td className="p-2 border truncate">
										<div className="flex place-content-between">
											<p>S/.</p>
											<p>{transaction.amount.toFixed(2)}</p>
										</div>
									</td>
									<td className="p-2 border truncate" title={transaction.description?.toString()}>{transaction.description ? transaction.description : "-"}</td>
									<td className="p-2 border truncate">{transaction.account ? transaction.account.name : "No especificada"}</td>
									<td className="p-2 border truncate">
										<div className="flex gap-2 place-content-end">
											<button onClick={() => handleEdit(transaction)} className="w-20 px-2 py-1 bg-yellow-400 rounded cursor-pointer">
												Editar
											</button>
											<button onClick={() => confirmDelete(transaction)} className="w-20 px-2 py-1 bg-red-500 text-white rounded cursor-pointer">
												Eliminar
											</button>
										</div>
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

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={selectedTransaction ? "Editar" : "Crear"}
			>
				<TransactionForm initialData={selectedTransaction} onSubmit={handleSubmit} categories={categories} accounts={accounts} />
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