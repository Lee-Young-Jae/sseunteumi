export const queryKeys = {
  TRANSACTION: {
    all: ["transaction"] as const,
    list: () => [...queryKeys.TRANSACTION.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.TRANSACTION.all, "detail", id] as const,
    monthly: (year: number, month: number) =>
      [...queryKeys.TRANSACTION.all, "monthly", year, month] as const,
  },
  CATEGORY: {
    all: ["category"] as const,
  },
} as const;
