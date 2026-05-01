"use client";
import { apiFetch } from "@/lib/api";
import { TransactionTypeLabels } from "@/constants/TransactionType";
import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import Modal from "@/components/ui/modal/Modal";
import CategoryForm from "@/components/categories/CategoryForm";
import PageHeader from "@/components/ui/PageHeader";
import Table, { Column } from "@/components/ui/table/Table";
import { IoAddCircle } from "react-icons/io5";

export default function CategoriesPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

	const columns: Column<Category>[] = [
		{
			header: "Nombre",
			className: "w-3/7",
			render: (c) => c.name
		},
		{
			header: "Tipo de Categoría",
			className: "w-3/7",
			render: (c) => TransactionTypeLabels[c.type]
		},
		{
			header: "Acciones",
			className: "w-1/7 text-center!",
			render: (c) => (
				<div className="flex justify-between">
					<button onClick={() => handleEdit(c)} className="px-2 py-1 w-20 bg-yellow-400 rounded">
						Editar
					</button>
					<button onClick={() => confirmDelete(c)} className="px-2 py-1 w-20 bg-red-500 text-white rounded">
						Eliminar
					</button>
				</div>
			)
		}
	];

	async function fetchCategories() {
		try {
			const data = await apiFetch("categories", {
				method: "GET",
			})
			setCategories(data);
			if (data.length > 0) setIsLoaded(true);
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
			<h1>Categorías</h1>

			<button onClick={handleCreate} className="px-4 py-2 bg-main font-medium text-white rounded-2xl shadow-m flex justify-center items-center">
				<span className="mr-2 text-2xl">
					<IoAddCircle/>
				</span>
				Nueva Categoría
			</button>

			{isLoaded ?
				<Table className="card-border rounded-xl overflow-hidden" columnClassName="text-left" columns={columns} rows={categories} />
				:
				<h2>You have no categories created. Add one!</h2>
			}

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