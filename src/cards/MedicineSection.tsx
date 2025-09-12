import React, { useState, FormEvent, ChangeEvent } from "react";
import { Title, Flex, Button } from "@tremor/react";
import MedicineList from "./MedicineList";
import { getDataSet } from "../support/data";
import { formatDateString } from "../support/helpers";
import type { Day, DateString } from "../support/types";

interface MedicineSectionProps {
  onUpdate?: () => void;
}

export default function MedicineSection({ onUpdate }: MedicineSectionProps) {
  const [wait, setWait] = useState(false);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [, setRefresh] = useState(0);

  function addMed(e: FormEvent) {
    e.preventDefault();
    const dataset = getDataSet();
    const date: DateString = formatDateString(new Date()) as DateString;

    let day = dataset.find((d: Day) => d.date === date);
    if (!day) {
      day = { date, data: [], meds: [], diapers: [] };
      dataset.push(day);
    }
    if (!Array.isArray(day.meds)) day.meds = [];

    day.meds.push({
      name: medName.trim(),
      dose: medDose.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date,
    });

    localStorage.setItem("dataset", JSON.stringify(dataset));
    setMedName("");
    setMedDose("");
    onUpdate?.();
    setRefresh((r) => r + 1);
  }

  function removeMed(index: number) {
    try {
      const dataset = getDataSet();
      const date: DateString = formatDateString(new Date()) as DateString;
      const day = dataset.find((d: Day) => d.date === date);
      if (!day || !Array.isArray(day.meds)) return;
      if (index < 0 || index >= day.meds.length) return;

      day.meds.splice(index, 1);
      localStorage.setItem("dataset", JSON.stringify(dataset));
      onUpdate?.();
      setRefresh((r) => r + 1);
    } catch (err) {
      console.error("Erro ao remover med:", err);
    }
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
      <Title marginTop="mt-6">💊 Adicionar Remédio</Title>
      <form onSubmit={addMed} className="my-4 flex flex-col gap-2">
        <select
          name="medName"
          value={medName}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setMedName(e.currentTarget.value)
          }
          className="p-2 border rounded"
          disabled={wait}
          required
        >
          <option value="">Selecione o Remédio</option>
          <option value="Paracetamol">Paracetamol</option>
          <option value="Ibuprofeno">Ibuprofeno</option>
          <option value="Simeticona">Simeticona</option>
          <option value="Vitamina C">Vitamina C</option>
          <option value="Outros">Outros</option>
        </select>

        <select
          name="medDose"
          value={medDose}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setMedDose(e.currentTarget.value)
          }
          className="p-2 border rounded"
          disabled={wait}
          required
        >
          <option value="">Selecione as gotas</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={`${i + 1} gota(s)`}>
              {i + 1} gota{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <Flex justifyContent="justify-center" marginTop="mt-2">
          <Button
            text="Adicionar"
            type="submit"
            disabled={wait || !medName || !medDose}
          />
        </Flex>
      </form>

      <MedicineList meds={today.meds ?? []} onRemove={removeMed} />
    </>
  );
}
