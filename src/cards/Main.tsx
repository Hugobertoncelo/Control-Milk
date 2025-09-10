import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  Title,
  Text,
  TextInput,
  Flex,
  Button,
  Metric,
} from "@tremor/react";

import { getDay, getDataSet, insert } from "../support/data";
import { formatDateString } from "../support/helpers";
import type { Day, Insertion, Med } from "../support/types";

export default function MainCard({
  update,
  onUpdate,
  onAction,
}: {
  update?: number;
  onUpdate?: () => void;
  onAction?: (type: any, payload?: any) => void;
}) {
  const [wait, setWait] = useState(false);

  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");

  const [customMl, setCustomMl] = useState("");

  const today: Day = getDay();

  const totalMl = (today.data ?? []).reduce(
    (acc: number, d: Insertion) => acc + (d?.v ?? 0),
    0
  );

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
    <Card>
      <Title>💧 Controle de Leite</Title>

      <Metric>{totalMl} ml</Metric>

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

      <Title marginTop="mt-6">💊 Controle de Remédios</Title>

      <form onSubmit={addMed} className="my-4 p-4 bg-green-50 rounded">
        <TextInput
          name="medName"
          value={medName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMedName(e.currentTarget.value)
          }
          placeholder="Nome do remédio"
          maxWidth="max-w-none"
          disabled={wait}
        />

        <TextInput
          name="medDose"
          value={medDose}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMedDose(e.currentTarget.value)
          }
          placeholder="Dose / Horário..."
          maxWidth="max-w-none"
          disabled={wait}
          marginTop="mt-2"
        />

        <Flex justifyContent="justify-center" marginTop="mt-4">
          <Button text="Adicionar" type="submit" disabled={wait} />
        </Flex>
      </form>

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
          <Text>Nenhum remédio adicionado hoje.</Text>
        )}
      </div>
    </Card>
  );
}
