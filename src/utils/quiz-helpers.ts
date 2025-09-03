import { QuizAnswers, QuizQuestion, Risk, Violation, DynamicInsight, ManagementStyle, Sector } from "../types";
import { quizService } from "../services/QuizService";
import { insightService } from "../services/InsightService";
import { configService } from "../services/ConfigService";

// ==================== HELPER FUNCTIONS ====================

// Filter questions based on conditional logic
export const filterQuestions = (answers: QuizAnswers): QuizQuestion[] => {
  return quizService.filterQuestions(answers);
};

// Calculate risk level from score and multiplier
export const calculateRisk = (baseScore: number, multiplier: number): Risk => {
  return quizService.calculateRisk(baseScore, multiplier);
};

// Calculate violations based on answers
export const calculateViolations = (answers: QuizAnswers): Violation[] => {
  return quizService.calculateViolations(answers);
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

// Generate dynamic insight based on context
export const generateDynamicInsight = (answers: QuizAnswers, violations: Violation[]): DynamicInsight => {
  return insightService.generateDynamicInsight(answers, violations);
};

// Calculate sanction details for display
export const calculateSanctionDetails = (answers: QuizAnswers, violations: Violation[]) => {
  return quizService.calculateSanctionDetails(answers, violations);
};