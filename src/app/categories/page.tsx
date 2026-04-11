"use client";
import { apiFetch } from "@/lib/api";
import { TransactionType, TransactionTypeLabels } from "@/constants/TransactionType";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";

export default function CategoriesPage() {
	const [categories, setCategories] = useState([]);

	const [form, setForm] = useState<{
		name: string;
		type: TransactionType;
	}>({
		name: "",
		type: "INCOME",
	});

	const [editingId, setEditingId] = useState<string | null>(null);

	async function fetchCategories() {
		try {
			const data = await apiFetch("categories", {
				method: "GET",
			})
			console.log(data);
			setCategories(data);
		} catch (e) {
			console.error("Error cargando categorías: ", e);
		}
	}

	useEffect(() => {
		fetchCategories();
	}, []);

	async function handleSubmit() {
		if (!form.name.trim()) return;

		try {
			if (editingId) {
				await apiFetch(`categories/${editingId}`, {
					method: "PATCH",
					body: JSON.stringify(form),
				});
			} else {
				await apiFetch("categories", {
					method: "POST",
					body: JSON.stringify(form),
				});
			}

			setForm({ name: "", type: "INCOME" });
			setEditingId(null);

			fetchCategories()
		} catch (e) {
			console.error("Error guardando categoría", e);
		}
	}

	async function handleDelete(id: string) {
		try {
			await apiFetch(`categories/${id}`, {
				method: "DELETE",
			});

			fetchCategories();
		} catch (e) {
			console.error("Error eliminando categoría", e);
		}
	}

	async function handleEdit(category: Category) {
		setForm({
			name: category.name,
			type: category.type
		});
		setEditingId(category.id)
	}

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold mb-4">Categorías</h1>

			<button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
				+ Nueva Categoría
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

				<select
					value={form.type}
					onChange={(e) =>
						setForm({
							...form,
							type: e.target.value as TransactionType,
						})
					}
					className="border p-2"
				>
					<option value="INCOME">INGRESO</option>
					<option value="EXPENSE">GASTO</option>
					<option value="SAVING">AHORRO</option>
				</select>

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
							setForm({ name: "", type: "INCOME" });
						}}
						className="bg-gray-400 text-white px-4 py-2 rounded"
					>
						Cancelar
					</button>
				)}
			</div>

			<table className="w-full border">
				<thead>
					<tr className="bg-gray-200">
						<th className="p-2 border">Nombre</th>
						<th className="p-2 border">Tipo de Categoría</th>
						<th className="p-2 border">Acciones</th>
					</tr>
				</thead>

				<tbody>
					{categories.map((category: Category) => (
						<tr key={category.id}>
							<td className="p-2 border">{category.name}</td>
							<td className="p-2 border">{TransactionTypeLabels[category.type]}</td>
							<td className="p-2 border flex gap-2">
								<button onClick={() => handleEdit(category)} className="px-2 py-1 bg-yellow-400 rounded">
									Editar
								</button>
								<button onClick={() => handleDelete(category.id)} className="px-2 py-1 bg-red-500 text-white rounded">
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}