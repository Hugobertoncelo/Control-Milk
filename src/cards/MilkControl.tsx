import React, { useState, ChangeEvent } from "react";
import {
  TextInput,
  Flex,
  Button,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";
import { getDay, insert } from "../support/data";
import type { Day, Insertion } from "../support/types";
import { salvarMetaDiaria } from "../services/db";

interface MilkControlProps {
  dailyGoal: number;
  setDailyGoal?: React.Dispatch<React.SetStateAction<number>>;
  onUpdate?: () => void;
}

export default function MilkControl({
  dailyGoal,
  setDailyGoal,
  onUpdate,
}: MilkControlProps) {
  const [wait, setWait] = useState(false);
  const [customMl, setCustomMl] = useState("");
  const [, setRefresh] = useState(0);

  const today: Day = getDay();
  const totalMl = (today.data ?? []).reduce(
    (acc: number, d: Insertion) => acc + (d?.v ?? 0),
    0
  );

  const progress = Math.min((totalMl / dailyGoal) * 100, 100);

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

  return (
    <>
      {/* Meta diária */}
      <Flex justifyContent="justify-start" spaceX="space-x-2" marginTop="mt-4">
        <TextInput
          placeholder="Meta diária (ml)"
          value={dailyGoal.toString()}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.currentTarget.value.replace(/\D/g, ""));
            setDailyGoal?.(value);
            salvarMetaDiaria(value);
          }}
          maxWidth="max-w-xs"
        />
      </Flex>

      {/* Total */}
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
    </>
  );
}
