"use client";

import React, { useState } from "react";
import EnhancedCalendar, { CalendarEvent } from "@/app/component/Calendar";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"year" | "month" | "day">("month");

  // 예시 이벤트 데이터 (실제 데이터는 API 등으로 로드)
  const events: CalendarEvent[] = [
    {
      date: "2025-03-10",
      title: "식비",
      color: "#e53e3e",
      spent: 5000,
      added: 0,
      fixed: 0,
    },
    {
      date: "2025-03-15",
      title: "정산",
      color: "#38a169",
      spent: 0,
      added: 2000,
      fixed: 0,
    },
    {
      date: "2025-03-15",
      title: "교통",
      color: "#dd6b20",
      spent: 1500,
      added: 0,
      fixed: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-4">
      <EnhancedCalendar
        events={events}
        selectedDate={selectedDate}
        onSelectedDateChange={(date) => setSelectedDate(date)}
        viewMode={viewMode}
        onViewModeChange={(mode) => setViewMode(mode)}
      />
      <p>선택된 날짜: {selectedDate.toLocaleDateString()}</p>
    </div>
  );
}
