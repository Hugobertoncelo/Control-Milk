import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Title, Flex, Button } from "@tremor/react";
import DiaperList from "./DiaperList";

const API_URL =
  process.env.REACT_APP_API_URL || "https://control-milk-api.onrender.com/";

interface Diaper {
  id: string;
  hora: string;
  quantidade: number;
  date: string;
  tipo: string;
}

interface DiaperSectionProps {
  onUpdate?: () => void;
}

export default function DiaperSection({ onUpdate }: DiaperSectionProps) {
  const [diaperType, setDiaperType] = useState("");
  const [diapers, setDiapers] = useState<Diaper[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/diapers`);
        if (!res.ok) throw new Error("Falha ao carregar fraldas");
        const data: Diaper[] = await res.json();
        setDiapers(data);
      } catch (err) {
        console.error("Erro ao carregar fraldas:", err);
      }
    }
    fetchData();
  }, [refresh]);

  async function addDiaperForm(e: FormEvent) {
    e.preventDefault();

    const hora = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date().toISOString().slice(0, 10);
    const id = Math.random().toString(16).slice(2, 8);

    try {
      const res = await fetch(`${API_URL}/diapers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          hora,
          quantidade: 1,
          date,
          tipo: diaperType,
        }),
      });
      if (!res.ok) throw new Error("Falha ao adicionar fralda");

      setDiaperType("");
      setRefresh((r) => r + 1);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao adicionar fralda:", err);
    }
  }

  async function removeDiaper(id: string) {
    try {
      const res = await fetch(`${API_URL}/diapers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao remover fralda");

      setRefresh((r) => r + 1);
      onUpdate?.();
    } catch (err) {
      console.error("Erro ao remover fralda:", err);
    }
  }

  return (
    <>
      <Title marginTop="mt-6">👶 Adicionar Fralda</Title>
      <form onSubmit={addDiaperForm} className="my-4 flex flex-col gap-2">
        <select
          name="diaperType"
          value={diaperType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setDiaperType(e.currentTarget.value)
          }
          className="p-2 border rounded"
          required
        >
          <option value="">Selecione o tipo</option>
          <option value="Mijinha">Mijinha</option>
          <option value="Cocô">Cocô</option>
          <option value="Mista">Mista</option>
        </select>

        <Flex justifyContent="justify-center" marginTop="mt-2">
          <Button text="Adicionar" type="submit" disabled={!diaperType} />
        </Flex>
      </form>

      <DiaperList diapers={diapers} onRemove={removeDiaper} />
    </>
  );
}
