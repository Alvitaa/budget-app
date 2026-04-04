"use client";

import { ApiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setError("");

        if (password !== repeatPassword) {
            return setError("Las contraseñas no coinciden");
        }

        try {
            await ApiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    repeatPassword,
                }),
            });

            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 text-black antialiased flex items-center justify-center">
            <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h1 className="text-xl font-semibold text-center mb-6">
                    Registro
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full px-4 py-2 rounded-md bg-black text-white border border-black hover:bg-gray-900 transition text-sm font-medium"
                    >
                        Crear cuenta
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </main>
    );
}