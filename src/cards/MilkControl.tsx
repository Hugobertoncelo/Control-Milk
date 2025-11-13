import React, { useState, useEffect, ChangeEvent } from "react";
import {
  TextInput,
  Flex,
  Button,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";
import { getDay, insert, getSettings, saveSettings } from "../support/data";

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
  const [goalInput, setGoalInput] = useState(dailyGoal?.toString() ?? "");

  useEffect(() => {
    async function fetchTotal() {
      try {
        const today = await getDay();
        if (!today || !Array.isArray(today.data)) {
          setTotalMl(0);
        } else {
          const total = today.data.reduce((acc, d) => acc + (d?.v ?? 0), 0);
          setTotalMl(total);
        }
      } catch (e) {
        setTotalMl(0);
      }
    }
    fetchTotal();
  }, [wait, onUpdate]);

  useEffect(() => {
    setGoalInput(dailyGoal === 0 ? "" : dailyGoal?.toString() ?? "");
  }, [dailyGoal]);

  const progress = Math.min((totalMl / dailyGoal) * 100, 100);

  async function handleAddMl(value: number) {
    if (value <= 0) return;
    setWait(true);
    try {
      await insert(value);
    } catch (e) {}
    setCustomMl("");
    setWait(false);
    onUpdate?.();
  }

  return (
    <>
      {/* Meta diária */}
      <Flex justifyContent="justify-start" spaceX="space-x-2" marginTop="mt-4">
        <input
          type="text"
          placeholder="Meta diária (ml)"
          className="border rounded px-3 py-2 max-w-xs text-center text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={goalInput}
          onChange={(e) => {
            const value = e.currentTarget.value.replace(/\D/g, "");
            setGoalInput(value);
          }}
          onBlur={async () => {
            if (goalInput === "") {
              setGoalInput(dailyGoal?.toString() ?? "600");
              setDailyGoal?.(dailyGoal || 600);
              await saveSettings({ goal: dailyGoal || 600 });
              return;
            }
            const num = Number(goalInput);
            setDailyGoal?.(num);
            await saveSettings({ goal: num });
          }}
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
