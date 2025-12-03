import React, { useMemo, useEffect, useState, useRef } from "react";
import { Results } from "../components/quiz/Results";
import { calculateRisk, calculateViolations } from "../utils/quiz-helpers";
import { QuizAnswers } from "../types";
import { trackingService } from "../services/TrackingService";

interface QuizData {
  answers: QuizAnswers;
  baseScore: number;
  multiplier: number;
}

const decodeQuizData = (): QuizData | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (!data) return null;
    
    const decoded = atob(data);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding quiz data:", error);
    return null;
  }
};

export const ResultsPage: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = decodeQuizData();
    setQuizData(data);
    setLoading(false);
  }, []);

  const risk = useMemo(() => {
    if (!quizData) return { level: "Basso" as const, finalScore: 0 };
    return calculateRisk(quizData.baseScore, quizData.multiplier);
  }, [quizData]);

  const violations = useMemo(() => {
    if (!quizData) return [];
    return calculateViolations(quizData.answers);
  }, [quizData]);

  // Track results_viewed via postMessage
  const hasTrackedResults = useRef(false);
  useEffect(() => {
    if (quizData && !hasTrackedResults.current) {
      trackingService.trackResultsViewed(
        risk.level,
        risk.finalScore,
        violations.length,
        0, // maxSanction calculated separately in Results component
        quizData.answers.settore || "",
        quizData.answers.gestione || ""
      );
      hasTrackedResults.current = true;
    }
  }, [quizData, risk, violations]);

  const handleReset = () => {
    // Track reset before redirecting
    trackingService.trackQuizReset(risk.level);
    // Redirect back to quiz SPA
    window.location.href = "../domande/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento risultati...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Dati non trovati
          </h1>
          <p className="text-gray-600 mb-6">
            Non è stato possibile recuperare i risultati del quiz. 
            Per favore, completa nuovamente il questionario.
          </p>
          <button
            onClick={handleReset}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Vai al Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="container mx-auto max-w-3xl px-4 py-6 sm:py-8 pb-5 sm:pb-16">
        <Results
          risk={risk}
          violations={violations}
          answers={quizData.answers}
          onReset={handleReset}
        />
      </main>
    </div>
  );
};
