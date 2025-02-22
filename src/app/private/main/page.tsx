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
import { useGetExpenses } from "@/queries/useExpenseQuery";
import { useCreateExpense } from "@/queries/useExpenseQuery";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ExpenseItem {
  id: string;
  amount: number;
  categoryId: string;
  description?: string;
  date: Date;
}

const formSchema = z.object({
  amount: z.string().min(1, "금액을 입력해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  description: z.string().optional(),
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
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "식비", color: "#FF6B6B" },
    { id: "2", name: "교통", color: "#4ECDC4" },
    { id: "3", name: "주거", color: "#45B7D1" },
    { id: "4", name: "통신", color: "#96CEB4" },
    { id: "5", name: "의료", color: "#FFEEAD" },
    { id: "6", name: "교육", color: "#D4A5A5" },
    { id: "7", name: "여가", color: "#9B59B6" },
    { id: "8", name: "기타", color: "#95A5A6" },
  ]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#000000",
  });
  const { data: expenses } = useGetExpenses();
  const createExpense = useCreateExpense();

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

  const addCategory = () => {
    if (newCategory.name.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory.name,
          color: newCategory.color,
        },
      ]);
      setNewCategory({ name: "", color: "#000000" });
    }
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const updateCategoryColor = (id: string, color: string) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, color: color } : cat))
    );
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
        await createExpense.mutateAsync({
          amount: Number(item.amount),
          category: item.categoryId,
          description: item.description,
        });
      }

      form.reset();
    } catch (error) {
      console.error("지출 추가 중 오류가 발생했습니다:", error);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-blue-600">{session?.user?.name}님</span>{" "}
          반가워요! 😁
        </h1>
      </header>
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white">
            <span className="block text-gray-600 text-lg mb-2">
              이번달 지출
            </span>
            <span className="block text-3xl font-bold text-blue-600">
              100,000원
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-blue-50 p-6 border border-blue-100">
          <p className="text-gray-600">
            이번달엔{" "}
            <span className="text-blue-600 font-semibold">{`${categories[0].name}`}</span>
            에 제일 많이 썼네요.
          </p>
        </div>

        <section className="bg-white rounded-3xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">
              지출을 추가할래요.
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl hover:bg-gray-100"
                >
                  <Settings2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>카테고리 관리</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="새 카테고리"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                      className="w-20"
                    />
                    <Button onClick={addCategory} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-2 rounded bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={category.color}
                            onChange={(e) =>
                              updateCategoryColor(category.id, e.target.value)
                            }
                            className="w-12 h-8"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCategory(category.id)}
                            className="text-red-500 hover:text-red-700"
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal h-14 text-lg rounded-2xl border-2 hover:bg-gray-50",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              isToday(field.value) ? (
                                "오늘"
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
                    <FormMessage className="text-red-500 text-base mt-2" />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-6 rounded-2xl bg-gray-50 relative border-2 border-gray-100"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold text-gray-900 mb-2 block">
                              금액
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="0"
                                  value={formatAmount(field.value)}
                                  onChange={(e) =>
                                    handleAmountChange(e, field.onChange)
                                  }
                                  className="text-right text-xl h-14 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pr-12"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  원
                                </span>
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
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-14 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                  <SelectValue
                                    placeholder="카테고리 선택"
                                    className="text-lg"
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-2xl">
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                    className="hover:bg-blue-50"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded"
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
                              className="h-14 rounded-2xl border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-lg"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-base mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 rounded-2xl text-lg font-semibold border-2 border-gray-200 hover:bg-gray-50"
                  onClick={() =>
                    append({
                      amount: "",
                      categoryId: "",
                      description: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-5 w-5" />
                  지출 항목 추가
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-2xl transition-colors"
              >
                저장하기
              </Button>
            </form>
          </Form>
        </section>
      </section>
    </main>
  );
};

export default MainPage;
