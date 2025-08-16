import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Tipi
type Option = {
  value: string;
  label: string;
  weight?: number;
  multiplier?: number;
};

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: "multiplier" | "score";
  options: Option[];
};

type Answers = Record<string, string>;

type Violation = {
  key: string;
  text: string;
  min: number;
  max: number;
  consequences: string[];
  actions: string[];
  fonte: string;
  priority: {
    order: number;
    urgency: string;
    reason: string;
  };
};

const baseQuestions: Question[] = [
  {
    id: "gestione",
    title: "Come gestisci attualmente la sicurezza aziendale?",
    subtitle: "Scegli l'opzione più vicina alla tua situazione",
    type: "multiplier",
    options: [
      {
        value: "gestisco-io",
        label: "Gestisco tutto io in prima persona",
        multiplier: 1.5
      },
      {
        value: "interno",
        label: "Internamente c'è una persona che gestisce la sicurezza aziendale",
        multiplier: 1.3
      },
      {
        value: "consulente",
        label: "Ho un consulente che si occupa di tutto",
        multiplier: 1
      },
      {
        value: "studi-multipli",
        label: "Ho diversi studi professionali che si occupano ognuno di aspetti diversi",
        multiplier: 1.2
      }
    ]
  },
  {
    id: "dipendenti",
    title: "Quanti dipendenti ha la tua azienda?",
    subtitle: "Serve per calcoli personalizzati su costi formazione",
    type: "multiplier",
    options: [
      {
        value: "1-5",
        label: "1-5 dipendenti",
        multiplier: 1
      },
      {
        value: "6-10",
        label: "6-10 dipendenti",
        multiplier: 1.5
      },
      {
        value: "11-20",
        label: "11-20 dipendenti",
        multiplier: 2
      },
      {
        value: ">20",
        label: "Oltre 20 dipendenti",
        multiplier: 2.5
      }
    ]
  },
  {
    id: "settore",
    title: "In quale settore opera principalmente la tua azienda?",
    subtitle: "Ogni settore ha frequenze di controllo e rischi diversi",
    type: "multiplier",
    options: [
      {
        value: "edilizia",
        label: "Edilizia/Costruzioni",
        multiplier: 2
      },
      {
        value: "manifatturiero",
        label: "Manifatturiero/Produzione",
        multiplier: 1.6
      },
      {
        value: "alimentare",
        label: "Alimentare/Ristorazione",
        multiplier: 1.5
      },
      {
        value: "servizi",
        label: "Servizi/Consulenza",
        multiplier: 1.2
      },
      {
        value: "commercio",
        label: "Commercio/Retail",
        multiplier: 1.2
      },
      {
        value: "agricoltura",
        label: "Agricoltura/Allevamento",
        multiplier: 1.6
      }
    ]
  },
  {
    id: "dvr",
    title: "L'ispettore ti dice: 'Fammi vedere DVR aggiornato, nomine RSPP e verbali riunioni'. Hai tutto pronto?",
    subtitle: "Primo controllo sempre richiesto - Fonte: Protocolli ASL/INL 2024",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "formazione",
    title: "L'ispettore controlla 3 dipendenti A CASO + il DATORE DI LAVORO: trovi tutti gli attestati validi?",
    subtitle: "Include nuovo obbligo formazione datori 16 ore (Accordo Stato-Regioni 2025)",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "sorveglianza",
    title: "Sorveglianza sanitaria: giudizi idoneità ultimi 2 anni + protocollo medico competente aggiornato?",
    subtitle: "Controllo cartelle mediche - Verifica protocolli MC",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  },
  {
    id: "emergenze",
    title: "Piano emergenza, addetti primo soccorso/antincendio E registro infortuni: tutto a posto?",
    subtitle: "Due controlli prioritari sempre verificati insieme",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
    ]
  }
];

const getConditionalQuestion8 = (answers: Answers): Question => {
  if (answers.settore === 'edilizia') {
    return {
      id: "patente-crediti",
      title: "Hai la patente a crediti cantieri con almeno 15 punti attivi?",
      subtitle: "OBBLIGATORIA dal 1° ottobre 2024 - Esclusione immediata senza",
      type: "score",
      options: [
        { value: "si", label: "Sì", weight: 0 },
        { value: "no", label: "No", weight: 3 },
        { value: "non-sicuro", label: "Non sono sicuro", weight: 2 }
      ]
    };
  } else {
    return {
      id: "sequenza-assunzioni",
      title: "Ultimo assunto: hai completato visita preventiva, formazione e DPI PRIMA dell'inizio lavoro?",
      subtitle: "Sequenza obbligatoria pre-assuntiva - Controllo prioritario",
      type: "score",
      options: [
        { value: "si", label: "Sì", weight: 0 },
        { value: "no", label: "No", weight: 2 },
        { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
      ]
    };
  }
};

const getConditionalQuestion9 = (answers: Answers): Question => {
  if (['manifatturiero', 'edilizia'].includes(answers.settore)) {
    return {
      id: "verifiche-periodiche",
      title: "Hai i verbali delle verifiche periodiche INAIL/ARPAV per impianti e attrezzature?",
      subtitle: "Sollevamento, pressione, messa a terra - D.Lgs 81/08 Allegato VII",
      type: "score",
      options: [
        { value: "si", label: "Sì", weight: 0 },
        { value: "no", label: "No", weight: 2 },
        { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
      ]
    };
  } else {
    return {
      id: "attrezzature-lavoro",
      title: "Attrezzature di lavoro: hai libretto uso/manutenzione e registro controlli aggiornati?",
      subtitle: "Manutenzione programmata e tracciabilità interventi",
      type: "score",
      options: [
        { value: "si", label: "Sì", weight: 0 },
        { value: "no", label: "No", weight: 2 },
        { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
      ]
    };
  }
};

const getConditionalQuestion10 = (answers: Answers): Question => {
  if (['manifatturiero', 'alimentare'].includes(answers.settore)) {
    return {
      id: "lul-chimici",
      title: "Libro Unico Lavoro aggiornato + schede sicurezza sostanze e valutazione rischio chimico?",
      subtitle: "Controllo standard + specifico settoriale",
      type: "score",
      options: [
        { value: "si", label: "Sì", weight: 0 },
        { value: "no", label: "No", weight: 2 },
        { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
      ]
    };
  } else {
    return {
      id: "lul-procedure",
      title: "Libro Unico Lavoro aggiornato + procedure operative scritte per mansioni a rischio?",
      subtitle: "Gestione amministrativa + procedure di sicurezza",
      type: "score",
      options: [
        { value: "si", label: "Sì", weight: 0 },
        { value: "no", label: "No", weight: 2 },
        { value: "non-sicuro", label: "Non sono sicuro", weight: 1 }
      ]
    };
  }
};

const violationsConfig: Record<string, Violation> = {
  dvr: {
    key: "dvr",
    text: "DVR non aggiornato o mancante",
    min: 2894,
    max: 7404,
    consequences: [
      "Primo controllo sempre richiesto - presente nel 100% delle 859 ispezioni ASP Catania",
      "Arresto 3-6 mesi + responsabilità penale diretta del datore",
      "Base per tutte le altre violazioni - senza DVR tutto è irregolare",
      "Sospensione attività se combinato con altre gravi violazioni"
    ],
    actions: ["Aggiorna DVR e nomine RSPP/Addetti", "Programma riunione periodica e verbalizza"],
    fonte: "D.Lgs. 81/08 Art. 17, 18, 28 - Sanzioni rivalutate +15,9% (2023)",
    priority: { order: 1, urgency: "PRIMO", reason: "Controllato nel 100% delle ispezioni - base di tutto" }
  },
  formazione: {
    key: "formazione",
    text: "Formazione non conforme o scaduta",
    min: 1709,
    max: 7404,
    consequences: [
      "27,1% delle violazioni totali rilevate nelle 83.330 violazioni nazionali 2024",
      "Include NUOVO obbligo formazione datori 16 ore (Accordo Stato-Regioni 2025)",
      "Responsabilità penale se infortunio su lavoratore non formato",
      "Sanzioni raddoppiate oltre 5 dipendenti, triplicate oltre 10"
    ],
    actions: ["Verifica formazione datori (16 ore + 6 ore cantieri)", "Aggiorna attestati lavoratori con verifica finale"],
    fonte: "D.Lgs. 81/08 Art. 37 + Accordo Stato-Regioni 17/04/2025",
    priority: { order: 2, urgency: "SECONDO", reason: "Secondo controllo per frequenza - nuovo obbligo datori" }
  },
  sorveglianza: {
    key: "sorveglianza",
    text: "Sorveglianza sanitaria incompleta",
    min: 2316,
    max: 7632,
    consequences: [
      "Se manca il giudizio medico, non puoi far lavorare il dipendente per legge",
      "In caso di infortunio, rischi denuncia per lesioni o omicidio colposo",
      "L'INAIL può rifiutare la copertura assicurativa",
      "L'ASL può disporre la sospensione dell'attività"
    ],
    actions: ["Nomina medico competente", "Pianifica visite e giudizi idoneità per tutti gli esposti"],
    fonte: "D.Lgs. 81/08, Titolo I e X; legge 203/2024",
    priority: { order: 3, urgency: "TERZO", reason: "Verifica cartelle mediche" }
  },
  emergenze: {
    key: "emergenze",
    text: "Procedure emergenza non conformi",
    min: 1068,
    max: 5695,
    consequences: [
      "Se c'è un'emergenza, puoi essere penalmente responsabile",
      "Rischi arresto fino a 4 mesi se ci sono danni a persone",
      "I clienti o visitatori coinvolti possono chiedere risarcimenti",
      "In assenza di prove di evacuazione o nomine → sanzione immediata"
    ],
    actions: ["Aggiorna piano di emergenza ed evacuazione", "Nomina e forma addetti primo soccorso/antincendio"],
    fonte: "D.Lgs. 81/08, Titolo I e II",
    priority: { order: 4, urgency: "QUARTO", reason: "Procedure emergenza" }
  },
  "patente-crediti": {
    key: "patente-crediti",
    text: "Patente crediti cantieri mancante o punti insufficienti",
    min: 0,
    max: 0,
    consequences: [
      "🚫 STOP LAVORI immediato - non è una sanzione, è ESCLUSIONE totale",
      "Impossibilità accesso a qualsiasi cantiere pubblico o privato",
      "Obbligo committenti verificare possesso - responsabilità solidale",
      "Reintegro crediti solo tramite formazione aggiuntiva specifica"
    ],
    actions: [
      "Richiesta immediata patente crediti INL se mancante",
      "Verifica punteggio attuale (minimo 15 per operare)",
      "Corsi recupero crediti se necessario"
    ],
    fonte: "D.L. 48/2023 conv. L. 85/2023 Art. 29-bis - Operativa 1° ottobre 2024",
    priority: { order: 1, urgency: "BLOCCANTE", reason: "Senza patente = ZERO possibilità di lavorare" }
  },
  "sequenza-assunzioni": {
    key: "sequenza-assunzioni",
    text: "Procedure assunzioni incomplete",
    min: 3000,
    max: 15000,
    consequences: [
      "Senza visita pre-assuntiva, il contratto può essere legalmente contestato",
      "Rischi multe multiple per ogni obbligo non rispettato (DPI, formazione, ecc.)",
      "Se il personale lavora senza idoneità → scatta la sospensione",
      "Il lavoratore può contestare l'assunzione anche a distanza di anni"
    ],
    actions: ["Verifica sequenza: visita, formazione, DPI prima dell'avvio", "Predisponi check-list di ingresso"],
    fonte: "D.Lgs. 81/08; obblighi preassuntivi rafforzati 2024",
    priority: { order: 5, urgency: "QUINTO", reason: "Sequenza assunzioni" }
  },
  "verifiche-periodiche": {
    key: "verifiche-periodiche",
    text: "Verifiche periodiche INAIL/ARPAV mancanti",
    min: 2000,
    max: 8000,
    consequences: [
      "Attrezzature non verificate = divieto utilizzo immediato",
      "Responsabilità penale per infortuni su attrezzature non conformi",
      "Multe crescenti per ogni attrezzatura non verificata",
      "Possibile sequestro preventivo delle attrezzature"
    ],
    actions: ["Programmazione verifiche con enti abilitati", "Aggiornamento registro controlli"],
    fonte: "D.Lgs. 81/08 Allegato VII - Verifiche periodiche obbligatorie",
    priority: { order: 6, urgency: "STANDARD", reason: "Controllo tecnico attrezzature" }
  },
  "attrezzature-lavoro": {
    key: "attrezzature-lavoro",
    text: "Manutenzione attrezzature non documentata",
    min: 1500,
    max: 6000,
    consequences: [
      "Mancanza registri = presunzione mancata manutenzione",
      "Responsabilità per infortuni da guasti prevenibili",
      "Obbligo dimostrare idoneità tecnica delle attrezzature",
      "Sanzioni per ogni attrezzatura priva di documentazione"
    ],
    actions: ["Creazione registro manutenzioni", "Programmazione controlli periodici"],
    fonte: "D.Lgs. 81/08 Art. 71 - Attrezzature di lavoro",
    priority: { order: 7, urgency: "STANDARD", reason: "Sicurezza attrezzature" }
  },
  "lul-chimici": {
    key: "lul-chimici",
    text: "Libro Unico Lavoro + rischio chimico non gestiti",
    min: 2500,
    max: 12000,
    consequences: [
      "Prima richiesta in TUTTE le 811 violazioni ASP Catania - controllo standard",
      "Presunzione lavoro nero per dipendenti non registrati",
      "Maxisanzione INPS/INAIL €2.500-€12.000 per dipendente irregolare",
      "Mancanza schede sicurezza = sanzioni multiple per sostanza"
    ],
    actions: [
      "Aggiornamento immediato registrazioni giornaliere",
      "Acquisizione schede sicurezza aggiornate",
      "Valutazione rischio chimico specifica"
    ],
    fonte: "D.Lgs. 81/2008 Art. 18 + Titolo IX rischio chimico",
    priority: { order: 6, urgency: "STANDARD", reason: "Controllo amministrativo + rischio chimico" }
  },
  "lul-procedure": {
    key: "lul-procedure",
    text: "Libro Unico Lavoro + procedure mancanti",
    min: 1548,
    max: 9296,
    consequences: [
      "Prima richiesta in TUTTE le 811 violazioni ASP Catania - controllo standard",
      "Presunzione lavoro nero per dipendenti non registrati",
      "Maxisanzione INPS/INAIL €2.500-€12.000 per dipendente irregolare",
      "Mancanza procedure = impossibilità dimostrare formazione adeguata"
    ],
    actions: [
      "Aggiornamento immediato registrazioni giornaliere",
      "Redazione procedure operative per mansioni",
      "Verifica posizioni contributive INPS/INAIL dipendenti"
    ],
    fonte: "D.Lgs. 81/2008 Art. 18 + L. 92/2012 - Sempre verificato",
    priority: { order: 6, urgency: "STANDARD", reason: "Controllo amministrativo sempre effettuato" }
  }
};

const sectorMap: Record<string, string> = {
  edilizia: "Edilizia",
  alimentare: "Alimentare",
  manifatturiero: "Manifatturiero",
  servizi: "Servizi",
  commercio: "Commercio",
  agricoltura: "Agricoltura"
};

function getEmployeeCount(range?: string): number {
  const counts: Record<string, number> = {
    "1-5": 3,
    "6-10": 8,
    "11-20": 15,
    ">20": 25
  };
  return counts[range ?? "1-5"] ?? 3;
}

function calculateViolationsConditional(answers: Answers): Violation[] {
  const baseViolations = [];
  const settore = answers.settore;
  
  // Controlli base esistenti
  Object.keys(answers).forEach(questionId => {
    if (['dvr', 'formazione', 'sorveglianza', 'emergenze'].includes(questionId)) {
      if (answers[questionId] === 'no' || answers[questionId] === 'non-sicuro') {
        baseViolations.push(violationsConfig[questionId]);
      }
    }
  });
  
  // Controlli condizionali settoriali
  if (settore === 'edilizia' && (answers['patente-crediti'] === 'no' || answers['patente-crediti'] === 'non-sicuro')) {
    baseViolations.push(violationsConfig['patente-crediti']);
  }
  
  if (answers['sequenza-assunzioni'] === 'no' || answers['sequenza-assunzioni'] === 'non-sicuro') {
    baseViolations.push(violationsConfig['sequenza-assunzioni']);
  }
  
  if (answers['verifiche-periodiche'] === 'no' || answers['verifiche-periodiche'] === 'non-sicuro') {
    baseViolations.push(violationsConfig['verifiche-periodiche']);
  }
  
  if (answers['attrezzature-lavoro'] === 'no' || answers['attrezzature-lavoro'] === 'non-sicuro') {
    baseViolations.push(violationsConfig['attrezzature-lavoro']);
  }
  
  if (answers['lul-chimici'] === 'no' || answers['lul-chimici'] === 'non-sicuro') {
    baseViolations.push(violationsConfig['lul-chimici']);
  }
  
  if (answers['lul-procedure'] === 'no' || answers['lul-procedure'] === 'non-sicuro') {
    baseViolations.push(violationsConfig['lul-procedure']);
  }
  
  return baseViolations.sort((a, b) => a.priority.order - b.priority.order);
}

function riskFromScore(baseScore: number, multiplier: number) {
  const finalScore = baseScore * multiplier;
  if (finalScore <= 4) return { level: "Basso" as const, finalScore };
  if (finalScore <= 8) return { level: "Medio" as const, finalScore };
  return { level: "Alto" as const, finalScore };
}

function riskBadgeVariant(level: string): "secondary" | "default" | "destructive" {
  if (level === "Basso") return "secondary";
  if (level === "Medio") return "default";
  return "destructive";
}

const PriorityBadge = ({ urgency, children }: { urgency: string; children: React.ReactNode }) => {
  const variants: Record<string, string> = {
    'BLOCCANTE': 'bg-red-600 text-white',
    'PRIMO': 'bg-black text-white', 
    'SECONDO': 'bg-gray-800 text-white',
    'TERZO': 'bg-gray-700 text-white',
    'QUARTO': 'bg-gray-600 text-white',
    'QUINTO': 'bg-gray-500 text-white',
    'STANDARD': 'bg-gray-600 text-white'
  };
  
  return (
    <span className={`px-2 py-1 rounded text-sm font-bold ${variants[urgency] || 'bg-gray-600 text-white'}`}>
      {children}
    </span>
  );
};

const Index = () => {
  const [stage, setStage] = useState<"intro" | "quiz" | "loading" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [baseScore, setBaseScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [questions, setQuestions] = useState<Question[]>(baseQuestions);
  
  const question = questions[currentQuestion];
  const progress = (currentQuestion + 1) / questions.length * 100;
  const risk = useMemo(() => riskFromScore(baseScore, multiplier), [baseScore, multiplier]);
  const violations = useMemo(() => calculateViolationsConditional(answers), [answers]);
  const sanctionMin = violations.reduce((s, v) => s + v.min, 0);
  const sanctionMax = violations.reduce((s, v) => s + v.max, 0);

  useEffect(() => {
    const baseTitle = "Test Sicurezza Aziendale | Spazio Impresa";
    const resultsTitle = "Test Sicurezza Aziendale - Risultati | Spazio Impresa";
    document.title = stage === "results" ? resultsTitle : baseTitle;
    const desc = stage === "results" ? "Analisi personalizzata rischio sicurezza: sanzioni potenziali, impatto immediato e piano d'azione." : "Passeresti un'ispezione ASL domani mattina? Test gratuito e anonimo. Risultati in 90 secondi.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [stage]);

  // Aggiorna le domande quando abbiamo le risposte per settore
  useEffect(() => {
    if (currentQuestion >= 7 && answers.settore) {
      const newQuestions = [...baseQuestions];
      
      if (currentQuestion === 7) {
        newQuestions.push(getConditionalQuestion8(answers));
      } else if (currentQuestion === 8) {
        newQuestions.push(getConditionalQuestion8(answers));
        newQuestions.push(getConditionalQuestion9(answers));
      } else if (currentQuestion === 9) {
        newQuestions.push(getConditionalQuestion8(answers));
        newQuestions.push(getConditionalQuestion9(answers));
        newQuestions.push(getConditionalQuestion10(answers));
      }
      
      setQuestions(newQuestions);
    }
  }, [currentQuestion, answers.settore]);
  
  const getSectorName = () => sectorMap[answers.settore] || "Servizi";

  const getSuggestionContent = () => {
    const managementAnswer = answers.gestione;
    
    const suggestions = {
      "gestisco-io": {
        text: `Gestire da solo scadenze, rinnovi, adempimenti, controlli, prenotazioni e aggiornamenti è un bel carico sulle spalle. E se ci fosse un Sistema semplice per risparmiare ore, avere tutto sott'occhio ed eliminare errori e dimenticanze?`,
        link: "Scopri come funziona"
      },
      "interno": {
        text: `Anche ai migliori collaboratori possono sfuggire dettagli e aggiornamenti normativi importanti. Un Sistema integrato potrebbe aiutare il tuo team a ridurre errori, dimenticanze e il carico di lavoro.`,
        link: "Guarda cosa può fare per la tua azienda"
      },
      "consulente": {
        text: `Il tuo consulente è proattivo o ti tocca rincorrerlo per avere risposte concrete? Con un Sistema integrato, hai tutto sotto controllo in pochi click e ricevi avvisi su scadenze, rinnovi, novità e agevolazioni in largo anticipo.`,
        link: "Scopri la differenza"
      },
      "studi-multipli": {
        text: `Avere più specialisti a cui rivolgersi è ottimo, ma quanto tempo, stress e confusione costa? E se un unico Sistema coordinasse tutti i fornitori per te — in automatico?`,
        link: "Guarda i vantaggi di un'unica regia"
      }
    };
    return suggestions[managementAnswer] || suggestions["gestisco-io"];
  };

  const getManagementAdvantages = () => {
    const managementAnswer = answers.gestione;
    const advantages = {
      "gestisco-io": [
        "Mantieni il controllo totale, ma con supporto tecnico specializzato",
        "Sistema alert che ti avvisa 30gg prima delle scadenze (visite) e 60gg prima (corsi)",
        "Piattaforma digitale 24/7 per consultare tutto in tempo reale",
        "Coordinamento di tutte le figure SPP senza perdere la regia"
      ],
      "interno": [
        "Il tuo responsabile interno diventa più efficace con strumenti professionali",
        "Riduzione del carico di lavoro del team interno del 60%",
        "Backup competenze: se il responsabile non c'è, il sistema funziona comunque",
        "Formazione continua del team interno sulle novità normative"
      ],
      "consulente": [
        "Verifica indipendente di cosa copre realmente il tuo consulente attuale",
        "Integrazione con il consulente esistente o sostituzione trasparente",
        "Controllo qualità: monitoraggio prestazioni con KPI misurabili",
        "Nessuna interruzione: se il consulente non risponde, interveniamo noi"
      ],
      "studi-multipli": [
        "Coordinamento automatico di tutti i tuoi fornitori attuali",
        "Unica dashboard per monitorare Studio A + Studio B + Studio C",
        "Eliminazione sovrapposizioni e buchi tra fornitori",
        "Costi trasparenti: sai esattamente chi fa cosa e quanto costa"
      ]
    };
    return advantages[managementAnswer] || advantages["gestisco-io"];
  };

  // Casi studio settoriali
  const getSectorCaseStudies = () => {
    const caseStudies = {
      edilizia: {
        title: "Impresa Edile - Catania, 22 dipendenti",
        problem: "Controllo cantiere ASL con patente crediti scaduta",
        results: [
          "Riattivazione patente crediti in 10 giorni lavorativi",
          "Formazione coordinatori CSP/CSE completata",
          "DVR cantieri specifici per 3 commesse attive"
        ],
        quote: "Ci hanno salvato da una multa che poteva chiudere l'azienda"
      },
      manifatturiero: {
        title: "PMI Metalmeccanica - 12 dipendenti",
        problem: "Costi formazione sicurezza insostenibili",
        results: [
          "Formazione finanziata completamente gratuita tramite fondo",
          "Risparmio di oltre €2.200 su budget annuale",
          "Verifiche periodiche INAIL coordinate"
        ],
        quote: "Non sapevamo nemmeno dell'esistenza dei fondi interprofessionali"
      },
      alimentare: {
        title: "Azienda Dolciaria - Bronte, 18 dipendenti",
        problem: "Controllo ispettivo ASL improvviso",
        results: [
          "HACCP e temperatura sotto controllo in 15 giorni",
          "Formazione alimentare completata per tutto il personale",
          "Procedure sanificazione documentate"
        ],
        quote: "Professionalità e velocità che non avevamo mai visto"
      },
      default: {
        title: "Azienda Servizi - 15 dipendenti",
        problem: "Gestione sicurezza frammentata tra più fornitori",
        results: [
          "Coordinamento unico di tutti gli adempimenti",
          "Riduzione costi del 30% eliminando sovrapposizioni",
          "Sistema di monitoraggio proattivo attivato"
        ],
        quote: "Finalmente qualcuno che coordina tutto senza farci impazzire"
      }
    };
    
    return caseStudies[answers.settore] || caseStudies.default;
  };

  const selectOption = (q: Question, opt: Option) => {
    setAnswers(prev => {
      const prevVal = prev[q.id];
      const next = { ...prev, [q.id]: opt.value };

      if (q.type === "score") {
        const prevOpt = q.options.find(o => o.value === prevVal);
        const prevWeight = prevOpt?.weight || 0;
        const newWeight = opt.weight || 0;
        setBaseScore(s => s - prevWeight + newWeight);
      } else if (q.type === "multiplier") {
        const prevOpt = q.options.find(o => o.value === prevVal);
        const prevMul = prevOpt?.multiplier || 1;
        const newMul = opt.multiplier || 1;
        setMultiplier(m => m / prevMul * newMul);
      }
      return next;
    });

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(i => i + 1);
      } else {
        setStage("loading");
        setTimeout(() => setStage("results"), 800);
      }
    }, 200);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      
      const currentAnswer = answers[question.id];
      if (currentAnswer) {
        const currentOpt = question.options.find(o => o.value === currentAnswer);
        if (question.type === "score" && currentOpt) {
          setBaseScore(s => s - (currentOpt.weight || 0));
        } else if (question.type === "multiplier" && currentOpt) {
          setMultiplier(m => m / (currentOpt.multiplier || 1));
        }
        
        setAnswers(prev => {
          const next = { ...prev };
          delete next[question.id];
          return next;
        });
      }
    }
  };

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(`Ciao Spazio Impresa! Ho completato il test sicurezza. Rischio: ${risk.level}. Settore: ${getSectorName()}. Vorrei maggiori informazioni sul piano di adeguamento.`);
    return `https://wa.me/390955872480?text=${text}`;
  }, [risk.level, answers.settore]);

  const resetQuiz = () => {
    setStage("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setBaseScore(0);
    setMultiplier(1);
    setQuestions(baseQuestions);
  };

  const suggestionContent = getSuggestionContent();
  const caseStudy = getSectorCaseStudies();
  const managementAdvantages = getManagementAdvantages();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {(stage === "intro" || stage === "quiz") && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 text-center text-xs z-50">
          D.Lgs 81/08 aggiornato 2025 • Sanzioni rivalutate +15,9% • Test basato su normativa vigente
        </div>
      )}
      
      <main className="container mx-auto max-w-3xl px-4 pb-16">
        {stage === "intro" && (
          <section aria-labelledby="intro-title">
            {/* Logo Header */}
            <div className="text-center pt-5 pb-5">
              <div className="w-[75px] h-[75px] mx-auto mb-5 rounded-full border-2 border-red-600 flex items-center justify-center bg-white">
                <img 
                  src="/lovable-uploads/53e4bec6-be78-459e-a5a5-a2b8ae560a04.png" 
                  alt="Spazio Impresa Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>
            
            {/* Block 1: Headline */}
            <Card className="mb-6 border-2 border-red-600">
              <CardContent className="p-8 text-center">
                <h1 id="intro-title" className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                  Passeresti un'ispezione ASL domani mattina?
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Test basato sui protocolli ispettivi reali ASL/SPRESAL/INL 2024-2025.<br/>
                  Scopri in 90 secondi se la tua azienda supererebbe i controlli prioritari<br/>
                  effettivamente utilizzati negli 859 sopralluoghi ASP Catania.
                </p>
                
                <div className="mb-6">
                  <Button onClick={() => setStage("quiz")} size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-3 text-lg">
                    👉 Inizia il test gratuito →
                  </Button>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  100% anonimo - Risultati immediati
                </div>
              </CardContent>
            </Card>

            {/* Block 2: Metodologia Validata */}
            <Card className="mb-6 bg-white border-2 border-black">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3 text-center">🔍 METODOLOGIA VALIDATA:</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✅</span>
                    <span className="text-sm">Basato su 859 sopralluoghi reali ASP Catania 2024</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✅</span>
                    <span className="text-sm">Sequenza ispettiva documentata INL/SPRESAL (139.680 controlli nazionali)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✅</span>
                    <span className="text-sm">Sanzioni aggiornate D.Lgs 81/08 (+15,9% rivalutazione 2023)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✅</span>
                    <span className="text-sm">811 violazioni reali analizzate - sanzione media €1.110 effettiva</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✅</span>
                    <span className="text-sm">Logica condizionale per settori specifici (edilizia, manifatturiero, alimentare)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Block 3: Dati Allarmanti */}
            <Card className="mb-6 bg-red-50 border-2 border-red-600">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3 text-center text-red-600">📊 DATI UFFICIALI ALLARMANTI 2024-2025:</h2>
                <ul className="space-y-2 text-black">
                  <li><strong>+59% ispezioni INL</strong> programmate (139.680 controlli totali)</li>
                  <li><strong>74% tasso irregolarità nazionale</strong> (78,59% in Sicilia)</li>
                  <li><strong>+127% violazioni sicurezza</strong> rilevate (83.330 vs 36.680)</li>
                  <li><strong>Sicilia: +24,6% morti bianche</strong> (81 vs 65 del 2023)</li>
                  <li><strong>Sanzioni rivalutate +15,9%:</strong> ora €2.315-€7.631 per violazione</li>
                </ul>
                
                <div className="mt-4 p-3 bg-white border border-red-400 rounded">
                  <h3 className="font-semibold text-red-600 mb-2">🎯 CONTROLLI MIRATI PER SETTORE:</h3>
                  <ul className="text-sm space-y-1 text-black">
                    <li>• <strong>Edilizia:</strong> 41.106 ispezioni (+73%) - Patente crediti obbligatoria</li>
                    <li>• <strong>Manifatturiero:</strong> Focus verifiche periodiche + sostanze chimiche</li>
                    <li>• <strong>Alimentare:</strong> HACCP integrato + controlli temperatura</li>
                    <li>• <strong>Tutti:</strong> Libro Unico Lavoro sempre verificato (prima richiesta)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Block 4: È per te se */}
            <Card className="mb-6 bg-black text-white">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-3 text-center text-white">✋ È per te se:</h2>
                <ul className="space-y-2">
                  <li>• <strong>Hai un'impresa in Sicilia</strong></li>
                  <li>• <strong>Operi in settori a rischio</strong></li>
                  <li>• <strong>Sei già seguito, ma vuoi un secondo parere</strong></li>
                  <li>• <strong>Vuoi evitare multe, blocchi o figuracce con l'ASL</strong></li>
                </ul>
              </CardContent>
            </Card>

            {/* Block 5: Headline Intermedia */}
            <Card className="mb-6 border-2 border-red-600">
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">🎯 Ti bastano 90 secondi per capire se qualcosa può andare storto e come evitarlo.</h2>
                <Button onClick={() => setStage("quiz")} size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-8 py-3 text-lg">
                  👉 Fai il test gratuito adesso
                </Button>
              </CardContent>
            </Card>

            {/* Block 6: Garanzia */}
            <Card className="mb-6 bg-white border-2 border-black">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-semibold mb-3">🔐 Nessun rischio, nessun impegno.</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-green-600 font-bold">✔️</div>
                    <div className="text-sm font-medium">Test anonimo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-bold">✔️</div>
                    <div className="text-sm font-medium">Nessun dato sensibile richiesto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-bold">✔️</div>
                    <div className="text-sm font-medium">Solo risposte chiare e su misura</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Block 7: Footer */}
            <Card className="bg-gray-50 border border-gray-300">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Test basato su D.Lgs 81/08 aggiornato 2025</div>
                  <div>Fonti ufficiali: INAIL – INL – ASP Sicilia</div>
                  <div>Creato da esperti in sicurezza sul lavoro</div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quiz Section */}
        {stage === "quiz" && (
          <section aria-labelledby="quiz-title" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle id="quiz-title">Quiz sicurezza</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-2 rounded bg-red-600" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    Domanda {currentQuestion + 1} di {questions.length}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{question.title}</h2>
                  {question.subtitle && <p className="mt-1 text-sm text-muted-foreground">{question.subtitle}</p>}

                  <div className="mt-4 grid gap-3">
                    {question.options.map(opt => {
                      const selected = answers[question.id] === opt.value;
                      return (
                        <button 
                          key={opt.value} 
                          onClick={() => selectOption(question, opt)} 
                          className={`flex w-full items-center gap-3 rounded-md border p-4 text-left transition hover:bg-accent hover:text-accent-foreground ${
                            selected ? "border-red-600 bg-accent" : "border-input"
                          }`}
                        >
                          <div className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected ? "border-red-600 bg-red-600 text-primary-foreground" : "border-muted"
                          }`}>
                            {selected ? "✓" : ""}
                          </div>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={goBack}
                disabled={currentQuestion === 0}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-30 disabled:border-muted disabled:text-muted-foreground"
              >
                ← Indietro
              </Button>
            </div>
          </section>
        )}

        {stage === "loading" && (
          <section aria-live="polite">
            <Card>
              <CardContent className="p-10 text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
                <h2 className="text-xl font-semibold">Analisi in corso...</h2>
                <p className="text-muted-foreground">Stiamo calcolando il tuo livello di rischio</p>
              </CardContent>
            </Card>
          </section>
        )}

        {stage === "results" && (
          <section aria-labelledby="results-title" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Badge variant={riskBadgeVariant(risk.level)} className="mb-4 text-lg px-4 py-2">
                    Rischio {risk.level}
                  </Badge>
                  <h2 id="results-title" className="text-2xl font-bold">
                    La tua analisi personalizzata
                  </h2>
                </div>

                {violations.length === 0 ? (
                  <>
                    <div className="mt-6 text-center bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-500">
                      <div className="text-4xl font-bold text-green-700 mb-3">🏆 ECCELLENTE!</div>
                      <h2 className="text-2xl font-bold text-black mb-2">Zero criticità immediate rilevate</h2>
                      <p className="text-lg text-green-600 mb-4">
                        La tua azienda supererebbe i controlli prioritari ASL/SPRESAL con il nostro protocollo testato
                      </p>
                      
                      <div className="bg-white rounded border-2 border-green-200 p-4 text-center">
                        <div className="text-lg font-medium text-black">
                          🎯 Sei nel <span className="text-green-700 font-bold">TOP 26%</span> delle aziende siciliane
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          ASP Catania 2024: Solo 26% aziende senza irregolarità immediate (189/811 violazioni evitate)
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-blue-50 border-2 border-blue-600 p-4">
                      <div className="font-semibold text-blue-700 mb-2">🔍 Mantenimento Standard di Eccellenza</div>
                      <p className="text-sm mb-3 text-black">
                        {answers.gestione === "gestisco-io" 
                          ? "Complimenti! Gestire tutto da solo mantenendo questo standard è notevole. Sapevi che il D.Lgs 81/08 ha subito 6 modifiche negli ultimi 2 anni? Un Sistema di monitoraggio proattivo ti garantirebbe di restare sempre al vertice."
                          : "Il tuo consulente sta facendo un buon lavoro! Per mantenere questo standard nel tempo, molte aziende top affiancano un Sistema di monitoraggio continuo."
                        }
                      </p>
                      
                      <button className="text-blue-600 hover:text-blue-800 underline text-sm font-medium">
                        Scopri il Sistema per Aziende Top Performer →
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-6 flex justify-center">
                      <div className="w-full max-w-2xl">
                        <div className="rounded-lg border-2 border-black bg-white p-6 text-center shadow-lg">
                          <div className="text-4xl font-black text-red-600 mb-3">€{sanctionMax.toLocaleString("it-IT")}</div>
                          <div className="text-black font-semibold mb-4">Sanzione massima se ti controllano oggi</div>
                          
                          <details className="mt-3">
                            <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800">
                              📋 Come abbiamo calcolato questa cifra ↓
                            </summary>
                            <div className="mt-3 text-sm text-black leading-relaxed text-left bg-gray-50 p-3 rounded border">
                              <div className="space-y-2">
                                <p><strong>Base di calcolo:</strong> {violations.length} potenziali violazioni rilevate nel tuo test</p>
                                <p><strong>Principio normativo:</strong> D.Lgs. 81/08 - Art. 18 (sanzioni rivalutate +15,9% nel 2023)</p>
                                <p><strong>Metodo:</strong> Ogni violazione ha un range - prendiamo il massimo possibile</p>
                                <p><strong>Cumulo sanzioni:</strong> Si sommano tra loro (non puoi scegliere quale pagare)</p>
                                <p><strong>Responsabilità:</strong> In tribunale ci vai TU, non consulenti/dipendenti</p>
                                <p><strong>Contesto territoriale:</strong> Sicilia - irregolarità superiori alla media nazionale</p>
                              </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-black p-4 text-white">
                      <div className="font-semibold text-red-500 mb-2">💡 Realtà Check</div>
                      <p className="text-sm mb-2">
                        {answers.gestione === "consulente" 
                          ? `Nelle tue ${violations.length} potenziali violazioni, ${Math.min(Math.ceil(violations.length * 0.7), violations.length)} doveva seguirle il tuo consulente. O non sa, o non fa. In entrambi i casi, forse conviene valutare un'alternativa.`
                          : suggestionContent.text
                        }
                      </p>
                      <button 
                        onClick={() => document.getElementById('advantages-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-red-400 hover:text-red-300 underline text-sm font-medium"
                      >
                        {suggestionContent.link} →
                      </button>
                    </div>

                    <div className="mt-6 rounded-lg border-2 border-red-600 bg-red-50 p-4">
                      <h3 className="mb-4 text-lg font-semibold text-center text-black">
                        🎯 CONTROLLI PRIORITARI - ORDINE ISPETTIVO REALE
                      </h3>
                      
                      <div className="divide-y">
                        {violations.map((v, index) => (
                          <article key={v.key} className="py-3">
                            <div className="flex items-center justify-between gap-3 rounded-md border border-red-300 bg-white p-4 border-l-4 border-l-red-600 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3">
                                <PriorityBadge urgency={v.priority.urgency}>
                                  {v.priority.urgency}
                                </PriorityBadge>
                                <div>
                                  <div className="font-medium text-black">{v.text}</div>
                                  <div className="text-sm text-red-600">⚡ {v.priority.reason}</div>
                                  {v.key === 'patente-crediti' && (
                                    <div className="mt-2 bg-red-100 border border-red-400 rounded p-2">
                                      <span className="text-red-800 font-semibold text-sm">
                                        🚫 BLOCCANTE: Esclusione immediata dal cantiere
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-red-600 font-semibold whitespace-nowrap">
                                {v.max === 0 ? (
                                  <span className="text-red-800 font-bold bg-red-200 px-2 py-1 rounded">STOP LAVORI</span>
                                ) : (
                                  <span>€{v.min.toLocaleString("it-IT")} – €{v.max.toLocaleString("it-IT")}</span>
                                )}
                              </div>
                            </div>
                            
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm font-medium text-black">
                                🔍 Perché è prioritario (dati reali)
                              </summary>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                {v.consequences.map((c, i) => <li key={i}>{c}</li>)}
                              </ul>
                            </details>
                            
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm font-medium text-black">🔧 Dettagli e azioni</summary>
                              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                {v.actions.map((a, i) => <li key={i}>{a}</li>)}
                                <li>
                                  <div className="font-medium text-black">Fonte: {v.fonte}</div>
                                </li>
                              </ul>
                            </details>
                          </article>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6 rounded-lg border bg-card p-4">
                  <h3 className="mb-3 text-lg font-semibold">💼 CHI CE L'HA FATTA (anonimizzato ma vero)</h3>
                  <div className="rounded-md border bg-background p-4 text-sm">
                    <div className="font-medium text-green-600 mb-2">{caseStudy.title}</div>
                    <div className="mb-2">
                      <strong>SITUAZIONE:</strong> <span className="italic">"{caseStudy.problem}"</span>
                    </div>
                    <div className="mb-2">
                      <strong>RISULTATO:</strong>
                      <ul className="mt-1 list-none space-y-1 pl-0">
                        {caseStudy.results.map((result, i) => <li key={i}>✅ {result}</li>)}
                      </ul>
                    </div>
                    <div className="italic text-green-700 text-sm">
                      <strong>QUOTE:</strong> "{caseStudy.quote}"
                    </div>
                  </div>
                </div>

                <div id="advantages-section" className="mt-6 rounded-lg border bg-blue-50 p-4">
                  <h3 className="mb-3 text-lg font-semibold text-center">🎯 VANTAGGI SPAZIO IMPRESA PER LA TUA SITUAZIONE</h3>
                  <div className="space-y-2">
                    {managementAdvantages.map((advantage, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span className="text-sm">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-50 to-blue-50 p-6 text-center shadow-lg">
                  <h3 className="text-xl font-bold text-green-700">Chiedi come Ottenere Accesso Immediato a:</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-left">
                    <div className="bg-white rounded border p-3">
                      <h4 className="font-semibold text-green-600 mb-2">🔔 Sistema Proattivo di Alert</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Promemoria 30gg prima per visite mediche</li>
                        <li>✓ Alert 60gg prima per scadenze formazione</li>
                        <li>✓ Gestione nuovi dipendenti in max 7gg</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded border p-3">
                      <h4 className="font-semibold text-green-600 mb-2">📋 Documentazione Sempre Pronta</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ DVR in aggiornamento continuo</li>
                        <li>✓ Piattaforma digitale 24/7</li>
                        <li>✓ Verbali e nomine automatizzati</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded border p-3">
                      <h4 className="font-semibold text-green-600 mb-2">💰 Formazione Finanziata*</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Iscrizione fondo interprofessionale</li>
                        <li>✓ Verifica accesso finanziamenti</li>
                        <li>✓ Sconto 10% se non finanziabile</li>
                      </ul>
                      <p className="text-xs text-gray-600 mt-1">*Soggetto a verifica requisiti con ente formativo</p>
                    </div>
                    
                    <div className="bg-white rounded border p-3">
                      <h4 className="font-semibold text-green-600 mb-2">👥 Supporto Completo</h4>
                      <ul className="text-sm space-y-1">
                        <li>✓ Medico competente individuato</li>
                        <li>✓ Analisi rischi continuativa</li>
                        <li>✓ Aggiornamenti normativi inclusi</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                    <a href={whatsappHref} target="_blank" rel="noreferrer">
                      <Button className="bg-green-600 hover:bg-green-700">
                        💬 Scrivici su WhatsApp
                      </Button>
                    </a>
                    <a href="tel:0955872480">
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                        📞 095 587 2480
                      </Button>
                    </a>
                  </div>
                  <p className="text-sm text-green-600 mb-2">🔒 Solo per aziende siciliane | Agenda limitata: 5 slot/settimana</p>
                  <p className="text-xs text-muted-foreground">Risposta garantita entro 2 ore • Attivi dal lunedì al venerdì 9:00-18:00</p>
                </div>

                <div className="mt-6 text-center">
                  <Button variant="ghost" onClick={resetQuiz} className="text-xs">
                    Rifai il test
                  </Button>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Test basato su D.Lgs 81/08 aggiornato al 2025 • Dati anonimi • Risultati immediati
                </p>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
