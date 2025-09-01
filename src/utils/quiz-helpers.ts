import { QuizAnswers, QuizQuestion, Risk, Violation, DynamicInsight, ManagementStyle, Sector } from "../types/quiz";
import { QUIZ_QUESTIONS, VIOLATIONS_CONFIG } from "../constants/quiz-config";

// ==================== HELPER FUNCTIONS ====================

// Filter questions based on conditional logic
export const filterQuestions = (answers: QuizAnswers): QuizQuestion[] => {
  return QUIZ_QUESTIONS.filter(question => {
    if (!question.conditional) return true;
    
    const dependentAnswer = answers[question.conditional.dependsOn];
    return dependentAnswer && question.conditional.showFor.includes(dependentAnswer);
  });
};

// Calculate risk level based on score and multiplier
export const calculateRisk = (baseScore: number, multiplier: number): Risk => {
  const finalScore = baseScore * multiplier;
  
  if (finalScore <= 4) return { level: "Basso", finalScore };
  if (finalScore <= 10) return { level: "Medio", finalScore };
  return { level: "Alto", finalScore };
};

// Calculate violations based on answers
export const calculateViolations = (answers: QuizAnswers): Violation[] => {
  return Object.keys(VIOLATIONS_CONFIG)
    .filter(key => {
      const question = QUIZ_QUESTIONS.find(q => q.id === key);
      if (!question) return false;
      
      const isAnsweredNegative = ["no", "non-sicuro", "non-gestisco"].includes(answers[key]);
      if (!isAnsweredNegative) return false;
      
      if (question.conditional) {
        const dependentAnswer = answers[question.conditional.dependsOn];
        return dependentAnswer && question.conditional.showFor.includes(dependentAnswer);
      }
      
      return true;
    })
    .map(key => VIOLATIONS_CONFIG[key])
    .sort((a, b) => a.priority.order - b.priority.order);
};

// Get badge variant based on risk level
export const riskBadgeVariant = (level: string): "default" | "destructive" | "outline" | "secondary" => {
  if (level === "Basso") return "secondary";
  if (level === "Medio") return "outline";
  return "destructive";
};

// Get display name for sector
export const getSectorDisplayName = (sector: string): string => {
  const sectorNames: Record<string, string> = {
    edilizia: "edilizia",
    manifatturiero: "manifatturiero", 
    alimentare: "alimentare",
    trasporto: "trasporti e magazzinaggio",
    agricoltura: "agricoltura",
    commercio: "commercio",
    servizi: "servizi"
  };
  return sectorNames[sector] || "tuo settore";
};

// Get full sector name for contact messages
export const getSectorName = (sector: string): string => {
  const sectorNames: Record<string, string> = {
    edilizia: "Edilizia",
    alimentare: "Alloggio/Ristorazione",
    manifatturiero: "Manifatturiero",
    servizi: "Servizi",
    commercio: "Commercio",
    agricoltura: "Agricoltura",
    trasporto: "Trasporto/Magazzinaggio"
  };
  return sectorNames[sector] || "Servizi";
};

// Generate dynamic insight using Caples x Sicily approach
export const generateDynamicInsight = (answers: QuizAnswers, violations: Violation[]): DynamicInsight => {
  const managementStyle = answers.gestione as ManagementStyle;
  const sector = answers.settore as Sector;
  const employees = answers.dipendenti;
  
  let urgency: "low" | "medium" | "high" = "low";
  if (violations.length > 3 || employees === ">20") urgency = "high";
  else if (violations.length > 1 || employees === "11-20") urgency = "medium";
  
  if (violations.length === 0) {
    return {
      title: "Sei il tipo che ha tutto sotto controllo",
      text: `Lo sappiamo entrambi: nel settore ${getSectorDisplayName(sector)} sai già che serve stare attenti. Dalle tue risposte non emergono criticità immediate. Continua così, ma tieni d'occhio le scadenze come fai con tutto il resto.`,
      urgency: "low",
      type: "success"
    };
  }
  
  // Recognition patterns based on management style
  const recognitionPatterns = {
    'gestisco-io': {
      recognition: "Sei il tipo che preferisce tenere tutto sotto controllo diretto.",
      problem: `Lo sappiamo entrambi che gestire tutto personalmente ha i suoi vantaggi, ma con ${violations.length} ${violations.length === 1 ? 'area scoperta' : 'aree scoperte'} nel settore ${getSectorDisplayName(sector)} rischi di trovarti impreparato quando suona il campanello.`,
      solution: "Hai bisogno di un sistema che ti dia controllo totale ma senza perdere tempo prezioso."
    },
    'interno': {
      recognition: "Hai ragione a fidarti del tuo team interno.",
      problem: `Ma anche le persone più brave hanno bisogno degli strumenti giusti. Con ${violations.length} ${violations.length === 1 ? 'lacuna emersa' : 'lacune emerse'} nel settore ${getSectorDisplayName(sector)}, il tuo team sta facendo quello che può con quello che ha.`,
      solution: "Serve dare loro gli strumenti per non dover più improvvisare."
    },
    'consulente': {
      recognition: "Sai già che affidarsi a un consulente è la scelta giusta.",
      problem: `Il problema non è il consulente, ma che nemmeno il migliore può coprire tutto. Le ${violations.length} ${violations.length === 1 ? 'lacuna emersa' : 'lacune emerse'} nel settore ${getSectorDisplayName(sector)} sono la prova che servono specialisti dedicati.`,
      solution: "Ti serve chi ha già risolto questi specifici problemi per gente come te."
    },
    'studi-multipli': {
      recognition: "Hai ragione a diversificare i fornitori per non dipendere da uno solo.",
      problem: `Il problema è che senza un coordinamento centrale, nascono buchi come questi ${violations.length} emersi nel settore ${getSectorDisplayName(sector)}. Ognuno fa la sua parte, ma chi tiene insieme il quadro?`,
      solution: "Serve una regia unica che coordini tutto senza sostituire nessuno."
    }
  };
  
  const currentPattern = recognitionPatterns[managementStyle] || recognitionPatterns['gestisco-io'];
  
  return {
    title: currentPattern.recognition,
    text: `${currentPattern.problem} ${currentPattern.solution}`,
    urgency,
    type: "analysis"
  };
};

// Generate personalized advantages based on management style
export const generatePersonalizedAdvantages = (answers: QuizAnswers): string[] => {
  const managementStyle = answers.gestione as ManagementStyle;
  
  const baseAdvantages: Record<ManagementStyle, string[]> = {
    "gestisco-io": [
      "🎯 Mantieni il controllo totale con supporto tecnico invisibile",
      "📱 Piattaforma digitale 24/7 per consultare tutta la documentazione",
      "🔄 Coordinamento automatico figure SPP senza perdere la regia",
      "💰 Accesso esclusivo a fondi interprofessionali e bonus fiscali"
    ],
    "interno": [
      "💪 Potenziamento del team con strumenti professionali",
      "📊 Riduzione 70% carico amministrativo interno",
      "🛡️ Sistema backup: continuità anche in assenza del responsabile",
      "🚀 Risposte prioritarie dalla rete di specialisti certificati"
    ],
    "consulente": [
      "✅ Audit indipendente di copertura del consulente attuale",
      "🤝 Integrazione trasparente o transizione guidata",
      "📈 KPI misurabili per monitorare le prestazioni",
      "⏰ Alert automatici 30-60 giorni prima delle scadenze"
    ],
    "studi-multipli": [
      "🎭 Regia unica per coordinare tutti i fornitori",
      "📋 Monitoraggio centralizzato scadenze e standard",
      "🔗 Eliminazione sovrapposizioni e buchi operativi",
      "📱 Piattaforma digitale 24/7 sempre accessibile"
    ]
  };
  
  let advantages = [...(baseAdvantages[managementStyle] || baseAdvantages["gestisco-io"])];
  
  // Add contextual advantages without duplicates
  const existingTexts = new Set(advantages.map(a => a.trim()));
  
  const additionalAdvantages = [
    "⏰ Alert automatici 30-60 giorni prima delle scadenze",
    "📱 Piattaforma 24/7 sempre accessibile",
    "🚀 Rete specialisti con risposte prioritarie",
    "💰 Accesso a fondi e agevolazioni disponibili"
  ];
  
  additionalAdvantages.forEach(advantage => {
    if (!existingTexts.has(advantage) && advantages.length < 5) {
      advantages.push(advantage);
      existingTexts.add(advantage);
    }
  });
  
  return advantages.slice(0, 5);
};

// Calculate sanction details
export const calculateSanctionDetails = (answers: QuizAnswers, violations: Violation[]) => {
  const noAnswers = Object.values(answers).filter(a => a === "no").length;
  const unsureAnswers = Object.values(answers).filter(a => a === "non-sicuro" || a === "non-gestisco").length;
  const totalQuestions = Object.keys(answers).length;
  
  return {
    violations: violations.length,
    noAnswers,
    unsureAnswers,
    totalAnswered: totalQuestions,
    sanctionBreakdown: violations.map(v => ({
      name: v.text,
      max: v.max
    }))
  };
};