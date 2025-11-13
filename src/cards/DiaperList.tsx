import React from "react";
import { Card } from "@tremor/react";
import { FaBaby, FaPoo, FaTint, FaExchangeAlt } from "react-icons/fa";
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

function getStyle(tipo: string) {
  const lower = tipo.toLowerCase();
  if (lower.includes("cocô")) {
    return {
      color: "bg-blue-100",
      icon: <FaPoo className="text-yellow-700" />,
    };
  }
  if (
    lower.includes("mijinha") ||
    lower.includes("xixi") ||
    lower.includes("urina")
  ) {
    return {
      color: "bg-blue-100",
      icon: <FaTint className="text-blue-600" />,
    };
  }
  if (lower.includes("mista")) {
    return {
      color: "bg-blue-100",
      icon: <FaExchangeAlt className="text-purple-600" />,
    };
  }
  return {
    color: "bg-blue-100",
    icon: <FaBaby className="text-gray-600" />,
  };
}

export default function DiaperList({ diapers, onRemove }: DiaperListProps) {
  if (!diapers || diapers.length === 0) {
    return (
      <p className="text-gray-500 mt-2 text-sm">
        Nenhuma fralda registrada ainda.
      </p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
      {diapers.map((item) => {
        const style = getStyle(item.tipo);
        return (
          <div
            key={item.id}
            className={`${style.color} p-3 rounded shadow flex flex-col justify-between`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                {style.icon}
                <div>
                  <div className="font-bold">{item.tipo}</div>
                  <div className="text-sm text-gray-600">{item.hora}</div>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="ml-2 rounded-full w-8 h-8 flex items-center justify-center bg-red-500 text-white text-sm hover:bg-red-600"
                title="Remover fralda"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
