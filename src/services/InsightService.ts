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
    
    // Titoli diretti e chiari
    const titles = {
      high: "⚠️ Hai problemi seri",
      medium: "🔍 Hai alcuni problemi", 
      low: "✅ Vai bene così"
    };

    // Riconoscimento diretto della situazione
    const managementInsights = {
      "gestisco-io": "Fai tutto tu: bravo, ma rischi grosso",
      "interno": "Hai gente che ti aiuta: buona cosa",
      "consulente": "Hai già un consulente: vediamo se funziona",
      "studi-multipli": "Hai più consulenti: serve mettere ordine"
    };

    const sectorContext = {
      edilizia: "In edilizia anche un piccolo errore ti costa caro",
      manifatturiero: "In fabbrica la sicurezza fa guadagnare di più",
      alimentare: "Con il cibo hai due tipi di controlli da rispettare",
      trasporto: "Con i camion rispondi anche per gli autisti",
      agricoltura: "In campagna i controlli cambiano con le stagioni",
      commercio: "Nel negozio i clienti vedono tutto",
      servizi: "Negli uffici pensi di essere sicuro ma non è così"
    };

    const baseText = managementInsights[management as keyof typeof managementInsights] || "Situazione da analizzare";
    const contextText = sectorContext[sector] || "";

    return {
      title: titles[urgency],
      text: `${baseText}. ${contextText}. ${this.getActionableAdvice(violationCount)}`
    };
  }

  private getActionableAdvice(violationCount: number): string {
    if (violationCount === 0) {
      return "Continua così e tieni d'occhio le nuove regole.";
    } else if (violationCount <= 2) {
      return "Con poche mosse sistemi tutto.";
    } else {
      return "Serve un piano per sistemare tutto per gradi.";
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