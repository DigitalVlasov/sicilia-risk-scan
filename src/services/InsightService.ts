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
      type: violations.length > 0 ? "analysis" : "success",
      benefits: insight.benefits,
      ctaText: insight.ctaText
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
      edilizia: "di Edilizia",
      manifatturiero: "di Manifatturiero / Produzione", 
      alimentare: "di alloggio/ristorazione", // legacy fallback
      trasporto: "dei trasporti e logistica", // legacy fallback
      agricoltura: "di Agricoltura / Allevamento",
      commercio: "del commercio", // legacy fallback
      servizi: "di Servizi / Uffici",
      ristorazione: "di Ristorazione / Commercio"
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
      servizi: "Nei servizi, si pensa spesso di essere 'al sicuro' ma ci sono sempre dettagli che sfuggono",
      ristorazione: "Nel settore alloggio e ristorazione, tra orari prolungati e ritmi intensi, è normale che alcuni aspetti sfuggano"
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

  private generateExcellenceInsight(sector: Sector, management: string, context: any): { title: string; text: string; benefits?: string[]; ctaText?: string } {
    const sectorNames = {
      edilizia: "di Edilizia",
      manifatturiero: "di Manifatturiero / Produzione", 
      alimentare: "di alloggio/ristorazione",
      trasporto: "di logistica",
      agricoltura: "di Agricoltura / Allevamento",
      commercio: "del commercio",
      servizi: "di Servizi / Uffici",
      ristorazione: "di Ristorazione / Commercio"
    };

    const sectorName = sectorNames[sector] || "del tuo settore";

    // Template con strategia pro/contro per creare leva naturale per il confronto
    const excellenceTemplates = {
      "studi-multipli": {
        title: "Complimenti, stai lavorando con i migliori!",
        text: `Dalle tue risposte emerge che collabori con più professionisti, una scelta di eccellenza che punta alla massima specializzazione. La tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>.

<strong>I vantaggi della tua scelta:</strong> hai accesso ai migliori specialisti per ogni area, con competenze ultra-specifiche.
<strong>L'unico aspetto critico:</strong> coordinare più interlocutori può generare rallentamenti quando serve una risposta rapida o un documento urgente.

Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>mantenere la specializzazione eliminando i tempi morti di coordinamento</strong>.`,
        ctaText: "Confronta: specializzazione + coordinamento ottimale",
        benefits: [
          "<strong>Coordinamento unificato</strong>: Un unico interlocutore per tutti gli specialisti mantenendo la qualità",
          "<strong>Risposte immediate</strong>: Accesso istantaneo a tutte le competenze senza tempi di attesa",
          "<strong>Gestione integrata</strong>: Documenti e scadenze coordinati in un sistema unico",
          "<strong>Consulenza premium</strong>: Accesso diretto ai migliori specialisti per ogni area normativa",
          "<strong>Aggiornamenti automatici</strong>: Sistema sempre allineato senza contattare più consulenti"
        ]
      },
      "consulente": {
        title: "Ottima scelta, hai un professionista di fiducia!",
        text: `Dalle tue risposte emerge che hai scelto di affidarti a un professionista esterno, una decisione strategica molto diffusa. La tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>.

<strong>I vantaggi della tua scelta:</strong> hai un esperto dedicato, costi prevedibili e nessun onere di formazione interna.
<strong>L'unico aspetto critico:</strong> quando hai bisogno di informazioni immediate o devi gestire urgenze, dipendi dalla sua disponibilità.

Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>mantenere la professionalità esterna dandoti accesso immediato a tutto</strong>.`,
        ctaText: "Confronta: consulente + accesso immediato",
        benefits: [
          "<strong>Disponibilità H24</strong>: Accesso immediato a informazioni e documenti senza aspettare il consulente",
          "<strong>Sistema sempre attivo</strong>: Piattaforma digitale che lavora anche quando il consulente non è disponibile",
          "<strong>Stesso budget, più valore</strong>: Costo fisso mensile con servizi aggiuntivi e disponibilità continua",
          "<strong>Strumenti professionali</strong>: Accesso agli stessi tool dei migliori consulenti del settore",
          "<strong>Monitoraggio automatico</strong>: Sistema che ti avvisa in anticipo su scadenze e aggiornamenti"
        ]
      },
      "interno": {
        title: "Fantastico, hai una risorsa dedicata!",
        text: `Dalle tue risposte emerge che hai una risorsa interna che si occupa della sicurezza, una scelta strategica che ti dà il massimo controllo. La tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>.

<strong>I vantaggi della tua scelta:</strong> controllo diretto, disponibilità immediata e conoscenza perfetta dell'azienda.
<strong>L'unico aspetto critico:</strong> il carico di aggiornamenti normativi e la gestione di tutti gli adempimenti può diventare pesante per una sola persona.

Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>mantenere il controllo diretto alleggerendo significativamente il carico di lavoro</strong>.`,
        ctaText: "Confronta: controllo diretto + carico ridotto",
        benefits: [
          "<strong>Automazione intelligente</strong>: Sistema che gestisce routine e scadenze liberando tempo strategico",
          "<strong>Formazione continua</strong>: Training specialistici per mantenere aggiornata la risorsa interna",
          "<strong>Supporto esperto</strong>: Backup di specialisti per situazioni complesse o dubbi interpretativi",
          "<strong>Gestione semplificata</strong>: Piattaforma che riduce del 70% il tempo dedicato alla burocrazia",
          "<strong>Controllo totale</strong>: Mantieni il controllo diretto con strumenti professionali enterprise"
        ]
      },
      "gestisco-io": {
        title: "Complimenti, hai tutto sotto controllo!",
        text: `Dalle tue risposte emerge che gestisci personalmente la sicurezza, una scelta che dimostra la massima attenzione imprenditoriale. La tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>.

<strong>I vantaggi della tua scelta:</strong> controllo totale, nessun intermediario e decisioni immediate.
<strong>L'unico aspetto critico:</strong> il tempo che dedichi alla burocrazia della sicurezza è tempo che sottrai al business e alla crescita aziendale.

Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>mantenere il tuo controllo totale liberandoti dalla gestione quotidiana</strong>.`,
        ctaText: "Confronta: controllo totale + tempo per il business",
        benefits: [
          "<strong>Più tempo per il business</strong>: Sistema che riduce del 90% il tempo dedicato agli adempimenti",
          "<strong>Controllo manageriale</strong>: Dashboard executive per monitorare tutto senza perderti nei dettagli",
          "<strong>Focus su crescita</strong>: Tempo prezioso liberato per vendite, innovazione e sviluppo aziendale",
          "<strong>Processo automatico</strong>: Sistema in background che gestisce scadenze e aggiornamenti",
          "<strong>Governance strategica</strong>: Controllo sulle decisioni importanti, deleghi solo l'operatività"
        ]
      }
    };

    const template = excellenceTemplates[management as keyof typeof excellenceTemplates];
    
    if (!template) {
      // Fallback per gestioni non previste
      return {
        title: "Complimenti, sei sulla strada giusta!",
        text: `Dalle tue risposte emerge che la tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>. 

<strong>Al momento non abbiamo consigli specifici da darti</strong> perché sembri già essere seguito adeguatamente. Tuttavia, se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se ci sono margini per <strong>semplificare alcuni processi o velocizzare le pratiche</strong>.`,
        ctaText: "Scopri come ottimizzare ulteriormente",
        benefits: [
          "<strong>Ottimizzazione processi</strong>: Analisi delle procedure attuali per identificare miglioramenti",
          "<strong>Automazione smart</strong>: Implementazione di automazioni per ridurre i tempi di gestione",
          "<strong>Monitoraggio avanzato</strong>: Sistema di controllo per mantenere sempre alta la conformità",
          "<strong>Consulenza specialistica</strong>: Accesso a esperti per situazioni particolari o nuove normative",
          "<strong>Supporto strategico</strong>: Partnership per accompagnare la crescita aziendale in sicurezza"
        ]
      };
    }

    return {
      title: template.title,
      text: template.text,
      ctaText: template.ctaText,
      benefits: template.benefits
    };
  }

  private generateImprovementInsight(sector: Sector, management: string, violationCount: number, context: any): { title: string; text: string; benefits: string[]; ctaText: string } {
    const sectorPercentages = {
      edilizia: "68%",
      manifatturiero: "70%", 
      alimentare: "65%",
      trasporto: "72%",
      agricoltura: "60%",
      commercio: "58%",
      servizi: "55%",
      ristorazione: "63%"
    };

    const sectorNames = {
      edilizia: "di Edilizia",
      manifatturiero: "di Manifatturiero / Produzione", 
      alimentare: "di alloggio/ristorazione", // legacy fallback
      trasporto: "di logistica", // legacy fallback
      agricoltura: "di Agricoltura / Allevamento",
      commercio: "del commercio", // legacy fallback
      servizi: "di Servizi / Uffici",
      ristorazione: "di Ristorazione / Commercio"
    };

    const sectorPercentage = sectorPercentages[sector] || "65%";
    const sectorName = sectorNames[sector] || "del tuo settore";

    // Template Hopkins-style per ogni tipo di gestione - Semanticamente corretti
    const templates = {
      "studi-multipli": {
        text: `La tua analisi mostra ${violationCount} aree di rischio, le stesse che il ${sectorPercentage} delle aziende nel settore ${sectorName.replace('di ', '').replace('del ', '').replace('dei ', '')} affronta. Lavorare con più specialisti è un metodo valido, ma genera frammentazione. <strong>Quando le informazioni sono divise, il rischio di una scadenza mancata o di un documento non aggiornato aumenta.</strong> Il risultato è un sistema che ti espone a multe e ti fa perdere tempo. Noi creiamo una cabina di regia centralizzata che coordina tutti i professionisti coinvolti, mantenendo la specializzazione ma eliminando la frammentazione. Non sostituiamo i tuoi consulenti: diamo loro (e a te) un ambiente condiviso dove tutto è sotto controllo.`,
        ctaText: "Scopri la cabina di regia per i tuoi consulenti",
        benefits: [
          "Unico sistema, zero frammentazione.",
          "Scadenze sotto controllo, rischio azzerato.",
          "Documenti sempre pronti per i controlli.",
          "Nuovi assunti subito a norma, senza sforzi.",
          "Formazione finanziata, costi ottimizzati."
        ]
      },
      "consulente": {
        text: `Dalle tue risposte emergono <strong>${violationCount} criticità</strong> che il <strong>${sectorPercentage} delle aziende</strong> nel settore ${sectorName.replace('di ', '').replace('del ', '').replace('dei ', '')} affronta. Affidarsi a un consulente esterno è la scelta corretta, ma anche il professionista migliore, <strong>senza un sistema di controllo centralizzato, può trovarsi a rincorrere le informazioni</strong>. Questo ti espone a ritardi e rischi inutili. 

Noi configuriamo un sistema che fornisce al tuo tecnico <strong>uno strumento digitale dove tutto è automatizzato e sotto controllo</strong>, riducendo gli errori a zero. <strong>Non sostituiamo il tuo consulente:</strong> gli diamo (e ti diamo) una piattaforma che semplifica il suo lavoro e ti garantisce il pieno controllo.`,
        ctaText: "Scopri lo spazio condiviso per te e il tuo consulente",
        benefits: [
          "Pieno controllo per te e il tuo consulente.",
          "Scadenze e adempimenti sempre rispettati.",
          "Documentazione a prova di ispezione, 24/7.",
          "Gestione del personale semplice e conforme.",
          "Costi di formazione ridotti con i fondi."
        ]
      },
      "interno": {
        text: `La tua azienda presenta <strong>${violationCount} aree di rischio</strong>, comuni al <strong>${sectorPercentage} delle aziende</strong> nel settore ${sectorName.replace('di ', '').replace('del ', '').replace('dei ', '')}. Avere una risorsa interna dedicata è molto vantaggioso, ma di fronte a un sistema normativo in continua evoluzione anche il collaboratore più preparato può trovarsi in difficoltà. <strong>Si rischia di perdere aggiornamenti cruciali</strong> mentre si gestisce l'operatività quotidiana. 

Noi implementiamo una soluzione chiavi in mano che <strong>potenzia la tua risorsa interna</strong> con un sistema che automatizza i controlli e azzera le sviste. <strong>La tua persona continua a gestire tutto</strong>, ma con strumenti professionali che <strong>riducono il carico di lavoro dell'80%</strong>.`,
        ctaText: "Scopri come potenziamo la tua risorsa interna",
        benefits: [
          "Meno burocrazia per la tua risorsa interna.",
          "Nessuna scadenza mancata, zero errori.",
          "Verbali e documenti pronti all'uso.",
          "Gestione di fissi e stagionali senza problemi.",
          "Formazione obbligatoria a costi ottimizzati."
        ]
      },
      "gestisco-io": {
        text: `La tua analisi evidenzia <strong>${violationCount} criticità</strong>, le stesse che il <strong>${sectorPercentage} delle aziende</strong> nel settore ${sectorName.replace('di ', '').replace('del ', '').replace('dei ', '')} non riesce a gestire efficacemente. Il tuo controllo diretto è un punto di forza, ma <strong>il tempo che dedichi a seguire la burocrazia della sicurezza è tempo che sottrai alla crescita del business</strong>. Ogni minuto speso a controllare scadenze e documenti è un minuto perso. 

Noi installiamo un <strong>sistema automatico completamente configurato</strong> che ti permette di delegare questi compiti mantenendo il pieno controllo. <strong>Tu mantieni la supervisione</strong>, ma senza perdere tempo nella gestione quotidiana.`,
        ctaText: "Scopri il sistema automatico personalizzato",
        benefits: [
          "Delega la burocrazia, recupera il tuo tempo.",
          "Scadenze sempre sotto controllo, zero stress.",
          "Documentazione centralizzata e accessibile.",
          "Onboarding nuovi assunti: rapido e conforme.",
          "Costi della formazione drasticamente ridotti."
        ]
      }
    };

    const template = templates[management as keyof typeof templates];
    
    if (!template) {
      // Fallback per gestioni non previste
      return {
        title: "Alcune aree necessitano attenzione",
        text: `Dalla tua analisi emergono <strong>${violationCount} criticità</strong> per la tua azienda. Il sistema normativo è complesso e in continua evoluzione. <strong>Possiamo aiutarti a semplificare la gestione e ridurre i rischi.</strong>`,
        ctaText: "Scopri come gestiamo questi aspetti per i nostri clienti",
        benefits: [
          "Sistema semplificato e centralizzato.",
          "Controllo completo su scadenze e documenti.",
          "Riduzione dei rischi e delle sanzioni."
        ]
      };
    }

    return {
      title: "Cosa emerge dalle risposte:",
      text: template.text,
      ctaText: template.ctaText,
      benefits: template.benefits
    };
  }
}

export const insightService = InsightService.getInstance();