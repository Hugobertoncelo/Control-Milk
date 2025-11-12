import React, { useEffect, useState } from "react";
import { Card, Title, Dropdown, DropdownItem } from "@tremor/react";

const API_URL = "https://control-milk-api.onrender.com";

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export interface DataProps {
  update?: number;
}

export default function Data({ update }: DataProps) {
  const [date, setDate] = useState(formatDate(new Date()));
  const [milks, setMilks] = useState<any[]>([]);
  const [meds, setMeds] = useState<any[]>([]);
  const [fraldas, setFraldas] = useState<any[]>([]);
  const [dates, setDates] = useState<string[]>([]);

  async function fetchDates() {
    try {
      const all: any[] = await fetch(`${API_URL}/milks`).then((r) => r.json());
      const uniqueDates = Array.from(new Set(all.map((m) => m.date))).filter(
        Boolean
      );
      setDates(uniqueDates.sort().reverse());
    } catch (err) {
      console.error("Erro ao carregar datas:", err);
    }
  }

  async function fetchData() {
    try {
      const [milkData, medData, diaperData] = await Promise.all([
        fetch(`${API_URL}/milks?date=${date}`).then((r) => r.json()),
        fetch(`${API_URL}/medicines?date=${date}`).then((r) => r.json()),
        fetch(`${API_URL}/diapers?date=${date}`).then((r) => r.json()),
      ]);

      setMilks(milkData);
      setMeds(medData);
      setFraldas(diaperData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [date, update]);

  useEffect(() => {
    fetchDates();
  }, [update]);

  const totalLeite = milks.reduce((acc, m) => acc + (m.quantidade ?? 0), 0);

  return (
    <Card marginTop="mt-8" shadow>
      <Title>📅 Registros do Dia</Title>

      <Dropdown value={date} handleSelect={setDate}>
        {dates.map((d) => (
          <DropdownItem key={d} value={d} text={d} />
        ))}
      </Dropdown>

      <div className="mt-4">
        <div className="text-blue-700 font-bold text-lg">🥛 Leite</div>
        <div className="font-semibold text-gray-800 mt-1">
          Total ingerido: {totalLeite} ml
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {milks.map((milk, i) => (
            <li key={i}>
              {milk.hora} — {milk.quantidade} ml
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="text-green-700 font-bold text-lg">💊 Remédios</div>
        <div className="font-semibold text-gray-800 mt-1">
          Total: {meds.length}
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {meds.map((med, i) => (
            <li key={i}>
              {med.horario} — {med.nome} ({med.dose})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="text-yellow-700 font-bold text-lg">🍼 Fraldas</div>
        <div className="font-semibold text-gray-800 mt-1">
          Total: {fraldas.length}
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {fraldas.map((f, i) => (
            <li key={i}>
              {f.hora} — {f.quantidade} fralda(s)
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
