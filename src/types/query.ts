export interface CreateExpenseDTO {
  amount: number;
  description: string;
  categories_id: string;
  expense_date: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  user_id: number;
  is_active: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: number;
  categories_id: string;
  amount: number;
  description: string;
  created_at: string;
  expense_date: string;
  categories: Category;
}

export interface CreateTransactionDTO {
  amount: number;
  description: string;
  categories_id?: string;
  transaction_date: Date;
  type: "income" | "expense";
}

export interface Transaction {
  id: string;
  user_id: number;
  categories_id?: string;
  amount: number;
  description: string;
  created_at: string;
  transaction_date: string;
  type: "income" | "expense";
  categories?: Category;
}

export interface CategoryGroup {
  category: Category;
  transactions: Transaction[];
  total: number;
}
