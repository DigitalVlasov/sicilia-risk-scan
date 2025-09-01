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
    
    // Caples-style headlines with Sicilian directness
    const titles = {
      high: "⚠️ Situazione critica rilevata",
      medium: "🔍 Attenzione: gap normativi individuati", 
      low: "✅ Situazione sotto controllo"
    };

    // Context-aware insights
    const managementInsights = {
      "gestisco-io": "Gestisci tutto da solo: ammirevole ma rischioso",
      "interno": "Hai risorse interne: ottima base per migliorare",
      "consulente": "Hai già supporto esterno: verifichiamo l'efficacia",
      "studi-multipli": "Coordinamento multiplo: serve standardizzazione"
    };

    const sectorContext = {
      edilizia: "Nel settore edile, anche piccoli gap possono costare caro",
      manifatturiero: "Industria manifatturiera: sicurezza = produttività",
      alimentare: "Settore alimentare: doppia conformità HACCP + 81/08",
      trasporto: "Trasporti: responsabilità estese su flotte e autisti",
      agricoltura: "Agricoltura: stagionalità complica compliance",
      commercio: "Commercio: clienti = testimoni potenziali",
      servizi: "Servizi: rischi sottovalutati ma presenti"
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
      return "Mantieni questo standard e monitora le evoluzioni normative.";
    } else if (violationCount <= 2) {
      return "Pochi aggiustamenti mirati possono eliminare i rischi residui.";
    } else {
      return "Serve un piano strutturato per sanare le criticità in ordine di priorità.";
    }
  }

  public generatePersonalizedAdvantages(answers: QuizAnswers): string[] {
    const sector = answers.settore as Sector;
    const management = answers.gestione;
    const employees = answers.dipendenti;

    const baseAdvantages = [
      "🛡️ Protezione legale completa con supporto ispettivo in tempo reale",
      "📊 Sistema digitale che elimina dimenticanze e scadenze mancate",
      "💰 ROI positivo: investimento minimo vs rischio sanzioni massime"
    ];

    // Add sector-specific advantages
    const sectorAdvantages = {
      edilizia: "🏗️ Integrazione con pratiche cantiere e coordinamento PSC",
      manifatturiero: "⚙️ Ottimizzazione produttiva attraverso sicurezza sistematica",
      alimentare: "🥘 Gestione unificata HACCP + sicurezza lavoro",
      trasporto: "🚛 Controllo flotte e formazione autisti centralizzata",
      agricoltura: "🌾 Gestione stagionalità e lavoratori temporanei",
      commercio: "🏪 Conformità punti vendita e customer safety",
      servizi: "💼 Protezione responsabilità professionale estesa"
    };

    if (sectorAdvantages[sector]) {
      baseAdvantages.push(sectorAdvantages[sector]);
    }

    // Add management-specific advantage
    const managementAdvantages = {
      "gestisco-io": "⏰ Liberi tempo per concentrarti sul business principale",
      "interno": "🤝 Potenziamo le tue risorse interne con tools professionali",
      "consulente": "🔧 Upgrade del sistema attuale con tecnologia avanzata",
      "studi-multipli": "🎯 Unifichiamo e standardizziamo tutti gli approcci"
    };

    const managementAdvantage = managementAdvantages[management as keyof typeof managementAdvantages];
    if (managementAdvantage) {
      baseAdvantages.push(managementAdvantage);
    }

    // Add company size advantage
    if (employees === ">20") {
      baseAdvantages.push("👥 Scalabilità garantita per organizzazioni complesse");
    } else {
      baseAdvantages.push("🎯 Soluzione agile per piccole-medie imprese");
    }

    return baseAdvantages;
  }
}

export const insightService = InsightService.getInstance();