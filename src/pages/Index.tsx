import { useEffect, useMemo, useReducer, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, AlertTriangle } from "lucide-react";

// Types
interface BaseOption {
  value: string;
  label: string;
}
interface ScoreOption extends BaseOption {
  weight: number;
}
interface MultiplierOption extends BaseOption {
  multiplier: number;
}

type QuestionType = "score" | "multiplier";

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options: (ScoreOption | MultiplierOption)[];
};

type Answers = Record<string, string>;

type Stage = "intro" | "quiz" | "loading" | "results";

// State & reducer
const initialState = {
  stage: "intro" as Stage,
  currentQ: 0,
  answers: {} as Answers,
  score: 0,
  mult: 1,
};

type Action =
  | { type: "SET_STAGE"; payload: Stage }
  | { type: "NEXT_Q" }
  | { type: "PREV_Q" }
  | { type: "SET_ANSWER"; payload: typeof initialState }
  | { type: "RESET" };

function quizReducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "SET_STAGE":
      return { ...state, stage: action.payload };
    case "NEXT_Q":
      return { ...state, currentQ: state.currentQ + 1 };
    case "PREV_Q":
      return { ...state, currentQ: Math.max(0, state.currentQ - 1) };
    case "SET_ANSWER":
      return action.payload;
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Questions
const questions: Question[] = [
  {
    id: "gestione",
    title: "Come gestisci attualmente la sicurezza aziendale?",
    subtitle: "Scegli l'opzione più vicina alla tua situazione",
    type: "multiplier",
    options: [
      { value: "gestisco-io", label: "Gestisco tutto io in prima persona", multiplier: 1.5 },
      { value: "interno", label: "Internamente c'è una persona che gestisce la sicurezza aziendale", multiplier: 1.3 },
      { value: "consulente", label: "Ho un consulente che si occupa di tutto", multiplier: 1 },
      { value: "studi-multipli", label: "Ho diversi studi professionali che si occupano ognuno di aspetti diversi", multiplier: 1.2 },
    ],
  },
  {
    id: "dipendenti",
    title: "Quanti dipendenti ha la tua azienda?",
    subtitle: "Serve per calcoli personalizzati su costi formazione",
    type: "multiplier",
    options: [
      { value: "1-5", label: "1-5 dipendenti", multiplier: 1 },
      { value: "6-10", label: "6-10 dipendenti", multiplier: 1.5 },
      { value: "11-20", label: "11-20 dipendenti", multiplier: 2 },
      { value: ">20", label: "Oltre 20 dipendenti", multiplier: 2.5 },
    ],
  },
  {
    id: "settore",
    title: "In quale settore opera principalmente la tua azienda?",
    subtitle: "Ogni settore ha frequenze di controllo e rischi diversi",
    type: "multiplier",
    options: [
      { value: "edilizia", label: "Edilizia/Costruzioni", multiplier: 2 },
      { value: "manifatturiero", label: "Manifatturiero/Produzione", multiplier: 1.6 },
      { value: "alimentare", label: "Alimentare/Ristorazione", multiplier: 1.5 },
      { value: "servizi", label: "Servizi/Consulenza", multiplier: 1.2 },
      { value: "commercio", label: "Commercio/Retail", multiplier: 1.2 },
      { value: "agricoltura", label: "Agricoltura/Allevamento", multiplier: 1.6 },
    ],
  },
  {
    id: "sorveglianza",
    title:
      "Se l'ispettore controlla 3 dipendenti a caso, trovi tutti i giudizi di idoneità degli ultimi 2 anni?",
    subtitle: "Verifica completezza sorveglianza sanitaria",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
  {
    id: "formazione",
    title:
      "L'ispettore controlla 3 dipendenti: trovi tutti gli attestati di formazione validi e non scaduti?",
    subtitle: "Verifica standard: conformità formativa",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
  {
    id: "dvr",
    title:
      "L'ispettore ti dice: \"Fammi vedere DVR aggiornato, nomine sicurezza e verbali riunioni\". Hai tutto pronto?",
    subtitle: "Check principale: documentazione base",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
  {
    id: "nuovo-assunto",
    title: "Ultimo assunto: sei sicuro di avere tutto firmato PRIMA che iniziasse?",
    subtitle: "Test critico: sequenza adempimenti (Visita, formazione, DPI)",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
  {
    id: "emergenze",
    title:
      "L'ispettore chiede il piano emergenza e le nomine degli addetti primo soccorso e antincendio. Tutto in ordine?",
    subtitle: "Controllo critico: procedure emergenza",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
  {
    id: "sostituto",
    title:
      "Se domani non ci sei, qualcun altro sa dove trovare tutta la documentazione per un'ispezione?",
    subtitle: "Controllo: autonomia operativa aziendale",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
  {
    id: "click",
    title: "L'ispettore ti chiede un documento a caso. Lo trovi in meno di 2 minuti?",
    subtitle: "Verifica: efficienza documentale",
    type: "score",
    options: [
      { value: "si", label: "Sì", weight: 0 },
      { value: "no", label: "No", weight: 2 },
      { value: "non-sicuro", label: "Non sono sicuro", weight: 1 },
    ],
  },
];

// Violations configuration (prioritized)
const violations = {
  dvr: {
    text: "DVR non aggiornato",
    min: 2894,
    max: 7404,
    consequences: [
      "In caso di infortunio, rischi denuncia per lesioni o omicidio colposo",
      "L'INAIL può rifiutare la copertura assicurativa",
      "L'ASL può disporre la sospensione dell'attività",
    ],
    actions: [
      "Aggiorna DVR e nomine RSPP/Addetti",
      "Programma riunione periodica e verbalizza",
    ],
    fonte: "D.Lgs. 81/08, art. 18 e 29 (sanzioni rivalutate 2023)",
    priority: { order: 1, urgency: "PRIMO", reason: "L'ispettore lo chiede SEMPRE per primo" },
  },
  formazione: {
    text: "Formazione scaduta",
    min: 1709,
    max: 7404,
    consequences: [
      "Responsabilità penale diretta del datore in caso di infortunio",
      "Nullità dell'incarico per lavoratori non formati",
      "Rischio sospensione in caso di organico >5 o >10 non formato",
    ],
    actions: ["Verifica scadenze e rinnovi", "Iscrivi ai corsi (generale, specifica, addetti)"],
    fonte: "D.Lgs. 81/08 art. 37 (sanzioni rivalutate 2023)",
    priority: { order: 2, urgency: "SECONDO", reason: "Controlla 3 dipendenti a caso" },
  },
  sorveglianza: {
    text: "Sorveglianza sanitaria incompleta",
    min: 2316,
    max: 7632,
    consequences: [
      "Se manca il giudizio medico, non puoi far lavorare il dipendente per legge",
      "In caso di infortunio, rischi denuncia",
      "L'INAIL può rifiutare la copertura",
    ],
    actions: [
      "Nomina medico competente",
      "Pianifica visite e giudizi idoneità per tutti gli esposti",
    ],
    fonte: "D.Lgs. 81/08, Titolo I e X; legge 203/2024",
    priority: { order: 3, urgency: "TERZO", reason: "Verifica cartelle mediche" },
  },
  emergenze: {
    text: "Procedure emergenza non conformi",
    min: 1068,
    max: 5695,
    consequences: [
      "Se c'è un'emergenza, puoi essere penalmente responsabile",
      "Rischi arresto fino a 4 mesi se ci sono danni a persone",
    ],
    actions: [
      "Aggiorna piano di emergenza ed evacuazione",
      "Nomina e forma addetti primo soccorso/antincendio",
    ],
    fonte: "D.Lgs. 81/08, Titolo I e II",
    priority: { order: 4, urgency: "QUARTO", reason: "Procedure emergenza" },
  },
  "nuovo-assunto": {
    text: "Procedure assunzioni incomplete",
    min: 3000,
    max: 15000,
    consequences: [
      "Senza visita pre-assuntiva, il contratto può essere contestato",
      "Rischi multe multiple per ogni obbligo non rispettato",
    ],
    actions: [
      "Verifica sequenza: visita, formazione, DPI prima dell'avvio",
      "Predisponi check-list di ingresso",
    ],
    fonte: "D.Lgs. 81/08; obblighi preassuntivi rafforzati 2024",
    priority: { order: 5, urgency: "QUINTO", reason: "Sequenza assunzioni" },
  },
};

type ViolationKey = keyof typeof violations;

const sectorLabels: Record<string, string> = {
  edilizia: "Edilizia",
  alimentare: "Alimentare",
  manifatturiero: "Manifatturiero",
  servizi: "Servizi",
  commercio: "Commercio",
  agricoltura: "Agricoltura",
};

const Index = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const [testersCount, setTestersCount] = useState(514);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestersCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const q = questions[state.currentQ];
  const progress = ((state.currentQ + 1) / questions.length) * 100;

  const risk = useMemo(() => {
    const fs = state.score * state.mult;
    return fs <= 4 ? "Basso" : fs <= 8 ? "Medio" : "Alto";
  }, [state.score, state.mult]);

  const userViolations = useMemo(() =>
    Object.entries(violations)
      .filter(([k]) => state.answers[k as ViolationKey] === "no" || state.answers[k as ViolationKey] === "non-sicuro")
      .map(([k, v]) => ({ ...v, key: k }))
      .sort((a, b) => a.priority.order - b.priority.order),
  [state.answers]);

  const sanctionMax = userViolations.reduce((s, v) => s + v.max, 0);
  const sectorName = sectorLabels[state.answers.settore] || "Servizi";

  const handleOption = useCallback((opt: any) => {
    const newAnswers = { ...state.answers, [q.id]: opt.value } as Answers;
    let newScore = state.score;
    let newMult = state.mult;

    if (q.type === "score") {
      const weight = (opt as ScoreOption).weight || 0;
      newScore = state.score + weight;
    } else if (q.type === "multiplier") {
      const mult = (opt as MultiplierOption).multiplier || 1;
      newMult = state.mult * mult;
    }

    dispatch({ type: "SET_ANSWER", payload: { ...state, answers: newAnswers, score: newScore, mult: newMult } });

    setTimeout(() => {
      if (state.currentQ < questions.length - 1) {
        dispatch({ type: "NEXT_Q" });
      } else {
        dispatch({ type: "SET_STAGE", payload: "loading" });
        setTimeout(() => dispatch({ type: "SET_STAGE", payload: "results" }), 800);
      }
    }, 200);
  }, [state, q]);

  const getPersonalizedMessage = () => {
    const management = state.answers.gestione;
    const hasViolations = userViolations.length > 0;
    const employees = state.answers.dipendenti;

    if (management === "interno" && !hasViolations) {
      return {
        title: "Complimenti! Sei un esempio virtuoso",
        text:
          "Gestisci internamente e con attenzione: il tuo modello funziona. Hai mai pensato a certificarti come azienda sicura per ottenere vantaggi competitivi?",
        cta: "Scopri i vantaggi della certificazione",
      };
    }

    if (management === "consulente" && hasViolations) {
      return {
        title: "Attenzione: il tuo consulente ti sta deludendo",
        text: `Nonostante la consulenza esterna, hai ${userViolations.length} rischi aperti. Chi ci mette la faccia sei tu, legalmente. È tempo di capire dove si inceppa la filiera della sicurezza.`,
        cta: "Verifica l'operato del tuo consulente",
      };
    }

    if (management === "gestisco-io" && employees === "1-5") {
      return {
        title: "Fai tutto tu? Rispetto!",
        text:
          "Ma sai che il D.Lgs 81 è cambiato 6 volte negli ultimi 2 anni? Un sistema che ti supporta senza toglierti il controllo potrebbe semplificarti la vita.",
        cta: "Mantieni il controllo, riduci il carico",
      };
    }

    return {
      title: risk === "Alto" ? "Situazione critica" : risk === "Medio" ? "Margini di miglioramento" : "Buona situazione",
      text: `Come imprenditore nel settore ${sectorName} con ${employees || "1-5"} dipendenti, la tua situazione richiede attenzione mirata.`,
      cta: "Scopri il piano personalizzato",
    };
  };

  const personalizedMsg = getPersonalizedMessage();
  const whatsappText = encodeURIComponent(
    `Ciao Spazio Impresa! Ho completato il test sicurezza. Rischio: ${risk}. Settore: ${sectorName}. ${userViolations.length} criticità rilevate. Vorrei un'analisi personalizzata.`
  );

  return (
    <div className="min-h-screen bg-gradient-soft text-foreground">
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {state.stage === "intro" && (
          <section className="animate-enter">
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <Shield className="w-10 h-10 text-primary" />
                <span className="text-2xl font-bold text-primary">SPAZIO IMPRESA</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-secondary rounded-full px-4 py-2 text-sm">
                <Users className="w-4 h-4 text-foreground" />
                <span className="font-medium">{testersCount} imprenditori siciliani</span>
                <span className="text-muted-foreground">hanno già testato la loro azienda</span>
              </div>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2">
                  Sei certo che la tua azienda è a norma?
                </h1>
                <p className="text-xl text-center text-muted-foreground mb-2">
                  O ti affidi solo alla parola del consulente?
                </p>

                <div className="bg-accent border-l-4 border-primary p-4 mb-6">
                  <p className="text-sm">
                    <strong>Se hai un'impresa in Sicilia</strong> e ti affidi a un consulente esterno,
                    questo test ti aprirà gli occhi su ciò che non ti dicono.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-accent rounded-lg p-4 border">
                    <AlertTriangle className="w-6 h-6 text-destructive mb-2" />
                    <p className="text-sm font-medium">Se ci sono rischi</p>
                    <p className="text-xs text-muted-foreground">Scopri sanzioni fino a €15.000</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 border">
                    <Shield className="w-6 h-6 text-primary mb-2" />
                    <p className="text-sm font-medium">Se sei a norma</p>
                    <p className="text-xs text-muted-foreground">Avrai la conferma che tutto fila liscio</p>
                  </div>
                </div>

                <div className="rounded-lg p-3 mb-6 bg-secondary">
                  <p className="text-xs text-center text-muted-foreground">
                    <strong>ASP Catania 2024:</strong> 859 controlli, 811 violazioni contestate, €1.110 sanzione media
                  </p>
                </div>

                <Button
                  onClick={() => dispatch({ type: "SET_STAGE", payload: "quiz" })}
                  size="lg"
                  className="w-full bg-gradient-hero text-primary-foreground shadow-lg hover-scale"
                >
                  Inizia il Test Gratuito (2 minuti) →
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Test anonimo • Nessuna registrazione • Risultati immediati
                </p>
              </CardContent>
            </Card>

            <div className="mt-6 p-4 bg-card rounded-lg shadow text-center border">
              <p className="text-sm text-muted-foreground italic">
                "Marco, titolare di una PMI edile a Trapani, pensava di essere a posto. Poi è arrivato il controllo ASL..."
              </p>
              <p className="text-xs text-muted-foreground mt-2">Storia vera, nome di fantasia</p>
            </div>
          </section>
        )}

        {state.stage === "quiz" && (
          <section className="space-y-6 animate-enter">
            <Card className="max-w-3xl mx-auto shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Domanda {state.currentQ + 1} di {questions.length}
                  </CardTitle>
                  <Badge variant="outline">{Math.round(progress)}% completato</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-2 w-full rounded bg-muted mb-6">
                  <div
                    className="h-2 rounded bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <h2 className="text-xl font-semibold mb-2">{q.title}</h2>
                {q.subtitle && <p className="text-sm text-muted-foreground mb-4">{q.subtitle}</p>}

                <div className="grid gap-3">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOption(opt)}
                      className="flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <div className="w-5 h-5 rounded-full border-2" />
                      <span className="flex-1">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {state.currentQ > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "PREV_Q" })} className="mt-4">
                    ← Torna indietro
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {state.stage === "loading" && (
          <section className="min-h-[60vh] flex items-center justify-center animate-enter">
            <Card className="w-full max-w-md">
              <CardContent className="p-10 text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Analisi in corso...</h2>
                <p className="text-muted-foreground">Stiamo calcolando il tuo profilo di rischio personalizzato</p>
              </CardContent>
            </Card>
          </section>
        )}

        {state.stage === "results" && (
          <section className="space-y-6 animate-enter">
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Badge
                    className={`text-lg px-4 py-2 text-primary-foreground ${
                      risk === "Alto"
                        ? "bg-destructive"
                        : risk === "Medio"
                        ? "bg-secondary"
                        : "bg-accent"
                    }`}
                  >
                    Rischio {risk}
                  </Badge>

                  <h2 className="text-2xl font-bold mt-4 mb-2">{personalizedMsg.title}</h2>
                  <p className="text-muted-foreground">{personalizedMsg.text}</p>
                </div>

                {userViolations.length > 0 && (
                  <div className="bg-accent border-2 border-primary rounded-lg p-6 text-center mb-6">
                    <div className="text-4xl font-black text-primary mb-2">€{sanctionMax.toLocaleString("it-IT")}</div>
                    <p className="font-semibold mb-3">Sanzione massima se ti controllano oggi</p>
                    <p className="text-sm text-muted-foreground italic">
                      "In tribunale ci vai TU, non il consulente o i dipendenti"
                    </p>
                  </div>
                )}

                {userViolations.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Le tue {userViolations.length} priorità da chiudere subito:</h3>
                    {userViolations.map((v: any) => (
                      <div key={v.key} className="bg-card rounded-lg border-l-4 p-4 shadow border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="bg-foreground text-primary-foreground px-2 py-1 rounded text-xs font-bold mr-2">
                              {v.priority.urgency}
                            </span>
                            <span className="font-medium">{v.text}</span>
                          </div>
                          <span className="text-primary font-bold whitespace-nowrap">
                            fino a €{v.max.toLocaleString("it-IT")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{v.priority.reason}</p>

                        <details className="text-sm">
                          <summary className="cursor-pointer font-medium">Perché controlla questo</summary>
                          <ul className="mt-2 ml-4 space-y-1 text-muted-foreground">
                            {v.consequences.slice(0, 2).map((c: string, i: number) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </details>

                        <details className="text-sm mt-2">
                          <summary className="cursor-pointer font-medium">Cosa puoi fare subito</summary>
                          <ul className="mt-2 ml-4 space-y-1 text-muted-foreground">
                            {v.actions.map((a: string, i: number) => (
                              <li key={i}>• {a}</li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    ))}

                    <div className="bg-secondary rounded-lg p-4 mt-4">
                      <p className="text-sm font-medium mb-2">Suggerimento rapido</p>
                      <p className="text-sm text-muted-foreground">
                        Un sistema integrato riduce errori e ritardi. Centralizza scadenze e documenti per azzerare il rischio di sanzioni multiple.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-accent border rounded-lg p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">Ottimo lavoro! Zero criticità urgenti</h3>
                    <p className="text-muted-foreground">
                      Sei tra i pochi imprenditori siciliani realmente in regola. Ma ricorda: le normative cambiano continuamente.
                    </p>
                  </div>
                )}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href={`https://wa.me/390955872480?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-gradient-hero text-primary-foreground hover-scale">
                      Contattaci su WhatsApp (risposta in 2 ore)
                    </Button>
                  </a>
                  <Button variant="outline" className="w-full" onClick={() => window.print()}>
                    Scarica Report PDF
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <Button variant="ghost" onClick={() => dispatch({ type: "RESET" })}>Ripeti il test</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {state.stage !== "intro" && (
          <div className="mt-10 flex justify-between">
            <Button variant="ghost" onClick={() => dispatch({ type: "RESET" })}>Ricomincia</Button>
            {state.stage === "quiz" && (
              <div className="text-sm text-muted-foreground">Domande totali: {questions.length}</div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
