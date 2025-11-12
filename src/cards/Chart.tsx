import React, { useState, useEffect } from "react";
import { Card, Title, Button, Divider } from "@tremor/react";
import { AreaChart } from "@tremor/react";
import { getMilks } from "../services/db";

interface ChartProps {
  update?: number;
  goal: number;
}

export default function Chart({ update = 0, goal }: ChartProps) {
  const [milks, setMilks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

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

  // Gera dados acumulados para o gráfico
  let acumulado = 0;
  const chartData = milks.map((milk, i) => {
    acumulado += milk.quantidade ?? 0;
    return {
      name: milk.hora || `Reg ${i + 1}`,
      Ingerido: acumulado,
      Objetivo: goal,
    };
  });

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
            onClick={async () => {
              const milks = await getMilks();
              for (const milk of milks) {
                await fetch(`http://localhost:3001/milks/${milk.id}`, {
                  method: "DELETE",
                });
              }
              const diapers = await fetch("http://localhost:3001/diapers").then(
                (r) => r.json()
              );
              for (const diaper of diapers) {
                await fetch(`http://localhost:3001/diapers/${diaper.id}`, {
                  method: "DELETE",
                });
              }
              const medicines = await fetch(
                "http://localhost:3001/medicines"
              ).then((r) => r.json());
              for (const med of medicines) {
                await fetch(`http://localhost:3001/medicines/${med.id}`, {
                  method: "DELETE",
                });
              }
              window.location.reload();
            }}
          />
        </div>
      </div>
    </Card>
  );
}
