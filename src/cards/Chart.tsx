import React, { useState, useEffect } from "react";
import { Card, Title, Button, Divider, AreaChart } from "@tremor/react";
import { getDay, getSettings } from "../support/data";

interface ChartProps {
  update?: number;
  goal: number;
}

export default function Chart({ update = 0, goal }: ChartProps) {
  const [milks, setMilks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const today = getDay();
    setMilks([...today.data]);
    setTotal(today.data.reduce((acc: number, d: any) => acc + (d?.v ?? 0), 0));
  }, [update, localStorage.getItem("dataset")]);

  let acumulado = 0;
  const chartData = milks.map((milk, i) => {
    acumulado += milk.v ?? 0;
    return {
      name: milk.t || `Reg ${i + 1}`,
      "Leite Acumulado": acumulado,
      Objetivo: goal,
    };
  });

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Card marginTop="mt-8" shadow>
      <div className="mt-4">
        <div>Meta diária: {goal} ml</div>
        <div>Total ingerido: {total} ml</div>
        <AreaChart
          data={chartData}
          categories={["Objetivo", "Leite Acumulado"]}
          dataKey="name"
          colors={["sky", "orange"]}
          valueFormatter={(v) => `${v} ml`}
          yAxisWidth="w-16"
        />
        <Divider />
        <div className="flex justify-center mt-4">
          <Button
            text="Resetar Informações"
            color="blue"
            onClick={handleReset}
          />
        </div>
      </div>
    </Card>
  );
}
