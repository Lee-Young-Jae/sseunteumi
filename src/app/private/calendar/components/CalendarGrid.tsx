import { Transaction } from "@/types/query";
import { getDate } from "date-fns";
import { motion } from "framer-motion";

interface CalendarGridProps {
  firstDayOfMonth: number;
  daysInMonth: Date[];
  transactionsByDay: Record<number, Transaction[]>;
  selectedDay: number | null;
  onDayClick: (day: number) => void;
}

export function CalendarGrid({
  firstDayOfMonth,
  daysInMonth,
  transactionsByDay,
  selectedDay,
  onDayClick,
}: CalendarGridProps) {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // 일별 수입/지출 총액 계산 함수
  const getDayTotal = (transactions: Transaction[]) => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekdays.map((day) => (
        <div
          key={day}
          className="text-center text-sm font-medium text-gray-400 py-2"
        >
          {day}
        </div>
      ))}

      {/* 첫 날 이전의 빈 셀 */}
      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
        <div key={`empty-${index}`} className="p-3 h-24" />
      ))}
      {daysInMonth.map((day) => {
        const dayNum = getDate(day);
        const dayTransactions = transactionsByDay?.[dayNum] || [];
        const { income, expense } = getDayTotal(dayTransactions);

        // 카테고리 ID를 기준으로 중복 제거
        const uniqueCategories = Array.from(
          new Map(
            dayTransactions.map((trans) => [
              trans.categories?.id,
              trans.categories,
            ])
          ).values()
        ).filter(Boolean);

        return (
          <motion.div
            key={day.toISOString()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 h-24 flex flex-col items-center hover:bg-gray-100 transition-colors cursor-pointer
                  ${selectedDay === dayNum ? "bg-blue-50" : ""}`}
            onClick={() => onDayClick(dayNum)}
          >
            <span className="font-medium text-gray-500">{dayNum}</span>
            {(income > 0 || expense > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                {income > 0 && (
                  <span className="text-xs font-medium text-red-600 mt-1">
                    +{income.toLocaleString()}
                  </span>
                )}
                {expense > 0 && (
                  <span className="text-xs font-medium text-blue-600 mt-1">
                    -{expense.toLocaleString()}
                  </span>
                )}
                <div className="flex gap-1 mt-1">
                  {uniqueCategories.map((category) => (
                    <motion.div
                      key={category?.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category?.color }}
                      title={category?.name}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
