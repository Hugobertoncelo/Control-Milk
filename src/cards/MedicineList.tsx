import React from "react";
import { Card, Title } from "@tremor/react";
import type { Med } from "../support/types";
import { FaPills, FaCapsules, FaAppleAlt, FaHeartbeat } from "react-icons/fa";

interface MedicineListProps {
  meds: Med[];
  onRemove: (index: number) => void;
}

export default function MedicineList({ meds, onRemove }: MedicineListProps) {
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

  return (
    <Card marginTop="mt-8" shadow>
      <Title>💊 Remédios Ingeridos</Title>

      {meds.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {meds.map((m, i) => {
            const style = getStyle(m.name);

            return (
              <div
                key={i}
                className={`${style.color} p-3 rounded shadow flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {style.icon}
                    <div>
                      <div className="font-bold">{m.name}</div>
                      <div>{m.dose}</div>
                    </div>
                  </div>

                  <button
                    className="ml-2 rounded-full px-3 py-1 bg-red-500 text-white text-sm hover:bg-red-600"
                    onClick={() => onRemove(i)}
                  >
                    X
                  </button>
                </div>

                <div className="text-gray-500 mt-2 text-right text-sm">
                  {new Date(m.date).toLocaleDateString("pt-BR")} {m.time}
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
