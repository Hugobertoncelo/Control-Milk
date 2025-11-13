import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Title, Flex, Button } from "@tremor/react";
import DiaperList from "./DiaperList";
import { addDiaper, getDay, removeDiaper } from "../support/data";
import { formatDateString } from "../support/helpers";

interface DiaperSectionProps {
  onUpdate?: () => void;
}

export default function DiaperSection({ onUpdate }: DiaperSectionProps) {
  const [diaperType, setDiaperType] = useState("");
  const [diapers, setDiapers] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchToday() {
      const today = await getDay();
      setDiapers(today.diapers || []);
    }
    fetchToday();
  }, [refresh]);

  async function addDiaperForm(e: FormEvent) {
    e.preventDefault();
    await addDiaper({
      type: diaperType,
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: formatDateString(new Date()),
    });
    setDiaperType("");
    setRefresh((r) => r + 1);
    onUpdate?.();
  }

  async function handleRemove(index: number) {
    await removeDiaper(index);
    setRefresh((r) => r + 1);
    onUpdate?.();
  }

  return (
    <>
      <Title marginTop="mt-6">👶 Adicionar Fralda</Title>
      <form onSubmit={addDiaperForm} className="my-4 flex flex-col gap-2">
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
      <DiaperList
        diapers={diapers.map((d, i) => ({
          id: i.toString(),
          hora: d.time,
          tipo: d.type,
          date: d.date,
        }))}
        onRemove={(id) => handleRemove(Number(id))}
      />
    </>
  );
}
