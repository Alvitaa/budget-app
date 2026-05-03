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
		className: "w-1/12",
		render: (t) => t.date.split("T")[0]
	},
	{
		header: "Tipo",
		className: "w-1/12",
		render: (t) => TransactionTypeLabels[t.type]
	},
	{
		header: "Categoría",
		className: "",
		render: (t) => t.category?.name ?? "No especificada"
	},
	{
		header: "Título",
		className: "",
		render: (t) => t.title
	},
	{
		header: "Monto",
		className: "",
		render: (t) => (
			<div className="flex place-content-between">
				<p>S/.</p>
				<p>{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
			</div>
		)
	},
	{
		header: "Cuenta",
		className: "",
		render: (t) => t.account?.name ?? "No especificada"
	}
]

export default function DashboardPage() {
	const router = useRouter();
	const [isLoaded, setIsLoaded] = useState(false);
	const [transactionPage, setTransactionPage] = useState(0);
	const [transactionsPerPage, setTransactionPerPage] = useState(20);

	const [transactions, setTransactions] = useState<Transaction[]>([]);
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

	useEffect(() => {
		fetchAccounts();
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
					<Table className="bg-white flex-1 card-border overflow-hidden rounded-xl w-full h-full" columnClassName="w-1/9 text-center" columns={columns} rows={transactions} />
				</div>
			</div>
		</>
	)
}