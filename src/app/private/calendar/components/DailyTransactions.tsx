import { Category, CategoryGroup, Transaction } from "@/types/query";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IoAddOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";

interface DailyTransactionsProps {
  selectedDate: Date;
  editingTransaction: Transaction | null;
  onUpdate: (e: React.FormEvent) => void;
  onEditingChange: (transaction: Transaction | null) => void;
  transactionsByDay: Record<number, Transaction[]>;
  selectedDay: number;
  onAddClick: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function DailyTransactions({
  selectedDate,
  editingTransaction,
  onUpdate,
  onEditingChange,
  transactionsByDay,
  selectedDay,
  onAddClick,
  onEdit,
  onDelete,
}: DailyTransactionsProps) {
  const transactions = transactionsByDay[selectedDay] || [];

  // 수입/지출 총액 계산
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  // 지출 항목을 카테고리별로 그룹화
  const expensesByCategory = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, transaction) => {
        const categoryId = transaction.categories?.id || "uncategorized";
        if (!acc[categoryId]) {
          acc[categoryId] = {
            category: transaction.categories as Category,
            transactions: [],
            total: 0,
          };
        }
        acc[categoryId].transactions.push(transaction);
        acc[categoryId].total += transaction.amount;
        return acc;
      }, {} as Record<string, CategoryGroup>)
  );

  // 수입 항목 필터링
  const incomeTransactions = transactions.filter((t) => t.type === "income");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mt-8"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-800">
          {format(selectedDate, "yyyy년 M월 d일")}
        </h2>
        <Button
          onClick={onAddClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
        >
          <IoAddOutline className="w-5 h-5" />
          <span>지출 / 수입 추가</span>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">수입</div>
          <div className="text-xl font-semibold text-rose-500 tabular-nums">
            +{totals.income.toLocaleString()}
            <span className="text-base ml-0.5">원</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">지출</div>
          <div className="text-xl font-semibold text-blue-500 tabular-nums">
            -{totals.expense.toLocaleString()}
            <span className="text-base ml-0.5">원</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">합계</div>
          <div
            className={`text-xl font-semibold tabular-nums ${
              totals.income - totals.expense >= 0
                ? "text-rose-500"
                : "text-blue-500"
            }`}
          >
            {totals.income - totals.expense >= 0 ? "+" : ""}
            {(totals.income - totals.expense).toLocaleString()}
            <span className="text-base ml-0.5">원</span>
          </div>
        </div>
      </div>

      {/* 수입 섹션 수정 */}
      {incomeTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="mb-6 bg-rose-50/50 rounded-3xl shadow-sm border border-rose-100"
        >
          <div className="p-5 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="font-medium text-rose-900">수입</span>
              </div>
              <span className="font-bold text-rose-900 tabular-nums">
                +{totals.income.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className="divide-y divide-rose-50">
            {incomeTransactions.map((transaction: Transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="group relative transition-all hover:bg-rose-50/30"
              >
                {editingTransaction?.id === transaction.id ? (
                  <form
                    onSubmit={onUpdate}
                    className="p-8 space-y-8 rounded-2xl"
                  >
                    <div className="space-y-6">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          금액
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            value={editingTransaction.amount.toLocaleString()}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              );
                              onEditingChange({
                                ...editingTransaction,
                                amount: value ? parseInt(value) : 0,
                              });
                            }}
                            className="text-3xl h-12 tracking-tight font-semibold w-full px-4 py-4 border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-300"
                            placeholder="0"
                          />
                          <span className="absolute top-1/2 right-4 -translate-y-1/2 font-medium text-gray-600">
                            원
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          설명
                        </div>
                        <Input
                          type="text"
                          value={editingTransaction.description}
                          onChange={(e) =>
                            onEditingChange({
                              ...editingTransaction,
                              description: e.target.value,
                            })
                          }
                          className="w-full h-12 px-4 py-4 text-base bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                          placeholder="어디에서 사용하셨나요?"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-2.5 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onEditingChange(null)}
                        className="text-gray-600 hover:text-gray-900 font-medium px-5 py-2.5 text-sm rounded-xl hover:bg-gray-100"
                      >
                        취소
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm"
                      >
                        저장하기
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between p-4">
                    <div className="flex flex-col gap-4">
                      <span className="font-medium text-gray-900 tabular-nums">
                        {transaction.amount.toLocaleString()}원
                      </span>
                      <span className="text-gray-500 text-sm">
                        {transaction.description}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(transaction)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          수정
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(transaction.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="sync">
        {expensesByCategory.map(
          ([categoryId, { category, transactions, total }]) => (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="mb-6 bg-white rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category?.color }}
                    />
                    <span className="font-medium text-gray-900">
                      {category?.name || "미분류"}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {total.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {transactions.map((transaction: Transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="group relative transition-all"
                  >
                    {editingTransaction?.id === transaction.id ? (
                      <form
                        onSubmit={onUpdate}
                        className="p-8 space-y-8 rounded-2xl"
                      >
                        <div className="space-y-6">
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2">
                              금액
                            </div>
                            <div className="relative">
                              <Input
                                type="text"
                                value={editingTransaction.amount.toLocaleString()}
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /[^\d]/g,
                                    ""
                                  );
                                  onEditingChange({
                                    ...editingTransaction,
                                    amount: value ? parseInt(value) : 0,
                                  });
                                }}
                                className="text-3xl h-12 tracking-tight font-semibold w-full px-4 py-4 border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-300"
                                placeholder="0"
                              />
                              <span className="absolute top-1/2 right-4 -translate-y-1/2 font-medium text-gray-600">
                                원
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2">
                              설명
                            </div>
                            <Input
                              type="text"
                              value={editingTransaction.description}
                              onChange={(e) =>
                                onEditingChange({
                                  ...editingTransaction,
                                  description: e.target.value,
                                })
                              }
                              className="w-full h-12 px-4 py-4 text-base bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
                              placeholder="어디에서 사용하셨나요?"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2.5 pt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onEditingChange(null)}
                            className="text-gray-600 hover:text-gray-900 font-medium px-5 py-2.5 text-sm rounded-xl hover:bg-gray-100"
                          >
                            취소
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm"
                          >
                            저장하기
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between p-4">
                        <div className="flex flex-col gap-4">
                          <span className="font-medium text-gray-900 tabular-nums">
                            {transaction.amount.toLocaleString()}원
                          </span>
                          <span className="text-gray-500 text-sm">
                            {transaction.description}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(transaction)}
                              className="text-gray-500 hover:text-blue-600"
                            >
                              수정
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(transaction.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>
  );
}
