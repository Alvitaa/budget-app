"use client"

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { IoCardOutline, IoCardSharp, IoCashOutline, IoCashSharp, IoHomeOutline, IoHomeSharp, IoMenuSharp, IoPricetagsOutline, IoPricetagsSharp, IoReceiptOutline, IoReceiptSharp, IoStatsChartOutline, IoStatsChartSharp } from "react-icons/io5";

type SidebarProps = {
    className?: string;
    isOpen: boolean;
    setIsOpen(data: any): void;
}

export default function Sidebar({ isOpen, setIsOpen, className }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const routes: { icon: ReactNode, iconFill: ReactNode, label: string, href: string }[] = [
        { icon: <IoHomeOutline />, iconFill: <IoHomeSharp />, label: "Inicio", href: "/" },
        { icon: <IoReceiptOutline />, iconFill: <IoReceiptSharp />, label: "Movimientos", href: "/movements" },
        { icon: <IoStatsChartOutline />, iconFill: <IoStatsChartSharp />, label: "Dashboard", href: "/dashboard" },
        { icon: <IoPricetagsOutline />, iconFill: <IoPricetagsSharp />, label: "Categorías", href: "/categories" },
        { icon: <IoCardOutline />, iconFill: <IoCardSharp />, label: "Cuentas", href: "/accounts" },
        { icon: <IoCashOutline />, iconFill: <IoCashSharp />, label: "Presupuestos", href: "/budgets" },
    ];

    function handleRouting(href: string) {
        if (pathname === href) return;
        router.push(href)
    }

    const animation = "transition-all duration-400 ease-in-out";
    return (
        <aside className={`rounded-r-2xl flex flex-col gap-10 overflow-hidden max-w-1/6 shadow-inset-m ${animation} ${className} ${isOpen ? "w-56" : "w-16"}`}>
            <button
                className="text-2xl p-5 cursor-pointer w-16"
                onClick={() => { setIsOpen(!isOpen) }}
            >
                <IoMenuSharp />
            </button>

            <div>
                <ul className="flex flex-col">
                    {routes.map((route) => {
                        const isActive = pathname === route.href || pathname.startsWith(route.href + "/");

                        return <li
                            key={route.label}
                            onClick={() => handleRouting(route.href)}
                            className={`flex items-center px-5 py-5 gap-5 text-lg font-medium cursor-pointer box-border hover:bg-neutral-200 ${isActive ? "bg-neutral-100 shadow-top" : "text-muted"}`}
                        >
                            <span className={`text-2xl ${isActive && "text-main"}`}>
                                {pathname === route.href ? route.iconFill : route.icon}
                            </span>
                            <span
                                className={`transition-all duration-400 ${isOpen ? "opacity-100 delay-50" : "opacity-0"} ease-in-out`}
                            >
                                {route.label}
                            </span>
                        </li>
                    })}

                </ul>
            </div>
        </aside>
    );
}