import { useState } from "react";
import { Transaction } from "@/types/query";
import {
  useGetMonthlyTransactions,
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/queries/useTransactionQuery";

export function useExpenseManagement(initialDate: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useGetMonthlyTransactions(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1
  );
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const { mutate: updateTransaction } = useUpdateTransaction();

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteClick = (id: number) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.toString());
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  return {
    selectedDate,
    selectedDay,
    editingTransaction,
    isDeleteDialogOpen,
    isAddDialogOpen,
    data,
    isLoading,
    error,
    setSelectedDate,
    setSelectedDay,
    setEditingTransaction,
    setIsDeleteDialogOpen,
    updateTransaction,
    setIsAddDialogOpen,
    handleDayClick,
    handleEditTransaction,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
