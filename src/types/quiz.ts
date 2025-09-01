// ==================== TYPE DEFINITIONS ====================
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
    urgency: string;
  };
}

export interface DynamicInsight {
  title: string;
  text: string;
  urgency: "low" | "medium" | "high";
  type: "success" | "analysis";
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

export type ManagementStyle = "gestisco-io" | "interno" | "consulente" | "studi-multipli";
export type Sector = "edilizia" | "manifatturiero" | "alimentare" | "trasporto" | "agricoltura" | "commercio" | "servizi";