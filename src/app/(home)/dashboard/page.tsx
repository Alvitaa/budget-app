"use client";

import DashboardTitle from "@/components/dashboard/DashboardTitle";
import Button from "@/components/inputs/Button";
import TransactionForm from "@/components/transactions/TransactionForm";
import AmountCard from "@/components/ui/cards/AmountCard";
import BalanceCard from "@/components/ui/cards/BalanceCard";
import Card from "@/components/ui/cards/Card";
import Modal from "@/components/ui/modal/Modal";
import PageHeader from "@/components/ui/PageHeader";
import Table, { Column } from "@/components/ui/table/Table";
import { TransactionTypeLabels } from "@/constants/TransactionType";
import { apiFetch } from "@/lib/api";
import { removeToken } from "@/lib/auth";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import DateFilter from "@/types/componentTypes/DateFilter";
import { Transaction } from "@/types/transaction";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa6";

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
		header: "Acciones",
		render: (t) => (
			<div className="flex place-content-between">
				<p>Edit</p><p> Delete</p>
			</div>
		)
	},
]

export default function DashboardPage() {
	const router = useRouter();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [transactionPage, setTransactionPage] = useState(0);
	const [transactionsPerPage, setTransactionPerPage] = useState(20);

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [filter, setFilter] = useState<DateFilter>(() => {
		const date = new Date;
		return {
			type: "month",
			month: date.getMonth(),
			year: date.getFullYear()
		}
	});

	function buildQuery(filter: DateFilter) {
		switch (filter.type) {
			case "month":
				return `?from=${filter.year}-${filter.month}-01&to=${filter.year}-${filter.month}-31`;

			case "year":
				return `?from=${filter.year}-01-01&to=${filter.year}-12-31`;

			case "range":
				return `?from=${filter.from.year}-${filter.from.month}-01&to=${filter.to.year}-${filter.to.month}-31`;
		}
	}

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
		fetchAccounts();
		fetchCategories();
		fetchTransactions();
	}, [])

	return (
		<>
			<DashboardTitle />
			<div className="grid grid-cols-4 gap-5 grid-rows-[auto_1fr] flex-1">
				{/* Top row */}
				<div className="col-span-1">
					<BalanceCard title="Balance" banks={accounts} currency="S/." />
				</div>
				<div className="col-span-1">
					<AmountCard title="Ingresos" currency="S/." amount={1234.98} amountColor="text-lime-600" />
				</div>
				<div className="col-span-1">
					<AmountCard title="Gastos" currency="S/." amount={1234.98} amountColor="text-red-500" />
				</div>
				<div className="col-span-1">
					<AmountCard title="Ahorros" currency="S/." amount={1234.98} />
				</div>

				{/* Second row */}
				<div className="col-span-1">
					<div className="w-full flex flex-col gap-5"> {/* //TODO: GET BETTER WIDTH VALUE */}
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
				</div>
				<div className="col-span-3 h-full">
					<Table className="bg-white flex-1 card-border overflow-hidden rounded-xl w-full h-full text-left" columnClassName="w-1/9" columns={columns} rows={transactions} />
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