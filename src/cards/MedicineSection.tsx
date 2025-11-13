import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Title, Flex, Button } from "@tremor/react";
import { addMed, getDay, removeMed } from "../support/data";
import { formatDateString } from "../support/helpers";
import MedicineList from "./MedicineList";

interface MedicineSectionProps {
  onUpdate?: () => void;
}

export default function MedicineSection({ onUpdate }: MedicineSectionProps) {
  const [wait, setWait] = useState(false);
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [meds, setMeds] = useState<any[]>([]);

  useEffect(() => {
    async function fetchToday() {
      const today = await getDay();
      setMeds(today.meds || []);
    }
    fetchToday();
  }, [wait, onUpdate]);

  async function addMedLocal(e: FormEvent) {
    e.preventDefault();
    setWait(true);
    await addMed({
      name: medName.trim(),
      dose: medDose,
      date: formatDateString(new Date()),
    });
    setMedName("");
    setMedDose("");
    setWait(false);
    onUpdate?.();
  }

  async function handleRemove(index: number) {
    setWait(true);
    const today = await getDay();
    await removeMed(index, today.date);
    const updated = await getDay(today.date);
    setMeds(updated.meds || []);
    setWait(false);
    onUpdate?.();
  }

  return (
    <>
      <Title marginTop="mt-6">💊 Adicionar Remédio</Title>
      <form onSubmit={addMedLocal} className="my-4 flex flex-col gap-2">
        <select
          name="medName"
          value={medName}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setMedName(e.currentTarget.value)
          }
          className="p-2 border rounded"
          disabled={wait}
          required
        >
          <option value="">Selecione o Remédio</option>
          <option value="Paracetamol">Paracetamol</option>
          <option value="Ibuprofeno">Ibuprofeno</option>
          <option value="Simeticona">Simeticona</option>
          <option value="Vitamina C">Vitamina C</option>
          <option value="Outros">Outros</option>
        </select>
        <select
          name="medDose"
          value={medDose}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setMedDose(e.currentTarget.value)
          }
          className="p-2 border rounded"
          disabled={wait}
          required
        >
          <option value="">Selecione as gotas</option>
          {[...Array(10)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} gota{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
        <Flex justifyContent="justify-center" marginTop="mt-2">
          <Button
            text="Adicionar"
            type="submit"
            disabled={wait || !medName || !medDose}
          />
        </Flex>
      </form>
      <MedicineList meds={meds} onRemove={handleRemove} />
    </>
  );
}
