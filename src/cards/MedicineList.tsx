import React from "react";
import { Card, Title, Flex, Button } from "@tremor/react";
import type { Med } from "../support/types";
import { FaPills, FaCapsules, FaAppleAlt, FaHeartbeat } from "react-icons/fa";

interface MedicineListProps {
  meds: Med[];
  onRemove: (index: number) => void;
}

export default function MedicineList({ meds, onRemove }: MedicineListProps) {
  const getStyle = (name: string) => {
    switch (name.toLowerCase()) {
      case "paracetamol":
        return {
          color: "bg-yellow-100",
          icon: <FaPills className="text-yellow-600" />,
        };
      case "ibuprofeno":
        return {
          color: "bg-red-100",
          icon: <FaCapsules className="text-red-600" />,
        };
      case "simeticona":
        return {
          color: "bg-green-100",
          icon: <FaCapsules className="text-green-600" />,
        };
      case "vitamina c":
        return {
          color: "bg-orange-100",
          icon: <FaAppleAlt className="text-orange-600" />,
        };
      default:
        return {
          color: "bg-gray-100",
          icon: <FaHeartbeat className="text-gray-600" />,
        };
    }
  };

  return (
    <Card marginTop="mt-8" shadow>
      <Title>💊 Remédios Ingeridos</Title>

      {meds.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {meds.map((m, i) => {
            const style = getStyle(m.name);
            return (
              <div
                key={i}
                className={`${style.color} p-4 rounded shadow flex flex-col justify-between`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {style.icon}
                    <div>
                      <div className="font-bold">{m.name}</div>
                      <div>{m.dose}</div>
                    </div>
                  </div>
                  <Button
                    text="X"
                    color="red"
                    size="xs"
                    onClick={() => onRemove(i)}
                  />
                </div>
                <div className="text-gray-500 mt-2 text-right text-sm">
                  {m.time}
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
