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
  sector?: string;
}

const currency = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);

export const Results = ({ minRisk, maxRisk, criticalAreas, sector }: ResultsProps) => {
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

      <article className="rounded-lg p-6 bg-gradient-hero text-background border-none shadow-md">
        <div className="text-sm/6 opacity-90">Stima del rischio economico</div>
        <div className="mt-1 text-3xl font-bold">{currency(minRisk)} - {currency(maxRisk)}</div>
        <p className="mt-2 text-sm/6 opacity-90">Attivi su tutto il territorio Siciliano • Interventi rapidi e documentati</p>
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
        <h3 className="text-2xl font-semibold">Perché Spazio Impresa?</h3>
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

      <article className="space-y-3">
        <h3 className="text-2xl font-semibold">Il tuo Piano d’Azione immediato</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border p-4 bg-card">Audit iniziale e verifica documentale (DVR, nomine, formazione)</li>
          <li className="rounded-lg border p-4 bg-card">Piano formativo mirato con e-learning e aula</li>
          <li className="rounded-lg border p-4 bg-card">Nomina medico competente e calendario sorveglianza sanitaria</li>
          <li className="rounded-lg border p-4 bg-card">Procedure di emergenza e prove di evacuazione con report</li>
        </ul>
      </article>

      <article className="space-y-3">
        <h3 className="text-2xl font-semibold">Aree scoperte per Coordinatore</h3>
        {sector?.toLowerCase().includes("edilizia") ? (
          <p className="text-muted-foreground">Per cantieri edili è spesso necessario il Coordinatore per la Sicurezza (CSP/CSE). Valutiamo caso per caso e predisponiamo PSC/POS.</p>
        ) : (
          <p className="text-muted-foreground">Non richiesto per il settore selezionato, salvo casi specifici.</p>
        )}
      </article>

      <article className="space-y-3">
        <h3 className="text-2xl font-semibold">Benchmark per il tuo settore</h3>
        <div className="rounded-lg border p-4 bg-card">
          <SectorBenchmark sector={sector} />
        </div>
      </article>

      <article className="space-y-3">
        <h3 className="text-2xl font-semibold">Vantaggi completi</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border p-4 bg-card">Pacchetto unico con gestione completa (documenti, formazione, visite)</li>
          <li className="rounded-lg border p-4 bg-card">Tracciamento digitale attestati e scadenze</li>
          <li className="rounded-lg border p-4 bg-card">Supporto durante eventuali ispezioni ispettive</li>
          <li className="rounded-lg border p-4 bg-card">Aggiornamenti 2024-2025 sempre inclusi</li>
        </ul>
      </article>

      <Benefits minRisk={minRisk} maxRisk={maxRisk} />

      <aside className="rounded-lg border p-6 bg-card">
        <h3 className="text-xl font-semibold">Pianifica la tua sicurezza adesso</h3>
        <p className="mt-2 text-muted-foreground">Attivi su tutto il territorio Siciliano. Richiedi un assessment gratuito e scopri come ridurre il rischio e i costi.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="tel:0955872480" className="story-link text-primary">Chiamaci ora: 095 587 2480</a>
          <a href="https://wa.me/390955872480" target="_blank" rel="noreferrer" className="story-link text-primary">Scrivici su WhatsApp</a>
        </div>
      </aside>
    </section>
  );
};

const SectorBenchmark = ({ sector }: { sector?: string }) => {
  const s = (sector || "").toLowerCase();
  const data = s.includes("edil")
    ? { controlli: "Intensi (cantieri)", irregolarita: "70-80%", focus: "PSC/POS, coordinamento, emergenze" }
    : s.includes("ristor")
    ? { controlli: "Medio-alti", irregolarita: "60-75%", focus: "Formazione, HACCP, emergenze" }
    : s.includes("manif") || s.includes("logist")
    ? { controlli: "Alti", irregolarita: "65-80%", focus: "Sorveglianza, macchine, DPI" }
    : s.includes("serviz") || s.includes("uffici")
    ? { controlli: "Medi", irregolarita: "55-70%", focus: "DVR, videoterminali, formazione" }
    : s.includes("agric")
    ? { controlli: "Variabili", irregolarita: "65-85%", focus: "Macchine agricole, sorveglianza" }
    : { controlli: "Medi", irregolarita: "60-75%", focus: "Formazione, DVR, emergenze" };

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border p-4 bg-card">
        <div className="text-sm text-muted-foreground">Controlli annuali stimati</div>
        <div className="mt-1 font-medium">{data.controlli}</div>
      </div>
      <div className="rounded-lg border p-4 bg-card">
        <div className="text-sm text-muted-foreground">Irregolarità medie</div>
        <div className="mt-1 font-medium">{data.irregolarita}</div>
      </div>
      <div className="rounded-lg border p-4 bg-card">
        <div className="text-sm text-muted-foreground">Focus ispezioni</div>
        <div className="mt-1 font-medium">{data.focus}</div>
      </div>
    </div>
  );
};

const Benefits = ({ minRisk, maxRisk }: { minRisk: number; maxRisk: number }) => {
  const fundsMin = Math.round(minRisk * 0.18);
  const fundsMax = Math.round(maxRisk * 0.35);
  const timeMin = Math.min(24, Math.max(8, Math.round(minRisk / 5000)));
  const timeMax = Math.min(32, Math.max(timeMin + 4, Math.round(maxRisk / 4000)));
  const riskMin = 35;
  const riskMax = 65;

  return (
    <article className="space-y-3">
      <h3 className="text-2xl font-semibold">Benefici stimati</h3>
      <ul className="grid gap-3 sm:grid-cols-3">
        <li className="rounded-lg border p-4 bg-card">
          <div className="text-sm text-muted-foreground">Fondi recuperabili</div>
          <div className="mt-1 font-medium">{currency(fundsMin)} - {currency(fundsMax)}</div>
        </li>
        <li className="rounded-lg border p-4 bg-card">
          <div className="text-sm text-muted-foreground">Tempo risparmiato</div>
          <div className="mt-1 font-medium">{timeMin}-{timeMax} ore/mese</div>
        </li>
        <li className="rounded-lg border p-4 bg-card">
          <div className="text-sm text-muted-foreground">Riduzione rischio</div>
          <div className="mt-1 font-medium">{riskMin}% - {riskMax}%</div>
        </li>
      </ul>
    </article>
  );
};
