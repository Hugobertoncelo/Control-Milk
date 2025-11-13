import React, { useEffect, useState } from "react";
import { Card, Title, Dropdown, DropdownItem } from "@tremor/react";
import { getDataSet, getDay } from "../support/data";
import { nativeDate, formatDateString } from "../support/helpers";

export interface DataProps {
  update?: number;
}

export default function Data({ update }: DataProps) {
  const [date, setDate] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [milks, setMilks] = useState<any[]>([]);
  const [meds, setMeds] = useState<any[]>([]);
  const [fraldas, setFraldas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDataSet() {
      const dataSet = await getDataSet();
      const uniqueDates = dataSet.map((d) => d.date).filter(Boolean);
      setDates(uniqueDates.sort().reverse());
      if (!date && uniqueDates.length > 0) setDate(uniqueDates[0]);
    }
    fetchDataSet();
  }, [update]);

  useEffect(() => {
    async function fetchDay() {
      if (!date) return;
      const day = await getDay(date as any);
      setMilks(day.data || []);
      setMeds(day.meds || []);
      setFraldas(day.diapers || []);
    }
    fetchDay();
  }, [date, update]);

  const totalLeite = milks.reduce((acc: number, m: any) => acc + (m.v ?? 0), 0);

  return (
    <Card marginTop="mt-8" shadow>
      <Title>📅 Registros do Dia</Title>
      <Dropdown value={date} onValueChange={setDate}>
        {dates.map((d) => (
          <DropdownItem key={d} value={d} text={d} />
        ))}
      </Dropdown>
      {/* Leite */}
      <div className="mt-4">
        <div className="text-blue-700 font-bold text-lg">🥛 Leite</div>
        <div className="font-semibold text-gray-800 mt-1">
          Total ingerido: {totalLeite} ml
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {milks.map((milk: any, i: number) => (
            <li key={i}>
              {milk.t} — {milk.v} ml
            </li>
          ))}
        </ul>
      </div>
      {/* Remédios */}
      <div className="mt-4">
        <div className="text-green-700 font-bold text-lg">💊 Remédios</div>
        <div className="font-semibold text-gray-800 mt-1">
          Total: {meds.length}
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {meds.map((med: any, i: number) => (
            <li key={i}>
              {med.horario || med.time || med.hora
                ? `${med.horario || med.time || med.hora} — `
                : ""}
              {med.nome || med.name} — {med.dose} gotas
            </li>
          ))}
        </ul>
      </div>

      {/* Fraldas */}
      <div className="mt-4">
        <div className="text-yellow-700 font-bold text-lg">🍼 Fraldas</div>
        <div className="font-semibold text-gray-800 mt-1">
          Total: {fraldas.length}
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {fraldas.map((f: any, i: number) => (
            <li key={i}>
              {f.time || f.hora} — {f.type || f.tipo}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
