import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  Title,
  Text,
  TextInput,
  Flex,
  Button,
  Metric,
  ProgressBar,
} from "@tremor/react";

import { getDay, getDataSet, insert } from "../support/data";
import { formatDateString } from "../support/helpers";
import type { Day, Insertion, Med } from "../support/types";

interface MainProps {
  update?: number;
  onUpdate?: () => void;
  onAction?: (type: any, payload?: any) => void;
  dailyGoal?: number; // meta diária
  setDailyGoal?: React.Dispatch<React.SetStateAction<number>>; // função para atualizar a meta
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

  const today: Day = getDay();

  const totalMl = (today.data ?? []).reduce(
    (acc: number, d: Insertion) => acc + (d?.v ?? 0),
    0
  );

  // calcula o progresso da meta
  const progress = Math.min((totalMl / dailyGoal) * 100, 100);

  function handleAddMl(value: number) {
    if (value <= 0) return;
    setWait(true);
    try {
      insert(value);
      onUpdate?.();
      setCustomMl("");
    } finally {
      setTimeout(() => setWait(false), 300);
    }
  }

  function addMed(e: FormEvent) {
    e.preventDefault();
    const dataset = getDataSet();
    const date: string = formatDateString(new Date());
    let day = dataset.find((d: Day) => d.date === date);
    if (!day) {
      day = {
        date: date as `${number}-${number}-${number}`,
        data: [],
        meds: [],
      };
      dataset.push(day);
    }
    if (!Array.isArray(day.meds)) day.meds = [];
    day.meds.push({
      name: medName.trim(),
      dose: medDose.trim(),
      time: new Date().toLocaleTimeString().slice(0, 5),
    });
    localStorage.setItem("dataset", JSON.stringify(dataset));
    setMedName("");
    setMedDose("");
    onUpdate?.();
  }

  function removeMed(index: number) {
    const dataset = getDataSet();
    const date: string = formatDateString(new Date());
    const day = dataset.find((d: Day) => d.date === date);
    if (!day || !Array.isArray(day.meds)) return;
    day.meds.splice(index, 1);
    localStorage.setItem("dataset", JSON.stringify(dataset));
    onUpdate?.();
  }

  return (
    <>
      <Title>💧 Controle de Leite</Title>

      {/* Input para meta diária */}
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

      {/* Total ml + Meta */}
      <Flex
        justifyContent="justify-between"
        alignItems="items-center"
        marginTop="mt-4"
      >
        <Metric>{totalMl} ml</Metric>
        <Text color="gray">Meta: {dailyGoal} ml</Text>
      </Flex>

      {/* Barra de progresso */}
      <div className="mt-2">
        <ProgressBar percentageValue={progress} color="blue" />
      </div>

      {/* Input para adicionar ml */}
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

      {/* Controle de remédios */}
      <Title marginTop="mt-6">💊 Controle de Remédios</Title>
      <form onSubmit={addMed} className="my-4 p-4 bg-blue-50 rounded">
        <select
          name="medName"
          value={medName}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setMedName(e.currentTarget.value)
          }
          className="w-full p-2 border rounded"
          disabled={wait}
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
          className="w-full p-2 border rounded mt-2"
          disabled={wait}
        >
          <option value="">Selecione as Gotas</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={`${i + 1} gota(s)`}>
              {i + 1} gota{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>

        <Flex justifyContent="justify-center" marginTop="mt-4">
          <Button
            text="Adicionar"
            type="submit"
            disabled={wait || !medName || !medDose}
          />
        </Flex>
      </form>

      {/* Lista de remédios */}
      <div className="mt-4 space-y-2">
        {Array.isArray(today.meds) && today.meds.length > 0 ? (
          today.meds.map((m: Med, i: number) => (
            <div
              key={i}
              className="p-3 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <strong>{m.name}</strong> — {m.dose}
              </div>
              <Flex spaceX="space-x-2" alignItems="items-center">
                <span className="text-sm text-gray-500">{m.time}</span>
                <Button
                  text="X"
                  color="red"
                  size="xs"
                  onClick={() => removeMed(i)}
                />
              </Flex>
            </div>
          ))
        ) : (
          <Text color="gray">Nenhum remédio adicionado hoje.</Text>
        )}
      </div>
    </>
  );
}
