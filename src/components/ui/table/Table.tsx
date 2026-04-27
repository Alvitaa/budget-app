export type Column<T> = {
    header: string;
    className?: string;
    render: (row: T) => React.ReactNode;
};

type TableProps<T> = {
    columns: Column<T>[];
    rows: T[];
    className?: string;
    columnClassName?: string;
};

export default function Table<T>({ columns, rows, className, columnClassName }: TableProps<T>) {
    return (
        <div className={`${className ? className : ""}`}>
            <table className="w-full border-collapse table-fixed">
                <thead className="[&>tr>th:first-child]:pl-4 [&>tr>th:last-child]:pr-4">
                    <tr className="border-b bg-neutral-100">
                        {columns.map((column, index) => (
                            <th key={index} className={`py-2 px-3 ${column.className ? column.className : ""} ${columnClassName ? columnClassName : ""}`}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white [&>tr]:border-b [&>tr]:text-center [&>tr:last-child]:border-b-0 [&>tr>td:first-child]:pl-4 [&>tr>td:last-child]:pr-4">
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column, j) => (
                                <td key={j} className={`py-2 px-3 truncate ${column.className ? column.className : ""}`}>
                                    {column.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}