const API_URL =
  process.env.REACT_APP_API_URL || "https://control-milk-api.onrender.com";

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

// Função auxiliar para tratar fetch
async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Erro ao acessar ${url}: ${res.statusText}`);
  return res.json();
}

// Meta diária
export async function getMetaDiaria(): Promise<number> {
  const data = await fetchJson(`${API_URL}/meta`);
  return data.valor;
}

export async function setMetaDiaria(valor: number): Promise<void> {
  await fetchJson(`${API_URL}/meta`, {
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
  return fetchJson(`${API_URL}/milks`);
}

export async function getMilksByDate(date: string) {
  return fetchJson(`${API_URL}/milks?date=${date}`);
}

export async function addMilk(registro: Registro) {
  await fetchJson(`${API_URL}/milks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registro),
  });
}

// Remédios
export async function getMedicines() {
  return fetchJson(`${API_URL}/medicines`);
}

export async function getMedicinesByDate(date: string) {
  return fetchJson(`${API_URL}/medicines?date=${date}`);
}

export async function addMedicine(med: Med) {
  await fetchJson(`${API_URL}/medicines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(med),
  });
}

// Fraldas
export async function getFraldas() {
  return fetchJson(`${API_URL}/diapers`);
}

export async function getFraldasByDate(date: string) {
  return fetchJson(`${API_URL}/diapers?date=${date}`);
}

export async function addFralda(fralda: Registro) {
  await fetchJson(`${API_URL}/diapers`, {
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
