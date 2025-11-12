const API_URL = "http://localhost:3001";

export interface Med {
  nome: string;
  dose: number;
  horario: string;
  date: string;
}

export interface Registro {
  id?: string;
  hora: string;
  quantidade: number;
  date?: string;
  tipo?: string;
}

export interface Dia {
  meds: Med[];
  data: Registro[];
  fraldas: Registro[];
}

// Meta diária
export async function getMetaDiaria(): Promise<number> {
  const res = await fetch(`${API_URL}/meta`);
  const data = await res.json();
  return data.valor;
}

export async function setMetaDiaria(valor: number): Promise<void> {
  await fetch(`${API_URL}/meta`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ valor }),
  });
}

export function salvarMetaDiaria(valor: number) {
  return setMetaDiaria(valor);
}

// Leite
export async function getMilks() {
  const res = await fetch(`${API_URL}/milks`);
  return res.json();
}

export async function getMilksByDate(date: string) {
  const res = await fetch(`${API_URL}/milks?date=${date}`);
  return res.json();
}

export async function addMilk(registro: Registro) {
  await fetch(`${API_URL}/milks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registro),
  });
}

// Remédios
export async function getMedicines() {
  const res = await fetch(`${API_URL}/medicines`);
  return res.json();
}

export async function getMedicinesByDate(date: string) {
  const res = await fetch(`${API_URL}/medicines?date=${date}`);
  return res.json();
}

export async function addMedicine(med: Med) {
  await fetch(`${API_URL}/medicines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  });
}

// Fraldas
export async function getFraldas() {
  const res = await fetch(`${API_URL}/diapers`);
  return res.json();
}

export async function getFraldasByDate(date: string) {
  const res = await fetch(`${API_URL}/diapers?date=${date}`);
  return res.json();
}

export async function addFralda(fralda: Registro) {
  await fetch(`${API_URL}/diapers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fralda),
  });
}

export {
  getFraldas as getDiapers,
  getFraldasByDate as getDiapersByDate,
  addFralda as addDiaper,
};
