import type { DateString, Day } from "./types";

export function formatDateString(date: Date): DateString {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}` as DateString;
}

export function nativeDate(date: DateString): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function sum(day: Day): number {
  return day.data.reduce((p, c) => p + c.v, 0);
}

export function dayWeek(date: DateString): string {
  switch (nativeDate(date).getDay()) {
    case 0:
      return "Domingo";
    case 1:
      return "Segunda-feira";
    case 2:
      return "Terça-feira";
    case 3:
      return "Quarta-feira";
    case 4:
      return "Quinta-feira";
    case 5:
      return "Sexta-feira";
    case 6:
      return "Sábado";
    default:
      return "...";
  }
}

export function getDateByDays(
  numOfDays: number,
  date: Date = new Date()
): Date {
  const result = new Date(date.getTime());
  result.setDate(date.getDate() + numOfDays);
  return result;
}

export function natural(n: number): number {
  return Math.abs(n);
}
