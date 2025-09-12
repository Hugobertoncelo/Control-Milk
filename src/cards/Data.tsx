import type {
  CardProps,
  DataSet,
  DateString,
  Day,
  Med,
  Diaper,
} from "../support/types";

import {
  BarList,
  Block,
  Callout,
  Dropdown,
  DropdownItem,
  Title,
} from "@tremor/react";

import { useState, useEffect } from "react";

import { CgGlassAlt, CgCalendar } from "react-icons/cg";
import { FaPills, FaCapsules, FaAppleAlt, FaHeartbeat } from "react-icons/fa";
import { FaBaby } from "react-icons/fa";

import { getDataSet, getDay, getSettings } from "../support/data";

import { dayWeek, nativeDate, natural, sum } from "../support/helpers";

export default function Data({ update = 0 }: CardProps) {
  const { goal } = getSettings();

  const [data, setData] = useState<DataSet>([]);
  const [date, setDate] = useState<DateString>();

  const day: Day | null = date ? getDay(date) : null;
  const sumDay: number = day ? sum(day) : 0;

  useEffect(() => {
    setData(getDataSet().reverse());
    if (day && day.data.length === 0) setDate(undefined);
  }, [update]);

  const getStyle = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("vitamina") || lower.includes("vitamin")) {
      return { color: "text-green-600", icon: <FaAppleAlt /> };
    }
    if (lower.includes("cápsula") || lower.includes("capsule")) {
      return { color: "text-purple-600", icon: <FaCapsules /> };
    }
    if (lower.includes("coração") || lower.includes("heart")) {
      return { color: "text-pink-600", icon: <FaHeartbeat /> };
    }
    return { color: "text-blue-600", icon: <FaPills /> };
  };

  return (
    <>
      <Dropdown
        placeholder="Selecione um dia"
        handleSelect={setDate}
        icon={CgCalendar}
      >
        {data.map((day, index) => (
          <DropdownItem
            key={index}
            value={day.date}
            text={
              nativeDate(day.date).toLocaleDateString() +
              " - " +
              dayWeek(day.date)
            }
          />
        ))}
      </Dropdown>

      <Block marginTop="mt-4">
        {day ? (
          <>
            {/* ======= Leite ======= */}
            <Callout
              title={
                goal > sumDay
                  ? "Tomou pouco leite!"
                  : "Parabéns, concluiu o objetivo!"
              }
              color={goal > sumDay ? "red" : "green"}
              text={`
                Neste dia você tomou ${sumDay.toLocaleString()} ml de leite.
                São ${natural(sumDay - goal).toLocaleString()} ml a
                ${goal > sumDay ? "menos" : "mais"} do que
                seu objetivo diário de ${goal.toLocaleString()} ml.
              `}
            />

            <BarList
              marginTop="mt-4"
              data={day.data.map((d, i) => ({
                key: i.toString(),
                name: d.t.toString(),
                value: d.v,
                icon: CgGlassAlt,
              }))}
              valueFormatter={(v) => `${v.toLocaleString()} ml`}
              showAnimation
            />

            {/* Remédios */}
            {day.meds && day.meds.length > 0 && (
              <div className="mt-6">
                <Title>💊 Remédios Tomados</Title>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {day.meds.map((m: Med, i: number) => {
                    return (
                      <div
                        key={i}
                        className="p-3 rounded shadow flex flex-col justify-between bg-blue-50"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-600">
                            {(() => {
                              const lower = m.name.toLowerCase();
                              if (lower.includes("vitamina"))
                                return <FaAppleAlt />;
                              if (lower.includes("cápsula"))
                                return <FaCapsules />;
                              if (lower.includes("coração"))
                                return <FaHeartbeat />;
                              return <FaPills />;
                            })()}
                          </span>
                          <div className="font-bold text-black">{m.name}</div>
                        </div>
                        <div className="text-gray-500 mt-1 text-sm">
                          {m.dose} - {m.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ======= Fraldas ======= */}
            {day.diapers && day.diapers.length > 0 && (
              <div className="mt-6">
                <Title>👶 Fraldas Trocadas</Title>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {day.diapers.map((d: Diaper, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded shadow flex flex-col justify-between bg-blue-50"
                    >
                      <div className="flex items-center space-x-2">
                        <FaBaby className="text-blue-600" />
                        <div className="font-bold">{d.type}</div>
                      </div>
                      <div className="text-gray-500 mt-1 text-sm">{d.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <Callout
            title="Nenhum dia selecionado"
            text="Selecione uma data para visualizar o seu histórico"
            color="blue"
          />
        )}
      </Block>
    </>
  );
}
