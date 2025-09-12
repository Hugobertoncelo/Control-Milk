import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  Title,
  TextInput,
  Flex,
  Button,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";

import MedicineList from "./MedicineList";
import DiaperList from "./DiaperList";
import { getDay, getDataSet, insert } from "../support/data";
import { formatDateString } from "../support/helpers";
import type { Day, Insertion, Med, Diaper, DateString } from "../support/types";

interface MainProps {
  update?: number;
  onUpdate?: () => void;
  onAction?: (type: any, payload?: any) => void;
  dailyGoal?: number;
  setDailyGoal?: React.Dispatch<React.SetStateAction<number>>;
}

export default function Main({
  update,
  onUpdate,
  onAction,
  dailyGoal = 150,
  setDailyGoal,
}: MainProps) {
  const [wait, setWait] = useState(false);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [customMl, setCustomMl] = useState("");
  const [diaperType, setDiaperType] = useState("");
  const [, setRefresh] = useState(0);

  const today: Day = getDay();

  const totalMl = (today.data ?? []).reduce(
    (acc: number, d: Insertion) => acc + (d?.v ?? 0),
    0
  );

  const progress = Math.min((totalMl / dailyGoal) * 100, 100);

  // Função para adicionar leite
  function handleAddMl(value: number) {
    if (value <= 0) return;
    setWait(true);
    try {
      insert(value);
      onUpdate?.();
      setCustomMl("");
      setRefresh((r) => r + 1);
    } finally {
      setTimeout(() => setWait(false), 300);
    }
  }

  // Função para adicionar remédio
  function addMed(e: FormEvent) {
    e.preventDefault();
    const dataset = getDataSet();
    const date: DateString = formatDateString(new Date()) as DateString;

    let day = dataset.find((d: Day) => d.date === date);
    if (!day) {
      day = {
        date,
        data: [],
        meds: [],
        diapers: [],
      };
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

  // Função para remover remédio
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

  // Função para adicionar fralda
  function addDiaper(e: FormEvent) {
    e.preventDefault();
    const dataset = getDataSet();
    const date: DateString = formatDateString(new Date()) as DateString;

    let day = dataset.find((d: Day) => d.date === date);
    if (!day) {
      day = {
        date,
        data: [],
        meds: [],
        diapers: [],
      };
      dataset.push(day);
    }
    if (!Array.isArray(day.diapers)) day.diapers = [];

    day.diapers.push({
      type: diaperType,
      time: new Date().toLocaleTimeString("pt-BR", {
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

  // Função para remover fralda
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

  return (
    <Card shadow>
      <Title>💧 Controle de Leite</Title>

      {/* Meta diária */}
      <Flex justifyContent="justify-start" spaceX="space-x-2" marginTop="mt-4">
        <TextInput
          placeholder="Meta diária (ml)"
          value={dailyGoal.toString()}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.currentTarget.value.replace(/\D/g, ""));
            setDailyGoal?.(value);
          }}
          maxWidth="max-w-xs"
        />
      </Flex>

      {/* Total de leite */}
      <Flex
        justifyContent="justify-between"
        alignItems="items-center"
        marginTop="mt-4"
      >
        <Metric>{totalMl} ml</Metric>
        <Text color="gray">Meta: {dailyGoal} ml</Text>
      </Flex>

      <div className="mt-2">
        <ProgressBar percentageValue={progress} color="blue" />
      </div>

      {/* Adicionar leite */}
      <Flex justifyContent="justify-start" spaceX="space-x-2" marginTop="mt-4">
        <TextInput
          placeholder="Digite ml"
          value={customMl}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCustomMl(e.currentTarget.value.replace(/\D/g, ""))
          }
          maxWidth="max-w-xs"
          disabled={wait}
        />
        <Button
          text="Adicionar"
          onClick={() => handleAddMl(Number(customMl))}
          disabled={wait || !customMl || Number(customMl) <= 0}
        />
      </Flex>

      {/* Seção Remédios */}
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

      {/* Lista de Remédios */}
      <MedicineList meds={today.meds ?? []} onRemove={removeMed} />

      {/* Seção Fraldas */}
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

      {/* Lista de Fraldas */}
      <DiaperList diapers={today.diapers ?? []} onRemove={removeDiaper} />
    </Card>
  );
}
