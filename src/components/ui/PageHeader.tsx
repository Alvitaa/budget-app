import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({title}: {title: string}) {
    return (
        <div>
            <h1>{title}</h1>
            <Breadcrumbs />
        </div>
    )
}