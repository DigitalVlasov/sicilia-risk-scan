// ==================== CORE TYPES ====================
export interface QuizOption {
  value: string;
  label: string;
  weight?: number;
  multiplier?: number;
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  type: "score" | "multiplier";
  options: QuizOption[];
  conditional?: {
    dependsOn: string;
    showFor: string[];
  };
}

export interface QuizAnswers {
  [questionId: string]: string;
}

export interface QuizState {
  stage: "intro" | "quiz" | "loading" | "results";
  currentQuestionIndex: number;
  answers: QuizAnswers;
  baseScore: number;
  multiplier: number;
}

export interface Risk {
  level: "Basso" | "Medio" | "Alto";
  finalScore: number;
}

export interface Violation {
  key: string;
  text: string;
  min: number;
  max: number;
  consequences: string[];
  actions: string[];
  fonte: string;
  priority: {
    order: number;
    urgency: UrgencyLevel;
  };
}

export interface DynamicInsight {
  title: string;
  text: string;
  urgency: "low" | "medium" | "high";
  type: "success" | "analysis";
  benefits?: string[];
}

export interface CaseStudy {
  id: number;
  sector: string;
  title: string;
  situation: string;
  challenge: string;
  solution: string;
  result: string;
  icon: string;
}

// ==================== DOMAIN TYPES ====================
export type ManagementStyle = "gestisco-io" | "interno" | "consulente" | "studi-multipli";
export type Sector = "edilizia" | "manifatturiero" | "alimentare" | "trasporto" | "agricoltura" | "commercio" | "servizi";
export type UrgencyLevel = "CRITICO" | "BLOCCANTE" | "ALTO" | "MEDIO" | "STANDARD" | "SETTORIALE" | "ORGANIZZATIVO";
export type BadgeVariant = "destructive" | "warning" | "success";

// ==================== CONFIG TYPES ====================
export interface AppConfig {
  app: {
    name: string;
    version: string;
    year: number;
  };
  contact: {
    phone: string;
    whatsapp: string;
  };
  legal: {
    disclaimer: string;
  };
  psychology: {
    commitmentTriggers: boolean;
    socialProof: boolean;
    authorityFraming: boolean;
  };
}

// ==================== COMPONENT TYPES ====================
export interface InsightBoxProps {
  insight: DynamicInsight;
  ctaTarget?: string;
}

export interface CaseStudyCarouselProps {
  sector?: Sector;
}

export interface ContactCTAProps {
  risk: Risk;
  sector?: Sector;
}

export interface ResultsProps {
  risk: Risk;
  violations: Violation[];
  answers: QuizAnswers;
  onReset: () => void;
}

// ==================== VALIDATION SCHEMAS ====================
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SanctionDetails {
  violations: number;
  totalAnswered: number;
  sanctionBreakdown: Array<{
    name: string;
    max: number;
  }>;
}