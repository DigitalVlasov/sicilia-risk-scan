import { Question } from "@/components/quiz/QuestionCard";

export const questions: Question[] = [
  {
    id: "settore",
    title: "In quale settore opera la tua azienda?",
    type: "select",
    options: [
      { label: "Ristorazione / Commercio", value: "ristorazione", weight: 0 },
      { label: "Manifatturiero / Logistica", value: "manifatturiero", weight: 0 },
      { label: "Edilizia", value: "edilizia", weight: 0 },
      { label: "Servizi / Uffici", value: "servizi", weight: 0 },
      { label: "Agricoltura / Allevamento", value: "agricoltura", weight: 0 },
    ],
  },
  {
    id: "dipendenti",
    title: "Quanti dipendenti avete?",
    type: "select",
    options: [
      { label: "1-5", value: "1-5", weight: 0 },
      { label: "6-15", value: "6-15", weight: 0 },
      { label: "16-50", value: "16-50", weight: 0 },
      { label: "> 50", value: ">50", weight: 0 },
    ],
  },
  {
    id: "formazione",
    title: "La formazione sicurezza è aggiornata secondo Accordo Stato-Regioni?",
    options: [
      { label: "Sì, tutta aggiornata", value: "ok", weight: 0 },
      { label: "Parzialmente", value: "parziale", weight: 2, sanction: "€1.708 - €7.404", details: "Formazione non conforme: sanzioni raddoppiate/triplicate >5/>10 lavoratori." },
      { label: "No", value: "no", weight: 3, sanction: "€1.708 - €7.404", details: "Criticità ricorrente (27.1% PMI)." },
    ],
  },
  {
    id: "sorveglianza",
    title: "È attiva la sorveglianza sanitaria con medico competente?",
    options: [
      { label: "Sì", value: "ok", weight: 0 },
      { label: "Parziale", value: "parziale", weight: 2, sanction: "€2.316 - €7.632", details: "L. 203/2024 rafforza visite preassuntive e sorveglianza." },
      { label: "No", value: "no", weight: 3, sanction: "€2.316 - €7.632", details: "Obbligo per mansioni a rischio; ispettivo potenziato." },
    ],
  },
  {
    id: "dvr",
    title: "Il DVR è presente e aggiornato negli ultimi 12 mesi?",
    options: [
      { label: "Sì", value: "ok", weight: 0 },
      { label: "Aggiornamento necessario", value: "update", weight: 2, sanction: "€2.316 - €7.632", details: "Mancato aggiornamento DVR comporta sanzioni rilevanti." },
      { label: "Assente", value: "absent", weight: 4, sanction: "€2.894 - €7.404 + arresto 3-6 mesi", details: "Assenza DVR è tra le violazioni più gravi (sospensione)." },
    ],
  },
  {
    id: "gestione",
    title: "Hai un sistema di gestione della sicurezza strutturato (procedure, registri, audit)?",
    options: [
      { label: "Sì", value: "ok", weight: 0 },
      { label: "Parziale", value: "parziale", weight: 2, sanction: "€1.000 - €4.000", details: "Mancanza di procedure e registrazioni rende difficile dimostrare conformità." },
      { label: "No", value: "no", weight: 3, sanction: "€2.000 - €6.000", details: "Assenza di sistema di gestione aumenta il rischio di sanzioni e sospensioni." },
    ],
  },
  {
    id: "figure_spp",
    title: "Sono nominate le figure obbligatorie (RSPP, addetti emergenze, medico)?",
    options: [
      { label: "Sì", value: "ok", weight: 0 },
      { label: "Parziale", value: "parziale", weight: 2, sanction: "€1.068 - €7.616", details: "RSPP/Medico/Addetti: sanzioni differenziate e sospensione possibile." },
      { label: "No", value: "no", weight: 3, sanction: "€1.068 - €7.616", details: "Nomine mancanti = rischio provvedimenti sospensivi." },
    ],
  },
  {
    id: "emergenze",
    title: "Procedure di emergenza e prove di evacuazione sono in regola?",
    options: [
      { label: "Sì", value: "ok", weight: 0 },
      { label: "Parziale", value: "parziale", weight: 2, sanction: "€1.068 - €5.695 o arresto 2-4 mesi", details: "Procedure non conformi comportano sanzioni e arresto." },
      { label: "No", value: "no", weight: 3, sanction: "€1.068 - €5.695 o arresto 2-4 mesi", details: "Area critica in edilizia/terziario con controlli mirati." },
    ],
  },
];
