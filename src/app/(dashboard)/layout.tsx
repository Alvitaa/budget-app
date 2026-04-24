import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TopBar from "@/components/ui/TopBar";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <div className="h-screen flex flex-col">
            <TopBar />
            <main className="flex-1 w-full p-8">
                {children}
            </main>
        </div>
    )
}