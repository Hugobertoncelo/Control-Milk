import React, { useEffect, useState } from "react";
import { Main, Data, Chart } from "./cards";
import { Card, ColGrid, Title, Text } from "@tremor/react";
import Modals from "./modals";
import Footer from "./Footer";

export default function App() {
  const classSection = "bg-blue-100 m-0 px-6 sm:px-12 md:px-18 lg:px-24";
  const [update, setUpdate] = useState<number>(0);
  const [dailyGoalValue, setDailyGoalValue] = useState<number>(600);

  useEffect(() => {
    const settings = localStorage.getItem("settings");
    let meta = 600;
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        if (parsed.goal) meta = parsed.goal;
      } catch {}
    }
    setDailyGoalValue(meta);
  }, []);

  return (
    <>
      <header
        className={classSection + " flex flex-col items-center text-center"}
      >
        <img
          className="m-4"
          src="./logo192.png"
          title="control-milk"
          alt="control-milk"
          width={64}
          height={64}
        />
        <Title>Hora do Leite</Title>
        <Text>Gestão diária de ingestão de Leite e controle de Remédios</Text>
      </header>
      <main className={classSection}>
        <ColGrid numColsMd={2} gapX="gap-x-8" gapY="gap-y-8" marginTop="mt-8">
          <Card shadow>
            <Main
              update={update}
              dailyGoal={dailyGoalValue}
              setDailyGoal={setDailyGoalValue}
              onUpdate={() => setUpdate((update) => update + 1)}
            />
          </Card>
          <Card shadow>
            <Data update={update} />
          </Card>
        </ColGrid>
        <Card marginTop="mt-8" shadow>
          <Chart update={update} goal={dailyGoalValue} />
        </Card>
      </main>
      <Footer />
      <Modals />
    </>
  );
}
