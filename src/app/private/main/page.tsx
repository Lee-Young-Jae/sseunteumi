"use client";

import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Plus, X, Settings2, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeactivateCategory,
} from "@/queries/useCategoryQuery";
import { motion } from "framer-motion";
import {
  useCreateTransaction,
  useGetMonthlyTransactions,
} from "@/queries/useTransactionQuery";

interface Category {
  id: string;
  name: string;
  color: string;
}

const formSchema = z.object({
  date: z.date(),
  items: z.array(
    z.object({
      amount: z.string().min(1, "금액을 입력해주세요"),
      categoryId: z.string().min(1, "카테고리를 선택해주세요"),
      description: z.string().optional(),
    })
  ),
});

const MainPage = () => {
  const { data: session } = useSession();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetCategories();

  const { data: transactionData, isLoading: isTransactionsLoading } =
    useGetMonthlyTransactions();

  const createTransaction = useCreateTransaction();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deactiveCategory = useDeactivateCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      items: [
        {
          amount: "",
          categoryId: "",
          description: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#000000",
  });

  const addCategory = async () => {
    if (newCategory.name.trim()) {
      try {
        await createCategory.mutateAsync({
          name: newCategory.name,
          color: newCategory.color,
        });
        setNewCategory({ name: "", color: "#000000" });
      } catch (error) {
        console.error("카테고리 생성 중 오류:", error);
      }
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deactiveCategory.mutateAsync(id);
    } catch (error) {
      console.error("카테고리 삭제 중 오류:", error);
    }
  };

  const updateCategoryColor = async (id: string, color: string) => {
    try {
      const category = categories?.find((c: Category) => c.id === id);
      if (category) {
        await updateCategory.mutateAsync({
          id,
          name: category.name,
          color,
        });
      }
    } catch (error) {
      console.error("카테고리 수정 중 오류:", error);
    }
  };

  // 금액 포맷팅 함수 추가
  const formatAmount = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");
    // 콤마 추가
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 금액 입력 처리 함수
  const handleAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const formatted = formatAmount(e.target.value);
    onChange(formatted.replace(/,/g, "")); // form에는 숫자만 저장
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      for (const item of values.items) {
        await createTransaction.mutateAsync({
          amount: Number(item.amount),
          categories_id: item.categoryId,
          description: item.description || "",
          transaction_date: values.date,
          type: "expense",
        });
      }

      form.reset();
    } catch (error) {
      console.error("지출 추가 중 오류가 발생했습니다:", error);
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-blue-600">{session?.user?.name}님</span>의 지출
          관리
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          오늘도 현명한 소비하세요! 💰
        </p>
      </motion.header>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-colors">
            <span className="block text-gray-600 text-sm mb-2">
              이번달 총 지출
            </span>
            <span className="block text-2xl font-bold text-blue-600">
              {transactionData?.expenseTotal
                ? transactionData.expenseTotal.toLocaleString()
                : 0}
              원
            </span>
          </div>

          {
            <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
              <h3 className="text-sm font-medium mb-1">이번달 최다 지출</h3>
              {transactionData?.topCategory && (
                <p className="text-xl font-bold">
                  {transactionData.topCategory.name || ""}
                  <span className="text-blue-200 text-sm ml-2">카테고리</span>
                </p>
              )}
            </div>
          }
        </motion.div>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl"
        >
          <Form {...form}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                지출을 추가할까요?
              </h2>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "max-w-[200px] text-left font-normal h-10 text-sm hover:bg-gray-50 border-none bg-transparent shadow-none",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              isToday(field.value) ? (
                                <span className="text-blue-600 font-medium">
                                  오늘
                                </span>
                              ) : (
                                format(field.value, "PPP", { locale: ko })
                              )
                            ) : (
                              <span>날짜를 선택하세요</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 relative border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="absolute right-4 top-4">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-900 mb-2 block">
                              금액
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                <div className="relative">
                                  <Input
                                    placeholder="0"
                                    value={formatAmount(field.value)}
                                    onChange={(e) =>
                                      handleAmountChange(e, field.onChange)
                                    }
                                    className="text-right text-xl h-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pr-12 bg-white transition-all"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                                    원
                                  </span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  {[1000, 5000, 10000].map((amount) => (
                                    <button
                                      key={amount}
                                      type="button"
                                      onClick={() => {
                                        const currentAmount = Number(
                                          field.value.replace(/,/g, "") || 0
                                        );
                                        field.onChange(
                                          (currentAmount + amount).toString()
                                        );
                                      }}
                                      className="px-3 py-1.5 text-sm rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    >
                                      +{amount.toLocaleString()}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-500 text-base mt-2" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.categoryId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-900 mb-2 block">
                              카테고리
                            </FormLabel>
                            <div className="flex gap-2">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="h-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white">
                                    <SelectValue
                                      placeholder="카테고리 선택"
                                      className="text-base"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-2xl">
                                  {categories?.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id}
                                      className="hover:bg-blue-50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-3 h-3 rounded-full"
                                          style={{
                                            backgroundColor: category.color,
                                          }}
                                        />
                                        {category.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                                  >
                                    <Settings2 className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
                                  <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold">
                                      카테고리 관리
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-6 py-4">
                                    <div className="flex gap-2">
                                      <div className="flex-1 relative">
                                        <Input
                                          placeholder="새 카테고리 이름"
                                          value={newCategory.name}
                                          onChange={(e) =>
                                            setNewCategory({
                                              ...newCategory,
                                              name: e.target.value,
                                            })
                                          }
                                          className="h-12 pl-12 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
                                        />
                                        <div
                                          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded"
                                          style={{
                                            backgroundColor: newCategory.color,
                                          }}
                                        />
                                      </div>
                                      <Input
                                        type="color"
                                        value={newCategory.color}
                                        onChange={(e) =>
                                          setNewCategory({
                                            ...newCategory,
                                            color: e.target.value,
                                          })
                                        }
                                        className="w-12 h-12 p-1 rounded-2xl border-2"
                                      />
                                      <Button
                                        onClick={addCategory}
                                        size="icon"
                                        className="h-12 w-12 rounded-2xl bg-blue-600 hover:bg-blue-700"
                                      >
                                        <Plus className="h-5 w-5" />
                                      </Button>
                                    </div>

                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                      {categories?.map((category) => (
                                        <div
                                          key={category.id}
                                          className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div
                                              className="w-5 h-5 rounded-lg"
                                              style={{
                                                backgroundColor: category.color,
                                              }}
                                            />
                                            <span className="font-medium text-gray-900">
                                              {category.name}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="color"
                                              value={category.color}
                                              onChange={(e) =>
                                                updateCategoryColor(
                                                  category.id,
                                                  e.target.value
                                                )
                                              }
                                              className="w-10 h-10 p-1 rounded-xl border-2"
                                            />
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() =>
                                                removeCategory(category.id)
                                              }
                                              className="h-10 w-10 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <FormMessage className="text-red-500 text-base mt-2" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="mt-6">
                          <FormLabel className="text-base font-semibold text-gray-900 mb-2 block">
                            설명 (선택사항)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="지출에 대한 설명을 입력해주세요"
                              {...field}
                              className="h-11 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-base mt-2" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                ))}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 rounded-lg text-sm font-medium border border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() =>
                      append({
                        amount: "",
                        categoryId: "",
                        description: "",
                      })
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    지출 항목 추가
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    저장하기
                  </Button>
                </motion.div>
              </div>
            </form>
          </Form>
        </motion.section>
      </motion.section>
    </motion.main>
  );
};

export default MainPage;
