export interface Expense {
  id: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
}

export interface CreateExpenseDTO {
  amount: number;
  category: string;
  description?: string;
}
