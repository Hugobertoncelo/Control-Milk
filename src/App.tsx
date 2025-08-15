import type { ActionData } from "./support/types";

import { Card, Title, Text, ColGrid, Divider } from "@tremor/react";

import { Main, Data, Chart } from "./cards";

import { useState } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaGithub,
} from "react-icons/fa";

import Modals from "./modals";

export default function Dashboard() {
  const classSection = "bg-blue-100 m-0 px-6 sm:px-12 md:px-18 lg:px-24";

  const [update, setUpdate] = useState<number>(0);
  const [action, setAction] = useState<ActionData>();

  return (
    <>
      <header
        className={classSection + " flex flex-col items-center text-center"}
      >
        <img
          className="m-4"
          src="./logo192.png"
          title="control-milk"
          alt="control-milk"
          width={64}
          height={64}
        />
        <Title>Hora do Leite</Title>
        <Text>Gestão diária de ingestão de leite</Text>
      </header>

      <main className={classSection}>
        <ColGrid numColsMd={2} gapX="gap-x-8" gapY="gap-y-8" marginTop="mt-8">
          <Card shadow>
            <Main
              update={update}
              onUpdate={() => setUpdate((update) => update + 1)}
              onAction={(type, payload) => setAction({ type, payload })}
            />
          </Card>

          <Card shadow>
            <Data
              update={update}
              onUpdate={() => setUpdate((update) => update + 1)}
              onAction={(type, payload) => setAction({ type, payload })}
            />
          </Card>
        </ColGrid>

        <Card marginTop="mt-8" shadow>
          <Chart
            update={update}
            onUpdate={() => setUpdate((update) => update + 1)}
            onAction={(type, payload) => setAction({ type, payload })}
          />
        </Card>
      </main>

      <footer
        className={
          classSection +
          " bg-gray-200 text-gray-700 mt-12 rounded-t-lg shadow-inner"
        }
      >
        <Divider />

        <div className="flex flex-col items-center text-center mt-6">
          <div className="flex gap-4 items-center mb-4">
            <a
              href="https://wa.me/5528999453033"
              target="_blank"
              rel="noreferrer noopener"
              title="WhatsApp"
              className="hover:text-green-500 transition-colors"
            >
              <FaWhatsapp size={28} className="text-green-600" />
            </a>

            <a
              href="https://instagram.com/bertoncelo.hugo"
              target="_blank"
              rel="noreferrer noopener"
              title="Instagram"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram size={28} className="text-pink-600" />
            </a>

            <a
              href="https://github.com/Hugobertoncelo"
              target="_blank"
              rel="noreferrer noopener"
              title="GitHub"
              className="hover:text-gray-900 transition-colors"
            >
              <FaGithub size={28} className="text-gray-800" />
            </a>

            <a
              href="https://www.linkedin.com/in/hugobertoncelo"
              target="_blank"
              rel="noreferrer noopener"
              title="LinkedIn"
              className="hover:text-blue-600 transition-colors"
            >
              <FaLinkedin size={28} className="text-blue-800" />
            </a>

            <a
              href="https://hugobertoncelo.github.io/Portfolio/"
              target="_blank"
              rel="noreferrer noopener"
              title="Portfólio"
              className="hover:text-purple-600 transition-colors"
            >
              <FaGlobe size={28} className="text-purple-700" />
            </a>
          </div>

          <small className="text-gray-500">
            Desenvolvido por <strong>Hugo Bertoncelo</strong>
          </small>
        </div>
      </footer>

      <Modals action={action} />
    </>
  );
}
