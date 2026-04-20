"use client";
import { apiFetch } from "@/lib/api";
import { TransactionTypeLabels } from "@/constants/TransactionType";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import Modal from "@/components/ui/modal/Modal";
import CategoryForm from "@/components/categories/CategoryForm";
import PageHeader from "@/components/ui/PageHeader";

export default function CategoriesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

	async function fetchCategories() {
		try {
			const data = await apiFetch("categories", {
				method: "GET",
			})
			setCategories(data);
		} catch (e) {
			console.error("Error cargando categorías: ", e);
		}
	}

	useEffect(() => {
		fetchCategories();
	}, []);

	function handleCreate() {
		setSelectedCategory(null);
		setIsModalOpen(true);
	}

	function handleEdit(category: Category) {
		setSelectedCategory(category);
		setIsModalOpen(true);
	}

	async function handleSubmit(data: any) {

		if (selectedCategory) {
			await apiFetch(`categories/${selectedCategory.id}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			});
		} else {
			await apiFetch("categories", {
				method: "POST",
				body: JSON.stringify(data),
			});
		}

		setIsModalOpen(false);
		fetchCategories()
	}

	function confirmDelete(category: Category) {
		setSelectedCategory(category);
		setIsDeleteModalOpen(true);
	}

	async function handleDelete(id: string) {
		try {
			await apiFetch(`categories/${id}`, {
				method: "DELETE",
			});

			setIsDeleteModalOpen(false);
			fetchCategories();
		} catch (e) {
			console.error("Error eliminando categoría", e);
		}
	}

	return (
		<>
			<PageHeader title="Categorías" />

			<button onClick={handleCreate} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
				+ Nueva Categoría
			</button>

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
								<button onClick={() => confirmDelete(category)} className="px-2 py-1 bg-red-500 text-white rounded">
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={selectedCategory ? "Editar" : "Crear"}
			>
				<CategoryForm initialData={selectedCategory} onSubmit={handleSubmit} />
			</Modal>

			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="¿Estás seguro?"
			>
				<p>Esta acción es irreversible.</p>
				<div className="flex place-content-around gap-5 mt-5">
					<button onClick={() => handleDelete(selectedCategory!.id)} className="px-2 py-2 w-full bg-red-500 rounded text-white font-bold cursor-pointer">
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