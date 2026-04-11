"use client";

import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  function Logout() {
    removeToken();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="w-full max-w-3xl p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
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
    </div>
  );
}