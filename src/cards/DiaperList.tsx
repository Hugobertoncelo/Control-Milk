import React from "react";
import { Card, Title, Button } from "@tremor/react";
import type { Diaper } from "../support/types";
import { FaBaby } from "react-icons/fa";

interface DiaperListProps {
  diapers: Diaper[];
  onRemove: (index: number) => void;
}

export default function DiaperList({ diapers, onRemove }: DiaperListProps) {
  return (
    <Card marginTop="mt-8" shadow>
      <Title>👶 Fraldas Trocadas</Title>

      {diapers.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {diapers.map((d, i) => (
            <div
              key={i}
              className="p-3 rounded shadow flex flex-col justify-between bg-blue-100"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FaBaby className="text-blue-600" />
                  <div>
                    <div className="font-bold">{d.type}</div>
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
                {d.time}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 mt-4">
          Nenhuma fralda registrada hoje.
        </div>
      )}
    </Card>
  );
}
