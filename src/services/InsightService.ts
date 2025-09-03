// ==================== INSIGHT GENERATION SERVICE ====================
import { QuizAnswers, Violation, DynamicInsight, Sector } from '../types';

class InsightService {
  private static instance: InsightService;

  public static getInstance(): InsightService {
    if (!InsightService.instance) {
      InsightService.instance = new InsightService();
    }
    return InsightService.instance;
  }

  public generateDynamicInsight(answers: QuizAnswers, violations: Violation[]): DynamicInsight {
    const sector = answers.settore as Sector;
    const management = answers.gestione;
    const employees = answers.dipendenti;

    // Determine urgency based on violations and context
    let urgency: "low" | "medium" | "high" = "low";
    if (violations.length > 3 || employees === ">20") urgency = "high";
    else if (violations.length > 1) urgency = "medium";

    // Generate contextual insight using "Caples x Sicilian mentality"
    const insight = this.generateContextualInsight(sector, management, violations.length, urgency);

    return {
      title: insight.title,
      text: insight.text,
      urgency,
      type: violations.length > 0 ? "analysis" : "success"
    };
  }

  private generateContextualInsight(
    sector: Sector, 
    management: string, 
    violationCount: number,
    urgency: "low" | "medium" | "high"
  ): { title: string; text: string } {
    
    // Titoli psicologicamente calibrati per generare dubbio e curiosità
    const titles = {
      high: "Quello che non sai ti sta costando caro",
      medium: "C'è qualcosa che sfugge al tuo controllo", 
      low: "Stai facendo meglio del 60% delle aziende"
    };

    // Insights che creano pattern interrupt e dubbio costruttivo
    const managementInsights = {
      "gestisco-io": "Ti occupi di tutto personalmente - è la tua forza, ma anche il tuo tallone d'Achille",
      "interno": "Hai delegato la sicurezza internamente - una scelta saggia che nasconde però alcune insidie",
      "consulente": "Hai già un consulente - investimento intelligente che forse non sta rendendo quanto potrebbe",
      "studi-multipli": "Hai più consulenti - approccio prudente che potrebbe creare sovrapposizioni costose"
    };

    const sectorPsychology = {
      edilizia: "Nel tuo settore, quello che sembra 'piccolo' agli occhi di un ispettore può trasformarsi in una valanga di costi",
      manifatturiero: "La tua produzione dipende da equilibri invisibili che un controllo può spezzare in un momento",
      alimentare: "Gestisci il doppio rischio: la salute delle persone e quella del tuo business",
      trasporto: "Ogni tuo veicolo è un potenziale punto di controllo che può bloccare tutta l'attività",
      agricoltura: "Le stagionalità che conosci bene per il raccolto valgono anche per i controlli - ma li conosci davvero?",
      commercio: "I tuoi clienti vedono quello che vedranno anche gli ispettori - ma tu vedi quello che vedono loro?",
      servizi: "Credi di essere al sicuro negli uffici, ma le normative si stanno stringendo anche per te"
    };

    const psychologicalTrigger = this.getPsychologicalTrigger(violationCount, urgency);
    const managementContext = managementInsights[management as keyof typeof managementInsights] || "La tua situazione merita un'analisi più approfondita";
    const sectorTension = sectorPsychology[sector] || "Il tuo settore ha dinamiche specifiche che richiedono attenzione";

    return {
      title: titles[urgency],
      text: `${managementContext}. ${sectorTension}. ${psychologicalTrigger}`
    };
  }

  private getPsychologicalTrigger(violationCount: number, urgency: "low" | "medium" | "high"): string {
    if (violationCount === 0) {
      return "Ma quello che funziona oggi potrebbe non bastare domani - vale la pena verificare?";
    } else if (violationCount <= 2) {
      return "Pochi dettagli possono fare la differenza tra tranquillità e sorprese costose";
    } else {
      return "Ogni giorno che passa è un giorno in più di esposizione al rischio - ma esiste una via d'uscita";
    }
  }

  public generatePersonalizedAdvantages(answers: QuizAnswers): string[] {
    const sector = answers.settore as Sector;
    const management = answers.gestione;
    const employees = answers.dipendenti;

    const baseAdvantages = [
      "🛡️ Ti copriamo le spalle se arrivano i controlli",
      "📊 Non dimentichi più scadenze e carte da fare",
      "💰 Spendi poco ora, eviti multe grosse dopo"
    ];

    // Vantaggi specifici per settore
    const sectorAdvantages = {
      edilizia: "🏗️ Tutto collegato: cantiere, carte e controlli",
      manifatturiero: "⚙️ Più sicurezza = più produzione",
      alimentare: "🥘 Un solo sistema per cibo e sicurezza sul lavoro",
      trasporto: "🚛 Controlli tutti i camion e gli autisti da un posto solo",
      agricoltura: "🌾 Gestisci stagionali e fissi senza problemi",
      commercio: "🏪 Negozio sicuro = clienti tranquilli",
      servizi: "💼 Anche in ufficio hai responsabilità che non sai"
    };

    if (sectorAdvantages[sector]) {
      baseAdvantages.push(sectorAdvantages[sector]);
    }

    // Vantaggi per tipo di gestione
    const managementAdvantages = {
      "gestisco-io": "⏰ Hai più tempo per fare il tuo lavoro vero",
      "interno": "🤝 La tua gente diventa più brava con i nostri strumenti",
      "consulente": "🔧 Miglioriamo quello che hai già",
      "studi-multipli": "🎯 Mettiamo tutti d'accordo con un sistema solo"
    };

    const managementAdvantage = managementAdvantages[management as keyof typeof managementAdvantages];
    if (managementAdvantage) {
      baseAdvantages.push(managementAdvantage);
    }

    // Vantaggio per dimensione azienda
    if (employees === ">20") {
      baseAdvantages.push("👥 Funziona anche se hai tanta gente");
    } else {
      baseAdvantages.push("🎯 Fatto su misura per aziende come la tua");
    }

    return baseAdvantages;
  }
}

export const insightService = InsightService.getInstance();