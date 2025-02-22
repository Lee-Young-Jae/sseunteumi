"use client";

import React, { useState, useEffect, JSX } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  subDays,
  addYears,
  subYears,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";

// --- Types --- //

export interface CalendarEvent {
  date: string; // ISO 8601 형식 (예: "2025-02-16")
  title: string;
  color?: string; // 소비 태그 색상
  spent?: number; // 소비한 금액
  added?: number; // 추가된 금액
  fixed?: number; // 고정지출값
}

export type ViewMode = "year" | "month" | "day";

export interface EnhancedCalendarProps {
  events?: CalendarEvent[];
  // controlled selected date (optional)
  selectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
  // controlled view mode (optional)
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

// --- EnhancedCalendar Component --- //

const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  events = [],
  selectedDate: externalSelectedDate,
  onSelectedDateChange,
  viewMode: externalViewMode,
  onViewModeChange,
}) => {
  // 내부 상태 (controlled 또는 uncontrolled)
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(
    new Date()
  );
  const selectedDate = externalSelectedDate || internalSelectedDate;

  const [internalViewMode, setInternalViewMode] = useState<ViewMode>("month");
  const viewMode = externalViewMode || internalViewMode;

  // 현재 월: 월 뷰에서 사용 (기본값은 selectedDate의 월)
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  // 연도 범위(10년 단위) — 연도 뷰에서 사용
  const [yearRangeStart, setYearRangeStart] = useState<number>(
    Math.floor(selectedDate.getFullYear() / 10) * 10
  );

  // 외부 변경 시 내부 상태 업데이트
  useEffect(() => {
    setCurrentMonth(selectedDate);
    setInternalSelectedDate(selectedDate);
  }, [selectedDate]);

  // --- Handlers --- //

  const handleDateSelect = (date: Date) => {
    if (onSelectedDateChange) {
      onSelectedDateChange(date);
    } else {
      setInternalSelectedDate(date);
    }
    // 월 뷰에서 날짜 선택 시 현재 월 업데이트
    setCurrentMonth(date);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // Navigation for Month view
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Navigation for Year view
  const nextYearRange = () => setYearRangeStart(yearRangeStart + 10);
  const prevYearRange = () => setYearRangeStart(yearRangeStart - 10);
  const yearRangeLabel = () => `${yearRangeStart} - ${yearRangeStart + 9}`;

  // Navigation for Day view
  const nextDay = () => handleDateSelect(addDays(selectedDate, 1));
  const prevDay = () => handleDateSelect(subDays(selectedDate, 1));

  // --- Render Header --- //

  const renderHeader = () => {
    return (
      <div className="flex flex-col border-b pb-2 mb-2">
        {/* 탭: Year, Month, Day */}
        <div className="flex justify-center space-x-2 mb-2">
          <button
            onClick={() => handleViewModeChange("year")}
            className={`px-3 py-1 rounded ${
              viewMode === "year"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            년
          </button>
          <button
            onClick={() => handleViewModeChange("month")}
            className={`px-3 py-1 rounded ${
              viewMode === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            월
          </button>
          <button
            onClick={() => handleViewModeChange("day")}
            className={`px-3 py-1 rounded ${
              viewMode === "day"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            일
          </button>
        </div>
        {/* 네비게이션 컨트롤 */}
        <div className="flex justify-between items-center">
          {viewMode === "month" && (
            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="text-gray-600 hover:text-gray-900"
              >
                &lt;
              </button>
              <span className="font-bold">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button
                onClick={nextMonth}
                className="text-gray-600 hover:text-gray-900"
              >
                &gt;
              </button>
            </div>
          )}
          {viewMode === "year" && (
            <div className="flex items-center space-x-2">
              <button
                onClick={prevYearRange}
                className="text-gray-600 hover:text-gray-900"
              >
                &lt;
              </button>
              <span className="font-bold">{yearRangeLabel()}</span>
              <button
                onClick={nextYearRange}
                className="text-gray-600 hover:text-gray-900"
              >
                &gt;
              </button>
            </div>
          )}
          {viewMode === "day" && (
            <div className="flex items-center space-x-2">
              <button
                onClick={prevDay}
                className="text-gray-600 hover:text-gray-900"
              >
                &lt;
              </button>
              <span className="font-bold">{format(selectedDate, "PPP")}</span>
              <button
                onClick={nextDay}
                className="text-gray-600 hover:text-gray-900"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Render Body --- //

  const renderBody = () => {
    if (viewMode === "month") return renderMonthView();
    if (viewMode === "year") return renderYearView();
    if (viewMode === "day") return renderDayView();
    return null;
  };

  // Month View: 날짜 그리드
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = gridStart;

    while (day <= gridEnd) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        const isCurrent = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        // 해당 날짜에 해당하는 이벤트들
        const dayEvents = events.filter((evt) =>
          isSameDay(parseISO(evt.date), day)
        );
        // 합계 계산
        const totalSpent = dayEvents.reduce(
          (acc, evt) => acc + (evt.spent || 0),
          0
        );
        const totalAdded = dayEvents.reduce(
          (acc, evt) => acc + (evt.added || 0),
          0
        );
        const totalFixed = dayEvents.reduce(
          (acc, evt) => acc + (evt.fixed || 0),
          0
        );

        days.push(
          <div
            key={day.toISOString()}
            className={`border p-2 h-28 cursor-pointer rounded-lg hover:bg-gray-50 transition 
              ${!isCurrent ? "bg-gray-100 text-gray-400" : ""}
              ${isToday ? "border-blue-500" : "border-gray-200"}`}
            onClick={() => handleDateSelect(cloneDay)}
          >
            <div className="text-sm mb-1">{formattedDate}</div>
            <div className="flex flex-wrap gap-1 mb-1">
              {dayEvents.map((evt, idx) => {
                const tooltip = `${evt.title}
소비: ${evt.spent ?? 0} / 추가: ${evt.added ?? 0} / 고정: ${evt.fixed ?? 0}`;
                return (
                  <span
                    key={idx}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: evt.color || "#3182ce" }}
                    title={tooltip}
                  ></span>
                );
              })}
            </div>
            {(totalSpent || totalAdded || totalFixed) && (
              <div className="text-xs">
                <div>소비: {totalSpent}</div>
                <div>추가: {totalAdded}</div>
                <div>고정: {totalFixed}</div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-2" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Year View: 연도 그리드 (10년 단위)
  const renderYearView = () => {
    const years: JSX.Element[] = [];
    for (let y = yearRangeStart; y < yearRangeStart + 10; y++) {
      years.push(
        <div
          key={y}
          className={`border p-4 cursor-pointer rounded-lg hover:bg-gray-50 transition ${
            y === selectedDate.getFullYear()
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => {
            const newDate = new Date(selectedDate);
            newDate.setFullYear(y);
            handleDateSelect(newDate);
            setCurrentMonth(newDate);
            handleViewModeChange("month");
          }}
        >
          {y}
        </div>
      );
    }
    return <div className="grid grid-cols-5 gap-2">{years}</div>;
  };

  // Day View: 선택된 날짜의 상세 내역
  const renderDayView = () => {
    const dayEvents = events.filter((evt) =>
      isSameDay(parseISO(evt.date), selectedDate)
    );
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-bold mb-2">
          {format(selectedDate, "PPP")}
        </h3>
        {dayEvents.length > 0 ? (
          <ul className="space-y-2">
            {dayEvents.map((evt, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: evt.color || "#3182ce" }}
                ></span>
                <span className="text-sm">
                  {evt.title} - 소비: {evt.spent ?? 0}, 추가: {evt.added ?? 0},
                  고정: {evt.fixed ?? 0}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">해당 날짜의 내역이 없습니다.</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

export default EnhancedCalendar;
