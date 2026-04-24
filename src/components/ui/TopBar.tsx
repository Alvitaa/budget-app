"use client"

import { usePathname } from "next/navigation";
import { title } from "process";
import { FaUser } from "react-icons/fa6";
import { IoMdNotifications, IoMdSettings } from "react-icons/io";

function getTitle(pathname: string) {
    if (pathname.startsWith("/movements")) return "Movimientos";
    if (pathname.startsWith("/accounts")) return "Cuentas";
    if (pathname.startsWith("/categories")) return "Categorías";
    if (pathname.startsWith("/transfers")) return "Transferencias";
    return "Dashboard";
}

export default function TopBar () {
    const pathname = usePathname();

    const title = getTitle(pathname);

    return (
        <nav className="w-full py-2 px-5 flex flex-row border-b items-center bg-white">
            <div className="w-1/4 text-lg">Placeholder</div>
            <div className="w-1/2 text-center text-2xl font-bold">
                <h1>{title}</h1>
            </div>
            <div className="w-1/4 text-base flex justify-end gap-5">
                <IoMdSettings />
                <IoMdNotifications />
                <FaUser />
            </div>
        </nav>
    )
}