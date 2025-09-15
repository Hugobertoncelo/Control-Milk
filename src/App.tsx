import { useEffect, useState } from "react";
import { Main, Data, Chart } from "./cards";
import { Card, ColGrid, Title, Text } from "@tremor/react";
import Modals from "./modals";
import Footer from "./Footer";
import type { ActionData } from "./support/types";
import {
  ouvirMetaDiaria,
  ouvirDia,
  atualizarDia,
  Dia,
  Med,
  Registro,
} from "./services/db";
import { getTodayDate } from "./support/helpers";

export default function App() {
  const classSection = "bg-blue-100 m-0 px-6 sm:px-12 md:px-18 lg:px-24";

  const [update, setUpdate] = useState<number>(0);
  const [action, setAction] = useState<ActionData>();
  const [dailyGoalValue, setDailyGoalValue] = useState<number>(600);
  const [today, setToday] = useState<Dia>({ meds: [], data: [] });

  const todayDate = getTodayDate();

  useEffect(() => {
    const unsub = ouvirMetaDiaria((valor) => setDailyGoalValue(valor));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = ouvirDia(todayDate, (dia) => setToday(dia));
    return () => unsub();
  }, [todayDate]);

  function handleAddMed(med: Med) {
    atualizarDia(todayDate, { meds: [...today.meds, med] });
  }

  function handleAddRegistro(reg: Registro) {
    atualizarDia(todayDate, { data: [...today.data, reg] });
  }

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
              meds={today.meds}
              registros={today.data}
              onAddMed={handleAddMed}
              onAddRegistro={handleAddRegistro}
              onUpdate={() => setUpdate((update) => update + 1)}
              onAction={(type, payload) => setAction({ type, payload })}
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
