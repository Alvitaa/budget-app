"use client"

import { removeToken } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { IoCardOutline, IoCardSharp, IoCashOutline, IoCashSharp, IoHomeOutline, IoHomeSharp, IoLogOutOutline, IoMenuSharp, IoPricetagsOutline, IoPricetagsSharp, IoReceiptOutline, IoReceiptSharp, IoStatsChartOutline, IoStatsChartSharp, IoSwapHorizontalOutline, IoSwapHorizontalSharp } from "react-icons/io5";

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
        { icon: <IoSwapHorizontalOutline />, iconFill: <IoSwapHorizontalSharp />, label: "Transferencias", href: "/transfers" },
    ];

    function handleRouting(href: string) {
        if (pathname === href) return;
        router.push(href)
    }

    function Logout() {
		removeToken();
		router.push("/login");
		router.refresh();
    }

    const animation = "transition-all duration-400 ease-in-out";
    return (
        <aside className={`rounded-r-2xl flex flex-col gap-10 overflow-hidden max-w-1/6 justify-between shadow-inset-m ${animation} ${className} ${isOpen ? "w-56" : "w-16"}`}>
            <div className="flex flex-col gap-10">
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
            </div>

            <div
                className="flex items-center px-5 py-5 gap-5 text-lg font-medium cursor-pointer text-muted hover:text-red-600 hover:bg-neutral-200"
                onClick={Logout}
            >
                <span className={`text-2xl rotate-180`}>
                    <IoLogOutOutline/>
                </span>
                <span
                    className={`transition-opacity duration-400 ${isOpen ? "opacity-100 delay-50" : "opacity-0"} ease-in-out`}
                >
                    Logout
                </span>
            </div>
        </aside>
    );
}