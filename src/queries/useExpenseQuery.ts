import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants";
import { CreateExpenseDTO, Expense } from "../types/query";

export const useGetExpenses = () => {
  return useQuery({
    queryKey: queryKeys.EXPENSE.list(),
    queryFn: async (): Promise<Expense[]> => {
      const response = await fetch("/api/expenses");
      return response.json();
    },
  });
};

export const useGetExpenseById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.EXPENSE.detail(id),
    queryFn: async (): Promise<Expense> => {
      const response = await fetch(`/api/expenses/${id}`);
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newExpense: CreateExpenseDTO): Promise<Expense> => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error("지출 추가에 실패했습니다");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.EXPENSE.list() });
    },
  });
};
