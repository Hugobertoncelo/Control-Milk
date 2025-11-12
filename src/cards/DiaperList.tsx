import React from "react";
import { Card, Flex, Button, Text } from "@tremor/react";
import { X } from "lucide-react";

interface DiaperListProps {
  diapers: {
    id: string;
    hora: string;
    tipo: string;
    date: string;
  }[];
  onRemove: (id: string) => void;
}

export default function DiaperList({ diapers, onRemove }: DiaperListProps) {
  if (!diapers || diapers.length === 0) {
    // Tremor não aceita className aqui, então usamos um <p>
    return (
      <p className="text-gray-500 mt-2 text-sm">
        Nenhuma fralda registrada ainda.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {diapers.map((item) => (
        <div
          key={item.id}
          className="p-3 transition-all hover:shadow-md border border-gray-200 rounded-xl bg-white"
        >
          <Flex justifyContent="justify-between" alignItems="items-center">
            <div>
              <p className="font-semibold text-gray-800">{item.tipo}</p>
              <p className="text-sm text-gray-600">
                {item.hora} — {new Date(item.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1.5 rounded-md transition-colors hover:bg-red-100"
            >
              <X className="text-red-500 w-4 h-4" />
            </button>
          </Flex>
        </div>
      ))}
    </div>
  );
}
