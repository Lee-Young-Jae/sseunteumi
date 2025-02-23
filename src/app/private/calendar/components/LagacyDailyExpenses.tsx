// import { Expense, CategoryGroup } from "@/types/query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { IoAddOutline } from "react-icons/io5";
// import { motion, AnimatePresence } from "framer-motion";

// interface DailyExpensesProps {
//   selectedDate: Date;
//   selectedDay: number;
//   expensesByDay: Record<number, Expense[]>;
//   editingExpense: Expense | null;
//   onEdit: (expense: Expense) => void;
//   onDelete: (id: string) => void;
//   onUpdate: (e: React.FormEvent) => void;
//   onEditingChange: (expense: Expense | null) => void;
//   onAddClick: () => void;
// }

// export function DailyExpenses({
//   selectedDate,
//   selectedDay,
//   expensesByDay,
//   editingExpense,
//   onEdit,
//   onDelete,
//   onUpdate,
//   onEditingChange,
//   onAddClick,
// }: DailyExpensesProps) {
//   const expenses = expensesByDay[selectedDay] || [];

//   const expensesByCategory = Object.entries(
//     expenses.reduce((acc, expense) => {
//       const categoryId = expense.categories_id;
//       if (!acc[categoryId]) {
//         acc[categoryId] = {
//           category: expense.categories,
//           expenses: [],
//           total: 0,
//         };
//       }
//       acc[categoryId].expenses.push(expense);
//       acc[categoryId].total += expense.amount;
//       return acc;
//     }, {} as Record<string, CategoryGroup>)
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, ease: "easeOut" }}
//       className="mt-8"
//     >
//       <div className="mb-6 flex justify-between items-center">
//         <h2 className="text-2xl font-light text-gray-800">
//           {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
//           {selectedDay}일
//         </h2>
//         <Button
//           onClick={onAddClick}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
//         >
//           <IoAddOutline className="w-5 h-5" />
//           <span>지출 / 수입 추가</span>
//         </Button>
//       </div>

//       {/* 카테고리별 그룹화된 지출 내역이 있을 경우에만 표시 */}
//       <AnimatePresence mode="sync">
//         {expensesByDay?.[selectedDay] &&
//           Object.entries(
//             expensesByDay[selectedDay].reduce((acc, expense) => {
//               const categoryId = expense.categories.id;
//               if (!acc[categoryId]) {
//                 acc[categoryId] = {
//                   category: expense.categories,
//                   expenses: [],
//                   total: 0,
//                 };
//               }
//               acc[categoryId].expenses.push(expense);
//               acc[categoryId].total += expense.amount;
//               return acc;
//             }, {} as Record<string, CategoryGroup>)
//           ).map(([categoryId, { category, expenses, total }]) => (
//             <motion.div
//               key={categoryId}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2, ease: "easeInOut" }}
//               className="mb-6 bg-white rounded-3xl shadow-sm border border-gray-100"
//             >
//               <div className="p-5 border-b border-gray-100">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <div
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: category.color }}
//                     />
//                     <span className="font-medium text-gray-900">
//                       {category.name}
//                     </span>
//                   </div>
//                   <span className="font-bold text-gray-900 tabular-nums">
//                     {total.toLocaleString()}원
//                   </span>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-50">
//                 <AnimatePresence mode="sync">
//                   {expenses.map((expense: Expense) => (
//                     <motion.div
//                       key={expense.id}
//                       initial={{ opacity: 0, y: 5 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -5 }}
//                       transition={{ duration: 0.15, ease: "easeInOut" }}
//                       className="group relative transition-all"
//                     >
//                       {editingExpense?.id === expense.id ? (
//                         <form
//                           onSubmit={onUpdate}
//                           className="p-8 space-y-8 rounded-2xl"
//                         >
//                           <div className="space-y-6">
//                             <div>
//                               <div className="text-sm font-medium text-gray-500 mb-2">
//                                 금액
//                               </div>
//                               <div className="relative">
//                                 <Input
//                                   type="text"
//                                   value={editingExpense.amount.toLocaleString()}
//                                   onChange={(e) => {
//                                     const value = e.target.value.replace(
//                                       /[^\d]/g,
//                                       ""
//                                     );
//                                     onEditingChange({
//                                       ...editingExpense,
//                                       amount: value ? parseInt(value) : 0,
//                                     });
//                                   }}
//                                   className="text-3xl h-12 tracking-tight font-semibold w-full px-4 py-4 border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-300"
//                                   placeholder="0"
//                                 />
//                                 <span className="absolute top-1/2 right-4 -translate-y-1/2 font-medium text-gray-600">
//                                   원
//                                 </span>
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-sm font-medium text-gray-500 mb-2">
//                                 설명
//                               </div>
//                               <Input
//                                 type="text"
//                                 value={editingExpense.description}
//                                 onChange={(e) =>
//                                   onEditingChange({
//                                     ...editingExpense,
//                                     description: e.target.value,
//                                   })
//                                 }
//                                 className="w-full h-12 px-4 py-4 text-base bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
//                                 placeholder="어디에서 사용하셨나요?"
//                               />
//                             </div>
//                           </div>
//                           <div className="flex items-center justify-end space-x-2.5 pt-4">
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               onClick={() => onEditingChange(null)}
//                               className="text-gray-600 hover:text-gray-900 font-medium px-5 py-2.5 text-sm rounded-xl hover:bg-gray-100"
//                             >
//                               취소
//                             </Button>
//                             <Button
//                               type="submit"
//                               className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm"
//                             >
//                               저장하기
//                             </Button>
//                           </div>
//                         </form>
//                       ) : (
//                         <div className="flex items-center justify-between p-4">
//                           <div className="flex flex-col gap-4">
//                             <span className="font-medium text-gray-900 tabular-nums">
//                               {expense.amount.toLocaleString()}원
//                             </span>
//                             <span className="text-gray-500 text-sm">
//                               {expense.description}
//                             </span>
//                           </div>
//                           <div className="flex items-center space-x-4">
//                             <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => onEdit(expense)}
//                                 className="text-gray-500 hover:text-blue-600"
//                               >
//                                 수정
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => onDelete(expense.id)}
//                                 className="text-gray-500 hover:text-red-600"
//                               >
//                                 삭제
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             </motion.div>
//           ))}
//       </AnimatePresence>
//     </motion.div>
//   );
// }
