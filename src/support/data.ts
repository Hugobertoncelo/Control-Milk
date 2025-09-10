import type {
  DataSet,
  DateString,
  Day,
  Settings,
  Med,
  Insertion,
} from "./types";
import { formatDateString, getDateByDays } from "./helpers";

const maxDataSet = 45;

export function getSettings(): Settings {
  const defaultSettings: Settings = {
    goal: 2500,
    water: 0,
    chart: 7,
  };

  try {
    const storage = localStorage.getItem("settings");
    const settings = storage ? JSON.parse(storage) : defaultSettings;

    if (typeof settings !== "object" || !("goal" in settings)) {
      throw new Error("Settings is not Object");
    }

    return settings;
  } catch (err) {
    console.error(err);
    return defaultSettings;
  }
}

export function saveSettings(settings: Partial<Settings>): void {
  const stored = getSettings();
  localStorage.setItem("settings", JSON.stringify({ ...stored, ...settings }));
}

export function insert(water: number): Day {
  const day: Day = getDay();

  day.data.push({
    t: new Date().toLocaleTimeString(),
    v: water,
  });

  saveDay(day);
  return day;
}

export function remove(date: DateString, index: number): Day {
  const day: Day = getDay(date);
  day.data.splice(index, 1);
  saveDay(day);
  return day;
}

export function getDay(date: DateString = formatDateString(new Date())): Day {
  const dataSet = getDataSet();

  let found = dataSet.find((day) => day.date === date);

  if (!found) {
    found = { date, data: [], meds: [] };
    dataSet.push(found);
    saveDataSet(dataSet);
  }

  if (!found.meds) found.meds = [];

  return found;
}

export function getDataSet(): DataSet {
  try {
    const dataSet: DataSet = JSON.parse(
      localStorage.getItem("dataset") ?? "[]"
    );

    dataSet.forEach((day: any) => {
      if (!("meds" in day)) day.meds = [];
      if (!("data" in day)) day.data = [];
    });

    return dataSet as DataSet;
  } catch (err) {
    console.error(err);
    resetDataSet();
    return [];
  }
}

export function getFillDataSet(days: number): DataSet {
  const dataSet: DataSet = [];
  for (let c = days * -1; c < 0; c++) {
    dataSet.push(getDay(formatDateString(getDateByDays(c + 1))));
  }
  return dataSet;
}

export function resetDataSet(): void {
  saveDataSet([]);
}

export function saveDay(day: Day): void {
  const dataSet = getDataSet();
  const index = dataSet.findIndex((d) => d.date === day.date);

  if (index >= 0) dataSet[index] = day;
  else if (dataSet.push(day) > maxDataSet) dataSet.shift();

  saveDataSet(dataSet);
}

export function saveDataSet(dataset: DataSet): void {
  localStorage.setItem("dataset", JSON.stringify(dataset));
}
