"use client";

import { ApiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        try {
            const data = await ApiFetch("auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            setToken(data.accessToken);

            router.push("/");
            router.refresh();
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 text-black antialiased flex items-center justify-center">
            <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h1 className="text-xl font-semibold text-center mb-6">
                    Login
                </h1>

                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}

                    <button
                        className="w-full px-4 py-2 rounded-md bg-black text-white border border-black hover:bg-gray-900 transition text-sm font-medium"
                    >
                        Iniciar sesión
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </main>
    );
}