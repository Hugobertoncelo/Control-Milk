import React, { useState, useEffect, ChangeEvent } from "react";
import {
  TextInput,
  Flex,
  Button,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";
import {
  getDay,
  insert,
  getSettings,
  saveSettings,
} from "../support/data";

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
  const [totalMl, setTotalMl] = useState(0);

  useEffect(() => {
    const today = getDay();
    const total = today.data.reduce((acc, d) => acc + (d?.v ?? 0), 0);
    setTotalMl(total);
  }, [wait, onUpdate]);

  const progress = Math.min((totalMl / dailyGoal) * 100, 100);

  function handleAddMl(value: number) {
    if (value <= 0) return;
    setWait(true);
    insert(value);
    setCustomMl("");
    setWait(false);
    onUpdate?.();
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
            saveSettings({ goal: value });
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
