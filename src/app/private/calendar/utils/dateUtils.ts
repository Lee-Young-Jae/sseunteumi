import { startOfMonth, endOfMonth, eachDayOfInterval, getDate } from "date-fns";

export const convertToLocalDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

export const getDaysInMonth = (date: Date) => {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
};

export const formatExpenseDate = (date: Date, day: number) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
};
