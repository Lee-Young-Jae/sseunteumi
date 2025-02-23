import { queryKeys } from "@/constants";
import { CreateTransactionDTO, Transaction } from "@/types/query";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface TransactionResponse {
  transactions: Transaction[];
  categoryTotals: {
    [key: string]: {
      total: number;
      name: string;
      color: string;
    };
  };
  topCategory: {
    id: string;
    total: number;
    name: string;
    color: string;
  } | null;
  expenseTotal: number;
  incomeTotal: number;
  balance: number; // 수입 - 지출
}

export const useGetMonthlyTransactions = (year?: number, month?: number) => {
  const currentDate = new Date();
  const targetYear = year || currentDate.getFullYear();
  const targetMonth = month || currentDate.getMonth() + 1;

  return useQuery({
    queryKey: queryKeys.TRANSACTION.monthly(targetYear, targetMonth),
    queryFn: async (): Promise<TransactionResponse> => {
      const response = await fetch(
        `/api/transactions?year=${targetYear}&month=${targetMonth}`
      );

      return response.json();
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newTransaction: CreateTransactionDTO
    ): Promise<Transaction> => {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error("거래 추가에 실패했습니다");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.TRANSACTION.all });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction): Promise<Transaction> => {
      const response = await fetch(`/api/transactions?id=${transaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) {
        throw new Error("거래 업데이트에 실패했습니다");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.TRANSACTION.all });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: string): Promise<void> => {
      const response = await fetch(`/api/transactions?id=${transactionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("거래 삭제에 실패했습니다");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.TRANSACTION.all });
    },
  });
};
