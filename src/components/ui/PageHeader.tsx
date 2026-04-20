import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({title}: {title: string}) {
    return (
        <div>
            <h1 className="text-3xl font-semibold">{title}</h1>
            <Breadcrumbs />
        </div>
    )
}