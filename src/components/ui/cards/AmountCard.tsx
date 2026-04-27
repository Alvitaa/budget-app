import Card from "./Card";

type AmountCardProps = {
    title: string;
    currency: string;
    amount: number;
    amountColor?: string;
}

export default function AmountCard({ title, amount, currency = "S/.", amountColor = "" }: AmountCardProps) {
    return (
        <Card>
            <h2 className="font-bold text-xl text-gray-950 flex justify-between items-center">
                {title}
            </h2>
            <div className={`flex justify-between text-2xl font-bold ${amountColor}`}>
                <p>{currency}</p>
                <p>{amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
        </Card>
    );
}