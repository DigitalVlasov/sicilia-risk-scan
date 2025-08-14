import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Shield, AlertTriangle, TrendingUp, Clock, Users, FileCheck, Phone, MessageCircle, CheckCircle2, XCircle, AlertCircle, ArrowRight, Target, Zap, Award, BarChart3, Building2, Euro } from "lucide-react";

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

const questions: Question[] = [
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
    id: "sorveglianza",
    title: "L'ispettore controlla 3 dipendenti a caso, trovi tutti i giudizi di idoneità degli ultimi 2 anni?",
    subtitle: "Verifica completezza sorveglianza sanitaria",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  },
  {
    id: "formazione",
    title: "L'ispettore controlla 3 dipendenti: trovi tutti gli attestati di formazione validi e non scaduti?",
    subtitle: "Verifica standard: conformità formativa",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  },
  {
    id: "dvr",
    title: "L'ispettore ti dice: \"Fammi vedere DVR aggiornato, nomine sicurezza e verbali riunioni\". Hai tutto pronto?",
    subtitle: "Check principale: documentazione base",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  },
  {
    id: "nuovo-assunto",
    title: "Ultimo assunto: sei sicuro di avere tutto firmato PRIMA che iniziasse?",
    subtitle: "Test critico: sequenza adempimenti (Visita, formazione, DPI)",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  },
  {
    id: "emergenze",
    title: "L'ispettore chiede il piano emergenza e le nomine degli addetti primo soccorso e antincendio. Tutto in ordine?",
    subtitle: "Controllo critico: procedure emergenza",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  },
  {
    id: "sostituto",
    title: "Se domani non ci sei, qualcun altro sa dove trovare tutta la documentazione per un'ispezione?",
    subtitle: "Controllo: autonomia operativa aziendale",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  },
  {
    id: "click",
    title: "L'ispettore ti chiede un documento a caso. Lo trovi in meno di 2 minuti?",
    subtitle: "Verifica: efficienza documentale",
    type: "score",
    options: [
      {
        value: "si",
        label: "Sì",
        weight: 0
      },
      {
        value: "no",
        label: "No",
        weight: 2
      },
      {
        value: "non-sicuro",
        label: "Non sono sicuro",
        weight: 1
      }
    ]
  }
];

const sectorMap: Record<string, string> = {
  edilizia: "Edilizia",
  alimentare: "Alimentare",
  manifatturiero: "Manifatturiero",
  servizi: "Servizi",
  commercio: "Commercio",
  agricoltura: "Agricoltura"
};

const sectorData: Record<string, { increase: number; total: string; irregularity: number }> = {
  edilizia: { increase: 73, total: "41.106", irregularity: 82 },
  manifatturiero: { increase: 23, total: "35.000+", irregularity: 71 },
  alimentare: { increase: 15, total: "28.000+", irregularity: 76 },
  servizi: { increase: 49, total: "66.221", irregularity: 68 },
  commercio: { increase: 20, total: "45.000+", irregularity: 65 },
  agricoltura: { increase: 18, total: "18.000+", irregularity: 79 }
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

function calculateViolations(answers: Answers): Violation[] {
  const config: Record<string, Violation> = {
    dvr: {
      key: "dvr",
      text: "DVR non aggiornato",
      min: 2894,
      max: 7404,
      consequences: [
        "In caso di infortunio, rischi denuncia per lesioni o omicidio colposo",
        "L'INAIL può rifiutare la copertura assicurativa",
        "L'ASL può disporre la sospensione dell'attività",
        "Il lavoratore può fare causa all'azienda"
      ],
      actions: ["Aggiorna DVR e nomine RSPP/Addetti", "Programma riunione periodica e verbalizza"],
      fonte: "D.Lgs. 81/08, art. 18 e 29 (sanzioni rivalutate 2023)",
      priority: { order: 1, urgency: "PRIMO", reason: "L'ispettore lo chiede SEMPRE per primo" }
    },
    formazione: {
      key: "formazione",
      text: "Formazione scaduta",
      min: 1709,
      max: 7404,
      consequences: [
        "Responsabilità penale diretta del datore in caso di infortunio",
        "Nullità dell'incarico per lavoratori non formati (es. RLS, addetti antincendio, carrellisti, ecc.)",
        "Rischio sospensione in caso di organico >5 o >10 non formato",
        "Perdita di copertura assicurativa INAIL in caso di eventi gravi"
      ],
      actions: ["Verifica scadenze e rinnovi", "Iscrivi ai corsi (generale, specifica, addetti)"],
      fonte: "D.Lgs. 81/08 art. 37 (sanzioni rivalutate 2023)",
      priority: { order: 2, urgency: "SECONDO", reason: "Controlla 3 dipendenti a caso" }
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
    "nuovo-assunto": {
      key: "nuovo-assunto",
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
    }
  };
  
  const violations = Object.keys(config)
    .filter(key => answers[key] === "no" || answers[key] === "non-sicuro")
    .map(key => config[key])
    .sort((a, b) => a.priority.order - b.priority.order);
    
  return violations;
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

const Index = () => {
  const [stage, setStage] = useState<"intro" | "quiz" | "loading" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [baseScore, setBaseScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  
  const question = questions[currentQuestion];
  const progress = (currentQuestion + 1) / questions.length * 100;
  const risk = useMemo(() => riskFromScore(baseScore, multiplier), [baseScore, multiplier]);
  const violations = useMemo(() => calculateViolations(answers), [answers]);
  const sanctionMin = violations.reduce((s, v) => s + v.min, 0);
  const sanctionMax = violations.reduce((s, v) => s + v.max, 0);

  useEffect(() => {
    const baseTitle = "Test Sicurezza Aziendale | Spazio Impresa";
    const resultsTitle = "Test Sicurezza Aziendale - Risultati | Spazio Impresa";
    document.title = stage === "results" ? resultsTitle : baseTitle;
    const desc = stage === "results" ? "Analisi personalizzata rischio sicurezza: sanzioni potenziali, impatto immediato e piano d'azione." : "Passeresti un'ispezione ASL oggi? Test gratuito e anonimo. Risultati in 90 secondi.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [stage]);
  
  const getSectorName = () => sectorMap[answers.settore] || "Servizi";

  const getSectorPriorities = () => {
    const priorities = {
      edilizia: [
        "Cantieri e DPI anticaduta",
        "Coordinatore sicurezza (CSP/CSE)",
        "Formazione specifica macchine",
        "Sorveglianza sanitaria operai"
      ],
      manifatturiero: [
        "Macchine industriali e manutenzione",
        "Sostanze chimiche/cancerogene",
        "Rumore e vibrazioni misurati",
        "Movimentazione carichi"
      ],
      alimentare: [
        "HACCP e igiene alimentare",
        "Formazione addetti alimentari",
        "Temperatura e conservazione",
        "Pulizia e sanificazione"
      ],
      servizi: [
        "Videoterminali e postazioni",
        "Vie di fuga e emergenze",
        "Stress lavoro-correlato",
        "Formazione generale"
      ],
      commercio: [
        "Scaffalature e magazzini",
        "Movimentazione manuale merci",
        "Apertura al pubblico",
        "Antincendio e primo soccorso"
      ],
      agricoltura: [
        "Trattori e macchine agricole",
        "Prodotti fitosanitari",
        "Lavoro stagionale",
        "Alloggiamenti lavoratori"
      ]
    };
    return priorities[answers.settore] || priorities.servizi;
  };

  const getSectorIrregularities = () => {
    const irregularities = {
      edilizia: ["DVR non aggiornato (89%)", "Mancata formazione operai (76%)", "Assenza sorveglianza sanitaria (71%)"],
      manifatturiero: ["DVR generico (72%)", "Manutenzione macchine (68%)", "Formazione specifica (61%)"],
      alimentare: ["HACCP scaduto (65%)", "Temperature non registrate (52%)", "Sanificazioni incomplete (45%)"],
      servizi: ["VDT non valutati (55%)", "Stress lavoro assente (48%)", "Formazione generale (42%)"],
      commercio: ["DVR commercio generico (60%)", "Scaffalature non verificate (45%)", "Emergenze non testate (38%)"],
      agricoltura: ["Macchine non certificate (75%)", "Fitosanitari non gestiti (68%)", "Formazione stagionali (62%)"]
    };
    return irregularities[answers.settore] || irregularities.servizi;
  };

  const getSectorDeficiencies = () => {
    const deficiencies = {
      edilizia: ["Mancanza CSP nominato", "DPI III categoria non certificati", "Ponteggi non a norma"],
      manifatturiero: ["Libretto macchine mancante", "Schede sicurezza incomplete", "Misurazioni rumore datate"],
      alimentare: ["Procedure HACCP non documentate", "Registri temperatura mancanti", "Sanificazioni non tracciate"],
      servizi: ["Postazioni VDT non ergonomiche", "Valutazione carichi di lavoro assente", "Piano emergenza generico"],
      commercio: ["Scaffalature non verificate", "Movimentazione non valutata", "Sicurezza clienti e visitatori"],
      agricoltura: ["Macchine agricole non conformi", "Registro fitosanitari incompleto", "Documenti lavoratori stagionali incompleti"]
    };
    return deficiencies[answers.settore] || deficiencies.servizi;
  };

  const getSuggestionContent = () => {
    const managementAnswer = answers.gestione;
    const timeWasted = getEmployeeCount(answers.dipendenti) * 2;
    const monthlyWaste = timeWasted * 25;
    
    const suggestions = {
      "gestisco-io": {
        text: `Gestire da solo scadenze, rinnovi, adempimenti, controlli, prenotazioni e aggiornamenti è un bel carico sulle spalle. E se ci fosse un Sistema semplice per risparmiare ore, avere tutto sott'occhio ed eliminare errori e dimenticanze?.`,
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

  const getCaseStudies = () => {
    const caseStudies = [
      {
        sector: "Alimentare",
        title: "Azienda Dolciaria - Bronte, 18 dipendenti",
        problem: "Controllo ispettivo ASL improvviso",
        consequence: "Rischio sanzioni per oltre €15.000 e possibile sospensione attività",
        solution: "In 20-25 giorni abbiamo completato:",
        actions: [
          "Organizzato formazione Art. 37 con docente qualificato direttamente in azienda",
          "Iscritto le figure aziendali ai corsi di sicurezza presso Ente Accreditato",
          "Coordinato visite mediche immediate con il Medico Competente",
          "Prodotto DVR, Piano Emergenza, organigramma e verbali necessari"
        ],
        result: "Azienda completamente in regola, controllo superato senza sanzioni"
      },
      {
        sector: "Manifatturiero",
        title: "PMI Metalmeccanica - 12 dipendenti",
        problem: "Costi formazione sicurezza insostenibili",
        consequence: "Budget insufficiente per adempimenti formativi obbligatori",
        solution: "Attraverso l'iscrizione a Fondo Interprofessionale:",
        actions: [
          "Attivato formazione finanziata completamente gratuita",
          "Erogato tutti i percorsi formativi obbligatori",
          "Formato tutte le figure aziendali previste dal D.Lgs 81/08"
        ],
        result: "Risparmio di oltre €2.200, completa conformità normativa raggiunta"
      },
      {
        sector: "Tessile",
        title: "Azienda Confezioni - 25 dipendenti",
        problem: "AUDIT esterno su sicurezza e salubrità ambienti",
        consequence: "Rischio perdita certificazioni e commesse importanti",
        solution: "Coordinamento team multidisciplinare:",
        actions: [
          "Interfaccia con tecnico per estintori, DPI e segnaletica",
          "Collaborazione con Ingegnere per valutazioni tecniche",
          "Produzione Piano Emergenza e DVR specifico per richieste AUDIT",
          "Formazione mirata del personale"
        ],
        result: "AUDIT superato con valutazione eccellente, contratti mantenuti"
      }
    ];
    
    // Seleziona un caso studio basato sul settore dell'utente o uno random
    const sectorCases = caseStudies.filter(c => 
      c.sector.toLowerCase() === (answers.settore || "").toLowerCase()
    );
    
    return sectorCases.length > 0 ? sectorCases[0] : caseStudies[0];
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
  };

  const suggestionContent = getSuggestionContent();
  const caseStudy = getCaseStudies();
  const managementAdvantages = getManagementAdvantages();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {(stage === "intro" || stage === "quiz") && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 text-center text-xs z-50">
          D.Lgs 81/08 aggiornato 2025 • Sanzioni rivalutate +15,9% • Test basato su normativa vigente
        </div>
      )}

      {stage === "intro" && (
        <section aria-labelledby="intro-title">
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                SI
              </div>
              <span className="text-2xl font-bold text-red-600">SPAZIO IMPRESA</span>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <h1 id="intro-title" className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Passeresti un'ispezione ASL oggi?
              </h1>
              <p className="text-xl text-muted-foreground mb-6">Test gratuito e anonimo • Risultati in 90 secondi</p>
              
              {/* Sezione: Cosa ottieni facendo il quiz */}
              <div className="mb-6 max-w-xl mx-auto text-left">
                <h2 className="text-lg font-semibold mb-3 text-center">💡 Cosa ottieni facendo il quiz</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-sm">Scopri in meno di 2 minuti se rischi multe o sospensioni</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-sm">Ricevi un report con le violazioni più probabili</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-sm">Ottieni consigli pratici su cosa fare (senza impegno)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="text-sm">Confrontati con benchmark reali di aziende simili</span>
                  </li>
                </ul>
              </div>

              {/* Sezione: Perché farlo ora */}
              <div className="mb-6 bg-red-50 border-2 border-red-600 rounded-lg p-4 max-w-xl mx-auto">
                <h3 className="font-bold text-red-600 mb-2">⚠️ PERCHÉ FARLO ORA</h3>
                <div className="text-sm text-left space-y-2 text-black">
                  <p><strong>+59% controlli nel 2024:</strong> 139.680 verifiche totali in Italia (dati INL)</p>
                  <p><strong>78,59% irregolarità in Sicilia:</strong> il tasso più alto d'Italia</p>
                  <p><strong>Sanzioni +15,9%:</strong> rivalutate da settembre 2023, fino a €7.631 per singola violazione</p>
                  <p><strong>859 sopralluoghi ASP Catania:</strong> 811 violazioni contestate solo nel 2024</p>
                  <p className="text-red-600 font-semibold">📍 Sicilia: +24,6% morti sul lavoro (81 nel 2024 vs 65 nel 2023)</p>
                </div>
              </div>
              
              <div className="mb-6">
                <Button onClick={() => setStage("quiz")} size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-3 text-lg">
                  Inizia il Test Gratuito →
                </Button>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                ✅
                <strong>unisciti a 500+ PMI siciliane</strong> che hanno già fatto il test
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {stage === "quiz" && (
        <div className="px-4 py-8 max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Domanda {currentQuestion + 1} di {questions.length}</CardTitle>
                <Badge variant="outline">{Math.round(progress)}% completato</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-2 w-full rounded bg-muted mb-6">
                <div 
                  className="h-2 rounded bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300" 
                  style={{width: `${progress}%`}} 
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
              {question.subtitle && <p className="text-sm text-muted-foreground mb-4">{question.subtitle}</p>}
              
              <div className="space-y-3">
                {question.options.map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => selectOption(question, opt)} 
                    className="flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all hover:border-red-400 hover:bg-red-50 w-full"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                    <span className="flex-1">{opt.label}</span>
                  </button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="mt-4"
                >
                  ← Torna indietro
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {stage === "loading" && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-10 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Analisi in corso...</h2>
              <p className="text-muted-foreground">Stiamo calcolando il tuo profilo di rischio personalizzato</p>
            </CardContent>
          </Card>
        </div>
      )}

      {stage === "results" && (
        <div className="px-4 py-8 max-w-6xl mx-auto space-y-6">
          {/* Header risultati */}
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Badge 
                  variant={riskBadgeVariant(risk.level)}
                  className="text-lg px-4 py-2 mb-4"
                >
                  Rischio {risk.level}
                </Badge>
                
                <h2 className="text-2xl font-bold mb-2">
                  {risk.level === "Alto" ? "🚨 Situazione critica" : 
                   risk.level === "Medio" ? "⚡ Margini di miglioramento" : 
                   "✅ Buona situazione"}
                </h2>
                <p className="text-muted-foreground">
                  Settore {getSectorName()} • {answers.dipendenti || '1-5'} dipendenti
                </p>
              </div>

              {violations.length > 0 && (
                <div className="bg-red-50 border-2 border-red-600 rounded-lg p-6 text-center mb-6">
                  <div className="text-4xl font-black text-red-600 mb-2">
                    €{sanctionMax.toLocaleString("it-IT")}
                  </div>
                  <p className="font-semibold text-red-800 mb-3">
                    Sanzione massima se ti controllano oggi
                  </p>
                  <p className="text-sm text-red-700 italic">
                    "In tribunale ci vai TU, non il consulente o i dipendenti"
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Consulenza Gratuita WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.print()}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Scarica Report PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Violazioni */}
          {violations.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Le tue {violations.length} bombe ad orologeria:
                </h3>
                <div className="space-y-4">
                  {violations.map((v, idx) => (
                    <div key={v.key} className="bg-white rounded-lg border-l-4 border-red-500 p-4 shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold mr-2">
                            {v.priority.urgency}
                          </span>
                          <span className="font-medium">{v.text}</span>
                        </div>
                        <span className="text-red-600 font-bold whitespace-nowrap">
                          fino a €{v.max.toLocaleString("it-IT")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{v.priority.reason}</p>
                      
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                          Perché controlla questo
                        </summary>
                        <ul className="mt-2 ml-4 space-y-1 text-muted-foreground">
                          {v.consequences.slice(0,2).map((c, i) => <li key={i}>• {c}</li>)}
                        </ul>
                      </details>
                      
                      <details className="text-sm mt-2">
                        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                          Cosa puoi fare subito
                        </summary>
                        <ul className="mt-2 ml-4 space-y-1 text-muted-foreground">
                          {v.actions.map((a, i) => <li key={i}>• {a}</li>)}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sistema suggerimento */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">
                  💡 {suggestionContent.text}
                </h3>
                <Button variant="outline" size="sm" className="mt-2">
                  {suggestionContent.link}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Caso studio */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Caso Studio Reale</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">{caseStudy.title}</h4>
                <p className="text-sm text-blue-800 mb-2"><strong>Problema:</strong> {caseStudy.problem}</p>
                <p className="text-sm text-blue-800 mb-2"><strong>Rischio:</strong> {caseStudy.consequence}</p>
                <p className="text-sm text-blue-800 mb-2"><strong>Soluzione:</strong> {caseStudy.solution}</p>
                <ul className="text-sm text-blue-700 ml-4 mb-2">
                  {caseStudy.actions.map((action, i) => (
                    <li key={i}>• {action}</li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-blue-900">
                  <strong>Risultato:</strong> {caseStudy.result}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reset */}
          <div className="text-center">
            <Button variant="outline" onClick={resetQuiz}>
              Rifai il Test
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;