"use client";

import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

type RegisterData = {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
};

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterData>({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    function validateFrontend(data: RegisterData) {
        const newErrors = {} as any;

        // Nombre
        if (!data.name || typeof data.name !== "string") {
            newErrors.name = ["Name is required"];
        }

        // Email
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = ["Invalid email address"];
        }

        // Password
        if (!data.password || data.password.length < 8) {
            newErrors.password = ["Password must be at least 8 characters long"];
        }

        // Repeat password
        if (!data.repeatPassword) {
            newErrors.repeatPassword = ["Please confirm your password"];
        } else if (data.password !== data.repeatPassword) {
            newErrors.repeatPassword = ["Passwords do not match"];
        }

        return Object.keys(newErrors).length > 0 ? newErrors : null;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: [""],
        }));
    }

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault();
        setErrors({});

        const formErrors = validateFrontend(formData);
        if (formErrors) {
            setErrors(formErrors);
            return;
        }

        try {
            await apiFetch("auth/register", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            router.push("/login");
        } catch (err: any) {
            if (err.errors) {
                console.log(err.errors);
                setErrors(err.errors);
            } else {
                setErrors({
                    general: [err.message || "Something went wrong"],
                });
            }
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
                        name="name"
                        placeholder="Nombre"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}

                    <input
                        type="password"
                        name="repeatPassword"
                        placeholder="Repeat Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                    />
                    {errors.repeatPassword && <p className="text-red-600 text-sm">{errors.repeatPassword[0]}</p>}

                    {errors.general && (
                        <p className="text-sm text-red-600">{errors.general}</p>
                    )}

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