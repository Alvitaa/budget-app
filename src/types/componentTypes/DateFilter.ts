type DateFilter =
    | { type: "month"; year: number; month: number }
    | { type: "year"; year: number }
    | { type: "range"; from: { year: number; month: number }; to: { year: number; month: number } };

export default DateFilter;