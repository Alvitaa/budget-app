"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function Breadcrumbs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    if (pathname === "/") return null;

    const crumbs: { label: string; href: string }[] = [];

    crumbs.push({ label: "Dashboard", href: "/" });

    if (pathname.startsWith("/transactions")) {
        const category = searchParams.get("category");
        const account = searchParams.get("account");

        // Caso: vienes filtrado desde categorías
        if (category) {
            crumbs.push({ label: "Categorías", href: "/categories" });
            crumbs.push({
                label: category,
                href: `/transactions?category=${category}`,
            });
        }
        // Caso: filtrado por cuenta
        else if (account) {
            crumbs.push({ label: "Cuentas", href: "/accounts" });
            crumbs.push({
                label: account,
                href: `/transactions?account=${account}`,
            });
        }
        // Caso normal
        else {
            crumbs.push({ label: "Movimientos", href: "/transactions" });
        }
    }

    if (pathname.startsWith("/categories") && pathname === "/categories") {
        crumbs.push({ label: "Categorías", href: "/categories" });
    }

    if (pathname.startsWith("/accounts") && pathname === "/accounts") {
        crumbs.push({ label: "Cuentas", href: "/accounts" });
    }

    return (
        <div className="my-5">
            {crumbs.map((crumb, i) => (
                <span key={crumb.href}>
                    <span
                        onClick={() => router.push(crumb.href)}
                        className="cursor-pointer"
                    >
                        {crumb.label}
                    </span>
                    {i < crumbs.length - 1 && " > "}
                </span>
            ))}
        </div>
    );
}