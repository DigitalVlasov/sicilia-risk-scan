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

      <article className="rounded-lg p-6 bg-card border border-primary/20 shadow-lg">
        <div className="text-sm font-medium text-primary mb-2">⚠️ Stima del rischio economico</div>
        <div className="text-3xl font-bold text-foreground mb-3">{currency(minRisk)} - {currency(maxRisk)}</div>
        <p className="text-sm text-muted-foreground mb-4">Attivi su tutto il territorio Siciliano • Interventi rapidi e documentati</p>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">Analisi completata</span>
          <span className="px-2 py-1 bg-muted text-muted-foreground rounded">Basata su 13 parametri</span>
        </div>
      </article>

      <article className="space-y-4">
        <h3 className="text-2xl font-semibold">Aree critiche da sistemare urgentemente</h3>
        {criticalAreas.length === 0 ? (
          <p className="text-muted-foreground">Ottimo! Non risultano aree critiche maggiori dalle risposte fornite.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {criticalAreas.map((c, i) => (
              <li key={i} className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {c.name}
                </div>
                {c.sanction && <div className="text-sm text-primary mt-2 font-medium">💰 {c.sanction}</div>}
                {c.details && <p className="mt-2 text-sm text-muted-foreground">{c.details}</p>}
                <div className="mt-3 pt-3 border-t border-border">
                  <button className="text-xs text-primary hover:underline">
                    → Scopri come risolvere
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="space-y-4">
        <h3 className="text-2xl font-semibold">Perché Spazio Impresa?</h3>
        <div className="overflow-hidden rounded-lg border border-primary/20 bg-card shadow-sm">
          <div className="grid grid-cols-2 bg-secondary">
            <div className="p-4 font-semibold text-secondary-foreground">Mercato standard</div>
            <div className="p-4 font-semibold text-secondary-foreground bg-primary text-primary-foreground">Spazio Impresa</div>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-4 text-sm text-muted-foreground">❌ Tempi 15-30 gg, costi variabili</div>
            <div className="p-4 text-sm font-medium">✅ Avvio in 72h, piano chiaro e finanziamenti attivabili</div>
            <div className="p-4 text-sm text-muted-foreground">❌ Formazione frammentata</div>
            <div className="p-4 text-sm font-medium">✅ Catalogo e-learning + aula, tracciamento e attestati</div>
            <div className="p-4 text-sm text-muted-foreground">❌ DVR lenti e generici</div>
            <div className="p-4 text-sm font-medium">✅ DVR su misura, aggiornamenti rapidi</div>
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
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">📋 Audit iniziale e verifica documentale</div>
            <div className="text-sm text-muted-foreground mt-1">(DVR, nomine, formazione)</div>
          </li>
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">🎯 Piano formativo mirato</div>
            <div className="text-sm text-muted-foreground mt-1">e-learning e aula</div>
          </li>
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">👨‍⚕️ Nomina medico competente</div>
            <div className="text-sm text-muted-foreground mt-1">calendario sorveglianza sanitaria</div>
          </li>
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">🚨 Procedure di emergenza</div>
            <div className="text-sm text-muted-foreground mt-1">prove di evacuazione con report</div>
          </li>
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
        <div className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
          <SectorBenchmark sector={sector} />
        </div>
      </article>

      <article className="space-y-3">
        <h3 className="text-2xl font-semibold">Vantaggi completi</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">📦 Pacchetto unico completo</div>
            <div className="text-sm text-muted-foreground mt-1">documenti, formazione, visite</div>
          </li>
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">📱 Tracciamento digitale</div>
            <div className="text-sm text-muted-foreground mt-1">attestati e scadenze</div>
          </li>
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">🛡️ Supporto durante ispezioni</div>
            <div className="text-sm text-muted-foreground mt-1">assistenza ispettive</div>
          </li>
          <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
            <div className="font-medium text-foreground">🔄 Aggiornamenti inclusi</div>
            <div className="text-sm text-muted-foreground mt-1">normative 2024-2025</div>
          </li>
        </ul>
      </article>

      <Benefits minRisk={minRisk} maxRisk={maxRisk} />

      <aside className="rounded-lg border-2 border-cta p-6 bg-gradient-to-br from-cta/5 to-cta/10">
        <h3 className="text-xl font-semibold text-foreground">🚀 Pianifica la tua sicurezza adesso</h3>
        <p className="mt-2 text-muted-foreground">Attivi su tutto il territorio Siciliano. Richiedi un assessment gratuito e scopri come ridurre il rischio e i costi.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="tel:0955872480" className="inline-flex items-center px-4 py-2 bg-cta text-cta-foreground rounded-lg font-medium hover:bg-cta-light transition-colors">
            📞 Chiamaci ora: 095 587 2480
          </a>
          <a href="https://wa.me/390955872480" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-cta text-cta-foreground rounded-lg font-medium hover:bg-cta-light transition-colors">
            💬 Scrivici su WhatsApp
          </a>
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
      <div className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
        <div className="text-sm text-muted-foreground">Controlli annuali stimati</div>
        <div className="mt-1 font-semibold text-foreground">{data.controlli}</div>
      </div>
      <div className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
        <div className="text-sm text-muted-foreground">Irregolarità medie</div>
        <div className="mt-1 font-semibold text-primary">{data.irregolarita}</div>
      </div>
      <div className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
        <div className="text-sm text-muted-foreground">Focus ispezioni</div>
        <div className="mt-1 font-medium text-foreground">{data.focus}</div>
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
        <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
          <div className="text-sm text-muted-foreground">💰 Fondi recuperabili</div>
          <div className="mt-1 font-semibold text-primary">{currency(fundsMin)} - {currency(fundsMax)}</div>
        </li>
        <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
          <div className="text-sm text-muted-foreground">⏰ Tempo risparmiato</div>
          <div className="mt-1 font-semibold text-foreground">{timeMin}-{timeMax} ore/mese</div>
        </li>
        <li className="rounded-lg border border-primary/20 p-4 bg-card shadow-sm">
          <div className="text-sm text-muted-foreground">📉 Riduzione rischio</div>
          <div className="mt-1 font-semibold text-primary">{riskMin}% - {riskMax}%</div>
        </li>
      </ul>
    </article>
  );
};
