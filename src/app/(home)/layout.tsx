"use client"

import Sidebar from "@/components/ui/Sidebar";
import { PropsWithChildren, useState } from "react";

export default function HomePage({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <div className="h-screen flex overflow-x-hidden">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <main className="flex-1 w-full p-8">
                {children}
            </main>
        </div>
    );
}