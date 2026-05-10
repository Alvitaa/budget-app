import { Months } from "@/constants/Months";

interface Props {
    month: number,
    setMonth(data: any): void;
    year: number,
    setYear(data: any): void
}

export default function DatePicker({
    month, setMonth,
    year, setYear
}: Props) {
    const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
    return (
        <div>
            <label htmlFor="year">Año:</label>
            <select className="w-30" name="year" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((year, index) => (
                    <option value={year} key={index}>{year}</option>
                ))}
            </select>

            <label className="ml-5" htmlFor="month">Mes:</label>
            <select className="w-30" name="month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                <option value={0}>Todos</option>
                {Months.map((month, index) => (
                    <option value={index + 1} key={index}>{month}</option>
                ))}
            </select>
        </div>
    );
}