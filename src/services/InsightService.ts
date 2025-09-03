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

    // Analizza i pattern specifici delle risposte per creare insight ultra-personalizzati
    const specificResponses = this.analyzeResponsePatterns(answers, violations);
    
    // Determine urgency based on violations and context
    let urgency: "low" | "medium" | "high" = "low";
    if (violations.length > 3 || employees === ">20") urgency = "high";
    else if (violations.length > 1) urgency = "medium";

    // Generate insight che rispecchia esattamente la sua situazione specifica
    const insight = this.generateMirrorInsight(sector, management, violations.length, urgency, specificResponses);

    return {
      title: insight.title,
      text: insight.text,
      urgency,
      type: violations.length > 0 ? "analysis" : "success"
    };
  }

  private analyzeResponsePatterns(answers: QuizAnswers, violations: Violation[]): {
    mainGap: string;
    riskProfile: string;
    specificSituation: string;
  } {
    // Identifica il gap principale dalle risposte specifiche
    let mainGap = "documentazione";
    let riskProfile = "standard";
    let specificSituation = "";

    // Analizza formazione
    if (answers.formazione === "no" || answers.formazione === "parziale") {
      mainGap = "formazione";
      specificSituation += "La formazione non è aggiornata - ";
    }

    // Analizza DVR
    if (answers.dvr === "absent") {
      mainGap = "dvr_mancante";
      riskProfile = "critico";
      specificSituation += "DVR assente - ";
    } else if (answers.dvr === "update") {
      specificSituation += "DVR da aggiornare - ";
    }

    // Analizza sistema di gestione
    if (answers.gestione === "no") {
      specificSituation += "nessun sistema strutturato - ";
    } else if (answers.gestione === "parziale") {
      specificSituation += "gestione frammentaria - ";
    }

    // Analizza figure obbligatorie
    if (answers.figure_spp === "no" || answers.figure_spp === "parziale") {
      specificSituation += "nomine incomplete - ";
    }

    return { mainGap, riskProfile, specificSituation };
  }

  private generateMirrorInsight(
    sector: Sector, 
    management: string, 
    violationCount: number,
    urgency: "low" | "medium" | "high",
    patterns: { mainGap: string; riskProfile: string; specificSituation: string }
  ): { title: string; text: string } {
    
    // Titoli che richiamano direttamente la promessa dell'intro: "Se l'ispettore bussa domani?"
    const urgencyTitles = {
      high: patterns.riskProfile === "critico" ? 
        "Se l'ispettore bussa domani, sei nei guai" : 
        "L'ispettore ti troverebbe impreparato",
      medium: "Qualcosa sfuggirebbe all'occhio dell'ispettore", 
      low: "All'ispettore non sfuggirebbe molto, ma..."
    };

    // Insight che rispecchiano ESATTAMENTE la situazione dalle risposte
    const situationMirrors = {
      dvr_mancante: "Non hai il DVR - è come non avere la patente quando guidi",
      formazione: "La formazione dei tuoi dipendenti non è aggiornata secondo l'Accordo Stato-Regioni",
      documentazione: "Hai delle lacune nella documentazione obbligatoria",
    };

    // Riconoscimento del management style con mirror specifico
    const managementMirrors = {
      "ok": "Gestisci tutto con un sistema strutturato - sei tra i pochi che lo fa bene",
      "parziale": "Hai iniziato a organizzarti ma mancano ancora alcuni pezzi del puzzle",
      "no": "Gestisci tutto 'a memoria' - funziona finché funziona, ma è rischioso"
    };

    // Contexto settoriale che richiama i controlli specifici
    const sectorRealities = {
      edilizia: "In cantiere l'ispettore vede tutto: dalla formazione alle protezioni, dal DVR alle emergenze",
      manifatturiero: "Nelle fabbriche i controlli sono sempre più frequenti e dettagliati - ogni documento conta",
      alimentare: "Nel tuo settore hai doppi controlli: sicurezza sul lavoro E sicurezza alimentare",
      trasporto: "Ogni mezzo è un punto di controllo potenziale - INAIL, Trasporti, Lavoro possono fermarti",
      agricoltura: "I controlli in campagna stanno aumentando: lavoratori stagionali, macchine, sostanze chimiche",
      commercio: "Anche nei negozi l'occhio si è fatto più attento: clienti e dipendenti devono essere protetti",
      servizi: "Negli uffici pensavi di essere al sicuro? Le normative si stringono anche per il terziario"
    };

    const situationRecognition = situationMirrors[patterns.mainGap as keyof typeof situationMirrors] || 
      `Le tue risposte mostrano ${patterns.specificSituation.replace(/ -$/, '')}`;
    
    const managementRecognition = managementMirrors[management as keyof typeof managementMirrors] || 
      "La tua gestione della sicurezza ha margini di miglioramento";

    const sectorContext = sectorRealities[sector] || "Nel tuo settore i controlli sono sempre più rigorosi";

    const psychologicalTrigger = this.getPsychologicalTrigger(violationCount, urgency, patterns.riskProfile);

    return {
      title: urgencyTitles[urgency],
      text: `${situationRecognition}. ${managementRecognition}. ${sectorContext}. ${psychologicalTrigger}`
    };
  }

  private getPsychologicalTrigger(violationCount: number, urgency: "low" | "medium" | "high", riskProfile?: string): string {
    if (violationCount === 0) {
      return "Ma quello che funziona oggi potrebbe non bastare domani - non credi valga la pena verificare?";
    } else if (violationCount <= 2) {
      return "Pochi dettagli possono fare la differenza tra tranquillità e una brutta sorpresa costosa";
    } else {
      if (riskProfile === "critico") {
        return "Ogni giorno che passa aumenta il rischio di controlli - ma c'è ancora tempo per sistemare tutto";
      }
      return "La situazione è gestibile, ma serve un piano preciso per mettersi in regola step by step";
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