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
    
    // Headlines stile Hopkins: problema specifico + conseguenza emotiva
    const directHeadlines = {
      high: patterns.riskProfile === "critico" ? 
        "ATTENZIONE: Stai correndo un rischio GRAVE" : 
        "Houston, abbiamo un problema",
      medium: "Qualcosa di importante ti sta sfuggendo", 
      low: "Sei sulla strada giusta, MA..."
    };

    // Struttura sales letter: Problema + Agitazione + Soluzione
    const problemStatements = {
      dvr_mancante: "Non hai il DVR. È come guidare senza patente - prima o poi ti beccano",
      formazione: "La formazione dei tuoi dipendenti non è aggiornata. E gli ispettori lo scoprono sempre",
      documentazione: "Ti mancano carte importanti. E quando arriva il controllo, sono proprio quelle che ti chiedono",
    };

    // Agitazione: amplifica la conseguenza
    const agitationPhrases = {
      "ok": "Anche se hai un sistema, gli ispettori sanno dove guardare per trovare i dettagli che mancano",
      "parziale": "Hai iniziato a organizzarti, ma le mezze misure con gli ispettori non funzionano",
      "no": "Gestisci tutto 'a memoria'... ma la memoria non ti salva dalla multa"
    };

    // Contexto settoriale con tono di urgenza
    const sectorUrgency = {
      edilizia: "In cantiere ogni giorno che passa senza essere in regola è un giorno di rischio",
      manifatturiero: "In fabbrica i controlli arrivano quando meno te lo aspetti - e sono sempre più severi",
      alimentare: "Nel food devi essere perfetto su TUTTO: un errore e ti chiudono",
      trasporto: "Con i mezzi ti possono fermare ovunque - strada, azienda, anche dai clienti",
      agricoltura: "I controlli in campagna stanno esplodendo - lavoratori, macchine, fitofarmaci",
      commercio: "Anche nei negozi gli ispettori ora guardano tutto con la lente d'ingrandimento",
      servizi: "Negli uffici pensavi di essere al sicuro? Ti sbagli di grosso"
    };

    // Soluzione soft ma convincente
    const solutionTeaser = this.getSolutionTeaser(violationCount, patterns.riskProfile);

    const problemStatement = problemStatements[patterns.mainGap as keyof typeof problemStatements] || 
      `Dalle tue risposte emerge che ${patterns.specificSituation.replace(/ -$/, '')}`;
    
    const agitation = agitationPhrases[management as keyof typeof agitationPhrases] || 
      "Le mezze misure con la sicurezza non pagano mai";

    const urgencyContext = sectorUrgency[sector] || "Nel tuo settore non puoi permetterti errori";

    return {
      title: directHeadlines[urgency],
      text: `${problemStatement}. ${agitation}. ${urgencyContext}. ${solutionTeaser}`
    };
  }

  private getSolutionTeaser(violationCount: number, riskProfile?: string): string {
    if (violationCount === 0) {
      return "Ma non abbassare la guardia: noi ti aiutiamo a restare sempre un passo avanti";
    } else if (violationCount <= 2) {
      return "La buona notizia? Con le mosse giuste sistemi tutto rapidamente";
    } else {
      if (riskProfile === "critico") {
        return "C'è ancora tempo per sistemare tutto - ma devi muoverti SUBITO";
      }
      return "Serve un piano preciso, step by step. E noi sappiamo esattamente da dove iniziare";
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