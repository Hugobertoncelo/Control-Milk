import { db } from "../firebase";
import { doc, setDoc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

export interface Med {
  nome: string;
  dose: number;
  horario: string;
}

export interface Registro {
  hora: string;
  quantidade: number;
}

export interface Dia {
  meds: Med[];
  data: Registro[];
}

export async function salvarMetaDiaria(valor: number) {
  const ref = doc(db, "config", "metaDiaria");
  await setDoc(ref, { valor });
}

export function ouvirMetaDiaria(callback: (valor: number) => void) {
  const ref = doc(db, "config", "metaDiaria");
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data().valor);
    }
  });
}

function getDiaRef(date: string) {
  return doc(db, "dias", date);
}

export async function salvarDia(date: string, dia: Dia) {
  const ref = getDiaRef(date);
  await setDoc(ref, dia);
}

export async function atualizarDia(date: string, parcial: Partial<Dia>) {
  const ref = getDiaRef(date);
  await updateDoc(ref, parcial);
}

export function ouvirDia(date: string, callback: (dia: Dia) => void) {
  const ref = getDiaRef(date);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as Dia);
    } else {
      callback({ meds: [], data: [] });
    }
  });
}
