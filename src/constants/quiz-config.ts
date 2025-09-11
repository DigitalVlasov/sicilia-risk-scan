import { QuizQuestion, Violation, CaseStudy } from "../types";

// ==================== UNIFIED CONFIGURATION ====================
export const APP_CONFIG = {
  version: "2025",
  contact: {
    phone: "0955872480",
    whatsapp: "390955872480"
  },
  ui: {
    loadingDelay: 800,
    transitionDelay: 200,
    caseStudyAutoAdvance: false, // User-controlled only
  },
  legal: {
    framework: "D.Lgs. 81/08 aggiornato 2025",
    source: "protocolli ispettivi INL/ASP/SPRESAL Sicilia 2025",
    disclaimer: "Test basato su D.Lgs. 81/08 aggiornato 2025 e protocolli ispettivi INL/ASP/SPRESAL Sicilia 2025"
  }
} as const;

// ==================== QUESTIONS DATA ====================
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "gestione",
    title: "Come gestisci attualmente la sicurezza aziendale?",
    subtitle: "Scegli l'opzione più vicina alla tua realtà",
    type: "multiplier",
    options: [
      { value: "gestisco-io", label: "Gestisco io personalmente", multiplier: 1.5 },
      { value: "interno", label: "Persona dedicata internamente", multiplier: 1.3 },
      { value: "consulente", label: "Consulente specializzato", multiplier: 1 },
      { value: "studi-multipli", label: "Diversi professionisti", multiplier: 1.2 }
    ]
  },
  {
    id: "dipendenti", 
    title: "Quanti dipendenti ha la tua azienda?",
    subtitle: "Scegli l'opzione più vicina alla tua realtà",
    type: "multiplier",
    options: [
      { value: "1-5", label: "1-5 dipendenti", multiplier: 1 },
      { value: "6-10", label: "6-10 dipendenti", multiplier: 1.3 },
      { value: "11-20", label: "11-20 dipendenti", multiplier: 1.8 },
      { value: ">20", label: "Oltre 20 dipendenti", multiplier: 2.2 }
    ]
  },
  {
    id: "settore",
    title: "In quale settore opera principalmente la tua azienda?",
    subtitle: "Scegli l'opzione più vicina alla tua realtà",
    type: "multiplier",
    options: [
      { value: "edilizia", label: "Edilizia/Impiantistica", multiplier: 2 },
      { value: "manifatturiero", label: "Manifatturiero/Produzione", multiplier: 1.6 },
      { value: "alimentare", label: "Alloggio/Ristorazione", multiplier: 1.5 },
      { value: "agricoltura", label: "Agricoltura/Allevamento", multiplier: 1.6 },
      { value: "trasporto", label: "Trasporto/Magazzinaggio", multiplier: 1.7 },
      { value: "commercio", label: "Commercio/Retail", multiplier: 1.2 },
      { value: "servizi", label: "Servizi/Consulenza", multiplier: 1.2 }
    ]
  },
  {
    id: "dvr",
    title: "L'ispettore ti dice: «Fammi vedere DVR aggiornato, nomine SPP e verbali riunioni». Hai tutto pronto?",
    subtitle: "Primo controllo sempre richiesto - Fonte: 859 ispezioni ASP Catania 2024",
    type: "score",
    options: [
      { value: "si", label: "Sì, tutto pronto", weight: 0 },
      { value: "no", label: "No, manca qualcosa", weight: 3 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 2 }
    ]
  },
  {
    id: "formazione",
    title: "L'ispettore controlla 3 dipendenti a caso + il datore di lavoro: trovi tutti gli attestati validi?",
    subtitle: "Novità 2025: include obbligo formazione datori 16 ore (Accordo Stato-Regioni)",
    type: "score",
    options: [
      { value: "si", label: "Sì, attestati validi", weight: 0 },
      { value: "no", label: "No, alcuni mancano", weight: 3 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 2 }
    ]
  },
  {
    id: "sorveglianza",
    title: "Sorveglianza sanitaria: Riesci a reperire i Giudizi di Idoneità ultimi 2 anni, Protocollo Sanitario e Nomina del Medico Competente aggiornata?",
    subtitle: "Controllo cartelle mediche sempre verificato",
    type: "score",
    options: [
      { value: "si", label: "Sì, tutto aggiornato", weight: 0 },
      { value: "no", label: "No, mancano visite", weight: 2 },
      { value: "non-gestisco", label: "Non gestisco personalmente", weight: 1 }
    ]
  },
  {
    id: "emergenze",
    title: "Piano Emergenza ed Evacuazione, nomine figure aziendali sulla sicurezza: tutto a posto?",
    subtitle: "Due controlli prioritari sempre verificati insieme",
    type: "score",
    options: [
      { value: "si", label: "Sì, tutto organizzato", weight: 0 },
      { value: "no", label: "No, mancano procedure", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "patente-cantieri",
    title: "Hai la patente a punti o crediti nei cantieri edili, con almeno 15 punti attivi?",
    subtitle: "Obbligatoria dal 1° ottobre 2024 – in caso di mancanza si rischia sanzione amministrativa ed esclusione dalla partecipazione a lavori pubblici",
    type: "score",
    conditional: {
      dependsOn: "settore",
      showFor: ["edilizia"]
    },
    options: [
      { value: "si", label: "Sì, ho la patente attiva", weight: 0 },
      { value: "no", label: "No, non ce l'ho", weight: 4 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 3 }
    ]
  },
  {
    id: "nuovo-assunto",
    title: "Ultimo assunto: hai completato visita preventiva, formazione, informazione, consegna DPI e tesserini prima dell'inizio lavoro?",
    subtitle: "Sequenza obbligatoria pre-assuntiva - controllo prioritario",
    type: "score",
    conditional: {
      dependsOn: "settore",
      showFor: ["manifatturiero", "alimentare", "servizi", "commercio", "agricoltura", "trasporto"]
    },
    options: [
      { value: "si", label: "Sì, sequenza completa", weight: 0 },
      { value: "no", label: "No, alcuni passaggi saltati", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "verifiche-inail",
    title: "Hai i verbali delle verifiche periodiche INAIL/ARPAV per impianti e attrezzature?",
    subtitle: "Sollevamento, pressione, messa a terra - D.Lgs 81/08 Allegato VII",
    type: "score",
    conditional: {
      dependsOn: "settore",
      showFor: ["manifatturiero", "trasporto"]
    },
    options: [
      { value: "si", label: "Sì, tutto verificato", weight: 0 },
      { value: "no", label: "No, verifiche scadute", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "attrezzature",
    title: "Attrezzature di lavoro: hai libretto uso/manutenzione e registro controlli aggiornati?",
    subtitle: "Manutenzione programmata e tracciabilità interventi",
    type: "score",
    conditional: {
      dependsOn: "settore",
      showFor: ["alimentare", "servizi", "commercio", "agricoltura", "edilizia", "manifatturiero", "trasporto"]
    },
    options: [
      { value: "si", label: "Sì, tutto documentato", weight: 0 },
      { value: "no", label: "No, documentazione incompleta", weight: 1 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "rischio-chimico",
    title: "Libro Unico Lavoro aggiornato + schede sicurezza sostanze e valutazione rischio chimico?",
    subtitle: "Controllo standard + specifico settoriale",
    type: "score",
    conditional: {
      dependsOn: "settore",
      showFor: ["manifatturiero", "alimentare"]
    },
    options: [
      { value: "si", label: "Sì, tutto aggiornato", weight: 0 },
      { value: "no", label: "No, documentazione mancante", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "procedure-operative",
    title: "Libro Unico Lavoro aggiornato + procedure operative scritte per mansioni a rischio?",
    subtitle: "Gestione amministrativa + procedure di sicurezza",
    type: "score",
    conditional: {
      dependsOn: "settore",
      showFor: ["servizi", "commercio", "agricoltura", "edilizia", "trasporto"]
    },
    options: [
      { value: "si", label: "Sì, tutto formalizzato", weight: 0 },
      { value: "no", label: "No, procedure mancanti", weight: 1 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  }
];

// ==================== VIOLATIONS CONFIGURATION ====================
export const VIOLATIONS_CONFIG: Record<string, Violation> = {
  dvr: {
    key: "dvr",
    text: "DVR e Nomine",
    min: 2894,
    max: 7404,
    consequences: [
      "Sospensione immediata dell'attività in caso di controllo.",
      "In caso di infortunio, rischi una denuncia per lesioni o omicidio colposo.",
      "L'INAIL può negare la copertura assicurativa."
    ],
    actions: [
      "Redigere/aggiornare il DVR con un tecnico qualificato.",
      "Nominare formalmente RSPP e altre figure obbligatorie.",
      "Verbalizzare la riunione periodica annuale."
    ],
    fonte: "D.Lgs. 81/08, art. 18 e 29 (sanzioni rivalutate 2025)",
    priority: { order: 1, urgency: "CRITICO" }
  },
  formazione: {
    key: "formazione",
    text: "Formazione Aggiornata",
    min: 1709,
    max: 7404,
    consequences: [
      "Responsabilità penale diretta in caso di infortunio.",
      "Nullità di incarichi chiave (RLS, addetti antincendio, etc.).",
      "Dal 2025, la mancata formazione del Datore di Lavoro è violazione grave."
    ],
    actions: [
      "Verificare immediatamente lo stato di tutti gli attestati.",
      "Iscrivere il personale ai corsi di aggiornamento.",
      "Pianificare il nuovo corso obbligatorio di 16 ore per il Datore di Lavoro."
    ],
    fonte: "D.Lgs. 81/08 art. 37 + Nuovo Accordo Stato-Regioni 2025",
    priority: { order: 2, urgency: "CRITICO" }
  },
  sorveglianza: {
    key: "sorveglianza",
    text: "Sorveglianza Sanitaria",
    min: 2316,
    max: 7632,
    consequences: [
      "Un dipendente senza giudizio di idoneità valido non può legalmente lavorare.",
      "Rischio di denuncia se un infortunio è correlato a una condizione non monitorata.",
      "L'ASP può disporre la sospensione dell'attività."
    ],
    actions: [
      "Nominare (o verificare) il Medico Competente.",
      "Pianificare le visite mediche periodiche.",
      "Assicurarsi che il protocollo sanitario sia aggiornato ai rischi del DVR."
    ],
    fonte: "D.Lgs. 81/08, Titolo I e X; Legge 203/2024",
    priority: { order: 3, urgency: "ALTO" }
  },
  emergenze: {
    key: "emergenze",
    text: "Gestione Emergenze",
    min: 1068,
    max: 5695,
    consequences: [
      "In caso di incendio o infortunio, la mancata organizzazione ti rende penalmente responsabile.",
      "Rischi l'arresto fino a 4 mesi se ci sono danni a persone.",
      "Sanzioni immediate in assenza di nomine e prove di evacuazione."
    ],
    actions: [
      "Aggiornare il piano di emergenza.",
      "Nominare e formare addetti antincendio e primo soccorso.",
      "Tenere un registro infortuni aggiornato."
    ],
    fonte: "D.Lgs. 81/08, Titolo I e II",
    priority: { order: 4, urgency: "ALTO" }
  },
  "patente-cantieri": {
    key: "patente-cantieri",
    text: "Patente a Crediti",
    min: 6000,
    max: 12000,
    consequences: [
      "Impossibilità di operare in qualsiasi cantiere.",
      "Esclusione automatica da gare e appalti.",
      "Sanzione min. €6.000 e blocco immediato dell'attività."
    ],
    actions: [
      "Richiedere la patente all'Ispettorato del Lavoro.",
      "Verificare di avere almeno 15 crediti attivi.",
      "Frequentare corsi per recuperare eventuali crediti persi."
    ],
    fonte: "D.L. 19/2024 (Decreto PNRR 4)",
    priority: { order: 1, urgency: "BLOCCANTE" }
  },
  "nuovo-assunto": {
    key: "nuovo-assunto",
    text: "Sequenza Pre-Assuntiva",
    min: 1474,
    max: 5926,
    consequences: [
      "Un neoassunto senza formazione non può lavorare legalmente.",
      "Responsabilità penale in caso di infortunio nei primi giorni.",
      "Ispettori verificano sempre le procedure di inserimento."
    ],
    actions: [
      "Stabilire una checklist pre-assuntiva standard.",
      "Organizzare visita medica prima dell'inizio.",
      "Completare formazione generale e specifica entro i termini."
    ],
    fonte: "D.Lgs. 81/08, art. 18, 37 e 41",
    priority: { order: 5, urgency: "MEDIO" }
  },
  "verifiche-inail": {
    key: "verifiche-inail",
    text: "Verifiche Impianti",
    min: 1842,
    max: 7368,
    consequences: [
      "Uso di impianti non verificati comporta sanzioni e responsabilità penale.",
      "In caso di incidente, assicurazione può non coprire i danni.",
      "INAIL può sospendere l'attività fino alle verifiche."
    ],
    actions: [
      "Programmare le verifiche con INAIL/ARPAV.",
      "Tenere registro manutenzioni aggiornato.",
      "Non utilizzare attrezzature con verifiche scadute."
    ],
    fonte: "D.Lgs. 81/08, Allegato VII",
    priority: { order: 6, urgency: "MEDIO" }
  },
  attrezzature: {
    key: "attrezzature",
    text: "Manutenzione Attrezzature",
    min: 842,
    max: 4388,
    consequences: [
      "Attrezzature non manutenute sono causa frequente di infortuni.",
      "Responsabilità penale se l'infortunio dipende da mancata manutenzione.",
      "Sanzioni per ogni attrezzatura non documentata."
    ],
    actions: [
      "Creare un registro delle manutenzioni.",
      "Pianificare controlli periodici.",
      "Documentare tutti gli interventi effettuati."
    ],
    fonte: "D.Lgs. 81/08, Titolo III",
    priority: { order: 7, urgency: "STANDARD" }
  },
  "rischio-chimico": {
    key: "rischio-chimico",
    text: "Gestione Rischio Chimico",
    min: 1895,
    max: 7579,
    consequences: [
      "L'uso di sostanze chimiche senza valutazione è grave violazione.",
      "Rischi per la salute dei lavoratori non monitorati.",
      "Possibili sanzioni penali per danni da esposizione."
    ],
    actions: [
      "Aggiornare la valutazione del rischio chimico.",
      "Raccogliere tutte le schede di sicurezza.",
      "Formare il personale sulle sostanze utilizzate."
    ],
    fonte: "D.Lgs. 81/08, Titolo IX",
    priority: { order: 8, urgency: "SETTORIALE" }
  },
  "procedure-operative": {
    key: "procedure-operative",
    text: "Procedure Operative",
    min: 632,
    max: 3158,
    consequences: [
      "Lavorazioni senza procedure scritte comportano responsabilità in caso di infortunio.",
      "Difficoltà a dimostrare l'organizzazione aziendale all'ispettore.",
      "Impossibilità di formare correttamente i nuovi dipendenti."
    ],
    actions: [
      "Redigere procedure per ogni mansione a rischio.",
      "Formare il personale sulle procedure.",
      "Aggiornare il Libro Unico del Lavoro."
    ],
    fonte: "D.Lgs. 81/08, art. 18",
    priority: { order: 9, urgency: "ORGANIZZATIVO" }
  }
};

// ==================== CASE STUDIES ====================
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    sector: "Alimentare",
    title: "Azienda Dolciaria - Provincia Catania",
    situation: "Controllo ispettivo in corso",
    challenge: "L'azienda ha ricevuto un controllo ispettivo e necessitava di adeguarsi rapidamente alla normativa sulla sicurezza aziendale.",
    solution: [
      "Formazione Art. 37 organizzata direttamente in azienda",
      "Figure aziendali certificate tramite Ente Accreditato",
      "Visite mediche coordinate in tempi record",
      "DVR e Piano Emergenza consegnati chiavi in mano"
    ],
    result: "In 20-25 giorni l'azienda ha presentato tutti i documenti richiesti ai funzionari",
    icon: "🍰"
  },
  {
    id: 2,
    sector: "Manifatturiero", 
    title: "PMI Metalmeccanica - Provincia Siracusa",
    situation: "Necessità formazione senza budget",
    challenge: "L'azienda doveva formare tutto il personale sulla sicurezza ma non aveva budget disponibile per i corsi obbligatori.",
    solution: [
      "Accesso ai Fondi Interprofessionali per formazione gratuita",
      "Erogazione di tutti i percorsi formativi obbligatori",
      "Risparmio economico significativo sui costi di formazione",
      "Personale completamente formato e certificato"
    ],
    result: "Risparmio di oltre €2.200 sui costi di formazione standard",
    icon: "⚙️"
  },
  {
    id: 3,
    sector: "Tessile",
    title: "Azienda Confezioni - Provincia Messina", 
    situation: "AUDIT esterno imminente",
    challenge: "L'azienda doveva superare un AUDIT di consulenti esterni su sicurezza e salubrità ambienti, con richieste molto specifiche.",
    solution: [
      "Team multidisciplinare di specialisti coordinati",
      "Piano Emergenza personalizzato per audit specifico",
      "DVR realizzato su misura per le richieste",
      "Supporto tecnico completo DPI ed estintori"
    ],
    result: "Superamento dell'AUDIT con valutazione positiva",
    icon: "👔"
  }
];