export type CaseStudy = {
  sector: string;
  challenge: string;
  solution: string;
  result: string;
  quote: string;
};

export type CriticalArea = {
  name: string;
  sanction?: string;
  details?: string;
};

interface ResultsProps {
  minRisk: number;
  maxRisk: number;
  criticalAreas: CriticalArea[];
}

const currency = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);

export const Results = ({ minRisk, maxRisk, criticalAreas }: ResultsProps) => {
  const cases: CaseStudy[] = [
    {
      sector: "Ristorazione (CT)",
      challenge: "Formazione non aggiornata e DVR incompleto",
      solution: "Audit rapido, piano formativo e aggiornamento DVR in 72h",
      result: "Revocato provvedimento sospensivo, -65% rischio sanzioni",
      quote: "Ci hanno rimesso in regola in tre giorni. – Titolare"
    },
    {
      sector: "Edilizia (PA)",
      challenge: "Sorveglianza sanitaria carente",
      solution: "Nomina medico competente e visite preassuntive",
      result: "Azzerate le non conformità in cantiere",
      quote: "Processi finalmente chiari e documentati."
    },
    {
      sector: "Manifatturiero (ME)",
      challenge: "Gestione emergenze e addestramento",
      solution: "Procedure di emergenza e prove di evacuazione",
      result: "Migliorata la prontezza operativa, nessuna sanzione",
      quote: "Squadra formata e tempi di risposta dimezzati."
    },
  ];

  return (
    <section className="space-y-10 animate-enter">
      <header>
        <h2 className="text-3xl font-semibold">La tua Analisi Personalizzata</h2>
        <p className="mt-2 text-muted-foreground">
          Stima basata sulle tue risposte, aggiornamenti normativi 2024-2025 e fonti ufficiali (D.Lgs. 81/2008, L. 203/2024). In Sicilia i controlli sono in forte aumento e l'irregolarità media supera il 70%.
        </p>
      </header>

      <article className="rounded-lg border p-6 bg-card">
        <div className="text-sm text-muted-foreground">Stima del rischio economico</div>
        <div className="mt-2 text-3xl font-bold text-primary">{currency(minRisk)} - {currency(maxRisk)}</div>
      </article>

      <article className="space-y-4">
        <h3 className="text-2xl font-semibold">Aree critiche da sistemare urgentemente</h3>
        {criticalAreas.length === 0 ? (
          <p className="text-muted-foreground">Ottimo! Non risultano aree critiche maggiori dalle risposte fornite.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {criticalAreas.map((c, i) => (
              <li key={i} className="rounded-lg border p-4 bg-card">
                <div className="font-medium">{c.name}</div>
                {c.sanction && <div className="text-sm text-primary mt-1">Sanzione stimata: {c.sanction}</div>}
                {c.details && <p className="mt-2 text-sm text-muted-foreground">{c.details}</p>}
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="space-y-4">
        <h3 className="text-2xl font-semibold">Come Spazio Impresa risolve i tuoi problemi</h3>
        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-2 bg-muted/50">
            <div className="p-3 font-medium">Mercato standard</div>
            <div className="p-3 font-medium text-primary">Spazio Impresa</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-3 text-sm text-muted-foreground">Tempi 15-30 gg, costi variabili</div>
            <div className="p-3 text-sm">Avvio in 72h, piano chiaro e finanziamenti attivabili</div>
            <div className="p-3 text-sm text-muted-foreground">Formazione frammentata</div>
            <div className="p-3 text-sm">Catalogo e-learning + aula, tracciamento e attestati</div>
            <div className="p-3 text-sm text-muted-foreground">DVR lenti e generici</div>
            <div className="p-3 text-sm">DVR su misura, aggiornamenti rapidi</div>
          </div>
        </div>
      </article>

      <article className="space-y-3">
        <h3 className="text-2xl font-semibold">Casi studio rilevanti per te</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {cases.map((cs, i) => (
            <div key={i} className="min-w-[16rem] rounded-lg border p-4 bg-primary/5">
              <div className="text-sm text-muted-foreground">{cs.sector}</div>
              <div className="mt-1 font-medium">{cs.challenge}</div>
              <div className="mt-2 text-sm">{cs.solution}</div>
              <div className="mt-2 text-sm text-primary">{cs.result}</div>
              <div className="mt-2 text-xs italic text-muted-foreground">“{cs.quote}”</div>
            </div>
          ))}
        </div>
      </article>

      <aside className="rounded-lg border p-6 bg-card">
        <h3 className="text-xl font-semibold">Pianifica la tua sicurezza adesso</h3>
        <p className="mt-2 text-muted-foreground">Richiedi un assessment gratuito e scopri come ridurre il rischio e i costi.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="tel:0955872480" className="story-link text-primary">Chiamaci ora: 095 587 2480</a>
          <a href="https://wa.me/390955872480" target="_blank" rel="noreferrer" className="story-link text-primary">Scrivici su WhatsApp</a>
        </div>
      </aside>
    </section>
  );
};
