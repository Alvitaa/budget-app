"use client"

import Sidebar from "@/components/ui/Sidebar";
import { PropsWithChildren, useState } from "react";

export default function HomePage({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="h-full flex">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} className="sticky shrink-0 top-0 h-screen"/>
            <main className="flex flex-col gap-5 shrink-0 p-8" style={{width: `calc(100dvw - calc(var(--spacing) * 16))`}}>
                {children}
            </main>
        </div>
    );
}