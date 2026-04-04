export default function DashboardPage() {
  return (
    <div className="w-full max-w-3xl p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <button className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition">
          Logout
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">
          Esta es una ruta protegida.
        </p>
      </div>
    </div>
  );
}