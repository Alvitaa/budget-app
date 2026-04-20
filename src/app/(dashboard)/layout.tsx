import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
    return(
        <div className="w-full max-w p-6">
            {children}
        </div>
    )
}