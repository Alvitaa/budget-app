export const TransactionTypeLabels = {
  INCOME: "INGRESO",
  EXPENSE: "GASTO",
  SAVING: "AHORRO",
} as const;

export type TransactionType = keyof typeof TransactionTypeLabels;