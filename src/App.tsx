import type { ActionData } from "./support/types";
import { Card, Title, Text, ColGrid } from "@tremor/react";
import { Main, Data, Chart } from "./cards";
import { useState, useEffect } from "react";
import Modals from "./modals";
import Footer from "./Footer";
import MedicineList from "./cards/MedicineList";
import { getDay, getDataSet } from "./support/data";

export default function Dashboard() {
  const classSection = "bg-blue-100 m-0 px-6 sm:px-12 md:px-18 lg:px-24";

  const [update, setUpdate] = useState<number>(0);
  const [action, setAction] = useState<ActionData>();
  const [dailyGoalValue, setDailyGoalValue] = useState<number>(600);
  const [todayMeds, setTodayMeds] = useState(getDay().meds ?? []);

  useEffect(() => {
    setTodayMeds(getDay().meds ?? []);
  }, [update]);

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
              onUpdate={() => setUpdate((update) => update + 1)}
              onAction={(type, payload) => setAction({ type, payload })}
              setDailyGoal={setDailyGoalValue}
            />
          </Card>

          <Card shadow>
            <Data
              update={update}
              onUpdate={() => setUpdate((update) => update + 1)}
              onAction={(type, payload) => setAction({ type, payload })}
            />
          </Card>
        </ColGrid>

        <Card marginTop="mt-8" shadow>
          <Chart
            update={update}
            goal={dailyGoalValue}
            onUpdate={() => setUpdate((update) => update + 1)}
            onAction={(type, payload) => setAction({ type, payload })}
          />
        </Card>
      </main>

      <Footer />
      <Modals action={action} />
    </>
  );
}
