import React, { useState, FormEvent, ChangeEvent } from "react";
import { Title, Flex, Button } from "@tremor/react";
import DiaperList from "./DiaperList";
import { getDataSet } from "../support/data";
import { formatDateString } from "../support/helpers";
import type { Day, DateString } from "../support/types";

interface DiaperSectionProps {
  onUpdate?: () => void;
}

export default function DiaperSection({ onUpdate }: DiaperSectionProps) {
  const [diaperType, setDiaperType] = useState("");
  const [, setRefresh] = useState(0);

  function addDiaper(e: FormEvent) {
    e.preventDefault();
    const dataset = getDataSet();
    const date: DateString = formatDateString(new Date()) as DateString;

    let day = dataset.find((d: Day) => d.date === date);
    if (!day) {
      day = { date, data: [], meds: [], diapers: [] };
      dataset.push(day);
    }
    if (!Array.isArray(day.diapers)) day.diapers = [];

    day.diapers.push({
      type: diaperType,
      time: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      date,
    });

    localStorage.setItem("dataset", JSON.stringify(dataset));
    setDiaperType("");
    onUpdate?.();
    setRefresh((r) => r + 1);
  }

  function removeDiaper(index: number) {
    const dataset = getDataSet();
    const date: DateString = formatDateString(new Date()) as DateString;
    const day = dataset.find((d: Day) => d.date === date);
    if (!day || !Array.isArray(day.diapers)) return;

    day.diapers.splice(index, 1);
    localStorage.setItem("dataset", JSON.stringify(dataset));
    onUpdate?.();
    setRefresh((r) => r + 1);
  }

  const today: Day =
    getDataSet().find((d: Day) => d.date === formatDateString(new Date())) ??
    ({
      date: formatDateString(new Date()) as DateString,
      data: [],
      meds: [],
      diapers: [],
    } as Day);

  return (
    <>
      <Title marginTop="mt-6">👶 Adicionar Fralda</Title>
      <form onSubmit={addDiaper} className="my-4 flex flex-col gap-2">
        <select
          name="diaperType"
          value={diaperType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setDiaperType(e.currentTarget.value)
          }
          className="p-2 border rounded"
          required
        >
          <option value="">Selecione o tipo</option>
          <option value="Mijinha">Mijinha</option>
          <option value="Cocô">Cocô</option>
          <option value="Mista">Mista</option>
        </select>

        <Flex justifyContent="justify-center" marginTop="mt-2">
          <Button text="Adicionar" type="submit" disabled={!diaperType} />
        </Flex>
      </form>

      <DiaperList diapers={today.diapers ?? []} onRemove={removeDiaper} />
    </>
  );
}
