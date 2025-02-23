// import {
//   keepPreviousData,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { queryKeys } from "../constants";
// import { CreateExpenseDTO, Expense } from "../types/query";

// interface ExpenseResponse {
//   expenses: Expense[];
//   categoryTotals: {
//     [key: string]: {
//       total: number;
//       name: string;
//       color: string;
//     };
//   };
//   topCategory: {
//     id: string;
//     total: number;
//     name: string;
//     color: string;
//   } | null;
//   total: number;
// }

// export const useGetExpenses = () => {
//   return useQuery({
//     queryKey: queryKeys.EXPENSE.list(),
//     queryFn: async (): Promise<Expense[]> => {
//       const response = await fetch("/api/expenses");
//       return response.json();
//     },
//   });
// };

// export const useGetExpenseById = (id: string) => {
//   return useQuery({
//     queryKey: queryKeys.EXPENSE.detail(id),
//     queryFn: async (): Promise<Expense> => {
//       const response = await fetch(`/api/expenses/${id}`);
//       return response.json();
//     },
//     enabled: !!id,
//   });
// };

// export const useCreateExpense = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (newExpense: CreateExpenseDTO): Promise<Expense> => {
//       const response = await fetch("/api/expenses", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newExpense),
//       });

//       if (!response.ok) {
//         throw new Error("지출 추가에 실패했습니다");
//       }

//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.EXPENSE.all });
//     },
//   });
// };

// export const useGetMonthlyExpenses = (year?: number, month?: number) => {
//   const currentDate = new Date();
//   const targetYear = year || currentDate.getFullYear();
//   const targetMonth = month || currentDate.getMonth() + 1;

//   return useQuery({
//     queryKey: queryKeys.EXPENSE.monthly(targetYear, targetMonth),
//     queryFn: async (): Promise<ExpenseResponse> => {
//       const response = await fetch(
//         `/api/expenses?year=${targetYear}&month=${targetMonth}`
//       );

//       return response.json();
//     },
//     placeholderData: keepPreviousData,
//   });
// };

// export const useDeleteExpense = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (expenseId: string): Promise<void> => {
//       const response = await fetch(`/api/expenses?id=${expenseId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("지출 삭제에 실패했습니다");
//       }
//     },
//     onSuccess: () => {
//       // 전체 혹은 월별 소비 내역 쿼리를 무효화하여 재갱신 처리
//       queryClient.invalidateQueries({ queryKey: queryKeys.EXPENSE.all });
//     },
//   });
// };

// export const useUpdateExpense = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (expense: Expense): Promise<Expense> => {
//       const response = await fetch(`/api/expenses?id=${expense.id}`, {
//         method: "PUT",
//         body: JSON.stringify(expense),
//       });
//       if (!response.ok) {
//         throw new Error("지출 업데이트에 실패했습니다");
//       }
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.EXPENSE.all });
//     },
//   });
// };
