// ==================== CONFIGURATION SERVICE ====================
import { AppConfig, QuizQuestion, Violation, CaseStudy } from '../types';
import { QUIZ_QUESTIONS, VIOLATIONS_CONFIG, CASE_STUDIES } from '../constants/quiz-config';

class ConfigService {
  private static instance: ConfigService;

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getAppConfig(): AppConfig {
    return {
      app: {
        name: "Quiz Sicurezza Lavoro",
        version: "2.0.0", 
        year: 2025
      },
      contact: {
        phone: "0955872480",
        whatsapp: "390955872480"
      },
      legal: {
        disclaimer: "Test basato su D.Lgs. 81/08 aggiornato 2025. Non costituisce consulenza legale."
      },
      psychology: {
        commitmentTriggers: true,
        socialProof: true,
        authorityFraming: true
      }
    };
  }

  public getQuestions(): QuizQuestion[] {
    try {
      return QUIZ_QUESTIONS;
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }

  public getViolations(): Record<string, Violation> {
    try {
      return VIOLATIONS_CONFIG;
    } catch (error) {
      console.error('Error loading violations:', error);
      return {};
    }
  }

  public getCaseStudies(): CaseStudy[] {
    try {
      return CASE_STUDIES;
    } catch (error) {
      console.error('Error loading case studies:', error);
      return [];
    }
  }

  public validateConfig(): boolean {
    const questions = this.getQuestions();
    const violations = this.getViolations();
    
    if (questions.length === 0) {
      console.warn('No questions loaded');
      return false;
    }

    if (Object.keys(violations).length === 0) {
      console.warn('No violations loaded');
      return false;
    }

    // Validate question structure
    for (const question of questions) {
      if (!question.id || !question.title || !question.options || question.options.length === 0) {
        console.error(`Invalid question structure: ${question.id}`);
        return false;
      }
    }

    return true;
  }
}

export const configService = ConfigService.getInstance();