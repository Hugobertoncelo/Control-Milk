import React, { useState, useEffect } from "react";
import { Card, Title, Button, Divider } from "@tremor/react";
import { AreaChart } from "@tremor/react";
import { getMilks, getFraldas, getMedicines } from "../services/db";

interface ChartProps {
  update?: number;
  goal: number;
}

const API_URL = process.env.REACT_APP_API_URL;

export default function Chart({ update = 0, goal }: ChartProps) {
  const [milks, setMilks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMilks();
        setMilks(data);
        setTotal(
          data.reduce((acc: number, d: any) => acc + (d?.quantidade ?? 0), 0)
        );
      } catch (err) {
        console.error("Erro ao carregar leite:", err);
      }
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

  async function resetData() {
    try {
      const [allMilks, allDiapers, allMeds] = await Promise.all([
        getMilks(),
        getFraldas(),
        getMedicines(),
      ]);

      const deleteAll = async (items: any[], endpoint: string) => {
        for (const item of items) {
          const res = await fetch(`${API_URL}/${endpoint}/${item.id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            console.warn(`Falha ao deletar ${endpoint} id=${item.id}`);
          }
        }
      };

      await Promise.all([
        deleteAll(allMilks, "milks"),
        deleteAll(allDiapers, "diapers"),
        deleteAll(allMeds, "medicines"),
      ]);

      window.location.reload();
    } catch (err) {
      console.error("Erro ao resetar dados:", err);
    }
  }

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
          <Button text="Resetar Informações" color="blue" onClick={resetData} />
        </div>
      </div>
    </Card>
  );
}
