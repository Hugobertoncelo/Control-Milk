import type {
  DataSet,
  DateString,
  Day,
  Settings,
  Med,
  Insertion,
  Diaper,
} from "./types";
import { formatDateString, getDateByDays } from "./helpers";

const maxDataSet = 45;
const API_URL =
  process.env.REACT_APP_API_URL || "https://control-milk-api.onrender.com";

// =================== SETTINGS ===================
export async function getSettings(): Promise<Settings> {
  const res = await fetch(`${API_URL}/settings`);
  return await res.json();
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
}

// =================== DATASET ===================
export async function getDataSet(): Promise<DataSet> {
  const res = await fetch(`${API_URL}/days`);
  return await res.json();
}

export async function saveDataSet(dataset: DataSet): Promise<void> {
  await fetch(`${API_URL}/days`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataset),
  });
}

// =================== DAY ===================
export async function getDay(
  date: DateString = formatDateString(new Date())
): Promise<Day> {
  const res = await fetch(`${API_URL}/days?date=${date}`);
  const days = await res.json();
  return days[0] || { date, data: [], meds: [], diapers: [] };
}

export async function saveDay(day: Day): Promise<void> {
  const res = await fetch(`${API_URL}/days?date=${day.date}`);
  const days = await res.json();
  if (days.length > 0) {
    await fetch(`${API_URL}/days/${days[0].id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(day),
    });
  } else {
    await fetch(`${API_URL}/days`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(day),
    });
  }
}

export async function getFillDataSet(days: number): Promise<DataSet> {
  const dataSet: DataSet = [];
  for (let c = days * -1; c < 0; c++) {
    const day = await getDay(formatDateString(getDateByDays(c + 1)));
    dataSet.push(day);
  }
  return dataSet;
}

// =================== LEITE ===================
export async function insert(water: number): Promise<Day> {
  const day = await getDay();
  day.data.push({
    t: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    v: water,
  });
  await saveDay(day);
  return day;
}

export async function remove(date: DateString, index: number): Promise<Day> {
  const day = await getDay(date);
  day.data.splice(index, 1);
  await saveDay(day);
  return day;
}

// =================== REMÉDIOS ===================
export async function addMed(med: Med, date?: DateString): Promise<Day> {
  const day = await getDay(date);
  if (!day.meds) day.meds = [];
  day.meds.push({
    ...med,
    date: day.date,
  });
  await saveDay(day);
  return day;
}

export async function removeMed(
  index: number,
  date?: DateString
): Promise<Day> {
  const day = await getDay(date);
  if (!day.meds || index < 0 || index >= day.meds.length) return day;
  day.meds.splice(index, 1);
  await saveDay(day);
  return day;
}

// =================== FRALDAS ===================
export async function addDiaper(
  diaper: Diaper,
  date?: DateString
): Promise<Day> {
  const day = await getDay(date);
  if (!day.diapers) day.diapers = [];
  day.diapers.push({
    ...diaper,
    date: day.date,
  });
  await saveDay(day);
  return day;
}

export async function removeDiaper(
  index: number,
  date?: DateString
): Promise<Day> {
  const day = await getDay(date);
  if (!day.diapers || index < 0 || index >= day.diapers.length) return day;
  day.diapers.splice(index, 1);
  await saveDay(day);
  return day;
}
