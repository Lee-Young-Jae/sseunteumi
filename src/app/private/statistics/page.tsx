"use client";

import { useState, useEffect } from "react";
import { format, subMonths, addMonths } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface MonthlyData {
  transactions: any[];
  expenseTotal: number;
  incomeTotal: number;
  balance: number;
  categoryTotals: Record<string, any>;
}

export default function StatisticsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonthData, setCurrentMonthData] = useState<MonthlyData | null>(
    null
  );
  const [previousMonthData, setPreviousMonthData] =
    useState<MonthlyData | null>(null);

  const fetchMonthData = async (date: Date) => {
    const response = await fetch(
      `/api/transactions?month=${
        date.getMonth() + 1
      }&year=${date.getFullYear()}`
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      const currentData = await fetchMonthData(selectedDate);
      const prevData = await fetchMonthData(subMonths(selectedDate, 1));

      setCurrentMonthData(currentData);
      setPreviousMonthData(prevData);
    };

    loadData();
  }, [selectedDate]);

  const handlePreviousMonth = () => {
    setSelectedDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  };

  const compareData = [
    {
      name: "이전 달",
      수입: previousMonthData?.incomeTotal || 0,
      지출: previousMonthData?.expenseTotal || 0,
    },
    {
      name: "이번 달",
      수입: currentMonthData?.incomeTotal || 0,
      지출: currentMonthData?.expenseTotal || 0,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 월 선택 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">월별 통계</h1>
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePreviousMonth}
            variant="outline"
            className="rounded-full p-2"
          >
            <IoChevronBack className="w-5 h-5" />
          </Button>
          <span className="text-lg font-medium">
            {format(selectedDate, "yyyy년 M월")}
          </span>
          <Button
            onClick={handleNextMonth}
            variant="outline"
            className="rounded-full p-2"
          >
            <IoChevronForward className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 월별 요약 */}
      <motion.div
        className="grid grid-cols-3 gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">총 지출</div>
          <div className="text-xl font-semibold text-blue-500 tabular-nums">
            -{currentMonthData?.expenseTotal?.toLocaleString()}
            <span className="text-base ml-0.5">원</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">총 수입</div>
          <div className="text-xl font-semibold text-rose-500 tabular-nums">
            +{currentMonthData?.incomeTotal?.toLocaleString()}
            <span className="text-base ml-0.5">원</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">합계</div>
          <div
            className={`text-xl font-semibold tabular-nums ${
              currentMonthData?.balance && currentMonthData.balance >= 0
                ? "text-rose-500"
                : "text-blue-500"
            }`}
          >
            {currentMonthData?.balance && currentMonthData.balance >= 0
              ? "+"
              : ""}
            {currentMonthData?.balance?.toLocaleString()}
            <span className="text-base ml-0.5">원</span>
          </div>
        </div>
      </motion.div>

      {/* 월별 비교 차트 */}
      <motion.div
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-medium text-gray-900 mb-6">월별 비교</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={compareData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => value.toLocaleString() + "원"}
              />
              <Legend />
              <Bar name="수입" dataKey="수입" fill="#f43f5e" />
              <Bar name="지출" dataKey="지출" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 카테고리별 지출 분석 */}
      {currentMonthData?.categoryTotals && (
        <motion.div
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            카테고리별 지출 분석
          </h2>
          <div className="space-y-4">
            {Object.entries(currentMonthData.categoryTotals).map(
              ([id, data]: [string, any]) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: data.color }}
                    />
                    <span className="text-gray-700">{data.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">
                    {data.total.toLocaleString()}원
                  </span>
                </div>
              )
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
