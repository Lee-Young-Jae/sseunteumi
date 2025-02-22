export const queryKeys = {
  EXPENSE: {
    all: ["expense"] as const,
    list: () => [...queryKeys.EXPENSE.all, "list"] as const,
    detail: (id: string) => [...queryKeys.EXPENSE.all, "detail", id] as const,
  },
  INCOME: {
    all: ["income"] as const,
    list: () => [...queryKeys.INCOME.all, "list"] as const,
    detail: (id: string) => [...queryKeys.INCOME.all, "detail", id] as const,
  },
} as const;
