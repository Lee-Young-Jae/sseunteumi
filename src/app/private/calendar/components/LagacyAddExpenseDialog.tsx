// "use client";

// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCreateExpense } from "@/queries/useExpenseQuery";
// import { useGetCategories } from "@/queries/useCategoryQuery";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// interface AddExpenseDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   selectedDate: string;
// }

// // 스키마 정의
// const expenseFormSchema = z.object({
//   amount: z
//     .number()
//     .min(1, "금액을 입력해주세요")
//     .max(999999999, "너무 큰 금액입니다"),
//   description: z.string().max(100, "설명이 너무 깁니다").optional(),
//   categories_id: z.string().min(1, "카테고리를 선택해주세요"),
//   expense_date: z.string(),
//   type: z.enum(["expense", "income"]),
// });

// type ExpenseFormData = z.infer<typeof expenseFormSchema>;

// export function AddExpenseDialog({
//   isOpen,
//   onOpenChange,
//   selectedDate,
// }: AddExpenseDialogProps) {
//   const { data: categories = [] } = useGetCategories();
//   const { mutate: createExpense } = useCreateExpense();
//   const [type, setType] = useState<"expense" | "income">("expense");

//   const {
//     control,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm<ExpenseFormData>({
//     resolver: zodResolver(expenseFormSchema),
//     defaultValues: {
//       amount: 0,
//       description: "",
//       categories_id: "",
//       expense_date: selectedDate,
//       type: "expense",
//     },
//   });

//   const onSubmit = async (data: ExpenseFormData) => {
//     try {
//       createExpense({
//         amount: data.amount,
//         categories_id: data.categories_id,
//         description: data.description || "",
//         expense_date: new Date(selectedDate),
//       });
//       onOpenChange(false);
//       reset();
//     } catch (error) {
//       console.error("지출 추가 중 오류:", error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="rounded-3xl p-0 overflow-hidden">
//         <DialogHeader className="p-6 pb-0">
//           <DialogTitle className="font-medium text-gray-900 text-xl">
//             새로운 {type === "expense" ? "지출" : "수입"} 추가
//           </DialogTitle>
//           <DialogDescription className="sr-only">
//             새로운 지출 또는 수입을 추가하는 양식입니다.
//           </DialogDescription>
//           <div className="flex space-x-1 mt-6 bg-gray-50 p-1 rounded-xl">
//             {[
//               { id: "expense", label: "지출" },
//               { id: "income", label: "수입" },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setType(tab.id as "expense" | "income");
//                   setValue("type", tab.id as "expense" | "income");
//                 }}
//                 className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                   type === tab.id
//                     ? "bg-white text-blue-600 shadow-sm"
//                     : "text-gray-500 hover:text-gray-900"
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </DialogHeader>

//         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
//           <div className="space-y-8">
//             <div>
//               <div className="text-sm font-medium text-gray-500 mb-2">금액</div>
//               <div className="space-y-3">
//                 <div className="relative">
//                   <Controller
//                     name="amount"
//                     control={control}
//                     render={({ field }) => (
//                       <>
//                         <Input
//                           {...field}
//                           type="text"
//                           value={field.value.toLocaleString()}
//                           onChange={(e) => {
//                             const value = e.target.value.replace(/[^\d]/g, "");
//                             field.onChange(value ? parseInt(value) : 0);
//                           }}
//                           className={`text-3xl h-12 tracking-tight font-semibold w-full px-4 py-4 border-0 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-300 ${
//                             errors.amount ? "focus:ring-red-500 bg-red-50" : ""
//                           }`}
//                           placeholder="0"
//                         />
//                       </>
//                     )}
//                   />
//                   <span className="absolute top-1/2 right-4 -translate-y-1/2 font-medium text-gray-600">
//                     원
//                   </span>
//                 </div>
//                 {errors.amount && (
//                   <span className="text-sm text-red-500 mt-1">
//                     {errors.amount.message}
//                   </span>
//                 )}
//                 <div className="flex gap-2">
//                   {[1000, 5000, 10000].map((amount) => (
//                     <button
//                       key={amount}
//                       type="button"
//                       onClick={() => {
//                         const currentAmount = control._getWatch("amount") || 0;
//                         setValue("amount", currentAmount + amount);
//                       }}
//                       className="flex-1 px-3 py-2 text-sm rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
//                     >
//                       +{amount.toLocaleString()}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {type === "expense" && (
//               <div>
//                 <div className="text-sm font-medium text-gray-500 mb-2">
//                   카테고리
//                 </div>
//                 <Controller
//                   name="categories_id"
//                   control={control}
//                   render={({ field }) => (
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <SelectTrigger
//                         className={`w-full h-12 px-4 py-4 text-base bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
//                           errors.categories_id
//                             ? "focus:ring-red-500 bg-red-50"
//                             : ""
//                         }`}
//                       >
//                         <SelectValue placeholder="카테고리 선택" />
//                       </SelectTrigger>
//                       <SelectContent className="rounded-2xl">
//                         {categories.map((category: any) => (
//                           <SelectItem
//                             key={category.id}
//                             value={category.id}
//                             className="hover:bg-blue-50"
//                           >
//                             <div className="flex items-center gap-2">
//                               <div
//                                 className="w-3 h-3 rounded-full"
//                                 style={{ backgroundColor: category.color }}
//                               />
//                               {category.name}
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//                 {errors.categories_id && (
//                   <span className="text-sm text-red-500 mt-1">
//                     {errors.categories_id.message}
//                   </span>
//                 )}
//               </div>
//             )}

//             <div>
//               <div className="text-sm font-medium text-gray-500 mb-2">설명</div>
//               <Controller
//                 name="description"
//                 control={control}
//                 render={({ field }) => (
//                   <Input
//                     {...field}
//                     type="text"
//                     placeholder="어디에서 사용하셨나요?"
//                     className="w-full h-12 px-4 py-4 text-base bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
//                   />
//                 )}
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-2.5 pt-4">
//             <Button
//               type="button"
//               variant="ghost"
//               onClick={() => onOpenChange(false)}
//               className="text-gray-600 hover:text-gray-900 font-medium px-5 py-2.5 text-sm rounded-xl hover:bg-gray-100"
//             >
//               취소
//             </Button>
//             <Button
//               type="submit"
//               className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm"
//             >
//               저장하기
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
