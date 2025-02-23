"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDate,
  getDay,
} from "date-fns";
import {
  useGetMonthlyTransactions,
  useDeleteTransaction,
  useUpdateTransaction,
  useCreateTransaction,
} from "@/queries/useTransactionQuery";
import { useGetCategories } from "@/queries/useCategoryQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/types/query";
import { CalendarGrid } from "./components/CalendarGrid";
import { DailyTransactions } from "./components/DailyTransactions";
import { AddTransactionDialog } from "./components/AddTransactionDialog";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  // 현재 선택된 날짜(월)를 상태로 관리 - 추후 월 이동 기능 추가 가능
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 선택된 날짜의 상세 보기를 위한 상태 추가
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { data, isLoading, error } = useGetMonthlyTransactions(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1
  );
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const { mutate: updateTransaction } = useUpdateTransaction();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: categories = [] } = useGetCategories();
  const { mutate: createTransaction } = useCreateTransaction();

  // 불러온 거래 데이터를 날짜별로 그룹화
  const transactionsByDay = data?.transactions.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.transaction_date);
    const localDate = new Date(
      transactionDate.getTime() + transactionDate.getTimezoneOffset() * 60000
    );
    const day = getDate(localDate);

    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(transaction as unknown as Transaction);
    return acc;
  }, {} as Record<number, Transaction[]>);

  // 해당 월의 모든 날짜 배열 생성
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  // 해당 월의 첫 날의 요일을 구함 (0: 일요일, 6: 토요일)
  const firstDayOfMonth = getDay(startOfMonth(selectedDate));

  // 월 이동 함수 추가
  const handlePrevMonth = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);

      // 현재 선택된 날짜가 새로운 월의 마지막 날짜보다 큰 경우
      const lastDayOfNewMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0
      ).getDate();
      if (selectedDay && selectedDay > lastDayOfNewMonth) {
        setSelectedDay(lastDayOfNewMonth);
        newDate.setDate(lastDayOfNewMonth);
      }

      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);

      // 현재 선택된 날짜가 새로운 월의 마지막 날짜보다 큰 경우
      const lastDayOfNewMonth = new Date(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        0
      ).getDate();
      if (selectedDay && selectedDay > lastDayOfNewMonth) {
        setSelectedDay(lastDayOfNewMonth);
        newDate.setDate(lastDayOfNewMonth);
      }

      return newDate;
    });
  };

  // 날짜 선택 핸들러 추가
  const handleDayClick = (dayNum: number) => {
    setSelectedDay(selectedDay === dayNum ? null : dayNum);
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayNum)
    );
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransaction) {
      updateTransaction(editingTransaction);
      setEditingTransaction(null);
    }
  };

  const handleDeleteClick = (transactionId: string) => {
    setTransactionToDelete(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  // 새로운 핸들러 추가
  const handleAddClick = () => {
    if (selectedDay) {
      const formattedDate = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
      setIsAddDialogOpen(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen">
      <motion.div
        className="flex items-center justify-center mb-8 space-x-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-gray-700">
          {selectedDate.getFullYear() === new Date().getFullYear()
            ? format(selectedDate, "M월")
            : format(selectedDate, "yyyy년 M월")}
        </h1>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </motion.div>

      {isLoading && (
        <motion.div
          className="flex justify-center items-center h-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-blue-500 border-gray-300"></div>
        </motion.div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          데이터를 불러오는데 실패했습니다.
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate.getMonth()}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl mb-8"
        >
          <CalendarGrid
            firstDayOfMonth={firstDayOfMonth}
            daysInMonth={daysInMonth}
            transactionsByDay={transactionsByDay || {}}
            selectedDay={selectedDay}
            onDayClick={handleDayClick}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DailyTransactions
              selectedDate={selectedDate}
              editingTransaction={editingTransaction}
              onUpdate={handleUpdateTransaction}
              onEditingChange={setEditingTransaction}
              transactionsByDay={transactionsByDay || {}}
              selectedDay={selectedDay}
              onAddClick={handleAddClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 다이얼로그 추가 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>거래 내역 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 거래 내역을 삭제하시겠습니까?</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              취소
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleConfirmDelete}
              className="text-gray-500 hover:text-red-600"
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 새로운 거래 추가 다이얼로그 */}
      {selectedDay && (
        <AddTransactionDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          selectedDate={`${selectedDate.getFullYear()}-${String(
            selectedDate.getMonth() + 1
          ).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`}
        />
      )}
    </div>
  );
}
