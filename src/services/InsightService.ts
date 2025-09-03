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

    // Analisi contestuale ultra-personalizzata
    const context = this.buildPersonalizedContext(answers, violations);
    
    // Determine urgency and message type
    let urgency: "low" | "medium" | "high" = "low";
    if (violations.length > 3 || employees === ">20") urgency = "high";
    else if (violations.length > 1) urgency = "medium";

    // Generate insight completamente personalizzato basato su settore, gestione e risultati
    const insight = violations.length === 0 
      ? this.generateExcellenceInsight(sector, management, context)
      : this.generateImprovementInsight(sector, management, violations.length, context);

    return {
      title: insight.title,
      text: insight.text,
      urgency,
      type: violations.length > 0 ? "analysis" : "success"
    };
  }

  private buildPersonalizedContext(answers: QuizAnswers, violations: Violation[]): {
    sectorName: string;
    managementStyle: string;
    managementDescription: string;
    specificGaps: string[];
    sectorBenchmark: string;
    companySize: string;
  } {
    const sectorNames = {
      edilizia: "dell'edilizia",
      manifatturiero: "manifatturiero", 
      alimentare: "alimentare e della ristorazione",
      trasporto: "dei trasporti e logistica",
      agricoltura: "agricolo",
      commercio: "del commercio",
      servizi: "dei servizi"
    };

    const managementStyles = {
      "gestisco-io": {
        name: "gestisci personalmente la sicurezza",
        description: "Ti occupi tu direttamente di tutte le questioni di sicurezza - un approccio che denota grande attenzione e controllo diretto"
      },
      "interno": {
        name: "hai una risorsa interna dedicata",
        description: "Hai qualcuno in azienda che se ne occupa - una scelta che dimostra la volontà di tenere tutto 'in casa'"
      },
      "consulente": {
        name: "ti appoggi a un consulente esterno",
        description: "Hai scelto di affidarti a un professionista esterno - una decisione strategica molto diffusa"
      },
      "studi-multipli": {
        name: "collabori con più professionisti",
        description: "Hai diversi consulenti per aree specifiche - un approccio specialistico che punta all'eccellenza"
      }
    };

    const sectorBenchmarks = {
      edilizia: "Nel settore edile, il 68% delle aziende ha almeno 2-3 criticità nei controlli - la tua situazione è nella norma",
      manifatturiero: "Nel manifatturiero, 7 aziende su 10 hanno gap organizzativi simili - non sei l'unico",
      alimentare: "Nel food, anche le aziende più attente spesso hanno 1-2 aspetti da sistemare - è fisiologico",
      trasporto: "Nel trasporto, la maggior parte delle aziende naviga a vista su alcune questioni - è tipico del settore",
      agricoltura: "In agricoltura, con tutte le normative che cambiano, è normale avere qualche aspetto da allineare",
      commercio: "Nel commercio, molti sottovalutano alcuni aspetti della sicurezza - capita spesso",
      servizi: "Nei servizi, si pensa spesso di essere 'al sicuro' ma ci sono sempre dettagli che sfuggono"
    };

    const specificGaps = [];
    if (answers.formazione === "no" || answers.formazione === "parziale") {
      specificGaps.push("formazione non completamente aggiornata");
    }
    if (answers.dvr === "absent") {
      specificGaps.push("documento di valutazione dei rischi mancante");
    } else if (answers.dvr === "update") {
      specificGaps.push("DVR da aggiornare");
    }
    if (answers.figure_spp === "no" || answers.figure_spp === "parziale") {
      specificGaps.push("nomine delle figure della sicurezza incomplete");
    }

    return {
      sectorName: sectorNames[answers.settore as keyof typeof sectorNames] || "del tuo settore",
      managementStyle: managementStyles[answers.gestione as keyof typeof managementStyles]?.name || "gestisci la sicurezza",
      managementDescription: managementStyles[answers.gestione as keyof typeof managementStyles]?.description || "",
      specificGaps,
      sectorBenchmark: sectorBenchmarks[answers.settore as keyof typeof sectorBenchmarks] || "",
      companySize: answers.dipendenti === ">20" ? "con il tuo organico" : "per una realtà come la tua"
    };
  }

  private generateExcellenceInsight(sector: Sector, management: string, context: any): { title: string; text: string } {
    const titles = [
      "Complimenti, sei sulla strada giusta!",
      "La tua azienda è ben organizzata",
      "Stai facendo un ottimo lavoro"
    ];

    const text = `Dalle tue risposte emerge che ${context.managementDescription.toLowerCase()} e la tua azienda nel settore ${context.sectorName} appare ben strutturata dal punto di vista della sicurezza. 

Onestamente, al momento non abbiamo consigli specifici da darti perché sembri già essere seguito adeguatamente. Tuttavia, se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se ci sono margini per semplificare alcuni processi, velocizzare le pratiche o magari ottenere condizioni più vantaggiose rispetto a quelle attuali.`;

    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      text
    };
  }

  private generateImprovementInsight(sector: Sector, management: string, violationCount: number, context: any): { title: string; text: string } {
    const violationText = violationCount === 1 ? "1 aspetto da sistemare" : `${violationCount} aspetti da allineare`;
    
    const title = violationCount > 3 
      ? "Serve un po' di ordine, ma niente panico" 
      : violationCount > 1 
        ? "Qualche dettaglio da sistemare" 
        : "Solo un piccolo aggiustamento";

    const gapsText = context.specificGaps.length > 0 
      ? `Nello specifico: ${context.specificGaps.join(", ")}.` 
      : "";

    const text = `Dalla tua analisi emergono ${violationText} per la tua azienda nel settore ${context.sectorName}. ${context.managementDescription} - ed è una scelta che rispettiamo completamente.

${gapsText} ${context.sectorBenchmark}

Il fatto è che il sistema normativo si aggiorna continuamente e con tutte le cose che hai da fare è davvero complicato stare dietro a tutto. Non è colpa tua né del modo in cui hai scelto di organizzarti.

Se vuoi, possiamo aiutarti a semplificare la gestione, ridurre il rischio di dimenticanze ed errori, e permetterti di concentrarti sul tuo business principale.`;

    return { title, text };
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