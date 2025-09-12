import React from "react";
import { Card, Title } from "@tremor/react";

import MilkControl from "./MilkControl";
import MedicineSection from "./MedicineSection";
import DiaperSection from "./DiaperSection";

interface MainProps {
  update?: number;
  onUpdate?: () => void;
  onAction?: (type: any, payload?: any) => void;
  dailyGoal?: number;
  setDailyGoal?: React.Dispatch<React.SetStateAction<number>>;
}

export default function Main({
  update,
  onUpdate,
  onAction,
  dailyGoal = 150,
  setDailyGoal,
}: MainProps) {
  return (
    <Card shadow>
      <Title>💧 Controle de Leite</Title>

      <MilkControl
        dailyGoal={dailyGoal}
        setDailyGoal={setDailyGoal}
        onUpdate={onUpdate}
      />

      <MedicineSection onUpdate={onUpdate} />

      <DiaperSection onUpdate={onUpdate} />
    </Card>
  );
}
