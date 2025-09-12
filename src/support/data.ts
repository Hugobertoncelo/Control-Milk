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

// =================== SETTINGS ===================
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

// =================== DATASET ===================
export function getDataSet(): DataSet {
  try {
    const raw = localStorage.getItem("dataset") ?? "[]";
    const dataSet: DataSet = JSON.parse(raw);

    dataSet.forEach((day: any) => {
      if (!("meds" in day)) day.meds = [];
      if (!("data" in day)) day.data = [];
      if (!("diapers" in day)) day.diapers = [];
    });

    return dataSet as DataSet;
  } catch (err) {
    console.error(err);
    resetDataSet();
    return [];
  }
}

export function saveDataSet(dataset: DataSet): void {
  localStorage.setItem("dataset", JSON.stringify(dataset));
}

export function resetDataSet(): void {
  saveDataSet([]);
}

// =================== DAY ===================
export function getDay(date: DateString = formatDateString(new Date())): Day {
  const dataSet = getDataSet();

  let found = dataSet.find((d) => d.date === date);

  if (!found) {
    found = {
      date,
      data: [],
      meds: [],
      diapers: [],
    };
    dataSet.push(found);
    saveDataSet(dataSet);
  }

  if (!found.data) found.data = [];
  if (!found.meds) found.meds = [];
  if (!found.diapers) found.diapers = [];

  return found;
}

export function saveDay(day: Day): void {
  const dataSet = getDataSet();
  const index = dataSet.findIndex((d) => d.date === day.date);

  if (index >= 0) dataSet[index] = day;
  else if (dataSet.push(day) > maxDataSet) dataSet.shift();

  saveDataSet(dataSet);
}

export function getFillDataSet(days: number): DataSet {
  const dataSet: DataSet = [];
  for (let c = days * -1; c < 0; c++) {
    dataSet.push(getDay(formatDateString(getDateByDays(c + 1))));
  }
  return dataSet;
}

// =================== LEITE ===================
export function insert(water: number): Day {
  const day = getDay();
  day.data.push({
    t: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    v: water,
  });
  saveDay(day);
  return day;
}

export function remove(date: DateString, index: number): Day {
  const day = getDay(date);
  day.data.splice(index, 1);
  saveDay(day);
  return day;
}

// =================== REMÉDIOS ===================
export function addMed(med: Med, date?: DateString): Day {
  const day = getDay(date);
  if (!day.meds) day.meds = [];

  day.meds.push({
    ...med,
    date: day.date,
  });

  saveDay(day);
  return day;
}

export function removeMed(index: number, date?: DateString): Day {
  const day = getDay(date);
  if (!day.meds || index < 0 || index >= day.meds.length) return day;

  day.meds.splice(index, 1);
  saveDay(day);
  return day;
}

// =================== FRALDAS ===================
export function addDiaper(diaper: Diaper, date?: DateString): Day {
  const day = getDay(date);
  if (!day.diapers) day.diapers = [];

  day.diapers.push({
    ...diaper,
    date: day.date,
  });

  saveDay(day);
  return day;
}

export function removeDiaper(index: number, date?: DateString): Day {
  const day = getDay(date);
  if (!day.diapers || index < 0 || index >= day.diapers.length) return day;

  day.diapers.splice(index, 1);
  saveDay(day);
  return day;
}
