import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { QuestionCard, AnswerOption } from "@/components/quiz/QuestionCard";
import { Results } from "@/components/quiz/Results";
import { questions } from "@/data/questions";

// Employee multiplier mapping
const employeeMultiplier: Record<string, number> = {
  "1-5": 1,
  "6-15": 1.6,
  "16-50": 2.4,
  ">50": 3.5,
};

export type Step = "intro" | "quiz" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});

  const totalRiskScore = useMemo(() =>
    Object.values(answers).reduce((acc, a) => acc + (a?.weight ?? 0), 0), [answers]
  );

  const multiplier = useMemo(() => {
    const emp = answers["dipendenti"]?.value;
    return emp ? (employeeMultiplier[emp] ?? 1) : 1;
  }, [answers]);

  const { minRisk, maxRisk } = useMemo(() => {
    const min = Math.round(totalRiskScore * 250 * multiplier);
    const max = Math.round(totalRiskScore * 750 * multiplier);
    return { minRisk: min, maxRisk: max };
  }, [totalRiskScore, multiplier]);

  const criticalAreas = useMemo(() => {
    return questions
      .filter((q) => q.id !== "settore" && q.id !== "dipendenti")
      .map((q) => answers[q.id])
      .filter(Boolean)
      .filter((a) => (a?.weight ?? 0) > 1)
      .map((a) => ({ name: a!.label, sanction: a!.sanction, details: a!.details }));
  }, [answers]);

  const handleStart = () => {
    setStep("quiz");
  };

  const handleAnswer = (answer: AnswerOption) => {
    const q = questions[current];
    const next = current + 1;
    setAnswers((prev) => ({ ...prev, [q.id]: answer }));
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setStep("results");
    }
  };

  const progress = ((current) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-10">
        {step === "intro" && (
          <section className="text-center animate-enter">
            <h1 className="text-4xl font-bold leading-tight">Scopri il livello di rischio reale della tua azienda</h1>
            <p className="mt-4 text-muted-foreground">
              Un quiz rapido per stimare l'impatto economico delle non conformità in materia di sicurezza sul lavoro e scoprire come intervenire.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="hover-scale" onClick={handleStart}>
                Inizia il test
              </Button>
              <a href="#approfondisci" className="story-link text-primary">Scopri come funziona</a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
              <span className="text-primary">✓</span>
              Oltre 500 PMI in Sicilia hanno già effettuato il test
            </div>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <div>⏳ Richiede circa 60 secondi</div>
              <div>🔒 Il test è anonimo: i tuoi dati sono al sicuro</div>
            </div>
          </section>
        )}

        {step === "quiz" && (
          <section className="space-y-6">
            <ProgressBar value={progress} />
            <QuestionCard
              question={questions[current]}
              onAnswer={handleAnswer}
              index={current}
              total={questions.length}
            />
          </section>
        )}

        {step === "results" && (
          <Results minRisk={minRisk} maxRisk={maxRisk} criticalAreas={criticalAreas} sector={answers["settore"]?.label} />)
        }

        {/* Anchor section for intro page */}
        <section id="approfondisci" className="mt-16">
          {step === "intro" && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border p-6">
                <div className="text-sm text-muted-foreground">Aggiornato 2025</div>
                <div className="mt-2 font-medium">+59% ispezioni, irregolarità 74% (focus PMI)</div>
                <p className="mt-2 text-sm text-muted-foreground">L. 203/2024 rafforza sorveglianza sanitaria e visite preassuntive. Sicilia: +24.6% morti bianche.</p>
              </div>
              <div className="rounded-lg border p-6">
                <div className="text-sm text-muted-foreground">Range sanzioni</div>
                <div className="mt-2 font-medium">Formazione, DVR, nomine SPP, emergenze</div>
                <p className="mt-2 text-sm text-muted-foreground">Calcoliamo un range economico basato su pesi/domande e moltiplicatore per dipendenti.</p>
              </div>
            </div>
          )}
        </section>

        {step !== "intro" && (
          <div className="mt-10 flex justify-between">
            <Button variant="ghost" onClick={() => { setStep("intro"); setCurrent(0); setAnswers({}); }}>Ricomincia</Button>
            {step === "quiz" && (
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
