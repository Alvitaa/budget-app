"use client";

import DatePicker from "@/components/dashboard/DatePicker";
import ExpenseSummary from "@/components/dashboard/ExpenseSummary";
import Button from "@/components/inputs/Button";
import TransactionForm from "@/components/transactions/TransactionForm";
import AmountCard from "@/components/ui/cards/AmountCard";
import BalanceCard from "@/components/ui/cards/BalanceCard";
import Card from "@/components/ui/cards/Card";
import Modal from "@/components/ui/modal/Modal";
import Table, { Column } from "@/components/ui/table/Table";
import { TransactionTypeLabels } from "@/constants/TransactionType";
import { apiFetch } from "@/lib/api";
import { Account } from "@/types/account";
import { Category } from "@/types/category";
import DateFilter from "@/types/componentTypes/DateFilter";
import { Summary, SummaryByCategory } from "@/types/Summary";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";

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
			<div className={`flex place-content-between ${t.type === "INCOME" && "text-green-600"}`}>
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
	const [isLoaded, setIsLoaded] = useState(false);
	const [transactionPage, setTransactionPage] = useState(0);
	const [transactionsPerPage, setTransactionPerPage] = useState(20);

	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [amounts, setAmounts] = useState<Summary>();
	const [expenses, setExpenses] = useState<SummaryByCategory[]>([]);
	const [month, setMonth] = useState(0);
	const [year, setYear] = useState(2026);
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

	async function fetchTransactions() {
		let monthString;
		if (month != null && month > 0 && month < 12) {
			monthString = `&month=${month}`;
		} else {
			monthString = ``;
		}

		try {
			const data = await apiFetch(`transactions?year=${year}&skip=${transactionPage}&take=${transactionsPerPage}` + monthString, {
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

	async function fetchAmounts() {
		let monthString;
		if (month != null && month > 0 && month < 12) {
			monthString = `&month=${month}`;
		} else {
			monthString = ``;
		}

		try {
			const data = await apiFetch(`analytics?year=${year}` + monthString, {
				method: "GET"
			})

			setAmounts(data.summary);
			setExpenses(data.expensesByCategory)
		} catch (e) {
			console.error("Error cargando los montos", e);
		}
	}

	useEffect(() => {
		fetchAccounts();
		fetchTransactions();
		fetchAmounts();
	}, [month, year])

	return (
		<>
			<div className="flex items-center text-lg font-bold justify-between">
				<h1>Dashboard</h1>
				<DatePicker year={year} month={month} setMonth={setMonth} setYear={setYear} />
			</div>

			<div className="grid grid-cols-4 gap-5 grid-rows-[auto_1fr] flex-1">
				{/* Top row */}
				<div className="col-span-1">
					<BalanceCard title="Balance" banks={accounts} currency="S/." />
				</div>
				<div className="col-span-1">
					<AmountCard title="Ingresos" currency="S/." amount={amounts?.income || 0} amountColor="text-lime-600" />
				</div>
				<div className="col-span-1">
					<AmountCard title="Gastos" currency="S/." amount={amounts?.expense || 0} amountColor="text-red-500" />
				</div>
				<div className="col-span-1">
					<AmountCard title="Ahorros" currency="S/." amount={amounts?.saving || 0} />
				</div>

				{/* Second row */}
				<div className="col-span-1">
					<ExpenseSummary expenses={expenses} />
				</div>
				<div className="col-span-3 h-full">
					<Table className="bg-white flex-1 card-border overflow-hidden rounded-xl w-full h-full" columnClassName="w-1/9 text-center" columns={columns} rows={transactions} />
				</div>
			</div>
		</>
	)
}