import type { CardProps, DataSet } from "../support/types";

import { useState, useEffect } from "react";

import {
  AreaChart,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  Flex,
} from "@tremor/react";

import { dayWeek, sum } from "../support/helpers";

import {
  getDataSet,
  getFillDataSet,
  getSettings,
  resetDataSet,
  saveSettings,
} from "../support/data";

import { GrLineChart } from "react-icons/gr";

interface ChartProps extends CardProps {
  goal: number; // meta diária dinâmica
}

export default function Chart({
  goal,
  update = 0,
  onUpdate = () => {},
  onAction = () => {},
}: ChartProps) {
  // pega o valor inicial do chart (quantos dias mostrar)
  const { chart } = getSettings();

  const [days, setDays] = useState<number>(chart);
  const [data, setData] = useState<DataSet>([]);

  useEffect(() => {
    // preenche os dados do gráfico
    setData(days > 0 ? getFillDataSet(days) : getDataSet());
    saveSettings({ chart: days }); // salva a quantidade de dias no settings
  }, [days, update]);

  function reset() {
    onAction("confirm", {
      content: "Tem certeza que deseja apagar todas as informações?",
      onConfirm: () => {
        resetDataSet();
        onUpdate();
      },
    });
  }

  return (
    <>
      {/* Dropdown para selecionar quantidade de dias */}
      <Dropdown defaultValue={days} handleSelect={setDays} icon={GrLineChart}>
        <DropdownItem text="Últimos três dias" value={3} />
        <DropdownItem text="Últimos sete dias" value={7} />
        <DropdownItem text="Últimos quinze dias" value={15} />
        <DropdownItem text="Últimos trinta dias" value={30} />
        <DropdownItem text="Dias com informação" value={-1} />
      </Dropdown>

      {/* Gráfico de Área */}
      <AreaChart
        marginTop="mt-4"
        categories={["Objetivo", "Ingerido"]}
        colors={["sky", "orange"]}
        dataKey="dayweek"
        data={data.map((day) => ({
          dayweek:
            data.length < 10
              ? dayWeek(day.date).substring(0, 3)
              : day.date.replace(/^.*?(\d{1,2}$)/, "$1"),
          Objetivo: goal, // usa a meta dinâmica
          Ingerido: sum(day),
        }))}
        valueFormatter={(v) => `${v.toLocaleString()} ml`}
      />

      <Divider />

      <Flex justifyContent="justify-center" marginTop="mt-4">
        <Button text="Resetar Informações" onClick={reset} />
      </Flex>
    </>
  );
}
