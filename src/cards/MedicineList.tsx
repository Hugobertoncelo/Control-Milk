import React, { useState } from "react";
import { Card, Title } from "@tremor/react";
import type { Med } from "../support/types";
import { FaPills, FaCapsules, FaAppleAlt, FaHeartbeat } from "react-icons/fa";
import { getDay, removeMed } from "../support/data";

interface MedicineListProps {
  meds: Med[];
  onRemove?: (index: number) => void;
}

export default function MedicineList({ meds, onRemove }: MedicineListProps) {
  const [_, setForceUpdate] = useState(0);

  function getStyle(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes("vitamina") || lower.includes("vitamin")) {
      return {
        color: "bg-green-100",
        icon: <FaAppleAlt className="text-green-600" />,
      };
    }
    if (lower.includes("cápsula") || lower.includes("capsule")) {
      return {
        color: "bg-purple-100",
        icon: <FaCapsules className="text-purple-600" />,
      };
    }
    if (lower.includes("coração") || lower.includes("heart")) {
      return {
        color: "bg-pink-100",
        icon: <FaHeartbeat className="text-pink-600" />,
      };
    }

    return {
      color: "bg-blue-100",
      icon: <FaPills className="text-blue-600" />,
    };
  }

  async function handleRemove(index: number) {
    if (onRemove) {
      onRemove(index);
    } else {
      const today = await getDay();
      await removeMed(index, today.date);
      setForceUpdate((v) => v + 1);
    }
  }

  return (
    <Card marginTop="mt-8" shadow>
      <Title>💊 Remédios Ingeridos</Title>

      {meds.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {meds.map((m: any, i) => {
            const style = getStyle(m.nome || m.name || "");
            const hora = m.horario || m.time || m.hora;
            return (
              <div
                key={i}
                className={`${style.color} p-3 rounded shadow flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {style.icon}
                    <div>
                      <div className="font-bold">{m.nome || m.name}</div>
                      <div className="text-sm text-gray-600">
                        {hora
                          ? `Hora: ${hora} — ${m.dose} gotas`
                          : `${m.dose} gotas`}
                      </div>
                    </div>
                  </div>
                  <button
                    className="ml-2 rounded-full px-3 py-1 bg-red-500 text-white text-sm hover:bg-red-600"
                    onClick={() => handleRemove(i)}
                    title="Remover remédio"
                  >
                    X
                  </button>
                </div>

                <div className="text-gray-500 mt-2 text-right text-sm">
                  {hora}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 mt-4">
          Nenhum remédio adicionado hoje.
        </div>
      )}
    </Card>
  );
}
