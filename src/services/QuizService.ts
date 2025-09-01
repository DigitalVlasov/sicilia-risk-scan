// ==================== QUIZ BUSINESS LOGIC SERVICE ====================
import { QuizAnswers, QuizQuestion, Risk, Violation, ValidationResult, SanctionDetails } from '../types';
import { configService } from './ConfigService';

class QuizService {
  private static instance: QuizService;

  public static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  public validateAnswers(answers: QuizAnswers): ValidationResult {
    const errors: string[] = [];

    if (!answers || Object.keys(answers).length === 0) {
      errors.push('Nessuna risposta fornita');
    }

    // Validate required fields
    const requiredFields = ['settore', 'gestione'];
    for (const field of requiredFields) {
      if (!answers[field]) {
        errors.push(`Campo obbligatorio mancante: ${field}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public filterQuestions(answers: QuizAnswers): QuizQuestion[] {
    const allQuestions = configService.getQuestions();
    
    return allQuestions.filter(question => {
      if (!question.conditional) return true;
      
      const { dependsOn, showFor } = question.conditional;
      const dependentAnswer = answers[dependsOn];
      
      // Safe conditional check
      return dependentAnswer && showFor.includes(dependentAnswer);
    });
  }

  public calculateRisk(baseScore: number, multiplier: number): Risk {
    const finalScore = Math.round(baseScore * multiplier);
    
    let level: Risk['level'];
    if (finalScore <= 4) level = "Basso";
    else if (finalScore <= 8) level = "Medio";
    else level = "Alto";

    return { level, finalScore };
  }

  public calculateViolations(answers: QuizAnswers): Violation[] {
    const violations = configService.getViolations();
    const foundViolations: Violation[] = [];

    for (const [key, violation] of Object.entries(violations)) {
      if (this.isViolationTriggered(key, answers)) {
        foundViolations.push(violation);
      }
    }

    // Sort by priority
    return foundViolations.sort((a, b) => a.priority.order - b.priority.order);
  }

  private isViolationTriggered(key: string, answers: QuizAnswers): boolean {
    const answer = answers[key];
    if (!answer) return false;

    // Safe negative answer check
    const negativeAnswers = ["no", "non-sicuro", "non-gestisco", "non-completo"];
    return negativeAnswers.includes(answer);
  }

  public calculateSanctionDetails(answers: QuizAnswers, violations: Violation[]): SanctionDetails {
    const validation = this.validateAnswers(answers);
    if (!validation.isValid) {
      console.warn('Invalid answers for sanction calculation:', validation.errors);
    }

    const totalAnswered = this.filterQuestions(answers).length;
    const sanctionBreakdown = violations.map(v => ({
      name: v.text,
      max: v.max
    }));

    return {
      violations: violations.length,
      totalAnswered,
      sanctionBreakdown
    };
  }

  public generateWhatsAppMessage(answers: QuizAnswers, risk: Risk): string {
    const config = configService.getAppConfig();
    const sector = answers.settore || 'non specificato';
    
    const message = `Ciao Spazio Impresa! Ho completato il test di valutazione sicurezza per la mia azienda.
    
Settore: ${sector}
Livello di rischio rilevato: ${risk.level}
    
Vorrei maggiori informazioni sui vostri servizi per migliorare la conformità normativa.

Grazie!`;

    return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }
}

export const quizService = QuizService.getInstance();