import React, { useState, useEffect } from "react";
import { Card, Title, Button, Divider, AreaChart } from "@tremor/react";
import { getMilks } from "../services/db";

interface ChartProps {
  update?: number;
  goal: number;
}

export default function Chart({ update = 0, goal }: ChartProps) {
  const [milks, setMilks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://control-milk-api.onrender.com"
      : "http://localhost:3001";

  useEffect(() => {
    async function fetchData() {
      const data = await getMilks();
      setMilks(data);
      setTotal(
        data.reduce((acc: number, d: any) => acc + (d?.quantidade ?? 0), 0)
      );
    }
    fetchData();
  }, [update]);

  let acumulado = 0;
  const chartData = milks.map((milk, i) => {
    acumulado += milk.quantidade ?? 0;
    return {
      name: milk.hora || `Reg ${i + 1}`,
      Ingerido: acumulado,
      Objetivo: goal,
    };
  });

  const handleReset = async () => {
    const endpoints = ["milks", "diapers", "medicines"];

    for (const endpoint of endpoints) {
      const response = await fetch(`${API_URL}/${endpoint}`);
      const items = await response.json();

      for (const item of items) {
        await fetch(`${API_URL}/${endpoint}/${item.id}`, { method: "DELETE" });
      }
    }

    window.location.reload();
  };

  return (
    <Card marginTop="mt-8" shadow>
      <Title>📈 Gráfico de Leite</Title>

      <div className="mt-4">
        <div>Meta diária: {goal} ml</div>
        <div>Total ingerido: {total} ml</div>

        <AreaChart
          data={chartData}
          categories={["Objetivo", "Ingerido"]}
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
