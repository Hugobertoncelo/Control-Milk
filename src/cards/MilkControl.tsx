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
  getMilks,
  addMilk,
  getMetaDiaria,
  salvarMetaDiaria,
} from "../services/db";

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
    async function fetchData() {
      const milks = await getMilks();
      const total = milks.reduce(
        (acc: number, d: any) => acc + (d?.quantidade ?? 0),
        0
      );
      setTotalMl(total);
    }
    fetchData();
  }, [wait, onUpdate]);

  const progress = Math.min((totalMl / dailyGoal) * 100, 100);

  async function handleAddMl(value: number) {
    if (value <= 0) return;
    setWait(true);
    await addMilk({
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      quantidade: value,
      date: new Date().toISOString().slice(0, 10),
    });
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
          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.currentTarget.value.replace(/\D/g, ""));
            setDailyGoal?.(value);
            await salvarMetaDiaria(value);
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
