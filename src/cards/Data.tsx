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
      try {
        const dataSet = await getDataSet();
        if (!Array.isArray(dataSet)) {
          setDates([]);
          return;
        }
        const uniqueDates = dataSet.map((d) => d.date).filter(Boolean);
        setDates(uniqueDates.sort().reverse());
        if (!date && uniqueDates.length > 0) setDate(uniqueDates[0]);
      } catch (e) {
        setDates([]);
      }
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
      <Title>
        📅 <span className="text-blue-700">Registros do Dia</span>
      </Title>
      {dates.length === 0 ? (
        <div className="text-red-600 font-bold my-4">
          Não foi possível carregar os dados. Verifique sua conexão ou tente
          novamente mais tarde.
        </div>
      ) : (
        <Dropdown value={date} onValueChange={setDate}>
          {dates.map((d) => (
            <DropdownItem key={d} value={d} text={d} />
          ))}
        </Dropdown>
      )}
      {/* Leite */}
      <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 shadow-sm">
        <div className="text-blue-700 font-bold text-lg flex items-center gap-2">
          🥛 Leite
        </div>
        <div className="font-semibold text-gray-800 mt-1">
          Total ingerido: {totalLeite} ml
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {milks.map((milk: any, i: number) => (
            <li key={i} className="py-1">
              <span className="font-mono text-blue-900 bg-blue-100 px-2 py-1 rounded mr-2">
                {milk.t}
              </span>
              <span className="font-semibold">{milk.v} ml</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Remédios */}
      <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 shadow-sm">
        <div className="text-green-700 font-bold text-lg flex items-center gap-2">
          💊 Remédios
        </div>
        <div className="font-semibold text-gray-800 mt-1">
          Total: {meds.length}
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {meds.map((med: any, i: number) => (
            <li key={i} className="py-1">
              {med.horario || med.time || med.hora ? (
                <span className="font-mono text-green-900 bg-green-100 px-2 py-1 rounded mr-2">
                  {med.horario || med.time || med.hora}
                </span>
              ) : null}
              <span className="font-semibold">{med.nome || med.name}</span> —{" "}
              {med.dose} gotas
            </li>
          ))}
        </ul>
      </div>
      {/* Fraldas */}
      <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 shadow-sm">
        <div className="text-yellow-700 font-bold text-lg flex items-center gap-2">
          🧷 Fraldas
        </div>
        <div className="font-semibold text-gray-800 mt-1">
          Total: {fraldas.length}
        </div>
        <ul className="mt-1 list-disc ml-5 text-gray-700">
          {fraldas.map((f: any, i: number) => (
            <li key={i} className="py-1">
              <span className="font-mono text-yellow-900 bg-yellow-100 px-2 py-1 rounded mr-2">
                {f.time || f.hora}
              </span>
              <span className="font-semibold">{f.type || f.tipo}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
