import React, { useCallback, useReducer, useMemo, memo, useState, useEffect } from "react";

// ==================== TYPE DEFINITIONS ====================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "warning" | "success";
  className?: string;
}
interface IntroStageProps {
  onStart: () => void;
}
interface QuizStageProps {
  question: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: any;
  onSelectOption: (question: any, option: any) => void;
  onGoBack: () => void;
}
interface ResultsStageProps {
  risk: {
    level: string;
    finalScore: number;
  };
  violations: any[];
  answers: any;
  onReset: () => void;
}

// ==================== CONFIGURATION LAYER ====================
const CONFIG = {
  contact: {
    phone: "0955872480",
    whatsapp: "390955872480"
  },
  ui: {
    loadingDelay: 800,
    transitionDelay: 200
  }
};

// ==================== OPTIMIZED UI COMPONENTS ====================
const Card = memo(({
  children,
  className = "",
  id = ""
}: CardProps) => <div id={id} className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>);
const CardHeader = memo(({
  children,
  className = ""
}: Omit<CardProps, 'id'>) => <div className={`p-4 sm:p-6 border-b border-gray-200 ${className}`}>
    {children}
  </div>);
const CardTitle = memo(({
  children,
  className = "",
  id
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => <h2 id={id} className={`text-lg sm:text-xl font-bold tracking-tight ${className}`}>
    {children}
  </h2>);
const CardContent = memo(({
  children,
  className = ""
}: Omit<CardProps, 'id'>) => <div className={`p-4 sm:p-6 ${className}`}>
    {children}
  </div>);
const Button = memo(({
  children,
  onClick,
  variant = "default",
  size = "md",
  className = "",
  disabled = false
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
  };
  const variantClasses = {
    default: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
    outline: "border-2 border-green-600 bg-transparent text-green-600 hover:bg-green-600 hover:text-white active:bg-green-700 focus:ring-green-500",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-300",
    ghost: "hover:bg-gray-100 active:bg-gray-200 hover:text-gray-900",
    success: "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500"
  };
  return <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>{children}</button>;
});
const Badge = memo(({
  children,
  variant = "default",
  className = ""
}: BadgeProps) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold";
  const variantClasses = {
    default: "border-transparent bg-gray-800 text-white",
    secondary: "border-transparent bg-gray-200 text-gray-900",
    destructive: "border-transparent bg-red-600 text-white",
    warning: "border-transparent bg-yellow-500 text-black",
    success: "border-transparent bg-green-600 text-white"
  };
  return <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</span>;
});

// ==================== COMPLETE DATA LAYER (13 Questions) ====================
const QUESTIONS = [{
  id: "gestione",
  title: "Come gestisci attualmente la sicurezza aziendale?",
  subtitle: "Scegli l'opzione più vicina alla tua realtà",
  type: "multiplier",
  options: [{
    value: "gestisco-io",
    label: "Gestisco io personalmente",
    multiplier: 1.5
  }, {
    value: "interno",
    label: "Persona dedicata internamente",
    multiplier: 1.3
  }, {
    value: "consulente",
    label: "Consulente specializzato",
    multiplier: 1
  }, {
    value: "studi-multipli",
    label: "Diversi professionisti",
    multiplier: 1.2
  }]
}, {
  id: "dipendenti",
  title: "Quanti dipendenti ha la tua azienda?",
  subtitle: "Scegli l'opzione più vicina alla tua realtà",
  type: "multiplier",
  options: [{
    value: "1-5",
    label: "1-5 dipendenti",
    multiplier: 1
  }, {
    value: "6-10",
    label: "6-10 dipendenti",
    multiplier: 1.3
  }, {
    value: "11-20",
    label: "11-20 dipendenti",
    multiplier: 1.8
  }, {
    value: ">20",
    label: "Oltre 20 dipendenti",
    multiplier: 2.2
  }]
}, {
  id: "settore",
  title: "In quale settore opera principalmente la tua azienda?",
  subtitle: "Scegli l'opzione più vicina alla tua realtà",
  type: "multiplier",
  options: [{
    value: "edilizia",
    label: "Edilizia/Impiantistica",
    multiplier: 2
  }, {
    value: "manifatturiero",
    label: "Manifatturiero/Produzione",
    multiplier: 1.6
  }, {
    value: "alimentare",
    label: "Alloggio/Ristorazione",
    multiplier: 1.5
  }, {
    value: "agricoltura",
    label: "Agricoltura/Allevamento",
    multiplier: 1.6
  }, {
    value: "trasporto",
    label: "Trasporto/Magazzinaggio",
    multiplier: 1.7
  }, {
    value: "commercio",
    label: "Commercio/Retail",
    multiplier: 1.2
  }, {
    value: "servizi",
    label: "Servizi/Consulenza",
    multiplier: 1.2
  }]
}, {
  id: "dvr",
  title: "L'ispettore ti dice: «Fammi vedere DVR aggiornato, nomine SPP e verbali riunioni». Hai tutto pronto?",
  subtitle: "Primo controllo sempre richiesto - Fonte: 859 ispezioni ASP Catania 2024",
  type: "score",
  options: [{
    value: "si",
    label: "Sì, tutto pronto",
    weight: 0
  }, {
    value: "no",
    label: "No, manca qualcosa",
    weight: 3
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 2
  }]
}, {
  id: "formazione",
  title: "L'ispettore controlla 3 dipendenti a caso + il datore di lavoro: trovi tutti gli attestati validi?",
  subtitle: "Novità 2025: include obbligo formazione datori 16 ore (Accordo Stato-Regioni)",
  type: "score",
  options: [{
    value: "si",
    label: "Sì, attestati validi",
    weight: 0
  }, {
    value: "no",
    label: "No, alcuni mancano",
    weight: 3
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 2
  }]
}, {
  id: "sorveglianza",
  title: "Sorveglianza sanitaria: Riesci a reperire i Giudizi di Idoneità ultimi 2 anni, Protocollo Sanitario e Nomina del Medico Competente aggiornata?",
  subtitle: "Controllo cartelle mediche sempre verificato",
  type: "score",
  options: [{
    value: "si",
    label: "Sì, tutto aggiornato",
    weight: 0
  }, {
    value: "no",
    label: "No, mancano visite",
    weight: 2
  }, {
    value: "non-gestisco",
    label: "Non gestisco personalmente",
    weight: 1
  }]
}, {
  id: "emergenze",
  title: "Piano Emergenza ed Evacuazione, nomine figure aziendali sulla sicurezza: tutto a posto?",
  subtitle: "Due controlli prioritari sempre verificati insieme",
  type: "score",
  options: [{
    value: "si",
    label: "Sì, tutto organizzato",
    weight: 0
  }, {
    value: "no",
    label: "No, mancano procedure",
    weight: 2
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 1
  }]
}, {
  id: "patente-cantieri",
  title: "Hai la patente a punti o crediti nei cantieri edili, con almeno 15 punti attivi?",
  subtitle: "Obbligatoria dal 1° ottobre 2024 – in caso di mancanza si rischia sanzione amministrativa ed esclusione dalla partecipazione a lavori pubblici",
  type: "score",
  conditional: {
    dependsOn: "settore",
    showFor: ["edilizia"]
  },
  options: [{
    value: "si",
    label: "Sì, ho la patente attiva",
    weight: 0
  }, {
    value: "no",
    label: "No, non ce l'ho",
    weight: 4
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 3
  }]
}, {
  id: "nuovo-assunto",
  title: "Ultimo assunto: hai completato visita preventiva, formazione, informazione, consegna DPI e tesserini prima dell'inizio lavoro?",
  subtitle: "Sequenza obbligatoria pre-assuntiva - controllo prioritario",
  type: "score",
  conditional: {
    dependsOn: "settore",
    showFor: ["manifatturiero", "alimentare", "servizi", "commercio", "agricoltura", "trasporto"]
  },
  options: [{
    value: "si",
    label: "Sì, sequenza completa",
    weight: 0
  }, {
    value: "no",
    label: "No, alcuni passaggi saltati",
    weight: 2
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 1
  }]
}, {
  id: "verifiche-inail",
  title: "Hai i verbali delle verifiche periodiche INAIL/ARPAV per impianti e attrezzature?",
  subtitle: "Sollevamento, pressione, messa a terra - D.Lgs 81/08 Allegato VII",
  type: "score",
  conditional: {
    dependsOn: "settore",
    showFor: ["manifatturiero", "trasporto"]
  },
  options: [{
    value: "si",
    label: "Sì, tutto verificato",
    weight: 0
  }, {
    value: "no",
    label: "No, verifiche scadute",
    weight: 2
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 1
  }]
}, {
  id: "attrezzature",
  title: "Attrezzature di lavoro: hai libretto uso/manutenzione e registro controlli aggiornati?",
  subtitle: "Manutenzione programmata e tracciabilità interventi",
  type: "score",
  conditional: {
    dependsOn: "settore",
    showFor: ["alimentare", "servizi", "commercio", "agricoltura", "edilizia", "manifatturiero", "trasporto"]
  },
  options: [{
    value: "si",
    label: "Sì, tutto documentato",
    weight: 0
  }, {
    value: "no",
    label: "No, documentazione incompleta",
    weight: 1
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 1
  }]
}, {
  id: "rischio-chimico",
  title: "Libro Unico Lavoro aggiornato + schede sicurezza sostanze e valutazione rischio chimico?",
  subtitle: "Controllo standard + specifico settoriale",
  type: "score",
  conditional: {
    dependsOn: "settore",
    showFor: ["manifatturiero", "alimentare"]
  },
  options: [{
    value: "si",
    label: "Sì, tutto aggiornato",
    weight: 0
  }, {
    value: "no",
    label: "No, documentazione mancante",
    weight: 2
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 1
  }]
}, {
  id: "procedure-operative",
  title: "Libro Unico Lavoro aggiornato + procedure operative scritte per mansioni a rischio?",
  subtitle: "Gestione amministrativa + procedure di sicurezza",
  type: "score",
  conditional: {
    dependsOn: "settore",
    showFor: ["servizi", "commercio", "agricoltura", "edilizia", "trasporto"]
  },
  options: [{
    value: "si",
    label: "Sì, tutto formalizzato",
    weight: 0
  }, {
    value: "no",
    label: "No, procedure mancanti",
    weight: 1
  }, {
    value: "non-sicuro",
    label: "Non sono sicuro",
    weight: 1
  }]
}];
const VIOLATIONS_CONFIG = {
  dvr: {
    key: "dvr",
    text: "DVR e Nomine Fondamentali",
    min: 2894,
    max: 7404,
    consequences: ["Sospensione immediata dell'attività in caso di controllo.", "In caso di infortunio, rischi una denuncia per lesioni o omicidio colposo.", "L'INAIL può negare la copertura assicurativa."],
    actions: ["Redigere/aggiornare il DVR con un tecnico qualificato.", "Nominare formalmente RSPP e altre figure obbligatorie.", "Verbalizzare la riunione periodica annuale."],
    fonte: "D.Lgs. 81/08, art. 18 e 29 (sanzioni rivalutate 2025)",
    priority: {
      order: 1,
      urgency: "CRITICITÀ #1"
    }
  },
  formazione: {
    key: "formazione",
    text: "Formazione (Lavoratori o Datore di Lavoro)",
    min: 1709,
    max: 7404,
    consequences: ["Responsabilità penale diretta in caso di infortunio.", "Nullità di incarichi chiave (RLS, addetti antincendio, etc.).", "Dal 2025, la mancata formazione del Datore di Lavoro è violazione grave."],
    actions: ["Verificare immediatamente lo stato di tutti gli attestati.", "Iscrivere il personale ai corsi di aggiornamento.", "Pianificare il nuovo corso obbligatorio di 16 ore per il Datore di Lavoro."],
    fonte: "D.Lgs. 81/08 art. 37 + Nuovo Accordo Stato-Regioni 2025",
    priority: {
      order: 2,
      urgency: "CRITICITÀ #2"
    }
  },
  sorveglianza: {
    key: "sorveglianza",
    text: "Sorveglianza Sanitaria",
    min: 2316,
    max: 7632,
    consequences: ["Un dipendente senza giudizio di idoneità valido non può legalmente lavorare.", "Rischio di denuncia se un infortunio è correlato a una condizione non monitorata.", "L'ASP può disporre la sospensione dell'attività."],
    actions: ["Nominare (o verificare) il Medico Competente.", "Pianificare le visite mediche periodiche.", "Assicurarsi che il protocollo sanitario sia aggiornato ai rischi del DVR."],
    fonte: "D.Lgs. 81/08, Titolo I e X; Legge 203/2024",
    priority: {
      order: 3,
      urgency: "CRITICITÀ #3"
    }
  },
  emergenze: {
    key: "emergenze",
    text: "Gestione Emergenze",
    min: 1068,
    max: 5695,
    consequences: ["In caso di incendio o infortunio, la mancata organizzazione ti rende penalmente responsabile.", "Rischi l'arresto fino a 4 mesi se ci sono danni a persone.", "Sanzioni immediate in assenza di nomine e prove di evacuazione."],
    actions: ["Aggiornare il piano di emergenza.", "Nominare e formare addetti antincendio e primo soccorso.", "Tenere un registro infortuni aggiornato."],
    fonte: "D.Lgs. 81/08, Titolo I e II",
    priority: {
      order: 4,
      urgency: "CRITICITÀ #4"
    }
  },
  "patente-cantieri": {
    key: "patente-cantieri",
    text: "Patente a Crediti",
    min: 6000,
    max: 12000,
    consequences: ["Impossibilità di operare in qualsiasi cantiere.", "Esclusione automatica da gare e appalti.", "Sanzione min. €6.000 e blocco immediato dell'attività."],
    actions: ["Richiedere la patente all'Ispettorato del Lavoro.", "Verificare di avere almeno 15 crediti attivi.", "Frequentare corsi per recuperare eventuali crediti persi."],
    fonte: "D.L. 19/2024 (Decreto PNRR 4)",
    priority: {
      order: 1,
      urgency: "BLOCCANTE"
    }
  },
  "nuovo-assunto": {
    key: "nuovo-assunto",
    text: "Sequenza Pre-Assuntiva",
    min: 1474,
    max: 5926,
    consequences: ["Un neoassunto senza formazione non può lavorare legalmente.", "Responsabilità penale in caso di infortunio nei primi giorni.", "Ispettori verificano sempre le procedure di inserimento."],
    actions: ["Stabilire una checklist pre-assuntiva standard.", "Organizzare visita medica prima dell'inizio.", "Completare formazione generale e specifica entro i termini."],
    fonte: "D.Lgs. 81/08, art. 18, 37 e 41",
    priority: {
      order: 5,
      urgency: "FREQUENTE"
    }
  },
  "verifiche-inail": {
    key: "verifiche-inail",
    text: "Verifiche Periodiche Impianti",
    min: 1842,
    max: 7368,
    consequences: ["Uso di impianti non verificati comporta sanzioni e responsabilità penale.", "In caso di incidente, assicurazione può non coprire i danni.", "INAIL può sospendere l'attività fino alle verifiche."],
    actions: ["Programmare le verifiche con INAIL/ARPAV.", "Tenere registro manutenzioni aggiornato.", "Non utilizzare attrezzature con verifiche scadute."],
    fonte: "D.Lgs. 81/08, Allegato VII",
    priority: {
      order: 6,
      urgency: "TECNICO"
    }
  },
  attrezzature: {
    key: "attrezzature",
    text: "Manutenzione Attrezzature",
    min: 842,
    max: 4388,
    consequences: ["Attrezzature non manutenute sono causa frequente di infortuni.", "Responsabilità penale se l'infortunio dipende da mancata manutenzione.", "Sanzioni per ogni attrezzatura non documentata."],
    actions: ["Creare un registro delle manutenzioni.", "Pianificare controlli periodici.", "Documentare tutti gli interventi effettuati."],
    fonte: "D.Lgs. 81/08, Titolo III",
    priority: {
      order: 7,
      urgency: "STANDARD"
    }
  },
  "rischio-chimico": {
    key: "rischio-chimico",
    text: "Gestione Rischio Chimico",
    min: 1895,
    max: 7579,
    consequences: ["L'uso di sostanze chimiche senza valutazione è grave violazione.", "Rischi per la salute dei lavoratori non monitorati.", "Possibili sanzioni penali per danni da esposizione."],
    actions: ["Aggiornare la valutazione del rischio chimico.", "Raccogliere tutte le schede di sicurezza.", "Formare il personale sulle sostanze utilizzate."],
    fonte: "D.Lgs. 81/08, Titolo IX",
    priority: {
      order: 8,
      urgency: "SETTORIALE"
    }
  },
  "procedure-operative": {
    key: "procedure-operative",
    text: "Procedure Operative",
    min: 632,
    max: 3158,
    consequences: ["Lavorazioni senza procedure scritte comportano responsabilità in caso di infortunio.", "Difficoltà a dimostrare l'organizzazione aziendale all'ispettore.", "Impossibilità di formare correttamente i nuovi dipendenti."],
    actions: ["Redigere procedure per ogni mansione a rischio.", "Formare il personale sulle procedure.", "Aggiornare il Libro Unico del Lavoro."],
    fonte: "D.Lgs. 81/08, art. 18",
    priority: {
      order: 9,
      urgency: "ORGANIZZATIVO"
    }
  }
};
const caseStudies = [{
  id: 1,
  sector: "Alimentare",
  title: "Azienda Dolciaria - Provincia Catania",
  situation: "Controllo ispettivo in corso",
  challenge: "L'azienda ha ricevuto un controllo ispettivo e necessitava di adeguarsi rapidamente alla normativa sulla sicurezza aziendale.",
  solution: "Abbiamo organizzato corsi di formazione Art. 37 presso la sede, formato le figure aziendali tramite Ente Accreditato, coordinato visite mediche immediate e prodotto DVR, Piano Emergenza e verbali richiesti.",
  result: "In 20-25 giorni l'azienda ha presentato tutti i documenti richiesti ai funzionari",
  icon: "🍰"
}, {
  id: 2,
  sector: "Manifatturiero",
  title: "PMI Metalmeccanica - Provincia Siracusa",
  situation: "Necessità formazione senza budget",
  challenge: "L'azienda doveva formare tutto il personale sulla sicurezza ma non aveva budget disponibile per i corsi obbligatori.",
  solution: "Attraverso l'iscrizione a Fondi Interprofessionali, abbiamo erogato gratuitamente tutti i percorsi formativi necessari sulla sicurezza aziendale.",
  result: "Risparmio di oltre €2.200 sui costi di formazione standard",
  icon: "⚙️"
}, {
  id: 3,
  sector: "Tessile",
  title: "Azienda Confezioni - Provincia Messina",
  situation: "AUDIT esterno imminente",
  challenge: "L'azienda doveva superare un AUDIT di consulenti esterni su sicurezza e salubrità ambienti, con richieste molto specifiche.",
  solution: "Coordinato team di specialisti (tecnico DPI/estintori, Ingegnere formatore, Medico Competente), prodotto Piano Emergenza e DVR personalizzato secondo richieste AUDIT.",
  result: "Superamento dell'AUDIT con valutazione positiva",
  icon: "👔"
}];

// ==================== HELPER FUNCTIONS ====================
// Business logic functions for calculations and dynamic content generation.

function calculateViolations(answers) {
  return Object.keys(VIOLATIONS_CONFIG).filter(key => {
    const question = QUESTIONS.find(q => q.id === key);
    if (!question) return false;
    const isAnsweredNegative = ["no", "non-sicuro", "non-gestisco"].includes(answers[key]);
    if (!isAnsweredNegative) return false;
    if (question.conditional) {
      const dependentAnswer = answers[question.conditional.dependsOn];
      return dependentAnswer && question.conditional.showFor.includes(dependentAnswer);
    }
    return true;
  }).map(key => VIOLATIONS_CONFIG[key]).sort((a, b) => a.priority.order - b.priority.order);
}
function calculateRisk(baseScore, multiplier) {
  const finalScore = baseScore * multiplier;
  if (finalScore <= 4) return {
    level: "Basso",
    finalScore
  };
  if (finalScore <= 10) return {
    level: "Medio",
    finalScore
  };
  return {
    level: "Alto",
    finalScore
  };
}
function riskBadgeVariant(level) {
  if (level === "Basso") return "success";
  if (level === "Medio") return "warning";
  return "destructive";
}
function generateDynamicInsight(answers, violations) {
  const managementStyle = answers.gestione;
  const sector = answers.settore;
  const employees = answers.dipendenti;
  let urgency = "low";
  if (violations.length > 3 || employees === ">20") urgency = "high";else if (violations.length > 1 || employees === "11-20") urgency = "medium";
  const sectorInsights = {
    edilizia: {
      risk: "Il settore edile ha il 42% di probabilità di controllo annuale.",
      focus: "patente a crediti e formazione cantieri"
    },
    manifatturiero: {
      risk: "Il manifatturiero è sotto osservazione per infortuni e verifiche impianti.",
      focus: "verifiche INAIL e rischio chimico"
    },
    alimentare: {
      risk: "L'alimentare ha controlli congiunti ASP-NAS nel 68% dei casi.",
      focus: "HACCP e sorveglianza sanitaria"
    },
    trasporto: {
      risk: "Il trasporto e magazzinaggio hanno controlli mirati su sicurezza stradale e movimentazione.",
      focus: "verifiche INAIL e procedure operative"
    },
    default: {
      risk: "Il tuo settore ha controlli mirati basati su analisi del rischio.",
      focus: "documentazione base e formazione"
    }
  };
  const sectorInfo = sectorInsights[sector] || sectorInsights.default;
  if (violations.length === 0) {
    return {
      title: "📊 Ottimo risultato, ma non abbassare la guardia",
      text: `Sei conforme alle verifiche principali. ${sectorInfo.risk} Mantieni questo standard con un sistema di monitoraggio continuo.`,
      urgency: "low"
    };
  }
  const insights = {
    'gestisco-io': {
      title: "⚡ Gestisci tutto da solo: ammirevole ma rischioso",
      text: `Con ${violations.length} criticità rilevate e ${sectorInfo.risk}, il carico è troppo per una persona sola. Hai bisogno di un sistema che automatizzi i controlli, soprattutto su ${sectorInfo.focus}.`
    },
    'interno': {
      title: "👥 Il tuo team interno è sotto pressione",
      text: `${violations.length} non conformità mostrano che il carico supera le capacità interne. ${sectorInfo.risk} Un supporto specializzato alleggerisce il team su ${sectorInfo.focus}.`
    },
    'consulente': {
      title: "🔍 Il tuo consulente sta coprendo tutto?",
      text: `Nonostante il consulente, hai ${violations.length} criticità. ${sectorInfo.risk} Serve un sistema proattivo che preveda i problemi, non solo che li risolva. Focus: ${sectorInfo.focus}.`
    },
    'studi-multipli': {
      title: "🔄 Troppi professionisti, poca coordinazione",
      text: `${violations.length} criticità indicano mancanza di coordinamento tra i tuoi consulenti. ${sectorInfo.risk} Serve una regia unica, specialmente per ${sectorInfo.focus}.`
    }
  };
  const insight = insights[managementStyle] || {
    title: "⚠️ Il tuo sistema ha delle falle",
    text: `${violations.length} non conformità rilevate. ${sectorInfo.risk} È il momento di ripensare l'approccio alla sicurezza, partendo da ${sectorInfo.focus}.`
  };
  return {
    ...insight,
    urgency
  };
}
function generatePersonalizedAdvantages(answers) {
  const managementStyle = answers.gestione;
  const baseAdvantages = {
    "gestisco-io": ["🎯 Mantieni il controllo totale con supporto tecnico invisibile", "📱 Piattaforma digitale 24/7 per consultare tutta la documentazione", "🔄 Coordinamento automatico figure SPP senza perdere la regia", "💰 Accesso esclusivo a fondi interprofessionali e bonus fiscali"],
    "interno": ["💪 Potenziamento del team con strumenti professionali", "📊 Riduzione 70% carico amministrativo interno", "🛡️ Sistema backup: continuità anche in assenza del responsabile", "🚀 Risposte prioritarie dalla rete di specialisti certificati"],
    "consulente": ["✅ Audit indipendente di copertura del consulente attuale", "🤝 Integrazione trasparente o transizione guidata", "📈 KPI misurabili per monitorare le prestazioni", "⏰ Alert automatici 30-60 giorni prima delle scadenze"],
    "studi-multipli": ["🎭 Regia unica per coordinare tutti i fornitori", "📋 Monitoraggio centralizzato scadenze e standard", "🔗 Eliminazione sovrapposizioni e buchi operativi", "📱 Piattaforma digitale 24/7 sempre accessibile"]
  };
  let advantages = [...(baseAdvantages[managementStyle] || baseAdvantages["gestisco-io"])];
  
  // Create a set of advantage texts to check for duplicates (not just emojis)
  const existingTexts = new Set(advantages.map(a => a.trim()));
  
  const alertText = "⏰ Alert automatici 30-60 giorni prima delle scadenze";
  const platformText = "📱 Piattaforma 24/7 sempre accessibile";
  const specialistsText = "🚀 Rete specialisti con risposte prioritarie";
  const fundsText = "💰 Accesso a fondi e agevolazioni disponibili";
  
  if (!existingTexts.has(alertText)) {
    advantages.push(alertText);
    existingTexts.add(alertText);
  }
  if (!existingTexts.has(platformText) && managementStyle !== "gestisco-io" && managementStyle !== "studi-multipli") {
    advantages.push(platformText);
    existingTexts.add(platformText);
  }
  if (!existingTexts.has(specialistsText) && managementStyle !== "interno") {
    advantages.push(specialistsText);
    existingTexts.add(specialistsText);
  }
  if (!existingTexts.has(fundsText) && managementStyle !== "gestisco-io") {
    advantages.push(fundsText);
    existingTexts.add(fundsText);
  }
  return advantages.slice(0, 5);
}
function calculateSanctionDetails(answers, violations) {
  const noAnswers = Object.values(answers).filter(a => a === "no").length;
  const unsureAnswers = Object.values(answers).filter(a => a === "non-sicuro" || a === "non-gestisco").length;
  const totalQuestions = Object.keys(answers).length;
  return {
    violations: violations.length,
    noAnswers,
    unsureAnswers,
    totalAnswered: totalQuestions,
    sanctionBreakdown: violations.map(v => ({
      name: v.text,
      max: v.max
    }))
  };
}
const filterQuestions = answers => {
  return QUESTIONS.filter(q => {
    if (!q.conditional) return true;
    const dependentAnswer = answers[q.conditional.dependsOn];
    return dependentAnswer && q.conditional.showFor.includes(dependentAnswer);
  });
};

// ==================== STATE MANAGEMENT ====================
const initialState = {
  stage: "intro",
  currentQuestionIndex: 0,
  answers: {},
  baseScore: 0,
  multiplier: 1
};
const quizReducer = (state, action) => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        stage: "quiz"
      };
    case 'SELECT_OPTION':
      {
        const {
          question,
          option
        } = action;
        const newAnswers = {
          ...state.answers,
          [question.id]: option.value
        };
        let newBaseScore = state.baseScore;
        let newMultiplier = state.multiplier;
        if (question.type === "score") {
          const prevOption = question.options.find(o => o.value === state.answers[question.id]);
          newBaseScore = state.baseScore - (prevOption?.weight || 0) + (option.weight || 0);
        } else if (question.type === "multiplier") {
          const prevOption = question.options.find(o => o.value === state.answers[question.id]);
          const prevMul = prevOption?.multiplier || 1;
          newMultiplier = state.multiplier / prevMul * (option.multiplier || 1);
        }
        return {
          ...state,
          answers: newAnswers,
          baseScore: newBaseScore,
          multiplier: newMultiplier
        };
      }
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1
      };
    case 'GO_BACK':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      };
    case 'START_LOADING':
      return {
        ...state,
        stage: "loading"
      };
    case 'SHOW_RESULTS':
      return {
        ...state,
        stage: "results"
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// ==================== STAGE COMPONENTS ====================

const IntroStage = memo(({
  onStart
}: IntroStageProps) => {
  const [activeObjection, setActiveObjection] = useState(0);
  const objections = [{
    title: "È adatto a me?",
    icon: "🎯",
    content: "Il test è progettato per TUTTE le aziende siciliane, da 1 a 100+ dipendenti. Edilizia, alimentare, manifattura, servizi: ogni settore ha domande specifiche. In 2 minuti scopri esattamente cosa rischi TU."
  }, {
    title: "Non ho tempo",
    icon: "⏱️",
    content: "2 minuti ora vs settimane di chiusura dopo. Un controllo può bloccarti l'attività per 30 giorni. Il test richiede meno tempo di un caffè, ma può salvarti da mesi di problemi."
  }, {
    title: "Sono già coperto",
    icon: "✅",
    content: "Ottimo! Ma sei sicuro al 100%? Le norme cambiano ogni 6 mesi. Dal 2025 ci sono nuovi obblighi formativi. Un secondo parere gratuito non costa nulla, ma può rivelare sorprese costose."
  }, {
    title: "Non mi controllano",
    icon: "🔍",
    content: "Nel 2024: 158.000 controlli, 74% aziende irregolari. Con i nuovi 'Piani Mirati di Prevenzione', i controlli non sono più casuali. Se hai dipendenti, sei già in una lista."
  }];
  return <section aria-labelledby="intro-title">
      <div className="text-center py-5">
        <div className="w-20 h-20 bg-white border-2 border-red-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden mx-auto">
          <img src="/lovable-uploads/53e4bec6-be78-459e-a5a5-a2b8ae560a04.png" alt="Spazio Impresa Logo" className="w-full h-full object-contain p-1" />
        </div>
      </div>
      <Card className="border-2 border-red-600 shadow-2xl">
        <CardContent className="p-4 sm:p-6">
          <h1 id="intro-title" className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4 leading-tight">
            <span className="text-black">Se l'</span><span className="text-red-600">Ispettore</span><span className="text-black"> bussa domani?</span>
          </h1>
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-lg sm:text-xl font-bold text-black mb-3">Sei pronto? O <span className="text-red-600">rischi multe e guai legali</span> come il 74% dei colleghi siciliani che si sentivano coperti?</p>
            <div className="text-center mb-3">
              <Button onClick={onStart} size="lg" className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:scale-105 transition-all duration-300">
                SCOPRI ORA SE È TUTTO OK →
              </Button>
            </div>
            <div className="inline-block bg-yellow-400 text-black px-2 py-1 rounded text-[10px] font-semibold border border-black mb-2">
              ⚡ QUIZ GRATUITO • 2 MINUTI • RISULTATI IMMEDIATI
            </div>
            <p className="text-xs text-gray-600">
              <strong>Testato su 847 titolari siciliani - nessun dato richiesto</strong>
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-center mb-2 sm:mb-3 text-red-700">🚨 Dati Ufficiali Sicilia 2024-25</h2>
            <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center">
              <div className="bg-white p-2 sm:p-3 rounded border"><div className="text-xl sm:text-2xl font-black text-red-600">158K</div><div className="text-xs font-medium text-black">Controlli INL</div></div>
              <div className="bg-white p-2 sm:p-3 rounded border"><div className="text-xl sm:text-2xl font-black text-red-600">74%</div><div className="text-xs font-medium text-black">Aziende Irregolari</div></div>
              <div className="bg-white p-2 sm:p-3 rounded border"><div className="text-xl sm:text-2xl font-black text-red-600">€900K</div><div className="text-xs font-medium text-black">Sanzioni CT</div></div>
            </div>
            <p className="text-center text-xs text-red-600 mt-2 font-medium">Fonte: INL 2024 + ASP Catania SPRESAL</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {objections.map((obj, idx) => <button key={idx} onClick={() => setActiveObjection(idx)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${activeObjection === idx ? "bg-yellow-400 text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
                  {obj.icon} {obj.title}
                </button>)}
            </div>
            <div className="bg-black text-white p-3 rounded">
              <div className="font-bold text-yellow-400 mb-2">{objections[activeObjection].icon} {objections[activeObjection].title}</div>
              <p className="text-sm">{objections[activeObjection].content}</p>
            </div>
          </div>
          <div className="text-center">
            <Button onClick={onStart} variant="outline" className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              Fai il test ora (è gratis)
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>;
});
const QuizStage = memo(({
  question,
  currentQuestionIndex,
  totalQuestions,
  answers,
  onSelectOption,
  onGoBack
}: QuizStageProps) => {
  const progress = totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions * 100 : 0;
  return <section aria-labelledby="quiz-title" className="space-y-4">
      <Card>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <div className="h-3 w-full rounded bg-gray-200 overflow-hidden">
              <div className="h-3 rounded bg-gradient-to-r from-red-600 to-red-800 transition-all duration-500 ease-out" style={{
              width: `${progress}%`
            }} />
            </div>
             <p className="mt-2 text-center text-xs sm:text-sm text-gray-500">
              Domanda {currentQuestionIndex + 1} di {totalQuestions}
            </p>
          </div>
          {question && <div>
              <h2 className="text-lg sm:text-xl font-semibold">{question.title}</h2>
              {question.subtitle && <p className="mt-1 text-xs sm:text-sm text-gray-500">{question.subtitle}</p>}
              <div className="mt-4 grid gap-2 sm:gap-3">
                {question.options.map(opt => {
              const selected = answers[question.id] === opt.value;
              return <button key={opt.value} onClick={() => onSelectOption(question, opt)} className={`flex w-full items-center gap-3 rounded-md border-2 p-3 sm:p-4 text-left transition-all hover:shadow-md active:scale-[0.98] ${selected ? "border-red-600 bg-red-50 shadow-md" : "border-gray-300 hover:border-red-400 hover:bg-red-50/50"}`}>
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-white transition-all ${selected ? "border-red-600 bg-red-600 scale-110" : "border-gray-400"}`}>
                        {selected && "✓"}
                      </div>
                      <span className="text-sm sm:text-base">{opt.label}</span>
                    </button>;
            })}
              </div>
            </div>}
        </CardContent>
      </Card>
      <div className="flex justify-start">
        <Button variant="ghost" size="sm" onClick={onGoBack} disabled={currentQuestionIndex === 0}>
          ← Indietro
        </Button>
      </div>
    </section>;
});
const LoadingStage = memo(() => <section aria-live="polite">
    <Card>
      <CardContent className="p-8 sm:p-10 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
        <h2 className="text-lg sm:text-xl font-semibold">Analisi in corso...</h2>
        <p className="text-sm sm:text-base text-gray-500">Confrontiamo le tue risposte con i protocolli ispettivi 2025/2026</p>
      </CardContent>
    </Card>
  </section>);
const ResultsStage = memo(({
  risk,
  violations,
  answers,
  onReset
}: ResultsStageProps) => {
  const [showCalculation, setShowCalculation] = useState(false);
  const [currentCaseStudy, setCurrentCaseStudy] = useState(0);
  
  // Auto-scroll case studies every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCaseStudy(prev => (prev + 1) % caseStudies.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, []);
  
  const sanctionMax = violations.reduce((total, v) => total + v.max, 0);
  const getSectorName = () => answers.settore && {
    edilizia: "Edilizia",
    alimentare: "Alloggio/Ristorazione",
    manifatturiero: "Manifatturiero",
    servizi: "Servizi",
    commercio: "Commercio",
    agricoltura: "Agricoltura",
    trasporto: "Trasporto/Magazzinaggio"
  }[answers.settore] || "Servizi";
  const sanctionDetails = useMemo(() => calculateSanctionDetails(answers, violations), [answers, violations]);
  const dynamicInsight = useMemo(() => generateDynamicInsight(answers, violations), [answers, violations]);
  const personalizedAdvantages = useMemo(() => generatePersonalizedAdvantages(answers), [answers]);
  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(`Ciao Spazio Impresa! Ho completato il test (rischio ${risk.level}). Vorrei prenotare la mia Analisi Strategica Gratuita per la mia azienda nel settore ${getSectorName()}.`);
    return `https://wa.me/${CONFIG.contact.whatsapp}?text=${text}`;
  }, [risk.level, answers.settore]);

  // FIX: Anchor link handler
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section aria-labelledby="results-title" className="space-y-4 sm:space-y-6">
      <Card className="border-2 border-red-600 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <Badge variant={riskBadgeVariant(risk.level)} className="mb-3 sm:mb-4 text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
              Rischio {risk.level}
            </Badge>
            
          </div>
          {violations.length > 0 ? <div className="mt-4 sm:mt-6">
              <div className="rounded-lg border-2 border-black bg-white p-4 sm:p-6 text-center shadow-inner">
                <div className="text-3xl sm:text-5xl font-black text-red-600 mb-2 sm:mb-3">€{sanctionMax.toLocaleString("it-IT")}</div>
                <div className="text-sm sm:text-base text-black font-semibold">È la sanzione massima che rischi OGGI se l'ispettore suona il campanello.</div>
                <button onClick={() => setShowCalculation(!showCalculation)} className="mt-3 text-xs sm:text-sm text-gray-600 hover:text-black font-medium flex items-center justify-center gap-1 mx-auto transition-colors">
                  <span>Come abbiamo ottenuto questa cifra?</span>
                  <span className={`transition-transform ${showCalculation ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showCalculation && <div className="mt-3 p-3 bg-gray-50 rounded border text-left text-xs sm:text-sm">
                    <h4 className="font-bold mb-2">📊 Base di calcolo:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>{sanctionDetails.violations} criticità rilevate</strong> dalle tue risposte</li>
                      <li>• {sanctionDetails.noAnswers} risposte "No" (non conformità certe)</li>
                      <li>• {sanctionDetails.unsureAnswers} risposte "Non sono sicuro" (rischi probabili)</li>
                      <li>• Su {sanctionDetails.totalAnswered} controlli verificati per il tuo settore</li>
                    </ul>
                    {sanctionDetails.sanctionBreakdown.length > 0 && <>
                        <h4 className="font-bold mt-3 mb-2">💰 Dettaglio sanzioni:</h4>
                        <ul className="space-y-1">
                          {sanctionDetails.sanctionBreakdown.map((item, idx) => <li key={idx} className="flex justify-between"><span>{item.name}:</span><span className="font-semibold">fino a €{item.max.toLocaleString('it-IT')}</span></li>)}
                        </ul>
                      </>}
                    <p className="mt-3 text-xs text-gray-600">* Sanzioni cumulative secondo D.Lgs. 81/08, rivalutate +15,9% dal 06/10/2023</p>
                  </div>}
              </div>
            </div> : <div className="mt-4 sm:mt-6 rounded-lg border-2 border-green-500 bg-green-50 p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">🎯 COMPLIMENTI!</div>
              <div className="text-sm sm:text-base text-green-800 font-semibold">Sulla base delle tue risposte, la tua azienda appare conforme ai controlli ispettivi più frequenti.</div>
            </div>}
        </CardContent>
      </Card>
      
      <div className={`rounded-lg p-4 sm:p-6 text-center shadow-lg ${dynamicInsight.urgency === "high" ? "bg-red-900 text-white" : dynamicInsight.urgency === "medium" ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"}`}>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{dynamicInsight.title}</h2>
        <p className="text-sm sm:text-base max-w-2xl mx-auto opacity-90">{dynamicInsight.text}</p>
        <a href="#vantaggi-spazio-impresa" onClick={e => handleScrollTo(e, 'vantaggi-spazio-impresa')} className="inline-block mt-4 text-sm font-semibold underline hover:no-underline">Scopri come Spazio Impresa può aiutarti →</a>
      </div>
      
      {violations.length > 0 && <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle>Dettaglio Rischi e Soluzioni</CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">(clicca sulle opzioni per approfondire)</p>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            {violations.map((v, index) => <details key={v.key} className="group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                <summary className="p-3 sm:p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">{index + 1}</span>
                    <span className="font-semibold text-sm sm:text-base truncate">{v.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs flex-shrink-0">{v.priority.urgency}</Badge>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </div>
                </summary>
                <div className="p-3 sm:p-4 border-t bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                      <h4 className="font-bold text-sm mb-2">⚠️ Rischi</h4>
                      <ul className="text-xs sm:text-sm space-y-1">{v.consequences.map((c, i) => <li key={i} className="flex items-start"><span className="text-red-500 mr-1">•</span><span>{c}</span></li>)}</ul>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                      <h4 className="font-bold text-sm mb-2">✅ Azioni</h4>
                      <ul className="text-xs sm:text-sm space-y-1">{v.actions.map((a, i) => <li key={i} className="flex items-start"><span className="text-green-500 mr-1">•</span><span>{a}</span></li>)}</ul>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 pt-2 mt-3 border-t"><strong>📖 Normativa:</strong> {v.fonte}</div>
                </div>
              </details>)}
          </CardContent>
        </Card>}
      
      <Card id="vantaggi-spazio-impresa" className="bg-gradient-to-br from-gray-900 to-black text-white">
        <CardHeader><CardTitle className="text-white">Come possiamo aiutarti - Sistema Spazio Impresa</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4">
            {personalizedAdvantages.map((advantage, index) => <div key={index} className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                <span className="text-lg sm:text-xl">{advantage.substring(0, 2)}</span>
                <span className="text-sm sm:text-base">{advantage.substring(2)}</span>
              </div>)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Casi di successo</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(-${currentCaseStudy * 100}%)`
            }}>
                {caseStudies.map((study, idx) => <div key={idx} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                      <div className="mb-5">
                        <h3 className="font-bold text-lg text-black mb-2">{study.title}</h3>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200">
                          <span className="text-sm font-medium text-red-600">{study.situation}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-red-600 text-sm mb-2">SFIDA</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{study.challenge}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-black text-sm mb-2">SOLUZIONE</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{study.solution}</p>
                        </div>
                        <div className="bg-red-600 rounded-lg p-4">
                          <h4 className="font-semibold text-white text-sm mb-2">RISULTATO</h4>
                          <p className="text-sm font-medium text-white">{study.result}</p>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              {caseStudies.map((_, idx) => <button key={idx} onClick={() => setCurrentCaseStudy(idx)} className={`transition-all duration-300 rounded-full border-2 ${currentCaseStudy === idx ? "w-10 h-4 bg-gradient-to-r from-red-600 to-black border-red-600 shadow-lg" : "w-4 h-4 bg-white border-gray-400 hover:border-red-400 hover:bg-red-50"}`} aria-label={`Vai al caso studio ${idx + 1}`} />)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cosa include il Sistema Organizzativo di Spazio Impresa:</CardTitle></CardHeader>
        <CardContent>
            <ul className="space-y-2 text-sm sm:text-base">
                <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Gestione scadenze visite mediche e attestati di formazione</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Archivio documentale digitale 24/7</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Alert automatici personalizzati</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Supporto in caso di controlli ispettivi</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">✔</span><span>Erogazione corsi tramite i Fondi Interprofessionali</span></li>
            </ul>
        </CardContent>
      </Card>
      
      <div className="rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 text-center shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">Trasforma il rischio in tranquillità</h2>
        <p className="text-sm sm:text-lg text-gray-700 mb-4 max-w-xl mx-auto">Prenota la tua <strong>Analisi Strategica Gratuita</strong>. 30 minuti, zero impegno, piano d'azione personalizzato.</p>
        <div className="my-6 p-4 bg-white rounded border text-left text-sm max-w-md mx-auto">
          <h4 className="font-bold text-center mb-3">Cosa otterrai (gratuitamente):</h4>
          <ul className="space-y-2">
            <li className="flex items-start"><span className="text-green-500 mr-2 font-bold">✓</span><span><strong>Check-up Conformità 2025-2026:</strong> La tua posizione rispetto ai nuovi obblighi normativi.</span></li>
            <li className="flex items-start"><span className="text-green-500 mr-2 font-bold">✓</span><span><strong>Mappatura Scadenze Critiche:</strong> Le date da cerchiare in rosso sul calendario.</span></li>
            <li className="flex items-start"><span className="text-green-500 mr-2 font-bold">✓</span><span><strong>Analisi Formazione Finanziata:</strong> Verifica opportunità formative gratuite con i Fondi Interprofessionali.</span></li>
          </ul>
        </div>
        <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-4 sm:justify-center">
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="block"><Button size="lg" variant="success" className="w-full">💬 Prenota via WhatsApp</Button></a>
          <a href={`tel:${CONFIG.contact.phone}`} className="block"><Button size="lg" variant="outline" className="w-full">📞 Chiama {CONFIG.contact.phone}</Button></a>
        </div>
        <p className="text-xs text-gray-600 mt-4"><strong>🏠 Riservato ad aziende siciliane</strong> • Risposta entro 2h in orario di lavoro</p>
      </div>
      
      <div className="text-center mt-6">
        <Button variant="ghost" onClick={onReset}>Rifai il test per un'altra azienda</Button>
      </div>
    </section>;
});

//  MAIN APP COMPONENT =
export default function OptimizedQuizApp() {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const {
    stage,
    currentQuestionIndex,
    answers,
    baseScore,
    multiplier
  } = state;
  const filteredQuestions = useMemo(() => filterQuestions(answers), [answers]);
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const risk = useMemo(() => calculateRisk(baseScore, multiplier), [baseScore, multiplier]);
  const violations = useMemo(() => calculateViolations(answers), [answers]);
  const totalQuestionsForDisplay = useMemo(() => {
    if (answers.settore) {
      return filteredQuestions.length;
    }
    return 10; // Default to 10 for a better initial UX
  }, [answers.settore, filteredQuestions.length]);
  const handleStart = useCallback(() => dispatch({
    type: 'START_QUIZ'
  }), []);
  const handleGoBack = useCallback(() => dispatch({
    type: 'GO_BACK'
  }), []);
  const handleReset = useCallback(() => dispatch({
    type: 'RESET'
  }), []);
  const handleSelectOption = useCallback((question, option) => {
    dispatch({
      type: 'SELECT_OPTION',
      question,
      option
    });
    setTimeout(() => {
      const newAnswers = {
        ...answers,
        [question.id]: option.value
      };
      const nextFiltered = filterQuestions(newAnswers);
      if (currentQuestionIndex < nextFiltered.length - 1) {
        dispatch({
          type: 'NEXT_QUESTION'
        });
      } else {
        dispatch({
          type: 'START_LOADING'
        });
        setTimeout(() => dispatch({
          type: 'SHOW_RESULTS'
        }), CONFIG.ui.loadingDelay);
      }
    }, CONFIG.ui.transitionDelay);
  }, [currentQuestionIndex, answers]);
  const renderStage = () => {
    switch (stage) {
      case "quiz":
        return <QuizStage question={currentQuestion} currentQuestionIndex={currentQuestionIndex} totalQuestions={totalQuestionsForDisplay} answers={answers} onSelectOption={handleSelectOption} onGoBack={handleGoBack} />;
      case "loading":
        return <LoadingStage />;
      case "results":
        return <ResultsStage risk={risk} violations={violations} answers={answers} onReset={handleReset} />;
      case "intro":
      default:
        return <IntroStage onStart={handleStart} />;
    }
  };
  return <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 text-center text-xs z-50">
        Test basato su D.Lgs. 81/08 aggiornato 2025 e protocolli ispettivi INL/ASP/SPRESAL Sicilia 2024-25
      </div>
      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8 pb-16">
        {renderStage()}
      </main>
    </div>;
}