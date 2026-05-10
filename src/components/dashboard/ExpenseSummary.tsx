import { SummaryByCategory } from "@/types/Summary";
import { capitalize } from "@/utils/capitalize";
import { FaCircle } from "react-icons/fa6";
import Card from "../ui/cards/Card";

interface Props {
    expenses: SummaryByCategory[]
}



export default function ExpenseSummary({ expenses }: Props) {
    const colors = ["text-rose-500", "text-yellow-400", "text-blue-600", "text-green-400"]

    //TODO: Use chartJS to show a circle chart

    return (
        <Card>
            <h2 className="text-lg text-center font-semibold">Distribución de gastos</h2>
            {/* <img className="h-52 w-auto mx-auto" src={"https://images.edrawsoft.com/articles/donut-chart/donut-chart-1.png"} /> */}

            <div className="flex flex-col gap-2">
                {/* <h3 className="mb-2">Categorías</h3> */}
                {expenses.map((expense, index) => (
                    <div className="flex w-full justify-between gap-1" key={expense.id}>
                        <div className="flex items-center gap-2">
                            <div className={colors[index % colors.length]}>
                                <FaCircle />
                            </div>
                            <p>{expense.name === "OTHER" ? "Otros" : capitalize(expense.name)}</p>
                        </div>
                        <div className="flex min-w-2/5 justify-between">
                            <p>S/.</p>
                            <p>{expense.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}