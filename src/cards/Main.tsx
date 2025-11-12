import React from "react";
import { Card, Title } from "@tremor/react";
import type { Med, Registro } from "../support/types";

import MilkControl from "./MilkControl";
import MedicineSection from "./MedicineSection";
import DiaperSection from "./DiaperSection";

interface MainProps {
  update?: number;
  onUpdate?: () => void;
  onAction?: (type: any, payload?: any) => void;
  dailyGoal?: number;
  setDailyGoal?: React.Dispatch<React.SetStateAction<number>>;

  meds?: Med[];
  registros?: Registro[];
  onAddMed?: (med: Med) => void;
  onAddRegistro?: (reg: Registro) => void;
}

export default function Main({
  update,
  onUpdate,
  onAction,
  dailyGoal = 150,
  setDailyGoal,
  meds,
  registros,
  onAddMed,
  onAddRegistro,
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
