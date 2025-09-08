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

    // Template personalizzati per ogni tipo di gestione in scenari positivi
    const excellenceTemplates = {
      "studi-multipli": {
        title: "Complimenti, stai lavorando con i migliori!",
        text: `Dalle tue risposte emerge che collabori con più specialisti e la tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>. Avere diversi professionisti è il top dell'approccio specialistico.

<strong>Al momento non abbiamo consigli specifici da darti</strong> perché sembri già avere tutto sotto controllo. Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>centralizzare le comunicazioni tra i tuoi consulenti</strong>, <strong>velocizzare il coordinamento</strong> o magari <strong>ridurre i tempi di attesa</strong> quando devi recuperare documenti o informazioni da fonti diverse.`,
        ctaText: "Confronta con il nostro sistema di coordinamento"
      },
      "consulente": {
        title: "Ottima scelta, hai un professionista di fiducia!",
        text: `Dalle tue risposte emerge che ${context.managementDescription.toLowerCase()} e la tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>. Affidarti a un consulente esterno è una scelta strategica vincente.

<strong>Onestamente, al momento non abbiamo consigli specifici da darti</strong> perché sembri già essere seguito adeguatamente. Tuttavia, se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se ci sono margini per <strong>dare al tuo consulente strumenti più avanzati</strong>, <strong>velocizzare le sue pratiche</strong> o magari <strong>ottenere maggiore visibilità</strong> sullo stato dei tuoi adempimenti.`,
        ctaText: "Scopri gli strumenti per potenziare il tuo consulente"
      },
      "interno": {
        title: "Fantastico, hai una risorsa dedicata!",
        text: `Dalle tue risposte emerge che hai una risorsa interna che si occupa della sicurezza e la tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>. Tenere tutto "in casa" è una scelta che ti dà il massimo controllo.

<strong>Al momento non abbiamo consigli specifici da darti</strong> perché sembri già ben organizzato. Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>alleggerire il carico di lavoro della tua risorsa interna</strong>, <strong>automatizzare alcune routine</strong> o magari <strong>darle strumenti più moderni</strong> per gestire tutto con meno sforzo.`,
        ctaText: "Scopri come alleggerire il carico della tua risorsa"
      },
      "gestisco-io": {
        title: "Complimenti, hai tutto sotto controllo!",
        text: `Dalle tue risposte emerge che ${context.managementDescription.toLowerCase()} e la tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>. Il controllo diretto è il massimo dell'attenzione imprenditoriale.

<strong>Al momento non abbiamo consigli specifici da darti</strong> perché sembri già avere tutto sotto controllo. Se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se riusciamo a <strong>liberarti da parte della burocrazia quotidiana</strong>, <strong>automatizzare i controlli di routine</strong> o magari <strong>darti più tempo per il business</strong> mantenendo la tua supervisione.`,
        ctaText: "Scopri come automatizzare mantenendo il controllo"
      }
    };

    const template = excellenceTemplates[management as keyof typeof excellenceTemplates];
    
    if (!template) {
      // Fallback per gestioni non previste
      return {
        title: "Complimenti, sei sulla strada giusta!",
        text: `Dalle tue risposte emerge che la tua azienda nel settore ${sectorName} appare <strong>ben strutturata dal punto di vista della sicurezza</strong>. 

<strong>Al momento non abbiamo consigli specifici da darti</strong> perché sembri già essere seguito adeguatamente. Tuttavia, se vuoi, possiamo confrontare il tuo sistema attuale con il nostro per vedere se ci sono margini per <strong>semplificare alcuni processi o velocizzare le pratiche</strong>.`,
        ctaText: "Scopri come ottimizzare ulteriormente"
      };
    }

    return {
      title: template.title,
      text: template.text,
      ctaText: template.ctaText
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